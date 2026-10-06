/**
 * KonserKita - Logika Aplikasi Web Tiket Konser
 * Sederhana, Intuitif, Ramah Pengguna & Lengkap
 */

// State Aplikasi
const AppState = {
  activeGenre: 'all',
  activeCity: 'all',
  searchQuery: '',
  sortBy: 'recommended',
  currentConcert: null,
  order: {
    concertId: null,
    tierId: null,
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNik: '',
    attendees: [],
    promoCode: '',
    discount: 0,
    paymentMethod: 'qris',
    bookingId: '',
    bookingDate: ''
  },
  currentStep: 1,
  myTickets: []
};

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTickets();
  renderConcerts();
  setupEventListeners();
  updateMyTicketsBadge();
});

// Load tiket tersimpan dari localStorage
function loadSavedTickets() {
  try {
    const saved = localStorage.getItem('konserkita_tickets');
    if (saved) {
      AppState.myTickets = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading tickets from localStorage', e);
  }
}

// Simpan tiket baru ke localStorage
function saveTicketToStorage(ticket) {
  AppState.myTickets.unshift(ticket);
  try {
    localStorage.setItem('konserkita_tickets', JSON.stringify(AppState.myTickets));
  } catch (e) {
    console.error('Error saving ticket to storage', e);
  }
  updateMyTicketsBadge();
}

function updateMyTicketsBadge() {
  const badge = document.getElementById('myTicketsCountBadge');
  if (badge) {
    badge.textContent = AppState.myTickets.length;
    badge.style.display = AppState.myTickets.length > 0 ? 'inline-block' : 'none';
  }
}

// Format Rupiah
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value.toLowerCase().trim();
      renderConcerts();
    });
  }

  // Genre chips
  const genreChips = document.querySelectorAll('.filter-chip');
  genreChips.forEach(chip => {
    chip.addEventListener('click', () => {
      genreChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.activeGenre = chip.getAttribute('data-genre');
      renderConcerts();
    });
  });

  // City dropdown
  const citySelect = document.getElementById('cityFilter');
  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      AppState.activeCity = e.target.value;
      renderConcerts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sortFilter');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderConcerts();
    });
  }

  // Top Bar Ad Close
  const closeAdBtn = document.getElementById('closeAdTopBar');
  if (closeAdBtn) {
    closeAdBtn.addEventListener('click', () => {
      const topBar = document.getElementById('adTopBar');
      if (topBar) topBar.style.display = 'none';
    });
  }

  // Copy Promo Code from Ad
  const copyPromoBtns = document.querySelectorAll('.btn-copy-promo');
  copyPromoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const code = e.currentTarget.getAttribute('data-code') || 'HARMONI10';
      copyText(code, `Kode promo "${code}" berhasil disalin! Silakan pakai saat checkout.`);
    });
  });

  // Modal Close buttons
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  const modalBackdrop = document.getElementById('orderModal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // My Tickets Modal
  const myTicketsBtn = document.getElementById('btnMyTickets');
  if (myTicketsBtn) {
    myTicketsBtn.addEventListener('click', openMyTicketsModal);
  }

  const closeMyTicketsBtn = document.getElementById('closeMyTicketsModal');
  if (closeMyTicketsBtn) {
    closeMyTicketsBtn.addEventListener('click', closeMyTicketsModal);
  }

  const myTicketsBackdrop = document.getElementById('myTicketsModal');
  if (myTicketsBackdrop) {
    myTicketsBackdrop.addEventListener('click', (e) => {
      if (e.target === myTicketsBackdrop) closeMyTicketsModal();
    });
  }
}

// Render Poster Konser (Menggunakan file gambar atau visual SVG estetik yang teduh)
function getConcertPosterHtml(concert) {
  if (concert.image) {
    return `<img src="${concert.image}" alt="${concert.title}" class="card-poster-img" loading="lazy">`;
  }
  
  // Custom SVG themed poster - Sederhana, artistik, warna teduh & elegan
  const palettes = {
    'svg-rock': { bg: '#1e293b', accent: '#3b82f6', text: '#93c5fd', title: 'INDIE ROCK TOUR' },
    'svg-folk': { bg: '#292524', accent: '#d97706', text: '#fde68a', title: 'SENJA ACOUSTIC' },
    'svg-metal': { bg: '#18181b', accent: '#ef4444', text: '#fca5a5', title: 'LEGENDA INDONESIA' },
    'svg-jazz': { bg: '#172554', accent: '#60a5fa', text: '#bfdbfe', title: 'JAZZ & SOUL NIGHT' },
    'svg-dance': { bg: '#042f2e', accent: '#14b8a6', text: '#99f6e4', title: 'SUNSET BEATS BALI' }
  };

  const p = palettes[concert.imageSvg] || { bg: '#1e293b', accent: '#3b82f6', text: '#cbd5e1', title: 'LIVE CONCERT' };

  return `
    <svg class="card-poster-img" viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad-${concert.id}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="${p.bg}" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="${p.bg}"/>
      <rect width="400" height="240" fill="url(#grad-${concert.id})"/>
      <!-- Soft Stage Lighting Rays -->
      <path d="M120 0 L160 240 L190 240 L130 0 Z" fill="white" opacity="0.04"/>
      <path d="M280 0 L240 240 L210 240 L270 0 Z" fill="white" opacity="0.04"/>
      <!-- Musical Waves -->
      <path d="M20 180 Q100 150 200 170 T380 160" fill="none" stroke="${p.text}" stroke-width="2" opacity="0.3"/>
      <path d="M20 195 Q120 175 220 185 T380 180" fill="none" stroke="${p.text}" stroke-width="1.5" opacity="0.2"/>
      <circle cx="200" cy="95" r="38" fill="none" stroke="${p.accent}" stroke-width="2" opacity="0.4"/>
      <text x="200" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="${p.text}" text-anchor="middle" letter-spacing="2">${p.title}</text>
      <text x="200" y="112" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle">${concert.title.substring(0, 24)}</text>
      <text x="200" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">${concert.city} • ${concert.date.split(' ')[0]} ${concert.date.split(' ')[1]}</text>
    </svg>
  `;
}

