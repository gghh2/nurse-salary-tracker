// DEBUG HELPER pour Nurse Salary Tracker
// À exécuter dans la console du navigateur pour vérifier l'état de l'application

console.log("=== DEBUG NURSE SALARY TRACKER ===");

// 1. Vérifier que les instances sont disponibles
console.log("✓ DataManager disponible ?", typeof window.dataManager !== 'undefined');
console.log("✓ SalaryManager disponible ?", typeof window.salaryManager !== 'undefined');
console.log("✓ App disponible ?", typeof window.app !== 'undefined');

// 2. Vérifier les méthodes du DataManager
if (window.dataManager) {
    console.log("\n=== Méthodes DataManager ===");
    console.log("✓ getMissionById ?", typeof window.dataManager.getMissionById === 'function');
    console.log("✓ updateMission ?", typeof window.dataManager.updateMission === 'function');
    console.log("✓ deleteMission ?", typeof window.dataManager.deleteMission === 'function');
    console.log("✓ addMission ?", typeof window.dataManager.addMission === 'function');
}

// 3. Lister toutes les missions
if (window.dataManager) {
    const missions = window.dataManager.getMissions();
    console.log("\n=== Missions existantes ===");
    console.log("Nombre de missions :", missions.length);
    if (missions.length > 0) {
        console.table(missions.map(m => ({
            id: m.id,
            date: m.date,
            status: m.status,
            establishment: m.establishment
        })));
    }
}

// 4. Vérifier l'état de l'application
if (window.app) {
    console.log("\n=== État de l'app ===");
    console.log("Section courante :", window.app.currentSection);
    console.log("Mission en édition :", window.app.currentEditingMission);
    console.log("Tarif en édition :", window.app.currentEditingRate);
}

// 5. Test rapide d'une mission
console.log("\n=== Test rapide ===");
console.log("Pour tester l'édition d'une mission, exécute :");
console.log("window.app.openMissionModal('[ID_DE_LA_MISSION]')");

// 6. Fonction helper pour debugger lors du submit
window.debugMissionSubmit = function() {
    const form = document.getElementById('mission-form');
    if (form) {
        console.log("=== Debug Mission Submit ===");
        console.log("Mission ID en édition :", window.app.currentEditingMission);
        console.log("Date :", document.getElementById('mission-date').value);
        console.log("Rate ID :", document.getElementById('mission-rate').value);
        console.log("Establishment :", document.getElementById('mission-establishment').value);
        console.log("Status :", document.getElementById('mission-status').value);
        
        const missionData = {
            date: document.getElementById('mission-date').value,
            rateId: document.getElementById('mission-rate').value,
            establishment: document.getElementById('mission-establishment').value,
            service: document.getElementById('mission-service').value,
            status: document.getElementById('mission-status').value,
            notes: document.getElementById('mission-notes').value,
            realGrossSalary: parseFloat(document.getElementById('mission-real-gross').value) || null,
            realNetSalary: parseFloat(document.getElementById('mission-real-net').value) || null,
            startTime: document.getElementById('mission-start-time').value || null,
            endTime: document.getElementById('mission-end-time').value || null
        };
        
        console.log("Mission Data :", missionData);
        
        if (window.app.currentEditingMission) {
            console.log("Mode : UPDATE");
            const existingMission = window.dataManager.getMissionById(window.app.currentEditingMission);
            console.log("Mission existante :", existingMission);
        } else {
            console.log("Mode : CREATE");
        }
    }
};

console.log("\n💡 Astuce : Pour debugger le submit, exécute : debugMissionSubmit()");
console.log("💡 Astuce : Pour voir cette aide à nouveau, exécute : location.reload() puis colle ce script");
