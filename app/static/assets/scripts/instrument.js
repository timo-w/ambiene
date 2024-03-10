console.log("Sanity check from instrument.js.");

let instrument_control_sliders = document.getElementsByClassName("instrument-slider");

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
    const variation = Math.floor(Math.random() * parseInt($("#marimba-density").val()));
    switch (variation) {
        case 0:
            instrumentTrack.sound("marimba", getRandomNote(5,14));
            break;
    }
}
// Sound synth
function soundSynth() {
    instrumentTrack.sound("synth", getRandomNote(0,9));
}
// Sound flute
function soundFlute() {
    let chord = [getRandomNote(6, 10), getRandomNote(4, 8)]
    for (let i=0; i<chord.length; i++) {
        instrumentTrack.sound("flute", chord[i]);
    }  
}
// Sound pad
function soundPad() {
    instrumentTrack.sound("pad", getRandomNote(7,17));
}
// Sound piano
function soundPiano() {
    // Pick a random number
    const variation = Math.floor(Math.random() * parseInt($("#piano-density").val()));
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
    instrumentTrack.soundGuitar(intensity, density, variation);
}


// Start instruments
function startInstruments() {
    setTimeout(() => {
        nextGuitarSample(); setInterval(nextGuitarSample, 6400);
        setInterval(soundMarimba, 200);
        setInterval(soundSynth, 400);
        setInterval(soundFlute, 800);
        setInterval(soundPiano, 400);
        setInterval(soundPad, 6400);
    }, timeUntilNextSecond());
}


// Change label on slider hover/input
for (let i=0; i<instrument_control_sliders.length; i++) {
    $(instrument_control_sliders.item(i).children[0]).hover(

        // Hover on
        function() {
            const id = $(this).attr("id");
            const text = id.split("-")[1];
            let setText = function(element, value) {
                $(element).parent().parent().parent().find("h1").text(value);
            }
            setText($(this), text);
            $(this).on("input", () => {
                switch (text) {
                    case "volume":
                        switch ($(this).val()) {
                            case '0':
                                setText($(this), "Off");
                                break;
                            case '100':
                                setText($(this), "Max");
                                break;
                            default:
                                setText($(this), ($(this).val() + "%"));
                                break;
                        }
                        if ($(this).val() % 10 == 0) {
                            uiTrack.sound("notch");
                        }
                        break;
                    case "filter":
                        if ($(this).val() < 98 && $(this).val() >= 0) {
                            setText($(this), ("LP: " + Math.round(Math.exp($(this).val() / 100 * Math.log(20000)) + 99) + "Hz"));
                        } else if ($(this).val() > 102 && $(this).val() <= 200) {
                            setText($(this), ("HP: " + Math.round(Math.exp(((Math.log($(this).val()) - Math.log(100)) / (Math.log(200) - Math.log(100))) * Math.log(16000))) + "Hz"));
                        } else {
                            setText($(this), "None");
                        }
                        if ($(this).val() % 20 == 0) {
                            uiTrack.sound("notch");
                        }
                        break;
                    default:
                        uiTrack.sound("notch");
                        setText($(this), $(this).val());
                        break;
                }
            });
        },
        // Hover off
        function() {
            const id = $(this).attr("id");
            const text = id.split("-")[0];
            $(this).parent().parent().parent().find("h1").text(text)
        }

    );
};

$(document).ready(function(){

    // Listen to guitar sliders
    document.getElementById("guitar-intensity").addEventListener("input", () => {
        guitar_intensity = document.getElementById("guitar-intensity").value;
    });
    document.getElementById("guitar-density").addEventListener("input", () => {
        guitar_density = document.getElementById("guitar-density").value;
    });

    // All sliders
    for (let i=0; i<instrument_control_sliders.length; i++) {
        $(instrument_control_sliders[i]).on("input", function() {
            let value = $(instrument_control_sliders[i]).find("input").val();
            // if (value % 2 == 0) {
            //     socket.sendInstrumentSlider(i, value);
            // }
            socket.sendInstrumentSlider(i, value);
        });
        // $(sliders.item(i)).on("mouseup", function() {
        //     socket.sendAmbienceSlider(i, sliders.item(i).value);
        // });
    };

});