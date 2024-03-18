import json
import asyncio
from random import randint
from time import time

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Room, Message


class RoomConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None
        self.online_count = 0

    # User connects to room
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = await sync_to_async(Room.objects.get)(name=self.room_name)
        self.user = self.scope['user']

        self.online_count = await sync_to_async(self.room.get_online_count)()

        # join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # connection has to be accepted
        await self.accept()

        # send the user list asyncronously to the newly joined user
        users = await sync_to_async(list)(self.room.online.all().values_list('username', flat=True))
        await self.send(json.dumps({
            'type': 'user_list',
            'users': users,
        }))

        # send the join event to the room
        if self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            # Update user count
            await sync_to_async(self.room.online.add)(self.user)
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': 'Guest',
                }
            )
        self.online_count += 1
        
        # Initialise beats if only person in room
        if self.online_count == 1:
            asyncio.ensure_future(self.send_beats())


    # User disconnects to room
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        # send the leave event to the room
        if self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            await sync_to_async(self.room.online.remove)(self.user)
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': 'Guest',
                }
            )
            self.online_count -= 1

    # Receive a message from the socket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']

        # check what type of message received
        if message_type == 'chat_message':
            message = text_data_json['message']
            await self.receive_chat_message(message)
        elif message_type == 'audio_message':
            message = text_data_json['message']
            await self.receive_audio_message(message)
        else:
            print(f"RoomConsumer.receive(): Unknown message type {message_type}")
    
    # Send chat message event to room
    async def receive_chat_message(self, message):
        if self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'user': self.user.username,
                    'message': message,
                }
            )
            await sync_to_async(Message.objects.create)(user=self.user, room=self.room, content=message)
        else:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'user': 'Guest',
                    'message': message,
                }
            )

    # Send audio message to room
    async def receive_audio_message(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'audio_message',
                'message': message,
            }
        )

    # Start beat loop in a separate thread until no users are in room
    async def send_beats(self):
        print("consumers.py: BEATS INITIALISED")
        online_count = await sync_to_async(self.room.get_online_count)()
        print("consumers.py: online_count =", self.online_count)
        beat = 0
        measure = 0

        while self.online_count > 0:

            current_time = time()
            time_to_sleep = 1 - (current_time - int(current_time))
            await asyncio.sleep(time_to_sleep)
            
            if beat < 3:
                beat += 1
            else:
                beat = 0
                measure += 1

            # Sequencer
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'user': 'SERVER',
                            'track': 'sequencer',
                            'type': 'beat',
                            'beat': beat
                        },
                    }
            )
            # Flute
            notes = [randint(4, 8), randint(6, 10)]
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'user': 'SERVER',
                            'track': 'instrument',
                            'type': 'instrument',
                            'instrument': 'flute',
                            'notes': notes
                        },
                    }
            )
            # Marimba
            notes = [randint(5, 14), randint(5, 14), randint(5, 14), randint(5, 14)]
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'user': 'SERVER',
                            'track': 'instrument',
                            'type': 'instrument',
                            'instrument': 'marimba',
                            'notes': notes
                        },
                    }
            )
            # Bass synth
            notes = [randint(0, 9), randint(0, 9)]
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'user': 'SERVER',
                            'track': 'instrument',
                            'type': 'instrument',
                            'instrument': 'synth',
                            'notes': notes
                        },
                    }
            )
            # Piano
            notes = [
                randint(0, 9), randint(5, 14), randint(9, 17), randint(6, 10), randint(8, 16), randint(8, 14), randint(10, 16), randint(8, 16), randint(8, 16),
                randint(0, 9), randint(5, 14), randint(9, 17), randint(6, 10), randint(8, 16), randint(8, 14), randint(10, 16), randint(8, 16), randint(8, 16)
                ]
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'user': 'SERVER',
                            'track': 'instrument',
                            'type': 'instrument',
                            'instrument': 'piano',
                            'notes': notes
                        },
                    }
            )
            # Every 2 bars
            if measure % 2 == 0 and beat == 0:
                # Guitar
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'user': 'SERVER',
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'guitar',
                                'variation': randint(0, 7)
                            },
                        }
                )
            # Every bar
            if beat == 0:
                # Pad
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'user': 'SERVER',
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'pad',
                                'note': randint(7, 17)
                            },
                        }
                )

        print("consumers.py: BEATS STOPPED")


    async def chat_message(self, event):
        await self.send(json.dumps(event))

    async def audio_message(self, event):
        await self.send(json.dumps(event))

    async def user_join(self, event):
        await self.send(json.dumps(event))

    async def user_leave(self, event):
        await self.send(json.dumps(event))
