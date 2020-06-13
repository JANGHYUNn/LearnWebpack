import math from './math.js';
import './app.css';
import nyancat from './nyancat.jpg';
import axios from 'axios'
import inputReturn from './input.js';
// import result from './result.js';

let resultEl;
let formEl;
document.addEventListener('DOMContentLoaded', async () => {
    formEl = document.createElement('div');
    formEl.innerHTML = inputReturn.render()
    document.body.appendChild(formEl);

    // 번들 파일 분할 시 멀티 엔트리 포인트를 사용하지않고 바로 import해서 진입점 잡는 코드
    import(/* webpackChunkName: "result" */"./result.js").then(async m => {
        resultEl = document.createElement('div');
        resultEl.innerHTML = await result.render();
        document.body.appendChild(resultEl);
    })

})

// 핫 로딩 설정
// 핫 로딩이 true설정되어있으면 if문 실행
if(module.hot) {
    console.log('핫 모듈 켜짐');

    module.hot.accept("./result", async () => {
        console.log("result 모듈 변경됨");
        resultEl.innerHTML = await result.render();
    })

    module.hot.accept("./input", () => {
        console.log("form 모듈 변경됨");
        formEl.innerHTML = inputReturn.render();
    })
}

