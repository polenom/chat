from django.urls import path, include

from justchat.views import index, room

app_name = 'justchat'


urlpatterns = [
    path('', index, name='index'),
    path('<str:room_name>/', room, name='room'),
]