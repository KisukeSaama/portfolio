-- Project prose in a second language. The row itself stays the source language (English); this
-- column holds a map of language tag to the same fields translated, so a case study can be read in
-- French without giving it a second row, a second slug, or a second publication state to keep in
-- sync. An empty map is the normal state for a project nobody has translated yet.
ALTER TABLE project ADD COLUMN translations JSONB NOT NULL DEFAULT '{}'::jsonb;
