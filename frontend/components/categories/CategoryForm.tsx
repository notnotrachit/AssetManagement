import { useState } from 'react';
import { Button } from '../ui/Button';

interface FormField {
  name: string;
  label: string;
  field_type: 'text' | 'number' | 'date';
  required: boolean;
  order: number;
}

interface CategoryFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function CategoryForm({ onSubmit, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [fields, setFields] = useState<FormField[]>(
    initialData?.fields || []
  );

  const addField = () => {
    setFields([
      ...fields,
      {
        name: '',
        label: '',
        field_type: 'text',
        required: false,
        order: fields.length,
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    setFields(
      fields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      fields: fields.map((field, index) => ({
        ...field,
        order: index,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          Category Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Form Fields</h3>
          <Button type="button" onClick={addField} variant="outline">
            Add Field
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={index} className="p-4 border rounded-md space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium">Field {index + 1}</h4>
              <Button
                type="button"
                onClick={() => removeField(index)}
                variant="ghost"
                size="sm"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Field Name
                </label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) =>
                    updateField(index, { name: e.target.value })
                  }
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Field Label
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { label: e.target.value })
                  }
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Field Type
                </label>
                <select
                  value={field.field_type}
                  onChange={(e) =>
                    updateField(index, {
                      field_type: e.target.value as 'text' | 'number' | 'date',
                    })
                  }
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`required-${index}`}
                  checked={field.required}
                  onChange={(e) =>
                    updateField(index, { required: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor={`required-${index}`}
                  className="text-sm font-medium"
                >
                  Required Field
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit">
        {initialData ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}
