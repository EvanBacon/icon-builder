export default {
  name: "Expo Icon Builder",
  slug: "icon-builder",
  platforms: ["ios", "android", "web"],
  version: "1.0.0",
  primaryColor: "#50E3C2",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "cover",
    backgroundColor: "#50E3C2",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  web: {
    shortName: "Icon Builder",
    favicon: "./assets/favicon.png",
  },
  ios: {
    supportsTablet: true,
  },
};
