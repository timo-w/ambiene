from django.shortcuts import render
from app.models import Room

from re import match


def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
    })

def test_view(request):
    return render(request, 'test-page.html', {})

def drum_view(request):
    return render(request, 'drum-test.html', {})


def room_view(request, room_name):
    # if room name valid
    if match("^[A-Za-z0-9_]*$", room_name):
        chat_room, created = Room.objects.get_or_create(name=room_name)
        # connect if less than 2 people
        if Room.objects.get_or_create(name=room_name)[0].get_online_count() <= 2:
            return render(request, 'room.html', {
                'room': chat_room,
            })
        else:
            return render(request, 'index.html', {
                'rooms': Room.objects.all(),
                'error': 'Unable to join: This room is full!',
            })
    # otherwise redirect to home
    else:
        return render(request, 'index.html', {
            'rooms': Room.objects.all(),
            'error': 'Unable to create room: Invalid name!',
        })