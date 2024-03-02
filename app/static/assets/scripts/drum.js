console.log("Sanity check from drum.js.");

const sequencer_buttons = document.getElementsByClassName("beat");


// Clear sequencer
function resetSequencer() {
    for (let i=0; i<sequencer_buttons.length; i++) {
        $(sequencer_buttons.item(i)).removeClass("active-beat");
    };
}

$(document).ready(function(){


    // Beat buttons
    for (let i=0; i<sequencer_buttons.length; i++) {
        sequencer_buttons.item(i).addEventListener("click", () => {
            $(sequencer_buttons.item(i)).toggleClass("active-beat");
        });
    };


});