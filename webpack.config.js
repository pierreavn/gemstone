const path = require('path');

module.exports = {
    mode: 'production',
    entry: [
      __dirname + '/src/app.js',
      __dirname + '/src/app.scss',
    ],
    output: {
      path: path.resolve(__dirname, 'dist/javascripts'),
      filename: 'theme.js',
    },
    module: {
      rules: [
        {
          test: /\.hbs$/,
          loader: "handlebars-loader",
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /node_modules/,
          use: [
            // Creates `style` nodes from JS strings
            // "style-loader",
            // Translates CSS into CommonJS
            // "css-loader",
            {
              loader: 'file-loader',
              options: {
                outputPath: '../stylesheets/',
                name: 'application.css',
              }
          },
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
      ],
    },
};
