-- School Biometric Access System - Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Create users table for storing registered users and face descriptors
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_number VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'lecturer', 'staff')),
    email VARCHAR(255),
    face_descriptor FLOAT8[] NOT NULL, -- Stores 128-dimensional face descriptor
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create access_logs table for tracking all access attempts
CREATE TABLE IF NOT EXISTS access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    action VARCHAR(50) NOT NULL CHECK (action IN ('access_granted', 'access_denied', 'registered')),
    confidence FLOAT8, -- Recognition confidence percentage
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_id_number ON users(id_number);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_action ON access_logs(action);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
-- These policies allow all operations - you should restrict in production

-- Users table policies
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON users
    FOR DELETE USING (true);

-- Access logs policies
CREATE POLICY "Enable read access for all access logs" ON access_logs
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all access logs" ON access_logs
    FOR INSERT WITH CHECK (true);

-- Create a view for daily statistics
CREATE OR REPLACE VIEW daily_access_stats AS
SELECT 
    DATE(timestamp) as access_date,
    COUNT(*) as total_accesses,
    COUNT(*) FILTER (WHERE action = 'access_granted') as granted,
    COUNT(*) FILTER (WHERE action = 'access_denied') as denied,
    COUNT(DISTINCT user_id) FILTER (WHERE action = 'access_granted') as unique_users
FROM access_logs
GROUP BY DATE(timestamp)
ORDER BY access_date DESC;

-- Create a view for user access summary
CREATE OR REPLACE VIEW user_access_summary AS
SELECT 
    u.id_number,
    u.name,
    u.role,
    COUNT(al.id) as total_accesses,
    MAX(al.timestamp) as last_access,
    AVG(al.confidence) FILTER (WHERE al.confidence IS NOT NULL) as avg_confidence
FROM users u
LEFT JOIN access_logs al ON u.id_number = al.user_id
GROUP BY u.id_number, u.name, u.role
ORDER BY total_accesses DESC;

-- Insert sample data (optional - remove if not needed)
-- INSERT INTO users (name, id_number, role, email, face_descriptor) VALUES
-- ('John Doe', 'STU001', 'student', 'john@school.edu', ARRAY[0.1, 0.2, 0.3, /* ... 128 values */]::FLOAT8[]),
-- ('Jane Smith', 'LEC001', 'lecturer', 'jane@school.edu', ARRAY[0.2, 0.3, 0.4, /* ... 128 values */]::FLOAT8[]);

-- Function to clean old logs (optional)
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM access_logs
    WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- You can schedule this function to run periodically:
-- SELECT cleanup_old_logs(90); -- Keeps last 90 days of logs
