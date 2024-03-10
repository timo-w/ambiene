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
// Get predefined note from scale
function getNote(index) {
    return pentatonic_scale[index];
}
// Sound marimba
function soundMarimba(note) {
    const variation = Math.floor(Math.random() * parseInt($("#marimba-density").val()));
    switch (variation) {
        case 0:
            instrumentTrack.sound("marimba", getNote(note));
            break;
    }
}
// Sound synth
function soundSynth(note) {
    instrumentTrack.sound("synth", getNote(note));
}
// Sound flute
function soundFlute(note1, note2) {
    instrumentTrack.sound("flute", getNote(note1));
    instrumentTrack.sound("flute", getNote(note2));
}
// Sound pad
function soundPad(note) {
    instrumentTrack.sound("pad", getNote(note));
}
// Sound piano
function soundPiano(notes) {
    // Pick a random number
    const variation = Math.floor(Math.random() * parseInt($("#piano-density").val()));
    switch (variation) {
        // Play a chord
        case 0:
            instrumentTrack.sound("piano", getNote(notes[0]));
            instrumentTrack.sound("piano", getNote(notes[1]));
            instrumentTrack.sound("piano", getNote(notes[2]));
            break;
        // Play two notes
        case 1:
            instrumentTrack.sound("piano", getNote(notes[3]));
            instrumentTrack.sound("piano", getNote(notes[4]));
            break;
        // Play a single note
        case 2:
            instrumentTrack.sound("piano", getNote(notes[5]));
            break;
        case 3:
            instrumentTrack.sound("piano", getNote(notes[6]));
            break;
        // Play two notes quickly
        case 4:
            instrumentTrack.sound("piano", getNote(notes[7]));
            setTimeout(() => {
                instrumentTrack.sound("piano", getNote(notes[8]));
            }, 200);
        // Otherwise do nothing
    }
}


// Trigger next guitar sample based on sliders
function nextGuitarSample(variation) {
    let intensity;
    let density;
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