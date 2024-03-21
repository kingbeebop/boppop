# boppop/authentication.py

from rest_framework.authentication import SessionAuthentication

class NoCSRFSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        # Override the CSRF enforcement if needed
        pass
