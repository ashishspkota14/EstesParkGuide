module.exports = ({ config }) => {
  return {
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier: "com.yourname.estespark",
    },
    plugins: [
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsVersion": "10.16.4",
          // Matches your current EAS environment variable exactly
          "RNMapboxMapsDownloadToken": process.env.RNMAPBOX_DOWNLOAD_TOKEN 
        }
      ],
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  };
};