// tailwind.config.js
module.exports = {
  theme: {
    extend: {},
    screens: {
      'max-md': { 'max': '767px' }, // applies only below 768px
      'max-lg': { 'max': '1023px' }, // below 1024px
    }
  }
}
