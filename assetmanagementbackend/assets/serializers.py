from rest_framework import serializers
from .models import Asset, AssetField
from category.serializers import CategorySerializer, FormFieldSerializer
from category.models import FormField, Category

class AssetFieldSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='form_field.name')
    field_label = serializers.CharField(source='form_field.label')

    class Meta:
        model = AssetField
        fields = ['id', 'field_name', 'field_label', 'value']

class AssetSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    fields = AssetFieldSerializer(many=True)
    vendor_name = serializers.CharField(source='vendor.username')

    class Meta:
        model = Asset
        fields = ['id', 'name', 'category', 'vendor_name', 'fields', 'created_at', 'updated_at']

class AssetCreateUpdateSerializer(serializers.ModelSerializer):
    class FieldData(serializers.Serializer):
        name = serializers.CharField()
        value = serializers.CharField()

    fields = FieldData(many=True, write_only=True)

    class Meta:
        model = Asset
        fields = ['name', 'category', 'fields']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        validated_data['vendor'] = self.context['request'].user
        asset = Asset.objects.create(**validated_data)

        # Create asset fields
        for field_data in fields_data:
            field_name = field_data['name']
            try:
                form_field = asset.category.fields.get(name=field_name)
                AssetField.objects.create(
                    asset=asset,
                    form_field=form_field,
                    value=field_data['value']
                )
            except FormField.DoesNotExist:
                continue

        return asset

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])
        
        # Update basic fields
        instance.name = validated_data.get('name', instance.name)
        if 'category' in validated_data:
            instance.category = validated_data['category']
        instance.save()

        # Delete existing fields
        instance.fields.all().delete()

        # Create new fields
        for field_data in fields_data:
            field_name = field_data['name']
            try:
                form_field = instance.category.fields.get(name=field_name)
                AssetField.objects.create(
                    asset=instance,
                    form_field=form_field,
                    value=field_data['value']
                )
            except FormField.DoesNotExist:
                continue

        return instance

    def validate_fields(self, value):
        category = self.initial_data.get('category')
        if not category:
            raise serializers.ValidationError("Category is required to validate fields")

        # Get category fields
        try:
            category_obj = Category.objects.get(pk=category)
            valid_field_names = set(category_obj.fields.values_list('name', flat=True))
        except Category.DoesNotExist:
            raise serializers.ValidationError("Invalid category")

        # Validate field names
        for field_data in value:
            if field_data['name'] not in valid_field_names:
                raise serializers.ValidationError(f"Invalid field name: {field_data['name']}")

        return value