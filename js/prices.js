/**
 * Kadıköy Metals - Dinamik Hurda Fiyatları İstemcisi
 * data/prices.json ve localStorage entegrasyonu
 */

const MetalPriceService = {
  STORAGE_KEY: 'kadikoy_scrap_prices',

  async init() {
    let data = this.getLocalPrices();
    
    // Eğer localStorage boşsa data/prices.json dosyasından çek
    if (!data) {
      try {
        const isBlog = window.location.pathname.includes('/blog/');
        const jsonPath = isBlog ? '../data/prices.json' : 'data/prices.json';
        const res = await fetch(jsonPath);
        if (res.ok) {
          data = await res.json();
          this.setLocalPrices(data);
        }
      } catch (err) {
        console.log('prices.json statik modda okunuyor.');
      }
    }

    if (data) {
      this.applyPrices(data);
    }

    // Başka sekmede admin panelinden güncellenirse canlı yakala
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY) {
        const updated = this.getLocalPrices();
        if (updated) this.applyPrices(updated);
      }
    });
  },

  getLocalPrices() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  setLocalPrices(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  },

  applyPrices(data) {
    if (!data || !data.metals) return;
    this.updateTicker(data);
    this.updateTable(data);
    this.updateCalculator(data);
  },

    updateTicker(data) {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent || !data.metals) return;

    let itemsHtml = `<span class="ticker-item">⚡ <strong>LME & SERBEST PİYASA KADIKÖY KURLARI (${data.last_updated || 'CANLI'}):</strong></span>`;
    data.metals.filter(m => m.active).slice(0, 10).forEach(m => {
      const isUp = m.trend && m.trend.includes('▲');
      const isCopper = m.category === 'bakir' || m.category === 'sari';
      const val = m.max_price % 1 === 0 ? m.max_price : m.max_price.toFixed(2);
      itemsHtml += `
        <span class="ticker-item">
          ${m.name}: <span class="rate ${isCopper ? 'copper' : ''}">${val} ${m.unit}</span>
          ${m.trend ? `<span class="up" style="color:${isUp ? '#34d399' : '#94a3b8'}">${m.trend}</span>` : ''}
        </span>
      `;
    });
    itemsHtml += `<span class="ticker-item">📍 <strong>KADIKÖY GENELİNDE HASSAS DİJİTAL TARTIM VE ANINDA NAKİT / FAST</strong></span>`;

    // Kesintisiz % -50 transform döngüsü için listeyi çiftle
    tickerContent.innerHTML = itemsHtml + itemsHtml;
  },

  updateTable(data) {
    const tableBody = document.querySelector('.matrix-table tbody');
    if (!tableBody) return;

    let rows = '';
    data.metals.filter(m => m.active).forEach(m => {
      const minStr = m.min_price % 1 === 0 ? m.min_price : m.min_price.toFixed(2);
      const maxStr = m.max_price % 1 === 0 ? m.max_price : m.max_price.toFixed(2);
      const display = m.unit === 'TL/Adet' ? `${minStr} - ${maxStr} ₺/Adet` : `${minStr} - ${maxStr} ₺`;
      rows += `
        <tr>
          <td class="metal-name">⚡ ${m.name}</td>
          <td>${m.spec || '-'}</td>
          <td><span class="price-val">${display}</span></td>
          <td><span class="pill-status">${m.trend || 'Stabil'}</span></td>
          <td>${m.unit === 'TL/Adet' ? 'Adresten Söküm' : 'Kapıda Nakit / FAST'}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = rows;
  },

  updateCalculator(data) {
    const select = document.getElementById('calc-scrap-type');
    if (!select) return;

    const cur = select.value;
    let opts = '';
    data.metals.filter(m => m.active && m.unit === 'TL/Kg').forEach(m => {
      const p = m.calc_price % 1 === 0 ? m.calc_price : m.calc_price.toFixed(2);
      opts += `<option value="${m.id}" data-price="${m.calc_price}">${m.name} - ${p} ₺/kg</option>`;
    });

    select.innerHTML = opts;
    if (cur && select.querySelector(`option[value="${cur}"]`)) {
      select.value = cur;
    }

    if (window.updateCalcGlobal) window.updateCalcGlobal();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MetalPriceService.init();
});
