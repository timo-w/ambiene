# Timelog

* AMBIENE
* TIMOTHY WANG
* 2556936
* MATHIEU CHOLLET

## Semester 1 Week 1

### 14 Oct 2023

* *6 hours* Researching frameworks to use, Django Channels with WebSockets as an option for async nature of app

### 15 Oct 2023

* *4 hours* Testing Django Channels, created a sample chat app using channels and WebSockets

### 16 Oct 2023

* *2 hours* Plan a basic proof-of-concept prototype app

### 21 Oct 2023

* *4 hours* Implement accounts system, added functionality to login/register/logout, created new “accounts” application to separate this from main app logic

### 22 Oct 2023

* *1 hour* Validate room page so only 2 people can connect at any time

## Semester 1 Week 2

### 25 Oct 2023

* *1 hour* Add name validation to rooms

## Semester 1 Week 11

### 29 Nov 2023

* *3 hours* Start to implement Web Audio API, begin experimenting with fetching and playing audio files
* *1 hour* Add new socket message type “audio_message” which stores information about an audio event
* *2 hours* Create some basic sound events that are sent over the socket and played synchronously to all connected users
* *4 hours* Add more sound types, basic generated melodies/bass/pad parts using pentatonic scale

## Semester 2 Week 6

### 14 Feb 2024

* *3 hours* Design and create a mixer panel to be used for the ambient sounds mix
* *3 hours* Add toggle button functionality and slider animations using js

## Semester 2 Week 8

### 29 Feb 2024

* *2 hours* Create a test page to start to refactor web audio api usage to use objects as “tracks” with prototype methods
* *3 hours* Added 5 different ambient sounds with ability to mix together using sliders
* *1 hour* Create a UI track to play interface sounds e.g. button clicks
* *4 hours* Combine test page with ambient mixer page, hook up frontend sliders to ambient sounds, toggle buttons not yet working

### 1 Mar 2024

* *1 hour* Add master volume slider to ambience track, add preset slider states

### 2 Mar 2024

* *6 hours* Start to design and implement 16-step sequencer panel in new test page, add 8 drum samples
* *3 hours* Add two instrument samples and begin to implement instrument panel, create scale and note offset table so samples can be detuned to a desired note

## Semester 2 Week 9

### 6 Mar 2024

* *2 hours* Combine test pages for each panel into one page with navigation between panels
* *5 hours* Implement functionality for sequencer, beats now played using a set 200ms (75bpm) interval
* *2 hours* Add a background audio visualiser by connecting an analyser node to the audio context and rendering to an HTML canvas
* *1 hour* Create test page for volume knobs as a slider alternative

### 7 Mar 2024

* *4 hours* Decide on guitar variations (intensity, density) and record 8 midi variations for each combination, 72 total 2-bar samples
* *3 hours* Add guitar instrument to the instrument panel, implement functionality
* *1 hour* Refactor UI track to use a single sound() function with the parameter deciding the sound to play, instead of using separate sound function for each sound
* *1 hour* Design and add initial overlay so user has to click to begin the audio context

### 8 Mar 2024

* *3 hours* Refactor instrument scripts to use a main play() function instead of one for each instrument, combine filter functions into one main function, refactor filters to use exponential scale in frontend
* *1 hour* Experiment with adding adjustable reverb using reverb.js
* *1 hour* Implement functionality to ambience panel toggle buttons
* *4 hours* Add piano and flute instruments with playing rules
* *1 hour* Implement pad instrument, plays one note every 2 bars
* *2 hours* Add master instrument volume slider, keybinds for navigation
* *3 hours* Add 3 more ambient samples, expand mixer to fit new samples
* *1 hour* Add icons to mixer panel, clean up frontend

### 9 Mar 2024

* *1 hour* Add a master startInstruments() function to begin all instruments when the overlay is closed
* *3 hours* Refactor mixer preset and slider implementation, add 7 pre-defined presets
* *2 hours* Create settings menu to turn off audio visualiser and/or UI sounds
* *2 hours* Move master volume sliders to navigation bar, move settings to toggleable menu
* *2 hours* Move ambience presets to panel, move sequencer filter slider to sequencer panel
* *1 hour* Design and create chatbox frontend

### 10 Mar 2024

* *3 hours* Redesign instrument panel frontend
* *2 hours* Add event handlers to change instrument label on slider hover, refactor slider styling to be consistent across site
* *1 hour* Improve instrument slider labels, values now appear on input
* *1 hour* Clean-up frontend to prepare transfer to room page
* *2 hours* Transfer test page to room page, add initial chat functions so chat messages can be sent and received through the socket
* *2 hours* Refactor sequencer state logic, implement improved get and set state functions, create request state function to send message over socket
* *1 hour* Refactor local socket implementation to accept audio messages and parse them using a separate function
* *3 hours* Convert channels consumer from sync to async, make function to send a beat message through the socket every 200ms and get parsed by local scripts
* *1 hour* Convert ambience panel to send and receive socket messages
* *2 hours* Convert instrument panel to send and receive socket messages, remove unused/old files from project
* *2 hours* Implement instrument triggering in backend, instrument trigger messages now sent through socket alongside notes to play, messages parsed locally. App now ready to deploy and test

## Semester 2 Week 10

### 11 Mar 2024

* *2 hour* Research sites to deploy app on, add whitenoise to serve static files
* *4 hours* Attempt to deploy app on fly.io, having difficulties getting websockets to work
* *3 hours* Deploy successfully on fly.io with working websockets - site is quite slow and laggy, too many socket messages, beats are inconsistent
* *2 hours* Begin to optimise app for network latency, start measuring bar durations to keep track of average network lag
* *4 hours* Completely refactor consumers.py beat function to send a pulse at every system second instead of relying on sleeping at intervals (changes app tempo from 75bpm to 60bpm), add functions to locally play instruments one beat of music at a time by receiving information for the next beat
* *1 hour* Re-render guitar samples to new tempo

### 12 Mar 2024

* *3 hours* Add guest account implementation so users don’t need to log in to use site, guests can also use chat

### 17 Mar 2024

* *5 hours* Design and implement new homepage, scrap functions to create new rooms, now using four set rooms
* *2 hours* Add population json to populate database with set 4 rooms
* *2 hours* Update README with installation instructions, add LICENSE to repository
* *3 hours* Add global navigation bar, create about page

## Semester 2 Week 11

### 18 Mar 2024

* *2 hours* Further optimise socket messages, fix user count bug
* *1 hour* More bug fixing, fix duplicate event listener bug
* *1 hour* Adjust responsive layouts so site is more usable on more devices and resolutions
