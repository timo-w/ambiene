// Generate equal temperament notes list
const range = (start, stop) => Array(stop - start + 1).fill().map((_, i) => start + i);
const octaveRange = range(0, 8).map(val => [val, val - 4]);
const semitoneOffsets = [
    ["C", -9], ["C#", -8], ["Db", -8], ["D", -7], ["D#", -6], ["Eb", -6], ["E", -5], ["F", -4],
    ["F#", -3], ["Gb", -3], ["G", -2], ["G#", -1], ["Ab", -1], ["A", 0], ["A#", 1], ["Bb", 1], ["B", 2],
];
const notes = octaveRange.reduce((ob, [range, multiplier]) => semitoneOffsets.reduce((ob, [note, semitones]) => ({
    ...ob,
    [note + range]: 440 * Math.pow(2, (semitones + (multiplier * 12)) / 12),
}), ob), {});


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
function playAudio(buffer, gain, duration, shift) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.detune.value = shift; // change pitch
    setupAudioNodes(gain);
    source.connect(gainNode);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration);
}

// Play a given audio file at a specified gain
function playAudioFile(audioFilePath, gain=0.5, duration=60, shift=0) {
  fetchAudio(audioFilePath)
    .then(buffer => {
        playAudio(buffer, gain, duration, shift);
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
            message: "PIPE",
        }));
    }
);

// Play on page load
playAudioFile(testAudioFile, 0.3);
//playAudioFile(padAudioFile, 0.8, 200);

// Volume test
// const volumeNone = document.querySelector("#volumeNone");
// volumeNone.addEventListener(
//     "click",
//     () => {
//         setVolume(0);
//     }
// );
// const volumeHalf = document.querySelector("#volumeHalf");
// volumeHalf.addEventListener(
//     "click",
//     () => {
//         setVolume(0.5);
//     }
// );
// const volumeFull = document.querySelector("#volumeFull");
// volumeFull.addEventListener(
//     "click",
//     () => {
//         setVolume(1);
//     }
// );



// Random Bass/Treble notes

const treble_notes = [
    'C4', 'D4', 'F4', 'G4', 'A4',
    'C5', 'D5', 'F5', 'G5', 'A5',
    '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-',
];
const bass_notes = [
    'C2', 'D2', 'F2', 'G2', 'A2',
    'C3', 'D3', 'F3', 'G3', 'A3',
    '-', '-', '-', '-', '-',
];
const arp_notes = [
    'C6', 'D6', 'F6', 'G6', 'A6',
    'C7', 'D7', 'F7', 'G7', 'A7',
    '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-',
    '-', '-', '-', '-', '-',
];

function playRandomNote(notesList, wave) {
    const randomIndex = Math.floor(Math.random() * notesList.length);
    const randomNote = notesList[randomIndex];
    socket.send(JSON.stringify({type: "audio_message", message: {note: randomNote, wave: wave}}));
}

function playNote(note, wave) {

    if (note == '-') {
        return;
    }

    // Create oscillator
    const oscillator = ctx.createOscillator();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(notes[note], ctx.currentTime);

    // Create gain node for the envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
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

let intv1;
let intv2;
let intv3;
let intv4;

// Start/stop random note sequences
const startTrebleButton = document.querySelector("#startTrebleButton");
startTrebleButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            intv1 = setInterval(() => playRandomNote(treble_notes, 'sine'), 200);
            intv2 = setInterval(() => playRandomNote(treble_notes, 'triangle'), 200);
        }, timeUntilNextSecond());
    }
);
const stopTrebleButton = document.querySelector("#stopTrebleButton");
stopTrebleButton.addEventListener(
    "click",
    () => {
        clearInterval(intv1);
        clearInterval(intv2);
    }
);
const startBassButton = document.querySelector("#startBassButton");
startBassButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            intv3 = setInterval(() => playRandomNote(bass_notes, 'square'), 400);
        }, timeUntilNextSecond());
    }
);
const stopBassButton = document.querySelector("#stopBassButton");
stopBassButton.addEventListener(
    "click",
    () => {
        clearInterval(intv3);
    }
);
const startArpButton = document.querySelector("#startArpButton");
startArpButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            intv4 = setInterval(() => playRandomNote(arp_notes, 'sawtooth'), 100);
        }, timeUntilNextSecond());
    }
);
const stopArpButton = document.querySelector("#stopArpButton");
stopArpButton.addEventListener(
    "click",
    () => {
        clearInterval(intv4);
    }
);

// Pad
function randomPad() {
    const detuneList = [0, 200, 500, -500, -300];
    const randomIndex = Math.floor(Math.random() * detuneList.length);
    const detune = detuneList[randomIndex];
    playAudioFile(padAudioFile, 0.5, 4, detune);
}


const padButton = document.querySelector("#padButton");
padButton.addEventListener(
    "click",
    () => {
        setTimeout(() => {
            setInterval(() => {
                randomPad();
            }, 4000);
        }, timeUntilNextSecond());
    }
);


// Test keyboard
document.querySelector("#keyClow").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'C6', wave: 'triangle'}}));
});
document.querySelector("#keyD").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'D6', wave: 'triangle'}}));
});
document.querySelector("#keyE").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'E6', wave: 'triangle'}}));
});
document.querySelector("#keyF").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'F6', wave: 'triangle'}}));
});
document.querySelector("#keyG").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'G6', wave: 'triangle'}}));
});
document.querySelector("#keyA").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'A6', wave: 'triangle'}}));
});
document.querySelector("#keyB").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'B6', wave: 'triangle'}}));
});
document.querySelector("#keyChigh").addEventListener("click", () => {
    socket.send(JSON.stringify({type: "audio_message", message: {note: 'C7', wave: 'triangle'}}));
});