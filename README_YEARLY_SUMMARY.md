# 📊 Récapitulatif Annuel par Établissement

## ✅ Fonctionnalité ajoutée - 30 Septembre 2025

### 🎯 Objectif
Ajouter un récapitulatif annuel dans le tableau de bord, affichant les statistiques depuis le début de l'année, groupées par établissement.

## 📈 Métriques affichées

Pour **chaque établissement** :
- 📋 **Nombre de missions** : Total des missions réalisées
- ⏰ **Nombre d'heures** : Total des heures travaillées (hors indemnités et missions exclues)
- 💵 **Salaire brut réel** : Somme des salaires bruts réels saisis
- 💰 **Salaire net réel** : Somme des salaires nets réels saisis
- 📊 **Salaire moyen horaire net** : Calculé à partir du net réel / heures réelles

### Total général
Une carte spéciale avec gradient affiche les **totaux de tous les établissements** :
- Design distinct avec bordure colorée
- Valeurs en plus grand pour une meilleure visibilité
- Gradient de couleur sur les valeurs

## 🎨 Design

### Cartes d'établissement
- **En-tête** : Gradient bleu avec icône hôpital et nom de l'établissement
- **Corps** : Grille de 5 métriques avec valeurs et labels
- **Effet hover** : Légère élévation pour l'interactivité
- **Responsive** : S'adapte automatiquement sur mobile

### Disposition
- **Desktop** : Grille automatique (minmax 300px)
- **Tablette** : 1 colonne
- **Mobile** : 1 colonne avec métriques sur 2 lignes

## 🔧 Architecture technique

### 1. **HTML** (`index.html`)
```html
<div class="yearly-summary">
    <h3>Récapitulatif annuel <span>2025</span></h3>
    <div id="establishment-summary-cards">
        <!-- Cartes dynamiques -->
    </div>
    <div class="yearly-total-card">
        <!-- Totaux généraux -->
    </div>
</div>
```

### 2. **Calcul des données** (`salary-manager.js`)
```javascript
getYearlyStatsByEstablishment() {
    // Filtre les missions de l'année en cours
    // Groupe par établissement
    // Calcule les statistiques
    // Retourne un objet structuré
}
```

### 3. **Affichage** (`app.js`)
```javascript
displayYearlyStatsByEstablishment(yearlyStats) {
    // Génère les cartes HTML
    // Met à jour les totaux
}
```

### 4. **Styles** (`style.css`)
- `.yearly-summary` : Container principal
- `.establishment-card` : Carte individuelle
- `.yearly-total-card` : Carte des totaux avec style distinct
- `.establishment-stats-grid` : Grille responsive des métriques

## 📊 Logique de calcul

### Filtrage des missions
- **Année** : Missions de l'année en cours uniquement
- **Statut** : Exclut les missions annulées
- **Établissement** : Utilise en priorité celui de la mission, sinon celui du tarif

### Calcul des heures
- Exclut les missions marquées "Ne pas compter" (`excludeFromCount`)
- Exclut les indemnités (0h)
- Somme uniquement les heures réelles travaillées

### Calcul du tarif horaire moyen
```
Tarif horaire = Net réel total / Heures totales travaillées
```
- Le numérateur : Somme de tous les salaires nets réels saisis
- Le dénominateur : TOUTES les heures travaillées (exclut les indemnités et missions "Ne pas compter")
- Arrondi à 2 décimales
- Donne le tarif horaire moyen réel sur l'ensemble de l'activité

### Tri des établissements
- Trié par nombre de missions décroissant
- L'établissement le plus fréquenté apparaît en premier

## 🚀 Avantages

| Aspect | Bénéfice |
|--------|----------|
| **Vue globale** | Comprendre rapidement la répartition du travail |
| **Comparaison** | Identifier les établissements principaux |
| **Rentabilité** | Voir quel établissement paie le mieux à l'heure |
| **Planification** | Aide à la décision pour l'année suivante |
| **Comptabilité** | Données réelles pour les déclarations |

## 📱 Responsive Design

### Desktop (>768px)
- Grille automatique sur plusieurs colonnes
- Toutes les métriques sur une ligne

### Mobile (<768px)
- 1 carte par ligne
- Métriques sur 2-3 colonnes selon l'écran
- Tailles de police adaptées

## 🎯 Cas d'usage

### Pour l'infirmier
1. **Bilan annuel** : Vue d'ensemble de l'activité
2. **Négociation** : Arguments pour renégocier les tarifs
3. **Optimisation** : Identifier les établissements les plus rentables
4. **Fiscalité** : Données pour la déclaration d'impôts

### Pour la gestion
1. **Analyse** : Comprendre la répartition du travail
2. **Stratégie** : Décider où concentrer les efforts
3. **Historique** : Comparer avec les années précédentes
4. **Prévisionnel** : Estimer les revenus futurs

## ✨ Points forts

- ✅ **Automatique** : Calculs en temps réel
- ✅ **Visuel** : Cartes colorées et organisées
- ✅ **Complet** : Toutes les métriques importantes
- ✅ **Responsive** : Adapté à tous les écrans
- ✅ **Performant** : Calculs optimisés

## 🔮 Évolutions possibles

1. **Graphiques** : Ajouter des charts par établissement
2. **Comparaison** : Voir l'évolution mois par mois
3. **Export** : Télécharger le récapitulatif en PDF
4. **Historique** : Comparer plusieurs années
5. **Filtres** : Filtrer par période ou statut

## ✅ Conclusion

Cette fonctionnalité offre une **vue stratégique de l'activité annuelle** permettant aux infirmiers de :
- Comprendre leur répartition de travail
- Identifier les établissements les plus rentables
- Prendre des décisions éclairées pour l'avenir

Le design moderne et responsive assure une excellente expérience sur tous les appareils ! 🎉