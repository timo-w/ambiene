console.log("Sanity check from mixer.js.");

const ctx = new AudioContext();
const sliders = document.getElementsByClassName("slider");
const slider_labels = document.getElementsByClassName("slider-label");
const slider_toggles = document.getElementsByClassName("slider-toggle");

function fetchAudio(audioFilePath) {
    return fetch(audioFilePath)
        .then(response => response.arrayBuffer())
        .then(data => ctx.decodeAudioData(data));
}

function playAudio(buffer, gain, duration, shift) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.detune.value = shift;
    gainNode = ctx.createGain();
    gainNode.gain.value = gain;
    gainNode.connect(ctx.destination);
    source.connect(gainNode);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration);
}

function playAudioFile(audioFilePath, gain=0.5, duration=10, shift=0) {
  fetchAudio(audioFilePath)
    .then(buffer => {
        playAudio(buffer, gain, duration, shift);
    })
    .catch(error => {
        console.error('Error playing audio file:', error);
    });
}

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
        }, 10 // <- delay in ms
    );
}


$(document).ready(function(){

    // Enable/disable tracks
    $(".channel a").click(function() {
        $(this).toggleClass("active");
        playAudioFile(buttonAudioFile, 0.5, 0.5, -200);
        this.innerHTML = $(this).hasClass("active") ? 'ON' : 'OFF';
    });

    // Volume sliders
    for (let i=0; i<sliders.length; i++) {
        sliders.item(i).addEventListener("input", () => {
            slider_labels.item(i).innerHTML = sliders.item(i).value;
            if (sliders.item(i).value % 10 == 0) {
                playAudioFile(notchAudioFile, 0.3, 0.1, 1600);
            }
        });
    };

    // Reset mixer
    $("#mixer-reset").click(function() {
        playAudioFile(buttonAudioFile, 0.5, 0.5, -200);
        for (let i=0; i<sliders.length; i++) {
            slideChannel(sliders.item(i), slider_labels.item(i), 0);
            $(slider_toggles.item(i)).removeClass("active").text('OFF');
        }


    });

    // Set mixer to preset values
    $("#mixer-preset-1").click(function() {
        playAudioFile(buttonAudioFile, 0.5, 0.5, -200);
        slideChannel(sliders.item(0), slider_labels.item(0), 0);
        $(slider_toggles.item(0)).removeClass("active").text('OFF');
        slideChannel(sliders.item(1), slider_labels.item(1), 100);
        $(slider_toggles.item(1)).addClass("active").text('ON');
        slideChannel(sliders.item(2), slider_labels.item(2), 52);
        $(slider_toggles.item(2)).addClass("active").text('ON');
        slideChannel(sliders.item(3), slider_labels.item(3), 13);
        $(slider_toggles.item(3)).addClass("active").text('ON');
        slideChannel(sliders.item(4), slider_labels.item(4), 86);
        $(slider_toggles.item(4)).addClass("active").text('ON');
    });
    $("#mixer-preset-2").click(function() {
        playAudioFile(buttonAudioFile, 0.5, 0.5, -200);
        slideChannel(sliders.item(0), slider_labels.item(0), 75);
        $(slider_toggles.item(0)).addClass("active").text('ON');
        slideChannel(sliders.item(1), slider_labels.item(1), 0);
        $(slider_toggles.item(1)).removeClass("active").text('OFF');
        slideChannel(sliders.item(2), slider_labels.item(2), 62);
        $(slider_toggles.item(2)).addClass("active").text('ON');
        slideChannel(sliders.item(3), slider_labels.item(3), 93);
        $(slider_toggles.item(3)).addClass("active").text('ON');
        slideChannel(sliders.item(4), slider_labels.item(4), 0);
        $(slider_toggles.item(4)).removeClass("active").text('OFF');
    });
    

});