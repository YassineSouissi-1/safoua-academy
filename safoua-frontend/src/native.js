// native.js — wires up Capacitor native behavior (splash screen, status bar,
// hardware back button) when the app is running inside the Android shell.
// On the web this file does nothing.
import { Capacitor } from '@capacitor/core';

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch (e) {
    // splash screen plugin optional, ignore if unavailable
  }

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Reserve space for the status bar instead of letting the webview
    // draw underneath it — this is what was causing the navbar to be
    // cut off / hidden behind the clock and battery icons.
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#080b0f' });
  } catch (e) {
    // status bar plugin optional, ignore if unavailable
  }

  try {
    const { App } = await import('@capacitor/app');
    App.addListener('backButton', () => {
      // Go back in the SPA history instead of instantly closing the app.
      if (window.history.length > 1) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch (e) {
    // app plugin optional, ignore if unavailable
  }
}
