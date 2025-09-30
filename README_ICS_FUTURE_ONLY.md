# Feature: ICS Export - Future Events Only

## Description
Modification de l'export ICS pour n'inclure que les missions futures (à partir d'aujourd'hui), pas les missions passées.

## Use Case
- **Problème** : L'export ICS inclut TOUTES les missions (passées et futures), ce qui encombre inutilement le calendrier
- **Solution** : Filtrer pour n'exporter que les missions à partir de la date du jour

## Implementation Details
- Filtrage des missions par date >= aujourd'hui
- Option pour exporter tout ou seulement le futur
- Message informatif sur le nombre de missions exportées

## Benefits
- Calendrier plus propre
- Import plus rapide
- Évite la confusion avec des événements passés
- Plus logique pour l'utilisation quotidienne
