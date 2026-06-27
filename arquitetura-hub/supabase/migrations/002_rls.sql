-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilar_acoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- KPI entries policies
CREATE POLICY "Users can view own kpis" ON public.kpi_entries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all kpis" ON public.kpi_entries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can insert own kpis" ON public.kpi_entries
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own kpis" ON public.kpi_entries
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own kpis" ON public.kpi_entries
  FOR DELETE USING (user_id = auth.uid());

-- Pilares policies
CREATE POLICY "Users can view own pilares" ON public.pilares
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all pilares" ON public.pilares
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can manage own pilares" ON public.pilares
  FOR ALL USING (user_id = auth.uid());

-- Pilar acoes policies
CREATE POLICY "Users can view own pilar acoes" ON public.pilar_acoes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.pilares WHERE id = pilar_id AND user_id = auth.uid())
  );

CREATE POLICY "Admin can view all pilar acoes" ON public.pilar_acoes
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can manage own pilar acoes" ON public.pilar_acoes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.pilares WHERE id = pilar_id AND user_id = auth.uid())
  );

-- Eventos policies
CREATE POLICY "Users can view own eventos" ON public.eventos
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can view all eventos" ON public.eventos
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can manage own eventos" ON public.eventos
  FOR ALL USING (user_id = auth.uid());

-- Account requests policies
CREATE POLICY "Anyone can insert account request" ON public.account_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all account requests" ON public.account_requests
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admin can update account requests" ON public.account_requests
  FOR UPDATE USING (public.is_admin());
