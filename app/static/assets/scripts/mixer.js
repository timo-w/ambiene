console.log("Sanity check from mixer.js.");

const sliders = document.getElementsByClassName("slider");
const slider_labels = document.getElementsByClassName("slider-label");
const slider_toggles = document.getElementsByClassName("slider-toggle");
const preset_buttons = document.getElementsByClassName("mixer-preset");

const ambience_presets = [
    {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 50},
    {0: 80, 2: 10},
    {1: 70, 4: 26, 6: 12, 7: 40},
    {2: 42, 3: 90, 5: 20, 7: 28},
    {3: 20, 5: 90, 7: 60},
    {2: 70, 6: 56, 7: 20},
    {0: 64, 1: 4, 3: 5, 5: 15, 7: 56}
];

// Slide volume slider to target
function slideChannel(channelID, target) {
    console.log("slideChannel: sliding " + channelID + " to " + target);
    const channel = sliders[channelID];
    const label = slider_labels[channelID];
    let numberOfTries = 0;
    const slideInterval = setInterval(
        () => {
            if (channel.value % 10 == 0) {
                uiTrack.sound("notch");
            }
            // Prevent from getting stuck
            if (numberOfTries > 100) {
                clearInterval(slideInterval);
            }
            if (channel.value > target) {
                channel.value--;
                channel.style.backgroundColor = "#DDD";
                label.innerHTML = channel.value;
                numberOfTries++;
            } else if (channel.value < target) {
                channel.value++;
                channel.style.backgroundColor = "#DDD";
                label.innerHTML = channel.value;
                numberOfTries++;
            } else {
                channel.style.backgroundColor = "";
                clearInterval(slideInterval);
            }
            $(channel).trigger("input");
        }, 10 // <- delay in ms
    );
}

// Turn on/off tracks (for presets)
function channelOn(channelID) {
    const channelButton = slider_toggles[channelID];
    if (!$(channelButton).hasClass("active")) {
        $(channelButton).addClass("active");
        $(channelButton).text("ON");
    }
}
function channelOff(channelID) {
    const channelButton = slider_toggles[channelID];
    if ($(channelButton).hasClass("active")) {
        $(channelButton).removeClass("active");
        $(channelButton).text("OFF");
    }
}
// Slide channels to preset
function setPreset(state) {
    for (let i=0; i<sliders.length; i++) {
        if (i in state) {
            channelOn(i);
            slideChannel(i, state[i]);
        } else {
            // Reset filter track to 50, rest to 0
            if (i == 7) {
                slideChannel(i, 50);
            } else {
                slideChannel(i, 0);
            }
            channelOff(i);
        }
    }
}


// Trigger input on all sliders to force update
function triggerAmbience() {
    for (let i=0; i<sliders.length; i++) {
        $(sliders.item(i)).trigger("input");
    };
}


$(document).ready(function(){

    // Volume sliders
    for (let i=0; i<sliders.length; i++) {
        sliders.item(i).addEventListener("input", () => {
            slider_labels.item(i).innerHTML = sliders.item(i).value;
            if (sliders.item(i).value % 10 == 0) {
                uiTrack.sound("notch");
            }
            if (sliders.item(i).value % 2 == 0) {
                socket.sendAmbienceSlider(i, sliders.item(i).value);
            }
        });
        $(sliders.item(i)).on("mouseup", function() {
            socket.sendAmbienceSlider(i, sliders.item(i).value);
        });
    };
    // Preset buttons
    for (let i=0; i<preset_buttons.length; i++) {
        $(preset_buttons.item(i)).find("a").on("click", function() {
            socket.sendAmbiencePreset(i);
        });
    };
    // Slider toggles
    for (let i=0; i<slider_toggles.length; i++) {
        $(slider_toggles.item(i)).on("click", function() {
            uiTrack.sound("button");
            socket.sendAmbienceToggle(i, !$(this).hasClass("active"));
        });
    };

    $("#slider-birds").on("input", () => {
        ambienceTrack.setBirds($("#slider-birds").val()/100);
    });
    $("#slider-fire").on("input", () => {
        ambienceTrack.setFire($("#slider-fire").val()/100);
    });
    $("#slider-rain").on("input", () => {
        ambienceTrack.setRain($("#slider-rain").val()/100);
    });
    $("#slider-shop").on("input", () => {
        ambienceTrack.setShop($("#slider-shop").val()/100);
    });
    $("#slider-crickets").on("input", () => {
        ambienceTrack.setCrickets($("#slider-crickets").val()/100);
    });
    $("#slider-harbour").on("input", () => {
        ambienceTrack.setHarbour($("#slider-harbour").val()/100);
    });
    $("#slider-thunder").on("input", () => {
        ambienceTrack.setThunder($("#slider-thunder").val()/100);
    });
    // Toggle mute
    $("#toggle-birds").on("click", () => {
        $("#slider-birds").trigger("input");
    });
    $("#toggle-fire").on("click", () => {
        $("#slider-fire").trigger("input");
    });
    $("#toggle-rain").on("click", () => {
        $("#slider-rain").trigger("input");
    });
    $("#toggle-shop").on("click", () => {
        $("#slider-shop").trigger("input");
    });
    $("#toggle-crickets").on("click", () => {
        $("#slider-crickets").trigger("input");
    });
    $("#toggle-harbour").on("click", () => {
        $("#slider-harbour").trigger("input");
    });
    $("#toggle-thunder").on("click", () => {
        $("#slider-thunder").trigger("input");
    });
    $("#toggle-filter").on("click", () => {
        $("#slider-filter").trigger("input");
    });


});