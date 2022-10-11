from django.contrib.auth import get_user_model
from rest_framework import serializers

from justchat.views import get_user_contact
from justchat.models import Chat, Contact

User = get_user_model()
class ContactSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value
class ChatSerializer(serializers.ModelSerializer):
    participants = ContactSerializer(many=True)
    class Meta:
        model = Chat
        fields = ('id', 'messages', 'participants')
        read_only = ('id',)

    def create(self, validated_data):
        participants = validated_data.pop('participants')
        chat = Chat()
        chat.save()
        for username in participants:
            contact = get_user_contact(username)
            chat.participants.add(contact)
        chat.save()
        return chat


class UsersSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField()
    class Meta:
        model = Contact
        fields =('user', )