
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import FileUploader from './FileUploader';

interface FieldConfig {
  id: string;
  name: string;
  relation?: string;
  description?: string;
  image?: string;
}

interface DynamicFormFieldsProps {
  fields: FieldConfig[];
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
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-md relative">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-full hover:bg-red-100"
            aria-label="Remove item"
          >
            <X size={16} />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {type === 'familyMember' && (
              <>
                <Input
                  label="Name"
                  placeholder="E.g., Emma Miller"
                  value={field.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label="Relation"
                  placeholder="E.g., Sister of the Bride"
                  value={field.relation}
                  onChange={(e) => onChange(index, 'relation', e.target.value)}
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="E.g., Artist, loves painting"
                  value={field.description}
                  onChange={(e) => onChange(index, 'description', e.target.value)}
                  className="md:col-span-2"
                />
                <FileUploader
                  label="Photo (Optional)"
                  onFileUpload={(url) => onChange(index, 'image', url)}
                  defaultImageUrl={field.image}
                  bucket="family_members"
                  className="md:col-span-2"
                />
              </>
            )}
            
            {type === 'event' && (
              <>
                <Input
                  label="Event Name"
                  placeholder="E.g., Reception"
                  value={field.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label="Date"
                  type="date"
                  value={field.relation} // Using relation field for date
                  onChange={(e) => onChange(index, 'relation', e.target.value)}
                  required
                />
                <Input
                  label="Time"
                  placeholder="E.g., 6:00 PM - 10:00 PM"
                  value={field.description} // Using description field for time
                  onChange={(e) => onChange(index, 'description', e.target.value)}
                />
                <Input
                  label="Venue Name"
                  placeholder="E.g., Crystal Pavilion"
                  value={field.image} // Using image field for venue name
                  onChange={(e) => onChange(index, 'image', e.target.value)}
                />
              </>
            )}
            
            {type === 'gallery' && (
              <>
                <FileUploader
                  label="Photo"
                  onFileUpload={(url) => onChange(index, 'image', url)}
                  defaultImageUrl={field.image}
                  bucket="gallery"
                  className="md:col-span-2"
                />
                <Input
                  label="Title (Optional)"
                  placeholder="E.g., Our Engagement"
                  value={field.name}
                  onChange={(e) => onChange(index, 'name', e.target.value)}
                />
                <Textarea
                  label="Description (Optional)"
                  placeholder="E.g., The day we got engaged at the beach"
                  value={field.description}
                  onChange={(e) => onChange(index, 'description', e.target.value)}
                  className="md:col-span-2"
                />
              </>
            )}
          </div>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2"
      >
        <Plus size={16} />
        <span>
          {type === 'familyMember' && 'Add Family Member'}
          {type === 'event' && 'Add Event'}
          {type === 'gallery' && 'Add Photo'}
        </span>
      </Button>
    </div>
  );
};

export default DynamicFormFields;