// Render Katalog Konser
function renderConcerts() {
  const grid = document.getElementById('concertGrid');
  if (!grid) return;

  // Filter logika
  let filtered = CONCERTS_DATA.filter(c => {
    // Filter Genre
    const matchGenre = AppState.activeGenre === 'all' || c.genreKey === AppState.activeGenre;
    
    // Filter Kota
    const matchCity = AppState.activeCity === 'all' || c.city === AppState.activeCity;
    
    // Search query
    const matchSearch = AppState.searchQuery === '' || 
      c.title.toLowerCase().includes(AppState.searchQuery) ||
      c.lineup.toLowerCase().includes(AppState.searchQuery) ||
      c.venue.toLowerCase().includes(AppState.searchQuery) ||
      c.city.toLowerCase().includes(AppState.searchQuery);

    return matchGenre && matchCity && matchSearch;
  });

  // Sort logika
  if (AppState.sortBy === 'price-asc') {
    filtered.sort((a, b) => a.startingPrice - b.startingPrice);
  } else if (AppState.sortBy === 'price-desc') {
    filtered.sort((a, b) => b.startingPrice - a.startingPrice);
  }

  // Jika tidak ada hasil
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3 class="empty-title">Konser Tidak Ditemukan</h3>
        <p class="empty-desc">Tidak ada konser yang cocok dengan kata kunci atau filter yang Anda pilih. Silakan reset filter untuk melihat semua konser.</p>
        <button class="btn-reset-filter" onclick="resetFilters()">Reset Filter & Pencarian</button>
      </div>
    `;
    return;
  }

  // Render cards
  grid.innerHTML = filtered.map(concert => {
    const isLimited = concert.statusType === 'limited';
    return `
      <article class="concert-card" data-id="${concert.id}">
        <div class="card-poster-wrapper">
          ${getConcertPosterHtml(concert)}
          <span class="card-status-badge ${isLimited ? 'limited' : 'available'}">
            ${isLimited ? '⚠️ ' + concert.status : '✓ ' + concert.status}
          </span>
          <span class="card-genre-badge">${concert.genre}</span>
        </div>
        <div class="card-body">
          <div class="card-date-row">
            <span>📅 ${concert.date}</span>
            <span>•</span>
            <span>⏰ ${concert.time.split(' ')[0]} WIB</span>
          </div>
          <h3 class="card-title">${concert.title}</h3>
          <p class="card-artists"><strong>Lineup:</strong> ${concert.lineup}</p>
          <div class="card-location">
            <span>📍</span>
            <span>${concert.venue}</span>
          </div>
          <div class="card-footer">
            <div>
              <div class="card-price-label">Mulai Dari</div>
              <div class="card-price-val">${formatRupiah(concert.startingPrice)}</div>
            </div>
            <button class="btn-select-concert" onclick="openOrderModal('${concert.id}')">
              Pilih & Beli Tiket
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Reset Filter
function resetFilters() {
  AppState.activeGenre = 'all';
  AppState.activeCity = 'all';
  AppState.searchQuery = '';
  AppState.sortBy = 'recommended';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  const cityFilter = document.getElementById('cityFilter');
  if (cityFilter) cityFilter.value = 'all';

  const sortFilter = document.getElementById('sortFilter');
  if (sortFilter) sortFilter.value = 'recommended';

  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-genre') === 'all');
  });

  renderConcerts();
}

// ==========================================================================
// Modal Pemesanan & Alur Checkout
// ==========================================================================

