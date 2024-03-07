console.log("Sanity check from instrument.js.");

let guitar_intensity = 0;
let guitar_density = 1;

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

    // Enable/disable tracks
    $("#guitarTest").click(function() {
        uiTrack.sound("button");
        setTimeout(() => {
            setInterval(nextGuitarSample, 6400);
        }, timeUntilNextSecond());
    });


});