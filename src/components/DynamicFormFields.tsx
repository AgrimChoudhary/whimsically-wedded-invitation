
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Image } from 'lucide-react';
import FileUploader from './FileUploader';

interface DynamicFormFieldsProps {
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: any) => void;
  type: 'familyMember' | 'event' | 'gallery';
}

const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({ 
  fields, 
  onAdd, 
  onRemove, 
  onChange,
  type
}) => {
  const getFieldConfig = (type: string) => {
    switch (type) {
      case 'familyMember':
        return {
          title: 'Family Member',
          fields: [
            { name: 'name', label: 'Name', type: 'text', placeholder: 'E.g., Emma Miller' },
            { name: 'relation', label: 'Relation', type: 'text', placeholder: 'E.g., Sister of the Bride' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description about this family member' },
            { name: 'image', label: 'Photo (Optional)', type: 'image', placeholder: 'Upload a photo' }
          ]
        };
      case 'event':
        return {
          title: 'Event',
          fields: [
            { name: 'name', label: 'Event Name', type: 'text', placeholder: 'E.g., Reception' },
            { name: 'relation', label: 'Date', type: 'date', placeholder: 'Event date' },
            { name: 'description', label: 'Time', type: 'text', placeholder: 'E.g., 6:00 PM - 10:00 PM' },
            { name: 'image', label: 'Venue', type: 'text', placeholder: 'E.g., Crystal Pavilion' },
            { name: 'address', label: 'Venue Address', type: 'textarea', placeholder: 'Full address of the venue' },
            { name: 'mapLink', label: 'Venue Map Link (Optional)', type: 'text', placeholder: 'Google Maps link' }
          ]
        };
      case 'gallery':
        return {
          title: 'Gallery Photo',
          fields: [
            { name: 'image', label: 'Photo', type: 'image', placeholder: 'Upload a photo' },
            { name: 'name', label: 'Title', type: 'text', placeholder: 'E.g., Engagement Photoshoot' },
            { name: 'description', label: 'Description (Optional)', type: 'textarea', placeholder: 'Short description about this photo' }
          ]
        };
      default:
        return { title: 'Item', fields: [] };
    }
  };

  const config = getFieldConfig(type);

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div 
          key={field.id || index} 
          className="p-4 border border-gray-200 rounded-md bg-white/50 space-y-4 relative"
        >
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="h-8 w-8 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </Button>
          </div>
          
          <h4 className="font-medium text-sm text-gray-700">
            {config.title} #{index + 1}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.fields.map((configField) => {
              if (configField.type === 'image') {
                return (
                  <div key={configField.name} className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {configField.label}
                    </label>
                    <FileUploader
                      onFileUpload={(url) => onChange(index, configField.name, url)}
                      defaultImageUrl={field[configField.name] || ''}
                      bucket={type === 'familyMember' ? 'family_photos' : type === 'gallery' ? 'gallery_photos' : 'wedding_photos'}
                      label={configField.placeholder}
                    />
                  </div>
                );
              }
              
              if (configField.type === 'textarea') {
                return (
                  <div key={configField.name} className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {configField.label}
                    </label>
                    <Textarea
                      placeholder={configField.placeholder}
                      value={field[configField.name] || ''}
                      onChange={(e) => onChange(index, configField.name, e.target.value)}
                      className="resize-none"
                    />
                  </div>
                );
              }
              
              return (
                <div key={configField.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {configField.label}
                  </label>
                  <Input
                    type={configField.type}
                    placeholder={configField.placeholder}
                    value={field[configField.name] || ''}
                    onChange={(e) => onChange(index, configField.name, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full flex items-center justify-center py-2 border-dashed"
      >
        <Plus size={16} className="mr-2" />
        Add {config.title}
      </Button>
    </div>
  );
};

export default DynamicFormFields;
