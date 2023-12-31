from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django import forms
from .models import CustomUser

class UserCreationForm(forms.ModelForm):
    """ Form for creating new users. Includes all the required 
    fields, plus a repeated password. """

    password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
    password2 = forms.CharField(
        label="Password confirmation", 
        widget=forms.PasswordInput
    )

    class Meta:
        model = CustomUser
        fields = ("identifier", "email")
    
    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and (password1 != password2):
            raise forms.ValidationError("Passwords don't match")
        return password2
    
    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user
    
class UserChangeForm(forms.ModelForm):
    """ Form for updating users. Includes all the fields on	
    the user, but replaces the password field with admin's
    password hash display field. """

    password = ReadOnlyPasswordHashField()

    class Meta:
        model = CustomUser
        fields = ("identifier", "email", "password", "is_active", "is_admin")

class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the CustomUser model
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User
    list_display = ("identifier", "email", "is_admin")
    list_filter = ("is_admin",)
    fieldsets = (
        (None, {"fields": ("identifier", "email", "password")}),
        ("Permissions", {"fields": ("is_admin", "groups")}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. 
    # UserAdmin overrides get_fieldsets to use this attribute 
    # when creating a user.
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("identifier", "email", "password1", "password2", )
        }),
    )
    search_fields = ("identifier", "email", )
    ordering = ("identifier", "email", )
    filter_horizontal = ()

admin.site.register(CustomUser, UserAdmin)
