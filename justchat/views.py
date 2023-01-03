from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_auth.registration.views import RegisterView
from rest_framework import status
from rest_framework.response import Response

from .models import Chat, Contact

User = get_user_model()
def get_last_10_messages(chatid):
    chat = get_object_or_404(Chat, id=chatid)
    return chat.messages.order_by('-timestamp').all()[:10]


def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    contact = get_object_or_404(Contact, user=user)
    return contact


class ChangeRegistration(RegisterView):
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        contact = Contact.objects.create(user=user)
        headers = self.get_success_headers(serializer.data)

        return Response(self.get_response_data(user),
                        status=status.HTTP_201_CREATED,
                        headers=headers)