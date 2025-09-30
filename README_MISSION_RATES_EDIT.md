# Edition des tarifs dans la modale de mission

## Fonctionnalité ajoutée

Permet d'ajuster les **Tarifs horaires net** et **Salaire estimé net** directement dans la modale d'édition de mission du Planning.

## Problème résolu

Auparavant, les tarifs estimés étaient uniquement définis dans la page Tarifs et n'étaient pas modifiables au niveau de chaque mission individuelle. Cela posait problème quand on avait besoin d'ajuster ces valeurs pour une mission spécifique.

## Solution implémentée

### Modifications HTML (index.html)

Ajout de deux nouveaux champs dans la modale de mission (`mission-modal`) :
- **Tarif horaire net (€/h)** : `mission-hourly-rate`
- **Salaire estimé net (€)** : `mission-estimated-salary`

Ces champs sont placés entre les notes et les salaires réels, sous une section dédiée "Tarifs estimés".

### Modifications JavaScript (app.js)

1. **setupRateSelectAutoComplete()** - Mise à jour
   - Pré-remplit automatiquement `mission-hourly-rate` et `mission-estimated-salary` quand on sélectionne un tarif
   - Utilise les valeurs `rate.hourlyRate` et `rate.salary` du tarif sélectionné

2. **openMissionModal()** - Mise à jour
   - En mode édition, charge les valeurs `hourlyRate` et `estimatedSalary` de la mission si elles existent
   - Sinon, utilise les valeurs du tarif associé comme fallback
   - Permet de voir les valeurs actuelles et de les modifier

3. **handleMissionSubmit()** - Mise à jour
   - Sauvegarde les valeurs `hourlyRate` et `estimatedSalary` dans l'objet mission
   - Permet de conserver les ajustements spécifiques à chaque mission

## Utilisation

### Lors de l'ajout d'une mission
1. Sélectionner un type de mission dans le menu déroulant
2. Les champs "Tarif horaire net" et "Salaire estimé net" se remplissent automatiquement
3. Possibilité de les modifier si nécessaire pour cette mission spécifique
4. Enregistrer

### Lors de l'édition d'une mission
1. Cliquer sur une mission dans le planning
2. Les champs "Tarif horaire net" et "Salaire estimé net" affichent :
   - Les valeurs personnalisées si elles ont été modifiées précédemment
   - Les valeurs du tarif par défaut sinon
3. Possibilité de les ajuster
4. Enregistrer

## Structure de données

Les missions stockent maintenant deux propriétés supplémentaires :
```javascript
mission = {
    // ... autres propriétés existantes
    hourlyRate: 14.620,        // Tarif horaire net pour cette mission (optionnel)
    estimatedSalary: 102.330,  // Salaire estimé net pour cette mission (optionnel)
    // ...
}
```

Ces valeurs sont optionnelles (null si non définies) et prennent le pas sur les valeurs du tarif de base pour cette mission spécifique.

## Avantages

- **Flexibilité** : Ajustement des tarifs au cas par cas sans modifier le tarif de base
- **Clarté** : Visualisation immédiate des montants estimés lors de l'édition
- **Précision** : Permet de gérer les variations de tarifs pour des missions exceptionnelles
- **Non-destructif** : Les tarifs de base restent inchangés dans la page Tarifs

## Notes techniques

- Les champs utilisent `step="0.001"` pour permettre une précision au millième
- Les valeurs sont converties en `float` avant sauvegarde
- Si non renseignées, elles restent `null` dans la base de données
- Compatibilité totale avec les missions existantes (les anciennes missions continueront de fonctionner)
