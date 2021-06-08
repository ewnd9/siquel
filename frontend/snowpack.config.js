/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    output: 'stream', // dont clear terminal
    open: 'none',
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    /* ... */
  },
  alias: {
    /* ... */
  },
  proxy: {
    '/socket.io': {
      target: 'http://localhost:3000/',
      ws: true,
    },
    '/api': {
      target: 'http://localhost:3000/',
    },
    '/static': {
      target: 'http://localhost:3000/',
    },
  },
};
