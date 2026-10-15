// Kadikoy Metals - Mobile Optimized Main JS

// Global fail-safe mobile menu toggle (works with inline onclick and event listeners)
function toggleMobileMenu(e) {
  if (e) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  const nav = document.querySelector('.nav-menu');
  const btn = document.querySelector('.menu-toggle');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  if (btn) {
    btn.textContent = isOpen ? '✕' : '☰';
    btn.setAttribute('aria-expanded', isOpen);
  }
}
window.toggleMobileMenu = toggleMobileMenu;

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (toggleBtn && navMenu) {
    // Add event listeners as backup to inline onclick
    toggleBtn.addEventListener('click', toggleMobileMenu);

    // Menüdeki bir linke tıklandığında menüyü kapat
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.textContent = '☰';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Menü dışına tıklandığında kapat
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.textContent = '☰';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // ESC tuşuna basıldığında kapat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.textContent = '☰';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-box, .faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn, .faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Scrap Calculator
  const calcScrapType = document.getElementById('calc-scrap-type');
  const calcWeight = document.getElementById('calc-weight');
  const calcTotal = document.getElementById('calc-total');

  function calculate() {
    if (!calcScrapType || !calcWeight || !calcTotal) return;
    const selectedOption = calcScrapType.options[calcScrapType.selectedIndex];
    if (!selectedOption) return;
    
    const rate = parseFloat(selectedOption.getAttribute('data-price')) || 380;
    const weight = parseFloat(calcWeight.value) || 0;
    const total = Math.round(weight * rate);
    calcTotal.textContent = total.toLocaleString('tr-TR') + ' ₺';
  }

  window.updateCalcGlobal = calculate;

  if (calcScrapType && calcWeight) {
    calcScrapType.addEventListener('change', calculate);
    calcWeight.addEventListener('input', calculate);
    calculate();
  }
});
