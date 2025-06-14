
-- Create users table for authentication (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create template categories table
CREATE TABLE public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invitation templates table
CREATE TABLE public.invitation_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.template_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  required_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  styling_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update wedding_invitations table to support multi-user and templates
ALTER TABLE public.wedding_invitations 
ADD COLUMN user_id UUID REFERENCES public.users(id),
ADD COLUMN template_id UUID REFERENCES public.invitation_templates(id),
ADD COLUMN title TEXT DEFAULT 'Our Wedding',
ADD COLUMN is_published BOOLEAN DEFAULT false,
ADD COLUMN custom_url_slug TEXT,
ADD COLUMN invitation_data JSONB DEFAULT '{}'::jsonb;

-- Update guests table to link to specific invitations properly
ALTER TABLE public.guests 
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Create user invitations tracking table (for invited section)
CREATE TABLE public.user_guest_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id),
  invitation_id UUID NOT NULL REFERENCES public.wedding_invitations(id),
  guest_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  invitation_title TEXT NOT NULL,
  hosts_names TEXT NOT NULL,
  invitation_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial template categories
INSERT INTO public.template_categories (name, description, icon) VALUES
('Wedding', 'Beautiful wedding invitation templates', 'Heart'),
('Birthday', 'Fun birthday party invitations', 'Gift'),
('Corporate', 'Professional event invitations', 'Building'),
('Party', 'Celebration and party invitations', 'PartyPopper');

-- Insert the current template as the first wedding template
INSERT INTO public.invitation_templates (category_id, name, description, preview_image_url, required_fields) VALUES
((SELECT id FROM public.template_categories WHERE name = 'Wedding'), 
 'Traditional Hindu Wedding', 
 'Elegant traditional Hindu wedding invitation with religious elements and family details',
 '/lovable-uploads/f002c96a-d091-4373-9cc7-72487af38606.png',
 '[
   {"field": "bride_first_name", "label": "Bride First Name", "type": "text", "required": true},
   {"field": "bride_last_name", "label": "Bride Last Name", "type": "text", "required": true},
   {"field": "groom_first_name", "label": "Groom First Name", "type": "text", "required": true},
   {"field": "groom_last_name", "label": "Groom Last Name", "type": "text", "required": true},
   {"field": "bride_father", "label": "Bride Father Name", "type": "text", "required": true},
   {"field": "bride_mother", "label": "Bride Mother Name", "type": "text", "required": true},
   {"field": "groom_father", "label": "Groom Father Name", "type": "text", "required": true},
   {"field": "groom_mother", "label": "Groom Mother Name", "type": "text", "required": true},
   {"field": "wedding_date", "label": "Wedding Date", "type": "date", "required": true},
   {"field": "wedding_time", "label": "Wedding Time", "type": "time", "required": true},
   {"field": "wedding_venue", "label": "Wedding Venue", "type": "text", "required": true},
   {"field": "wedding_address", "label": "Wedding Address", "type": "textarea", "required": true},
   {"field": "couple_image_url", "label": "Couple Photo", "type": "image", "required": false},
   {"field": "contact_phone", "label": "Contact Phone", "type": "tel", "required": true},
   {"field": "contact_email", "label": "Contact Email", "type": "email", "required": true}
 ]'::jsonb);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_guest_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Template categories and templates are public (read-only)
CREATE POLICY "Anyone can view template categories" ON public.template_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view invitation templates" ON public.invitation_templates FOR SELECT USING (true);

-- Users can manage their own invitations
CREATE POLICY "Users can view own invitations" ON public.wedding_invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create invitations" ON public.wedding_invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON public.wedding_invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON public.wedding_invitations FOR DELETE USING (auth.uid() = user_id);

-- Public can view published invitations
CREATE POLICY "Anyone can view published invitations" ON public.wedding_invitations FOR SELECT USING (is_published = true);

-- Users can manage their own guests
CREATE POLICY "Users can view own guests" ON public.guests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create guests" ON public.guests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own guests" ON public.guests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own guests" ON public.guests FOR DELETE USING (auth.uid() = user_id);

-- Users can view their guest invitation records
CREATE POLICY "Users can view own guest invitations" ON public.user_guest_invitations FOR SELECT USING (auth.uid() = user_id);

-- Create trigger to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
