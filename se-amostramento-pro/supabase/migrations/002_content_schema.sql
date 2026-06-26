-- Content Schema: Trails, Modules, Content Items, Lives

-- Trail categories
CREATE TYPE trail_category AS ENUM ('comunicacao', 'lideranca', 'negociacao', 'apresentacao', 'escrita');
CREATE TYPE trail_level AS ENUM ('iniciante', 'intermediario', 'avancado');
CREATE TYPE content_type AS ENUM ('video', 'pdf', 'audio', 'slides');

-- Trails
CREATE TABLE trails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category trail_category NOT NULL,
  level trail_level NOT NULL DEFAULT 'iniciante',
  thumbnail_url TEXT,
  instructor TEXT,
  instructor_bio TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trail modules
CREATE TABLE trail_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Content items
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES trail_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type content_type NOT NULL DEFAULT 'video',
  url TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Org <-> Trail access matrix
CREATE TABLE org_trail_access (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  trail_id UUID NOT NULL REFERENCES trails(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES profiles(id),
  PRIMARY KEY (org_id, trail_id)
);

-- Live sessions
CREATE TYPE live_status AS ENUM ('upcoming', 'live', 'ended');

CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT NOT NULL,
  instructor_avatar_url TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status live_status NOT NULL DEFAULT 'upcoming',
  max_attendees INTEGER NOT NULL DEFAULT 300,
  meeting_url TEXT,
  recording_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Live registrations
CREATE TABLE live_registrations (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  live_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attended BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (user_id, live_id)
);

CREATE TRIGGER trails_updated_at
  BEFORE UPDATE ON trails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
