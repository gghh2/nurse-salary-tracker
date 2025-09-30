# 🚀 Guide d'installation Google Drive Backup

## 📋 Prérequis
- Un compte Google (Gmail)
- 5 minutes de configuration

## 🔧 Étapes d'installation

### 1️⃣ **Créer le script Google Apps Script**

1. Ouvrir [script.google.com](https://script.google.com)
2. Cliquer sur **"Nouveau projet"**
3. Donner un nom au projet : `NurseSalaryTracker_Backup`

### 2️⃣ **Copier le code**

1. **Supprimer** le code par défaut dans l'éditeur
2. **Copier** tout le contenu du fichier `google-apps-script.js`
3. **Coller** dans l'éditeur Google Apps Script

### 3️⃣ **Générer un token de sécurité**

Dans le code Google Apps Script, trouver la fonction `getToken()` (vers la ligne 140) :

```javascript
function getToken() {
  return 'VOTRE-TOKEN-SECRET-ICI';
}
```

Remplacer `'VOTRE-TOKEN-SECRET-ICI'` par un token unique. 

**Options pour générer un token :**
- Utiliser un générateur en ligne : [uuidgenerator.net](https://www.uuidgenerator.net/)
- Ou utiliser un mot de passe fort de votre choix
- Exemple : `nurse-tracker-2025-secret-key-xyz123`

⚠️ **IMPORTANT** : Gardez ce token secret et notez-le quelque part !

### 4️⃣ **Déployer le Web App**

1. Cliquer sur **"Déployer"** → **"Nouveau déploiement"**

2. Dans la fenêtre qui s'ouvre :
   - **Type** : Sélectionner `Application Web`
   - **Description** : `Backup API v1`
   - **Exécuter en tant que** : `Moi`
   - **Qui peut accéder** : `Tout le monde` ⚠️

3. Cliquer sur **"Déployer"**

4. **Autoriser l'accès** :
   - Google vous demande d'autoriser le script
   - Cliquer sur **"Autoriser l'accès"**
   - Choisir votre compte Google
   - Si vous voyez "Cette application n'est pas validée", cliquer sur **"Paramètres avancés"** → **"Accéder à NurseSalaryTracker_Backup"**
   - Cliquer sur **"Autoriser"**

5. **Copier l'URL** du Web App qui ressemble à :
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

### 5️⃣ **Configurer dans l'application**

1. Ouvrir votre application **Nurse Salary Tracker**
2. Aller dans **"Sauvegarde"**
3. Cliquer sur **"⚙️ Configurer Google Drive"**
4. Remplir :
   - **URL** : L'URL copiée à l'étape 4
   - **Token** : Le token créé à l'étape 3
5. Cliquer sur **"Tester la connexion"**
   - ✅ Si succès : Cliquer sur **"Enregistrer"**
   - ❌ Si échec : Vérifier l'URL et le token

## ✅ **C'est terminé !**

Vous pouvez maintenant :
- **📤 Sauvegarder sur Drive** : Envoie vos données vers Google Drive
- **📥 Restaurer depuis Drive** : Récupère votre dernière sauvegarde

## 📁 **Où sont mes sauvegardes ?**

Les backups sont stockés dans Google Drive :
- Dossier : `NurseSalaryTracker_Backups`
- Format : `backup-YYYY-MM-DD-HHMM.json`
- Conservation : 10 derniers backups automatiquement

Pour voir vos backups :
1. Ouvrir [drive.google.com](https://drive.google.com)
2. Chercher le dossier `NurseSalaryTracker_Backups`

## 🔒 **Sécurité**

### ✅ **Ce qui est sécurisé :**
- Vos données restent dans **VOTRE** Google Drive
- Le token empêche l'accès non autorisé
- Personne d'autre ne peut voir vos données

### ⚠️ **Points d'attention :**
- **Ne partagez jamais** votre URL et token
- L'option "Tout le monde" permet seulement l'accès à l'API, pas à vos données
- Changez le token si vous pensez qu'il est compromis

## 🐛 **Dépannage**

### "Échec de la connexion"
1. Vérifier que l'URL est complète (finit par `/exec`)
2. Vérifier que le token est identique dans le script et l'app
3. Vérifier que le déploiement est bien actif

### "Aucun backup trouvé"
- Normal lors de la première utilisation
- Faire d'abord une sauvegarde avant de restaurer

### "Erreur 403 Forbidden"
1. Redéployer le script
2. S'assurer que "Qui peut accéder" = "Tout le monde"

## 📝 **Notes techniques**

### Limites Google Apps Script
- **Quota** : 20,000 appels/jour (largement suffisant)
- **Taille** : 50MB par fichier (des années de données)
- **Durée** : 6 minutes max par exécution

### Format des données
Les données sont sauvegardées en JSON :
```json
{
  "version": "2.0",
  "timestamp": "2025-01-30T10:30:00Z",
  "app": "NurseSalaryTracker",
  "data": {
    "rates": [...],
    "missions": [...],
    "settings": {...}
  }
}
```

## 🚀 **Évolutions possibles (Phase 2)**

- ✨ Sauvegarde automatique quotidienne
- 🔄 Synchronisation multi-appareils
- 🔐 Chiffrement des données
- 📊 Historique des versions
- 👥 Partage sélectif

## ❓ **FAQ**

**Q: Mes données sont-elles privées ?**
R: Oui, elles sont stockées dans VOTRE Google Drive personnel.

**Q: Puis-je utiliser plusieurs appareils ?**
R: Oui, configurez chaque appareil avec la même URL et token.

**Q: Que faire si je perds mon token ?**
R: Modifiez-le dans le script Google et reconfigurez l'app.

**Q: Combien de sauvegardes sont conservées ?**
R: Les 10 dernières (modifiable dans le script).

---

**Bravo ! Vos données sont maintenant sécurisées dans le cloud !** ☁️✨
