#!/usr/bin/env node

/**
 * JobSurMesure API Server
 * Serves job data from SQLite database
 */

const express = require('express');
const cors = require('cors');
const DatabaseManager = require('./database');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database instance
let dbManager = null;

// Generate unique ID
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

// Initialize
app.listen(PORT, async () => {
    console.log(`API Server running on port ${PORT}`);

    // Initialize database
    dbManager = new DatabaseManager();
    await dbManager.connect();
    await dbManager.initializeSchema();

    console.log('Database connected');
});

// ========== USER ROUTES ==========

// POST /api/users/register - Register new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, firstName, lastName, password, dateOfBirth, profile } = req.body;

        // Check if email exists
        const existingUser = await dbManager.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email déjà utilisé' });
        }

        const user = {
            id: generateId('user'),
            email,
            firstName,
            lastName,
            dateOfBirth,
            profile: profile || {},
            createdAt: new Date().toISOString()
        };

        await dbManager.insertUser(user);

        // Create user profile
        const userProfile = {
            id: generateId('profile'),
            userId: user.id,
            school: '',
            studyLevel: 'bac+3',
            skills: [],
            languages: [],
            cvUrl: '',
            coverLetterUrl: '',
            location: '',
            preferredLocations: [],
            preferredTypes: ['stage', 'alternance'],
            preferredDomains: []
        };

        await dbManager.insertJob(userProfile); // Using insertJob for user profile for now

        res.json({
            success: true,
            user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/users/login - Login user
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
        }

        const user = await dbManager.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ success: false, error: 'Identifiants invalides' });
        }

        // For demo, any password works (in production, hash and verify)
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                profile: user.profile || {}
            }
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await dbManager.getUserById(req.params.id);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PUT /api/users/:id - Update user profile
app.put('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { profile } = req.body;

        const user = await dbManager.getUserById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const updatedUser = {
            ...user,
            profile: { ...user.profile, ...profile }
        };

        await dbManager.insertUser(updatedUser);

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== APPLICATION ROUTES ==========

// POST /api/applications - Create new application
app.post('/api/applications', async (req, res) => {
    try {
        const { jobId, userId, status, customCvUrl, customCoverLetterUrl, notes } = req.body;

        if (!jobId || !userId) {
            return res.status(400).json({ success: false, error: 'Job ID and User ID are required' });
        }

        const application = {
            id: generateId('app'),
            jobId,
            userId,
            status: status || 'draft',
            customCvUrl: customCvUrl || '',
            customCoverLetterUrl: customCoverLetterUrl || '',
            appliedAt: new Date().toISOString(),
            notes: notes || ''
        };

        await dbManager.insertApplication(application);

        res.json({ success: true, application });
    } catch (err) {
        console.error('Error creating application:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/applications/:userId - Get user applications
app.get('/api/applications/:userId', async (req, res) => {
    try {
        const applications = await dbManager.getApplications(req.params.userId);
        res.json({ success: true, applications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== JOB ROUTES ==========

// GET /api/jobs - Search jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const {
            query,
            location,
            type = 'all',
            studyLevel,
            domain,
            remote
        } = req.query;

        const filters = {
            query: query || undefined,
            location: location || undefined,
            type: type === 'all' ? undefined : type,
            studyLevel: studyLevel || undefined,
            domain: domain || undefined,
            remote: remote === 'true' ? true : (remote === 'false' ? false : undefined)
        };

        const jobs = await dbManager.getJobs(filters);
        res.json({ success: true, jobs });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/jobs/:id - Get single job
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await dbManager.getJobById(req.params.id);
        if (job) {
            res.json({ success: true, job });
        } else {
            res.status(404).json({ success: false, error: 'Job not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/stats - Get database stats
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await dbManager.updateStats();
        res.json({
            success: true,
            stats: {
                totalJobs: stats.totalJobs,
                totalCompanies: stats.totalCompanies,
                totalApplications: stats.totalApplications
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/domains - Get domain list
app.get('/api/domains', (req, res) => {
    const domains = [
        'Tech & IT',
        'Marketing',
        'Finance',
        'Data Science',
        'Consulting',
        'Ressources Humaines',
        'Design',
        'Commerce',
        'Communication',
        'Juridique',
        'Health',
        'Education',
        'Engineering',
        'Science',
        'Art',
        'Media',
        'Hospitality',
        'Transport',
        'Public Service',
        'International'
    ];
    res.json({ success: true, domains });
});

// GET /api/study-levels - Get study levels
app.get('/api/study-levels', (req, res) => {
    const levels = [
        { value: 'bac', label: 'Bac' },
        { value: 'bac+1', label: 'Bac+1' },
        { value: 'bac+2', label: 'Bac+2' },
        { value: 'bac+3', label: 'Bac+3' },
        { value: 'bac+4', label: 'Bac+4' },
        { value: 'bac+5', label: 'Bac+5' },
        { value: 'bac+6+', label: 'Bac+6 et plus' }
    ];
    res.json({ success: true, levels });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down server...');
    if (dbManager) {
        await dbManager.close();
    }
    process.exit(0);
});