"""
Permissions for the pcr app.
Check if user is admin or part of the pcr group. If not, deny access. 
Note that we do not use the IsAuthenticated permission here, because we want to allow anonymous users to access the pcr app.
"""
from rest_framework import permissions

class IsAdminOrPcr(permissions.BasePermission):
    """
    Global permission check for admin or pcr group.
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True

        if request.user.is_anonymous:
            return False

        return request.user.is_admin or request.user.groups.filter(name='PCR').exists()
    
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        
        if request.user.is_anonymous:
            return False
        
        return request.user.is_admin or request.user.groups.filter(name='PCR').exists()