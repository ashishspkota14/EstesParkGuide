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
      "RNMapboxMapsImpl": "mapbox",
      "RNMapboxMapsVersion": "11.8.0",
      "RNMapboxMapsDownloadToken": process.env.RNMAPBOX_DOWNLOAD_TOKEN || "placeholder"
    }
  ],
  [
    "expo-build-properties",
    {
      "ios": {
        "useFrameworks": "static",
        "deploymentTarget": "15.1",
        "modular_headers": true // <--- Add this line
      }
    }
  ]
]
  };
};