function openOrderModal(concertId) {
  const concert = CONCERTS_DATA.find(c => c.id === concertId);
  if (!concert) return;

  AppState.currentConcert = concert;
  AppState.order.concertId = concert.id;
  AppState.order.tierId = concert.tiers[0].id; // Default tier pertama
  AppState.order.quantity = 1;
  AppState.order.discount = 0;
  AppState.order.promoCode = '';
  AppState.currentStep = 1;

  updateModalView();

  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function setStep(step) {
  if (step === 2) {
    // Validasi pemilihan tiket
    if (!AppState.order.tierId || AppState.order.quantity < 1) {
      showToast('Silakan pilih minimal 1 tiket untuk melanjutkan.', 'warning');
      return;
    }
  }

  if (step === 3) {
    // Validasi data pemesan
    const nameInput = document.getElementById('inputCustomerName');
    const emailInput = document.getElementById('inputCustomerEmail');
    const phoneInput = document.getElementById('inputCustomerPhone');
    const nikInput = document.getElementById('inputCustomerNik');

    if (!nameInput || !nameInput.value.trim()) {
      showToast('Mohon masukkan Nama Lengkap pemesan sesuai KTP.', 'warning');
      if (nameInput) nameInput.focus();
      return;
    }
    if (!emailInput || !emailInput.value.trim() || !emailInput.value.includes('@')) {
      showToast('Mohon masukkan alamat Email aktif untuk pengiriman e-tiket.', 'warning');
      if (emailInput) emailInput.focus();
      return;
    }
    if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.length < 9) {
      showToast('Mohon masukkan No. WhatsApp / HP yang valid.', 'warning');
      if (phoneInput) phoneInput.focus();
      return;
    }
    if (!nikInput || !nikInput.value.trim() || nikInput.value.length < 16) {
      showToast('Mohon masukkan 16 Digit NIK / KTP untuk validasi gate masuk.', 'warning');
      if (nikInput) nikInput.focus();
      return;
    }

    AppState.order.customerName = nameInput.value.trim();
    AppState.order.customerEmail = emailInput.value.trim();
    AppState.order.customerPhone = phoneInput.value.trim();
    AppState.order.customerNik = nikInput.value.trim();

    // Rekap pengunjung tambahan jika tiket > 1
    AppState.order.attendees = [];
    if (AppState.order.quantity > 1) {
      for (let i = 2; i <= AppState.order.quantity; i++) {
        const attName = document.getElementById(`attendee_name_${i}`);
        const attNik = document.getElementById(`attendee_nik_${i}`);
        AppState.order.attendees.push({
          num: i,
          name: attName && attName.value.trim() ? attName.value.trim() : `${AppState.order.customerName} (Tamu ${i})`,
          nik: attNik && attNik.value.trim() ? attNik.value.trim() : AppState.order.customerNik
        });
      }
    }
  }

  AppState.currentStep = step;
  updateModalView();
}

function updateModalView() {
  const concert = AppState.currentConcert;
  if (!concert) return;

  // Update step indicators
  const stepItems = document.querySelectorAll('.step-item');
  stepItems.forEach((item, idx) => {
    const stepNum = idx + 1;
    item.classList.remove('active', 'completed');
    if (stepNum === AppState.currentStep) {
      item.classList.add('active');
    } else if (stepNum < AppState.currentStep) {
      item.classList.add('completed');
    }
  });

  const stepBadge = document.getElementById('modalStepBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalDynamicContent');
  const modalFooter = document.getElementById('modalFooter');

  if (AppState.currentStep === 1) {
    if (stepBadge) stepBadge.textContent = 'Langkah 1 dari 3';
    if (modalTitle) modalTitle.textContent = 'Pilih Kategori & Jumlah Tiket';
    renderStep1(modalBody, modalFooter);
  } else if (AppState.currentStep === 2) {
    if (stepBadge) stepBadge.textContent = 'Langkah 2 dari 3';
    if (modalTitle) modalTitle.textContent = 'Isi Data Diri Pemesan';
    renderStep2(modalBody, modalFooter);
  } else if (AppState.currentStep === 3) {
    if (stepBadge) stepBadge.textContent = 'Langkah 3 dari 3';
    if (modalTitle) modalTitle.textContent = 'Konfirmasi & Pembayaran';
    renderStep3(modalBody, modalFooter);
  } else if (AppState.currentStep === 4) {
    if (stepBadge) stepBadge.textContent = 'E-Tiket Resmi Berhasil Diterbitkan';
    if (modalTitle) modalTitle.textContent = 'E-Tiket Konser Anda';
    renderStep4(modalBody, modalFooter);
  }
}

