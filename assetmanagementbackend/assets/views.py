from rest_framework import viewsets, permissions
from .models import Asset
from .serializers import AssetSerializer, AssetCreateUpdateSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import IsAdminOrVendor

class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrVendor]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AssetCreateUpdateSerializer
        return AssetSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Asset.objects.all()
        
        # Filter by user role
        if not (user.is_superuser or user.role == 'admin'):
            if user.role == 'vendor':
                queryset = queryset.filter(vendor=user)
            else:
                return Asset.objects.none()
        
        # Filter by category if specified
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category_id=category)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    def perform_update(self, serializer):
        # Only allow vendors to update their own assets
        if self.request.user.role == 'vendor':
            if serializer.instance.vendor != self.request.user:
                self.permission_denied(
                    self.request,
                    message='You do not have permission to update this asset.'
                )
        serializer.save()