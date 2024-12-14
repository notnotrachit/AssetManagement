from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user and request.user.role == 'admin'
        except:
            return False

class IsAdminOrVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'vendor']

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.vendor == request.user