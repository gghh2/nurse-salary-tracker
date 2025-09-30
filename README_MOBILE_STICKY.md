# Feature: Mobile Sticky Elements

## Description
Amélioration de l'expérience mobile avec des éléments "sticky" pour une meilleure navigation et orientation.

## Use Cases

### 1. Table des Tarifs - Acronyme Sticky
- **Problème** : Sur mobile, quand on swipe horizontalement pour voir toute la ligne d'un tarif, on perd de vue l'acronyme et on ne sait plus quelle ligne on regarde
- **Solution** : L'acronyme (première colonne) reste fixe à gauche pendant le scroll horizontal

### 2. Tableau de bord & Planning - Sélecteur de mois Sticky
- **Problème** : En scrollant vers le bas sur le tableau de bord ou le planning mobile, on perd le sélecteur de mois
- **Solution** : Le sélecteur de mois reste fixe en haut lors du scroll vertical dans les deux sections

## Implementation Details

### Sticky Acronym (Tarifs)
- Position sticky sur la première colonne td et th
- Background blanc avec ombre pour la distinction visuelle
- Z-index approprié pour rester au-dessus
- Min-width pour garantir la lisibilité

### Sticky Month Selector (Dashboard)
- Position sticky sur le conteneur du sélecteur
- Background avec dégradé pour correspondre au thème
- Z-index élevé pour rester visible
- Ombre pour la profondeur visuelle

## Files Modified
- css/style.css : Ajout des styles sticky pour mobile
- Test sur différentes tailles d'écran (320px - 768px)

## Browser Compatibility
- Position sticky supporté par tous les navigateurs modernes
- Fallback gracieux pour les anciens navigateurs
