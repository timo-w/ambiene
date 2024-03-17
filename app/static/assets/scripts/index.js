console.log("Sanity check from index.js.");


function setBlue() {
    $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #39b0f9"});
    $(".accent").css({"color": "#39b0f9", "text-shadow": "0px 0px 8px #39b0f9"});
}
function setGreen() {
    $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #EC5E47"});
    $(".accent").css({"color": "#EC5E47", "text-shadow": "0px 0px 8px #EC5E47"});
}
function setRed() {
    $("#panel-base").css({"box-shadow": "0px 0px 24px -4px #81DE53"});
    $(".accent").css({"color": "#81DE53", "text-shadow": "0px 0px 8px #81DE53"});
}
function cycleColours() {
    setGreen();
    setTimeout(setRed, 4000);
    setTimeout(setBlue, 8000);
}

$(document).ready(function(){

    // Cycle panel colours
    cycleColours();
    setInterval(cycleColours, 12000);

    // Room navigation
    $("#room1").on("click", () => {
        window.location.pathname = "app/roomOne/";
    });
    $("#room2").on("click", () => {
        window.location.pathname = "app/roomTwo/";
    });
    $("#room3").on("click", () => {
        window.location.pathname = "app/roomThree/";
    });
    $("#room4").on("click", () => {
        window.location.pathname = "app/roomFour/";
    });

});