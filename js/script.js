document.addEventListener('DOMContentLoaded', () => {
  // 1. Tab Navigation System
  initTabNavigation();

  // 2. Digital Clock Countdown Timer
  initDigitalCountdown();

  // 3. Lineup Sub-day Tabs
  initLineupTabs();

  // 4. Timetable Sub-day Tabs
  initTimetableTabs();

  // 5. RSVP Form & Ticket Pass Modal
  initRSVP();

  // 6. Check Saved Ticket
  checkSavedRSVP();

  // 7. Copy Link & Calendar Utils
  initCopyLinkAndCalendar();
});

/* ============================================================
   1. Tab Navigation System (KMOU Logo click resets to Home Tab)
============================================================ */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const viewTabs = document.querySelectorAll('.tab-content-view');
  const logoLink = document.getElementById('kmou-logo-reset');

  function switchTab(targetId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-view') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    viewTabs.forEach(view => {
      if (view.id === targetId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-view');
      switchTab(targetId);
    });
  });

  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('view-home');
      showToast('⚓ 한국해양대학교 아치대동제 메인 화면으로 이동했습니다.');
    });
  }

  const rsvpQuickBtns = document.querySelectorAll('.btn-switch-rsvp');
  rsvpQuickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('view-rsvp');
    });
  });
}

/* ============================================================
   2. Digital Clock Countdown Timer (Target: 2026-10-28 14:00 KST)
============================================================ */
function initDigitalCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');
  const statusEl = document.getElementById('digital-status-text');

  if (!daysEl) return;

  const targetDate = new Date('2026-10-28T14:00:00+09:00').getTime();

  let prevSec = -1;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (statusEl) statusEl.textContent = '🎉 2026 아치대동제가 성대하게 진행 중입니다!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dStr = days < 10 ? '0' + days : '' + days;
    const hStr = hours < 10 ? '0' + hours : '' + hours;
    const mStr = minutes < 10 ? '0' + minutes : '' + minutes;
    const sStr = seconds < 10 ? '0' + seconds : '' + seconds;

    if (seconds !== prevSec) {
      triggerTick(secondsEl);
      prevSec = seconds;
    }

    daysEl.textContent = dStr;
    hoursEl.textContent = hStr;
    minutesEl.textContent = mStr;
    secondsEl.textContent = sStr;

    if (statusEl) {
      statusEl.textContent = `10월 28일(수) 14:00 개막까지 D-${days}일 남았습니다`;
    }
  }

  function triggerTick(el) {
    el.classList.add('tick');
    setTimeout(() => el.classList.remove('tick'), 150);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ============================================================
   3. Lineup Sub-day Tabs
============================================================ */
function initLineupTabs() {
  const btns = document.querySelectorAll('.lineup-sub-btn');
  const day1Grid = document.getElementById('lineup-grid-day1');
  const day2Grid = document.getElementById('lineup-grid-day2');

  if (!btns.length || !day1Grid || !day2Grid) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDay = btn.getAttribute('data-day');

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetDay === 'day1') {
        day1Grid.style.display = 'grid';
        day2Grid.style.display = 'none';
      } else {
        day1Grid.style.display = 'none';
        day2Grid.style.display = 'grid';
      }
    });
  });
}

/* ============================================================
   4. Timetable Sub-day Tabs
============================================================ */
function initTimetableTabs() {
  const btns = document.querySelectorAll('.timetable-sub-btn');
  const day1View = document.getElementById('timetable-view-day1');
  const day2View = document.getElementById('timetable-view-day2');

  if (!btns.length || !day1View || !day2View) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDay = btn.getAttribute('data-day');

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetDay === 'day1') {
        day1View.style.display = 'block';
        day2View.style.display = 'none';
      } else {
        day1View.style.display = 'none';
        day2View.style.display = 'block';
      }
    });
  });
}

