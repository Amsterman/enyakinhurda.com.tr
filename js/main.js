// Kadikoy Metals - Mobile Optimized Main JS
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle with outside-click & link-click auto-close
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Menüdeki bir linke tıklandığında menüyü kapat
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.textContent = '☰';
      });
    });

    // Sayfa dışına tıklandığında menüyü kapat
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        toggleBtn.textContent = '☰';
      }
    });

    // ESC tuşuna basıldığında menüyü kapat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navMenu.classList.remove('open');
        toggleBtn.textContent = '☰';
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
