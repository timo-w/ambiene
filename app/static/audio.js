// Set up audio context
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

// Play a given audio file at a specified gain
function playAudioFile(audioFilePath, gain) {
  fetchAudio(audioFilePath)
    .then(buffer => {
        playAudio(buffer, gain);
    })
    .catch(error => {
        console.error('Error playing audio file:', error);
    });
}

function stopAudio() {
    ctx.suspend().then(() => {
        ctx.resume();
    });
}
function setVolume(volume) {
    gainNode.gain.value = volume;
}

// Pipe button (test)
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

// Volume test
const volumeNone = document.querySelector("#volumeNone");
volumeNone.addEventListener(
    "click",
    () => {
        setVolume(0);
    }
);
const volumeHalf = document.querySelector("#volumeHalf");
volumeHalf.addEventListener(
    "click",
    () => {
        setVolume(0.5);
    }
);
const volumeFull = document.querySelector("#volumeFull");
volumeFull.addEventListener(
    "click",
    () => {
        setVolume(1);
    }
);

// playAudioFile(ambient_birds, 0);
// playAudioFile(ambient_wind, 0);
// playAudioFile(ambient_rain, 0);
// playAudioFile(ambient_fire, 0);




// List of notes (Frequencies in Hertz)
const treble_notes = [
    277.18, 311.13, 369.99, 415.30, 466.16,
    554.37, 622.25, 739.99, 830.61, 932.33,
    0,0,0,0,0,
];
const bass_notes = [
    69.296, 77.782, 92.499, 103.83, 116.54,
    138.59, 155.56, 185.00, 207.65, 233.08,
    0,0,0,0,0,
];

function playRandomNote(notes, wave_type) {
    // Get a random note from the notes array
    const randomIndex = Math.floor(Math.random() * notes.length);
    const randomNoteFrequency = notes[randomIndex];

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = wave_type;
    oscillator.frequency.setValueAtTime(randomNoteFrequency, ctx.currentTime);

    // Create gain node for the envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.0); // Attack
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.3); // Decay
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2); // Release
    gainNode.gain.value = 0.15;

    // Connect oscillator to gain node and gain node to destination
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start and stop the oscillator to play the note
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2); // note duration
}

// Function to calculate the time until the next second
function timeUntilNextSecond() {
    const now = ctx.currentTime;
    const timeUntilNextSecond = Math.ceil(now) - now + 1;
    return timeUntilNextSecond * 1000; // Convert to milliseconds
}

const randomTrebleNoteButton = document.querySelector("#randomTrebleNoteButton");
randomTrebleNoteButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            setInterval(() => playRandomNote(treble_notes, 'sine'), 200);
            setInterval(() => playRandomNote(treble_notes, 'triangle'), 200);
        }, timeUntilNextSecond());
    }
);

const randomBassNoteButton = document.querySelector("#randomBassNoteButton");
randomBassNoteButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            setInterval(() => playRandomNote(bass_notes, 'square'), 400);
        }, timeUntilNextSecond());
    }
);