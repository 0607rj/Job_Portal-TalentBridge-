/**
 * Test script for ATS Resume Analyzer
 * This demonstrates how to use the ATS analysis functions
 */

import { analyzeResume } from './utils/atsAnalyzer.js';

// Sample Resume Text
const sampleResume = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced Full-Stack Software Engineer with 5+ years of expertise in building scalable web applications.
Strong background in JavaScript, React, Node.js, and cloud technologies.

SKILLS
Languages: JavaScript, Python, TypeScript, Java
Frontend: React, Angular, HTML, CSS, Tailwind CSS
Backend: Node.js, Express, Django, REST API, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins
Tools: Git, Agile, Scrum

EXPERIENCE

Senior Software Engineer | Tech Corp | Jan 2021 - Present
• Developed and deployed 15+ microservices using Node.js and Express, improving system scalability by 40%
• Led a team of 5 developers in implementing new features, reducing delivery time by 30%
• Implemented automated testing pipelines, increasing code coverage from 60% to 95%
• Optimized database queries reducing response time by 50%

Software Engineer | StartupXYZ | Jun 2018 - Dec 2020
• Built responsive web applications using React and Redux serving 100,000+ users
• Designed and implemented RESTful APIs handling 1M+ requests per day
• Collaborated with cross-functional teams to deliver projects 20% ahead of schedule
• Mentored 3 junior developers in best practices and code reviews

EDUCATION

Bachelor of Science in Computer Science
University of Technology | 2014 - 2018
GPA: 3.8/4.0

PROJECTS

E-Commerce Platform
• Developed full-stack e-commerce platform using MERN stack
• Integrated payment gateway processing $500K+ in transactions
• Technologies: React, Node.js, MongoDB, Stripe API

Real-Time Chat Application
• Built real-time chat application using WebSocket and Socket.io
• Supports 1000+ concurrent users with 99.9% uptime
• Technologies: React, Node.js, Socket.io, Redis
`;

// Sample Job Description
const sampleJobDescription = `
Senior Full-Stack Developer

We are seeking an experienced Senior Full-Stack Developer to join our team.

Requirements:
- 5+ years of experience in software development
- Strong proficiency in JavaScript, React, and Node.js
- Experience with MongoDB and PostgreSQL
- Knowledge of AWS and Docker
- Experience with CI/CD pipelines
- Strong problem-solving and communication skills
- Experience with Agile/Scrum methodologies

Responsibilities:
- Design and develop scalable web applications
- Lead technical discussions and mentor junior developers
- Implement best practices for code quality and testing
- Collaborate with product team to deliver features
- Optimize application performance
- Participate in code reviews

Skills:
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, CI/CD, Git, REST API, GraphQL, Agile
`;

console.log('='.repeat(80));
console.log('ATS RESUME ANALYZER TEST');
console.log('='.repeat(80));
console.log();

// Test 1: Job-Based Analysis
console.log('TEST 1: JOB-BASED ANALYSIS');
console.log('-'.repeat(80));
const jobBasedResult = analyzeResume(sampleResume, sampleJobDescription);
console.log(JSON.stringify(jobBasedResult, null, 2));
console.log();

// Test 2: General Analysis (No Job Description)
console.log('TEST 2: GENERAL RESUME ANALYSIS');
console.log('-'.repeat(80));
const generalResult = analyzeResume(sampleResume, null);
console.log(JSON.stringify(generalResult, null, 2));
console.log();

// Test 3: Poor Resume Example
console.log('TEST 3: POOR RESUME ANALYSIS');
console.log('-'.repeat(80));
const poorResume = `
Name: Jane Smith
Email: jane@email.com

I worked at some companies doing software stuff. I know programming and have used computers a lot.
I went to college and got a degree. I like to code and learn new things. Looking for a job in tech.
`;

const poorResult = analyzeResume(poorResume, sampleJobDescription);
console.log(JSON.stringify(poorResult, null, 2));
console.log();

console.log('='.repeat(80));
console.log('TESTS COMPLETED');
console.log('='.repeat(80));
