// Generate BCrypt hashes for the sample users
const crypto = require('crypto');

// Simple BCrypt-compatible hash generator isn't available in vanilla Node.js
// Print instructions instead
console.log('=== BCrypt Hash Generator ===');
console.log('');
console.log('To generate proper BCrypt hashes for the admin user, run this');
console.log('in your Spring Boot application or use the signup API:');
console.log('');
console.log('Option 1: Use the signup API to create the admin user');
console.log('  POST http://localhost:8080/api/auth/signup');
console.log('  Body: { "fullName": "Platform Admin", "email": "admin@aiexam.com", "password": "Admin@123" }');
console.log('');
console.log('Option 2: Update role to ADMIN after signup');
console.log('  UPDATE users SET role = \'ADMIN\', is_verified = TRUE WHERE email = \'admin@aiexam.com\';');
console.log('');
console.log('The user 2k22cse123@kiot.ac.in already exists, so the sample_data.sql');
console.log('only needs to insert history records for them.');
