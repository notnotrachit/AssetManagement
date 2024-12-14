from django.contrib import admin

# Register your models here.
from .models import Category, FormField

admin.site.register(Category)

admin.site.register(FormField)
