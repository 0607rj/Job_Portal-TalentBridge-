import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: './backend/.env' });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env' });
}

const seedJobs = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a recruiter to assign jobs to
    const recruiter = await User.findOne({ role: 'recruiter' });
    if (!recruiter) {
      console.error('No recruiter found in database. Please create a recruiter user first.');
      process.exit(1);
    }

    console.log(`Using recruiter: ${recruiter.name} (${recruiter.email})`);

    // Read dummy jobs
    let jobsPath = path.join(process.cwd(), 'dummy_jobs.json');
    if (!fs.existsSync(jobsPath)) {
        jobsPath = path.join(process.cwd(), '..', 'dummy_jobs.json');
    }
    
    if (!fs.existsSync(jobsPath)) {
        console.error('dummy_jobs.json not found in root directory or parent directory.');
        process.exit(1);
    }
    const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));

    // Prepare jobs with recruiter ID
    const jobsToInsert = jobsData.map(job => ({
      ...job,
      postedBy: recruiter._id,
      company: job.company, // Use company name from JSON
      applicationDeadline: new Date(job.applicationDeadline)
    }));

    // Clear existing jobs (optional, better to append or prompt)
    // await Job.deleteMany({}); 

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully seeded ${jobsToInsert.length} jobs.`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedJobs();
