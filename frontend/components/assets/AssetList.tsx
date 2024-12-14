'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface Asset {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  fields: {
    id: string;
    field_name: string;
    field_label: string;
    value: string;
  }[];
  vendor_name?: string;
}

interface AssetListProps {
  assets: Asset[];
  onEdit?: (asset: Asset) => void;
  onDelete?: (asset: Asset) => void;
  canEdit?: boolean;
}

export function AssetList({ assets = [], onEdit, onDelete, canEdit }: AssetListProps) {
  if (!assets?.length) {
    return <div className="text-center text-gray-500">No assets found</div>;
  }

  return (
    <div key="asset-list-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <Card key={`asset-${asset.id}`}>
          <CardHeader>
            <CardTitle>{asset.name}</CardTitle>
            <CardDescription>
              <span key={`category-${asset.category?.id}`}>
                Category: {asset.category?.name || 'Unknown'}
                {asset.vendor_name && <span key={`vendor-${asset.id}`}> | Vendor: {asset.vendor_name}</span>}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {asset.fields?.map((field) => (
                <div key={`field-${asset.id}-${field.id}`} className="flex justify-between">
                  <span className="text-sm font-medium">
                    {field.field_label || field.field_name}:
                  </span>
                  <span className="text-sm">{field.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
          {canEdit && (
            <CardFooter key={`footer-${asset.id}`} className="flex justify-end space-x-2">
              {onEdit && (
                <Button
                  key={`edit-${asset.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(asset)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  key={`delete-${asset.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(asset)}
                >
                  Delete
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
