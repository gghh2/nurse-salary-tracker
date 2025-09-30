/**
 * Gestionnaire de swipe pour navigation entre les mois
 * Permet de swiper à gauche/droite pour changer de mois dans Planning et Tableau de bord
 */

class SwipeHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50; // Distance minimale pour déclencher un swipe (px)
        this.maxVerticalDistance = 100; // Distance verticale max pour valider un swipe horizontal
        
        // Initialiser sur mobile uniquement
        if (this.isMobile()) {
            this.init();
        }
    }
    
    /**
     * Détecter si on est sur mobile
     */
    isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }
    
    /**
     * Initialiser les événements de swipe
     */
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSwipeEvents());
        } else {
            this.setupSwipeEvents();
        }
    }
    
    /**
     * Configurer les événements de swipe sur les sections Planning et Dashboard
     */
    setupSwipeEvents() {
        // Sélecteurs pour Planning et Dashboard
        const planningSection = document.getElementById('planning');
        const dashboardSection = document.getElementById('dashboard');
        
        // Ajouter les événements tactiles au Planning
        if (planningSection) {
            this.addSwipeListeners(planningSection, 'planning');
        }
        
        // Ajouter les événements tactiles au Dashboard
        if (dashboardSection) {
            this.addSwipeListeners(dashboardSection, 'dashboard');
        }
    }
    
    /**
     * Ajouter les listeners de swipe à un élément
     */
    addSwipeListeners(element, section) {
        // Utiliser la zone du calendrier ou des stats pour le swipe
        let swipeZone = element;
        
        if (section === 'planning') {
            // Pour Planning, utiliser la zone du calendrier
            swipeZone = element.querySelector('.planning-grid');
        } else if (section === 'dashboard') {
            // Pour Dashboard, utiliser la zone des statistiques
            swipeZone = element.querySelector('.stats-grid');
        }
        
        if (!swipeZone) {
            swipeZone = element;
        }
        
        // Touch events
        swipeZone.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        swipeZone.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        swipeZone.addEventListener('touchend', (e) => this.handleTouchEnd(e, section), { passive: true });
        
        // Mouse events pour tests sur desktop
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            let isMouseDown = false;
            
            swipeZone.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                this.touchStartX = e.clientX;
                this.touchStartY = e.clientY;
            });
            
            swipeZone.addEventListener('mousemove', (e) => {
                if (isMouseDown) {
                    this.touchEndX = e.clientX;
                    this.touchEndY = e.clientY;
                }
            });
            
            swipeZone.addEventListener('mouseup', (e) => {
                if (isMouseDown) {
                    isMouseDown = false;
                    this.handleSwipeGesture(section);
                }
            });
            
            swipeZone.addEventListener('mouseleave', () => {
                isMouseDown = false;
            });
        }
    }
    
    /**
     * Gérer le début du touch
     */
    handleTouchStart(e) {
        // Récupérer les coordonnées du premier doigt
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }
    
    /**
     * Gérer le mouvement du touch
     */
    handleTouchMove(e) {
        // Stocker les dernières coordonnées
        if (e.touches[0]) {
            this.touchEndX = e.touches[0].clientX;
            this.touchEndY = e.touches[0].clientY;
            
            // Si c'est clairement un swipe horizontal, empêcher le scroll vertical
            const deltaX = Math.abs(this.touchEndX - this.touchStartX);
            const deltaY = Math.abs(this.touchEndY - this.touchStartY);
            
            if (deltaX > deltaY && deltaX > 30) {
                e.preventDefault();
            }
        }
    }
    
    /**
     * Gérer la fin du touch
     */
    handleTouchEnd(e, section) {
        this.handleSwipeGesture(section);
    }
    
    /**
     * Traiter le geste de swipe
     */
    handleSwipeGesture(section) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = Math.abs(this.touchEndY - this.touchStartY);
        
        // Vérifier que le mouvement est principalement horizontal
        if (Math.abs(deltaX) > this.minSwipeDistance && deltaY < this.maxVerticalDistance) {
            if (deltaX > 0) {
                // Swipe vers la droite - mois précédent
                this.navigateToPreviousMonth(section);
            } else {
                // Swipe vers la gauche - mois suivant
                this.navigateToNextMonth(section);
            }
            
            // Feedback visuel
            this.showSwipeFeedback(deltaX > 0 ? 'previous' : 'next');
        }
        
        // Réinitialiser les valeurs
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
    }
    
    /**
     * Naviguer au mois précédent
     */
    navigateToPreviousMonth(section) {
        if (section === 'planning') {
            // Cliquer sur le bouton précédent du planning
            const prevBtn = document.getElementById('prev-month');
            if (prevBtn) {
                prevBtn.click();
            }
        } else if (section === 'dashboard') {
            // Cliquer sur le bouton précédent du dashboard
            const prevBtn = document.getElementById('dashboard-prev-month');
            if (prevBtn) {
                prevBtn.click();
            }
        }
    }
    
    /**
     * Naviguer au mois suivant
     */
    navigateToNextMonth(section) {
        if (section === 'planning') {
            // Cliquer sur le bouton suivant du planning
            const nextBtn = document.getElementById('next-month');
            if (nextBtn) {
                nextBtn.click();
            }
        } else if (section === 'dashboard') {
            // Cliquer sur le bouton suivant du dashboard
            const nextBtn = document.getElementById('dashboard-next-month');
            if (nextBtn) {
                nextBtn.click();
            }
        }
    }
    
    /**
     * Afficher un feedback visuel du swipe
     */
    showSwipeFeedback(direction) {
        // Créer un élément de feedback
        const feedback = document.createElement('div');
        feedback.className = 'swipe-feedback';
        feedback.innerHTML = direction === 'previous' 
            ? '<i class="fas fa-chevron-left"></i>' 
            : '<i class="fas fa-chevron-right"></i>';
        
        // Style du feedback
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            ${direction === 'previous' ? 'left: 20px' : 'right: 20px'};
            transform: translateY(-50%);
            background: rgba(44, 82, 130, 0.8);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: swipeFeedback 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(feedback);
        
        // Supprimer après l'animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }
}

// Ajouter l'animation au CSS si elle n'existe pas
if (!document.getElementById('swipe-animations')) {
    const style = document.createElement('style');
    style.id = 'swipe-animations';
    style.textContent = `
        @keyframes swipeFeedback {
            from {
                opacity: 0;
                transform: translateY(-50%) scale(0.5);
            }
            to {
                opacity: 1;
                transform: translateY(-50%) scale(1);
            }
        }
        
        /* Indicateur de swipe sur mobile */
        @media (max-width: 768px) {
            .planning-grid,
            .stats-grid {
                position: relative;
            }
            
            /* Petits indicateurs visuels de swipe */
            .planning-grid::after,
            .stats-grid::after {
                content: '';
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 2px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialiser le gestionnaire de swipe
window.swipeHandler = new SwipeHandler();