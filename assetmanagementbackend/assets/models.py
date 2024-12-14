from django.db import models
import uuid
from category.models import Category
from users.models import User

class Asset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, related_name='assets', on_delete=models.PROTECT)
    vendor = models.ForeignKey(User, related_name='assets', on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assets'

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class AssetField(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset = models.ForeignKey(Asset, related_name='fields', on_delete=models.CASCADE)
    form_field = models.ForeignKey('category.FormField', on_delete=models.CASCADE)
    value = models.JSONField()

    class Meta:
        db_table = 'asset_fields'

    def __str__(self):
        return f"{self.asset.name} - {self.form_field.label}"