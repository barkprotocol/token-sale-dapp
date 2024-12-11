// Default Next.js configuration
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

// Function to safely load and merge user config if exists
function mergeUserConfig(nextConfig) {
  let userConfig;
  try {
    // Load the user config file dynamically
    userConfig = require('./next.config.js');
  } catch (e) {
    // If user config is missing or an error occurs, log and proceed with default config
    console.error('Error loading user config:', e);
    return nextConfig;
  }

  // Merge the user config into the nextConfig
  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key]) &&
      nextConfig[key] !== null
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }

  return nextConfig;
}

// Merge the user config into the default nextConfig
module.exports = mergeUserConfig(nextConfig);