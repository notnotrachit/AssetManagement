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
import { usersApi } from "@/lib/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  role: string;
  company_name?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await usersApi.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, router]);

  const handleDelete = async (userId: string) => {
    try {
      await usersApi.delete(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <Card key={u.id}>
            <CardHeader>
              <CardTitle>{u.username}</CardTitle>
              <CardDescription>{u.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {u.company_name && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Company</span>
                    <span className="text-sm text-muted-foreground">
                      {u.company_name}
                    </span>
                  </div>
                )}
                {u.id !== user.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
