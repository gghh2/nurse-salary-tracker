/**
 * Google Apps Script - Backend pour Nurse Salary Tracker
 * À déployer sur script.google.com
 * 
 * Ce script fait office d'API entre l'application et Google Drive
 */

// Configuration
const FOLDER_NAME = 'NurseSalaryTracker_Backups';
const MAX_BACKUPS = 10; // Garder les 10 derniers backups

/**
 * GET - Récupérer le dernier backup
 */
function doGet(e) {
  try {
    // Vérifier le token
    if (!e.parameter.token || e.parameter.token !== getToken()) {
      return createResponse({
        success: false,
        error: 'Token invalide'
      });
    }

    // Récupérer le dossier de backup
    const folder = getOrCreateFolder();
    
    // Chercher le fichier le plus récent
    const files = folder.getFilesByType('application/json');
    let latestFile = null;
    let latestDate = new Date(0);
    
    while (files.hasNext()) {
      const file = files.next();
      if (file.getLastUpdated() > latestDate) {
        latestDate = file.getLastUpdated();
        latestFile = file;
      }
    }
    
    if (!latestFile) {
      return createResponse({
        success: false,
        error: 'Aucun backup trouvé'
      });
    }
    
    // Lire le contenu
    const content = latestFile.getBlob().getDataAsString();
    
    return createResponse({
      success: true,
      data: JSON.parse(content),
      lastBackup: latestDate.toISOString(),
      fileName: latestFile.getName()
    });
    
  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * POST - Sauvegarder un nouveau backup
 */
function doPost(e) {
  try {
    // Vérifier le token
    const data = JSON.parse(e.postData.contents);
    
    if (!data.token || data.token !== getToken()) {
      return createResponse({
        success: false,
        error: 'Token invalide'
      });
    }
    
    // Récupérer ou créer le dossier
    const folder = getOrCreateFolder();
    
    // Créer le nom du fichier avec timestamp
    const now = new Date();
    const fileName = `backup-${now.getFullYear()}-${
      String(now.getMonth() + 1).padStart(2, '0')
    }-${
      String(now.getDate()).padStart(2, '0')
    }-${
      String(now.getHours()).padStart(2, '0')
    }${
      String(now.getMinutes()).padStart(2, '0')
    }.json`;
    
    // Créer le fichier
    const blob = Utilities.newBlob(
      JSON.stringify(data.backup, null, 2),
      'application/json',
      fileName
    );
    
    const file = folder.createFile(blob);
    
    // Nettoyer les anciens backups
    cleanOldBackups(folder);
    
    return createResponse({
      success: true,
      message: 'Backup sauvegardé avec succès',
      fileName: fileName,
      fileId: file.getId(),
      timestamp: now.toISOString()
    });
    
  } catch (error) {
    return createResponse({
      success: false,
      error: error.toString()
    });
  }
}

/**
 * Récupérer ou créer le dossier de backup
 */
function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(FOLDER_NAME);
  }
}

/**
 * Nettoyer les anciens backups (garder seulement les MAX_BACKUPS plus récents)
 */
function cleanOldBackups(folder) {
  const files = folder.getFilesByType('application/json');
  const fileList = [];
  
  // Lister tous les fichiers
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({
      file: file,
      date: file.getLastUpdated()
    });
  }
  
  // Trier par date (plus récent en premier)
  fileList.sort((a, b) => b.date - a.date);
  
  // Supprimer les anciens
  for (let i = MAX_BACKUPS; i < fileList.length; i++) {
    fileList[i].file.setTrashed(true);
  }
}

/**
 * Créer une réponse JSON
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Obtenir le token de sécurité
 * IMPORTANT : Changez ce token après le déploiement !
 */
function getToken() {
  // Vous pouvez générer un token aléatoire sur https://www.uuidgenerator.net/
  // ou utiliser : Utilities.getUuid()
  return 'VOTRE-TOKEN-SECRET-ICI';
}

/**
 * Fonction de test
 */
function test() {
  Logger.log('Token actuel : ' + getToken());
  Logger.log('Dossier : ' + getOrCreateFolder().getName());
}
