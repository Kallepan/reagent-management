"""
Permissions for the bak app.
Check if user is admin or part of the bak group. If not, deny access. 
Note that we do not use the IsAuthenticated permission here, because we want to allow anonymous users to access the bak app.
"""
from rest_framework import permissions

class IsAdminOrBak(permissions.BasePermission):
    """
    Global permission check for admin or bak group.
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True

        if request.user.is_anonymous:
            return False

        return request.user.is_admin or request.user.groups.filter(name='BAK').exists()
    
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        
        if request.user.is_anonymous:
            return False
        
        return request.user.is_admin or request.user.groups.filter(name='BAK').exists()