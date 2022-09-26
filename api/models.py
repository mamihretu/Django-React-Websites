from django.db import models
import string
import random


def generate_unique_ID():
	length = 6
	while True:
		#generate ID
		roomID = ''.join(random.choices(string.ascii_uppercase, k=length))
		#check if generated code is unique
		if Room.objects.filter(roomID=roomID).count() == 0:
			break
	return roomID


class Room(models.Model):
	roomID = models.CharField(max_length=8, default=generate_unique_ID, unique=True)
	host_session = models.CharField(max_length=50, unique=True)
	guest_can_pause = models.BooleanField(null = False, default=False)
	votes_to_skip = models.IntegerField(null = False, default =1)
	created_at = models.DateTimeField(auto_now_add=True)



class SpotifyToken(models.Model):
	user = models.CharField(max_length=50, unique=True)
	created_at = models.DateTimeField(auto_now_add=True)
	refresh_token = models.CharField(max_length=150)
	access_token = models.CharField(max_length=150)
	expires_in = models.DateTimeField()
	token_type = models.CharField(max_length=50)