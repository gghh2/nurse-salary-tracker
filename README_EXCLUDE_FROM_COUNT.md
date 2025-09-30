# Feature: Exclude From Count

## Description
Ajout d'une case à cocher "Ne pas compter en tant que mission" sur les tarifs pour exclure certains types de missions du comptage des heures réalisées et du nombre de missions.

## Use Case
Certains tarifs (comme les formations, les réunions, les indemnités spéciales) ne doivent pas être comptabilisés dans les statistiques de missions réalisées et d'heures travaillées.

## Implementation Details
- Nouvelle propriété `excludeFromCount` (boolean) sur les tarifs
- Case à cocher dans le formulaire de création/modification des tarifs
- Exclusion automatique de ces tarifs dans les calculs de:
  - Total des heures
  - Nombre de missions
  - Tarif horaire moyen
- Le salaire est toujours compté (uniquement les heures et le nombre de missions sont exclus)

## Files Modified
- index.html: Ajout de la case à cocher dans le formulaire
- data-manager.js: Support de la propriété excludeFromCount
- salary-manager.js: Modification des calculs pour exclure ces missions
- app.js: Gestion de la case à cocher dans l'interface
