module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Das Expo Preset, ABER hier konfigurieren wir NativeWind mit:
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    // Kein Reanimated-Plugin von Hand: seit Reanimated 4 heisst es
    // react-native-worklets/plugin und babel-preset-expo traegt es selbst ein.
    // Der alte manuelle Eintrag "react-native-reanimated/plugin" liess
    // Animationen stumm fehlschlagen.
  };
};
