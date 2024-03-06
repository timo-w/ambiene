console.log("Sanity check from drum.js.");

const sequencer_buttons = document.getElementsByClassName("beat");
const sequencer_label_buttons = document.getElementsByClassName("drum-label");
let sequencer_state = [];
let current_beat = 0;

// Clear sequencer
function resetSequencer() {
    for (let i=0; i<sequencer_buttons.length; i++) {
        $(sequencer_buttons.item(i)).removeClass("active-beat");
    };
    // Update state
    getSequencerState();
}

// Get the sequencer's state
function getSequencerState() {
    const button_obj_array = Array.prototype.slice.call(sequencer_buttons);
    const button_array = button_obj_array.map(function(btn) {
        return {button: btn, active: $(btn).hasClass("active-beat")};
    });
    // Reset and update state
    sequencer_state = [];
    for (let i=0; i<button_array.length; i+=16) {
        sequencer_state.push(button_array.slice(i, i+16));
    }
    return sequencer_state;
}

// Get a list of beat buttons at a specified beat
function getSequencerAt(beat) {
    let beats = [];
    for (let i=0; i<8; i++) {
        beats.push(sequencer_state[i][beat]);
    }
    return beats;
}

// Play the sequencer at the specified beat
function playSequencerAt(beat) {
    let beats = getSequencerAt(parseInt(beat));
    // Clear beat highlight
    for (let i=0; i<sequencer_buttons.length; i++) {
        $(sequencer_buttons[i]).removeClass("current-beat");
    }
    // Set beat highlight
    for (let i=0; i<beats.length; i++) {
        $(beats[i].button).addClass("current-beat");
        // Play sample
        if (beats[i].active && !$(sequencer_label_buttons[i]).hasClass("drum-muted")) {
            sequencerTrack.playSound(i);
        }
    }
}

// Play the next sequencer beat
function playNextBeat() {
    if (current_beat < 15) {
        current_beat++;
    } else {
        current_beat = 0;
    }
    playSequencerAt(current_beat);
}

$(document).ready(function(){

    // Set initial sequencer state on page load
    getSequencerState();
    setInterval(playNextBeat, 200);
    // Track label buttons on click
    for (let i=0; i<sequencer_label_buttons.length; i++) {
        sequencer_label_buttons.item(i).addEventListener("click", () => {
            uiTrack.soundButton();
            $(sequencer_label_buttons.item(i)).toggleClass("drum-muted");
        });
    };
    // Beat button on click
    for (let i=0; i<sequencer_buttons.length; i++) {
        sequencer_buttons.item(i).addEventListener("click", () => {
            uiTrack.soundButton();
            $(sequencer_buttons.item(i)).toggleClass("active-beat");
            getSequencerState();
        });
    };


});