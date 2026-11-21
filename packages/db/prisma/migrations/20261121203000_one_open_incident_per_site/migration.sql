CREATE UNIQUE INDEX IF NOT EXISTS one_open_incident_per_site
  ON "Incident" ("websiteId") WHERE "endedAt" IS NULL;