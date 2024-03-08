let current_page = "ambience";


$(document).ready(function(){

    // Ambience page
    $("#panel-nav-ambience").on( "click", function() {
        
        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "ambience";
        
        $("#panel-nav-ambience").addClass("current-panel").css({"border": "2px solid #39b0f9", "box-shadow": "0px 0px 12px -4px #39b0f9"});
        $("#panel-nav-sequencer").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-instrument").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});

        $("#panel-sequencer").fadeOut(150);
        $("#panel-instrument").fadeOut(150);

        setTimeout(() => {
            $("#panel-mixer").fadeIn(150);
        }, 200);

    });

    // Sequencer page
    $("#panel-nav-sequencer").on( "click", function() {

        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "sequencer";

        $("#panel-nav-ambience").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-sequencer").addClass("current-panel").css({"border": "2px solid #EC5E47", "box-shadow": "0px 0px 12px -4px #EC5E47"});
        $("#panel-nav-instrument").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});

        $("#panel-mixer").fadeOut(150);
        $("#panel-instrument").fadeOut(150);

        setTimeout(() => {
            $("#panel-sequencer").fadeIn(150);
        }, 200);

    });

    // Instrument page
    $("#panel-nav-instrument").on( "click", function() {

        uiTrack.sound("ui");
        uiTrack.sound("click");
        current_page = "instrument";

        $("#panel-nav-ambience").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-sequencer").removeClass("current-panel").css({"border": "none", "box-shadow": "none"});
        $("#panel-nav-instrument").addClass("current-panel").css({"border": "2px solid #81DE53", "box-shadow": "0px 0px 12px -4px #81DE53"});

        $("#panel-mixer").fadeOut(150);
        $("#panel-sequencer").fadeOut(150);

        setTimeout(() => {
            $("#panel-instrument").fadeIn(150);
        }, 200);
        
    });

    // Arrow key/A-D navigation
    $(document).on('keyup', function(event) { 
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
            uiTrack.sound("pipe");
        }
    }); 

});