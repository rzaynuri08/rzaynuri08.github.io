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

    // --- 3. Scrollspy Navigation Indicator ---
    const sections = document.querySelectorAll('section[id]');
    const navPills = document.querySelectorAll('.nav-pill');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navPills.forEach(pill => {
                    pill.classList.remove('active');
                    if (pill.getAttribute('href') === `#${sectionId}`) {
                        pill.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
});
