# 📅 Export Google Calendar (ICS)

Guide complet pour exporter vos missions vers Google Calendar, Outlook, ou Apple Calendar.

## 🎯 Qu'est-ce que l'export ICS ?

Le format **ICS (iCalendar)** est un format universel reconnu par tous les calendriers :
- ✅ Google Calendar
- ✅ Outlook / Office 365
- ✅ Apple Calendar (iOS/macOS)
- ✅ Thunderbird
- ✅ Tout autre application de calendrier

## 📋 Ce qui est exporté

Pour chaque mission non annulée, le fichier ICS contient :

```
📅 Date de la mission
⏰ Horaires de début et fin
📍 Lieu (établissement)
📝 Titre avec emoji de statut + acronyme
ℹ️ Description (service, notes)
✓ Statut (confirmé/planifié/réalisé)
```

**Emojis de statut dans le titre :**
- ✅ **Confirmée** : Mission confirmée par l'établissement
- ❓ **Planifiée** : Mission prévue mais pas encore confirmée
- ✔️ **Réalisée** : Mission effectuée

**Exemples d'événements :**
```
30/09/2025
08:00 - 15:00
✅ Urg C7
📍 Clinique de Cesson Sévigné
Service: Urgences - Durée: 7h
```

```
15/10/2025
06:45 - 19:15
❓ LP
📍 Hôpital Pontchaillou
Service: Urgences Lit Porte - Durée: 12.5h
```

## 🚀 Comment exporter vos missions

### Étape 1 : Générer le fichier ICS

1. Ouvrir votre application **Suivi Salaires Infirmier**
2. Aller dans la section **Sauvegarde**
3. Cliquer sur **"Télécharger ICS"** (carte "Exporter vers Calendar")
4. Le fichier `missions-infirmier-YYYY-MM-DD.ics` est téléchargé

## 📱 Import sur MOBILE

### Android (Google Calendar)

**Méthode automatique :**
1. Ouvrir le fichier `.ics` téléchargé
2. Android vous propose d'ouvrir avec "Calendar"
3. Accepter → Vos missions apparaissent ! ✅

**Méthode manuelle :**
1. Ouvrir **Google Calendar** app
2. Menu ⋮ → **Paramètres**
3. **Événements depuis Gmail** → Activer
4. Envoyer le fichier .ics par email à vous-même
5. Ouvrir l'email → Cliquer sur le fichier → Ajouter au calendrier

### iOS (Apple Calendar)

1. Ouvrir le fichier `.ics` dans Safari ou Mail
2. iOS vous propose "Ajouter tous les événements"
3. Confirmer → Terminé ! ✅

## 💻 Import sur PC

### Google Calendar (Web)

