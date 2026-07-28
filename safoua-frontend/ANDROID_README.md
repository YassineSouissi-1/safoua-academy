# Safoua Academy — Android app

This project now has a native Android wrapper built with **Capacitor**. It reuses
your existing React/Vite frontend as-is — no rewrite — and packages it into a real
Android app that installs and runs on any phone or tablet (Android 7.0 / API 24+).

## What was added
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` — the native bridge
- `@capacitor/splash-screen`, `@capacitor/status-bar`, `@capacitor/app` — native polish
  (splash screen, dark status bar, Android hardware back-button support)
- `android/` — the full native Android Studio project
- `capacitor.config.json` — native app config (app id, name, colors). Using JSON
  instead of `.ts` on purpose — the `.ts` version hit a TypeScript-loader bug in
  some `@capacitor/cli` setups. JSON works identically and needs no TypeScript.
- `.env.production` — sets `VITE_API_URL=https://safoua-academy.onrender.com`,
  since a device can't reach `localhost:5000` like your dev browser can
- `resources/` — app icon + splash screen source images, generated from your
  existing `favicon-512.png` into every Android density (`android/app/src/main/res`)
- `src/native.js` — hides the splash screen, sets status bar color, and makes the
  Android back button navigate your app's history instead of instantly closing it
- Tablet-responsive fixes in `mobile.css`, `QuranReader.jsx`, `Memorisation.jsx`
  (see "Tablet fixes" section below)
- Fixed a duplicate `style` prop bug in `Home.jsx` that was silently disabling
  the hero section's fade-in animation

## One-time setup on your machine
```bash
npm install
```

## Opening the project in Android Studio
```bash
npx cap open android
```
This launches Android Studio directly on the `android/` folder. Let Gradle sync
(first time takes a few minutes — it downloads the Android Gradle Plugin).

## Every time you change frontend code
Capacitor doesn't watch your React code live — you rebuild the web bundle and
copy it into the native project:
```bash
npm run android:sync
```
This runs `vite build` then `cap sync android`. Do this before every Android
Studio build/run so your latest UI changes are included.

## Running on a device/emulator
- In Android Studio: pick a device (emulator or a phone with USB debugging
  enabled) from the toolbar dropdown and press ▶ Run.
- Or from the CLI once a device is connected: `npx cap run android`

## Building a release APK / AAB (for the Play Store or direct install)
In Android Studio: **Build → Generate Signed App Bundle / APK**. You'll need to
create a signing keystore the first time (Android Studio walks you through it).
Keep that keystore file safe — you need the *same* one for every future update.

## Changing the backend URL later
Edit `.env.production`, then run `npm run android:sync` again. If your backend
ever moves off HTTPS to plain HTTP, you'll also need to allow cleartext traffic
in `android/app/src/main/AndroidManifest.xml` (not recommended — stick to HTTPS).

## Tablet support
No extra work needed — the manifest doesn't restrict screen sizes, so the app
installs on phones and tablets alike. Since your UI is responsive (see
`src/mobile.css`), it will adapt to larger screens the same way it does in a
browser. If you want a distinct tablet layout later, that's a CSS/React
responsive-design task, not an Android configuration one.

## Tablet fixes included
- `mobile.css`: added real breakpoint rules targeting the actual fixed-width
  sidebar grids in `CourseDetail.jsx`, `AlphabetArabe.jsx`,
  `ArabeModerneStandard.jsx`, and `Calligraphy.jsx` — these stack into one
  column below 900px so tablets and phones get a readable layout instead of a
  squeezed desktop one. (The pre-existing `.course-layout`/`.course-sidebar`
  rules in this file were dead code — those class names were never applied to
  any real element.)
- `QuranReader.jsx`: added a 768–1024px tablet range with a narrower sidebar
  (230px instead of the full 280px desktop width) and a wrapping toolbar/
  reciter row instead of the desktop layout being used as-is.
- `Memorisation.jsx`: widened its stacking breakpoint from 760px to 900px so
  portrait tablets get the single-column layout too.

## Regenerating the icon/splash screen
If you replace `public/images/favicon-512.png` with a new logo:
```bash
cp public/images/favicon-512.png resources/icon.png
cp public/images/favicon-512.png resources/icon-foreground.png
npm run android:assets
npm run android:sync
```

## Pushing this to your GitHub repo
The `android/` folder should be committed to your repo just like any other
source folder (it's not a build artifact — Gradle build outputs like `build/`
and `.gradle/` are already covered by the `.gitignore` Capacitor adds inside
`android/`). Just `git add -A && git commit -m "Add Android app (Capacitor)"`
and push as usual.
