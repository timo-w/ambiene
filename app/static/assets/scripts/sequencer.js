console.log("Sanity check from drum.js.");

const sequencer_buttons = document.getElementsByClassName("beat");
const sequencer_label_buttons = document.getElementsByClassName("drum-label");
const sequencer_filter = document.getElementById("sequencer-filter");
let sequencer_state = {
    "tracks": [],
    "buttons": [],
    "filter": 100
};
let current_beat = 0;

// Clear sequencer
function resetSequencer() {
    uiTrack.sound("button");
    state = {
        "tracks": [],
        "buttons": [],
        "filter": 100
    };
    for (let i=0; i<sequencer_label_buttons.length; i++) {
        state["tracks"].push(true);
    }
    for (let i=0; i<sequencer_buttons.length; i++) {
        state["buttons"].push(false);
    }
    setSequencerState(state);
    socket.sendSequencerState();
}

// Get the sequencer's state
function getSequencerState() {
    // Reset and update state
    sequencer_state = {
        "tracks": [],
        "buttons": [],
        "filter": 100
    };
    for (let i=0; i<sequencer_label_buttons.length; i++) {
        sequencer_state["tracks"].push(!$(sequencer_label_buttons.item(i)).hasClass("drum-muted"));
    }
    for (let i=0; i<sequencer_buttons.length; i++) {
        sequencer_state["buttons"].push($(sequencer_buttons.item(i)).hasClass("active-beat"));
    }
    sequencer_state["filter"] = sequencer_filter.value;
    return sequencer_state;
}

// Set the sequencer's state
function setSequencerState(state) {
    for (let i=0; i<sequencer_label_buttons.length; i++) {
        if (state["tracks"][i]) {
            $(sequencer_label_buttons.item(i)).removeClass("drum-muted");
        } else {
            $(sequencer_label_buttons.item(i)).addClass("drum-muted");
        }
    }
    for (let i=0; i<sequencer_buttons.length; i++) {
        if (state["buttons"][i]) {
            $(sequencer_buttons.item(i)).addClass("active-beat");
        } else {
            $(sequencer_buttons.item(i)).removeClass("active-beat");
        }
    }
    sequencer_filter.value = state["filter"];
}

// Get a list of beat buttons at a specified beat
function getSequencerAt(beat) {
    let beats = [];
    for (let i = 0; i < 8; i++) {
        beats.push(i * 16 + beat);
    }
    return beats;
}

// Play the sequencer at the specified sub-beat
function playSequencerAt(beat) {
    let beats = getSequencerAt(parseInt(beat));
    // Clear beat highlight
    for (let i=0; i<sequencer_buttons.length; i++) {
        $(sequencer_buttons[i]).removeClass("current-beat");
    }
    // Set beat highlight
    for (let i=0; i<beats.length; i++) {
        $(sequencer_buttons.item(beats[i])).addClass("current-beat");
        // Play sample
        if ($(sequencer_buttons.item(beats[i])).hasClass("active-beat") && !$(sequencer_label_buttons[i]).hasClass("drum-muted")) {
            sequencerTrack.playSound(i);
        }
    }
}

// Play the sequencer at the specified beat
function playSequencerBeat(beat) {
    playSequencerAt(beat*4);
    setTimeout(playSequencerAt, 250, (beat*4+1));
    setTimeout(playSequencerAt, 500, (beat*4+2));
    setTimeout(playSequencerAt, 750, (beat*4+3));
}


$(document).ready(function(){

    // Track label buttons on click
    for (let i=0; i<sequencer_label_buttons.length; i++) {
        // Left-click - mute/unmute track
        sequencer_label_buttons.item(i).addEventListener("click", () => {
            uiTrack.sound("button");
            $(sequencer_label_buttons.item(i)).toggleClass("drum-muted");
            socket.sendSequencerState();
        });
        // Right-click - test sample
        sequencer_label_buttons.item(i).addEventListener("contextmenu", (event) => {
            event.preventDefault();
            sequencerTrack.playSound(i);
        });
    };
    // Beat button on click
    for (let i=0; i<sequencer_buttons.length; i++) {
        // Left-click - enable beat
        sequencer_buttons.item(i).addEventListener("click", () => {
            uiTrack.sound("button");
            $(sequencer_buttons.item(i)).toggleClass("active-beat");
            socket.sendSequencerState();
        });
        // Right-click - test sample
        sequencer_buttons.item(i).addEventListener("contextmenu", (event) => {
            event.preventDefault();
            sequencerTrack.playSound(Math.floor(i / 16));
        });
    };

    // Set filter label to cutoff frequency
    let sequencerFilterHasChanged = false;
    $("#sequencer-filter").on("input", () => {
        element = $("#sequencer-filter");
        let setText = function(value) {
            $(element).parent().find("a").text(value);
        }
        sequencerFilterHasChanged = true;
        if (element.val() < 98 && element.val() >= 0) {
            setText("LP: " + Math.round(Math.exp(element.val() / 100 * Math.log(20000)) + 99) + "Hz");
        } else if (element.val() > 102 && element.val() <= 200) {
            setText("HP: " + Math.round(Math.exp(((Math.log(element.val()) - Math.log(100)) / (Math.log(200) - Math.log(100))) * Math.log(16000))) + "Hz");
        } else {
            setText("None");
        }
        if (element.val() % 10 == 0) {
            uiTrack.sound("notch");
            socket.sendSequencerState();
        }
    });
    $("#sequencer-filter").hover(
        // Hover on
        function() {
            sequencerFilterHasChanged = false;
        },
        // Hover off
        function() {
            $(this).parent().find("a").text("Filter");
            if (sequencerFilterHasChanged) {
                socket.sendSequencerState();
            }
        }
    );


});