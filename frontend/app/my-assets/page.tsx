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
import { AssetForm } from "../../components/assets/AssetForm";
import { AssetList } from "../../components/assets/AssetList";
import { assetsApi, categoriesApi } from "@/lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/ui/use-toast";

export default function MyAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user?.role !== "vendor") {
      router.push("/");
      return;
    }

    const fetchData = async () => {
      try {
        const [assetsData, categoriesData] = await Promise.all([
          assetsApi.getMyAssets(),
          categoriesApi.getAll()
        ]);
        setAssets(assetsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load assets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router, authLoading]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingAsset) {
        // Format the update data to match API expectations
        const updateData = {
          name: data.name,
          category: editingAsset.category.id,
          fields: data.fields.map((field) => ({
            field_name: field.name,
            field_label: field.name, // Use the field name as label if not provided
            value: field.value,
          })),
        };

        const updatedAsset = await assetsApi.update(
          editingAsset.id,
          updateData
        );
        setAssets(
          assets.map((asset) =>
            asset.id === editingAsset.id
              ? {
                  ...updatedAsset,
                  category: editingAsset.category, // Keep the original category object
                }
              : asset
          )
        );
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        const newAsset = await assetsApi.create({
          ...data,
          fields: data.fields.map((field) => ({
            field_name: field.name,
            field_label: field.name,
            value: field.value,
          })),
        });
        setAssets([...assets, newAsset]);
        toast({
          title: "Success",
          description: "Asset created successfully",
        });
      }
      setShowForm(false);
      setEditingAsset(null);
    } catch (error) {
      console.error("Failed to save asset:", error);
      toast({
        title: "Error",
        description: "Failed to save asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (asset: any) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDelete = async (asset: any) => {
    try {
      await assetsApi.delete(asset.id);
      setAssets(assets.filter((a) => a.id !== asset.id));
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user?.role !== "vendor") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Assets</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingAsset(null);
          }}
        >
          Create Asset
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingAsset ? "Edit Asset" : "Create New Asset"}
            </CardTitle>
            <CardDescription>
              Select a category and fill in the required information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssetForm
              asset={editingAsset}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAsset(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <AssetList assets={assets} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