// ==========================================================================
// LANGKAH 1: Pemilihan Kategori & Jumlah Tiket
// ==========================================================================
function renderStep1(body, footer) {
  const concert = AppState.currentConcert;
  const selectedTier = concert.tiers.find(t => t.id === AppState.order.tierId) || concert.tiers[0];
  const ticketSubtotal = selectedTier.price * AppState.order.quantity;
  const tax = Math.round(ticketSubtotal * 0.1); // Pajak Hiburan 10%
  const adminFee = 5000; // Biaya Layanan
  const grandTotal = ticketSubtotal + tax + adminFee;

  body.innerHTML = `
    <!-- Ringkasan Konser -->
    <div class="modal-concert-summary">
      <div style="font-size: 2rem;">🎟️</div>
      <div class="summary-info">
        <h4 class="summary-name">${concert.title}</h4>
        <div class="summary-meta">
          <span>📅 ${concert.date}</span>
          <span>📍 ${concert.venue}</span>
        </div>
      </div>
    </div>

    <!-- Denah Panggung Visual (Stage Layout) -->
    <div class="stage-layout-section">
      <div class="stage-header">
        <div class="stage-title">🗺️ Denah Tata Letak Panggung (Stage Map)</div>
        <span style="font-size: 0.78rem; color: var(--text-muted);">Pilih kategori tempat duduk di bawah</span>
      </div>
      <svg class="stage-map-svg" viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg">
        <!-- Stage Box -->
        <rect x="180" y="6" width="240" height="28" rx="6" fill="#1e293b"/>
        <text x="300" y="24" fill="#ffffff" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">PANGGUNG UTAMA (MAIN STAGE)</text>
        
        <!-- VIP Area -->
        <rect x="150" y="40" width="300" height="26" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="300" y="57" fill="#92400e" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" text-anchor="middle">AREA VIP SEATED (FRONT)</text>
        
        <!-- CAT 1 Festival -->
        <rect x="110" y="70" width="380" height="26" rx="4" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
        <text x="300" y="87" fill="#3730a3" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" text-anchor="middle">CAT 1 - FESTIVAL STANDING AREA</text>
        
        <!-- CAT 2 & CAT 3 Tribune -->
        <rect x="50" y="100" width="500" height="24" rx="4" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
        <text x="300" y="116" fill="#475569" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" text-anchor="middle">CAT 2 & CAT 3 - TRIBUNE SEATING</text>
      </svg>
    </div>

    <!-- Pilihan Kategori Tiket -->
    <div>
      <div style="font-size: 0.95rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main);">
        Pilih Kategori Tiket:
      </div>
      <div class="ticket-tiers-list">
        ${concert.tiers.map(tier => {
          const isSelected = tier.id === AppState.order.tierId;
          return `
            <div class="ticket-tier-card ${isSelected ? 'selected' : ''}" onclick="selectTier('${tier.id}')" style="cursor: pointer;">
              <div class="tier-info">
                <div class="tier-title-row">
                  <span class="tier-name">${tier.name}</span>
                  <span class="tier-badge ${tier.badgeType}">${tier.badge}</span>
                </div>
                <div class="tier-desc">${tier.desc}</div>
                <div class="tier-perks">
                  ${tier.perks.map(p => `<span class="tier-perk-item">✓ ${p}</span>`).join('')}
                </div>
              </div>
              <div class="tier-price-row">
                <div class="tier-price">${formatRupiah(tier.price)}</div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">per tiket</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Pemilihan Jumlah Tiket & Rincian Harga -->
    <div style="display: flex; flex-direction: column; gap: 12px; background: white; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">Jumlah Beli Tiket:</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Maksimal 4 tiket per akun/pemesanan</div>
        </div>
        <div class="quantity-control">
          <button class="qty-btn" onclick="changeQuantity(-1)" ${AppState.order.quantity <= 1 ? 'disabled' : ''}>-</button>
          <span class="qty-display">${AppState.order.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(1)" ${AppState.order.quantity >= 4 ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>

    <!-- Ringkasan Kalkulasi Biaya -->
    <div class="price-calculation-box">
      <div class="calc-row">
        <span>Harga Tiket (${AppState.order.quantity}x ${selectedTier.name})</span>
        <span>${formatRupiah(ticketSubtotal)}</span>
      </div>
      <div class="calc-row">
        <span>Pajak Hiburan Daerah (10%)</span>
        <span>${formatRupiah(tax)}</span>
      </div>
      <div class="calc-row">
        <span>Biaya Layanan & Penerbitan E-Tiket</span>
        <span>${formatRupiah(adminFee)}</span>
      </div>
      <div class="calc-row total-row">
        <span>Total Biaya Tiket</span>
        <span class="total-highlight">${formatRupiah(grandTotal)}</span>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-back-step" onclick="closeModal()">Batal</button>
    <button class="btn-next-step" onclick="setStep(2)">
      Lanjut Isi Data Diri ➔
    </button>
  `;
}

function selectTier(tierId) {
  AppState.order.tierId = tierId;
  updateModalView();
}

function changeQuantity(delta) {
  const newQty = AppState.order.quantity + delta;
  if (newQty >= 1 && newQty <= 4) {
    AppState.order.quantity = newQty;
    updateModalView();
  }
}

// ==========================================================================
// LANGKAH 2: Form Data Diri Pemesan & Kode Promo
// ==========================================================================
function renderStep2(body, footer) {
  const concert = AppState.currentConcert;
  const selectedTier = concert.tiers.find(t => t.id === AppState.order.tierId);
  const ticketSubtotal = selectedTier.price * AppState.order.quantity;
  const tax = Math.round(ticketSubtotal * 0.1);
  const adminFee = 5000;
  const discount = AppState.order.discount || 0;
  const finalTotal = Math.max(0, ticketSubtotal + tax + adminFee - discount);

  let attendeesInputs = '';
  if (AppState.order.quantity > 1) {
    let attendeesList = '';
    for (let i = 2; i <= AppState.order.quantity; i++) {
      const existing = AppState.order.attendees[i - 2] || {};
      attendeesList += `
        <div class="attendee-box">
          <div class="form-group">
            <label class="form-label">Nama Pengunjung #${i}</label>
            <input type="text" class="form-input" id="attendee_name_${i}" placeholder="Nama sesuai KTP" value="${existing.name || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">NIK / KTP Pengunjung #${i}</label>
            <input type="text" class="form-input" id="attendee_nik_${i}" placeholder="16 Digit NIK" maxlength="16" value="${existing.nik || ''}">
          </div>
        </div>
      `;
    }

    attendeesInputs = `
      <div class="attendees-container">
        <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main);">
          👥 Data Pengunjung Tambahan (${AppState.order.quantity - 1} Tiket Lainnya):
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">
          Nama pengunjung akan dicetak pada masing-masing lembar tiket untuk kemudahan verifikasi gate masuk.
        </div>
        ${attendeesList}
      </div>
    `;
  }

  body.innerHTML = `
    <!-- Ringkasan Pemesanan Singkat -->
    <div style="background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: 700; font-size: 0.95rem;">${concert.title}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">${AppState.order.quantity}x Tiket • ${selectedTier.name}</div>
      </div>
      <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">${formatRupiah(finalTotal)}</div>
    </div>

    <!-- Form Data Pemesan Utama -->
    <div class="checkout-form-grid">
      <div class="form-group full-width">
        <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">
          Data Diri Pemesan Utama (Sesuai KTP)
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          Pastikan data benar karena e-tiket akan diterbitkan atas nama ini.
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="inputCustomerName">Nama Lengkap <span class="required">*</span></label>
        <input type="text" class="form-input" id="inputCustomerName" placeholder="Contoh: Muhammad Budi Santoso" value="${AppState.order.customerName}">
        <span class="form-helper">Wajib sesuai identitas KTP / SIM / Paspor</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="inputCustomerEmail">Email Aktif <span class="required">*</span></label>
        <input type="email" class="form-input" id="inputCustomerEmail" placeholder="nama@email.com" value="${AppState.order.customerEmail}">
        <span class="form-helper">File E-Tiket PDF dikirim ke email ini</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="inputCustomerPhone">No. WhatsApp / HP <span class="required">*</span></label>
        <input type="tel" class="form-input" id="inputCustomerPhone" placeholder="081234567890" value="${AppState.order.customerPhone}">
        <span class="form-helper">Untuk info rundown & barcode cadangan via WA</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="inputCustomerNik">Nomor NIK / KTP <span class="required">*</span></label>
        <input type="text" class="form-input" id="inputCustomerNik" placeholder="16 digit angka NIK" maxlength="16" value="${AppState.order.customerNik}">
        <span class="form-helper">Wajib untuk pemeriksaan di pintu masuk</span>
      </div>

      ${attendeesInputs}

      <!-- Voucher Promo Code Box -->
      <div class="promo-box">
        <input type="text" class="promo-input" id="inputPromoCode" placeholder="Punya kode promo? (Cth: HARMONI10)" value="${AppState.order.promoCode}">
        <button class="btn-apply-promo" onclick="applyPromoCode()">Pakai Kupon</button>
      </div>
      ${discount > 0 ? `
        <div style="grid-column: 1 / -1; background-color: var(--success-light); border: 1px solid var(--success-border); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--success); font-weight: 600;">
          ✓ Berhasil hemat ${formatRupiah(discount)} dengan kode "${AppState.order.promoCode}"!
        </div>
      ` : ''}
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-back-step" onclick="setStep(1)">‹ Kembali</button>
    <button class="btn-next-step" onclick="setStep(3)">
      Lanjut ke Pembayaran ➔
    </button>
  `;
}

// Terapkan Kode Promo
function applyPromoCode() {
  const codeInput = document.getElementById('inputPromoCode');
  if (!codeInput) return;

  const code = codeInput.value.trim().toUpperCase();
  if (!code) {
    showToast('Masukkan kode promo terlebih dahulu.', 'warning');
    return;
  }

  const promo = VOUCHER_CODES[code];
  if (!promo) {
    showToast(`Kode "${code}" tidak ditemukan atau sudah kedaluwarsa.`, 'warning');
    return;
  }

  const concert = AppState.currentConcert;
  const tier = concert.tiers.find(t => t.id === AppState.order.tierId);
  const subtotal = tier.price * AppState.order.quantity;

  if (promo.minPurchase && subtotal < promo.minPurchase) {
    showToast(`Minimal transaksi untuk kupon ini adalah ${formatRupiah(promo.minPurchase)}.`, 'warning');
    return;
  }

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = Math.round((subtotal * promo.value) / 100);
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else {
    discount = promo.value;
  }

  AppState.order.promoCode = code;
  AppState.order.discount = discount;
  showToast(`Kupon diterapkan! Hemat ${formatRupiah(discount)}.`, 'success');
  updateModalView();
}

// ==========================================================================
// LANGKAH 3: Pilihan Pembayaran & Simulasi
// ==========================================================================
function renderStep3(body, footer) {
  const concert = AppState.currentConcert;
  const selectedTier = concert.tiers.find(t => t.id === AppState.order.tierId);
  const ticketSubtotal = selectedTier.price * AppState.order.quantity;
  const tax = Math.round(ticketSubtotal * 0.1);
  const adminFee = 5000;
  const discount = AppState.order.discount || 0;
  const finalTotal = Math.max(0, ticketSubtotal + tax + adminFee - discount);

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === AppState.order.paymentMethod) || PAYMENT_METHODS[0];

  // Visual Instruksi Cara Bayar
  let paymentInstructionHtml = '';
  if (selectedMethod.id === 'qris') {
    paymentInstructionHtml = `
      <div class="payment-instruction-box">
        <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">Scan QRIS untuk Menyelesaikan Pembayaran</div>
        <div class="qris-container">
          <canvas id="qrisCanvas" class="qris-canvas"></canvas>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">NMID: ID1020394857291 • KonserKita Official</div>
        </div>
        <div class="payment-timer">
          <span>⏱️ Selesaikan dalam: <strong>14:59 menit</strong></span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px;">
          Buka aplikasi BCA Mobile, GoPay, OVO, Dana, ShopeePay, atau Livin' by Mandiri Anda, lalu scan QR di atas.
        </p>
      </div>
    `;
  } else if (selectedMethod.id.includes('va')) {
    const vaNumber = '88019' + Math.floor(100000000 + Math.random() * 900000000);
    paymentInstructionHtml = `
      <div class="payment-instruction-box">
        <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">Nomor ${selectedMethod.name}</div>
        <div class="va-number-box">
          <span class="va-code">${vaNumber}</span>
          <button class="btn-copy-va" onclick="copyText('${vaNumber}', 'Nomor VA berhasil disalin!')">Salin</button>
        </div>
        <div class="payment-timer">
          <span>⏱️ Batas transfer: <strong>1 Jam</strong></span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 480px;">
          Transfer tepat sesuai nominal: <strong>${formatRupiah(finalTotal)}</strong>. Verifikasi berjalan otomatis dalam hitungan detik.
        </p>
      </div>
    `;
  } else {
    paymentInstructionHtml = `
      <div class="payment-instruction-box">
        <div style="font-size: 2rem;">💳</div>
        <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${selectedMethod.name}</div>
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 440px;">
          Setelah Anda mengklik tombol "Bayar Sekarang", sistem akan memproses transaksi secara aman dan langsung menerbitkan E-Tiket Anda.
        </p>
      </div>
    `;
  }

  body.innerHTML = `
    <!-- Rincian Pesanan Singkat -->
    <div style="background-color: var(--bg-subtle); border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-weight: 700; font-size: 1rem;">${concert.title}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">${AppState.order.quantity}x ${selectedTier.name} • Pemesan: ${AppState.order.customerName}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Total Tagihan</div>
        <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary);">${formatRupiah(finalTotal)}</div>
      </div>
    </div>

    <!-- Pilih Metode Pembayaran -->
    <div>
      <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">
        Pilih Metode Pembayaran:
      </div>
      <div class="payment-methods-grid">
        ${PAYMENT_METHODS.map(m => {
          const isSelected = m.id === AppState.order.paymentMethod;
          return `
            <div class="payment-method-card ${isSelected ? 'selected' : ''}" onclick="selectPaymentMethod('${m.id}')">
              <span class="payment-method-icon">${m.icon}</span>
              <div>
                <div class="payment-method-name">${m.name}</div>
                <div class="payment-method-sub">${m.desc}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    ${paymentInstructionHtml}
  `;

  // Draw QRIS canvas jika QRIS aktif
  if (selectedMethod.id === 'qris') {
    setTimeout(drawMockQris, 50);
  }

  footer.innerHTML = `
    <button class="btn-back-step" onclick="setStep(2)">‹ Kembali</button>
    <button class="btn-next-step" id="btnPayNow" onclick="processPayment()">
      ✓ Bayar Sekarang (${formatRupiah(finalTotal)})
    </button>
  `;
}

function selectPaymentMethod(methodId) {
  AppState.order.paymentMethod = methodId;
  updateModalView();
}

// Simulasi Gambar QRIS pada Canvas
function drawMockQris() {
  const canvas = document.getElementById('qrisCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 180;
  canvas.height = 180;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 180, 180);

  // Simple QR Pattern Simulation
  ctx.fillStyle = '#0f172a';
  
  // Position Detection Patterns (Corners)
  function drawFinderPattern(x, y) {
    ctx.fillRect(x, y, 42, 42);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 6, y + 6, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 12, y + 12, 18, 18);
  }

  drawFinderPattern(10, 10);
  drawFinderPattern(128, 10);
  drawFinderPattern(10, 128);

  // Random QR noise grid
  const seed = 42;
  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 20; c++) {
      if ((r < 7 && c < 7) || (r < 7 && c > 12) || (r > 12 && c < 7)) continue;
      if ((r * 13 + c * 7 + seed) % 3 === 0) {
        ctx.fillRect(10 + c * 8, 10 + r * 8, 7, 7);
      }
    }
  }

  // QRIS Center Badge
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(72, 72, 36, 36);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(74, 74, 32, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('QRIS', 90, 90);
}

