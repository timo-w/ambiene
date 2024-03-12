from django.shortcuts import render
from app.models import Room

from re import match


def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
    })

def test_view(request):
    return render(request, 'test-page.html', {})


def room_view(request, room_name):
    # if room name valid
    if match("^[A-Za-z0-9_]*$", room_name):
        chat_room, created = Room.objects.get_or_create(name=room_name)
        return render(request, 'room.html', {
            'room': chat_room,
        })
    # otherwise redirect to home
    else:
        return render(request, 'index.html', {
            'rooms': Room.objects.all(),
            'error': 'Unable to create room: Invalid name!',
        })