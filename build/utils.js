var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function(loader) {
      var tempLoader, loaderName
      var loaderOptions = loader.split('?')
      loaderName = loaderOptions[0]
      if (!/-loader/.test(loaderName)) loaderName += '-loader'
      tempLoader = {
        loader: loaderName,
        options: {
          sourceMap: options.sourceMap
        }
      }
      if (loaderOptions.length > 1) {
        tempLoader.options[loaderOptions.pop()] = true
      }
      return tempLoader
    })

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      var extractLoader = sourceLoader.map(function(loader) {
        return loader.loader
      })
      return ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: extractLoader
      })
    } else {
      return [{ loader: 'vue-style-loader' }].concat(sourceLoader)
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css', 'postcss']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    var tempLoader = {}
    tempLoader.test = new RegExp('\\.' + extension + '$')
    options.extract ? (tempLoader.use = loader) : (tempLoader.loader = loader)
    output.push(tempLoader)
  }
  return output
}
