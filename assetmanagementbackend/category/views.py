from rest_framework import viewsets, permissions
from .models import Category
from .serializers import CategorySerializer, CategoryCreateSerializer
from users.permissions import IsAdminUser

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return CategoryCreateSerializer
        return CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]