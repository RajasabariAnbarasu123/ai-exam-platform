-- ============================================================
-- AI Exam Platform - Sample Data
-- Run this script in Supabase SQL Editor AFTER init_schema.sql
-- ============================================================
-- Login Credentials:
--   Admin:  admin@aiexam.com      / Admin@123
--   User:   2k22cse123@kiot.ac.in / Sabari@123
-- ============================================================

-- ============================================================
-- 1. ADMIN USER (password: Admin@123)
-- ============================================================
-- BCrypt hash for 'Admin@123'
INSERT INTO users (id, full_name, email, password, role, is_verified, is_active, created_at, updated_at)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-admin0000001',
    'Platform Admin',
    'admin@aiexam.com',
    '$2a$10$LqYcerv8NKYQG0LzX7T4oOSBBGwVi8bKPqI3UpkXvHX/DZvB.GKWG',
    'ADMIN',
    TRUE,
    TRUE,
    NOW() - INTERVAL '30 days',
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    role = 'ADMIN',
    is_verified = TRUE,
    is_active = TRUE,
    updated_at = NOW();

-- ============================================================
-- 2. REGULAR USER (password: Sabari@123)
--    NOTE: If this user already exists, it just updates role/status
-- ============================================================
INSERT INTO users (id, full_name, email, password, role, is_verified, is_active, created_at, updated_at)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-user00000001',
    'Sabari',
    '2k22cse123@kiot.ac.in',
    '$2a$10$dXJ3SW6G7P50lGmMQD90E.F8bTbGCZbxPAcXZ4qWpGXHGkZcOqWqS',
    'USER',
    TRUE,
    TRUE,
    NOW() - INTERVAL '30 days',
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    is_verified = TRUE,
    is_active = TRUE,
    updated_at = NOW();

-- ============================================================
-- 3. EXAM HISTORY (10 records for the regular user)
--    Uses subquery to get user_id safely
-- ============================================================

-- Clean up any previously inserted sample history
DELETE FROM exam_history WHERE id LIKE 'h_a2b3c4-d5e6-7890-hist%'
                            OR id LIKE 'h10a2b3c-d5e6-7890-hist%';

