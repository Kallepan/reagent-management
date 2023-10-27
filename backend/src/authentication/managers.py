from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where identifier are the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, identifier, email,  password, **extra_fields):
        """
        Create and save a User with the given identifier and password.
        """
        if not identifier:
            raise ValueError("The identifier must be set")
        if not email:
            raise ValueError("The email must be set")
        
        user = self.model(
            identifier=identifier, 
            email=self.normalize_email(email),
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, identifier, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given identifier and password.
        """
        if not password:
            raise ValueError("Superusers must have a password")

        user = self.create_user(
            identifier=identifier, 
            email=email, 
            password=password,
            **extra_fields
        )

        user.is_admin = True
        user.save(using=self._db)
        return user