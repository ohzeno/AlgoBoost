const path = require("path");

module.exports = {
  mode: "development",
  // mode: "production",
  devtool: "source-map", // eval()은 CSP 위반이라 source-map을 사용
  entry: {
    // background: "./src/background.ts",
    popup: "./src/popup.ts",
    content: "./src/content.ts",
  },
  output: {
    filename: "[name].js", // [name]은 entry 속성명(content, background, popup)에 따라 동적으로 결정됨
    path: path.resolve(__dirname, "dist/js"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
