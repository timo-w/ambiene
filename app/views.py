from django.shortcuts import render
from app.models import Room

from re import match


def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
        'room1': Room.objects.get(name="roomOne").get_online_count(),
        'room2': Room.objects.get(name="roomTwo").get_online_count(),
        'room3': Room.objects.get(name="roomThree").get_online_count(),
        'room4': Room.objects.get(name="roomFour").get_online_count()
    })

def test_view(request):
    return render(request, 'test-page.html', {})

def room_view(request, room_name):
    # if room name valid
    if match("^[A-Za-z0-9_]*$", room_name):
        chat_room = Room.objects.get(name=room_name)
        return render(request, 'room.html', {
            'room': chat_room,
        })
    # otherwise redirect to home
    else:
        return index_view(request)