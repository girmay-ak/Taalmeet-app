/**
 * Notifications Table
 * 
 * Stores in-app notifications for users.
 * 
 * NOTIFICATION TYPES:
 * - new_message: Received a message
 * - new_match: Found a compatible partner
 * - connection_request: Someone wants to connect
 * - connection_accepted: Connection accepted
 * - new_review: Received a review
 * - partner_available: Partner is now available
 * - profile_view: Someone viewed your profile (premium)
 * - system: System announcements
 */

DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Notification type
  type VARCHAR(50) NOT NULL,
  
  -- Content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Additional data (JSON)
  data JSONB,
  
  -- Link (deep link to relevant screen)
  link VARCHAR(255),
  
  -- Read status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE  -- Optional expiration
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) 
  WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(user_id, type);
CREATE INDEX idx_notifications_expired ON notifications(expires_at) 
  WHERE expires_at IS NOT NULL;

-- Auto-delete expired notifications (optional)
CREATE OR REPLACE FUNCTION delete_expired_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE notifications IS 'In-app notifications for users';
COMMENT ON COLUMN notifications.data IS 'Additional JSON data for the notification';
COMMENT ON COLUMN notifications.link IS 'Deep link URL to open relevant screen';

