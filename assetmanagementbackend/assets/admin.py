from django.contrib import admin

# Register your models here.
from .models    import Asset, AssetField    

admin.site.register(Asset)
admin.site.register(AssetField)