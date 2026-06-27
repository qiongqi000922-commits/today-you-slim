# WellEcho Native Bridge Contract

This document defines the WebView bridge used by WellEcho native shells. The web app must depend on this contract instead of platform-specific APIs.

## Global Marker

Native shells should inject this object before page scripts run:

```js
window.__WELLECHO_NATIVE_SHELL__ = true;
window.WellEchoNative = {
  __native: true,
  platform: "ios", // ios | harmonyos | android | other
};
```

The web app only uses `window.WellEchoNative` for native capabilities. Platform shells may keep internal compatibility helpers, but new web code must not call `window.furbyNative*` directly.

## Face Alignment

The web app calls:

```js
window.WellEchoNative.face.alignPhoto(dataUrl, {
  width,
  height,
  facingMode // user | environment
});
```

The method returns a Promise resolving to:

```json
{
  "ok": true,
  "source": "native-face",
  "platform": "ios",
  "engine": "vision",
  "width": 900,
  "height": 1200,
  "leftEye": { "x": 300, "y": 420 },
  "rightEye": { "x": 600, "y": 420 },
  "featureBox": { "x": 260, "y": 360, "width": 380, "height": 330 },
  "faceBox": { "x": 180, "y": 220, "width": 560, "height": 700 }
}
```

Required fields are `leftEye`, `rightEye`, and one of `featureBox` or `faceBox`. Coordinates are image pixel coordinates after decoding the `dataUrl`, with origin at the top-left corner.

If native detection fails, reject with an error object or resolve `{ "ok": false, "message": "..." }`. The web app will show a retry message.

## Health, Passkey, Location, Session

Native shells should expose these modules when available:

```js
window.WellEchoNative.health.readToday();
window.WellEchoNative.health.readRecent(days);
window.WellEchoNative.health.requestAuthorization();

window.WellEchoNative.passkey.available === true;
window.WellEchoNative.passkey.request("login" | "register", payload);

window.WellEchoNative.location.getCurrentPosition(options);
window.WellEchoNative.location.requestAuthorization();

window.WellEchoNative.session.post({ action, payload, at });
```

If a module is unavailable, omit that module and let the web app report a runtime warning when it needs a fallback.

## Platform Guidance

- iOS should implement `WellEchoNative.face` with Vision face landmarks.
- HarmonyOS should implement the same method with its preferred face/landmark API or bundled model.
- The web app should not branch on iOS/HarmonyOS for face capture; only bridge availability and returned geometry matter.
- Keep native permission prompts request-on-use. Do not ask for camera, location, or health permissions at launch.
