// Initialise audio elements
const audioContext = new AudioContext();
const audioElement = document.querySelector("#testSound");
const track = audioContext.createMediaElementSource(audioElement);
const testAudioButton = document.querySelector("#testAudio");
track.connect(audioContext.destination);

// test audio button
testAudioButton.addEventListener(
    "click",
    () => {
        // Autoplay
        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
        // Swap play/pause state
        if (testAudioButton.dataset.playing === "false") {
            audioElement.play();
            testAudioButton.dataset.playing = "true";
        } else if (testAudioButton.dataset.playing === "true") {
            audioElement.pause();
            testAudioButton.dataset.playing = "false";
        }
    },
    false,
);
// when audio stopped playing
audioElement.addEventListener(
    "ended",
    () => {
        testAudioButton.dataset.playing = "false";
    },
    false,
);