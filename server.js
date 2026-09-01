const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql2/promise');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route aliases for cleaner URLs (optional - allow /contact instead of /contact.html)
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/realisations', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'realisations.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Admin Routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// MySQL connection pool configuration
let pool;
const initializeDatabase = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'bold_technology',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Connecté à la base de données MySQL');

        // Create table if not exists
        const [result] = await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                subject VARCHAR(255),
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'non_lu'
            )
        `);
        console.log('✅ Table "messages" prête');
    } catch (err) {
        console.error('❌ Erreur de connexion MySQL:', err.message || err);
        console.warn('⚠️ Les messages seront stockés en mémoire (perdus au redémarrage du serveur)');
        pool = null;
    }
};

initializeDatabase();

// Check if email variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('⚠️ ATTENTION: Les variables EMAIL_USER ou EMAIL_PASS sont manquantes dans le fichier .env !');
} else {
    console.log(`✅ Configuration email chargée pour : ${process.env.EMAIL_USER}`);
}

// Configure Nodemailer transporter (explicit Gmail configuration)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Simple in-memory session manager for admin dashboard
const activeSessions = new Set();

// Admin Authentication Middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (activeSessions.has(token)) {
            return next();
        }
    }
    return res.status(401).json({ success: false, message: 'Non autorisé. Veuillez vous connecter.' });
};

// --- API ROUTES ---

// 1. Submit contact form (save to DB + send Email)
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
        }

        // Save to MySQL if connection is available
        if (pool) {
            const queryText = 'INSERT INTO messages(name, email, phone, subject, message) VALUES(?, ?, ?, ?, ?)';
            const values = [name, email, phone || null, subject || null, message];
            await pool.query(queryText, values);
            console.log('💾 Message enregistré dans MySQL');
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to yourself
            replyTo: email, // Reply goes to the user
            subject: `Nouveau message de ${name} - ${subject || 'Contact Site Web'}`,
            html: `
                <h3>Nouveau message depuis le site BOLD TECHNOLOGY</h3>
                <p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${phone || 'Non renseigné'}</p>
                <p><strong>Service concerné:</strong> ${subject || 'Non renseigné'}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        // Try sending email (failure shouldn't block HTTP success response if saved in DB)
        try {
            await transporter.sendMail(mailOptions);
            console.log('✉️ Email envoyé avec succès');
        } catch (mailError) {
            console.error('⚠️ Échec de l\'envoi de l\'email (mais sauvegardé en base):', mailError.message);
            // If DB save was successful, we can still report success but with a warning in server logs
        }
        
        res.status(200).json({ success: true, message: 'Message reçu avec succès.' });
    } catch (error) {
        console.error('Erreur globale lors de la soumission:', error);
        res.status(500).json({ success: false, message: error.message || 'Une erreur est survenue lors de l\'envoi du message.' });
    }
});

// 2. Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Default fallback

    if (password === adminPassword) {
        const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
        activeSessions.add(token);
        res.status(200).json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Mot de passe incorrect.' });
    }
});

// 3. Admin Logout
app.post('/api/admin/logout', authMiddleware, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
    res.status(200).json({ success: true, message: 'Déconnecté.' });
});

// 4. Get all messages (Protected)
app.get('/api/admin/messages', authMiddleware, async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ success: false, message: 'Base de données non disponible.' });
        }
        const [messages] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.status(200).json({ success: true, messages: messages });
    } catch (error) {
        console.error('Erreur de récupération des messages:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

// 5. Update message status (Protected)
app.put('/api/admin/messages/:id', authMiddleware, async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ success: false, message: 'Base de données non disponible.' });
        }
        const { id } = req.params;
        const { status } = req.body; // 'lu', 'non_lu', 'traite'

        await pool.query('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ success: true, message: 'Statut mis à jour.' });
    } catch (error) {
        console.error('Erreur de mise à jour du message:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

// 6. Delete message (Protected)
app.delete('/api/admin/messages/:id', authMiddleware, async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ success: false, message: 'Base de données non disponible.' });
        }
        const { id } = req.params;

        await pool.query('DELETE FROM messages WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Message supprimé.' });
    } catch (error) {
        console.error('Erreur de suppression du message:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
});

// Catch-all to serve index.html for undefined routes (Express 5 syntax)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
