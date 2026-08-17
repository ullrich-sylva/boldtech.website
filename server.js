const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

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

// Check if environment variables are loaded
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

// API endpoint for contact form submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
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

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        
        // Check if it's an authentication error
        if (error.code === 'EAUTH') {
            return res.status(500).json({ 
                success: false, 
                message: "Erreur d'authentification Gmail. Vérifiez votre mot de passe d'application dans le fichier .env" 
            });
        }
        
        res.status(500).json({ success: false, message: error.message || 'Une erreur est survenue lors de l\'envoi du message.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
