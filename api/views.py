from django.shortcuts import render
from rest_framework import generics, status  
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response



class RoomView(generics.ListAPIView):
	queryset = Room.objects.all()
	serializer_class = RoomSerializer

class CreateRoomView(APIView):
	serializer_class = CreateRoomSerializer

	def post(self, request, format = None):
		if not self.request.session.exists(self.request.session.session_key):
			self.request.session.create()

		postData = self.serializer_class(data=request.data)
		if postData.is_valid():
			guest_can_pause = postData.data.get('guest_can_pause')
			votes_to_skip = postData.data.get('votes_to_skip')
			host = self.request.session.session_key
			previousRoom = Room.objects.filter(host=host)
			if previousRoom.exists():
				room = previousRoom[0]
				room.guest_can_pause = guest_can_pause
				room.votes_to_skip = votes_to_skip
				room.save(update_fields=['guest_can_pause', 'votes_to_skip'])

			else:
				room = Room(host= host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
				room.save()

			return Response(RoomSerializer(room).data, status = status.HTTP_200_OK)




		