1. Aller sur [calendar.google.com](https://calendar.google.com)
2. Cliquer sur **⚙️** (Paramètres) en haut à droite
3. Menu gauche → **Importer et exporter**
4. **Sélectionner un fichier sur votre ordinateur**
5. Choisir votre fichier `.ics`
6. Sélectionner dans quel calendrier importer
7. **Importer** → Vos missions apparaissent ! ✅

### Outlook / Office 365

1. Ouvrir **Outlook** (web ou application)
2. **Fichier** → **Ouvrir et exporter** → **Importer/Exporter**
3. Sélectionner **"Importer un fichier iCalendar (.ics)"**
4. Choisir votre fichier `.ics`
5. Confirmer l'import

### Apple Calendar (macOS)

1. Ouvrir **Calendar**
2. **Fichier** → **Importer**
3. Sélectionner votre fichier `.ics`
4. Choisir le calendrier de destination
5. **Importer**

## 🔄 Mise à jour des missions

**Important :** L'export ICS est **une copie** de vos missions à un instant T.

### Si vous modifiez une mission dans l'app :

1. **Re-générer** un nouveau fichier ICS
2. **Supprimer** les anciens événements dans Calendar
3. **Importer** le nouveau fichier ICS

### Alternative : Synchro manuelle

Pour chaque changement :
- Modifier dans votre app → Noter le changement
- Modifier manuellement dans Google Calendar

## ⚙️ Gestion des horaires

### Missions avec horaires définis
```
Urg C7 : 08:00 - 15:00
→ Événement avec heure précise dans Calendar
```

### Indemnités (0h)
```
Indemnité urgence : 183€
→ Événement "journée entière" dans Calendar
```

### Missions sans horaires
Si une mission n'a pas d'horaires :
- Par défaut : 08:00 - 20:00
- **Conseil** : Définissez les horaires dans les tarifs !

## 🎨 Personnalisation dans Google Calendar

Une fois importées, vous pouvez :
- **Changer la couleur** des événements
- **Ajouter des rappels** (ex: 1h avant)
- **Créer un calendrier dédié** "Missions IDE"
- **Partager** votre planning avec famille/collègues

### Créer un calendrier séparé (recommandé)

1. Google Calendar → **+** à côté de "Autres agendas"
2. **Créer un agenda**
3. Nom : "Missions Infirmier"
4. Couleur : Vert (santé) 🟢
5. Lors de l'import, choisir ce calendrier

**Avantage :** Vous pouvez masquer/afficher toutes vos missions d'un clic !

## 📊 Cas d'usage

### Export mensuel
```javascript
// Export seulement septembre
1. Générer ICS
2. Import dans Calendar
3. Voir vos missions du mois
```

### Export annuel
```javascript
// Export toutes les missions
1. Générer ICS (toutes missions)
2. Import dans Calendar
3. Vue d'ensemble de l'année
```

### Partage avec famille
```javascript
1. Créer calendrier "Garde IDE"
2. Partager avec conjoint/famille
3. Ils voient quand vous travaillez
```

## 🐛 Problèmes courants

### "Le fichier ne s'ouvre pas"

**Solution :**
- Vérifier que le fichier se termine par `.ics`
- Essayer de l'ouvrir avec un autre navigateur
- Re-télécharger le fichier

### "Les événements ne s'importent pas"

**Causes possibles :**
1. Fichier corrompu → Re-générer
2. Format de date invalide → Vérifier les missions
3. Calendrier plein → Libérer de l'espace

**Solution :** Ouvrir le fichier `.ics` avec un éditeur de texte pour vérifier le contenu

### "Les horaires sont décalés"

**Cause :** Fuseau horaire différent

**Solution :**
- Le fichier ICS utilise le fuseau Europe/Paris
- Google Calendar ajuste automatiquement
- Si problème : Vérifier les paramètres de fuseau horaire

### "Doublons après plusieurs imports"

**Cause :** Import multiple du même fichier

**Solution :**
1. Supprimer les anciens événements
2. Re-importer le fichier ICS le plus récent

## 💡 Bonnes pratiques

### Export régulier
- **Fin de chaque mois** : Export après avoir renseigné toutes les missions
- **Avant modification** : Export avant de faire des changements importants
- **Backup** : Garder les anciens fichiers ICS comme historique

### Organisation Calendar
```
📅 Créer des calendriers séparés :
- "Missions Confirmées" (vert)
- "Missions Planifiées" (orange)  
- "Missions Passées" (gris)
```

### Rappels intelligents
```
Ajouter des rappels :
- 24h avant : Vérifier le matériel
- 2h avant : Préparation départ
- 1h avant : Notification départ
```

## 🔐 Confidentialité

### Données exportées
Le fichier ICS contient **uniquement** :
- Nom de la mission (C7, LP, etc.)
- Horaires
- Établissement
- Service
- Notes éventuelles

**Non exporté** :
❌ Salaires (estimés ou réels)
❌ Tarifs horaires
❌ Calculs financiers

### Partage sécurisé
Si vous partagez votre calendrier :
- ✅ Les autres voient vos horaires
- ❌ Ils ne voient PAS vos salaires
- 💡 Parfait pour coordination famille/amis

## 📞 Support

### Le fichier ICS est-il compatible avec tous les calendriers ?

**Oui !** Le format ICS (.ics) est un standard universel (RFC 5545) reconnu par :
- Google Calendar ✅
- Outlook / Office 365 ✅
- Apple Calendar ✅
- Yahoo Calendar ✅
- Thunderbird ✅
- Tout calendrier compatible iCalendar ✅

### Puis-je synchroniser automatiquement ?

Avec cette méthode (export ICS), c'est **manuel** :
1. Exporter depuis l'app
2. Importer dans Calendar

Pour une synchro automatique, il faudrait :
- Authentification Google OAuth
- API Google Calendar
- Backend serveur
→ Complexité 100x supérieure

**Notre recommandation :** Export mensuel suffit largement !

### Les modifications sont-elles synchronisées ?

**Non**, l'import ICS est une **copie ponctuelle**.

**Workflow recommandé :**
1. Planifier les missions dans l'app
2. Exporter en ICS
3. Importer dans Calendar
4. Si modifications → Re-export/Re-import

---

**Profitez de vos missions dans Google Calendar ! 📅✨**