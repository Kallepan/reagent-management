from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import CustomUserManager

class CustomUser(AbstractBaseUser):
    identifier = models.CharField(max_length=255, unique=True)
    email = models.EmailField("email adress", max_length=255, unique=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "identifier"
    REQUIRED_FIELDS = ["email"]

    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",
        related_name="user_set",
        related_query_name="user",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="user_set",
        related_query_name="user",
    )

    def __str__(self):
        return self.identifier
    
    def has_perm(self, perm, obj=None):
        """ Does the user have a specific permission? """
        return True
    
    def has_module_perms(self, app_label):
        """ Does the user have permissions to view the app `app_label`? """
        return True

    @property
    def is_staff(self):
        """ Is the user a member of staff? """
        return self.is_admin