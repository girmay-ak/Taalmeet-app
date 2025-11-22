/**
 * Reports Table
 * 
 * Users can report inappropriate behavior.
 * Reviewed by moderation team.
 * 
 * REPORT REASONS:
 * - spam: Spam or scam
 * - inappropriate: Inappropriate behavior
 * - fake: Fake profile
 * - harassment: Harassment
 * - safety: Safety concern
 * - other: Other (requires description)
 */

DROP TABLE IF EXISTS reports CASCADE;

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Who reported
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  
  -- Who was reported
  reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Report details
  reason VARCHAR(50) NOT NULL CHECK (
    reason IN ('spam', 'inappropriate', 'fake', 'harassment', 'safety', 'other')
  ),
  description TEXT NOT NULL,
  
  -- Evidence (array of image URLs)
  evidence_urls TEXT[],
  
  -- Moderation status
  status VARCHAR(20) DEFAULT 'pending' CHECK (
    status IN ('pending', 'reviewed', 'resolved', 'dismissed')
  ),
  
  -- Moderator notes (internal only)
  moderator_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_reported_user ON reports(reported_user_id);
CREATE INDEX idx_reports_status ON reports(status, created_at DESC);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);

COMMENT ON TABLE reports IS 'User reports for moderation';
COMMENT ON COLUMN reports.evidence_urls IS 'Array of screenshot URLs as evidence';
COMMENT ON COLUMN reports.moderator_notes IS 'Internal notes for moderation team';

