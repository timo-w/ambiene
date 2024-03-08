console.log("Sanity check from mixer.js.");

const sliders = document.getElementsByClassName("slider");
const slider_labels = document.getElementsByClassName("slider-label");
const slider_toggles = document.getElementsByClassName("slider-toggle");

// Slide volume slider to target
function slideChannel(channel, label, target) {
    const slideInterval = setInterval(
        () => {
            if (channel.value > target) {
                channel.value--;
                channel.style.backgroundColor = "#DDD";
                label.innerHTML = channel.value;
            } else if (channel.value < target) {
                channel.value++;
                channel.style.backgroundColor = "#DDD";
                label.innerHTML = channel.value;
            } else {
                clearInterval(slideInterval);
                channel.style.backgroundColor = "";
            }
            $(channel).trigger("input");
        }, 10 // <- delay in ms
    );
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
    $("#toggle-crickets").on("click", () => {
        $("#slider-crickets").trigger("input");
    });
    $("#toggle-filter").on("click", () => {
        $("#slider-filter").trigger("input");
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
        uiTrack.sound("button");
        for (let i=0; i<sliders.length-1; i++) {
            slideChannel(sliders.item(i), slider_labels.item(i), 0);
            $(slider_toggles.item(i)).addClass("active").text('ON');
        }
        slideChannel(sliders.item(7), slider_labels.item(7), 50);
        $(slider_toggles.item(7)).addClass("active").text('ON');
    });

    // Set mixer to preset values
    $("#mixer-preset-1").click(function() {
        uiTrack.sound("button");
        slideChannel(sliders.item(0), slider_labels.item(0), 0);
        slideChannel(sliders.item(1), slider_labels.item(1), 100);
        slideChannel(sliders.item(2), slider_labels.item(2), 52);
        slideChannel(sliders.item(3), slider_labels.item(3), 13);
        slideChannel(sliders.item(4), slider_labels.item(4), 86);
    });
    $("#mixer-preset-2").click(function() {
        uiTrack.sound("button");
        slideChannel(sliders.item(0), slider_labels.item(0), 75);
        slideChannel(sliders.item(1), slider_labels.item(1), 0);
        slideChannel(sliders.item(2), slider_labels.item(2), 62);
        slideChannel(sliders.item(3), slider_labels.item(3), 93);
        slideChannel(sliders.item(4), slider_labels.item(4), 0);
    });
    

});