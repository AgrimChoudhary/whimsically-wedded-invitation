
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface FormField {
  field: string;
  label: string;
  type: string;
  required: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  required_fields: FormField[];
}

const CustomizationForm = () => {
  const { user } = useAuth();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;

      setTemplate(data);
      
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      data.required_fields.forEach((field: FormField) => {
        initialData[field.field] = '';
      });
      setFormData(initialData);
    } catch (error: any) {
      toast.error('Failed to load template');
      console.error('Template fetch error:', error);
      navigate('/templates');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderFormField = (field: FormField) => {
    const value = formData[field.field] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.field}
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
            className="min-h-[80px] border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
      
      case 'date':
        return (
          <Input
            id={field.field}
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            required={field.required}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
      
      case 'time':
        return (
          <Input
            id={field.field}
            type="time"
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            required={field.required}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
      
      case 'tel':
        return (
          <Input
            id={field.field}
            type="tel"
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder="Enter phone number"
            required={field.required}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
      
      case 'email':
        return (
          <Input
            id={field.field}
            type="email"
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder="Enter email address"
            required={field.required}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              id={field.field}
              type="url"
              value={value}
              onChange={(e) => handleInputChange(field.field, e.target.value)}
              placeholder="Enter image URL"
              required={field.required}
              className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
            />
            <p className="text-sm text-gray-500">Provide a URL to your image or upload it to an image hosting service</p>
          </div>
        );
      
      default:
        return (
          <Input
            id={field.field}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.field, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
          />
        );
    }
  };

  const handleSave = async (isDraft = true) => {
    setSaving(true);
    
    try {
      // Create invitation record
      const invitationData = {
        user_id: user?.id,
        template_id: templateId,
        title: formData.bride_first_name && formData.groom_first_name 
          ? `${formData.groom_first_name} & ${formData.bride_first_name}'s Wedding`
          : 'Wedding Invitation',
        wedding_date: formData.wedding_date,
        wedding_time: formData.wedding_time,
        wedding_venue: formData.wedding_venue,
        wedding_address: formData.wedding_address,
        bride_name: `${formData.bride_first_name} ${formData.bride_last_name}`.trim(),
        groom_name: `${formData.groom_first_name} ${formData.groom_last_name}`.trim(),
        bride_parents: `${formData.bride_father} & ${formData.bride_mother}`.trim(),
        groom_parents: `${formData.groom_father} & ${formData.groom_mother}`.trim(),
        couple_image_url: formData.couple_image_url,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        is_published: !isDraft,
        invitation_data: formData
      };

      const { data: invitation, error } = await supabase
        .from('wedding_invitations')
        .insert(invitationData)
        .select()
        .single();

      if (error) throw error;

      toast.success(isDraft ? 'Invitation saved as draft!' : 'Invitation published successfully!');
      
      if (isDraft) {
        navigate('/dashboard');
      } else {
        navigate(`/preview/${invitation.id}`);
      }
    } catch (error: any) {
      toast.error('Failed to save invitation');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading customization form...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Template not found</p>
          <Button onClick={() => navigate('/templates')} className="mt-4">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/templates')}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Templates
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-800">Customize Your Invitation</h1>
                <p className="text-sm text-gray-600">{template.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
                variant="outline"
                className="flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Draft
              </Button>
              
              <Button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                Preview & Publish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {template.name}
            </CardTitle>
            <p className="text-gray-600">{template.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form className="space-y-6">
              {template.required_fields.map((field, index) => (
                <div key={field.field} className="space-y-2">
                  <Label htmlFor={field.field} className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderFormField(field)}
                </div>
              ))}
            </form>

            <div className="pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📝 Guest Name Placeholder</h3>
                <p className="text-blue-700 text-sm">
                  Your invitation will automatically include a <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">{'{guest-name}'}</code> placeholder 
                  that gets replaced with each guest's name when they view their personalized invitation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomizationForm;
