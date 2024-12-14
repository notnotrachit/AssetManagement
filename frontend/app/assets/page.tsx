/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, categoriesData] = await Promise.all([
          assetsApi.getAll(),
          categoriesApi.getAll(),
        ]);
        setAssets(assetsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsData, categoriesData] = await Promise.all([
        assetsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setAssets(assetsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingAsset) {
        await assetsApi.update(editingAsset.id, data);
        fetchData();
      } else {
        await assetsApi.create(data);
        fetchData();
      }
      setShowForm(false);
      setEditingAsset(null);
    } catch (error) {
      console.error("Failed to save asset:", error);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assets</h1>
        {user?.role !== "user" && (
          <Button onClick={() => setShowForm(true)}>Create Asset</Button>
        )}
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

      <AssetList
        assets={assets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={user?.role !== "user"}
      />
    </div>
  );
}
