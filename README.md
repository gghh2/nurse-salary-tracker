# 💉 Suivi Salaires Infirmier

Application web simple et efficace pour gérer le suivi des salaires d'infirmier vacataire.

## 🎯 Fonctionnalités

### ✅ Gestion des tarifs
- **Référentiel personnalisable** : Ajoutez vos propres acronymes (C7, LP, TR, etc.)
- **Calcul automatique** du tarif horaire
- **Modification/suppression** des tarifs existants
- **Tarifs pré-configurés** basés sur votre fichier Excel

### 📅 Planning des missions
- **Calendrier visuel** mensuel
- **Ajout rapide** de missions par clic sur une date
- **Statuts multiples** : Planifiée, Confirmée, Réalisée, Annulée
- **Informations détaillées** : Établissement, service, notes

### 📊 Tableau de bord
- **Statistiques du mois** en cours
- **Prochaines missions** (7 jours)
- **Calculs automatiques** : total salaire, heures, tarif moyen

### 💾 Sauvegarde sécurisée
- **Export/Import JSON** pour éviter les pertes de données
- **Sauvegarde automatique** dans le navigateur
- **Réinitialisation** complète si nécessaire

## 🚀 Installation

### Méthode 1: Déploiement GitHub + Netlify (Recommandée)

1. **Créer le repository GitHub**
```bash
# Créer un nouveau repository sur GitHub
# Puis cloner en local
git clone https://github.com/VOTRE_USERNAME/nurse-salary-tracker.git
cd nurse-salary-tracker
```

2. **Ajouter les fichiers**
```
nurse-salary-tracker/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── data-manager.js
│   └── salary-manager.js
└── README.md
```

3. **Pusher sur GitHub**
```bash
git add .
git commit -m "🎉 Initial commit - Nurse Salary Tracker"
git push origin main
```

4. **Déployer sur Netlify**
- Aller sur [netlify.com](https://netlify.com)
- Connecter votre compte GitHub
- Sélectionner votre repository `nurse-salary-tracker`
- Déploiement automatique !

### Méthode 2: Local simple

1. **Télécharger les fichiers**
2. **Ouvrir index.html** dans votre navigateur
3. L'application fonctionne immédiatement !

## 🔧 Configuration initiale

### Premier lancement
L'application charge automatiquement vos tarifs basés sur votre fichier Excel :
- Urg C7 (7h - 102,33€)
- Urg LP (12,5h - 184,105€)
- MedPo (12,5h - 184,105€)
- Etc.

### Personnalisation
1. **Section Tarifs** : Modifiez/ajoutez vos propres tarifs
2. **Section Planning** : Commencez à planifier vos missions
3. **Section Sauvegarde** : Configurez l'export automatique

## 📱 Utilisation

### Ajouter une mission
1. **Planning** → Cliquer sur une date
2. **Remplir le formulaire** :
   - Type de mission (vos tarifs)
   - Établissement
   - Service
   - Statut
3. **Enregistrer**

### Modifier un tarif
1. **Tarifs** → Bouton "Modifier" ✏️
2. **Ajuster** les valeurs
3. **Sauvegarder**

### Exporter vos données
1. **Sauvegarde** → "Télécharger la sauvegarde"
2. **Fichier JSON** téléchargé automatiquement
3. **Gardez-le précieusement** !

## 💡 Conseils d'utilisation

### Sauvegarde régulière
- **Exportez vos données** chaque semaine
- **Stockez le fichier** sur Google Drive / Dropbox
- **En cas de problème** : Importez pour restaurer

### Workflow recommandé
1. **Matin** : Vérifiez vos missions du jour
2. **Planification** : Ajoutez les nouvelles missions reçues
3. **Fin de mission** : Marquez comme "Réalisée"
4. **Fin de mois** : Consultez le résumé pour vérifier vos bulletins

### Multi-appareils
- **Exportez** depuis un appareil
- **Importez** sur l'autre
- **Synchronisation manuelle** mais efficace

## 🛠️ Développement

### Structure du code
```
js/
├── data-manager.js    # Gestion localStorage + validation
├── salary-manager.js  # Logique métier (calculs, calendrier)
└── app.js            # Interface utilisateur
```

### Technologies utilisées
- **HTML5/CSS3** : Interface responsive
- **JavaScript vanilla** : Aucune dépendance
- **LocalStorage** : Stockage des données
- **Font Awesome** : Icônes

### Personnalisation
Le code est **très commenté** et facile à modifier :
- **CSS** : Couleurs, thème dans `:root`
- **JavaScript** : Fonctions simples et claires
- **Ajout de fonctionnalités** : Structure modulaire

## 🐛 Dépannage

### L'application ne se charge pas
- Vérifiez que **tous les fichiers** sont présents
- **Console navigateur** (F12) pour voir les erreurs

### Données perdues
- **Importez votre sauvegarde** JSON
- Si pas de sauvegarde : les tarifs par défaut se rechargent

### Problème de calcul
- Vérifiez que les **tarifs sont corrects**
- **Rafraîchissez** la page (F5)

## 📞 Support

### Auto-dépannage
1. **F12** → Console → Chercher les erreurs rouges
2. **Copier/coller** l'erreur pour aide
3. **Tester** en navigation privée

### Améliorations futures possibles
- 🔄 Synchronisation cloud automatique
- 📱 Application mobile native
- 📧 Rappels email
- 📈 Graphiques avancés
- 🏥 Base de données des établissements

## 📄 Licence

Projet personnel libre d'utilisation.

---

**Développé spécialement pour les infirmiers vacataires** 👩‍⚕️👨‍⚕️

Suivi simple, prévisions précises, sérénité assurée ! 🎯
