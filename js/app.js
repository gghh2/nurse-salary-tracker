/**
 * Application principale - Gestion de l'interface utilisateur
 * Point d'entrée de l'application de suivi des salaires infirmier
 */

class NurseSalaryApp {
    constructor() {
        // Références aux gestionnaires
        this.dataManager = window.dataManager;
        this.salaryManager = window.salaryManager;
        
        // État de l'application
        this.currentSection = 'dashboard';
        this.currentEditingRate = null;
        this.currentEditingMission = null;
        
        // Initialiser l'application
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    /**
     * Configuration de l'application
     */
    setupApp() {
        this.setupEventListeners();
        this.loadDashboard();
        this.showNotification('Application chargée avec succès', 'success');
        
        // Enregistrer le Service Worker pour PWA
        this.registerServiceWorker();
    }

    /**
     * Enregistre le Service Worker pour le support PWA
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('Service Worker enregistré avec succès:', registration.scope);
                        
                        // Écouter les mises à jour
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // Nouvelle version disponible
                                    this.showNotification(
                                        'Une nouvelle version est disponible. Actualisez la page pour l\'installer.',
                                        'info',
                                        10000
                                    );
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('Échec de l\'enregistrement du Service Worker:', error);
                    });
            });

            // Écouter les messages du Service Worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    this.showNotification(event.data.message, 'info', 8000);
                }
            });
        }
    }

    /**
     * GESTION DES ÉVÉNEMENTS
     */
    setupEventListeners() {
        // Navigation principale
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.navigateToSection(section);
            });
        });

        // Boutons d'action principaux
        this.setupMainActionButtons();
        
        // Modales
        this.setupModalEvents();
        
        // Navigation du calendrier
        this.setupCalendarNavigation();
        
        // Sauvegarde
        this.setupBackupEvents();
    }

    /**
     * Configuration des boutons d'action principaux
     */
    setupMainActionButtons() {
        // Ajouter un tarif
        const addRateBtn = document.getElementById('add-rate-btn');
        if (addRateBtn) {
            addRateBtn.addEventListener('click', () => this.openRateModal());
        }

        // Ajouter une mission
        const addMissionBtn = document.getElementById('add-mission-btn');
        if (addMissionBtn) {
            addMissionBtn.addEventListener('click', () => this.openMissionModal());
        }
    }

    /**
     * Configuration des événements des modales
     */
    setupModalEvents() {
        // Modale tarifs
        const rateModal = document.getElementById('rate-modal');
        const rateForm = document.getElementById('rate-form');
        const cancelRateBtn = document.getElementById('cancel-rate');

        if (rateForm) {
            rateForm.addEventListener('submit', (e) => this.handleRateSubmit(e));
        }
        
        if (cancelRateBtn) {
            cancelRateBtn.addEventListener('click', () => this.closeModal('rate-modal'));
        }

        // Modale missions
        const missionModal = document.getElementById('mission-modal');
        const missionForm = document.getElementById('mission-form');
        const cancelMissionBtn = document.getElementById('cancel-mission');
        const deleteMissionBtn = document.getElementById('delete-mission');

        if (missionForm) {
            missionForm.addEventListener('submit', (e) => this.handleMissionSubmit(e));
        }
        
        if (cancelMissionBtn) {
            cancelMissionBtn.addEventListener('click', () => this.closeModal('mission-modal'));
        }

        if (deleteMissionBtn) {
            deleteMissionBtn.addEventListener('click', () => this.handleMissionDelete());
        }

        // Fermeture des modales en cliquant sur la croix seulement
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Retirer la fermeture par clic à l'extérieur pour éviter les fermetures accidentelles
        // Les modales ne se ferment que par les boutons explicites
    }

    /**
     * Configuration de la navigation du calendrier
     */
    setupCalendarNavigation() {
        // Navigation du planning
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.salaryManager.goToPreviousMonth();
                this.loadPlanning();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.salaryManager.goToNextMonth();
                this.loadPlanning();
            });
        }

        // Navigation du tableau de bord
        const dashboardPrevBtn = document.getElementById('dashboard-prev-month');
        const dashboardNextBtn = document.getElementById('dashboard-next-month');

        if (dashboardPrevBtn) {
            dashboardPrevBtn.addEventListener('click', () => {
                this.salaryManager.goToPreviousDashboardMonth();
                this.loadDashboard();
            });
        }

        if (dashboardNextBtn) {
            dashboardNextBtn.addEventListener('click', () => {
                this.salaryManager.goToNextDashboardMonth();
                this.loadDashboard();
            });
        }
    }

    /**
     * Configuration des événements de sauvegarde
     */
    setupBackupEvents() {
        // Export ICS
        const exportIcsBtn = document.getElementById('export-ics-btn');
        if (exportIcsBtn) {
            exportIcsBtn.addEventListener('click', () => this.exportToCalendar());
        }
        
        // Export
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Import
        const importBtn = document.getElementById('import-data-btn');
        const importFile = document.getElementById('import-file');
        
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => importFile.click());
            importFile.addEventListener('change', (e) => this.importData(e));
        }

        // Reset
        const resetBtn = document.getElementById('reset-data-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }
    }

    /**
     * NAVIGATION ENTRE SECTIONS
     */
    navigateToSection(sectionName) {
        // Mettre à jour la navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Masquer toutes les sections
        document.querySelectorAll('.app-section').forEach(section => {
            section.classList.remove('active');
        });

        // Afficher la section demandée
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Charger le contenu spécifique à la section
        this.loadSectionContent(sectionName);
    }

    /**
     * Charge le contenu spécifique à chaque section
     */
    loadSectionContent(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'rates':
                this.loadRates();
                break;
            case 'planning':
                this.loadPlanning();
                break;
            case 'backup':
                this.loadBackup();
                break;
        }
    }

    /**
     * TABLEAU DE BORD
     */
    loadDashboard() {
        const dashboardData = this.salaryManager.getDashboardData();
        
        // Mettre à jour les statistiques
        this.updateElement('current-month-total', dashboardData.stats.currentMonthTotal);
        this.updateElement('current-month-real', dashboardData.stats.currentMonthReal);
        this.updateElement('current-month-hours', dashboardData.stats.currentMonthHours);
        this.updateElement('missions-count', dashboardData.stats.missionsCount);
        this.updateElement('hourly-average', dashboardData.stats.hourlyAverage);

        // Mettre à jour les titres du mois
        const dashboardTitle = document.getElementById('dashboard-month-title');
        const dashboardDisplay = document.getElementById('dashboard-month-display');
        
        if (dashboardTitle) {
            dashboardTitle.textContent = dashboardData.viewInfo.monthName;
        }
        
        if (dashboardDisplay) {
            dashboardDisplay.textContent = dashboardData.viewInfo.monthName;
        }

        // Afficher les prochaines missions (toujours basé sur le mois actuel)
        this.displayUpcomingMissions(dashboardData.upcomingMissions);
    }

    /**
     * Affiche les prochaines missions
     */
    displayUpcomingMissions(missions) {
        const container = document.getElementById('upcoming-missions');
        if (!container) return;

        if (missions.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucune mission planifiée dans les 7 prochains jours</p>';
            return;
        }

        const missionsHtml = missions.map(mission => `
            <div class="mission-row">
                <div class="mission-date">${mission.formattedDate}</div>
                <div class="mission-details">
                    <div class="mission-type">${mission.rate ? mission.rate.acronym : 'Type inconnu'}</div>
                    <div class="mission-info">
                        ${mission.establishment ? mission.establishment + ' - ' : ''}
                        ${mission.service || ''}
                        ${mission.rate ? (mission.rate.hours === 0 ? '(Indemnité)' : `(${mission.rate.hours}h)`) : ''}
                    </div>
                </div>
                <div class="mission-salary">
                    ${mission.rate ? this.salaryManager.formatCurrency(mission.rate.salary) : ''}
                </div>
                <div class="mission-status status-${mission.status}">
                    ${this.salaryManager.getStatusLabel(mission.status)}
                </div>
            </div>
        `).join('');

        container.innerHTML = missionsHtml;
    }

    /**
     * GESTION DES TARIFS
     */
    loadRates() {
        const ratesData = this.salaryManager.getRatesTableData();
        this.displayRatesTable(ratesData);
    }

    /**
     * Affiche le tableau des tarifs
     */
    displayRatesTable(rates) {
        const tbody = document.getElementById('rates-table-body');
        if (!tbody) return;

        if (rates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun tarif configuré</td></tr>';
            return;
        }

        const ratesHtml = rates.map(rate => `
            <tr>
                <td><strong>${rate.acronym}</strong></td>
                <td>${rate.description || '-'}</td>
                <td>${rate.establishment || '-'}</td>
                <td>${rate.hours === 0 ? 'Indemnité' : rate.hours + 'h'}</td>
                <td>${rate.formattedSalary}</td>
                <td>${rate.hours === 0 ? '-' : (rate.hourlyRate ? rate.hourlyRate.toFixed(3) + '€/h' : rate.formattedHourlyRate)}</td>
                <td class="actions">
                    <button class="btn btn-small btn-secondary" onclick="app.editRate('${rate.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="app.deleteRate('${rate.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = ratesHtml;
    }

    /**
     * Ouvre la modale pour ajouter/modifier un tarif
     */
    openRateModal(rateId = null) {
        const modal = document.getElementById('rate-modal');
        const form = document.getElementById('rate-form');
        const title = document.getElementById('rate-modal-title');
        
        if (!modal || !form) return;

        // Réinitialiser le formulaire
        form.reset();
        this.currentEditingRate = rateId;

        // Charger les établissements existants
        this.loadEstablishmentsList('establishments-list');
        
        // Configurer le calcul automatique entre tarif horaire et salaire
        this.setupRateCalculation();

        if (rateId) {
            // Mode édition
            const rate = this.dataManager.getRateById(rateId);
            if (rate) {
                title.textContent = 'Modifier le tarif';
                document.getElementById('rate-acronym').value = rate.acronym;
                document.getElementById('rate-description').value = rate.description || '';
                document.getElementById('rate-establishment').value = rate.establishment || '';
                document.getElementById('rate-hours').value = rate.hours;
                document.getElementById('rate-hourly-rate').value = rate.hourlyRate || '';
                document.getElementById('rate-salary').value = rate.salary || '';
                document.getElementById('rate-start-time').value = rate.startTime || '';
                document.getElementById('rate-end-time').value = rate.endTime || '';
            }
        } else {
            // Mode création
            title.textContent = 'Ajouter un tarif';
        }

        this.showModal('rate-modal');
    }

    /**
     * Configure le calcul automatique entre tarif horaire et salaire
     */
    setupRateCalculation() {
        const hoursInput = document.getElementById('rate-hours');
        const hourlyRateInput = document.getElementById('rate-hourly-rate');
        const salaryInput = document.getElementById('rate-salary');
        
        if (!hoursInput || !hourlyRateInput || !salaryInput) return;

        // Fonction pour calculer le salaire depuis tarif horaire
        const calculateSalaryFromHourly = () => {
            const hours = parseFloat(hoursInput.value);
            const hourlyRate = parseFloat(hourlyRateInput.value);
            
            if (hours > 0 && hourlyRate > 0 && !salaryInput.value) {
                const calculatedSalary = hours * hourlyRate;
                salaryInput.value = calculatedSalary.toFixed(3);
            }
        };

        // Fonction pour calculer le tarif horaire depuis salaire
        const calculateHourlyFromSalary = () => {
            const hours = parseFloat(hoursInput.value);
            const salary = parseFloat(salaryInput.value);
            
            if (hours > 0 && salary > 0 && !hourlyRateInput.value) {
                const calculatedHourly = salary / hours;
                hourlyRateInput.value = calculatedHourly.toFixed(3);
            }
        };

        // Retirer les anciens event listeners en clonant les éléments
        const newHoursInput = hoursInput.cloneNode(true);
        const newHourlyRateInput = hourlyRateInput.cloneNode(true);
        const newSalaryInput = salaryInput.cloneNode(true);
        
        hoursInput.parentNode.replaceChild(newHoursInput, hoursInput);
        hourlyRateInput.parentNode.replaceChild(newHourlyRateInput, hourlyRateInput);
        salaryInput.parentNode.replaceChild(newSalaryInput, salaryInput);

        // Ajouter les événements de calcul automatique
        newHoursInput.addEventListener('input', () => {
            calculateSalaryFromHourly();
            calculateHourlyFromSalary();
        });
        
        newHourlyRateInput.addEventListener('input', calculateSalaryFromHourly);
        newSalaryInput.addEventListener('input', calculateHourlyFromSalary);
    }

    /**
     * Gère la soumission du formulaire de tarif
     */
    handleRateSubmit(e) {
        e.preventDefault();
        
        const hours = parseFloat(document.getElementById('rate-hours').value);
        const hourlyRate = parseFloat(document.getElementById('rate-hourly-rate').value) || null;
        const salary = parseFloat(document.getElementById('rate-salary').value) || null;
        
        // Calculer automatiquement ce qui manque si possible
        let finalHourlyRate = hourlyRate;
        let finalSalary = salary;
        
        // Si on a les heures et un seul des deux valeurs, calculer l'autre
        if (hours > 0) {
            if (hourlyRate && !salary) {
                finalSalary = hours * hourlyRate;
            } else if (salary && !hourlyRate) {
                finalHourlyRate = salary / hours;
            }
        }
        
        // Pour les indemnités (0h), on ne calcule pas de tarif horaire
        if (hours === 0 && salary && !hourlyRate) {
            finalHourlyRate = null;
        }
        
        const rateData = {
            acronym: document.getElementById('rate-acronym').value,
            description: document.getElementById('rate-description').value,
            establishment: document.getElementById('rate-establishment').value,
            hours: hours,
            hourlyRate: finalHourlyRate,
            salary: finalSalary,
            startTime: document.getElementById('rate-start-time').value || null,
            endTime: document.getElementById('rate-end-time').value || null
        };

        // Validation
        const validation = this.dataManager.validateRate(rateData);
        if (!validation.isValid) {
            this.showNotification(validation.errors.join('<br>'), 'error');
            return;
        }

        // Sauvegarde
        let success = false;
        if (this.currentEditingRate) {
            success = this.dataManager.updateRate(this.currentEditingRate, rateData);
        } else {
            success = this.dataManager.addRate(rateData);
        }

        if (success) {
            this.showNotification(
                this.currentEditingRate ? 'Tarif modifié avec succès' : 'Tarif ajouté avec succès',
                'success'
            );
            this.closeModal('rate-modal');
            this.loadRates();
        } else {
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    /**
     * Modifie un tarif
     */
    editRate(rateId) {
        this.openRateModal(rateId);
    }

    /**
     * Supprime un tarif
     */
    deleteRate(rateId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
            return;
        }

        const success = this.dataManager.deleteRate(rateId);
        if (success) {
            this.showNotification('Tarif supprimé avec succès', 'success');
            this.loadRates();
        } else {
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    }

    /**
     * PLANNING
     */
    loadPlanning() {
        const planningData = this.salaryManager.getPlanningData();
        this.displayCalendar(planningData.calendarData);
        this.updateMonthDisplay(planningData.viewInfo);
        this.updateMonthSummary(planningData.monthStats);
    }

    /**
     * Affiche le calendrier
     */
    displayCalendar(calendarData) {
        const container = document.getElementById('planning-grid');
        if (!container) return;

        // En-tête du calendrier
        const header = `
            <div class="calendar-header">
                <div>Lun</div>
                <div>Mar</div>
                <div>Mer</div>
                <div>Jeu</div>
                <div>Ven</div>
                <div>Sam</div>
                <div>Dim</div>
            </div>
        `;

        // Jours du calendrier
        const daysHtml = calendarData.map(day => {
            const classes = [
                'calendar-day',
                !day.isCurrentMonth ? 'other-month' : '',
                day.isToday ? 'today' : '',
                day.hasMission ? 'has-mission' : ''
            ].filter(Boolean).join(' ');

            const missionsHtml = day.missions.map(mission => {
                const rate = this.dataManager.getRateById(mission.rateId);
                return `
                    <div class="mission-item status-${mission.status}" 
                         onclick="event.stopPropagation(); app.viewMissionDetails('${mission.id}')"
                         title="${rate ? rate.acronym : 'Inconnu'} - ${mission.establishment || ''}">
                        ${rate ? rate.acronym : '?'}
                    </div>
                `;
            }).join('');

            return `
                <div class="${classes}" 
                     onclick="app.addMissionToDate('${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}-${String(day.date.getDate()).padStart(2, '0')}')">
                    <div class="day-number">${day.dayNumber}</div>
                    ${missionsHtml}
                </div>
            `;
        }).join('');

        const calendarGrid = `<div class="calendar-grid">${daysHtml}</div>`;
        container.innerHTML = header + calendarGrid;
    }

    /**
     * Met à jour l'affichage du mois
     */
    updateMonthDisplay(viewInfo) {
        const display = document.getElementById('current-month-display');
        const planningTitle = document.getElementById('planning-month-title');
        const planningSummaryTitle = document.getElementById('planning-summary-month');
        
        if (display) {
            display.textContent = viewInfo.monthName;
        }
        
        if (planningTitle) {
            planningTitle.textContent = viewInfo.monthName;
        }
        
        if (planningSummaryTitle) {
            planningSummaryTitle.textContent = viewInfo.monthName;
        }
    }

    /**
     * Met à jour le résumé mensuel
     */
    updateMonthSummary(monthStats) {
        this.updateElement('month-missions-total', monthStats.totalMissions);
        this.updateElement('month-hours-total', monthStats.totalHours);
        this.updateElement('month-salary-total', monthStats.totalEstimatedSalary);
        this.updateElement('month-real-salary-total', monthStats.totalRealSalary);
        
        // Gérer l'affichage de l'écart avec couleur
        const differenceElement = document.getElementById('month-salary-difference');
        if (differenceElement) {
            differenceElement.textContent = monthStats.salaryDifference;
            
            // Retirer les anciennes classes
            differenceElement.classList.remove('positive', 'negative');
            
            // Ajouter la classe appropriée
            if (monthStats.salaryDifferenceClass) {
                differenceElement.classList.add(monthStats.salaryDifferenceClass);
            }
        }
    }

    /**
     * Ajoute une mission à une date spécifique
     */
    addMissionToDate(date) {
        this.openMissionModal(null, date);
    }

    /**
     * Affiche les détails d'une mission (mode lecture)
     */
    viewMissionDetails(missionId) {
        this.openMissionModal(missionId);
    }

    /**
     * Configure l'auto-complétion de l'établissement quand on sélectionne un tarif
     */
    setupRateSelectAutoComplete() {
        const rateSelect = document.getElementById('mission-rate');
        const establishmentInput = document.getElementById('mission-establishment');
        const startTimeInput = document.getElementById('mission-start-time');
        const endTimeInput = document.getElementById('mission-end-time');
        
        if (!rateSelect || !establishmentInput) return;

        // Retirer l'ancien event listener s'il existe
        const newRateSelect = rateSelect.cloneNode(true);
        rateSelect.parentNode.replaceChild(newRateSelect, rateSelect);
        
        // Recharger les options
        this.loadRateOptions(newRateSelect);

        newRateSelect.addEventListener('change', (e) => {
            const selectedRateId = e.target.value;
            if (selectedRateId) {
                const rate = this.dataManager.getRateById(selectedRateId);
                if (rate) {
                    // Auto-compléter l'établissement seulement si le champ est vide
                    if (rate.establishment && !establishmentInput.value.trim()) {
                        establishmentInput.value = rate.establishment;
                    }
                    
                    // Auto-compléter les horaires depuis le tarif
                    if (rate.startTime && startTimeInput) {
                        startTimeInput.value = rate.startTime;
                    }
                    if (rate.endTime && endTimeInput) {
                        endTimeInput.value = rate.endTime;
                    }
                }
            }
        });
    }

    /**
     * Ouvre la modale pour ajouter/modifier une mission
     */
    openMissionModal(missionId = null, defaultDate = null) {
        const modal = document.getElementById('mission-modal');
        const form = document.getElementById('mission-form');
        const title = document.getElementById('mission-modal-title');
        const rateSelect = document.getElementById('mission-rate');
        const deleteBtn = document.getElementById('delete-mission');
        
        if (!modal || !form) return;

        // Réinitialiser le formulaire
        form.reset();
        this.currentEditingMission = missionId;

        // Charger les options de tarifs
        this.loadRateOptions(rateSelect);
        
        // Charger les établissements existants
        this.loadEstablishmentsList('mission-establishments-list');

        // Ajouter l'événement pour l'auto-complétion de l'établissement
        this.setupRateSelectAutoComplete();

        if (missionId) {
            // Mode édition/visualisation
            const mission = this.dataManager.getMissionById(missionId);
            if (mission) {
                title.textContent = 'Détails de la mission';
                document.getElementById('mission-date').value = mission.date;
                document.getElementById('mission-rate').value = mission.rateId;
                document.getElementById('mission-establishment').value = mission.establishment || '';
                document.getElementById('mission-service').value = mission.service || '';
                document.getElementById('mission-status').value = mission.status;
                document.getElementById('mission-notes').value = mission.notes || '';
                document.getElementById('mission-real-gross').value = mission.realGrossSalary || '';
                document.getElementById('mission-real-net').value = mission.realNetSalary || '';
                document.getElementById('mission-start-time').value = mission.startTime || '';
                document.getElementById('mission-end-time').value = mission.endTime || '';
                
                // Afficher le bouton supprimer
                if (deleteBtn) {
                    deleteBtn.style.display = 'block';
                }
            }
        } else {
            // Mode création
            title.textContent = 'Ajouter une mission';
            if (defaultDate) {
                document.getElementById('mission-date').value = defaultDate;
            }
            
            // Masquer le bouton supprimer
            if (deleteBtn) {
                deleteBtn.style.display = 'none';
            }
        }

        this.showModal('mission-modal');
    }

    /**
     * Gère la suppression d'une mission depuis la modale
     */
    handleMissionDelete() {
        if (!this.currentEditingMission) return;
        
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
            return;
        }

        const success = this.dataManager.deleteMission(this.currentEditingMission);
        if (success) {
            this.showNotification('Mission supprimée avec succès', 'success');
            this.closeModal('mission-modal');
            this.loadPlanning();
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } else {
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    }

    /**
     * Charge les options de tarifs dans le select
     */
    loadRateOptions(selectElement) {
        if (!selectElement) return;

        const rates = this.dataManager.getRates();
        selectElement.innerHTML = '<option value="">Sélectionner un type</option>';
        
        rates.forEach(rate => {
            const option = document.createElement('option');
            option.value = rate.id;
            
            if (rate.hours === 0) {
                // Indemnité
                option.textContent = `${rate.acronym} - Indemnité - ${this.salaryManager.formatCurrency(rate.salary)}`;
            } else {
                // Mission normale
                option.textContent = `${rate.acronym} - ${rate.hours}h - ${this.salaryManager.formatCurrency(rate.salary)}`;
            }
            
            selectElement.appendChild(option);
        });
    }

    /**
     * Charge la liste des établissements dans un datalist
     */
    loadEstablishmentsList(datalistId) {
        const datalist = document.getElementById(datalistId);
        if (!datalist) return;

        const establishments = this.dataManager.getEstablishments();
        datalist.innerHTML = '';
        
        establishments.forEach(establishment => {
            const option = document.createElement('option');
            option.value = establishment;
            datalist.appendChild(option);
        });
    }

    /**
     * Gère la soumission du formulaire de mission
     */
    handleMissionSubmit(e) {
        e.preventDefault();
        
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

        // Validation
        const validation = this.dataManager.validateMission(missionData);
        if (!validation.isValid) {
            this.showNotification(validation.errors.join('<br>'), 'error');
            return;
        }

        // Validation de la date
        const dateValidation = this.salaryManager.validateMissionDate(
            missionData.date, 
            this.currentEditingMission
        );
        
        if (dateValidation.warnings.length > 0) {
            const proceed = confirm(
                `Attention :\n${dateValidation.warnings.join('\n')}\n\nVoulez-vous continuer ?`
            );
            if (!proceed) return;
        }

        // Sauvegarde
        let success = false;
        if (this.currentEditingMission) {
            success = this.dataManager.updateMission(this.currentEditingMission, missionData);
        } else {
            success = this.dataManager.addMission(missionData);
        }

        if (success) {
            this.showNotification(
                this.currentEditingMission ? 'Mission modifiée avec succès' : 'Mission ajoutée avec succès',
                'success'
            );
            this.closeModal('mission-modal');
            this.loadPlanning();
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } else {
            this.showNotification('Erreur lors de la sauvegarde', 'error');
        }
    }

    /**
     * Modifie une mission
     */
    editMission(missionId) {
        this.openMissionModal(missionId);
    }

    /**
     * Supprime une mission
     */
    deleteMission(missionId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
            return;
        }

        const success = this.dataManager.deleteMission(missionId);
        if (success) {
            this.showNotification('Mission supprimée avec succès', 'success');
            this.loadPlanning();
            if (this.currentSection === 'dashboard') {
                this.loadDashboard();
            }
        } else {
            this.showNotification('Erreur lors de la suppression', 'error');
        }
    }

    /**
     * SAUVEGARDE ET RESTAURATION
     */
    loadBackup() {
        const storageInfo = this.dataManager.getStorageInfo();
        console.log('Informations de stockage:', storageInfo);
    }

    /**
     * Exporte les missions vers Google Calendar (fichier ICS)
     */
    exportToCalendar() {
        try {
            const missions = this.dataManager.getMissions();
            
            if (missions.length === 0) {
                this.showNotification('Aucune mission à exporter', 'warning');
                return;
            }
            
            // Générer le fichier ICS
            const icsContent = this.salaryManager.generateICSFile();
            
            // Nom du fichier avec timestamp
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const filename = `missions-infirmier-${dateStr}.ics`;
            
            // Télécharger le fichier
            this.downloadFile(icsContent, filename, 'text/calendar');
            
            this.showNotification(
                `✅ Fichier ICS téléchargé !<br><br>` +
                `📱 <strong>Sur mobile :</strong> Ouvrir le fichier pour l'ajouter à Google Calendar<br>` +
                `💻 <strong>Sur PC :</strong> Google Calendar → ⚙️ Paramètres → Importer et exporter → Importer`,
                'success',
                8000
            );
            
        } catch (error) {
            console.error('Erreur lors de l\'export ICS:', error);
            this.showNotification('Erreur lors de l\'export vers Calendar', 'error');
        }
    }

    /**
     * Exporte les données
     */
    exportData() {
        try {
            const data = this.dataManager.exportAllData();
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            const filename = `nurse-salary-backup-${timestamp}.json`;
            
            this.downloadFile(data, filename, 'application/json');
            this.showNotification('Données exportées avec succès', 'success');
            
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            this.showNotification('Erreur lors de l\'export', 'error');
        }
    }

    /**
     * Importe les données
     */
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const success = this.dataManager.importAllData(e.target.result);
                
                if (success) {
                    this.showNotification('Données importées avec succès', 'success');
                    // Recharger l'interface
                    this.loadSectionContent(this.currentSection);
                } else {
                    this.showNotification('Erreur lors de l\'import: format de fichier invalide', 'error');
                }
                
            } catch (error) {
                console.error('Erreur lors de l\'import:', error);
                this.showNotification('Erreur lors de l\'import: fichier corrompu', 'error');
            }
        };
        
        reader.readAsText(file);
        // Réinitialiser l'input file
        event.target.value = '';
    }



    /**
     * Remet à zéro toutes les données
     */
    resetData() {
        const confirmation = prompt(
            'ATTENTION: Cette action supprimera TOUTES vos données de façon irréversible.\n\n' +
            'Tapez "SUPPRIMER" en majuscules pour confirmer:'
        );
        
        if (confirmation === 'SUPPRIMER') {
            const success = this.dataManager.clearAllData();
            if (success) {
                this.showNotification('Toutes les données ont été supprimées', 'success');
                // Recharger l'interface
                this.loadSectionContent(this.currentSection);
            } else {
                this.showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }

    /**
     * UTILITAIRES D'INTERFACE
     */

    /**
     * Affiche une modale
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Ferme une modale
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Réinitialiser les variables d'édition
            if (modalId === 'rate-modal') {
                this.currentEditingRate = null;
            } else if (modalId === 'mission-modal') {
                this.currentEditingMission = null;
            }
        }
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;

        container.appendChild(notification);

        // Supprimer automatiquement la notification
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    /**
     * Met à jour un élément du DOM
     */
    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Télécharge un fichier
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}

// Initialiser l'application quand tout est prêt
window.app = new NurseSalaryApp();