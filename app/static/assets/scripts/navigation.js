let current_page = "ambience";

const masterSliders = document.getElementsByClassName("master-slider");

// Disable right-click menu
document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

$(document).ready(function(){

    // Set ambience as initial page
    $("#panel-nav-ambience").addClass("current-panel").css({"border": "2px solid #39b0f9", "box-shadow": "0px 0px 12px -4px #39b0f9"});
    $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #39b0f9"});

    // Ambience page
    $("#panel-nav-ambience").on("click", function() {
        
        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "ambience";
        
        $("#panel-nav-ambience").addClass("current-panel").css({"border": "2px solid #39b0f9", "box-shadow": "0px 0px 12px -4px #39b0f9"});
        $("#panel-nav-sequencer").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-instrument").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #39b0f9"});

        $("#panel-sequencer").fadeOut(150);
        $("#panel-instrument").fadeOut(150);

        setTimeout(() => {
            $("#panel-mixer").fadeIn(150);
        }, 200);

    });

    // Sequencer page
    $("#panel-nav-sequencer").on("click", function() {

        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "sequencer";

        $("#panel-nav-ambience").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-sequencer").addClass("current-panel").css({"border": "2px solid #EC5E47", "box-shadow": "0px 0px 12px -4px #EC5E47"});
        $("#panel-nav-instrument").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #EC5E47"});

        $("#panel-mixer").fadeOut(150);
        $("#panel-instrument").fadeOut(150);

        setTimeout(() => {
            $("#panel-sequencer").fadeIn(150);
        }, 200);

    });

    // Instrument page
    $("#panel-nav-instrument").on("click", function() {

        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "instrument";

        $("#panel-nav-ambience").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-sequencer").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-instrument").addClass("current-panel").css({"border": "2px solid #81DE53", "box-shadow": "0px 0px 12px -4px #81DE53"});
        $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #81DE53"});

        $("#panel-mixer").fadeOut(150);
        $("#panel-sequencer").fadeOut(150);

        setTimeout(() => {
            $("#panel-instrument").fadeIn(150);
        }, 200);
        
    });

    // Arrow key/A-D navigation
    $(document).on('keyup', function(event) {
        // Ignore if user is typing in chat box
        if (document.activeElement.nodeName == 'INPUT') {
            return;
        }
        if (event.key == "ArrowLeft" || event.key == "a") { 
            switch (current_page) {
                case "sequencer":
                    $("#panel-nav-ambience").trigger("click");
                    break;
                case "instrument":
                    $("#panel-nav-sequencer").trigger("click");
                    break;
                default:
                    uiTrack.sound("click");
                    break;
            }
        } else if (event.key == "ArrowRight" || event.key == "d") {
            switch (current_page) {
                case "ambience":
                    $("#panel-nav-sequencer").trigger("click");
                    break;
                case "sequencer":
                    $("#panel-nav-instrument").trigger("click");
                    break;
                default:
                    uiTrack.sound("click");
                    break;
            }
        } else if (event.key == "|") {
            socket.pipe();
        }
    });


    // Master volume sliders
    for (let i=0; i<masterSliders.length; i++) {
        masterSliders.item(i).addEventListener("input", () => {
            if (masterSliders.item(i).value % 10 == 0) {
                uiTrack.sound("notch");
            }
        });
    };


    // Settings menu
    $("#settingsIcon").on("click", function() {
        uiTrack.sound("click");
        $("#settings").fadeIn(200);
        $("#chat").hide();
    });
    $("#closeSettings").on("click", function() {
        uiTrack.sound("click");
        $("#settings").fadeOut(200);
    });
    $("#muteUI").on("click", function() {
        if ($(this).is(":checked")) {
            uiTrack.unmute();
            uiTrack.sound("click");
        } else {
            uiTrack.mute();
        }
    });
    $("#showVis").on("click", function() {
        uiTrack.sound("click");
    });

    // Chat box
    $("#chatIcon").on("click", function() {
        uiTrack.sound("click");
        $("#chat").fadeIn(200);
        $("#settings").hide();
    });
    $("#closeChat").on("click", function() {
        uiTrack.sound("click");
        $("#chat").fadeOut(200);
    });


});