import Foundation

enum NativePasskeyBridge {
    static let script = """
    (() => {
      window.__WELLECHO_NATIVE_SHELL__ = true;
      const handler = window.webkit?.messageHandlers?.furbyNativePasskey;
      if (!handler || window.furbyNativePasskey) return;
      const callbacks = new Map();
      function jsonClone(value) {
        try {
          return JSON.parse(JSON.stringify(value || {}));
        } catch (_) {
          return {};
        }
      }
      window.__furbyNativePasskeyResolve = (id, ok, payload) => {
        const callback = callbacks.get(id);
        if (!callback) return;
        callbacks.delete(id);
        if (ok) {
          callback.resolve(payload || {});
        } else {
          const message = payload && (payload.message || payload.error) ? (payload.message || payload.error) : "Passkey failed.";
          const error = new Error(message);
          error.payload = payload || {};
          callback.reject(error);
        }
      };
      window.furbyNativePasskey = {
        available: true,
        request(action, payload) {
          const id = `native_passkey_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
          return new Promise((resolve, reject) => {
            callbacks.set(id, { resolve, reject });
            handler.postMessage({ id, action, payload: jsonClone(payload) });
          });
        }
      };
      window.WellEchoNative = window.WellEchoNative || {};
      window.WellEchoNative.__native = true;
      window.WellEchoNative.platform = window.WellEchoNative.platform || "ios";
      window.WellEchoNative.passkey = window.furbyNativePasskey;
      window.dispatchEvent(new CustomEvent("furby-native-passkey-ready"));
      window.dispatchEvent(new CustomEvent("wellecho-native-passkey-ready"));
    })();
    """
}
