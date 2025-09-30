# 📊 Dashboard Mensuel par Établissement - Documentation

## 🎯 Objectif
Afficher un récapitulatif détaillé par établissement pour le mois en cours dans la section Planning, avec les mêmes métriques que le tableau de bord principal mais focalisé sur le mois sélectionné.

## 📍 Emplacement
**Section Planning** → En dessous du calendrier, avant le résumé mensuel global

## 📈 Métriques affichées par établissement

Pour chaque établissement, le dashboard affiche :

1. **Nombre de missions** - Total des missions planifiées/réalisées
2. **Nombre d'heures** - Total des heures travaillées (excluant les indemnités et missions marquées "Ne pas compter")
3. **Salaire net estimé** - Estimation basée sur les tarifs configurés
4. **Salaire brut réel** - Montant brut réellement perçu (si saisi)
5. **Salaire net réel** - Montant net réellement perçu (si saisi)
6. **€/h net** - Tarif horaire moyen calculé (net réel / heures)
7. **Écart** - Différence entre net réel et net estimé
   - 🟢 **Vert** si positif (gagné plus que prévu)
   - 🔴 **Rouge** si négatif (gagné moins que prévu)

## 🔄 Navigation temporelle

Le dashboard se met à jour automatiquement lors du changement de mois via :
- Boutons `<` et `>` dans le sélecteur de mois
- Affichage du mois et année actuels (ex: "octobre 2025")

## 💡 Fonctionnalités clés

### Calculs automatiques
- **Tarif horaire moyen** : Calculé automatiquement à partir du net réel et des heures
- **Écart** : Calcul automatique pour identifier les différences de paiement
- **Totaux généraux** : Somme de tous les établissements affichée en bas

### Gestion intelligente
- **Missions exclues** : Les missions marquées "Ne pas compter" sont exclues des heures mais incluses dans les montants
- **Indemnités** : Comptées dans les montants mais pas dans les heures
- **Établissement par défaut** : "Non spécifié" si non renseigné

### Affichage adaptatif
- **Tri** : Établissements triés par nombre de missions (décroissant)
- **Responsive** : S'adapte aux écrans mobiles et desktop
- **Vide** : Message approprié si aucune mission dans le mois

## 🎨 Design

### Cartes établissement
- **En-tête** : Icône hôpital + nom établissement
- **Corps** : Grille de statistiques avec valeurs et labels
- **Hover** : Effet de survol avec élévation

### Carte totaux
- **Style distinct** : Bordure colorée et gradient de fond
- **En-tête** : Gradient violet avec icône sigma (Σ)
- **Valeurs** : Plus grandes avec gradient de couleur

### Codes couleur
- **Primaire** : Bleu (`#2c5282`)
- **Écart positif** : Vert (`#38a169`)
- **Écart négatif** : Rouge (`#e53e3e`)
- **Gradient accent** : Violet (`#764ba2` → `#667eea`)

## 🛠️ Architecture technique

### Fichiers modifiés

1. **`index.html`**
   - Section `.monthly-establishment-summary`
   - Container `#monthly-establishment-cards`
   - Carte totaux `.monthly-total-card`

2. **`salary-manager.js`**
   - Méthode `getMonthlyStatsByEstablishment(year, month)`
   - Calculs des statistiques par établissement
   - Formatage des montants et calcul des écarts

3. **`app.js`**
   - Méthode `displayMonthlyStatsByEstablishment()`
   - Intégration dans `loadPlanning()`
   - Mise à jour dynamique du DOM

4. **`style.css`**
   - Styles `.monthly-establishment-*`
   - Classes `.difference-positive` et `.difference-negative`
   - Responsive design avec media queries

## 📊 Flux de données

```
1. Changement de mois (navigation)
   ↓
2. loadPlanning() appelée
   ↓
3. getPlanningData() récupère les données
   ↓
4. getMonthlyStatsByEstablishment() calcule les stats
   ↓
5. displayMonthlyStatsByEstablishment() affiche le dashboard
   ↓
6. DOM mis à jour avec les cartes et totaux
```

## 🚀 Utilisation

### Pour l'utilisateur
1. Aller dans la section **Planning**
2. Le dashboard s'affiche automatiquement sous le calendrier
3. Naviguer entre les mois avec les boutons `<` `>`
4. Consulter les statistiques par établissement
5. Vérifier les écarts pour détecter les anomalies de paiement

### Cas d'usage principaux
- **Suivi mensuel** : Vue d'ensemble du mois en cours
- **Comparaison** : Comparer les établissements entre eux
- **Détection d'anomalies** : Identifier rapidement les écarts de paiement
- **Optimisation** : Analyser le tarif horaire par établissement
- **Facturation** : Vérifier les montants pour la facturation

## ⚠️ Points d'attention

1. **Salaires réels** : Doivent être saisis manuellement dans chaque mission
2. **Écarts** : Ne s'affichent que si les salaires réels sont renseignés
3. **Heures** : Les indemnités (0h) et missions exclues ne comptent pas
4. **Performance** : Les calculs sont faits à chaque changement de mois

## 📝 Notes pour le développement futur

### Améliorations possibles
- Export PDF/Excel du dashboard mensuel
- Graphiques de comparaison entre établissements
- Historique des écarts sur plusieurs mois
- Alertes automatiques pour écarts importants
- Statistiques prédictives basées sur l'historique

### Optimisations
- Cache des calculs pour améliorer les performances
- Lazy loading pour les mois avec beaucoup de missions
- Animation des transitions entre mois

## ✅ Statut : FONCTIONNEL

La fonctionnalité est complètement opérationnelle et prête à l'utilisation.
Testée et validée pour :
- Calculs corrects des statistiques
- Affichage responsive
- Navigation temporelle
- Gestion des écarts avec couleurs
- Cas limites (pas de missions, établissements multiples, etc.)
