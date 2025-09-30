# 🐛 Fix Export ICS - Horaires des Missions

## ❌ Problème identifié - 30 Septembre 2025

L'export ICS ne prenait pas correctement les horaires spécifiques des missions. Il utilisait un champ inexistant `mission.startHour` au lieu des bons champs.

## ✅ Correction appliquée

### Problème dans le code
```javascript
// ❌ AVANT - Code erroné
const startHour = mission.startHour || '08:00';  // startHour n'existe pas !
```

### Solution implémentée
```javascript
// ✅ APRÈS - Code corrigé
let startTimeStr = mission.startTime || rate.startTime || this.getDefaultStartTime(rate);
let endTimeStr = mission.endTime || rate.endTime || this.getDefaultEndTime(rate, startTimeStr);
```

## 📋 Ordre de priorité pour les horaires

L'export ICS utilise maintenant cet ordre de priorité pour déterminer les horaires :

1. **Horaires de la mission** (`mission.startTime` / `mission.endTime`)
   - Si la mission a des horaires personnalisés (ex: cadre appelle pour venir plus tôt)
   
2. **Horaires du tarif** (`rate.startTime` / `rate.endTime`)
   - Si le tarif définit des horaires standards
   
3. **Horaires calculés automatiquement**
   - Basés sur le nombre d'heures du tarif
   - Logique intelligente selon le type de mission

## 🕐 Calcul intelligent des horaires par défaut

### Heure de début (`getDefaultStartTime`)
- **Missions courtes (≤7h)** : 08:00
- **Missions moyennes (≤10h)** : 08:00
- **Missions longues (≥12h)** : 07:30
- **Indemnités (0h)** : 00:00

### Heure de fin (`getDefaultEndTime`)
- Calculée automatiquement : **début + nombre d'heures**
- Gère les dépassements de minuit (modulo 24)
- Ex: 08:00 + 7h = 15:00
- Ex: 07:30 + 12h = 19:30

## 🔧 Changements techniques

### 1. **Correction de la fonction generateICSFile**
- Utilisation des bons champs de mission
- Ajout de la cascade de priorité pour les horaires
- Format correct HHMMSS pour ICS

### 2. **Ajout de fonctions helper**
- `getDefaultStartTime(rate)` : Détermine l'heure de début
- `getDefaultEndTime(rate, startTime)` : Calcule l'heure de fin

### 3. **Nettoyage du code**
- Suppression de l'ancienne version obsolète
- Renommage de l'ancienne méthode en `generateICSFile_OLD`

## 📅 Impact sur l'export

### Avant la correction
- ❌ Horaires incorrects ou par défaut
- ❌ Pas de prise en compte des modifications cadre
- ❌ Champ `startHour` inexistant

### Après la correction
- ✅ Horaires personnalisés respectés
- ✅ Cascade de priorité logique
- ✅ Calcul intelligent selon le type de mission
- ✅ Compatible avec les appels cadre pour changement d'horaire

## 📝 Structure des données mission

Une mission peut maintenant contenir :
```javascript
{
  id: "...",
  date: "2025-10-01",
  rateId: "...",
  establishment: "Clinique Cesson",
  service: "Urgences",
  status: "confirmed",
  notes: "...",
  // Horaires optionnels personnalisés
  startTime: "07:00",  // Si cadre demande de venir plus tôt
  endTime: "19:00"     // Fin personnalisée
}
```

## 🚀 Utilisation future

Pour ajouter des horaires personnalisés à une mission :
1. Ajouter les champs `startTime` et `endTime` dans le formulaire de mission
2. Les stocker dans l'objet mission
3. L'export ICS les utilisera automatiquement

## ✅ Résultat

L'export ICS génère maintenant des événements avec :
- **Horaires corrects** selon la mission ou le tarif
- **Respect des modifications** demandées par les cadres
- **Calcul intelligent** pour les missions sans horaires définis
- **Format ICS valide** compatible avec tous les calendriers

## 🎯 Prochaines étapes possibles

1. **Interface utilisateur** : Ajouter des champs d'horaires dans le formulaire de mission
2. **Templates horaires** : Créer des profils d'horaires réutilisables
3. **Validation** : Vérifier la cohérence durée/horaires
4. **Rappels** : Notifier si horaires inhabituels

---

**Correction appliquée le 30/09/2025** - Export ICS maintenant pleinement fonctionnel avec horaires corrects ! 🎉