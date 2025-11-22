/**
 * Availability Slots Table
 * 
 * Users can set when they're available for language exchange.
 * 
 * WEEKLY SCHEDULE:
 * - day_of_week: 0=Monday, 1=Tuesday, ..., 6=Sunday
 * - start_time/end_time: 24-hour format (HH:MM)
 * - repeat_weekly: Recurs every week
 * 
 * @example
 * User available every Monday 18:00-20:00:
 * day_of_week=0, start_time='18:00', end_time='20:00', repeat_weekly=true
 */

DROP TABLE IF EXISTS availability_slots CASCADE;

CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Day of week (0=Monday, 6=Sunday)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Time range
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Recurrence
  repeat_weekly BOOLEAN DEFAULT TRUE,
  
  -- Active/inactive
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (end_time > start_time)
);

-- Indexes
CREATE INDEX idx_availability_user ON availability_slots(user_id, day_of_week, is_active);
CREATE INDEX idx_availability_day ON availability_slots(day_of_week, is_active);

COMMENT ON TABLE availability_slots IS 'User availability schedule for language exchanges';
COMMENT ON COLUMN availability_slots.day_of_week IS '0=Monday, 1=Tuesday, ..., 6=Sunday';

