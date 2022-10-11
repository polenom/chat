# chat/consumers.py
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from .models import Message, Chat
from .views import get_last_10_messages

User= get_user_model()


class ChatConsumer(WebsocketConsumer):
    def fetch_messages(self, data):
        messages = get_last_10_messages(data['chatId'])
        content= {
            'command': 'messages',
            'messages': self.messages_to_json(messages)
        }
        self.send_message(content)

    def new_message(self, data):
        author = data['from']
        author_user = User.objects.filter(username=author)
        if author_user:
            message= Chat.objects.get(pk=data['chatid']).messages.create(
                contact=author_user[0].friends.get(),
                content=data['message']
            )
            content = {
                'command': 'new_message',
                'message': self.message_to_json(message)
            }
        return self.send_chat_message(content)

    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result

    def message_to_json(self, message):
        return {
            'author': message.contact.user.username,
            'content': message.content,
            'timestamp': str(message.timestamp),
            'id': message.id,
        }

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
         async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_chat_message(self, message):
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,

            }
        )


    def send_message(self, message):
        self.send(text_data=json.dumps(message))

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

