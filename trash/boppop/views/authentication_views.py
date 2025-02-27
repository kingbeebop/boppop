from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from ..models import Artist
from ..serializers import TokenObtainPairSerializer
from ..serializers import ArtistSerializer
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    pass

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        try:
            token = RefreshToken.for_user(user)
            return Response({
                'access_token': str(token.access_token),
                'refresh_token': str(token),
                'user': ArtistSerializer(user).data
            })
        except TokenError as e:
            return Response({'error': 'Token generation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_user(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password1 = request.data.get('password1')
    password2 = request.data.get('password2')
    email = request.data.get('email')
    if password1 != password2:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        password = password1
    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = Artist.objects.create_user(username=username, password=password, email=email)
        login(request, user)
        serializer = ArtistSerializer(user)  # Assuming you have a serializer for Artist
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# # View to check token validity
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def check_token_validity(request):
#     return Response({'valid': True})
@api_view(['GET'])
def check_token_validity(request):
    try:
        # Use Simple JWT's authentication to check token validity
        authentication = JWTAuthentication()
        user, _ = authentication.authenticate(request)

        if user is not None:
            return Response({'valid': True})
        else:
            return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
    except InvalidToken:
        return Response({'valid': False}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View to return user data if token is valid
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    try:
        user = request.user
        artist = Artist.objects.get(username=user.username)
        serializer = ArtistSerializer(artist)
        return Response(serializer.data)
    except Artist.DoesNotExist:
        return Response({'error': 'Artist data not found'}, status=404)