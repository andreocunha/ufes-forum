const removeImports = require('next-remove-imports')();

module.exports = removeImports({
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'andreoliveiracunha.com.br'],
  },
});


// module.exports = {
//   reactStrictMode: true,
//   env: {
//     API_URL: process.env.API_URL
//   },
//   images: {
//     domains: ['lh3.googleusercontent.com', 'andreoliveiracunha.com.br'],
//   },
// }
