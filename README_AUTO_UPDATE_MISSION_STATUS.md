# Mise à jour automatique des missions confirmées passées

## Fonctionnalité ajoutée

Les missions avec le statut **"Confirmée"** dont la date est dépassée passent automatiquement au statut **"Réalisée"**.

## Problème résolu

Auparavant, il fallait manuellement changer le statut des missions confirmées en "Réalisée" après leur date. Cette tâche répétitive était fastidieuse et pouvait être oubliée.

## Solution implémentée

### Logique métier (data-manager.js)

La fonction `autoUpdatePastConfirmedMissions()` existait déjà dans le data-manager. Elle :
- Parcourt toutes les missions
- Identifie celles avec le statut "confirmed"
- Compare leur date avec la date du jour
- Passe automatiquement au statut "completed" celles dont la date est passée
- Ajoute un timestamp `autoUpdatedAt` pour traçabilité

```javascript
/**
 * Met à jour automatiquement les missions confirmées passées au statut "Réalisée"
 * @returns {object} Informations sur les missions mises à jour
 */
autoUpdatePastConfirmedMissions() {
    const missions = this.getMissions();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Comparer uniquement les dates
    
    let updatedCount = 0;
    const updatedMissions = [];
    
    missions.forEach(mission => {
        if (mission.status === 'confirmed') {
            const missionDate = new Date(mission.date.split('T')[0] + 'T00:00:00');
            
            if (missionDate < today) {
                mission.status = 'completed';
                mission.autoUpdatedAt = new Date().toISOString();
                updatedCount++;
                updatedMissions.push({
                    id: mission.id,
                    date: mission.date,
                    establishment: mission.establishment
                });
            }
        }
    });
    
    if (updatedCount > 0) {
        this.saveMissions(missions);
        console.log(`Auto-update: ${updatedCount} mission(s) passée(s) au statut "Réalisée"`);
    }
    
    return {
        success: true,
        updatedCount: updatedCount,
        updatedMissions: updatedMissions
    };
}
```

### Interface utilisateur (app.js)

Création de la méthode `autoUpdateMissionStatuses()` qui :
- Appelle la fonction du data-manager
- Log silencieusement dans la console si des missions ont été mises à jour
- Ne dérange pas l'utilisateur avec des notifications intrusives

Points d'appel automatique :
1. **Au chargement de l'application** (`setupApp()`)
2. **Lors du chargement du Dashboard** (`loadDashboard()`)
3. **Lors du chargement du Planning** (`loadPlanning()`)

Cela garantit que les statuts sont toujours à jour quand l'utilisateur consulte ses missions.

## Comportement

### Critères de mise à jour
Une mission est automatiquement mise à jour si :
- ✅ Son statut est "Confirmée" (`confirmed`)
- ✅ Sa date est strictement inférieure à la date du jour (pas le jour même)

### Ce qui ne change pas
- ❌ Les missions "Planifiées" ne sont PAS mises à jour automatiquement
- ❌ Les missions "Annulées" ne sont PAS modifiées
- ❌ Les missions "Réalisées" restent "Réalisées"
- ❌ Les missions du jour même ne sont PAS modifiées (uniquement celles vraiment passées)

## Exemple de fonctionnement

### Scénario
- Aujourd'hui : **5 octobre 2025**
- Mission 1 : 3 octobre 2025, statut "Confirmée" → ✅ **Passe en "Réalisée"**
- Mission 2 : 4 octobre 2025, statut "Confirmée" → ✅ **Passe en "Réalisée"**
- Mission 3 : 5 octobre 2025, statut "Confirmée" → ❌ **Reste "Confirmée"** (c'est aujourd'hui)
- Mission 4 : 6 octobre 2025, statut "Confirmée" → ❌ **Reste "Confirmée"** (future)
- Mission 5 : 2 octobre 2025, statut "Planifiée" → ❌ **Reste "Planifiée"**

### Log console
```
✅ 2 mission(s) passée(s) au statut "Réalisée" automatiquement
```

## Traçabilité

Chaque mission mise à jour automatiquement reçoit un timestamp `autoUpdatedAt` :
```javascript
mission = {
    // ... autres propriétés
    status: "completed",
    autoUpdatedAt: "2025-10-05T08:30:00.000Z"  // Date/heure de la mise à jour auto
}
```

Cela permet de distinguer :
- Les missions passées manuellement en "Réalisée" par l'utilisateur
- Les missions passées automatiquement en "Réalisée" par le système

## Avantages

✅ **Automatique** : Aucune intervention manuelle nécessaire  
✅ **Silencieux** : Ne dérange pas l'utilisateur  
✅ **Fiable** : Vérifié à chaque chargement de page  
✅ **Traçable** : Timestamp de mise à jour automatique  
✅ **Prudent** : Ne touche que les missions confirmées du passé  

## Notes techniques

- La vérification se fait uniquement sur la partie date (pas l'heure)
- Utilise `setHours(0, 0, 0, 0)` pour réinitialiser l'heure à minuit
- Compare avec `<` (strictement inférieur) et non `<=` pour ne pas toucher le jour même
- Les logs sont visibles dans la console navigateur (F12)
- Aucune notification popup pour ne pas déranger l'utilisateur

## Cas d'usage

Cette fonctionnalité est particulièrement utile pour :
- Les infirmiers qui confirment leurs missions à l'avance
- Éviter d'avoir à passer manuellement chaque mission en "Réalisée"
- Maintenir un historique propre et à jour automatiquement
- Se concentrer uniquement sur les missions futures et actuelles
