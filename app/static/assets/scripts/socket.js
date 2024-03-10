console.log("Sanity check from socket.js.");

const roomName = JSON.parse(document.getElementById('roomName').textContent);
let socket;
let webSocket = null;

let chatLog = document.querySelector("#chatLog");
let chatMessageInput = document.querySelector("#chatMessageInput");
let chatMessageSend = document.querySelector("#chatMessageSend");
let onlineUsersSelector = document.querySelector("#onlineUsersSelector");

// adds a new option to 'onlineUsersSelector'
function onlineUsersSelectorAdd(value) {
    if (document.querySelector("option[value='" + value + "']")) return;
    let newOption = document.createElement("option");
    newOption.value = value;
    newOption.innerHTML = value;
    onlineUsersSelector.appendChild(newOption);
}

// removes an option from 'onlineUsersSelector'
function onlineUsersSelectorRemove(value) {
    let oldOption = document.querySelector("option[value='" + value + "']");
    if (oldOption !== null) oldOption.remove();
}

// submit if the user presses the enter key
chatMessageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter key
        chatMessageSend.click();
    }
};

// clear the 'chatMessageInput' and forward the message
chatMessageSend.onclick = function() {
    if (chatMessageInput.value.length === 0) return;
    webSocket.send(JSON.stringify({
        type: "chat_message",
        message: chatMessageInput.value,
    }));
    chatMessageInput.value = "";
};


// Determine and trigger audio event
function decodeAudioMessage(message) {
    // Don't read messages until user closes overlay
    if (!$(overlay).hasClass("overlay-hidden")) {
        return;
    }
    if (message == "PIPE") {
        uiTrack.sound("pipe");
    }
    switch (message["track"]) {
        case "ambience":
            switch (message["type"]) {
                case "preset":
                    setPreset(ambience_presets[parseInt(message["preset"])]);
                    ambienceTrack.stop();
                    ambienceTrack.play();
                    break;
                case "toggle":
                    if (message["enabled"]) {
                        channelOn(parseInt(message["id"]));
                    } else {
                        channelOff(parseInt(message["id"]));
                    }
                    triggerAmbience();
                    break;
                case "slider":
                    sliders.item(parseInt(message["slider"])).value = parseInt(message["target"]);
                    slider_labels.item(parseInt(message["slider"])).innerHTML = message["target"];
                    break;
            }
            break;
        case "sequencer":
            switch (message["type"]) {
                case "beat":
                    playSequencerAt(message["beat"]);
                    break;
                case "state":
                    setSequencerState(JSON.parse(message["state"]));
                    break;
                case "request":
                    socket.sendSequencerState();
                    break;
            }
            break;
        case "instrument":
            break;
    }
}



// Socket
class Socket {

    connect() {
        webSocket = new WebSocket("ws://" + window.location.host + "/ws/app/" + roomName + "/");
    
        webSocket.onopen = function(e) {
            console.info("Successfully connected to the WebSocket.");
        }
    
        webSocket.onclose = function(e) {
            console.info("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
            setTimeout(function() {
                console.info("Reconnecting...");
                socket.connect();
            }, 2000);
        };
    
        webSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.debug(data);
        
            switch (data.type) {
                case "chat_message":
                    chatLog.value += data.user + ": " + data.message + "\n";
                    break;
                case "user_list":
                    for (let i = 0; i < data.users.length; i++) {
                        onlineUsersSelectorAdd(data.users[i]);
                    }
                    break;
                case "user_join":
                    chatLog.value += data.user + " joined the room.\n";
                    onlineUsersSelectorAdd(data.user);
                    break;
                case "user_leave":
                    chatLog.value += data.user + " left the room.\n";
                    onlineUsersSelectorRemove(data.user);
                    break;
                case "audio_message":
                    decodeAudioMessage(data.message);
                    break;
                default:
                    console.error("Unknown message type!");
                    break;
            }
        
            // scroll 'chatLog' to the bottom
            chatLog.scrollTop = chatLog.scrollHeight;
        };
    
        webSocket.onerror = function(err) {
            console.info("WebSocket encountered an error: " + err.message);
            console.info("Closing the socket.");
            webSocket.close();
        }
    }

    pipe() {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: "PIPE"
        }));
    }

    sendSequencerState() {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: {
                "track": "sequencer",
                "type": "state",
                "state": JSON.stringify(getSequencerState())
            }
        }));
    }
    // Might make a requestState function which requests the entire system state instead
    requestSequencerState() {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: {
                "track": "sequencer",
                "type": "request"
            }
        }));
    }

    sendAmbiencePreset(preset) {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: {
                "track": "ambience",
                "type": "preset",
                "preset": preset
            }
        }));
    }

    sendAmbienceToggle(id, enabled) {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: {
                "track": "ambience",
                "type": "toggle",
                "id": id,
                "enabled": enabled
            }
        }));
    }

    sendAmbienceSlider(slider, target) {
        webSocket.send(JSON.stringify({
            type: "audio_message",
            message: {
                "track": "ambience",
                "type": "slider",
                "slider": slider,
                "target": target
            }
        }));
    }

}


// Initialise socket
socket = new Socket();
socket.connect();