const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const apiMocKer = require("connect-api-mocker");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode,
  entry: {
    main: "./src/app.js",
    // result: "./src/result.js"
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./dist")
  },
  devServer: {
    // contentBase: 정적파일을 제공할 경로 기본값은 웹팩 아웃풋이다.
    // port: 기본값은 8080
    // historyApiFallBack: spa 개발시 404 발생시 index.html로 리다이렉트해줌
    overlay: true, // 빌드시 에러나 경고를 브라우저 화면에 표시
    stats: "errors-only",
    
    // api 개발자가 서버를 만들어주기전에
    // 임시로 더미데이터를 만들어주는 옵션, 인자로 서버 객체를 받음
    // app : express.js에 서버 인스턴스
    before: app => {
        // api를 만드는 함수
        // app.get("/api/users", (req, res) => {
        //     res.json([
        //         {
        //             id: 1,
        //             name: "Alice"
        //         },
        //         {
        //             id: 2,
        //             name: "Back"
        //         },
        //         {
        //             id: 3,
        //             name: "Chris"
        //         }
        //     ])
        // })
        
        // 데이터를 파일로 따로 관리하거나 데이터가 많이 필요할때 connect-api-mocker 사용
        // /api로 들어오는 요청은 mocks/api로 처리
        app.use(apiMocKer("/api", "mocks/api"));
    },   
        // 만약 api서버가 같은 주소가 아니라면 프론트에서 cors정책을 
        // proxy를 이용하여 밑에처럼 해결할 수 있다.
        // proxy: {
        //      '/api': 'http://localhost:8081,   
        // }
    hot: true // 화면 개발중 일부 모듈만 수정했을시 전체 새로고침을 방지
  },

  // OptimizeCssAssetsWebpackPlugin: css 압축 플러그인 설정
  // TerserWebpackPlugin: 빌드시 debbger, console.log 제거해주는 플러그인
  optimization: {
    minimizer:
      mode === "production" ? [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            drop_console: true // 콘솔 로그를 제거한다.
          }
        }
      })
    ] : [],
    // entry(진입) 포인트가 여러개일 경우 중복되는 코드를 없애고 따로 vender라는 곳에서 중복되는 코드를 관리한다.
    // splitChunks: { 
    //   chunks: "all"
    // }
  },

  // webpack에서 빌드할 필요앖는 라이브러리같은걸 넣어주는 옵션
  // axios같은 경우 이미 node_module에 빌드한 파일이있어 index.html에 복사만 해주면된다.
  // 복사할 때 필요한 플러그인 copy-plugin
  // externals: {
  //   axios: "axios"
  // },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        //   "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]?[hash]",
          limit: 10000,
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `빌드 날짜: ${new Date().toLocaleString()}`
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : ""
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true, // 빈칸 제거
              removeComments: true // 주석 제거
            }
          : false,
      hash: process.env.NODE_ENV === "production"
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : [])
  ]
};
