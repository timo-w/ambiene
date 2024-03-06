$(document).ready(function(){

    $("#panel-nav-ambience").on( "click", function() {
        
        uiTrack.soundButton();

        $("#panel-nav-ambience").addClass("current-panel");
        $("#panel-nav-sequencer").removeClass("current-panel");
        $("#panel-nav-instrument").removeClass("current-panel");

        $("#panel-sequencer").fadeOut(200);
        $("#panel-instrument").fadeOut(200);

        setTimeout(() => {
            $("#panel-mixer").fadeIn(200);
        }, 250);

    });

    $("#panel-nav-sequencer").on( "click", function() {

        uiTrack.soundButton();

        $("#panel-nav-ambience").removeClass("current-panel");
        $("#panel-nav-sequencer").addClass("current-panel");
        $("#panel-nav-instrument").removeClass("current-panel");

        $("#panel-mixer").fadeOut(200);
        $("#panel-instrument").fadeOut(200);

        setTimeout(() => {
            $("#panel-sequencer").fadeIn(200);
        }, 250);

    });

    $("#panel-nav-instrument").on( "click", function() {

        uiTrack.soundButton();

        $("#panel-nav-ambience").removeClass("current-panel");
        $("#panel-nav-sequencer").removeClass("current-panel");
        $("#panel-nav-instrument").addClass("current-panel");

        $("#panel-mixer").fadeOut(200);
        $("#panel-sequencer").fadeOut(200);

        setTimeout(() => {
            $("#panel-instrument").fadeIn(200);
        }, 250);
        
    });

});