/**
 * Google Drive Sync Manager
 * Gestion de la synchronisation avec Google Drive via Apps Script
 */

class GoogleDriveSync {
    constructor() {
        // URL du Web App Google Apps Script (à remplir après déploiement)
        this.scriptUrl = ''; // Sera rempli après configuration
        
        // Token de sécurité (doit correspondre à celui dans Apps Script)
        this.token = ''; // Sera rempli après configuration
        
        // État de la synchronisation
        this.isSyncing = false;
        this.lastSyncTime = this.getLastSyncTime();
        
        // Charger la configuration depuis localStorage
        this.loadConfig();
    }
    
    /**
     * Charger la configuration depuis localStorage
     */
    loadConfig() {
        const config = localStorage.getItem('google_drive_config');
        if (config) {
            const parsedConfig = JSON.parse(config);
            this.scriptUrl = parsedConfig.scriptUrl || '';
            this.token = parsedConfig.token || '';
        }
    }
    
    /**
     * Sauvegarder la configuration
     */
    saveConfig(scriptUrl, token) {
        this.scriptUrl = scriptUrl;
        this.token = token;
        
        localStorage.setItem('google_drive_config', JSON.stringify({
            scriptUrl: scriptUrl,
            token: token
        }));
    }
    
    /**
     * Vérifier si la configuration est valide
     */
    isConfigured() {
        return this.scriptUrl && this.token;
    }
    
    /**
     * Sauvegarder sur Google Drive
     */
    async backup() {
        if (!this.isConfigured()) {
            throw new Error('Google Drive n\'est pas configuré. Veuillez configurer l\'URL et le token.');
        }
        
        if (this.isSyncing) {
            throw new Error('Une synchronisation est déjà en cours');
        }
        
        try {
            this.isSyncing = true;
            
            // Récupérer les données à sauvegarder
            const dataManager = window.dataManager;
            const backup = {
                version: '2.0',
                timestamp: new Date().toISOString(),
                app: 'NurseSalaryTracker',
                data: {
                    rates: dataManager.getRates(),
                    missions: dataManager.getMissions(),
                    settings: dataManager.getSettings()
                }
            };
            
            // Préparer la requête
            const payload = {
                token: this.token,
                backup: backup
            };
            
            // Envoyer vers Google Apps Script
            const response = await fetch(this.scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Important pour éviter les problèmes CORS
                body: JSON.stringify(payload)
            });
            
            // Note : avec no-cors, on ne peut pas lire la réponse
            // On considère que c'est OK si pas d'erreur
            this.updateLastSyncTime();
            
            return {
                success: true,
                message: 'Backup envoyé vers Google Drive',
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Erreur lors du backup:', error);
            throw error;
        } finally {
            this.isSyncing = false;
        }
    }
    
    /**
     * Restaurer depuis Google Drive
     */
    async restore() {
        if (!this.isConfigured()) {
            throw new Error('Google Drive n\'est pas configuré. Veuillez configurer l\'URL et le token.');
        }
        
        if (this.isSyncing) {
            throw new Error('Une synchronisation est déjà en cours');
        }
        
        try {
            this.isSyncing = true;
            
            // Récupérer le backup depuis Google Apps Script
            const url = `${this.scriptUrl}?token=${encodeURIComponent(this.token)}`;
            
            const response = await fetch(url, {
                method: 'GET'
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Erreur lors de la récupération du backup');
            }
            
            // Valider les données
            if (!result.data || !result.data.data) {
                throw new Error('Format de backup invalide');
            }
            
            // Demander confirmation avant de restaurer
            const confirmation = confirm(
                `Voulez-vous vraiment restaurer le backup du ${new Date(result.lastBackup).toLocaleString('fr-FR')} ?\n\n` +
                `⚠️ ATTENTION : Cela remplacera toutes vos données actuelles !`
            );
            
            if (!confirmation) {
                return {
                    success: false,
                    message: 'Restauration annulée'
                };
            }
            
            // Faire un backup local avant de restaurer (au cas où)
            this.createLocalBackup('avant-restauration');
            
            // Restaurer les données
            const dataManager = window.dataManager;
            const backupData = result.data.data;
            
            // Importer les données
            const importSuccess = dataManager.importData({
                rates: backupData.rates || [],
                missions: backupData.missions || [],
                settings: backupData.settings || {}
            });
            
            if (!importSuccess) {
                throw new Error('Échec de l\'import des données');
            }
            
            this.updateLastSyncTime();
            
            return {
                success: true,
                message: `Backup du ${new Date(result.lastBackup).toLocaleString('fr-FR')} restauré avec succès`,
                timestamp: result.lastBackup
            };
            
        } catch (error) {
            console.error('Erreur lors de la restauration:', error);
            throw error;
        } finally {
            this.isSyncing = false;
        }
    }
    
    /**
     * Créer un backup local de sécurité
     */
    createLocalBackup(suffix = 'auto') {
        const dataManager = window.dataManager;
        const backup = dataManager.exportData();
        
        const key = `nurse_salary_backup_${suffix}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(backup));
        
        // Nettoyer les anciens backups locaux (garder les 5 derniers)
        this.cleanLocalBackups();
    }
    
    /**
     * Nettoyer les anciens backups locaux
     */
    cleanLocalBackups() {
        const backupKeys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('nurse_salary_backup_')) {
                backupKeys.push(key);
            }
        }
        
        // Trier par date (plus récent en premier)
        backupKeys.sort().reverse();
        
        // Supprimer les anciens (garder les 5 derniers)
        for (let i = 5; i < backupKeys.length; i++) {
            localStorage.removeItem(backupKeys[i]);
        }
    }
    
    /**
     * Obtenir la date de dernière synchronisation
     */
    getLastSyncTime() {
        const timestamp = localStorage.getItem('google_drive_last_sync');
        return timestamp ? new Date(timestamp) : null;
    }
    
    /**
     * Mettre à jour la date de dernière synchronisation
     */
    updateLastSyncTime() {
        const now = new Date();
        this.lastSyncTime = now;
        localStorage.setItem('google_drive_last_sync', now.toISOString());
    }
    
    /**
     * Obtenir le statut de synchronisation formaté
     */
    getSyncStatus() {
        if (this.isSyncing) {
            return {
                text: 'Synchronisation en cours...',
                icon: '🔄',
                class: 'syncing'
            };
        }
        
        if (!this.isConfigured()) {
            return {
                text: 'Non configuré',
                icon: '⚠️',
                class: 'not-configured'
            };
        }
        
        if (this.lastSyncTime) {
            const now = new Date();
            const diff = now - this.lastSyncTime;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            
            let timeText = '';
            if (days > 0) {
                timeText = `il y a ${days} jour${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                timeText = `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                timeText = `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
            } else {
                timeText = 'à l\'instant';
            }
            
            return {
                text: `Dernière sync : ${timeText}`,
                icon: '✅',
                class: 'synced'
            };
        }
        
        return {
            text: 'Jamais synchronisé',
            icon: '❌',
            class: 'never-synced'
        };
    }
    
    /**
     * Tester la connexion
     */
    async testConnection() {
        if (!this.isConfigured()) {
            throw new Error('Configuration manquante');
        }
        
        try {
            // Essayer de récupérer un backup
            const url = `${this.scriptUrl}?token=${encodeURIComponent(this.token)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            return result.success;
            
        } catch (error) {
            console.error('Test de connexion échoué:', error);
            return false;
        }
    }
}

// Créer une instance globale
window.googleDriveSync = new GoogleDriveSync();