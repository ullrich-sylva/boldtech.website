# 🎯 Configuration Admin - Résumé Rapide

## ✅ Système Administrateur Configuré

### 🔐 Accès Direct
```
URL : http://localhost:3000/admin
Mot de passe : admin123
```

### 📍 Routes Admin Actives
- `GET /admin` → Page de connexion
- `GET /admin/login` → Page de connexion (alias)
- `GET /admin/dashboard` → Tableau de bord (authentifié)

### 🔑 Endpoints API Protégés
Tous les endpoints nécessitent un header `Authorization: Bearer TOKEN`

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/login` | POST | Authentification |
| `/api/admin/logout` | POST | Déconnexion |
| `/api/admin/messages` | GET | Récupérer tous les messages |
| `/api/admin/messages/:id` | PUT | Modifier le statut |
| `/api/admin/messages/:id` | DELETE | Supprimer un message |

### 💾 Stockage
- **En mémoire** : Tokens d'authentification (perdus au redémarrage du serveur)
- **PostgreSQL** (optionnel) : Messages persistants
- **LocalStorage** : Token client (navigateur)

### 🔄 Flux d'Authentification
```
1. Utilisateur entre le mot de passe
   ↓
2. Serveur vérifie le mot de passe
   ↓
3. Serveur génère un token unique
   ↓
4. Token sauvegardé en localStorage
   ↓
5. Requêtes API inclus le token (Bearer)
   ↓
6. Serveur valide le token pour autoriser
```

### 📋 Fonctionnalités
✓ Liste des messages reçus  
✓ Filtrer par statut (Non lu / Lu / Traité)  
✓ Filtrer par service  
✓ Consulter détails complets  
✓ Changer le statut des messages  
✓ Supprimer un message  
✓ Statistiques en temps réel  
✓ Déconnexion sécurisée  

### ⚙️ Configuration
Fichier `.env` :
```bash
ADMIN_PASSWORD=admin123          # ← Mot de passe admin
PORT=3000
EMAIL_USER=fotsingulrich611@gmail.com
EMAIL_PASS=Ulrich@2006
DATABASE_URL=postgresql://...    # Optionnel
```

### 🚀 Pour Démarrer
```bash
node server.js
```

Puis accédez à : **http://localhost:3000/admin**

### 🔒 Notes de Sécurité
- Changez le mot de passe `admin123` avant production
- Le `.env` ne doit pas être commité sur Git
- Utilisez HTTPS en production
- Les tokens expirent au redémarrage du serveur

---

**C'est prêt ! Vous pouvez vous connecter comme admin maintenant.** ✅
