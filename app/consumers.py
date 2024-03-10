import json
import asyncio
from random import randint

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

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.room = await sync_to_async(Room.objects.get)(name=self.room_name)
        self.user = self.scope['user']

        # only 2 people already connected then close
        online_count = await sync_to_async(self.room.get_online_count)()
        if online_count >= 2:
            await self.close()
            return

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

        if self.user.is_authenticated:
            # send the join event to the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_join',
                    'user': self.user.username,
                }
            )
            await sync_to_async(self.room.online.add)(self.user)
        
        # Send beats
        if online_count == 0:
            asyncio.ensure_future(self.send_beats())


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

        if self.user.is_authenticated:
            # send the leave event to the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'user': self.user.username,
                }
            )
            await sync_to_async(self.room.online.remove)(self.user) # ?

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
    
    
    async def receive_chat_message(self, message):
        if not self.user.is_authenticated:
            return

        # send chat message event to the room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'user': self.user.username,
                'message': message,
            }
        )
        await sync_to_async(Message.objects.create)(user=self.user, room=self.room, content=message)

    async def receive_audio_message(self, message):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'audio_message',
                'message': message,
            }
        )

    async def send_beats(self):
        online_count = await sync_to_async(self.room.get_online_count)()
        beat = 0
        while online_count > 0:
            online_count = await sync_to_async(self.room.get_online_count)()
            if beat < 31:
                beat += 1
            else:
                beat = 0
            await asyncio.sleep(0.19) # Slightly sped up to account for lag

            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'track': 'sequencer',
                            'type': 'beat',
                            'beat': beat % 16
                        },
                    }
            )

            # Trigger instruments based on current beat


            # Marimba
            await self.channel_layer.group_send(
                self.room_group_name,
                    {
                        'type': 'audio_message',
                        'message': {
                            'track': 'instrument',
                            'type': 'instrument',
                            'instrument': 'marimba',
                            'note': randint(5, 14)
                        },
                    }
            )

            if beat == 0:
                # Guitar
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'guitar',
                                'variation': randint(0, 7)
                            },
                        }
                )
                # Pad
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'pad',
                                'note': randint(7, 17)
                            },
                        }
                )
            if beat % 4 == 0:
                # Flute
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'flute',
                                'note1': randint(4, 8),
                                'note2': randint(6, 10)
                            },
                        }
                )
            if beat % 2 == 1:
                # Bass synth
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'synth',
                                'note': randint(0, 9)
                            },
                        }
                )
            if beat % 2 == 0:
                # Piano
                notes = [randint(0, 9), randint(5, 14), randint(9, 17), randint(6, 10), randint(8, 16), randint(8, 14), randint(10, 16), randint(8, 16), randint(8, 16)]
                await self.channel_layer.group_send(
                    self.room_group_name,
                        {
                            'type': 'audio_message',
                            'message': {
                                'track': 'instrument',
                                'type': 'instrument',
                                'instrument': 'piano',
                                'notes': notes
                            },
                        }
                )


    async def chat_message(self, event):
        await self.send(json.dumps(event))

    async def audio_message(self, event):
        await self.send(json.dumps(event))

    async def user_join(self, event):
        await self.send(json.dumps(event))

    async def user_leave(self, event):
        await self.send(json.dumps(event))
