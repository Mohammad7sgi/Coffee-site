/**
 * کافه رِزِرو (Espresso Reserve) - سامانه مدیریت هوشمند و منوی دیجیتال
 * Pure Vanilla JavaScript for GitHub Pages Direct Deployment
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStoryModal();
  initTelegramOrder();
  initTableRadar();
  initQuickActions();
});

// Toast System
function showToast(message, icon = 'check_circle', isError = false) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  if (isError) {
    toast.style.borderColor = 'var(--error)';
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: ${isError ? 'var(--error)' : 'var(--primary)'}">${icon}</span>
    <span style="font-weight: 500; font-size: 13px;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Mobile Sidebar Drawer Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('main-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('translate-x-full');
      if (overlay) overlay.classList.toggle('hidden');
    });
  }

  if (overlay && sidebar) {
    overlay.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    });
  }
}

// Interactive Story Modal Viewer (Instagram-style for Digital Menu)
let storyTimer = null;
let currentStoryProgress = 0;

function initStoryModal() {
  const modal = document.getElementById('story-viewer-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('story-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeStoryModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStoryModal();
  });
}

const storiesData = [
  {
    id: 1,
    title: 'اسپرسو اتیوپی یرگاچف',
    tag: 'معرفی تک‌خاستگاه',
    desc: 'طعم‌یاد گلی، اسیدیته شفاف مرکباتی و کرمای طلایی ابریشمی',
    price: '۷۵,۰۰۰ تومان',
    sku: 'ESP-ETH-01',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgO4z57NPJj1JQjFv0sdn-zpS-23XARPsQh4hryvVyHm9URPq4ORcBrXyUkaDGXRnYcSDPE9Xn9IW-JxPMAyCWSkLR5hXpDdGWJNCtAYc7K6bVeuns-qYPNcOAQ3pt5EQcKWt8_IGORC-6KEX1SGASu67psTN1xfgyIojgq_CR5CRL0-LPbd2kBjRHHBno3yVy4HF3yw3zS8AV2qBYyJBmL5wGbzElU9oFFi3Z5mjxAXVTrv9uUUWC'
  },
  {
    id: 2,
    title: 'تخفیف روز باریستا (۲۰٪)',
    tag: 'پیشنهاد ویژه شیفت',
    desc: 'لذت فلت‌وایت مخملی با شیر جو دوسر ارگانیک و آرت لاله هلندی',
    price: '۶۸,۰۰۰ تومان',
    sku: 'FLT-OAT-BAR',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn-F3GA_kTaSoHVfv0QgNBXtTS15qEsYOOgm3kLFW7EaNMSwZwiUSE4uEC3fWjOFX_-agL8ks5NiIhU2SJRD7Y1YkH_uCZpaFgJIwCTyZo_JuLTIThMnEh2pStZ6wATNiO9NPgZmXjcrnUIxoyyCHiN_iXgUeGAUbouBRt7-Z71qQkMdSsckpp6FfyUTCOG7KBy1qB6p3Hc_MOusY_-zx3dNuqVO3UjuBdiWVC9L0RZm5iQI0MXpGW'
  },
  {
    id: 3,
    title: 'کیک شکلاتی دست‌ساز بلژیکی',
    tag: 'تازه از فر باریستا',
    desc: 'شکلات تلخ ۷۰٪، مغز گردوی برشته و گاناش قهوه اسپرسو',
    price: '۸۹,۰۰۰ تومان',
    sku: 'BAK-CHOC-03',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPxxLcjMKNo2V_TRKPRdMYC2k0oUa6oYjCv4BIB-suewERnaEVu0BAVUnyCFjAcgVXkKM7Zov78CZLntzvD0YVaxT4YEsk7x1JIT78ny_ET2CMdvmf2Zzi-MIOluR1g1gU5XMDiH65hguvObMfkbVZTwucO3gqT4fO78aEpigjSQ4Br-swlqJUvxR03RIQIFDQAfZ7KSPAGZ3dJk8BbtSLLoD4C3tLJ0heDVuSMDICzmIaaJnhfh05'
  },
  {
    id: 4,
    title: 'اجرای موسیقی زنده جمعه شب',
    tag: 'رویداد هنری کافه',
    desc: 'هم‌نشینی با ساز عود و جاز آکوستیک، رزرو از هم‌اکنون باز است',
    price: 'ورودی آزاد با سفارش',
    sku: 'EVT-JAZZ-FRI',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_xHAZcmvVFBC8bWaHVSE_Ade1SDroM9zlshvE9uNb3WWRYn4lBdFhPsqu0y3XCj2lfCw1K_Qql-qwscfENwo4YHkFZONkyQauP_K-eBJJND_EShxOYbji0a9gq2OH4rhJyiwnuI_sMmEAW51zKEMusBUDAH3MGOg7yFruGrKXvQoeHckhyXl2BEJoUga5xczqsTgJdOs4apRpwUzw6mOYYY6qmz12wWkduj-7vRWqflYrdtx-ty33'
  }
];

function openStoryModal(storyIndex = 0) {
  const modal = document.getElementById('story-viewer-modal');
  if (!modal) return;

  const data = storiesData[storyIndex] || storiesData[0];
  const imgEl = document.getElementById('story-modal-img');
  const titleEl = document.getElementById('story-modal-title');
  const tagEl = document.getElementById('story-modal-tag');
  const descEl = document.getElementById('story-modal-desc');
  const priceEl = document.getElementById('story-modal-price');
  const ctaBtn = document.getElementById('story-modal-cta');

  if (imgEl) imgEl.src = data.img;
  if (titleEl) titleEl.textContent = data.title;
  if (tagEl) tagEl.textContent = data.tag;
  if (descEl) descEl.textContent = data.desc;
  if (priceEl) priceEl.textContent = data.price;

  if (ctaBtn) {
    ctaBtn.onclick = () => {
      closeStoryModal();
      orderItemDirectly(data.title, data.price);
    };
  }

  modal.classList.add('active');
  startStoryProgress();
}

function closeStoryModal() {
  const modal = document.getElementById('story-viewer-modal');
  if (modal) modal.classList.remove('active');
  if (storyTimer) clearInterval(storyTimer);
  const progressBar = document.getElementById('story-progress-fill');
  if (progressBar) progressBar.style.width = '0%';
}

function startStoryProgress() {
  if (storyTimer) clearInterval(storyTimer);
  const progressBar = document.getElementById('story-progress-fill');
  currentStoryProgress = 0;

  storyTimer = setInterval(() => {
    currentStoryProgress += 2;
    if (progressBar) progressBar.style.width = `${currentStoryProgress}%`;
    if (currentStoryProgress >= 100) {
      clearInterval(storyTimer);
      closeStoryModal();
    }
  }, 100);
}

// Direct ordering with toast & Telegram builder
function orderItemDirectly(itemName, price) {
  showToast(`«${itemName}» با قیمت ${price} به پیش‌نویس سفارش اضافه شد!`, 'shopping_cart');
  // Store in sessionStorage
  const currentCart = JSON.parse(sessionStorage.getItem('cafe_cart') || '[]');
  currentCart.push({ name: itemName, price: price, time: new Date().toLocaleTimeString('fa-IR') });
  sessionStorage.setItem('cafe_cart', JSON.stringify(currentCart));
}

// Telegram Order Generation
function initTelegramOrder() {
  const tgForm = document.getElementById('telegram-order-form');
  if (!tgForm) return;

  tgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tableNum = document.getElementById('tg-table-num')?.value || 'بیرون‌بر';
    const customerName = document.getElementById('tg-name')?.value || 'مشتری گرامی';
    const items = document.getElementById('tg-items')?.value || 'اسپرسو دابل';
    const notes = document.getElementById('tg-notes')?.value || 'بدون یادداشت';

    const message = 
`☕️ سفارش جدید کافه رِزِرو
👤 نام مشتری: ${customerName}
📍 موقعیت: میز ${tableNum}
🛒 اقلام انتخابی:
${items}
📝 توضیحات و سلیقه باریستا: ${notes}
⏰ زمان ثبت: ${new Date().toLocaleTimeString('fa-IR')}`;

    const encodedMsg = encodeURIComponent(message);
    const tgUrl = `https://t.me/ReserveCafeBot?start=${encodedMsg}`;

    showToast('در حال انتقال به تلگرام جهت ارسال مستقیم به باریستا...', 'send');
    
    setTimeout(() => {
      window.open(tgUrl, '_blank');
    }, 800);
  });
}

// Interactive Table Radar
function initTableRadar() {
  const tableButtons = document.querySelectorAll('[data-table-id]');
  tableButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tableId = btn.getAttribute('data-table-id');
      const isOccupied = btn.classList.contains('table-occupied');
      
      if (isOccupied) {
        btn.classList.remove('table-occupied', 'bg-surface-container-high');
        btn.classList.add('bg-surface-container-lowest', 'opacity-60');
        const statusSpan = btn.querySelector('.table-status');
        if (statusSpan) {
          statusSpan.textContent = 'آزاد';
          statusSpan.className = 'font-body-sm text-[10px] text-on-surface-variant table-status';
        }
        showToast(`میز ${tableId} آزاد شد و برای مشتری جدید آماده است.`, 'table_restaurant');
      } else {
        btn.classList.add('table-occupied', 'bg-surface-container-high');
        btn.classList.remove('bg-surface-container-lowest', 'opacity-60');
        const statusSpan = btn.querySelector('.table-status');
        if (statusSpan) {
          statusSpan.textContent = '۱ دقیقه';
          statusSpan.className = 'font-body-sm text-[10px] text-primary table-status';
        }
        showToast(`میز ${tableId} رزرو / پر گردید.`, 'event_seat');
      }
    });
  });
}

// Quick Barista Order Controls
function initQuickActions() {
  window.approveOrder = function(btn, orderId) {
    const row = btn.closest('tr');
    if (!row) return;
    const badge = row.querySelector('.status-badge');
    if (badge) {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-primary animate-ping"></span> در حال دم‌آوری و آماده‌سازی`;
      badge.className = 'status-badge inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-primary-container/20 text-primary font-label-sm text-label-sm';
    }
    btn.innerHTML = `<span class="material-symbols-outlined text-label-md">check</span><span>در دست انجام</span>`;
    btn.classList.add('opacity-70');
    showToast(`سفارش #${orderId} تایید شد و به ایستگاه باریستا ارسال گردید.`, 'coffee_maker');
  };

  window.printReceipt = function(orderId) {
    showToast(`فیش پرینتر باریستا برای سفارش #${orderId} با موفقیت صادر شد.`, 'print');
  };

  window.notifyWaiter = function(orderId, tableNumber) {
    showToast(`اعلان آماده بودن سفارش #${orderId} به پیجر گارسون میز ${tableNumber} ارسال شد!`, 'notifications_active');
  };

  window.orderSupplier = function(itemName, qty) {
    showToast(`سفارش خرید فوری ${qty} «${itemName}» به رُستری راش پیامک شد.`, 'local_shipping');
  };
}
