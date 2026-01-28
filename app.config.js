module.exports = ({ config }) => {
  return {
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier: "com.yourname.estespark",
    },
    plugins: [
      ...(config.plugins || []), // This keeps your existing plugins!
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsImpl": "mapbox",
          "RNMapboxMapsDownloadToken": process.env.RNMAPBOX_DOWNLOAD_TOKEN
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static",
            "deploymentTarget": "15.1",
            "newArchEnabled": false
          }
        }
      ]
    ]
  };
};