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

  // FAQ Accordion (Fail-safe with inline onclick)
  window.toggleFaq = window.toggleFaq || function(btn) {
    const box = btn.closest('.faq-box, .faq-item');
    if (!box) return false;
    const isActive = box.classList.contains('active');
    document.querySelectorAll('.faq-box, .faq-item').forEach(b => {
      b.classList.remove('active');
      const bBtn = b.querySelector('.faq-btn, .faq-question');
      if (bBtn) bBtn.setAttribute('aria-expanded', 'false');
    });
    if (!isActive) {
      box.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
    }
    return false;
  };

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
