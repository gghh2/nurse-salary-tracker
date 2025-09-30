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
        this.isSwiping = false; // Flag pour indiquer si on est en train de swiper
        
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
            
            // Vérifier si l'utilisateur a déjà vu le tutoriel de swipe
            if (localStorage.getItem('planning-swipe-tutorial-seen') === 'true') {
                planningSection.classList.add('swipe-used');
            } else {
                // Masquer automatiquement l'indicateur après 8 secondes
                setTimeout(() => {
                    planningSection.classList.add('swipe-used');
                }, 8000);
            }
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
        // Pour Planning, utiliser toute la section
        // Pour Dashboard, utiliser la zone des stats ou toute la section
        let swipeZone = element;
        
        if (section === 'dashboard') {
            // Pour Dashboard, préférer la zone des statistiques
            const statsGrid = element.querySelector('.stats-grid');
            if (statsGrid) {
                swipeZone = statsGrid;
            }
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
                this.handleTouchStart({ touches: [{ clientX: e.clientX, clientY: e.clientY }], target: e.target });
            });
            
            swipeZone.addEventListener('mousemove', (e) => {
                if (isMouseDown) {
                    this.handleTouchMove({ touches: [{ clientX: e.clientX, clientY: e.clientY }], preventDefault: () => {} });
                }
            });
            
            swipeZone.addEventListener('mouseup', (e) => {
                if (isMouseDown) {
                    isMouseDown = false;
                    this.touchEndX = e.clientX;
                    this.touchEndY = e.clientY;
                    this.handleSwipeGesture(section);
                }
            });
            
            swipeZone.addEventListener('mouseleave', () => {
                isMouseDown = false;
                this.isSwiping = false;
            });
        }
    }
    
    /**
     * Gérer le début du touch
     */
    handleTouchStart(e) {
        // Vérifier si on touche un élément vraiment interactif (bouton ou input)
        const target = e.target;
        const isButton = target.tagName === 'BUTTON' || target.closest('button');
        const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
        const isMissionItem = target.closest('.mission-item');
        const isLink = target.tagName === 'A' || target.closest('a');
        
        // Ignorer seulement les vrais éléments interactifs
        if (isButton || isInput || isMissionItem || isLink) {
            this.isSwiping = false;
            return;
        }
        
        // Commencer le tracking du swipe
        this.isSwiping = true;
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.touchEndX = this.touchStartX;
        this.touchEndY = this.touchStartY;
    }
    
    /**
     * Gérer le mouvement du touch
     */
    handleTouchMove(e) {
        if (!this.isSwiping) return;
        
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
        if (!this.isSwiping) return;
        
        // Si touchEndX et touchEndY n'ont pas été mis à jour par touchMove, les récupérer
        if (e.changedTouches && e.changedTouches[0]) {
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
        }
        
        this.handleSwipeGesture(section);
        this.isSwiping = false;
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
                // Feedback haptique sur mobile si disponible
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
            } else {
                // Swipe vers la gauche - mois suivant
                this.navigateToNextMonth(section);
                // Feedback haptique sur mobile si disponible
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
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
                // Marquer que le swipe a été utilisé pour masquer l'indicateur
                this.markSwipeUsed(section);
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
                // Marquer que le swipe a été utilisé pour masquer l'indicateur
                this.markSwipeUsed(section);
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
     * Marquer que le swipe a été utilisé (pour masquer l'indicateur)
     */
    markSwipeUsed(section) {
        if (section === 'planning') {
            const planningSection = document.getElementById('planning');
            if (planningSection) {
                planningSection.classList.add('swipe-used');
                // Enregistrer dans le localStorage pour ne plus afficher l'indicateur
                localStorage.setItem('planning-swipe-tutorial-seen', 'true');
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
            /* Section Planning avec indication de swipe disponible sur toute la page */
            #planning.app-section.active {
                position: relative;
                min-height: 100vh;
            }
            
            /* Indicateur visuel de swipe en bas de l'écran */
            #planning.app-section.active::before {
                content: '← Swipe pour naviguer →';
                position: fixed;
                bottom: 90px; /* Au-dessus du FAB */
                left: 50%;
                transform: translateX(-50%);
                background: rgba(44, 82, 130, 0.9);
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 500;
                pointer-events: none;
                z-index: 30;
                animation: slideUpFade 0.5s ease-out;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                opacity: 0.8;
            }
            
            /* Animation d'entrée */
            @keyframes slideUpFade {
                from { 
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 0.8;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            /* Masquer l'indicateur après le premier swipe */
            #planning.app-section.swipe-used::before {
                display: none;
            }
            
            /* Zone de swipe étendue pour Planning */
            #planning.app-section.active {
                /* Indiquer visuellement que toute la zone est swipable */
                touch-action: pan-y;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialiser le gestionnaire de swipe
window.swipeHandler = new SwipeHandler();