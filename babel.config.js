module.exports = {
    presets:[
        ['@babel/preset-env', {
            targets: { // 바벨 타겟 브라우저 설정
                chrome: '79', // 버전
                ie: '11'
            },
            // 폴리필 설정
            useBuiltIns: 'usage',
            corejs: {
                version: 2
            }
        }]
    ] 
}