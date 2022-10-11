from django.contrib.auth import get_user_model
from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    DestroyAPIView,
    UpdateAPIView, GenericAPIView
)
from rest_framework.response import Response

from justchat.models import Chat, Contact
from .serializers import ChatSerializer, UsersSerializer
from ..views import get_user_contact

User = get_user_model()





class ChatListView(ListAPIView):
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = Chat.objects.all()
        username = self.request.query_params.get('username', None)
        if username is not None:
            contact = get_user_contact(username)
            queryset = contact.chats.all()
        return queryset


class ChatCreate(CreateAPIView):
    queryset =  Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (permissions.AllowAny, )


class ChatGetUsers(GenericAPIView):
    queryset = Contact.objects.all()
    serializer_class = UsersSerializer
    permission_classes = (permissions.AllowAny,)

    def get(self,request):
        return self.list(request)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        data = {
            "users": [i['user'] for i in serializer.data]
        }
        return Response(data)