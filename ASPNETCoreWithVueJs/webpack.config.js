var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

var appBasePath = './Scripts/'; // where the source files located
var publicPath = '../bundle/'; // public path to modify asset urls. eg: '../bundle' => 'www.example.com/bundle/main.js'
var bundleExportPath = './wwwroot/bundle/'; // directory to export build files

var jsEntries = {}; // listing to compile

// We search for js files inside basePath folder and make those as entries
fs.readdirSync(appBasePath).forEach(function (name) {

  // assumption: modules are located in separate directory and each module component is imported to index.js of particular module
  var indexFile = appBasePath + name + '/index.js'
  if (fs.existsSync(indexFile)) {
      jsEntries[name] = indexFile
  }
});

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {
  entry: jsEntries,
  output: {
    path: path.resolve(__dirname, bundleExportPath),
    publicPath: publicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, appBasePath)
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
          }
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  devtool: '#source-map', //'#eval-source-map'
}
module.exports.watch = process.env.WATCH === "true";
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJsPlugin({
      "uglifyOptions":
      {
        compress: {
          warnings: false
        },
        sourceMap: true
      }
    }),
  ]);
}
else if (process.env.NODE_ENV === "dev") {
  module.exports.watch = true;
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
  ]);
}

