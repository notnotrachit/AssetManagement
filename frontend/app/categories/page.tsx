"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CategoryForm } from "../../components/categories/CategoryForm";
import { categoriesApi } from "@/lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/ui/use-toast";
import { fetchWithAuth } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) {
      return;
    }

    // Only allow admin and vendor roles
    if (user === null || !['admin', 'vendor'].includes(user?.role)) {
      router.push("/");
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user, router, authLoading]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingCategory) {
        const updatedCategory = await categoriesApi.update(
          editingCategory.id,
          data
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? updatedCategory : cat
          )
        );
      } else {
        const newCategory = await categoriesApi.create(data);
        setCategories([...categories, newCategory]);
      }
      setShowForm(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: any) => {
    try {
      // Check for assets using this category
      const assets = await fetchWithAuth(`/api/assets/?category=${category.id}`);
      
      if (assets && assets.length > 0) {
        toast({
          title: "Cannot Delete Category",
          description: `This category has ${assets.length} assets using it. Please delete all assets in this category first.`,
          variant: "destructive",
        });
        return;
      }
      await categoriesApi.delete(category.id);
      setCategories(categories.filter((c) => c.id !== category.id));
      
      // Show success message
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || authLoading) {
    return <div>Loading...</div>;
  }

  if (!['admin', 'vendor'].includes(user?.role)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-base-content">
        <h1 className="text-3xl font-bold">Categories</h1>
        {user?.role === 'admin' && (
          <Button onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
          }}>Create Category</Button>
        )}
      </div>

      {showForm && user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </CardTitle>
            <CardDescription>
              Define the category and its form fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm
              onSubmit={handleSubmit}
              initialData={editingCategory}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.fields?.map((field: any) => (
                  <div key={field.id} className="flex justify-between">
                    <span className="text-sm font-medium">{field.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {field.field_type}
                      {field.required && " (required)"}
                    </span>
                  </div>
                ))}
              </div>
              {user?.role === 'admin' && (
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
