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

        existing_fields = instance.fields.all()


        # Create new fields
        for field_data in fields_data:
            if instance.fields.filter(name=field_data.get('name')).exists():
                field = instance.fields.get(name=field_data.get('name'))
                field.name = field_data.get('name', field.name)
                field.label = field_data.get('label', field.label)
                field.field_type = field_data.get('field_type', field.field_type)
                field.required = field_data.get('required', field.required)
                field.order = field_data.get('order', field.order)
                field.save()
            else:
                FormField.objects.create(category=instance, **field_data)
        
        for field in existing_fields:
            if not any(field_data.get('name') == field.name for field_data in fields_data):
                field.delete()

        return instance