// Simulasi Proses Pembayaran
function processPayment() {
  const btn = document.getElementById('btnPayNow');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block; animation:spin 1s infinite linear;">⏳</span> Memverifikasi Pembayaran...`;
  }

  // Simulasi 1.2 detik
  setTimeout(() => {
    // Generate Booking ID unik
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const bookingId = `KST-2026-${randomHex}`;
    const now = new Date();
    const dateFormatted = `${now.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'][now.getMonth()]} ${now.getFullYear()} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    AppState.order.bookingId = bookingId;
    AppState.order.bookingDate = dateFormatted;

    const concert = AppState.currentConcert;
    const tier = concert.tiers.find(t => t.id === AppState.order.tierId);
    const subtotal = tier.price * AppState.order.quantity;
    const tax = Math.round(subtotal * 0.1);
    const adminFee = 5000;
    const discount = AppState.order.discount || 0;
    const totalPaid = Math.max(0, subtotal + tax + adminFee - discount);

    // Buat objek tiket
    const ticketRecord = {
      bookingId: bookingId,
      bookingDate: dateFormatted,
      concertId: concert.id,
      concertTitle: concert.title,
      concertDate: concert.date,
      concertTime: concert.time,
      venue: concert.venue,
      gates: concert.gates,
      tierId: tier.id,
      tierName: tier.name,
      quantity: AppState.order.quantity,
      customerName: AppState.order.customerName,
      customerEmail: AppState.order.customerEmail,
      customerPhone: AppState.order.customerPhone,
      customerNik: AppState.order.customerNik,
      attendees: [...AppState.order.attendees],
      paymentMethod: AppState.order.paymentMethod,
      totalPaid: totalPaid
    };

    saveTicketToStorage(ticketRecord);
    showToast('🎉 Pembayaran Berhasil! E-Tiket Resmi telah diterbitkan.', 'success');
    setStep(4);
  }, 1200);
}

// ==========================================================================
// LANGKAH 4: Tampilan E-Tiket Resmi (Boarding Pass)
// ==========================================================================
function renderStep4(body, footer) {
  const concert = AppState.currentConcert;
  const tier = concert.tiers.find(t => t.id === AppState.order.tierId);
  const bookingId = AppState.order.bookingId;

  body.innerHTML = `
    <div class="eticket-container" id="printableTicket">
      <div class="eticket-card">
        <!-- Header Boarding Pass -->
        <div class="eticket-header">
          <div class="eticket-brand">
            <span>🎟️</span>
            <span>KONSERKITA OFFICIAL E-TICKET</span>
          </div>
          <span class="eticket-status-badge">✓ LUNAS & TERVERIFIKASI</span>
        </div>

        <!-- Body Boarding Pass -->
        <div class="eticket-body">
          <div class="eticket-main-info">
            <h3 class="eticket-concert-title">${concert.title}</h3>
            <div class="eticket-lineup">Lineup: ${concert.lineup}</div>

            <div class="eticket-details-grid">
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">Nama Pemesan</span>
                <span class="eticket-meta-value">${AppState.order.customerName}</span>
              </div>
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">NIK / Identitas</span>
                <span class="eticket-meta-value">${AppState.order.customerNik}</span>
              </div>
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">Kategori & Jumlah</span>
                <span class="eticket-meta-value">${AppState.order.quantity}x ${tier.name}</span>
              </div>
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">Pintu Masuk (Gate)</span>
                <span class="eticket-meta-value">${concert.gates}</span>
              </div>
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">Tanggal Konser</span>
                <span class="eticket-meta-value">${concert.date}</span>
              </div>
              <div class="eticket-meta-item">
                <span class="eticket-meta-label">Waktu Open Gate</span>
                <span class="eticket-meta-value">${concert.time}</span>
              </div>
              <div class="eticket-meta-item" style="grid-column: 1 / -1;">
                <span class="eticket-meta-label">Lokasi Acara</span>
                <span class="eticket-meta-value">${concert.venue}</span>
              </div>
            </div>

            <!-- Petunjuk Masuk Gate -->
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--border-light); font-size: 0.78rem; color: var(--text-muted); line-height: 1.5;">
              <strong>⚠️ Petunjuk Masuk Venue:</strong><br>
              1. Tunjukkan barcode / QR E-Tiket ini saat memasuki gate masuk.<br>
              2. Wajib membawa kartu identitas asli (KTP/SIM/Paspor) sesuai nama pemesan.<br>
              3. E-Tiket ini sah dan telah tersimpan di sistem verifikasi pintu masuk.
            </div>
          </div>

          <!-- Stub Tiket dengan Barcode/QR Code -->
          <div class="eticket-stub">
            <svg class="stub-qr" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="#ffffff"/>
              <!-- Simulated High Density QR Matrix -->
              <rect x="10" y="10" width="22" height="22" fill="#0f172a"/>
              <rect x="14" y="14" width="14" height="14" fill="#ffffff"/>
              <rect x="17" y="17" width="8" height="8" fill="#0f172a"/>

              <rect x="68" y="10" width="22" height="22" fill="#0f172a"/>
              <rect x="72" y="14" width="14" height="14" fill="#ffffff"/>
              <rect x="75" y="17" width="8" height="8" fill="#0f172a"/>

              <rect x="10" y="68" width="22" height="22" fill="#0f172a"/>
              <rect x="14" y="72" width="14" height="14" fill="#ffffff"/>
              <rect x="17" y="75" width="8" height="8" fill="#0f172a"/>

              <!-- Barcode Lines -->
              <rect x="36" y="12" width="4" height="18" fill="#0f172a"/>
              <rect x="44" y="12" width="6" height="18" fill="#0f172a"/>
              <rect x="54" y="12" width="3" height="18" fill="#0f172a"/>

              <rect x="36" y="38" width="28" height="28" fill="#0f172a"/>
              <rect x="42" y="44" width="16" height="16" fill="#ffffff"/>
              <rect x="46" y="48" width="8" height="8" fill="#0f172a"/>

              <rect x="12" y="38" width="18" height="4" fill="#0f172a"/>
              <rect x="12" y="46" width="18" height="6" fill="#0f172a"/>
              <rect x="70" y="42" width="18" height="5" fill="#0f172a"/>
              <rect x="70" y="52" width="18" height="4" fill="#0f172a"/>

              <rect x="36" y="72" width="54" height="4" fill="#0f172a"/>
              <rect x="40" y="80" width="50" height="8" fill="#0f172a"/>
            </svg>
            <div class="stub-booking-id">${bookingId}</div>
            <div class="stub-scan-hint">Pindai di Gate Masuk</div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 8px;">Diterbitkan: ${AppState.order.bookingDate}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  footer.innerHTML = `
    <button class="btn-close-modal" onclick="closeModal()">Selesai & Tutup</button>
    <div style="display: flex; gap: 8px;">
      <button class="btn-print-ticket" onclick="printTicket()">
        🖨️ Cetak E-Tiket (Print/PDF)
      </button>
    </div>
  `;
}

// Print Tiket
function printTicket() {
  window.print();
}

// ==========================================================================
// Modal "Cek Tiket Saya"
// ==========================================================================
function openMyTicketsModal() {
  const modal = document.getElementById('myTicketsModal');
  const list = document.getElementById('myTicketsList');
  if (!modal || !list) return;

  if (AppState.myTickets.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🎫</div>
        <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Belum Ada Tiket yang Dibeli</div>
        <div style="font-size: 0.88rem;">Tiket konser yang berhasil Anda pesan akan tersimpan otomatis di sini.</div>
      </div>
    `;
  } else {
    list.innerHTML = AppState.myTickets.map(t => {
      return `
        <div class="my-ticket-card">
          <div class="my-ticket-info">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">KODE: ${t.bookingId}</span>
            <div class="my-ticket-title">${t.concertTitle}</div>
            <div class="my-ticket-meta">
              <span>📅 ${t.concertDate}</span> • <span>${t.quantity}x ${t.tierName}</span> • <span>Pemesan: ${t.customerName}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--success); font-weight: 600; margin-top: 4px;">
              ✓ Status: Lunas (${formatRupiah(t.totalPaid)})
            </div>
          </div>
          <button class="btn-select-concert" style="padding: 6px 14px; font-size: 0.82rem;" onclick="viewSavedTicket('${t.bookingId}')">
            Lihat Tiket
          </button>
        </div>
      `;
    }).join('');
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMyTicketsModal() {
  const modal = document.getElementById('myTicketsModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function viewSavedTicket(bookingId) {
  const ticket = AppState.myTickets.find(t => t.bookingId === bookingId);
  if (!ticket) return;

  const concert = CONCERTS_DATA.find(c => c.id === ticket.concertId) || {
    id: ticket.concertId,
    title: ticket.concertTitle,
    date: ticket.concertDate,
    time: ticket.concertTime,
    venue: ticket.venue,
    gates: ticket.gates,
    lineup: 'Lineup Musisi Konser',
    tiers: [{ id: ticket.tierId, name: ticket.tierName, price: ticket.totalPaid / ticket.quantity }]
  };

  AppState.currentConcert = concert;
  AppState.order.concertId = ticket.concertId;
  AppState.order.tierId = ticket.tierId;
  AppState.order.quantity = ticket.quantity;
  AppState.order.customerName = ticket.customerName;
  AppState.order.customerEmail = ticket.customerEmail;
  AppState.order.customerPhone = ticket.customerPhone;
  AppState.order.customerNik = ticket.customerNik;
  AppState.order.bookingId = ticket.bookingId;
  AppState.order.bookingDate = ticket.bookingDate;
  AppState.order.attendees = ticket.attendees || [];

  closeMyTicketsModal();
  AppState.currentStep = 4;
  updateModalView();

  const orderModal = document.getElementById('orderModal');
  if (orderModal) orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Copy Text Helper (dengan fallback untuk lingkungan local file:/// atau browser lama)
function copyText(text, successMessage) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Berhasil disalin!', 'success');
    }).catch(() => {
      fallbackCopyText(text, successMessage);
    });
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    showToast(successMessage || 'Berhasil disalin!', 'success');
  } catch (err) {
    showToast(`Kode: ${text}`, 'info');
  }
}

// Toast Notification
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}
