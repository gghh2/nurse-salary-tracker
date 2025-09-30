/**
 * Mobile Sticky Enhancement
 * Améliore l'expérience des éléments sticky sur mobile
 */

(function() {
    'use strict';
    
    // Ne s'exécute que sur mobile
    if (window.innerWidth > 768) return;
    
    /**
     * Gestion du sticky header du Dashboard et Planning
     */
    function initStickyHeaders() {
        // Sélectionner les deux headers (dashboard et planning)
        const stickyHeaders = document.querySelectorAll('#dashboard .section-header, #planning .section-header');
        
        stickyHeaders.forEach(header => {
            if (!header) return;
            
            // Observer pour détecter quand l'élément devient sticky
            const observer = new IntersectionObserver(
                ([entry]) => {
                    // Ajouter/retirer la classe selon l'état sticky
                    header.classList.toggle('is-stuck', entry.intersectionRatio < 1);
                },
                {
                    threshold: [1],
                    rootMargin: '-1px 0px 0px 0px' // Correspond au top: -1px du CSS
                }
            );
            
            observer.observe(header);
        });
    }
    
    /**
     * Amélioration du scroll horizontal pour la table des tarifs
     */
    function initRatesTableScroll() {
        const tableContainer = document.querySelector('.rates-table-container');
        if (!tableContainer) return;
        
        // Indicateur de scroll horizontal
        let isScrolling = false;
        let scrollTimeout;
        
        tableContainer.addEventListener('scroll', function() {
            if (!isScrolling) {
                tableContainer.classList.add('is-scrolling');
                isScrolling = true;
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                tableContainer.classList.remove('is-scrolling');
                isScrolling = false;
            }, 150);
            
            // Ajouter une classe si on peut encore scroller à droite
            const canScrollRight = this.scrollLeft < (this.scrollWidth - this.clientWidth - 5);
            tableContainer.classList.toggle('can-scroll-right', canScrollRight);
        });
        
        // Vérifier initialement s'il y a du contenu à scroller
        const canScrollRight = tableContainer.scrollWidth > tableContainer.clientWidth;
        if (canScrollRight) {
            tableContainer.classList.add('can-scroll-right');
        }
    }
    
    /**
     * Amélioration tactile pour iOS
     */
    function initIOSOptimizations() {
        // Détection iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        if (isIOS) {
            // Améliorer le scroll momentum sur iOS
            const scrollableElements = document.querySelectorAll('.rates-table-container, #dashboard, #planning');
            scrollableElements.forEach(el => {
                el.style.webkitOverflowScrolling = 'touch';
            });
        }
    }
    
    /**
     * Initialisation
     */
    function init() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initStickyHeaders();
                initRatesTableScroll();
                initIOSOptimizations();
            });
        } else {
            initStickyHeaders();
            initRatesTableScroll();
            initIOSOptimizations();
        }
        
        // Réinitialiser si on navigue entre les sections
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn')) {
                setTimeout(() => {
                    initStickyHeaders();
                    initRatesTableScroll();
                }, 100);
            }
        });
    }
    
    // Lancer l'initialisation
    init();
    
    // Réinitialiser si l'orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                init();
            }
        }, 100);
    });
    
    // Debug info
    console.log('Mobile Sticky Enhancements loaded');
    
})();
