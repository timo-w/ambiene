console.log("Sanity check from audio.js.");

// Audio tracks
let ambienceTrack;
let uiTrack;
let instrumentTrack;
let sequencerTrack;

// Audio context
const context = new (window.AudioContext || window.webkitAudioContext)();

// Start all tracks
function initialiseAudio() {
    ambienceTrack = new Ambience();
    uiTrack = new UI();
    instrumentTrack = new Instrument();
    sequencerTrack = new Sequencer();
    ambienceTrack.play();
}


// Display overlay in case of suspended context
const overlay = document.getElementById('overlay');
document.addEventListener("click", () => {
    context.resume().then(() => {
        overlay.className = "overlay-hidden";
        initialiseAudio();
        uiTrack.sound("click")
        socket.requestSequencerState();
    });
}, {once: true});


// For audio visualiser
const analyser = context.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);


// Generic web audio api functions
function playSound(buffer, time) {
    let source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source[source.start ? 'start' : 'noteOn'](time);
};

function loadSounds(obj, soundMap, callback) {
    let names = [];
    let paths = [];
    for (let name in soundMap) {
        let path = soundMap[name];
        names.push(name);
        paths.push(path);
    }
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (let i=0; i<bufferList.length; i++) {
            let buffer = bufferList[i];
            let name = names[i];
            obj[name] = buffer;
        }
        if (callback) {
            callback();
        }
    });
    bufferLoader.load();
};


