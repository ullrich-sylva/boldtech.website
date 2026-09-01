# 📊 Guide Administrateur - BOLD TECHNOLOGY

## 🔐 Accès Administrateur

### URL d'Accès
- **Page de connexion** : http://localhost:3000/admin
- **Tableau de bord** : http://localhost:3000/admin/dashboard (après authentification)

### Identifiants

| Champ | Valeur |
|-------|--------|
| **Mot de passe** | `admin123` |

⚠️ **Le mot de passe est stocké dans `.env`** (variable `ADMIN_PASSWORD`)

---

## 🚀 Connexion Pas à Pas

1. Ouvrez http://localhost:3000/admin
2. Entrez le mot de passe administrateur : **admin123**
3. Cliquez sur **"Se connecter"** 
4. Vous êtes redirigé vers le **Tableau de Bord**

### Bouton Afficher/Masquer le Mot de Passe
✓ Cliquez sur l'icône **"Œil"** pour voir/masquer le mot de passe en cours de saisie

---

## 📈 Tableau de Bord Administrateur

### Sections Principales

#### 1️⃣ **Statistiques**
- **Messages reçus** : Total des messages de contact
- **Non lus** : Messages non encore consultés
- **Traités** : Messages résolus/traités

#### 2️⃣ **Gestion des Messages**
Tableau affichant tous les messages de contact avec :
- **Date** : Quand le message a été reçu
- **Nom** : Expéditeur
- **Email/Tél** : Coordonnées
- **Sujet/Service** : Service concerné
- **Statut** : 
  - 🟠 Non lu (unread)
  - 🔵 Lu (read)
  - ✅ Traité (treated)
- **Actions** : Consulter, modifier, supprimer

#### 3️⃣ **Filtres**
- **Par statut** : Tous / Non lus / Lus / Traités
- **Par service** : Réseaux / Maintenance / Vidéosurveillance / Solaire / Cloud / Flotte / Autre

---

## 📝 Actions Possibles

### Consulter un Message
1. Cliquez sur une ligne du tableau
2. Une modal s'ouvre affichant les détails complets
3. Vous pouvez voir :
   - Sujet complet
   - Nom et email du contact
   - Téléphone (si fourni)
   - Date exacte
   - Service concerné
   - Message complet

### Modifier le Statut
Depuis la modal du message :
- 🔵 **Marquer comme lu** - Change le statut à "lu"
- ✅ **Marquer comme traité** - Change le statut à "traité"
- 🗑️ **Supprimer** - Supprime le message définitivement

---

## 🔧 Configuration

### Fichier `.env`
```bash
# Connexion Admin
ADMIN_PASSWORD=admin123

# Serveur
PORT=3000

# Email (pour recevoir les messages)
EMAIL_USER=fotsingulrich611@gmail.com
EMAIL_PASS=Ulrich@2006

# Base de données (optionnel)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/boldtech
```

### Changer le Mot de Passe Admin
Modifiez dans le fichier `.env` :
```bash
ADMIN_PASSWORD=votre_nouveau_mot_de_passe
```
Puis redémarrez le serveur.

---

## 🌐 Système de Tokens

### Comment Ça Marche
1. **Login** : Vous envoyez le mot de passe → Serveur génère un **token unique**
2. **Token stocké** : Token sauvegardé en `localStorage` du navigateur
3. **Requêtes protégées** : Chaque requête inclut `Authorization: Bearer TOKEN`
4. **Vérification** : Serveur valide le token pour chaque action
5. **Logout** : Token supprimé, vous êtes redirigé vers la page de login

### Token Expiration
- Les tokens restent valides tant que le serveur ne redémarre pas
- Les tokens sont stockés uniquement en mémoire serveur
- Redémarrage du serveur = Tous les tokens invalidés (re-login nécessaire)

---

## 💾 Stockage des Messages

### Base de Données PostgreSQL
Si `DATABASE_URL` est configurée, les messages sont stockés dans la table `messages` :

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'non_lu'
);
```

### Statuts Possibles
- `non_lu` : Non consulté
- `lu` : Consulté
- `traite` : Répondu/Traité

### Si Pas de Base de Données
Les messages ne sont visibles QUE si vous êtes connecté ET si le serveur est actif.
Après redémarrage : les anciens messages disparaissent (stockés en mémoire uniquement).

---

## 📧 Notification Email

Lorsqu'un message est soumis via le formulaire de contact :

✉️ **Email reçu à** : fotsingulrich611@gmail.com  
**Contient** :
- Nom du contact
- Email du contact
- Téléphone (optionnel)
- Service concerné
- Message complet

**Reply** : Vous pouvez répondre directement à l'email (réponse va au contact)

---

## 🔗 Navigation Admin

### Depuis le Tableau de Bord
- ✉️ **Messages** - Retour à la gestion des messages
- 🌐 **Voir le site** - Ouvre le site vitrine en nouvel onglet
- 🚪 **Déconnexion** - Logout et retour à la page de login

### Depuis la Page de Login
- ← **Retour au site vitrine** - Lien pour quitter l'admin

---

## 🐛 Dépannage

### "Mot de passe incorrect"
- Vérifiez que vous entrez le bon mot de passe (par défaut : `admin123`)
- Vérifiez dans `.env` la valeur de `ADMIN_PASSWORD`
- Assurez-vous que le serveur est redémarré après une modification du `.env`

### "Impossible de se connecter au serveur"
- Vérifiez que le serveur Node.js est lancé (`node server.js`)
- Vérifiez l'URL : http://localhost:3000/admin
- Vérifiez que le port 3000 n'est pas bloqué

### "Aucun message n'apparaît"
- Les messages s'affichent depuis la base PostgreSQL (si configurée)
- Ou depuis la mémoire du serveur (perdus au redémarrage)
- Vérifiez la variable `DATABASE_URL` dans `.env`

### Session expirée
- Fermez le navigateur et reconnectez-vous
- Ou cliquez sur "Déconnexion" puis "Se connecter" à nouveau

---

## 🔒 Sécurité

### Bonnes Pratiques
✓ Gardez le mot de passe admin secret  
✓ Changez régulièrement le mot de passe  
✓ N'exposez pas le `.env` sur internet  
✓ Utilisez HTTPS en production  
✓ Changez le mot de passe par défaut (`admin123`)

### Production
Pour déployer en production :
1. Changez `ADMIN_PASSWORD` par un mot de passe fort
2. Utilisez une vraie base de données PostgreSQL
3. Mettez en place HTTPS/SSL
4. Limitez l'accès à `/admin` par IP si possible
5. Ajoutez un système 2FA (future amélioration)

---

## 📱 Responsive Design
Le tableau de bord est adaptatif et fonctionne sur :
- ✓ Desktop
- ✓ Tablet
- ✓ Mobile

---

**Dernière mise à jour** : 2026-08-18  
**Version** : 1.0  
**Support** : contact@boldtechnology.com
