import { useState, useEffect } from 'react';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface FormField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Category {
  id: string;
  name: string;
  fields: FormField[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!isAuthenticated || !token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${API_URL}/api/categories/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(errorData.detail || 'Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [token, isAuthenticated, router]);

  return { categories, isLoading, error };
}
