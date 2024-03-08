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
            setInterval(nextGuitarSample, 6400);
        }, timeUntilNextSecond());
    });

    // Start marimba
    $("#marimba").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            setInterval(soundMarimba, 200);
        }, timeUntilNextSecond());
    });

    // Start synth
    $("#synth").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            setInterval(soundSynth, 400);
        }, timeUntilNextSecond());
    });


});