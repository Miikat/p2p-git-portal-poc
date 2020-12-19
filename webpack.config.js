const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sveltePreprocess = require('svelte-preprocess');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: sveltePreprocess({
                            // https://github.com/kaisermann/svelte-preprocess/#user-content-options
                            sourceMap: !prod,
                            postcss: {
                                plugins: [
                                    require("tailwindcss"), 
                                    // require("autoprefixer"),
                                    require("postcss-nesting")
                                ],
                            },
                        })

					}
				}
			},
			{
				test: /\.go/,
				use: [
				  {
					  loader: 'golang-wasm-async-loader2'
				  }
				]
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	node: {
		fs: "empty"
	  },
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
	})
	],
	devtool: '#source-map', // #eval-source-map doesn't emit a map!?
	// devtool: prod ? false: 'source-map'
	target: 'web', // default!
};
