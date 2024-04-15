from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class TokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Customize token payload here if needed
        # token['username'] = user.username

        return token
