// Database Manager - SQLite for JobSurMesure
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

class DatabaseManager {
    constructor() {
        this.dbPath = path.join(__dirname, '..', 'data', 'jobs.db');
        this.db = null;
    }

    // Generate unique ID
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            // Ensure data directory exists
            const fs = require('fs');
            const dir = path.dirname(this.dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Connected to database:', this.dbPath);
                    resolve(this.db);
                }
            });
        });
    }

    async initializeSchema() {
        return new Promise((resolve, reject) => {
            const schema = `
                -- Jobs table
                CREATE TABLE IF NOT EXISTS jobs (
                    id TEXT PRIMARY KEY,
                    source TEXT,
                    title TEXT NOT NULL,
                    company TEXT,
                    companyLogo TEXT,
                    location TEXT,
                    type TEXT CHECK(type IN ('stage', 'alternance')),
                    domain TEXT,
                    description TEXT,
                    requirements TEXT,
                    skills TEXT,
                    studyLevel TEXT,
                    duration TEXT,
                    salary TEXT,
                    startDate TEXT,
                    postedAt TEXT,
                    deadline TEXT,
                    remote TEXT,
                    matchScore INTEGER,
                    sourceUrl TEXT,
                    scrapeDate TEXT,
                    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
                );

                -- Users table
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    firstName TEXT,
                    lastName TEXT,
                    dateOfBirth TEXT,
                    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
                    profile TEXT
                );

                -- Applications table
                CREATE TABLE IF NOT EXISTS applications (
                    id TEXT PRIMARY KEY,
                    jobId TEXT NOT NULL,
                    userId TEXT NOT NULL,
                    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'viewed', 'interview', 'accepted', 'rejected')),
                    customCvUrl TEXT,
                    customCoverLetterUrl TEXT,
                    appliedAt TEXT DEFAULT CURRENT_TIMESTAMP,
                    notes TEXT,
                    FOREIGN KEY (jobId) REFERENCES jobs(id),
                    FOREIGN KEY (userId) REFERENCES users(id)
                );

                -- User profiles table
                CREATE TABLE IF NOT EXISTS user_profiles (
                    id TEXT PRIMARY KEY,
                    userId TEXT UNIQUE NOT NULL,
                    bio TEXT,
                    school TEXT,
                    studyLevel TEXT,
                    skills TEXT,
                    languages TEXT,
                    cvUrl TEXT,
                    coverLetterUrl TEXT,
                    location TEXT,
                    preferredLocations TEXT,
                    preferredTypes TEXT,
                    preferredDomains TEXT,
                    FOREIGN KEY (userId) REFERENCES users(id)
                );

                -- Stats table
                CREATE TABLE IF NOT EXISTS stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    totalJobs INTEGER,
                    totalCompanies INTEGER,
                    totalApplications INTEGER,
                    scrapedDate TEXT DEFAULT CURRENT_TIMESTAMP
                );
            `;

            this.db.exec(schema, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Database schema initialized');
                    resolve();
                }
            });
        });
    }

    async insertJob(job) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT OR REPLACE INTO jobs (
                    id, source, title, company, companyLogo, location, type,
                    domain, description, requirements, skills, studyLevel,
                    duration, salary, startDate, postedAt, deadline, remote,
                    matchScore, sourceUrl, scrapeDate
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                job.id || this.generateId('job'),
                job.source || 'mock',
                job.title,
                job.company || '',
                job.companyLogo || '',
                job.location || '',
                job.type || 'stage',
                job.domain || '',
                job.description || '',
                JSON.stringify(job.requirements || []),
                JSON.stringify(job.skills || []),
                JSON.stringify(job.studyLevel || []),
                job.duration || '',
                job.salary || '',
                job.startDate || '',
                job.postedAt || '',
                job.deadline || '',
                job.remote !== undefined ? String(job.remote) : 'false',
                job.matchScore || Math.floor(Math.random() * 40) + 30,
                job.sourceUrl || '',
                new Date().toISOString()
            ];

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async insertUser(user) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT OR REPLACE INTO users (
                    id, email, firstName, lastName, dateOfBirth, profile, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                user.id || this.generateId('user'),
                user.email,
                user.firstName || '',
                user.lastName || '',
                user.dateOfBirth || '',
                JSON.stringify(user.profile || {}),
                user.createdAt || new Date().toISOString()
            ];

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({
                        ...row,
                        profile: row.profile ? JSON.parse(row.profile) : {}
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getUserById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({
                        ...row,
                        profile: row.profile ? JSON.parse(row.profile) : {}
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    async insertApplication(application) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO applications (
                    id, jobId, userId, status, customCvUrl, customCoverLetterUrl, appliedAt, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                application.id || this.generateId('app'),
                application.jobId,
                application.userId,
                application.status || 'draft',
                application.customCvUrl || '',
                application.customCoverLetterUrl || '',
                application.appliedAt || new Date().toISOString(),
                application.notes || ''
            ];

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async getApplications(userId) {
        return new Promise((resolve, reject) => {
            let sql = `
                SELECT a.*, j.title as jobTitle, j.company, j.companyLogo, j.domain, j.type
                FROM applications a
                JOIN jobs j ON a.jobId = j.id
                WHERE a.userId = ?
                ORDER BY a.appliedAt DESC
            `;

            this.db.all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async bulkInsertJobs(jobs) {
        const results = [];
        for (const job of jobs) {
            try {
                const id = await this.insertJob(job);
                results.push(id);
            } catch (err) {
                console.error('Error inserting job:', job.title, err.message);
            }
        }
        return results;
    }

    async getJobs(filters = {}) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM jobs WHERE 1=1';
            const params = [];

            if (filters.query) {
                sql += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
                const query = `%${filters.query}%`;
                params.push(query, query, query);
            }

            if (filters.location) {
                sql += ' AND location LIKE ?';
                params.push(`%${filters.location}%`);
            }

            if (filters.type && filters.type !== 'all') {
                sql += ' AND type = ?';
                params.push(filters.type);
            }

            if (filters.studyLevel) {
                sql += ' AND studyLevel LIKE ?';
                params.push(`%${filters.studyLevel}%`);
            }

            if (filters.domain) {
                sql += ' AND domain = ?';
                params.push(filters.domain);
            }

            if (filters.remote !== undefined) {
                sql += ' AND remote = ?';
                params.push(String(filters.remote));
            }

            sql += ' ORDER BY matchScore DESC, postedAt DESC LIMIT 50';

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Parse JSON fields
                    const parsedJobs = rows.map(job => ({
                        ...job,
                        requirements: job.requirements ? JSON.parse(job.requirements) : [],
                        skills: job.skills ? JSON.parse(job.skills) : [],
                        studyLevel: job.studyLevel ? JSON.parse(job.studyLevel) : []
                    }));
                    resolve(parsedJobs);
                }
            });
        });
    }

    async getJobById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM jobs WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({
                        ...row,
                        requirements: row.requirements ? JSON.parse(row.requirements) : [],
                        skills: row.skills ? JSON.parse(row.skills) : [],
                        studyLevel: row.studyLevel ? JSON.parse(row.studyLevel) : []
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    async updateStats() {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO stats (totalJobs, totalCompanies, totalApplications)
                SELECT
                    (SELECT COUNT(*) FROM jobs),
                    (SELECT COUNT(DISTINCT company) FROM jobs WHERE company IS NOT NULL),
                    (SELECT COUNT(*) FROM applications)
            `;

            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    this.db.get('SELECT * FROM stats ORDER BY id DESC LIMIT 1', [], (err, stats) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(stats);
                        }
                    });
                }
            });
        });
    }

    async close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close(() => resolve());
            } else {
                resolve();
            }
        });
    }
}

module.exports = DatabaseManager;
