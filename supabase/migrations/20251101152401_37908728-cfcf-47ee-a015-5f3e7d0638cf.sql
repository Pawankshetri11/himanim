-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage settings"
ON public.site_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- About section table
CREATE TABLE public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "About is viewable by everyone"
ON public.about FOR SELECT
USING (true);

CREATE POLICY "Admins can manage about"
ON public.about FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Skill categories table
CREATE TABLE public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skill categories viewable by everyone"
ON public.skill_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage skill categories"
ON public.skill_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills viewable by everyone"
ON public.skills FOR SELECT
USING (true);

CREATE POLICY "Admins can manage skills"
ON public.skills FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Tech stack table
CREATE TABLE public.tech_stack (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tech_stack ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tech stack viewable by everyone"
ON public.tech_stack FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tech stack"
ON public.tech_stack FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Project categories table
CREATE TABLE public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project categories viewable by everyone"
ON public.project_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage project categories"
ON public.project_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  live_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects viewable by everyone"
ON public.projects FOR SELECT
USING (true);

CREATE POLICY "Admins can manage projects"
ON public.projects FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Experience table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  location TEXT,
  logo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences viewable by everyone"
ON public.experiences FOR SELECT
USING (true);

CREATE POLICY "Admins can manage experiences"
ON public.experiences FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Contact info table
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  location TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact info viewable by everyone"
ON public.contact_info FOR SELECT
USING (true);

CREATE POLICY "Admins can manage contact info"
ON public.contact_info FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active resume viewable by everyone"
ON public.resumes FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage resumes"
ON public.resumes FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true),
  ('skill-logos', 'skill-logos', true),
  ('company-logos', 'company-logos', true),
  ('resumes', 'resumes', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Admins can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Admins can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for skill logos
CREATE POLICY "Skill logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'skill-logos');

CREATE POLICY "Admins can upload skill logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'skill-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skill logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'skill-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skill logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'skill-logos' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for company logos
CREATE POLICY "Company logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

CREATE POLICY "Admins can upload company logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update company logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete company logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'company-logos' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for resumes
CREATE POLICY "Resumes are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');

CREATE POLICY "Admins can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update resumes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_about_updated_at BEFORE UPDATE ON public.about
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();