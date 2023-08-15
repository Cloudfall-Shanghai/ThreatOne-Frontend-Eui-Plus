const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')
module.exports = override(
    addWebpackAlias({
        // 定义@符号
        '@': path.resolve(__dirname, 'src'),
    })
)
