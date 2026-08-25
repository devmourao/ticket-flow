-- Create custom types for strict data validation
CREATE TYPE user_role AS ENUM ('client', 'agent', 'admin');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create Profiles table (Links to Supabase Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'client' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Tickets table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Allow all authenticated users to read profiles (needed to display names/roles)
CREATE POLICY "Authenticated users can view profiles" ON profiles 
FOR SELECT TO authenticated USING (true);

-- TICKETS POLICIES
-- 1. Users can insert their own tickets
CREATE POLICY "Users can create tickets" ON tickets 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- 2. Clients can view their own tickets. Agents and Admins can view all tickets.
CREATE POLICY "Users can view relevant tickets" ON tickets 
FOR SELECT TO authenticated USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
);

-- 3. Clients can update their own tickets. Agents and Admins can update any ticket.
CREATE POLICY "Users can update relevant tickets" ON tickets 
FOR UPDATE TO authenticated USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent', 'admin'))
);