from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from apps.parents.models import Parent
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging

logger = logging.getLogger(__name__)

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        email = data.get('email')
        username = data.get('username') or (email.split('@')[0] if email else None)
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Email already exists"})
        if username and User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        data['username'] = username
        return data

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)
        Parent.objects.get_or_create(user=user)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username', '').strip()
        password = attrs.get('password', '')

        logger.info(f"Login attempt with: {username_or_email}")
        print(f"[DEBUG] Login attempt with: {username_or_email}")

        user = None
        
        # If it looks like an email
        if '@' in username_or_email:
            print(f"[DEBUG] Detected email, searching in database...")
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                print(f"[DEBUG] Found user: username={user_obj.username}, email={user_obj.email}, active={user_obj.is_active}")
                
                # Authenticate with actual username
                user = authenticate(username=user_obj.username, password=password)
                print(f"[DEBUG] Authenticate result: {user}")
                
                if not user:
                    # Password is wrong
                    print(f"[DEBUG] Password verification failed for user: {user_obj.username}")
                    
            except User.DoesNotExist:
                print(f"[DEBUG] No user found with email: {username_or_email}")
                # Show all users for debugging
                all_users = User.objects.all().values_list('username', 'email', 'is_active')
                print(f"[DEBUG] All users in DB: {list(all_users)}")
        else:
            # Try as username
            print(f"[DEBUG] Attempting authentication with username: {username_or_email}")
            user = authenticate(username=username_or_email, password=password)
            print(f"[DEBUG] Authentication result: {user}")

        if not user:
            print(f"[DEBUG] AUTHENTICATION FAILED!")
            raise serializers.ValidationError(
                {"detail": "Invalid email or password. Please check your credentials."},
                code='authorization'
            )

        if not user.is_active:
            print(f"[DEBUG] User account is not active")
            raise serializers.ValidationError(
                {"detail": "User account is disabled"},
                code='authorization'
            )

        print(f"[DEBUG] Authentication successful for: {user.username}")

        # Generate tokens
        refresh = self.get_token(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        }
        
        try:
            parent = Parent.objects.get(user=user)
            data['phone_number'] = getattr(parent, 'phone_number', '')
        except Parent.DoesNotExist:
            data['phone_number'] = ''
            print(f"[DEBUG] No Parent profile for user {user.username}")
        
        return data