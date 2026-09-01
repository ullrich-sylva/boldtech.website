# BOLD TECHNOLOGY - Structure Globale du Site

## 📁 Architecture du Projet

```
/public
├── index.html              # Page d'accueil (Hero + Services + About + Réalisations + Contact)
├── services.html           # Page dédiée aux services (6 cartes en grille 3×2)
├── about.html              # Page À propos (Histoire + Valeurs + Stats)
├── realisations.html       # Page Réalisations (Projets + Témoignages)
├── contact.html            # Page Contact (Formulaire + Infos)
├── style.css               # Feuille de styles unique pour tout le site
├── script.js               # Scripts JavaScript partagés
├── logo.svg                # Logo de l'entreprise
├── logo.png                # Logo (format PNG)
├── hero-bg.png             # Image de fond du héro
├── realisation1.png        # Image réalisation 1
├── realisation2.png        # Image réalisation 2
├── realisation3.png        # Image réalisation 3
└── admin/
    ├── login.html          # Page de connexion admin
    ├── dashboard.html      # Tableau de bord admin
    ├── admin.css           # Styles admin
    └── admin.js            # Scripts admin
```

## 🎨 Design System

### Couleurs
- **Primaire**: `#E60000` (rouge vif)
- **Primaire sombre**: `#B30000`
- **Primaire clair**: `#FF3333`
- **Accent or**: `#D4A843`
- **Accent bleu**: `#3B82F6`
- **Fond**: `#0A0A0A` (très sombre)
- **Fond surface**: `#141414`
- **Texte principal**: `#FFFFFF`
- **Texte secondaire**: `#A0A0A0`

### Typographie
- **En-têtes**: `Outfit` (400, 500, 600, 700, 800)
- **Corps**: `Inter` (300, 400, 500, 600, 700, 800, 900)

## 📄 Pages du Site

### 1. **Page d'accueil** (`index.html`)
- **Sections**:
  - Hero section avec CTA
  - À propos (grid 2 colonnes)
  - Services (grille 3×2 ou 2×3)
  - Statistiques
  - Réalisations/Références (grille 3×1)
  - Contact (formulaire)
  - Footer

### 2. **Page Services** (`services.html`)
- **Sections**:
  - Bandeau de statut (vert si services opérationnels)
  - Titre et intro de page
  - Grille 6 cartes (3×2)
  - Section CTA "Besoin d'une solution personnalisée ?"
  - Footer
- **Cartes service**:
  - Icône Font Awesome
  - Titre
  - Description
  - Public visé (badge)

### 3. **Page À propos** (`about.html`)
- **Sections**:
  - Titre et intro de page
  - Grid 2 colonnes (image + contenu)
  - Section "Nos valeurs" (grille 4 cartes)
  - Statistiques
  - CTA "Prêt à transformer votre entreprise ?"
  - Footer

### 4. **Page Réalisations** (`realisations.html`)
- **Sections**:
  - Titre et intro de page
  - Grille références (3×1)
  - Section témoignages (grille 3 cartes)
  - CTA "Vous avez un projet similaire ?"
  - Footer

### 5. **Page Contact** (`contact.html`)
- **Sections**:
  - Titre et intro de page
  - Grid 2 colonnes:
    - Infos de contact (4 détails)
    - Formulaire de demande de devis
  - Footer

## 🔗 Navigation

### Menu Principal (Header)
- Accueil → `/` ou `index.html`
- À propos → `/about.html`
- Services → `/services.html`
- Réalisations → `/realisations.html`
- Contact → `/contact.html`
- Bouton CTA "Devis" → `/contact.html`

### Footer
- Logo + Description
- Navigation (même que header)
- Services (liens vers services.html)
- Newsletter (input email)
- Réseaux sociaux (placeholders)
- Mentions légales

## 💻 Composants Réutilisables

### Classes CSS Principales
- `.header` - En-tête avec navigation
- `.nav-links` - Menu de navigation
- `.btn btn-primary` / `.btn btn-outline` - Boutons
- `.container` - Conteneur responsif (max 1200px)
- `.section` - Section standard
- `.reveal` / `.reveal-delay-1..6` - Animations scroll
- `.service-card` - Cartes de service
- `.contact-grid` - Grid contact 2 colonnes
- `.footer` - Pied de page

### Styles de Texte
- `.section-title` - Titre section (gradient)
- `.section-subtitle` - Sous-titre section
- `.section-tag` - Tag/badge section
- `.highlight` - Texte en couleur primaire

## 📱 Responsive Design

### Points de rupture
- **1024px**: Grilles 2 colonnes, layout adaptés
- **768px**: Menu mobile hamburger, grilles 1 colonne
- **480px**: Padding réduit, polices optimisées

## 🎬 Animations

- **Fade-In-Up**: Entrée éléments (`.reveal`)
- **Delay**: Délai progressif (`.reveal-delay-1` à `.reveal-delay-6`)
- **Hover**: Élévation cartes (-8px), icon transformation
- **Pulse**: Indicateurs de statut
- **Grid Animation**: Lignes de grille animées sur hero

## 🔧 Intégration Backend

### Endpoint Contact
- **URL**: `POST /api/contact`
- **Formulaire sur**: `contact.html` et `index.html`
- **Champs**: nom, email, phone, subject, message
- **Réponse**: Succès/erreur avec message

### Base de Données
- **Table**: `messages`
- **Colonnes**: id, name, email, phone, subject, message, created_at, status
- **Email**: Envoyé automatiquement via Nodemailer

## ✨ Fonctionnalités JS

1. **Header Scroll Effect**: Change style au scroll
2. **Active Nav Link**: Met à jour le lien actif
3. **Mobile Menu**: Toggle hamburger
4. **Scroll Reveal**: Animation IntersectionObserver
5. **Counter Animation**: Compteurs de stats
6. **Contact Form**: Validation et envoi API
7. **Scroll to Top**: Bouton retour en haut

## 📊 SEO & Meta Tags

- **Page d'accueil**: Meta description complète
- **Services**: Description services
- **About**: Histoire et expertise
- **Réalisations**: Références clients
- **Contact**: CTA contact
- **Favicon**: SVG badge "B"
- **Open Graph**: Tags pour partage social

## 🚀 Déploiement

```bash
# Installation
npm install

# Démarrage serveur (port 3000)
npm start

# Variables d'environnement (.env)
DATABASE_URL=postgresql://...
EMAIL_USER=votre@email.com
EMAIL_PASS=votre_motdepasse
PORT=3000
```

## 📝 Notes

- Toutes les pages utilisent le même `style.css` et `script.js`
- Le header et footer sont identiques sur toutes les pages
- Responsive jusqu'à 320px de large
- Animations fluides avec cubic-bezier optimisé
- Design dark mode par défaut
- Accessibilité ARIA sur éléments interactifs
