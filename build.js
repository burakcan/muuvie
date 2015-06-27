var path               = require('path');
var webpack            = require('webpack');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var CommonsPlugin      = webpack.optimize.CommonsChunkPlugin;
var DefinePlugin       = webpack.DefinePlugin;
var WebpackDevServer   = require('webpack-dev-server');
var Extend             = require('extend-object');
var __ENV__            = process.env.__ENV__;
var __PORT__           = process.env.PORT;
var __BASE__           = process.env.__BASE__ || '/';

var config             = {
  entry                : {
    main               : './src/index.js'
  },
  output               : {
    path               : path.join(__dirname, 'dist'),
    filename           : '[name].js',
    publicPath         : __BASE__
  },
  plugins              : [
    new HtmlWebpackPlugin({
      title            : ' ',
      template         : path.join(__dirname, 'src/index.html'),
      inject           : true
    }),
    new DefinePlugin({
      __DEV__          : (__ENV__ == 'DEVELOPMENT') ? true : false,
      __PROD__         : (__ENV__ == 'PRODUCTION') ? true : false,
      __BASE__         : __BASE__
    })
  ],
  resolve              : {
    extensions         : ['', '.js', '.css'],
    alias              : {
      'root'           : path.join(__dirname, 'src/'),
      'components'     : path.join(__dirname, 'src/components'),
      'assets'         : path.join(__dirname, 'src/assets'),
      'styles'         : path.join(__dirname, 'src/styles'),
      'pages'          : path.join(__dirname, 'src/components/pages'),
      'stores'         : path.join(__dirname, 'src/stores')
    }
  },
  module               : {
    loaders            : [
      { test: /\.jsx?$/, loaders: ['jsx-loader'], include: path.join(__dirname, 'src') },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
      { test: /\.svg$/, loader: "file" }
    ]
  }
}

if (__ENV__ === 'DEVELOPMENT') {
  Extend(config, {
    devtool              : 'source-map',
  });

  Extend(config.entry, {
    devServer            : 'webpack-dev-server/client?http://localhost:' + __PORT__,
    hot                  : 'webpack/hot/only-dev-server'
  });

  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
} else {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: false,
    mangle: true
  }))
}

var compiler = webpack(config);

if (__ENV__ === 'DEVELOPMENT') {
  var server = new WebpackDevServer(compiler, {
    contentBase          : path.join(__dirname, 'dist'),
    hot                  : true,
    historyApiFallback   : true,
    stats                : {
      colors             : true,
      chunks             : false
    }
  });

  server.listen(__PORT__, 'localhost', function(){
    console.log('Webpack dev server is listening on ' + __PORT__);
  });

} else {
  compiler.run(function(err, stats){
    console.log(stats.toString({
      colors    : true,
      chunks    : false
    }));
  });
}
