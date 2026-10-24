-- =====================================================================================
-- KAAMCONNECT: PRODUCTION POSTGRESQL SCHEMA WITH RLS & TRIGGERS
-- =====================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS / TYPES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'worker', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE availability_type AS ENUM ('available', 'busy', 'offline');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_type AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_type AS ENUM ('pending', 'negotiating', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE offer_status_type AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  locality TEXT,
  city TEXT DEFAULT 'Bengaluru',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Tool',
  base_price_estimate NUMERIC(10,2) DEFAULT 350.00 CHECK (base_price_estimate >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. WORKERS TABLE
CREATE TABLE IF NOT EXISTS public.workers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  bio TEXT,
  experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
  starting_rate NUMERIC(10,2) NOT NULL CHECK (starting_rate >= 0),
  service_radius_km NUMERIC(5,2) DEFAULT 10.00 CHECK (service_radius_km > 0),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  availability_status availability_type DEFAULT 'available',
  verification_status verification_type DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. WORKER SKILLS
CREATE TABLE IF NOT EXISTS public.worker_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  skill_level TEXT DEFAULT 'intermediate' CHECK (skill_level IN ('beginner', 'intermediate', 'expert')),
  UNIQUE(worker_id, service_id)
);

-- 7. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  worker_id UUID NOT NULL REFERENCES public.workers(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  job_description TEXT NOT NULL,
  service_address TEXT NOT NULL,
  locality TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  scheduled_at TIMESTAMPTZ NOT NULL,
  customer_budget NUMERIC(10,2) CHECK (customer_budget > 0),
  proposed_price NUMERIC(10,2) NOT NULL CHECK (proposed_price > 0),
  agreed_price NUMERIC(10,2) CHECK (agreed_price > 0),
  status booking_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- 8. PRICE OFFERS TABLE (Negotiation Thread)
CREATE TABLE IF NOT EXISTS public.price_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  offered_by UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  message TEXT,
  status offer_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  worker_id UUID NOT NULL REFERENCES public.workers(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ISSUE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.issue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES public.profiles(id),
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. INDEXES FOR HIGH-PERFORMANCE SEARCH
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_worker_skills_worker ON public.worker_skills(worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_skills_service ON public.worker_skills(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON public.bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_price_offers_booking ON public.price_offers(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_worker ON public.reviews(worker_id);

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Services Policies
CREATE POLICY "Services are viewable by everyone" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.is_admin());

-- Workers Policies
CREATE POLICY "Workers are viewable by everyone" ON public.workers
  FOR SELECT USING (true);

CREATE POLICY "Workers can update their own profile" ON public.workers
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Bookings Policies
CREATE POLICY "Participants and admins can view bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() = worker_id OR 
    public.is_admin()
  );

CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants and admins can update bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = customer_id OR 
    auth.uid() = worker_id OR 
    public.is_admin()
  );

-- Price Offers Policies
CREATE POLICY "Booking participants can view price offers" ON public.price_offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = price_offers.booking_id
        AND (b.customer_id = auth.uid() OR b.worker_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Participants can submit price offers" ON public.price_offers
  FOR INSERT WITH CHECK (
    auth.uid() = offered_by AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = price_offers.booking_id
        AND (b.customer_id = auth.uid() OR b.worker_id = auth.uid())
    )
  );

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customer can submit review for completed booking" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = reviews.booking_id
        AND b.customer_id = auth.uid()
        AND b.status = 'completed'
    )
  );

-- Issue Reports Policies
CREATE POLICY "Reporters and admins can view issues" ON public.issue_reports
  FOR SELECT USING (auth.uid() = reported_by OR public.is_admin());

CREATE POLICY "Users can report issues" ON public.issue_reports
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can update issues" ON public.issue_reports
  FOR UPDATE USING (public.is_admin());
