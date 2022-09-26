from django.urls import path
from .views import RoomList, CreateRoom, RoomDetail, JoinRoom, UserInRoom, LeaveRoom, IsAuthenticated, spotify_callback, AuthURL



app_name = 'api'

urlpatterns = [
    path('', RoomList.as_view()),
    path('create', CreateRoom.as_view()),
    path('get-room-details', RoomDetail.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('is_authenticated', IsAuthenticated.as_view()),
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback)
    
]