import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Gift, Building, PartyPopper, ArrowLeft, Sparkles, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MultiPagePreview from './MultiPagePreview';

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image_url: string;
  category_id: string;
  required_fields: any[];
}

const TemplateSelector = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplateData();
  }, []);

  const fetchTemplateData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('template_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('invitation_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (templatesError) throw templatesError;

      setCategories(categoriesData || []);
      setTemplates(templatesData || []);
      
      // Set wedding as default category
      const weddingCategory = categoriesData?.find(cat => cat.name === 'Wedding');
      if (weddingCategory) {
        setSelectedCategory(weddingCategory.id);
      }
    } catch (error: any) {
      toast.error('Failed to load templates');
      console.error('Template fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6" />;
      case 'Gift': return <Gift className="w-6 h-6" />;
      case 'Building': return <Building className="w-6 h-6" />;
      case 'PartyPopper': return <PartyPopper className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'wedding': return 'from-pink-500 to-red-500';
      case 'birthday': return 'from-blue-500 to-purple-500';
      case 'corporate': return 'from-gray-500 to-slate-600';
      case 'party': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredTemplates = templates.filter(template => 
    selectedCategory ? template.category_id === selectedCategory : true
  );

  const handleTemplateSelect = (template: Template) => {
    navigate(`/customize/${template.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Template
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Event Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-purple-500 bg-white shadow-lg' 
                    : 'bg-white/60 backdrop-blur-sm hover:bg-white/80'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${getCategoryColor(category.name)} flex items-center justify-center text-white`}>
                    {getCategoryIcon(category.icon)}
                  </div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Templates
            {selectedCategory && (
              <Badge variant="secondary" className="ml-2 rounded-full">
                {categories.find(cat => cat.id === selectedCategory)?.name}
              </Badge>
            )}
          </h2>
          
          {filteredTemplates.length === 0 ? (
            <Card className="text-center py-12 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates available</h3>
                <p className="text-gray-500">Templates for this category are coming soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                  <div className="p-4">
                    <MultiPagePreview 
                      templateId={template.id}
                      templateName={template.name}
                      onSelect={() => handleTemplateSelect(template)}
                    />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Use This Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
