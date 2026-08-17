CREATE TABLE admin_user (
  id UUID PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role VARCHAR(32) NOT NULL CHECK (role = 'ADMIN'),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project (
  id UUID PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  short_description VARCHAR(280) NOT NULL,
  full_description TEXT NOT NULL,
  problem TEXT NOT NULL,
  context TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL,
  role_description TEXT NOT NULL,
  architecture TEXT NOT NULL DEFAULT '',
  status VARCHAR(32) NOT NULL,
  project_type VARCHAR(32) NOT NULL,
  feature_level VARCHAR(32) NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  visibility VARCHAR(32) NOT NULL,
  publication_status VARCHAR(32) NOT NULL,
  github_url VARCHAR(2048),
  demo_url VARCHAR(2048),
  seo_title VARCHAR(70),
  seo_description VARCHAR(170),
  open_graph_image_url VARCHAR(2048),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  version BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT project_status_check CHECK (status IN ('CONCEPT','IN_PROGRESS','MAINTAINED','COMPLETED')),
  CONSTRAINT project_type_check CHECK (project_type IN ('PERSONAL','TEAM','LEARNING')),
  CONSTRAINT project_feature_level_check CHECK (feature_level IN ('PRIMARY','SECONDARY')),
  CONSTRAINT project_visibility_check CHECK (visibility IN ('PUBLIC','PRIVATE')),
  CONSTRAINT project_publication_check CHECK (publication_status IN ('DRAFT','PUBLISHED','ARCHIVED'))
);

CREATE TABLE project_objective (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(500) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_technology (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(100) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_feature (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(500) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_decision (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(800) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_challenge (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(800) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_learning (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(800) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));
CREATE TABLE project_next_step (project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE, value VARCHAR(800) NOT NULL, sort_order INTEGER NOT NULL, PRIMARY KEY (project_id, sort_order));

CREATE TABLE project_media (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  media_type VARCHAR(32) NOT NULL CHECK (media_type IN ('COVER','VIDEO','POSTER','GALLERY')),
  object_key VARCHAR(512),
  external_url VARCHAR(2048),
  alt_text VARCHAR(300) NOT NULL,
  caption VARCHAR(500),
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT project_media_source_check CHECK ((object_key IS NOT NULL) <> (external_url IS NOT NULL))
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  action VARCHAR(64) NOT NULL,
  actor_id UUID REFERENCES admin_user(id) ON DELETE SET NULL,
  project_id UUID REFERENCES project(id) ON DELETE SET NULL,
  details JSONB,
  correlation_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_attempt (
  attempt_key VARCHAR(64) PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  blocked_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SPRING_SESSION (
  PRIMARY_ID CHAR(36) NOT NULL,
  SESSION_ID CHAR(36) NOT NULL,
  CREATION_TIME BIGINT NOT NULL,
  LAST_ACCESS_TIME BIGINT NOT NULL,
  MAX_INACTIVE_INTERVAL INT NOT NULL,
  EXPIRY_TIME BIGINT NOT NULL,
  PRINCIPAL_NAME VARCHAR(100),
  CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
);
CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);
CREATE TABLE SPRING_SESSION_ATTRIBUTES (
  SESSION_PRIMARY_ID CHAR(36) NOT NULL,
  ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
  ATTRIBUTE_BYTES BYTEA NOT NULL,
  CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
  CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
);

CREATE INDEX project_slug_idx ON project(slug);
CREATE INDEX project_status_idx ON project(status);
CREATE INDEX project_public_idx ON project(publication_status, visibility, archived_at);
CREATE INDEX project_order_idx ON project(display_order);
CREATE INDEX project_updated_idx ON project(updated_at DESC);
CREATE INDEX project_archived_idx ON project(archived_at);
CREATE INDEX project_media_project_idx ON project_media(project_id, media_type, sort_order);
CREATE INDEX audit_created_idx ON audit_log(created_at DESC);
CREATE INDEX audit_actor_idx ON audit_log(actor_id);
CREATE INDEX audit_project_idx ON audit_log(project_id);
