-- Migration 008: Setup Concurrency Lock

CREATE TYPE setup_status AS ENUM ('not_started', 'initializing', 'completed');

CREATE TABLE IF NOT EXISTS setup_state (
  id boolean PRIMARY KEY DEFAULT true,
  status setup_status DEFAULT 'not_started',
  last_attempt_at timestamptz,
  CONSTRAINT single_row CHECK (id = true)
);

-- Insert the initial state
INSERT INTO setup_state (id, status, last_attempt_at) 
VALUES (true, 'not_started', null)
ON CONFLICT (id) DO NOTHING;
