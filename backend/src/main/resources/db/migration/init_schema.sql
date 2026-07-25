-- ============================================================
-- AI Exam Platform - Full Database Schema
-- Run this script in Supabase SQL Editor to create all tables
-- ============================================================

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- EXAM HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS exam_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    question_type VARCHAR(30) NOT NULL CHECK (question_type IN ('MCQ', 'TRUE_FALSE', 'FILL_IN_THE_BLANK', 'SHORT_ANSWER', 'CODING')),
    number_of_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    wrong_answers INTEGER NOT NULL DEFAULT 0,
    skipped_answers INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    time_taken INTEGER NOT NULL DEFAULT 0,
    performance_rating VARCHAR(20) CHECK (performance_rating IN ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'FAILED')),
    ai_feedback TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_exam_history_user_id ON exam_history(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_history_created_at ON exam_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_history_topic ON exam_history(topic);
CREATE INDEX IF NOT EXISTS idx_exam_history_difficulty ON exam_history(difficulty);
CREATE INDEX IF NOT EXISTS idx_exam_history_status ON exam_history(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Run the queries below to verify tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT COUNT(*) FROM users;
-- SELECT COUNT(*) FROM exam_history;
