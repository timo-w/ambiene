const ctx = new AudioContext();

let gainNode;

function setupAudioNodes(gain) {
    gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.value = gain;
}

function fetchAudio(audioFilePath) {
    return fetch(audioFilePath)
        .then(response => response.arrayBuffer())
        .then(data => ctx.decodeAudioData(data));
}
function playAudio(buffer, gain) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    setupAudioNodes(gain);
    source.connect(gainNode);
    source.start(ctx.currentTime);
}

function playAudioFile(audioFilePath, gain) {
  fetchAudio(audioFilePath)
    .then(buffer => {
        playAudio(buffer, gain);
    })
    .catch(error => {
        console.error('Error playing audio file:', error);
    });
}

const pipeButton = document.querySelector("#pipeButton");
pipeButton.addEventListener(
    "click",
    () => {
        socket.send(JSON.stringify({
            type: "audio_message",
            message: "",
        }));
    }
);

// Play on page load
playAudioFile(testAudioFile, 0.5);