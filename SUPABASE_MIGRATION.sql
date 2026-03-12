-- Migration Script for School Biometric System - FIX
-- Run this in your Supabase SQL Editor

-- 1. Add new columns to the users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'graduate', 'suspended', 'discontinued', 'visitor')),
ADD COLUMN IF NOT EXISTS profile_image TEXT,
ADD COLUMN IF NOT EXISTS visitor_tag VARCHAR(100);

-- 2. Drop the existing view first to avoid column name mismatch errors
DROP VIEW IF EXISTS user_access_summary;

-- 3. Update the user_access_summary view to include new columns
CREATE OR REPLACE VIEW user_access_summary AS
SELECT 
    u.id_number,
    u.name,
    u.role,
    u.status,
    u.visitor_tag,
    COUNT(al.id) as total_accesses,
    MAX(al.timestamp) as last_access,
    AVG(al.confidence) FILTER (WHERE al.confidence IS NOT NULL) as avg_confidence
FROM users u
LEFT JOIN access_logs al ON u.id_number = al.user_id
GROUP BY u.id_number, u.name, u.role, u.status, u.visitor_tag
ORDER BY total_accesses DESC;
