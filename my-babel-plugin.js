module.exports = function myBabelPreset() {
    return {
        plugins: [
            '@babel/plugin-transform-block-scoping'
        ]
    }
}