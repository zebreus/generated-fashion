const config = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
    ],
  },
  // webpack: (config, options) => {
  //   config.resolve.fallback = config.resolve.fallback || {}
  //   config.resolve.fallback.stream = "stream-browserify"
  //   config.experiments.syncWebAssembly = true
  //   config.experiments.asyncWebAssembly = true

  //   // if (options.isServer) {
  //   //   config.output.webassemblyModuleFilename =
  //   //     './../static/wasm/[modulehash].wasm';
  //   // } else {
  //   //   config.output.webassemblyModuleFilename =
  //   //     'static/wasm/[modulehash].wasm';
  //   // }

  //   return config
  // },
}

export default config
