var webpack = require("webpack"),
	UglifyJsPlugin = require("uglifyjs-webpack-plugin");


function createBanner() {
	return "[name]\n" +
		"<%= pkg.homepage %>\n" +
		"Copyright (c) 2010 - <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
		"Licensed under the <%= pkg.license %> license\n" +
		"Version: <%= pkg.version %>";
}

var rules = {
	js: {
		test: /\.js$/,
		loader: "babel-loader",
		exclude: /(node_modules)/,
		options: {
			presets: ["@babel/preset-env"],
			plugins: ["@babel/plugin-transform-modules-commonjs"],
			passPerPreset: true,
		},
	}
};

module.exports = function (env, argv) {
	var config = {
		name: "main",
		entry: {"dispatcherAsync": "./lib/dispatcherAsync.js"},
		output: {
			path: __dirname + "/dist/",
			filename: "[name].js",
			libraryTarget: "umd"
		},
		externals: {
			"jquery": "jquery",
			"backbone": "backbone",
			"underscore": "underscore",
			"msal": "msal"
		},
		optimization: {
			minimize: env === "production",
			minimizer: [new UglifyJsPlugin({
				include: /\.min\.js$/,
				sourceMap: env !== "production",
				uglifyOptions: {
					warnings: "verbose",
					mangle: false,
					compress: {
						keep_fnames: true,
						unused: false,
						typeofs: false,
						dead_code: false,
						collapse_vars: false
					},
					output: {
						ascii_only: true,
						beautify: false,
						comments: /^!/
					}
				},
				extractComments: false
			}), new UglifyJsPlugin({
				exclude: /\.min\.js$/,
				sourceMap: env !== "production",
				uglifyOptions: {
					warnings: "verbose",
					mangle: false,
					compress: {
						keep_fnames: true,
						unused: false,
						typeofs: false,
						dead_code: false,
						collapse_vars: false
					},
					output: {
						ascii_only: true,
						beautify: true,
						comments: /^!/
					}
				},
				extractComments: false
			})]
		},
		module: {
			rules: [
				rules.js
			]
		},
		devtool: "source-map",
		plugins: [
			new webpack.BannerPlugin({
				banner: createBanner(),
				entryOnly: true
			})
		],
		bail: true,
		mode: env === "production" ? "production" : "none"
	};

	return [config];
};
