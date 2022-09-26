from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics, status, permissions  
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from requests import Request, post
from .utils import update_or_create_user_tokens, is_spotify_authenticated, get_latest_room
import base64
from django.urls import reverse

class RoomList(generics.ListAPIView):
	queryset = Room.objects.all()
	serializer_class = RoomSerializer

class UserInRoom(APIView):
	def get(self, request, format=None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		data = {
			'room':self.request.session.get('roomID')
		}

		return JsonResponse(data, status=status.HTTP_200_OK)


class RoomDetail(APIView):
	serializer_class = RoomSerializer
	lookup_url_kwarg = 'roomID'
	permission_classes = [permissions.AllowAny]

	def get(self, request, format = None):
		roomID = request.GET.get(self.lookup_url_kwarg)
		if roomID is not None:
			roomList = Room.objects.filter(roomID = roomID)
			if len(roomList)> 0:
				data = RoomSerializer(roomList[0]).data
				data['is_host'] = self.request.session.session_key == roomList[0].host_session
				return Response(data, status = status.HTTP_200_OK)
			return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
		return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
	lookup_url_kwarg = 'roomID'
	permission_classes = [permissions.AllowAny]

	def post(self, request, format=None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		roomID = request.data.get(self.lookup_url_kwarg)
		if roomID is not None:
			room_results = Room.objects.filter(roomID=roomID)
			if len(room_results) > 0:
				self.request.session['currentRoomID'] = roomID
				return Response({'message' : 'Room joined'}, status = status.HTTP_200_OK)
			return Response({'Bad Request':'Invalid roomID, room does not exist'}, status= status.HTTP_400_BAD_REQUEST)
		return Response({'Bad Request':'Invalid post data, did not find roomID key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoom(APIView):
	serializer_class = CreateRoomSerializer
	permission_classes = [permissions.AllowAny]

	def post(self, request, format = None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		roomData = self.serializer_class(data=request.data)
		if roomData.is_valid():
			guest_can_pause = roomData.data.get('guest_can_pause')
			votes_to_skip = roomData.data.get('votes_to_skip')
			session_id = self.request.session.session_key
			previousRoom = Room.objects.filter(host_session=session_id)
			if previousRoom.exists():
				room = previousRoom[0]
				room.guest_can_pause = guest_can_pause
				room.votes_to_skip = votes_to_skip
				room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
				self.request.session['roomID'] = room.roomID
				roomData = RoomSerializer(room).data
				roomData['authenticated'] = True
			else:
				room = Room(host_session= session_id, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
				room.save()
				self.request.session['roomID'] = room.roomID
				roomData = RoomSerializer(room).data
				roomData['authenticated'] = False
			return Response(roomData, status = status.HTTP_200_OK)
		return Response({'Bad Request':'Invalid post data'}, status=HTTP_400_BAD_REQUEST)


class LeaveRoom(APIView):
	permission_classes = [permissions.AllowAny]
	def post(self, request, format=None):
		if 'currentRoomID' in self.request.session:
			self.request.session.pop('currentRoomID')
			host_session = self.request.session.session_key
			room_results = Room.objects.filter(host_session=host_session)

			if len(room_results) > 0:
				room = room_results[0]
				room.delete()

		return Response({'Message' : 'Success'}, status=status.HTTP_200_OK)	



# TELL FRONTEND WHERE TO REDIRECT TO LET USER LOGIN TO SPOTIFY
class AuthURL(APIView):
	permission_classes = [permissions.AllowAny]
	def get(self, request, format=None):
		scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing' 
		url = Request('GET', 'https://accounts.spotify.com/authorize', params = {
			'scope':scopes,
			'response_type': 'code',
			'redirect_uri': REDIRECT_URI,
			'client_id': CLIENT_ID
			}).prepare().url


		return Response({'url': url}, status.HTTP_200_OK)




class IsAuthenticated(APIView):
	def get(self, request , format):
		is_authenticated = is_spotify_authenticated(self.request.session.session_key)
		return Response({auth_status: is_authenticated}, status=status.HTTP_200_OK)



def spotify_callback(request, format=None):
	code = request.GET.get('code')
	error = request.GET.get('error')
	auth_str = bytes('Basic {}:{}'.format(CLIENT_ID, CLIENT_SECRET), 'utf-8')
	b64_auth_str = base64.b64encode(auth_str)
	print('b64_auth_str:::::::',  b64_auth_str)


	response = post('https://accounts.spotify.com/api/token', 
		data ={
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': REDIRECT_URI,
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET
		},
		headers ={
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': b64_auth_str
		}
		)

	response = response.json()

	access_token = response.get('access_token')
	token_type = response.get('token_type')
	refresh_token = response.get('refresh_token')
	expires_in = response.get('expires_in')
	error = response.get('error')
	if not request.session.exists(request.session.session_key):
		request.session.create()

	# update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
	created_room_ID = get_latest_room()	

	return redirect(reverse('frontend:room-view', args=[created_room_ID]))
