from django.urls import path
from .views import index


# to make redirect work
app_name = 'frontend'

urlpatterns = [
    path('', index, name = 'home'),
    path('join/', index),
    path('create/', index),
    path('room/<str:roomCode>', index,  name='room-view')
]