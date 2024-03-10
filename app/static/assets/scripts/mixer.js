console.log("Sanity check from mixer.js.");

const sliders = document.getElementsByClassName("slider");
const slider_labels = document.getElementsByClassName("slider-label");
const slider_toggles = document.getElementsByClassName("slider-toggle");

// Slide volume slider to target
function slideChannel(channelID, target) {
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
        }, 8 // <- delay in ms
    );
}

// Turn on/off tracks (for presets)
function channelOn(channelID, target) {
    const channelButton = slider_toggles[channelID];
    slideChannel(channelID, target);
    if (!$(channelButton).hasClass("active")) {
        $(channelButton).trigger("click");
    }
}
function channelOff(channelID) {
    const channelButton = slider_toggles[channelID];
    // Reset filter track to 50, rest to 0
    if (channelID == 7) {
        slideChannel(channelID, 50);
    } else {
        slideChannel(channelID, 0);
    }
    if ($(channelButton).hasClass("active")) {
        $(channelButton).trigger("click");
    }
}
// Slide channels to preset
function setPreset(state) {
    for (let i=0; i<sliders.length; i++) {
        if (i in state) {
            channelOn(i, state[i]);
        } else {
            channelOff(i);
        }
    }
}


$(document).ready(function(){
    

    // Enable/disable tracks
    $(".channel a").click(function() {
        $(this).toggleClass("active");
        uiTrack.sound("button");
        this.innerHTML = $(this).hasClass("active") ? 'ON' : 'OFF';
    });

    // Volume sliders
    for (let i=0; i<sliders.length; i++) {
        sliders.item(i).addEventListener("input", () => {
            slider_labels.item(i).innerHTML = sliders.item(i).value;
            if (sliders.item(i).value % 10 == 0) {
                uiTrack.sound("notch");
            }
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

    // Reset mixer to default state
    $("#mixer-reset").click(function() {
        setPreset({
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 50
        });
    });

    // Set mixer to preset values
    $("#mixer-preset-1").click(function() {
        setPreset({
            0: 80,
            2: 10,
        });
    });
    $("#mixer-preset-2").click(function() {
        setPreset({
            1: 70,
            4: 26,
            6: 12,
            7: 40,
        });
    });
    $("#mixer-preset-3").click(function() {
        setPreset({
            2: 42,
            3: 90,
            5: 20,
            7: 28,
        });
    });
    $("#mixer-preset-4").click(function() {
        setPreset({
            3: 20,
            5: 90,
            7: 60,
        });
    });
    $("#mixer-preset-5").click(function() {
        setPreset({
            2: 70,
            6: 56,
            7: 20,
        });
    });
    $("#mixer-preset-6").click(function() {
        setPreset({
            0: 64,
            1: 4,
            3: 5,
            5: 15,
            7: 56,
        });
    });

});