-- Exam 1: Java Basics - Easy MCQ - Excellent (90%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h1a2b3c4-d5e6-7890-hist-000000000001', id,
    'Java Basics', 'EASY', 'MCQ', 10, 9, 1, 0, 90, 90.0, 420,
    'EXCELLENT', 'COMPLETED',
    'Great performance! You have a strong understanding of Java fundamentals including OOP concepts, data types, and control flow. Focus on exception handling and multithreading for further improvement.',
    NOW() - INTERVAL '25 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 2: Data Structures - Medium MCQ - Good (73%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h2a2b3c4-d5e6-7890-hist-000000000002', id,
    'Data Structures', 'MEDIUM', 'MCQ', 15, 11, 3, 1, 73, 73.3, 780,
    'GOOD', 'COMPLETED',
    'Good job! You understand arrays, stacks, and queues well. Review linked list operations, tree traversal algorithms (in-order, pre-order, post-order), and hash table collision handling.',
    NOW() - INTERVAL '22 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 3: Python Programming - Easy True/False - Excellent (100%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h3a2b3c4-d5e6-7890-hist-000000000003', id,
    'Python Programming', 'EASY', 'TRUE_FALSE', 10, 10, 0, 0, 100, 100.0, 300,
    'EXCELLENT', 'COMPLETED',
    'Perfect score! Outstanding knowledge of Python basics including syntax, data types, list comprehensions, and built-in functions. Challenge yourself with harder difficulty levels next time.',
    NOW() - INTERVAL '20 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 4: Database Management - Hard MCQ - Average (55%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h4a2b3c4-d5e6-7890-hist-000000000004', id,
    'Database Management', 'HARD', 'MCQ', 20, 11, 7, 2, 55, 55.0, 1200,
    'AVERAGE', 'COMPLETED',
    'You have a basic understanding of databases but struggled with advanced topics. Focus on normalization (3NF, BCNF), indexing strategies, transaction isolation levels, and writing complex JOIN queries.',
    NOW() - INTERVAL '18 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 5: Operating Systems - Medium Fill in Blank - Good (70%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h5a2b3c4-d5e6-7890-hist-000000000005', id,
    'Operating Systems', 'MEDIUM', 'FILL_IN_THE_BLANK', 10, 7, 2, 1, 70, 70.0, 600,
    'GOOD', 'COMPLETED',
    'Good understanding of OS concepts including process management and file systems. Review CPU scheduling algorithms (Round Robin, SJF, Priority), deadlock detection, and virtual memory paging.',
    NOW() - INTERVAL '15 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 6: Computer Networks - Hard MCQ - Needs Improvement (33%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h6a2b3c4-d5e6-7890-hist-000000000006', id,
    'Computer Networks', 'HARD', 'MCQ', 15, 5, 8, 2, 33, 33.3, 900,
    'NEEDS_IMPROVEMENT', 'COMPLETED',
    'This topic needs significant study. Focus on the OSI model layers, TCP vs UDP differences, IP addressing and subnetting, DNS resolution, and HTTP/HTTPS protocols. Start with easier questions first.',
    NOW() - INTERVAL '12 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 7: Web Development - Easy MCQ - Good (80%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h7a2b3c4-d5e6-7890-hist-000000000007', id,
    'Web Development', 'EASY', 'MCQ', 10, 8, 2, 0, 80, 80.0, 360,
    'GOOD', 'COMPLETED',
    'Good understanding of web development basics including HTML5 semantics and CSS selectors. Study CSS flexbox/grid layouts, JavaScript ES6+ features, and RESTful API design patterns.',
    NOW() - INTERVAL '10 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 8: Algorithms - Medium Short Answer - Average (50%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h8a2b3c4-d5e6-7890-hist-000000000008', id,
    'Algorithms', 'MEDIUM', 'SHORT_ANSWER', 8, 4, 3, 1, 50, 50.0, 960,
    'AVERAGE', 'COMPLETED',
    'Average performance. You understand basic sorting and searching. Focus on dynamic programming (knapsack, LCS), greedy algorithms, graph algorithms (Dijkstra, BFS/DFS), and Big-O complexity analysis.',
    NOW() - INTERVAL '7 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 9: Machine Learning - Hard MCQ - Good (73%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h9a2b3c4-d5e6-7890-hist-000000000009', id,
    'Machine Learning', 'HARD', 'MCQ', 15, 11, 3, 1, 73, 73.3, 1080,
    'GOOD', 'COMPLETED',
    'Impressive performance on a hard ML exam! Strong knowledge of supervised learning (regression, classification). Review unsupervised learning (clustering, PCA), neural network architectures, and model evaluation metrics.',
    NOW() - INTERVAL '3 days'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- Exam 10: Software Engineering - Medium MCQ - Excellent (90%)
INSERT INTO exam_history (id, user_id, topic, difficulty, question_type, number_of_questions, correct_answers, wrong_answers, skipped_answers, score, percentage, time_taken, performance_rating, status, ai_feedback, created_at)
SELECT 'h10a2b3c-d5e6-7890-hist-000000000010', id,
    'Software Engineering', 'MEDIUM', 'MCQ', 10, 9, 1, 0, 90, 90.0, 480,
    'EXCELLENT', 'COMPLETED',
    'Excellent understanding of software engineering! Strong knowledge of SDLC models, design patterns (Singleton, Factory, Observer), agile/scrum methodologies, and software testing strategies.',
    NOW() - INTERVAL '1 day'
FROM users WHERE email = '2k22cse123@kiot.ac.in';

-- ============================================================
-- VERIFICATION: Run these to confirm data
-- ============================================================
SELECT '--- USERS ---' AS section;
SELECT id, full_name, email, role, is_verified, is_active FROM users 
WHERE email IN ('admin@aiexam.com', '2k22cse123@kiot.ac.in');

SELECT '--- EXAM HISTORY ---' AS section;
SELECT id, topic, difficulty, question_type, score, percentage, performance_rating, status, created_at
FROM exam_history
WHERE user_id = (SELECT id FROM users WHERE email = '2k22cse123@kiot.ac.in')
ORDER BY created_at DESC;