function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function(url, index) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    let loader = this;
    request.onload = function() {
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[index] = buffer;
            if (++loader.loadCount == loader.urlList.length)
                loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }
    request.send();
};
BufferLoader.prototype.load = function() {
    for (let i=0; i<this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
};

function createSource(buffer, doNotAnalyse=false) {
    let source = context.createBufferSource();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setTargetAtTime(20000, context.currentTime, 0);

    source.buffer = buffer;
    source.loop = false;
    source.connect(gainNode);
    gainNode.connect(filter);
    // Don't connect to analyser (UI sounds) for visualisation
    if (doNotAnalyse) {
        filter.connect(context.destination);
    } else {
        filter.connect(analyser);
        analyser.connect(context.destination);
    }

    return {
        source: source,
        gainNode: gainNode,
        filter: filter
    };
};


// Calculate the time until the next second
function timeUntilNextSecond() {
    const now = context.currentTime;
    const delay = Math.ceil(now) - now;
    return delay * 1000; // Convert to milliseconds
};


// Determine type and value of filter (1-100=Lowpass, 100-200=Highpass)
function determineFilter(filterNode, value) {
    if (value >= 0 && value <= 100) {
        filterNode.type = "lowpass";
        value = Math.round(Math.exp(value / 100 * Math.log(20000)) + 99);
        filterNode.frequency.setTargetAtTime(value, context.currentTime, 0);
    } else if (value > 100 && value <= 200) {
        filterNode.type = "highpass";
        value = ((Math.log(value) - Math.log(100)) / (Math.log(200) - Math.log(100))) * Math.log(16000);
        filterNode.frequency.setTargetAtTime(Math.round(Math.exp(value)), context.currentTime, 0);
    } else {
        console.error("Invalid filter value provided");
    }
}


// Generate equal temperament notes list
const range = (start, stop) => Array(stop - start + 1).fill().map((_, i) => start + i);
const octaveRange = range(0, 8).map(val => [val, val - 4]);
const semitoneOffsets = [
    ["C", -9], ["C#", -8], ["Db", -8], ["D", -7], ["D#", -6], ["Eb", -6], ["E", -5], ["F", -4],
    ["F#", -3], ["Gb", -3], ["G", -2], ["G#", -1], ["Ab", -1], ["A", 0], ["A#", 1], ["Bb", 1], ["B", 2],
];
const notes = octaveRange.reduce((ob, [range, multiplier]) => semitoneOffsets.reduce((ob, [note, semitones]) => ({
    ...ob,
    [note + range]: 440 * Math.pow(2, (semitones + (multiplier * 12)) / 12),
}), ob), {});

// Map each note to its offset in cents (100 cents p/ semitone) relative to 440 Hz
const noteCentsOffsets = {};
Object.keys(notes).forEach(note => {
  const frequency = notes[note];
  const centsOffset = 1200 * Math.log2(frequency / 440);
  noteCentsOffsets[note] = centsOffset;
});

// Pentatonic scale
const pentatonic_scale = [
    'C#2', 'D#2', 'F#2', 'G#2', 'A#2', // 0-4
    'C#3', 'D#3', 'F#3', 'G#3', 'A#3', // 5-9
    'C#4', 'D#4', 'F#4', 'G#4', 'A#4', // 10-14
    'C#5', 'D#5', 'F#5', 'G#5', 'A#5', // 15-19
    'C#6', 'D#6', 'F#6', 'G#6', 'A#6', // 20-24
];


// Ambience track
let Ambience = function() {
    loadSounds(this, {
        birds: birdsFile,
        fire: fireFile,
        rain: rainFile,
        shop: shopFile,
        crickets: cricketsFile,
        harbour: harbourFile,
        thunder: thunderFile,
    });
    this.isPlaying = false;
};

Ambience.prototype.play = function() {
    // Create sources
    this.ctlbirds = createSource(this.birds);
    this.ctlfire = createSource(this.fire);
    this.ctlrain = createSource(this.rain);
    this.ctlshop = createSource(this.shop);
    this.ctlcrickets = createSource(this.crickets);
    this.ctlharbour = createSource(this.harbour);
    this.ctlthunder = createSource(this.thunder);
    this.tracks = [this.ctlbirds, this.ctlfire, this.ctlrain, this.ctlshop, this.ctlcrickets, this.ctlharbour, this.ctlthunder];
    // Set initial values
    this.masterVolume = parseInt($("#ambience-master-volume").val()) / 100;
    this.ctlbirds.volume = parseInt($("#slider-birds").val()) / 100;
    this.ctlfire.volume = parseInt($("#slider-fire").val()) / 100;
    this.ctlrain.volume = parseInt($("#slider-rain").val()) / 100;
    this.ctlshop.volume = parseInt($("#slider-shop").val()) / 100;
    this.ctlcrickets.volume = parseInt($("#slider-crickets").val()) / 100;
    this.ctlharbour.volume = parseInt($("#slider-harbour").val()) / 100;
    this.ctlthunder.volume = parseInt($("#slider-thunder").val()) / 100;
    this.setMaster();
    this.setFilter(document.getElementById("slider-filter"));
    // Start playback in a loop
    let onName = this.ctlbirds.source.start ? 'start' : 'noteOn';
    for (let i=0; i<this.tracks.length; i++) {
        this.tracks[i].source.loop = true;
        this.tracks[i].source[onName](0);
    }
};

Ambience.prototype.stop = function() {
    let offName = this.ctlbirds.source.stop ? 'stop' : 'noteOff';
    for (let i=0; i<this.tracks.length; i++) {
        this.tracks[i].source[offName](0);
    }
};

Ambience.prototype.toggle = function() {
    this.isPlaying ? this.stop() : this.play();
    this.isPlaying = !this.isPlaying;
};

Ambience.prototype.setMaster = function() {
    this.masterVolume = parseInt(document.getElementById("ambience-master-volume").value) / 100;
    this.setBirds(parseInt($("#slider-birds").val()) / 100);
    this.setFire(parseInt($("#slider-fire").val()) / 100);
    this.setRain(parseInt($("#slider-rain").val()) / 100);
    this.setShop(parseInt($("#slider-shop").val()) / 100);
    this.setCrickets(parseInt($("#slider-crickets").val()) / 100);
    this.setHarbour(parseInt($("#slider-harbour").val()) / 100);
    this.setThunder(parseInt($("#slider-thunder").val()) / 100);
};
Ambience.prototype.setBirds = function(value) {
    this.ctlbirds.volume = $("#toggle-birds").hasClass("active") ? value : 0;
    this.ctlbirds.gainNode.gain.value = this.ctlbirds.volume * this.masterVolume;
};
Ambience.prototype.setFire = function(value) {
	this.ctlfire.volume = $("#toggle-fire").hasClass("active") ? value : 0;
    this.ctlfire.gainNode.gain.value = this.ctlfire.volume * this.masterVolume;
};
Ambience.prototype.setRain = function(value) {
	this.ctlrain.volume = $("#toggle-rain").hasClass("active") ? value : 0;
    this.ctlrain.gainNode.gain.value = this.ctlrain.volume * this.masterVolume;
};
Ambience.prototype.setShop = function(value) {
	this.ctlshop.volume = $("#toggle-shop").hasClass("active") ? value : 0;
    this.ctlshop.gainNode.gain.value = this.ctlshop.volume * this.masterVolume;
};
Ambience.prototype.setCrickets = function(value) {
	this.ctlcrickets.volume = $("#toggle-crickets").hasClass("active") ? value : 0;
    this.ctlcrickets.gainNode.gain.value = this.ctlcrickets.volume * this.masterVolume;
};
Ambience.prototype.setHarbour = function(value) {
	this.ctlharbour.volume = $("#toggle-harbour").hasClass("active") ? value : 0;
    this.ctlharbour.gainNode.gain.value = this.ctlharbour.volume * this.masterVolume;
};
Ambience.prototype.setThunder = function(value) {
	this.ctlthunder.volume = $("#toggle-thunder").hasClass("active") ? value : 0;
    this.ctlthunder.gainNode.gain.value = this.ctlthunder.volume * this.masterVolume;
};

Ambience.prototype.setFilter = function(element) {
	let filterValue = $("#toggle-filter").hasClass("active") ? parseInt(element.value * 2) : 100;
    determineFilter(this.ctlbirds.filter, filterValue);
    determineFilter(this.ctlfire.filter, filterValue);
    determineFilter(this.ctlrain.filter, filterValue);
    determineFilter(this.ctlshop.filter, filterValue);
    determineFilter(this.ctlcrickets.filter, filterValue);
    determineFilter(this.ctlharbour.filter, filterValue);
    determineFilter(this.ctlthunder.filter, filterValue);
};


// UI track
let UI = function() {
    loadSounds(this, {
        ui: uiFile,
        button: buttonFile,
        notch: notchFile,
        click: clickFile,
        pipe: pipeFile,
    });
    this.muted = false;
};

UI.prototype.sound = function(sound) {
    switch (sound) {
        case "ui":
            this.ctl = createSource(this.ui, doNotAnalyse=true);
            // Pick a note from pentatonic scale
            this.ctl.source.detune.value = noteCentsOffsets[pentatonic_scale[Math.floor(Math.random() * 6) + 6]];
            this.ctl.gainNode.gain.value = 0.8;
            break;
        case "button":
            this.ctl = createSource(this.button, doNotAnalyse=true);
            this.ctl.gainNode.gain.value = 0.8;
            break;
        case "notch":
            this.ctl = createSource(this.notch, doNotAnalyse=true);
            this.ctl.source.detune.value = noteCentsOffsets[pentatonic_scale[17]];
            this.ctl.gainNode.gain.value = 0.3;
            break;
        case "click":
            this.ctl = createSource(this.click, doNotAnalyse=true);
            this.ctl.gainNode.gain.value = 0.7;
            break;
        case "pipe":
            this.ctl = createSource(this.pipe);
            this.ctl.gainNode.gain.value = 5;
            break;
        default:
            console.error('Unknown UI sound provided.');
            break;
    }
    // Don't play if muted
    if (this.muted) {
        this.ctl.gainNode.gain.value = 0;
    }
	let onName = this.ctl.source.start ? 'start' : 'noteOn';
	this.ctl.source[onName](0);
};

// Mute/unmute UI sounds
UI.prototype.mute = function() {
    this.muted = true;
}
UI.prototype.unmute = function() {
    this.muted = false;
}




// Instrument track
let Instrument = function() {
    loadSounds(this, {
        marimba: marimbaFile,
        synth: synthFile,
        flute: fluteFile,
        piano: pianoFile,
        pad: padFile,
    });
};

Instrument.prototype.sound = function(sound, note) {
    let filterValue = 100;
    this.setMaster();
    switch (sound) {
        case "marimba":
            this.ctl = createSource(this.marimba);
            this.ctl.gainNode.gain.value = (parseInt(document.getElementById("marimba-volume").value) / 100) * this.masterVolume;
            filterValue = parseInt(document.getElementById("marimba-filter").value);
            break;
        case "synth":
            this.ctl = createSource(this.synth);
            this.ctl.gainNode.gain.value = (parseInt(document.getElementById("bass-volume").value) / 100) * this.masterVolume;
            filterValue = parseInt(document.getElementById("bass-filter").value);
            break;
        case "flute":
            this.ctl = createSource(this.flute);
            this.ctl.gainNode.gain.value = (parseInt(document.getElementById("flute-volume").value) / 100) * this.masterVolume;
            filterValue = parseInt(document.getElementById("flute-filter").value);
            break;
        case "piano":
            this.ctl = createSource(this.piano);
            this.ctl.gainNode.gain.value = (parseInt(document.getElementById("piano-volume").value) / 100) * this.masterVolume;
            filterValue = parseInt(document.getElementById("piano-filter").value);
            break;
        case "pad":
            this.ctl = createSource(this.pad);
            this.ctl.gainNode.gain.value = (parseInt(document.getElementById("pad-volume").value) / 100) * this.masterVolume;
            filterValue = parseInt(document.getElementById("pad-filter").value);
            break;
        default:
            console.error('Unknown instrument sound provided.');
            break;
    }
    determineFilter(this.ctl.filter, filterValue);
    this.ctl.source.detune.value = noteCentsOffsets[note];
    let onName = this.ctl.source.start ? 'start' : 'noteOn';
    this.ctl.source[onName](0);
};
Instrument.prototype.setMaster = function() {
    this.masterVolume = parseInt(document.getElementById("instrument-master-volume").value) / 100;
}

Instrument.prototype.soundGuitar = function(intensity, density, variation) {
    // Select sample
    let files = {};
    let samples = [];
    let chosen_sample;
    switch (intensity) {
        case "gentle":
            files = guitarFiles["gentle"];
            break;
        case "standard":
            files = guitarFiles["standard"];
            break;
        case "intense":
            files = guitarFiles["intense"];
            break;
    }
    switch (density) {
        case "sparse":
            samples = files["sparse"];
            break;
        case "moderate":
            samples = files["moderate"];
            break;
        case "full":
            samples = files["full"];
            break;
    }
    chosen_sample = samples[variation];
    // Load then play sample
    loadSounds(this, {
        sample: chosen_sample
    });
    this.ctlguitar = createSource(this.sample);
    this.ctlguitar.gainNode.gain.value = (parseInt(document.getElementById("guitar-volume").value) / 100) * (parseInt(document.getElementById("instrument-master-volume").value) / 100);
	let onName = this.ctlguitar.source.start ? 'start' : 'noteOn';
	this.ctlguitar.source[onName](0);
};

Instrument.prototype.setGuitar = function(element) {
    this.ctlguitar.gainNode.gain.value = (parseInt(element.value) / parseInt(element.max)) * (parseInt(document.getElementById("instrument-master-volume").value) / 100);
};


// Sequencer track
let Sequencer = function() {
    loadSounds(this, {
        kick: kickFile,
        snare: snareFile,
        hatClosed: hatClosedFile,
        hatOpen: hatOpenFile,
        clap: clapFile,
        crunch: crunchFile,
        shaker: shakerFile,
        cowbell: cowbellFile
    });
};

Sequencer.prototype.playSound = function(sound) {
    switch (sound) {
        case 0:
            this.ctl = createSource(this.kick);
            break;
        case 1:
            this.ctl = createSource(this.snare);
            break;
        case 2:
            this.ctl = createSource(this.hatClosed);
            break;
        case 3:
            this.ctl = createSource(this.hatOpen);
            break;
        case 4:
            this.ctl = createSource(this.clap);
            break;
        case 5:
            this.ctl = createSource(this.crunch);
            break;
        case 6:
            this.ctl = createSource(this.shaker);
            break;
        case 7:
            this.ctl = createSource(this.cowbell);
            break;
        default:
            console.error('Unknown sequencer sound provided.');
            break;
    }
	this.ctl.gainNode.gain.value = parseInt(document.getElementById("sequencer-master-volume").value) / 100;
    let filterValue = parseInt(document.getElementById("sequencer-filter").value);
    determineFilter(this.ctl.filter, filterValue);
	let onName = this.ctl.source.start ? 'start' : 'noteOn';
	this.ctl.source[onName](0);
};

