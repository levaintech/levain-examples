const API_ENDPOINT = (() => {
  return 'http://127.0.0.1:3000/api';
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ENDPOINT,
  },
};

module.exports = nextConfig;
