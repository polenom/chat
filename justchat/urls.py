from django.urls import path, include
from justchat.api.urls import *

app_name = 'justchat'


urlpatterns = [
    path('', ChatListView.as_view()),
]

