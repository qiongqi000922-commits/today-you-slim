import Foundation

enum NativeHealthBridge {
    static let script = """
    (function () {
      window.__WELLECHO_NATIVE_SHELL__ = true;
      if (window.furbyNativeHealth && window.furbyNativeHealth.__native) return;

      var pending = {};
      var nextId = 1;

      function post(action, payload) {
        return new Promise(function (resolve, reject) {
          var id = String(nextId++);
          pending[id] = { resolve: resolve, reject: reject };
          try {
            window.webkit.messageHandlers.furbyNativeHealth.postMessage({
              id: id,
              action: action,
              payload: payload || {}
            });
          } catch (error) {
            delete pending[id];
            reject(error);
          }
        });
      }

      window.__furbyNativeHealthResolve = function (id, ok, value) {
        var item = pending[String(id)];
        if (!item) return;
        delete pending[String(id)];
        if (ok) {
          item.resolve(value);
        } else {
          item.reject(new Error((value && value.error) || "iOS health data unavailable."));
        }
      };

      window.furbyNativeHealth = {
        __native: true,
        readToday: function () {
          return post("readToday", {});
        },
        readRecent: function (days) {
          return post("readRecent", { days: days });
        },
        requestAuthorization: function () {
          return post("requestAuthorization", {});
        }
      };

      window.WellEchoNative = window.WellEchoNative || {};
      window.WellEchoNative.__native = true;
      window.WellEchoNative.platform = window.WellEchoNative.platform || "ios";
      window.WellEchoNative.health = window.furbyNativeHealth;
      window.WellEchoNative.session = window.WellEchoNative.session || {
        post: function (payload) {
          var handler = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.furbyNativeSession;
          if (!handler || typeof handler.postMessage !== "function") return false;
          handler.postMessage(payload || {});
          return true;
        }
      };

      window.dispatchEvent(new Event("furby-native-ready"));
      window.dispatchEvent(new Event("wellecho-native-ready"));
    }());
    """
}
