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
function soundMarimbaBeat(notes) {
    soundMarimba(notes[0]);
    setTimeout(soundMarimba, 250, notes[1]);
    setTimeout(soundMarimba, 500, notes[2]);
    setTimeout(soundMarimba, 750, notes[3]);
}
// Sound synth
function soundSynth(note) {
    instrumentTrack.sound("synth", getNote(note));
}
function soundSynthBeat(notes) {
    setTimeout(soundSynth, 250, notes[0]);
    setTimeout(soundSynth, 750, notes[1]);
}
// Sound flute
function soundFlute(notes) {
    instrumentTrack.sound("flute", getNote(notes[0]));
    instrumentTrack.sound("flute", getNote(notes[0]));
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
function soundPianoBeat(notes) {
    soundPiano(notes[0]);
    setTimeout(soundPiano, 500, notes[1]);
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
    let hasChanged = false;
    let setText = function(element, value) {
        $(element).parent().parent().parent().find("h1").text(value);
    }
    
    $(instrument_control_sliders.item(i)).find("input").on("input", () => {
        const element = $(instrument_control_sliders.item(i)).find("input");
        const id = element.attr("id");
        const text = id.split("-")[1];
        hasChanged = true;
        
        switch (text) {
            case "volume":
                switch (element.val()) {
                    case '0':
                        setText(element, "Off");
                        break;
                    case '100':
                        setText(element, "Max");
                        break;
                    default:
                        setText(element, (element.val() + "%"));
                        break;
                }
                if (element.val() % 10 == 0) {
                    uiTrack.sound("notch");
                    socket.sendInstrumentSlider(i, element.val());
                }
                break;
            case "filter":
                if (element.val() < 98 && element.val() >= 0) {
                    setText(element, ("LP: " + Math.round(Math.exp(element.val() / 100 * Math.log(20000)) + 99) + "Hz"));
                } else if (element.val() > 102 && element.val() <= 200) {
                    setText(element, ("HP: " + Math.round(Math.exp(((Math.log(element.val()) - Math.log(100)) / (Math.log(200) - Math.log(100))) * Math.log(16000))) + "Hz"));
                } else {
                    setText(element, "None");
                }
                if (element.val() % 20 == 0) {
                    uiTrack.sound("notch");
                }
                if (element.val() % 10 == 0) {
                    socket.sendInstrumentSlider(i, element.val());
                }
                break;
            default:
                uiTrack.sound("notch");
                setText(element, element.val());
                socket.sendInstrumentSlider(i, element.val());
                break;
        }
    });
    $(instrument_control_sliders.item(i).children[0]).hover(
        // Hover on
        function() {
            hasChanged = false;
            const id = $(this).attr("id");
            const text = id.split("-")[1];
            setText($(this), text);
        },
        // Hover off
        function() {
            const id = $(this).attr("id");
            const text = id.split("-")[0];
            $(this).parent().parent().parent().find("h1").text(text);
            if (hasChanged) {
                socket.sendInstrumentSlider(i, $(this).val());
            }
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

});