console.log("Sanity check from visualiser.js.");

const canvas = document.getElementById("visualiser");
const canvasCtx = canvas.getContext("2d");
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
canvasCtx.clearRect(0, 0, windowWidth, windowHeight);

function draw() {
        
    drawVisual = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    // Create gradient
    const grd = canvasCtx.createLinearGradient(0, 0, windowWidth, windowHeight);
    grd.addColorStop(0, "#333");
    grd.addColorStop(1, "#111");
    canvasCtx.fillStyle = grd;
    canvasCtx.fillRect(0, 0, windowWidth, windowHeight);

    if ($("#showVis").is(":checked")) {
        const barWidth = (windowWidth / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] * 5;
            //canvasCtx.fillStyle = `rgb(${barHeight} ${barHeight} ${barHeight})`;
            canvasCtx.fillStyle = `rgba(221,221,221,0.1)`;
            canvasCtx.fillRect(x, windowHeight - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    windowWidth = canvas.width;
    windowHeight = canvas.height;
    draw();
}


window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();
