// Require to use absolute patch using below statment
const path = require("path");
const loader = require("sass-loader");
const TerserPlugin = require("terser-webpack-plugin"); // JS Minify as like uglify
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Extract Css into separate file
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // Clean dir subfolder and files
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Generate html file with updated file resources among with hash
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");

// We need Nodes fs module to read directory contents
const fs = require("fs");

// Process all pug file into HTML Function
let templates = [];
let templateDir = "src";
let files = fs.readdirSync(templateDir);

files.forEach((file) => {
	if (file.match(/\.pug$/)) {
		let filename = file.substring(0, file.length - 4);
		templates.push(
			new HtmlWebpackPlugin({
				template: templateDir + "/" + filename + ".pug",
				filename: filename + ".html",
			})
		);
	}
});

// All module exports here
module.exports = {
	entry: "./src/index.js",

	mode: "development",

	devServer: {
		contentBase: path.join(__dirname, "./dist"),
		compress: true,
		port: 9000,
		open: true,
		// open: "firefox",
	},

	output: {
		filename: "js/bundle.js",

		// path: './dist',
		path: path.resolve(__dirname, "./dist"),

		// publicPath: 'http://domainName.com/',
		publicPath: "",
	},

	module: {
		rules: [
			{
				// test: /\.(png|jpg)$/,
				test: /\.(png|jpe?g|gif|ico)$/i,
				use: [
					{
						loader: "file-loader",
						options: {
							// name: "[path][name].[ext]",
							outputPath: "images",
							name: "[name].[ext]",
						},
					},
				],
			},

			{
				test: /\.css$/,
				use: [
					// 'style-loader', 'css-loader',

					MiniCssExtractPlugin.loader,
					"css-loader",
				],
			},

			{
				test: /\.scss$/,
				use: [
					// Chain of Loaders Invoke RTL direction
					// 'style-loader', 'css-loader', 'sass-loader',

					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						// ES6+ Support
						presets: ["@babel/env"],
						plugins: ["transform-class-properties"],
						// plugins: ['@babel/plugin-proposal-class-properties']
					},
				},
			},

			{
				test: /\.pug$/,
				use: ["pug-loader", "pug-html-loader"],
			},
		],
	},

	plugins: [
		new TerserPlugin(),
		new MiniCssExtractPlugin({
			filename: "css/theme.css",
		}),
		new CleanWebpackPlugin({
			// to remove other dir subfolder and files at once before build
			cleanOnceBeforeBuildPatterns: ["**/*", path.join(process.cwd(), "dist/**/*")],
		}),

		...templates,

		new HtmlWebpackPugPlugin({
			adjustIndent: true,
		}),
	],
};
