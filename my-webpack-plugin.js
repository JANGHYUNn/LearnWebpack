class MyWebpackPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('My Plugin', stats => {
            console.log("MyPlugin: done");
        })
    }
}

module.exports = MyWebpackPlugin;