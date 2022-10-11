from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model

from .models import Chat, Contact

User = get_user_model()
def get_last_10_messages(chatid):
    chat = get_object_or_404(Chat, id=chatid)
    return chat.messages.order_by('-timestamp').all()[:10]


def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    contact = get_object_or_404(Contact, user=user)
    return contact