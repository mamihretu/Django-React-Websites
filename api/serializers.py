from .models import Room
from rest_framework import serializers

#serializer to serialize outgoing payload 
class RoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = ('id','code', 'host', 'guest_can_pause',
				  'votes_to_skip', 'created_at')


#serializer to serialize incoming payload
class CreateRoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room 
		fields = ('guest_can_pause', 'votes_to_skip')
