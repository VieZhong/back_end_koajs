
function getDrawResult() {
    const names = `龙彦伯、潘玉婷、闫德祥、冯前、张敦锋、陈洪、肖崇中、陈聪、张倩倩、刘奇伟、刘祖华、张志、高士杰、梁增毅、林思辰、赵恢强、张恒杰、唐伏龙、司玮辰、祝文君、钟远维、汪贝贝、陈虹雨`.split('、');
    const num = Math.floor(Math.random() * names.length);
    return names[num];
}

function drawLots() {
    namesContainer.innerHTML = getDrawResult();
}


function beginDrawLots() {
    let time = 100;
    if(handler) {
        clearInterval(handler);
    }
    handler = setInterval(() => {
        drawLots();
    }, time);
    current = 1;
}

function stopDrawLots() {
    if(handler) {
        clearInterval(handler);
    }
    current = 2;
}

function drawAgain() {
    namesContainer.innerHTML = "？";
    current = 0;
}

let handler = null;
let current = 0;
const state = ["点击抽奖", "点击停止", "重新开始"];
const drawBtn = document.getElementById("draw-button");
const namesContainer = document.getElementById("names-container");

drawBtn.addEventListener("click", () => {
    switch(current) {
        case 0:
            beginDrawLots();
            break; 
        case 1: 
            stopDrawLots();
            break;
        case 2:
            drawAgain();
            break;
    }
    drawBtn.innerHTML = state[current];
});


