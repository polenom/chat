from django.shortcuts import render, get_object_or_404

from .models import Chat

def get_last_10_messages(chatid):
    chat = get_object_or_404(Chat, id=chatid)
    return chat.messages.order_by('-timestamp').all()[:10]