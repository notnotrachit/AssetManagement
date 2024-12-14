from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
        ('user', 'User'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    company_name = models.CharField(max_length=255, blank=True)
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return f"{self.username} ({self.role})"