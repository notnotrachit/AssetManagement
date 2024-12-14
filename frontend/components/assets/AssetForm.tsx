/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { useToast } from '../ui/use-toast';
import { useCategories, Category } from '@/lib/hooks/useCategories';


interface AssetField {
  id: string;
  field_name: string;
  field_label: string;
  value: string;
}

interface Asset {
  id?: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  fields?: AssetField[];
}

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export function AssetForm({ asset, onSubmit, onCancel }: AssetFormProps) {
  const { toast } = useToast();
  const { categories, isLoading, error } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    category: '',
    fields: {},
  });

  // Load initial data when editing an asset
  useEffect(() => {
    if (asset) {
      // Set initial form data
      const fieldValues = asset.fields?.reduce(
        (acc, field) => ({
          ...acc,
          [field.field_name]: field.value,
        }),
        {}
      ) || {};

      setFormData({
        name: asset.name,
        category: asset.category.id,
        fields: fieldValues,
      });

      // Find and set the selected category
      const category = categories?.find((c) => c.id === asset.category.id);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [asset, categories]);

  const handleCategoryChange = (categoryId: string) => {
    const category = categories?.find((c) => c.id === categoryId);
    setSelectedCategory(category || null);
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      // Only reset fields if we're not editing an existing asset
      fields: asset ? prev.fields : {},
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    // Format fields as an array of objects with name and value
    const fieldsArray = Object.entries(formData.fields).map(([name, value]) => ({
      name,
      value: value?.toString() || '',
    }));

    const submitData = {
      name: formData.name,
      category: formData.category,
      fields: fieldsArray,
    };

    onSubmit(submitData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{asset ? 'Edit Asset' : 'Create Asset'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
              disabled={!!asset} // Disable category change when editing
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && (
            <div className="space-y-4">
              {selectedCategory.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === 'select' && field.options ? (
                    <Select
                      value={formData.fields[field.name] || ''}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          fields: {
                            ...prev.fields,
                            [field.name]: value,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData.fields[field.name] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fields: {
                            ...prev.fields,
                            [field.name]: e.target.value,
                          },
                        }))
                      }
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {asset ? 'Save Changes' : 'Create Asset'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