/* ============================================================
   5. RSVP Form & Ticket Modal
============================================================ */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const modal = document.getElementById('ticket-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value.trim();
    const affiliation = document.getElementById('rsvp-affiliation').value;
    const dateSelected = document.querySelector('input[name="rsvp-date"]:checked')?.value || '양일 (10.28 ~ 10.29)';
    const guests = document.getElementById('rsvp-guests').value;
    const message = document.getElementById('rsvp-message').value.trim();

    if (!name) {
      showToast('⚠️ 성함을 입력해주세요.');
      return;
    }

    const ticketData = {
      name,
      affiliation,
      dateSelected,
      guests,
      message,
      ticketCode: 'KMOU-2026-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleDateString()
    };

    localStorage.setItem('kmou_festival_rsvp', JSON.stringify(ticketData));

    showTicketModal(ticketData);
    showToast('🎉 참석 응답이 완료되었습니다! 초청 티켓이 발권되었습니다.');
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

function showTicketModal(data) {
  const modal = document.getElementById('ticket-modal');
  if (!modal) return;

  document.getElementById('ticket-user-name').textContent = data.name;
  document.getElementById('ticket-user-affiliation').textContent = `${data.affiliation} | 동반 ${data.guests}인`;
  document.getElementById('ticket-user-date').textContent = `🗓️ 참석일: ${data.dateSelected}`;
  document.getElementById('ticket-user-code').textContent = `TICKET CODE: ${data.ticketCode}`;

  const qrContainer = document.getElementById('qr-code-box');
  if (qrContainer) {
    qrContainer.innerHTML = `
      <svg viewBox="0 0 100 100" width="88" height="88">
        <rect width="100" height="100" fill="#ffffff" />
        <path d="M10 10 h30 v30 h-30 z M15 15 h20 v20 h-20 z M20 20 h10 v10 h-10 z" fill="#032b56" />
        <path d="M60 10 h30 v30 h-30 z M65 15 h20 v20 h-20 z M70 20 h10 v10 h-10 z" fill="#032b56" />
        <path d="M10 60 h30 v30 h-30 z M15 65 h20 v20 h-20 z M20 70 h10 v10 h-10 z" fill="#032b56" />
        <rect x="45" y="15" width="10" height="10" fill="#0284c7" />
        <rect x="45" y="35" width="10" height="20" fill="#032b56" />
        <rect x="60" y="50" width="15" height="15" fill="#7c3aed" />
        <rect x="75" y="75" width="15" height="15" fill="#032b56" />
        <rect x="45" y="70" width="20" height="10" fill="#032b56" />
        <rect x="20" y="45" width="20" height="10" fill="#0284c7" />
      </svg>
    `;
  }

  modal.classList.add('active');
}

function checkSavedRSVP() {
  const saved = localStorage.getItem('kmou_festival_rsvp');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const btn = document.getElementById('view-my-ticket-btn');
      if (btn) {
        btn.style.display = 'inline-flex';
        btn.addEventListener('click', () => {
          showTicketModal(data);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

/* ============================================================
   6. Copy Link & Calendar Utilities
============================================================ */
function initCopyLinkAndCalendar() {
  const copyBtns = document.querySelectorAll('.btn-copy-link');
  const calBtn = document.getElementById('add-calendar-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      copyUrlToClipboard();
    });
  });

  if (calBtn) {
    calBtn.addEventListener('click', downloadICSFile);
  }
}

function copyUrlToClipboard() {
  const currentUrl = window.location.href;
  navigator.clipboard.writeText(currentUrl).then(() => {
    showToast('📋 초청장 링크가 복사되었습니다!');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = currentUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('📋 초청장 링크가 복사되었습니다!');
  });
}

function downloadICSFile() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KMOU//Festival Invitation 2026//KO
BEGIN:VEVENT
SUMMARY:2026 한국해양대학교 아치대동제
DESCRIPTION:한국해양대학교 축제 초청! 잔나비, 프로미스나인, 창모, 카더가든, 비비, 에스파 & 23시 DJ 파티!
LOCATION:한국해양대학교 조도캠퍼스 대운동장
DTSTART:20261028T050000Z
DTEND:20261029T150000Z
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'KMOU_Festival_2026.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('📅 캘린더 일정 파일(.ics)이 다운로드 되었습니다!');
}

function showToast(msg) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
