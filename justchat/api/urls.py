from django.urls import path
from justchat.api.views import *

app_name = 'justchat'


urlpatterns = [
    path('', ChatListView.as_view()),
    path('create/', ChatCreate.as_view()),
    path('users/', ChatGetUsers.as_view())
]