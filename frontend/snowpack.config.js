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
