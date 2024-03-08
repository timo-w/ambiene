console.log("Sanity check from instrument.js.");

let guitar_intensity = 0;
let guitar_density = 1;

// Get a random pentatonic note
function getRandomNote(minIndex, maxIndex) {
    if (minIndex < 0 || maxIndex >= pentatonic_scale.length || minIndex > maxIndex) {
        throw new Error("Invalid index range");
    }
    return pentatonic_scale[Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex];
}
// Sound marimba
function soundMarimba() {
    instrumentTrack.sound("marimba", getRandomNote(5,14));
}
// Sound synth
function soundSynth() {
    instrumentTrack.sound("synth", getRandomNote(0,9));
}
// Sound flute
function soundFlute() {
    let chord = [getRandomNote(9, 15), getRandomNote(14, 18)]
    for (let i=0; i<chord.length; i++) {
        instrumentTrack.sound("flute", chord[i]);
    }  
}
// Sound piano
function soundPiano() {
    // Pick a random number
    let variation = Math.floor(Math.random() * parseInt($("#piano-density").val()));
    switch (variation) {
        // Play a chord
        case 0:
            instrumentTrack.sound("piano", getRandomNote(0, 9));
            instrumentTrack.sound("piano", getRandomNote(5, 14));
            instrumentTrack.sound("piano", getRandomNote(9, 17));
            break;
        // Play two notes
        case 1:
            instrumentTrack.sound("piano", getRandomNote(6, 10));
            instrumentTrack.sound("piano", getRandomNote(8, 16));
            break;
        // Play a single note
        case 2:
            instrumentTrack.sound("piano", getRandomNote(8, 14));
            break;
        case 3:
            instrumentTrack.sound("piano", getRandomNote(10, 16));
            break;
        // Play two notes quickly
        case 4:
            instrumentTrack.sound("piano", getRandomNote(8, 16));
            setTimeout(() => {
                instrumentTrack.sound("piano", getRandomNote(8, 16));
            }, 200);
        // Otherwise do nothing
    }
}


// Trigger next guitar sample based on sliders
function nextGuitarSample() {
    let intensity;
    let density;
    let variation = Math.floor(Math.random() * 8); // random from 8 samples
    switch (parseInt(guitar_intensity)) {
        case 0:
            intensity = "gentle";
            break;
        case 1:
            intensity = "standard";
            break;
        case 2:
            intensity = "intense";
            break;
    }
    switch (parseInt(guitar_density)) {
        case 0:
            density = "sparse";
            break;
        case 1:
            density = "moderate";
            break;
        case 2:
            density = "full";
            break;
    }
    console.log("Guitar: " + intensity + "/" + density + " " + (variation+1));
    instrumentTrack.soundGuitar(intensity, density, variation);
}


$(document).ready(function(){

    // Listen to guitar sliders
    document.getElementById("guitar-intensity").addEventListener("input", () => {
        guitar_intensity = document.getElementById("guitar-intensity").value;
    });
    document.getElementById("guitar-density").addEventListener("input", () => {
        guitar_density = document.getElementById("guitar-density").value;
    });

    // Start guitar
    $("#guitarTest").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            nextGuitarSample();
            setInterval(nextGuitarSample, 6400);
        }, timeUntilNextSecond());
    });

    // Start marimba
    $("#marimba").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            soundMarimba();
            setInterval(soundMarimba, 200);
        }, timeUntilNextSecond());
    });

    // Start synth
    $("#synth").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            soundSynth();
            setInterval(soundSynth, 400);
        }, timeUntilNextSecond());
    });

    // Start flute
    $("#flute").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            soundFlute();
            setInterval(soundFlute, 800);
        }, timeUntilNextSecond());
    });

    // Start piano
    $("#piano").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            soundPiano();
            setInterval(soundPiano, 400);
        }, timeUntilNextSecond());
    });


});