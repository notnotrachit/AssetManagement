from rest_framework import serializers
from .models import Category, FormField

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ['id', 'name', 'label', 'field_type', 'required', 'order']

class CategorySerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'fields', 'created_at', 'updated_at']

class CategoryCreateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'fields']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        category = Category.objects.create(**validated_data)
        
        for field_data in fields_data:
            FormField.objects.create(category=category, **field_data)
        
        return category

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])
        
        # Update category name
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Delete existing fields
        instance.fields.all().delete()

        # Create new fields
        for field_data in fields_data:
            FormField.objects.create(category=instance, **field_data)

        return instance