import Foundation

enum NativeLocationBridge {
    static let script = """
    (function () {
      window.__WELLECHO_NATIVE_SHELL__ = true;
      const handler = window.webkit?.messageHandlers?.furbyNativeLocation;
      if (!handler || window.furbyNativeLocation?.__native) return;

      let nextId = 1;
      const pending = {};
      const watches = {};

      function post(action, payload) {
        return new Promise((resolve, reject) => {
          const id = String(nextId++);
          pending[id] = { resolve, reject };
          try {
            handler.postMessage({ id, action, payload: payload || {} });
          } catch (error) {
            delete pending[id];
            reject(error);
          }
        });
      }

      function normalizePosition(value) {
        const coords = value?.coords || {};
        return {
          coords: {
            latitude: Number(coords.latitude),
            longitude: Number(coords.longitude),
            accuracy: Number(coords.accuracy || 0),
            altitude: coords.altitude == null ? null : Number(coords.altitude),
            altitudeAccuracy: coords.altitudeAccuracy == null ? null : Number(coords.altitudeAccuracy),
            heading: coords.heading == null ? null : Number(coords.heading),
            speed: coords.speed == null ? null : Number(coords.speed)
          },
          timestamp: Number(value?.timestamp || Date.now())
        };
      }

      function normalizeError(error) {
        const message = error?.message || error?.error || "Location unavailable.";
        const denied = /denied|permission|权限|未开启/i.test(message);
        return {
          code: denied ? 1 : 2,
          message,
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3
        };
      }

      window.__furbyNativeLocationResolve = function (id, ok, value) {
        const item = pending[String(id)];
        if (!item) return;
        delete pending[String(id)];
        if (ok) {
          item.resolve(value);
        } else {
          item.reject(normalizeError(value));
        }
      };

      const nativeLocation = {
        __native: true,
        requestAuthorization() {
          return post("requestAuthorization", {});
        },
        getCurrentPosition(options) {
          return post("getCurrentPosition", { options: options || {} }).then(normalizePosition);
        }
      };

      window.furbyNativeLocation = nativeLocation;
      window.WellEchoNative = window.WellEchoNative || {};
      window.WellEchoNative.__native = true;
      window.WellEchoNative.platform = window.WellEchoNative.platform || "ios";
      window.WellEchoNative.location = nativeLocation;

      const geolocation = {
        getCurrentPosition(success, error, options) {
          nativeLocation.getCurrentPosition(options).then(
            (position) => {
              if (typeof success === "function") success(position);
            },
            (reason) => {
              if (typeof error === "function") error(normalizeError(reason));
            }
          );
        },
        watchPosition(success, error, options) {
          const watchId = nextId++;
          watches[watchId] = false;
          const intervalMs = Math.max(5000, Number(options?.maximumAge || 10000));
          const tick = () => {
            if (watches[watchId]) return;
            geolocation.getCurrentPosition(success, error, options);
            window.setTimeout(tick, intervalMs);
          };
          tick();
          return watchId;
        },
        clearWatch(watchId) {
          watches[watchId] = true;
        }
      };

      try {
        Object.defineProperty(navigator, "geolocation", {
          configurable: true,
          value: geolocation
        });
      } catch (_) {
        // If WebKit refuses overriding, callers can still use window.furbyNativeLocation.
      }

      window.dispatchEvent(new Event("furby-native-location-ready"));
      window.dispatchEvent(new Event("wellecho-native-location-ready"));
    }());
    """
}
