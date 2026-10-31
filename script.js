// ==========================================================================
// Rayhan Zaynuri Portfolio — Interactive Features
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Project Category Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });

    // --- 2. Copy to Clipboard with Toast Notification ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('copyToast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(text) {
        if (!toast) return;
        toastMessage.textContent = text;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }
                showToast(`Copied "${textToCopy}" to clipboard!`);
            } catch (err) {
                console.error('Copy failed:', err);
                showToast('Failed to copy to clipboard');
            }
        });
    });

    // --- 3. Mobile Navigation Drawer Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        if (!mobileMenuBtn || !mobileDrawer) return;
        mobileMenuBtn.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileDrawer.classList.add('active');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        if (mobileDrawerBackdrop) {
            mobileDrawerBackdrop.classList.add('active');
            mobileDrawerBackdrop.setAttribute('aria-hidden', 'false');
        }
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        if (!mobileMenuBtn || !mobileDrawer) return;
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.classList.remove('active');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (mobileDrawerBackdrop) {
            mobileDrawerBackdrop.classList.remove('active');
            mobileDrawerBackdrop.setAttribute('aria-hidden', 'true');
        }
        document.body.classList.remove('menu-open');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenuBtn.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileDrawerBackdrop) {
        mobileDrawerBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close mobile menu when clicking any nav link inside it
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Also close mobile drawer on contact button inside drawer
    const mobileContactBtn = document.querySelector('.mobile-contact-btn');
    if (mobileContactBtn) {
        mobileContactBtn.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // --- 4. Floating Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 5. Scrollspy Navigation Indicator (Desktop & Mobile) ---
    const sections = document.querySelectorAll('section[id]');
    const navPills = document.querySelectorAll('.nav-pill');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Update Desktop pills
                navPills.forEach(pill => {
                    pill.classList.remove('active');
                    if (pill.getAttribute('href') === `#${sectionId}`) {
                        pill.classList.add('active');
                    }
                });

                // Update Mobile drawer links
                mobileNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

    // --- 6. Certificate Preview Modal ---
    const certModal = document.getElementById('certModal');
    const certModalBackdrop = document.getElementById('certModalBackdrop');
    const certModalCloseBtn = document.getElementById('certModalCloseBtn');
    const certModalImage = document.getElementById('certModalImage');
    const certModalTitle = document.getElementById('certModalTitle');
    const certModalOpenNewTab = document.getElementById('certModalOpenNewTab');
    const certModalTriggers = document.querySelectorAll('.cert-modal-trigger');

    function openCertModal(imgSrc, title) {
        if (!certModal || !certModalImage) return;
        certModalImage.src = imgSrc;
        certModalImage.alt = title || 'Certificate';
        if (certModalTitle) certModalTitle.textContent = title || 'Certificate Preview';
        if (certModalOpenNewTab) certModalOpenNewTab.href = imgSrc;

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCertModal() {
        if (!certModal) return;
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    certModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.getAttribute('data-cert-img') || trigger.getAttribute('href');
            const title = trigger.getAttribute('data-cert-title');
            openCertModal(imgSrc, title);
        });
    });

    if (certModalCloseBtn) {
        certModalCloseBtn.addEventListener('click', closeCertModal);
    }
    if (certModalBackdrop) {
        certModalBackdrop.addEventListener('click', closeCertModal);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });
});
