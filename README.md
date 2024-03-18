![ambiene-banner](https://github.com/timo-w/dissertation/assets/98108156/f4bc6801-2ca8-4059-919d-d13e2f166a34)

"Ambiene" is my final-year dissertation project.

Play it live at https://ambiene.fly.dev/!

## Demos
Below are some examples of what Ambiene can play:
- ![Example 1](https://github.com/timo-w/ambiene/assets/98108156/ef6b98dd-32c0-4b20-acb8-72d3ad206aee)
- ![Example 2](https://github.com/timo-w/ambiene/assets/98108156/05b64d18-1cd9-4997-912c-f09ef239dcb3)
- ![Example 3](https://github.com/timo-w/ambiene/assets/98108156/e7b46a5b-8a05-4a5d-8fed-6581ccdcebbf)
- ![Example 4](https://github.com/timo-w/ambiene/assets/98108156/585093f4-5718-4266-a9e5-1f255180aa29)


# About
Ambiene is an online music collaboration and creation project. Users can come and make relaxing ambient music together by controlling the many different controls of the app. It is built with Django Channels using WebSockets and is deployed on fly.io.

## Panels
Create a unique sound by mixing three main panels: An ambience mixer, a 16-step sequencer, and a variety of instruments!

### Ambience
Mix together up to 7 samples to create an ambient background, or use the quick presets at the bottom! Use the filter to add a low/high-pass to your mix.

![image](https://github.com/timo-w/dissertation/assets/98108156/24d50cbd-018e-480e-9a0b-95467dcf20f2)


### Sequencer
Sequence 8 sounds over 16 steps to create a drum track! Mute tracks by clicking on their label and add a filter using the slider at the top.

![image](https://github.com/timo-w/dissertation/assets/98108156/2e027e62-6b17-4077-a3e2-28f299ccb8ea)


### Instruments
Add instruments to your mix using the volume sliders. Then, change their sound using the effect sliders such as adding filters or changing the rhythmic density or tonal intensity!

![image](https://github.com/timo-w/dissertation/assets/98108156/846daad0-e70e-414d-bef0-59e77f16e4ef)


# Requirements
- Python 3.10, pip, virtualenv
- A local or remote Redis server


# Installation (Linux)
Follow the steps below to install Ambiene locally.

### Redis Server Setup
- Ensure a Redis server is running either locally or remotely
- Add the Redis URL to `core/settings.py`

### Repo and Environment Setup
Run a new terminal in the directory of your choice, then:
- `git clone https://github.com/timo-w/ambiene.git`
- `cd ambiene`
- `python -m virtualenv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`

### Server Setup
Migrate and populate the database:
- `python manage.py migrate --run-syncdb`
- `python manage.py loaddata rooms.json`

Create a superuser:
- `python manage.py createsuperuser`
- Then follow terminal instructions


### Run Server
- `python manage.py runserver`


Hopefully, you should then be able to use Ambiene by visiting http://127.0.0.1:8000/ on your browser!


# License
Ambiene is licensed under the terms of the MIT license. See more information in the LICENSE file.
