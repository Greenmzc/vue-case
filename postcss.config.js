module.exports = {
  parser: require('sugarss'),
  plugins: [
    require('postcss-partial-import')({}),
    require('postcss-mixins')({}),
    require('postcss-advanced-variables')({}),
    require('postcss-nested-ancestors')({}),
    require('postcss-nested')({}),
    require('autoprefixer')({
      browsers: [
        'last 2 versions',
        'iOS >= 8',
        'Android >= 4.3'
      ]
    }),
    require('postcss-sorting')({
      'sort-order': 'default'
    })
  ]
}
