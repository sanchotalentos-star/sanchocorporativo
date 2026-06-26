-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_trail_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper: get current user's org_id
CREATE OR REPLACE FUNCTION auth_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: users can read own, admins read all
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins read all profiles" ON profiles FOR SELECT USING (auth_role() = 'admin');
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL USING (auth_role() = 'admin');

-- Organizations: members read own org, admins read all
CREATE POLICY "Members read own org" ON organizations FOR SELECT USING (id = auth_org_id());
CREATE POLICY "Admins read all orgs" ON organizations FOR SELECT USING (auth_role() = 'admin');
CREATE POLICY "Admins manage orgs" ON organizations FOR ALL USING (auth_role() = 'admin');

-- Trails: published trails readable by members of authorized orgs
CREATE POLICY "Published trails readable" ON trails FOR SELECT
  USING (
    published = TRUE AND (
      auth_role() = 'admin' OR
      EXISTS (
        SELECT 1 FROM org_trail_access
        WHERE org_id = auth_org_id() AND trail_id = trails.id
      )
    )
  );
CREATE POLICY "Admins manage trails" ON trails FOR ALL USING (auth_role() = 'admin');

-- Trail modules: same access as trails
CREATE POLICY "Members read accessible trail modules" ON trail_modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trails t
      WHERE t.id = trail_id AND t.published = TRUE AND (
        auth_role() = 'admin' OR
        EXISTS (SELECT 1 FROM org_trail_access WHERE org_id = auth_org_id() AND trail_id = t.id)
      )
    )
  );

-- Content items: same access as trails
CREATE POLICY "Members read accessible content" ON content_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trail_modules tm
      JOIN trails t ON t.id = tm.trail_id
      WHERE tm.id = module_id AND t.published = TRUE AND (
        auth_role() = 'admin' OR
        EXISTS (SELECT 1 FROM org_trail_access WHERE org_id = auth_org_id() AND trail_id = t.id)
      )
    )
  );

-- User progress: users manage own, admins read all
CREATE POLICY "Users manage own progress" ON user_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins read all progress" ON user_progress FOR SELECT USING (auth_role() = 'admin');

-- User notes: users manage own
CREATE POLICY "Users manage own notes" ON user_notes FOR ALL USING (user_id = auth.uid());

-- User achievements: users read own
CREATE POLICY "Users read own achievements" ON user_achievements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage achievements" ON user_achievements FOR ALL USING (auth_role() = 'admin');

-- Points ledger: users read own
CREATE POLICY "Users read own points" ON points_ledger FOR SELECT USING (user_id = auth.uid());

-- Certificates: users read own
CREATE POLICY "Users read own certificates" ON certificates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage certificates" ON certificates FOR ALL USING (auth_role() = 'admin');

-- Live sessions: all authenticated users can read
CREATE POLICY "Authenticated users read lives" ON live_sessions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage lives" ON live_sessions FOR ALL USING (auth_role() = 'admin');

-- Live registrations: users manage own
CREATE POLICY "Users manage own registrations" ON live_registrations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins read all registrations" ON live_registrations FOR SELECT USING (auth_role() = 'admin');

-- Access requests: public insert, admins read/manage
CREATE POLICY "Anyone can submit access request" ON access_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins manage access requests" ON access_requests FOR ALL USING (auth_role() = 'admin');

-- Org trail access: admins manage
CREATE POLICY "Admins manage org trail access" ON org_trail_access FOR ALL USING (auth_role() = 'admin');
CREATE POLICY "Members read own org access" ON org_trail_access FOR SELECT USING (org_id = auth_org_id());
