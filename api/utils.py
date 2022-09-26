from .models import SpotifyToken, Room
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post

def get_user_tokens(session_id):
	user_tokens = SpotifyToken.objects.filter(user=session_id)
	print("USER TOKENS returned by database filter::::: ", user_tokens)
	if user_tokens.exists():
		return user_tokens[0]
	else:
		return None



def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
	tokens = get_user_tokens(session_id)
	expires_in = timezone.now() + timedelta(seconds=3600)

	if tokens:
		tokens.access_token = access_token
		tokens.refresh_token = refresh_token
		tokens.expires_in = expires_in
		tokens.token_type = token_type #does not change
		tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in'])

	else:
		tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
		tokens.save()


def is_spotify_authenticated(session_id):
	tokens = get_user_tokens(session_id)
	if tokens:
		expires_at = tokens.expires_in
		if expires_at <= timezone.now():
			refresh_spotify_token(session_id)
		return True


	return False



def refresh_spotify_token(session_id):
	refresh_token = get_user_tokens(session_id).refresh_token

	response = post('https://accounts.spotify.com/api/token', data= {
		'grant_type': 'refresh_token',
		'refresh_token': refresh_token,
		'client_id': CLIENT_ID,
		'client_secret': CLIENT_SECRET 
		}).json()

	access_token = response.get('access_token')
	token_type = response.get('token_type')
	expires_in = response.get('expires_in')
	refresh_token = response.get('refresh_token')	

	update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)


def get_latest_room():
	ordered_set = Room.objects.order_by('-created_at')
	latest_room_id = ordered_set[0].roomID

	return latest_room_id
