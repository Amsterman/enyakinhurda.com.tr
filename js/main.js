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

document.addEventListener('DOMContentLoaded', async () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', toggleMobileMenu);

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.textContent = '☰';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        if (toggleBtn) {
          toggleBtn.textContent = '☰';
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

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

  // Dynamic Prices Sync from data/prices.json
  const categoryIcons = {
    bakir: '⚡', kablo: '🔌', sari: '🚰', aliminyum: '🪟',
    demir: '🏗️', paslanmaz: '🛡️', cihaz: '🔥', aku: '🔋', diger: '♻️'
  };

  const fmtPrice = (val) => Number(val) % 1 === 0
    ? Number(val).toLocaleString('tr-TR')
    : Number(val).toFixed(2).replace('.', ',');

  try {
    const res = await fetch('data/prices.json?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const metals = (data && Array.isArray(data.metals)) ? data.metals.filter(m => m.active !== false) : [];
    if (!metals.length) return;

    // 1. Ticker Bandı Güncelle
    const ticker = document.querySelector('.ticker-content');
    if (ticker) {
      let html = '<span class="ticker-item">♻️ <strong>GÜNCEL KADIKÖY HURDA ALIM FİYATLARI:</strong></span>';
      metals.forEach(m => {
        const price = m.calc_price || m.max_price || m.min_price;
        const unitText = (m.unit || 'TL/Kg').replace('TL/', '₺/');
        const trendHtml = (m.trend && m.trend !== 'Stabil' && m.trend !== 'Özel Fiyat')
          ? ` <span class="up">${m.trend}</span>`
          : '';
        html += `<span class="ticker-item">${m.name}: <span class="rate">${Number(price).toFixed(2)} ${unitText}</span>${trendHtml}</span>`;
      });
      html += '<span class="ticker-item">📍 <strong>KADIKÖY GENELİNDE HASSAS DİJİTAL TARTIM VE GÜNCEL BORSA FİYATLARI</strong></span>';
      ticker.innerHTML = html;
    }

    // 2. Fiyat Tablosu Güncelle
    const tbody = document.querySelector('#fiyatlar .matrix-table tbody');
    if (tbody) {
      tbody.innerHTML = metals.map(m => {
        const icon = categoryIcons[m.category] || '♻️';
        const suffix = m.unit === 'TL/Adet' ? ' ₺/Adet' : (m.unit === 'TL/Ton' ? ' ₺/Ton' : ' ₺');
        const range = m.min_price === m.max_price
          ? `${fmtPrice(m.max_price)}${suffix}`
          : `${fmtPrice(m.min_price)} - ${fmtPrice(m.max_price)}${suffix}`;
        const pay = m.category === 'demir' ? 'Tonajlı / Kamyon Alım' : (m.category === 'cihaz' ? 'Adresten Söküm' : 'Kapıda Nakit / FAST');
        return `<tr>
          <td class="metal-name">${icon} ${m.name}</td>
          <td>${m.spec || 'Standart geri dönüşüm kalitesi'}</td>
          <td><span class="price-val">${range}</span></td>
          <td><span class="pill-status">${m.trend || 'Stabil'}</span></td>
          <td>${pay}</td>
        </tr>`;
      }).join('');
    }

    // 3. Hesaplayıcı Seçeneklerini Güncelle
    if (calcScrapType) {
      const kgMetals = metals.filter(m => m.unit !== 'TL/Adet');
      if (kgMetals.length) {
        calcScrapType.innerHTML = kgMetals.map(m => {
          const rate = m.calc_price || m.max_price || m.min_price;
          return `<option value="${m.id}" data-price="${rate}">${m.name} - ${fmtPrice(rate)} ₺/kg</option>`;
        }).join('');
        calculate();
      }
    }
  } catch (err) {
    console.error('Fiyat listesi yüklenemedi:', err);
  }
});
