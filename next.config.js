// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['app.uploadcare.com', 'uploadcare.com'],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
};

// Optionally, dynamically load user config if it exists
let userConfig = undefined;
try {
  // The path to the user config file (adjust if needed)
  userConfig = require('./next.config.js');
} catch (e) {
  console.error('Error loading user config:', e);
}

// Merge the user config into the nextConfig
function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) return;

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

mergeConfig(nextConfig, userConfig);

module.exports = nextConfig;
