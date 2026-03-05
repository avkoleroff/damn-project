(function () {
  "use strict";

  const REVIEW_LABELS = { 1: "Ужасно", 2: "Плохо", 3: "Неплохо", 4: "Хорошо", 5: "Отлично, замечательно" };
  function getReviewLabel(rating) {
    return REVIEW_LABELS[Math.round(Number(rating))] || "";
  }

  function escapeHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...BASE_USERS };
      const parsed = JSON.parse(raw);
      return { ...BASE_USERS, ...parsed };
    } catch {
      return { ...BASE_USERS };
    }
  }

  function saveUsers(extraUsers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(extraUsers));
  }

  let users = loadUsers();
  function getWorkerOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_WORKER_OVERRIDES);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
  function saveWorkerOverride(username, data) {
    const all = getWorkerOverrides();
    all[username] = { ...(all[username] || {}), ...data };
    localStorage.setItem(STORAGE_WORKER_OVERRIDES, JSON.stringify(all));
  }
  (function applyWorkerOverrides() {
    const overrides = getWorkerOverrides();
    Object.keys(overrides).forEach((username) => {
      if (users[username]) Object.assign(users[username], overrides[username]);
    });
  })();

  (function seedDemoBusySlots() {
    try {
      if (localStorage.getItem(STORAGE_BUSY_SLOTS)) return;
      const today = new Date();
      const dates = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().slice(0, 10));
      }
      const slots = {};
      dates.forEach((dateStr, i) => {
        slots[dateStr] = [
          { start: "10:00", end: "11:30" },
          { start: "14:00", end: "15:00" }
        ];
        if (i % 2 === 1) slots[dateStr].push({ start: "16:00", end: "17:00" });
      });
      const all = { worker1: slots };
      localStorage.setItem(STORAGE_BUSY_SLOTS, JSON.stringify(all));
    } catch (_) {}
  })();

  (function seedDemoReviews() {
    try {
      const raw = localStorage.getItem(STORAGE_REVIEWS);
      const all = raw ? JSON.parse(raw) : {};
      const fakeReviews = [
        { author: "Ирина К.", rating: 5, date: "2025-02-10" },
        { author: "Андрей М.", rating: 4, date: "2025-02-12" },
        { author: "Ольга В.", rating: 5, date: "2025-02-15" },
        { author: "Дмитрий С.", rating: 4, date: "2025-02-18" },
        { author: "Мария П.", rating: 5, date: "2025-02-20" },
        { author: "Сергей Л.", rating: 4, date: "2025-02-19" },
        { author: "Елена Т.", rating: 5, date: "2025-02-21" },
        { author: "Никита К.", rating: 3, date: "2025-02-14" },
        { author: "Анна Р.", rating: 5, date: "2025-02-22" },
        { author: "Павел Д.", rating: 4, date: "2025-02-17" }
      ];
      Object.keys(BASE_USERS).forEach((key) => {
        if (BASE_USERS[key].role !== "worker") return;
        const existing = all[key] || [];
        if (existing.length >= 3) return;
        const need = 3 + Math.floor(Math.random() * 8);
        while (existing.length < need) {
          const r = fakeReviews[Math.floor(Math.random() * fakeReviews.length)];
          const d = new Date();
          d.setDate(d.getDate() - Math.floor(Math.random() * 30));
          const copy = { ...r, date: d.toISOString().slice(0, 10), text: getReviewLabel(r.rating) };
          existing.push(copy);
        }
        all[key] = existing;
      });
      localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(all));
    } catch (_) {}
  })();

  const usernameInput        = document.getElementById("username");
  const passwordInput        = document.getElementById("password");
  const loginBtn             = document.getElementById("login-btn");
  const registerUserBtn      = document.getElementById("register-user-btn");
  const registerWorkerBtn    = document.getElementById("register-worker-btn");
  const statusEl             = document.getElementById("status");
  const faceEl               = document.getElementById("face");
  const roleEl               = document.getElementById("role");

  const cardEl               = document.querySelector(".card");
  const searchPageEl         = document.getElementById("search-page");
  const searchInput          = document.getElementById("search-input");
  const searchBtn            = document.getElementById("search-btn");
  const searchResultsEl      = document.getElementById("search-results");
  const resultsPageEl        = document.getElementById("results-page");
  const resultsPageListEl    = document.getElementById("results-page-list");
  const resultsBackBtn       = document.getElementById("results-back-btn");
  const resultsDetailEl      = document.getElementById("results-detail");
  const resultsDetailContentEl = document.getElementById("results-detail-content");
  const resultsDetailCloseBtn = document.getElementById("results-detail-close");
  const filterKind           = document.getElementById("filter-kind");
  const filterCity           = document.getElementById("filter-city");
  const filterPriceMin       = document.getElementById("filter-price-min");
  const filterPriceMax       = document.getElementById("filter-price-max");
  const sortBy               = document.getElementById("sort-by");
  const profilePageEl        = document.getElementById("profile-page");
  const profileAvatarEl      = document.getElementById("profile-avatar");
  const profileNameEl        = document.getElementById("profile-name");
  const profileMetaEl        = document.getElementById("profile-meta");
  const profilePriceEl       = document.getElementById("profile-price");
  const profileRatingEl      = document.getElementById("profile-rating");
  const profileAboutEl       = document.getElementById("profile-about");
  const profileContactEl     = document.getElementById("profile-contact");
  const profileReviewsEl     = document.getElementById("profile-reviews");
  const profileBackBtn       = document.getElementById("profile-back-btn");
  const profileFavoriteBtn   = document.getElementById("profile-favorite-btn");
  const reviewFormEl         = document.getElementById("review-form");
  const reviewRatingInput    = document.getElementById("review-rating");
  const reviewTextInput      = document.getElementById("review-text");
  const reviewSubmitBtn      = document.getElementById("review-submit");
  const favoritesPageEl      = document.getElementById("favorites-page");
  const favoritesListEl      = document.getElementById("favorites-list");
  const favoritesBackBtn     = document.getElementById("favorites-back-btn");
  const cabinetPageEl        = document.getElementById("cabinet-page");
  const cabinetNameInput    = document.getElementById("cabinet-name");
  const cabinetPatronymicInput = document.getElementById("cabinet-patronymic");
  const cabinetCityInput    = document.getElementById("cabinet-city");
  const cabinetWorkerFields = document.getElementById("cabinet-worker-fields");
  const cabinetPriceInput   = document.getElementById("cabinet-price");
  const cabinetAboutInput   = document.getElementById("cabinet-about");
  const cabinetKindSelect   = document.getElementById("cabinet-kind");
  const cabinetSpecialtySelect = document.getElementById("cabinet-specialty");
  const cabinetTelegramInput = document.getElementById("cabinet-telegram");
  const cabinetEmailInput   = document.getElementById("cabinet-email");
  const cabinetAvatarPreview = document.getElementById("cabinet-avatar-preview");
  const cabinetAvatarInput  = document.getElementById("cabinet-avatar-input");
  const cabinetSaveBtn      = document.getElementById("cabinet-save-btn");
  const cabinetReviewsEl    = document.getElementById("cabinet-reviews");
  const cabinetLogoutBtn    = document.getElementById("cabinet-logout-btn");
  let cabinetAvatarDataUrl  = null;

  let topNavEl = null;
  let currentProfileUsername = null;

  const registerModal      = document.getElementById("register-modal");
  const regUsernameInput   = document.getElementById("reg-username");
  const regNameInput      = document.getElementById("reg-name");
  const regPatronymicInput = document.getElementById("reg-patronymic");
  const regCityInput      = document.getElementById("reg-city");
  const regPriceInput     = document.getElementById("reg-price");
  const regAboutInput     = document.getElementById("reg-about");
  const regCityWorkerInput = document.getElementById("reg-city-worker");
  const regTelegramInput  = document.getElementById("reg-telegram");
  const regEmailInput     = document.getElementById("reg-email");
  const regPasswordInput  = document.getElementById("reg-password");
  const regPassword2Input = document.getElementById("reg-password2");
  const registerStatusEl  = document.getElementById("register-status");
  const registerConfirmBtn = document.getElementById("register-confirm-btn");
  const registerCancelBtn = document.getElementById("register-cancel-btn");
  const registerModalTitleEl = document.querySelector("#register-modal .modal-title");
  const workerExtraEl     = document.getElementById("worker-extra");
  const workerKindSelect  = document.getElementById("worker-kind");
  const workerSpecialtySelect = document.getElementById("worker-specialty");

  let currentRegisterRole = "user";
  let currentUserUsername = null;
  let lastSearchQuery = "";

  function getReviews(workerUsername) {
    try {
      const raw = localStorage.getItem(STORAGE_REVIEWS);
      if (!raw) return [];
      const all = JSON.parse(raw);
      return all[workerUsername] || [];
    } catch { return []; }
  }
  function saveReview(workerUsername, review) {
    const raw = localStorage.getItem(STORAGE_REVIEWS);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[workerUsername]) all[workerUsername] = [];
    const authorUsername = currentUserUsername || "";
    const authorName = authorUsername && users[authorUsername] ? (users[authorUsername].name || authorUsername) : "Гость";
    const text = (review.text && String(review.text).trim()) ? String(review.text).trim() : getReviewLabel(review.rating);
    const newReview = { authorUsername, author: authorName, rating: review.rating, text: text, date: new Date().toISOString().slice(0, 10) };
    all[workerUsername] = all[workerUsername].filter((r) => r.authorUsername !== authorUsername);
    all[workerUsername].push(newReview);
    localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(all));
  }
  function getAverageRating(workerUsername) {
    const list = getReviews(workerUsername);
    if (!list.length) return 0;
    const sum = list.reduce((s, r) => s + r.rating, 0);
    return Math.round(sum / list.length * 10) / 10;
  }
  function getReviewCount(workerUsername) {
    return getReviews(workerUsername).length;
  }
  function formatRatingAndCount(workerUsername) {
    const rating = getAverageRating(workerUsername);
    const count = getReviewCount(workerUsername);
    if (!count) return "Нет отзывов";
    return "★ " + rating + " (" + count + " " + (count === 1 ? "отзыв" : count < 5 ? "отзыва" : "отзывов") + ")";
  }
  function getFavorites() {
    if (!currentUserUsername) return [];
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITES);
      if (!raw) return [];
      const all = JSON.parse(raw);
      return all[currentUserUsername] || [];
    } catch { return []; }
  }
  function toggleFavorite(workerUsername) {
    if (!currentUserUsername) return;
    const list = getFavorites();
    const idx = list.indexOf(workerUsername);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(workerUsername);
    const raw = localStorage.getItem(STORAGE_FAVORITES);
    const all = raw ? JSON.parse(raw) : {};
    all[currentUserUsername] = list;
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(all));
  }
  function isFavorite(workerUsername) { return getFavorites().indexOf(workerUsername) >= 0; }

  function getBusySlots(workerUsername, dateStr) {
    try {
      const raw = localStorage.getItem(STORAGE_BUSY_SLOTS);
      if (!raw) return [];
      const all = JSON.parse(raw);
      const byWorker = all[workerUsername];
      if (!byWorker || !byWorker[dateStr]) return [];
      return byWorker[dateStr];
    } catch { return []; }
  }

  const CABINET_START_HOUR = 8;
  const CABINET_END_HOUR = 22;
  const CABINET_HOURS = CABINET_END_HOUR - CABINET_START_HOUR;

  function gridStateToIntervals(dayGrid) {
    if (!dayGrid || !Array.isArray(dayGrid)) return [];
    const intervals = [];
    let start = null;
    for (let i = 0; i < dayGrid.length; i++) {
      if (dayGrid[i] === 1) {
        if (start === null) start = CABINET_START_HOUR + i;
      } else {
        if (start !== null) {
          intervals.push({ start: String(start).padStart(2, "0") + ":00", end: String(CABINET_START_HOUR + i).padStart(2, "0") + ":00" });
          start = null;
        }
      }
    }
    if (start !== null) intervals.push({ start: String(start).padStart(2, "0") + ":00", end: String(CABINET_END_HOUR).padStart(2, "0") + ":00" });
    return intervals;
  }
  function workingIntervalsToGrid(intervals) {
    const grid = new Array(CABINET_HOURS).fill(0);
    if (!intervals || !intervals.length) return grid;
    intervals.forEach((seg) => {
      const sh = timeToMinutes(seg.start) / 60;
      const eh = timeToMinutes(seg.end) / 60;
      for (let h = CABINET_START_HOUR; h < CABINET_END_HOUR; h++) {
        if (h >= sh && h < eh) grid[h - CABINET_START_HOUR] = 1;
      }
    });
    return grid;
  }

  function getWorkingHoursForDay(worker, dayNum) {
    const defaultHours = [{ start: "09:00", end: "18:00" }];
    const grid = worker.timetableGrid && worker.timetableGrid[dayNum];
    if (grid && Array.isArray(grid)) {
      const intervals = gridStateToIntervals(grid);
      if (intervals.length) return intervals;
    }
    const byDay = worker.workingHoursByDay;
    if (byDay && byDay[dayNum] && byDay[dayNum].length) return byDay[dayNum];
    return (worker.workingHours && worker.workingHours.length) ? worker.workingHours : defaultHours;
  }
  function getCellStateFromGrid(worker, dayNum, hour) {
    const grid = worker.timetableGrid && worker.timetableGrid[dayNum];
    if (!grid || !Array.isArray(grid)) return 0;
    const idx = hour - CABINET_START_HOUR;
    if (idx < 0 || idx >= grid.length) return 0;
    return grid[idx];
  }

  function timeToMinutes(t) {
    const [h, m] = String(t).split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  function timeToPercent(t) {
    return (timeToMinutes(t) / (24 * 60)) * 100;
  }
  function segmentHeight(start, end) {
    return Math.max(0, timeToPercent(end) - timeToPercent(start));
  }

  function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error", isError);
    statusEl.classList.toggle("ok", !isError && message);
  }

  function showFace(info) {
    faceEl.style.display = "block";
    roleEl.style.display = "block";
    faceEl.textContent = info.face;
    roleEl.textContent = info.label + " (" + info.role + ")";
  }

  function showErrorImage() {
    faceEl.style.display = "block";
    roleEl.style.display = "none";
    faceEl.innerHTML = '<img src="' + ERROR_IMAGE_SRC + '" alt="Ошибка входа" />';
  }

  function hideFace() {
    faceEl.style.display = "none";
    roleEl.style.display = "none";
    faceEl.textContent = "";
  }

  function setRegisterStatus(message, isError = false) {
    registerStatusEl.textContent = message;
    registerStatusEl.classList.toggle("error", isError);
    registerStatusEl.classList.toggle("ok", !isError && message);
  }

  function fillWorkerSpecialties(kind) {
    const list = WORKER_SPECIALTIES[kind] || [];
    workerSpecialtySelect.innerHTML = "";
    list.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      workerSpecialtySelect.appendChild(opt);
    });
  }

  function hideAllPages() {
    searchPageEl.style.display = "none";
    resultsPageEl.style.display = "none";
    profilePageEl.style.display = "none";
    profilePageEl.classList.remove("visible");
    favoritesPageEl.style.display = "none";
    favoritesPageEl.classList.remove("visible");
    cabinetPageEl.style.display = "none";
    cabinetPageEl.classList.remove("visible");
  }

  function showSearchPage(userOrUsername) {
    if (typeof userOrUsername === "string") currentUserUsername = userOrUsername;
    else currentUserUsername = userOrUsername ? Object.entries(users).find(([_, v]) => v === userOrUsername)?.[0] || null : null;

    cardEl.style.display = "none";
    if (topNavEl && topNavEl.parentNode) topNavEl.remove();
    topNavEl = document.createElement("div");
    topNavEl.className = "nav-links";
    const aSearch = document.createElement("a");
    aSearch.href = "#"; aSearch.textContent = "Поиск"; aSearch.addEventListener("click", (e) => { e.preventDefault(); hideAllPages(); searchPageEl.style.display = "block"; });
    const aFav = document.createElement("a");
    aFav.href = "#"; aFav.textContent = "Избранное"; aFav.addEventListener("click", (e) => { e.preventDefault(); showFavoritesPage(); });
    const btnOut = document.createElement("button");
    btnOut.className = "nav-btn"; btnOut.textContent = "Выйти";
    btnOut.addEventListener("click", () => {
      hideAllPages(); cardEl.style.display = "block"; setStatus(""); passwordInput.value = "";
      localStorage.removeItem("current_user"); currentUserUsername = null;
      if (topNavEl) topNavEl.remove();
    });
    topNavEl.appendChild(aSearch); topNavEl.appendChild(aFav); topNavEl.appendChild(btnOut);
    document.body.appendChild(topNavEl);
    hideAllPages();
    searchPageEl.style.display = "block";
    resultsPageEl.style.display = "none";
    renderSearchSuggestions();
  }

  function showFavoritesPage() {
    hideAllPages();
    favoritesPageEl.classList.add("visible");
    favoritesPageEl.style.display = "block";
    favoritesListEl.innerHTML = "";
    const favs = getFavorites();
    if (favs.length === 0) {
      favoritesListEl.innerHTML = "<div class=\"results-page-empty\">В избранном пока никого нет.</div>";
    } else {
      favs.forEach((username) => {
        const w = users[username];
        if (!w || w.role !== "worker") return;
        const card = document.createElement("div");
        card.className = "results-card";
        const content = document.createElement("div");
        content.className = "results-card-content";
        if (w.avatar) {
          const img = document.createElement("img");
          img.className = "worker-avatar";
          img.src = w.avatar;
          img.alt = "";
          content.appendChild(img);
        }
        const textBlock = document.createElement("div");
        const fullName = w.patronymic ? w.name + " " + w.patronymic : (w.name || "Без имени");
        textBlock.innerHTML = "<div class=\"results-card-name\">" + escapeHtml(fullName) + "</div><div class=\"results-card-spec\">" + (KIND_LABELS[w.kind] || "Специалист") + " — " + (w.specialty || "") + "</div>";
        if (w.price) textBlock.innerHTML += "<div class=\"card-price\">" + w.price + " ₽/час</div>";
        const revCount = getReviewCount(username);
        const rating = getAverageRating(username);
        if (rating || revCount) textBlock.innerHTML += "<div class=\"card-rating\">" + (rating ? "★ " + rating : "") + (revCount ? (rating ? " · " : "") + revCount + " " + (revCount === 1 ? "отзыв" : revCount < 5 ? "отзыва" : "отзывов") : "") + "</div>";
        content.appendChild(textBlock);
        card.appendChild(content);
        card.addEventListener("click", () => { profileFromResults = false; openProfile(username); });
        favoritesListEl.appendChild(card);
      });
    }
  }

  function showWorkerCabinet(username) {
    const w = users[username];
    if (!w || w.role !== "worker") return;
    currentUserUsername = username;
    cardEl.style.display = "none";
    if (topNavEl && topNavEl.parentNode) topNavEl.remove();
    topNavEl = document.createElement("div");
    topNavEl.className = "nav-links";
    const btnOut = document.createElement("button");
    btnOut.className = "nav-btn"; btnOut.textContent = "Выйти";
    btnOut.addEventListener("click", () => {
      hideAllPages(); cardEl.style.display = "block"; setStatus(""); passwordInput.value = "";
      localStorage.removeItem("current_user"); currentUserUsername = null;
      if (topNavEl) topNavEl.remove();
    });
    topNavEl.appendChild(btnOut);
    document.body.appendChild(topNavEl);
    hideAllPages();
    cabinetPageEl.classList.add("visible");
    cabinetPageEl.style.display = "block";
    cabinetNameInput.value = w.name || "";
    cabinetPatronymicInput.value = w.patronymic || "";
    cabinetCityInput.value = w.city || "";
    cabinetWorkerFields.style.display = "block";
    cabinetPriceInput.value = w.price || "";
    cabinetAboutInput.value = w.about || "";
    cabinetKindSelect.value = w.kind || "tutor";
    const specList = WORKER_SPECIALTIES[w.kind] || [];
    cabinetSpecialtySelect.innerHTML = "";
    specList.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name; opt.textContent = name;
      cabinetSpecialtySelect.appendChild(opt);
    });
    cabinetSpecialtySelect.value = w.specialty || "";
    if (cabinetTelegramInput) cabinetTelegramInput.value = w.telegram || "";
    if (cabinetEmailInput) cabinetEmailInput.value = w.email || "";
    cabinetAvatarDataUrl = null;
    if (cabinetAvatarPreview) {
      cabinetAvatarPreview.src = w.avatar || "";
      cabinetAvatarPreview.style.display = w.avatar ? "block" : "none";
    }
    if (cabinetAvatarInput) cabinetAvatarInput.value = "";
    const cabinetTimetableEl = document.getElementById("cabinet-timetable");
    if (cabinetTimetableEl) {
      const dayLabels = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      cabinetTimetableEl.innerHTML = "";
      const wrap = document.createElement("div");
      wrap.className = "timetable-week-wrap cabinet-timetable-grid";
      const headerRow = document.createElement("div");
      headerRow.className = "timetable-week-header";
      const timeLabel = document.createElement("div");
      timeLabel.className = "timetable-week-time-label";
      headerRow.appendChild(timeLabel);
      for (let dayNum = 0; dayNum <= 6; dayNum++) {
        const th = document.createElement("div");
        th.className = "timetable-week-day-header";
        th.textContent = dayLabels[dayNum];
        headerRow.appendChild(th);
      }
      wrap.appendChild(headerRow);
      const gridState = {};
      for (let dayNum = 0; dayNum <= 6; dayNum++) {
        let dayGrid = w.timetableGrid && w.timetableGrid[dayNum];
        if (!dayGrid || !Array.isArray(dayGrid) || dayGrid.length !== CABINET_HOURS) {
          dayGrid = workingIntervalsToGrid(getWorkingHoursForDay(w, dayNum));
        }
        gridState[dayNum] = dayGrid.slice();
      }
      for (let hour = CABINET_START_HOUR; hour < CABINET_END_HOUR; hour++) {
        const row = document.createElement("div");
        row.className = "timetable-week-row";
        const timeCell = document.createElement("div");
        timeCell.className = "timetable-week-time";
        timeCell.textContent = String(hour).padStart(2, "0") + ":00";
        row.appendChild(timeCell);
        for (let dayNum = 0; dayNum <= 6; dayNum++) {
          const idx = hour - CABINET_START_HOUR;
          const state = gridState[dayNum][idx];
          const cell = document.createElement("div");
          cell.className = "timetable-week-cell cabinet-timetable-cell";
          cell.dataset.day = String(dayNum);
          cell.dataset.hour = String(hour);
          cell.dataset.state = String(state);
          if (state === 1) cell.classList.add("working");
          else if (state === 2) cell.classList.add("busy");
          cell.title = "Серый: не работает, Зелёный: свободен, Красный: занят. Клик — смена.";
          cell.addEventListener("click", () => {
            const next = (parseInt(cell.dataset.state, 10) + 1) % 3;
            cell.dataset.state = String(next);
            gridState[dayNum][idx] = next;
            cell.classList.remove("working", "busy");
            if (next === 1) cell.classList.add("working");
            else if (next === 2) cell.classList.add("busy");
          });
          row.appendChild(cell);
        }
        wrap.appendChild(row);
      }
      const legend = document.createElement("div");
      legend.className = "timetable-legend";
      legend.innerHTML = "<span><span class=\"dot\"></span> Не работает</span><span><span class=\"dot working\"></span> Свободен</span><span><span class=\"dot busy\"></span> Занят</span>";
      wrap.appendChild(legend);
      cabinetTimetableEl.appendChild(wrap);
    }
    cabinetReviewsEl.innerHTML = "";
    getReviews(username).forEach((r) => {
      const div = document.createElement("div");
      div.className = "review-item";
      const authorLabel = (r.authorUsername && r.authorUsername === currentUserUsername) ? "Вы" : (r.author || "Гость");
      div.innerHTML = "<div class=\"review-author\">" + escapeHtml(authorLabel) + " · " + r.date + " · ★" + r.rating + "</div><div>" + (r.text && r.text.trim() ? escapeHtml(r.text) : getReviewLabel(r.rating)) + "</div>";
      cabinetReviewsEl.appendChild(div);
    });
  }

  (function restoreSession() {
    const savedUsername = localStorage.getItem("current_user");
    if (!savedUsername) return;
    const savedUser = users[savedUsername];
    if (!savedUser) return;
    usernameInput.value = savedUsername;
    if (savedUser.role === "user") showSearchPage(savedUsername);
    else if (savedUser.role === "worker") showWorkerCabinet(savedUsername);
    setStatus("");
  })();

  function openRegisterModal(role) {
    currentRegisterRole = role === "worker" ? "worker" : "user";
    regUsernameInput.value = "";
    regNameInput.value = "";
    regPatronymicInput.value = "";
    regCityInput.value = "";
    regPasswordInput.value = "";
    if (regPriceInput) regPriceInput.value = "";
    if (regAboutInput) regAboutInput.value = "";
    if (regCityWorkerInput) regCityWorkerInput.value = "";
    if (regTelegramInput) regTelegramInput.value = "";
    if (regEmailInput) regEmailInput.value = "";
    regPassword2Input.value = "";
    setRegisterStatus("");
    registerModalTitleEl.textContent =
      currentRegisterRole === "worker" ? "Регистрация worker" : "Регистрация user";

    if (currentRegisterRole === "worker") {
      workerExtraEl.style.display = "block";
      if (regCityInput && regCityInput.parentElement) regCityInput.parentElement.style.display = "none";
      workerKindSelect.value = "tutor";
      fillWorkerSpecialties("tutor");
    } else {
      workerExtraEl.style.display = "none";
      if (regCityInput && regCityInput.parentElement) regCityInput.parentElement.style.display = "block";
    }

    registerModal.style.display = "flex";
    regUsernameInput.focus();
  }

  function closeRegisterModal() {
    registerModal.style.display = "none";
  }

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const user = users[username];

    if (!user || password !== user.password) {
      setStatus("Неверный логин или пароль", true);
      showErrorImage();
      return;
    }

    setStatus("Успешный вход", false);

    if (user.role === "user") {
      localStorage.setItem("current_user", username);
      showSearchPage(username);
    } else if (user.role === "worker") {
      currentUserUsername = username;
      localStorage.setItem("current_user", username);
      showWorkerCabinet(username);
    } else {
      showFace(user);
    }
  });

  registerUserBtn.addEventListener("click", () => {
    hideFace();
    setStatus("");
    openRegisterModal("user");
  });

  registerWorkerBtn.addEventListener("click", () => {
    hideFace();
    setStatus("");
    openRegisterModal("worker");
  });

  registerConfirmBtn.addEventListener("click", () => {
    const username = regUsernameInput.value.trim();
    const name = regNameInput.value.trim();
    const patronymic = regPatronymicInput.value.trim();
    const password = regPasswordInput.value;
    const password2 = regPassword2Input.value;

    if (!username || !password || !name) {
      setRegisterStatus("Введите логин, имя и пароль", true);
      return;
    }

    if (password !== password2) {
      setRegisterStatus("Пароли не совпадают", true);
      return;
    }

    if (users[username]) {
      setRegisterStatus("Такой логин уже занят", true);
      return;
    }

    const cityUser = (regCityInput && regCityInput.value.trim()) || "";
    const newUser =
      currentRegisterRole === "worker"
        ? {
            password,
            role: "worker",
            face: ":D",
            label: "Воркер",
            name,
            patronymic,
            kind: workerKindSelect.value,
            specialty: workerSpecialtySelect.value,
            price: regPriceInput && parseInt(regPriceInput.value, 10) ? parseInt(regPriceInput.value, 10) : 0,
            about: (regAboutInput && regAboutInput.value.trim()) || "",
            city: (regCityWorkerInput && regCityWorkerInput.value.trim()) || "",
            telegram: (regTelegramInput && regTelegramInput.value.trim()) || "",
            email: (regEmailInput && regEmailInput.value.trim()) || ""
          }
        : {
            password,
            role: "user",
            face: ":P",
            label: "Пользователь",
            name,
            patronymic,
            city: cityUser
          };

    users[username] = newUser;

    const extraUsers = { ...users };
    Object.keys(BASE_USERS).forEach((key) => delete extraUsers[key]);
    saveUsers(extraUsers);

    setRegisterStatus("Регистрация успешна. Теперь можно войти.", false);
    setTimeout(() => {
      closeRegisterModal();
      usernameInput.value = username;
      passwordInput.value = "";
      setStatus("Аккаунт создан. Введите пароль и войдите.", false);
    }, 700);
  });

  registerCancelBtn.addEventListener("click", () => {
    closeRegisterModal();
  });

  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") loginBtn.click();
    });
  });

  [regUsernameInput, regNameInput, regPatronymicInput, regCityInput, regPasswordInput, regPassword2Input].forEach((input) => {
    if (!input) return;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") registerConfirmBtn.click();
    });
  });

  workerKindSelect.addEventListener("change", () => {
    fillWorkerSpecialties(workerKindSelect.value);
  });

  function getWorkersByQueryOnly(query) {
    const q = (query || "").trim().toLowerCase();
    let list = Object.entries(users)
      .filter(([_, u]) => u.role === "worker")
      .map(([username, w]) => ({ username, ...w, rating: getAverageRating(username) }));
    if (q) {
      list = list.filter((w) => {
        const specMatch = w.specialty && w.specialty.toLowerCase().includes(q);
        const kindLabel = (KIND_LABELS[w.kind] || "").toLowerCase();
        const kindMatch = kindLabel && (q.includes(kindLabel) || kindLabel.includes(q));
        return specMatch || kindMatch;
      });
    }
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }

  function getFilteredWorkers() {
    const query = (typeof lastSearchQuery === "string" ? lastSearchQuery : "").trim().toLowerCase();
    let list = Object.entries(users)
      .filter(([_, u]) => u.role === "worker")
      .map(([username, w]) => ({ username, ...w, rating: getAverageRating(username) }));
    if (query) {
      list = list.filter((w) => {
        const specMatch = w.specialty && w.specialty.toLowerCase().includes(query);
        const kindLabel = (KIND_LABELS[w.kind] || "").toLowerCase();
        const kindMatch = kindLabel && (query.includes(kindLabel) || kindLabel.includes(query));
        return specMatch || kindMatch;
      });
    }
    if (filterKind && filterKind.value) list = list.filter((w) => w.kind === filterKind.value);
    if (filterCity && filterCity.value.trim()) {
      const city = filterCity.value.trim().toLowerCase();
      list = list.filter((w) => (w.city || "").toLowerCase().includes(city));
    }
    if (filterPriceMin && filterPriceMin.value !== "") {
      const min = parseInt(filterPriceMin.value, 10);
      if (!isNaN(min)) list = list.filter((w) => (w.price || 0) >= min);
    }
    if (filterPriceMax && filterPriceMax.value !== "") {
      const max = parseInt(filterPriceMax.value, 10);
      if (!isNaN(max)) list = list.filter((w) => (w.price || 0) <= max);
    }
    const sort = sortBy ? sortBy.value : "rating";
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "priceAsc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "priceDesc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  }

  function renderResultsList() {
    const filtered = getFilteredWorkers();
    resultsPageListEl.innerHTML = "";
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "results-page-empty";
      empty.textContent = "Ничего не найдено. Измените запрос или фильтры.";
      resultsPageListEl.appendChild(empty);
    } else {
      filtered.forEach((w) => {
        const card = document.createElement("div");
        card.className = "results-card";
        card.dataset.username = w.username;
        const content = document.createElement("div");
        content.className = "results-card-content";
        if (w.avatar) {
          const img = document.createElement("img");
          img.className = "worker-avatar";
          img.src = w.avatar;
          img.alt = "";
          content.appendChild(img);
        }
        const textBlock = document.createElement("div");
        const fullName = w.patronymic ? `${w.name} ${w.patronymic}` : (w.name || "Без имени");
        const nameEl = document.createElement("div");
        nameEl.className = "results-card-name";
        nameEl.textContent = fullName;
        const specEl = document.createElement("div");
        specEl.className = "results-card-spec";
        const kindLabel = KIND_LABELS[w.kind] || "Специалист";
        specEl.textContent = `${kindLabel} — ${w.specialty}`;
        textBlock.appendChild(nameEl);
        textBlock.appendChild(specEl);
        if (w.price) { const p = document.createElement("div"); p.className = "card-price"; p.textContent = (w.price + " ₽/час"); textBlock.appendChild(p); }
        const revCount = getReviewCount(w.username);
        if (w.rating || revCount) { const r = document.createElement("div"); r.className = "card-rating"; r.textContent = (w.rating ? "★ " + w.rating : "") + (revCount ? (w.rating ? " · " : "") + revCount + " " + (revCount === 1 ? "отзыв" : revCount < 5 ? "отзыва" : "отзывов") : ""); textBlock.appendChild(r); }
        content.appendChild(textBlock);
        card.appendChild(content);
        card.addEventListener("click", () => { profileFromResults = true; openProfile(w.username); });
        resultsPageListEl.appendChild(card);
      });
    }
  }

  function renderSearchSuggestions() {
    if (!searchResultsEl) return;
    const query = searchInput.value.trim().toLowerCase();
    searchResultsEl.innerHTML = "";
    if (!query) return;
    const list = getWorkersByQueryOnly(query);
    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-card-sub";
      empty.textContent = "Ничего не найдено";
      searchResultsEl.appendChild(empty);
      return;
    }
    list.forEach((w) => {
      const card = document.createElement("div");
      card.className = "search-card";
      if (w.avatar) {
        const img = document.createElement("img");
        img.className = "worker-avatar search-card-avatar";
        img.src = w.avatar;
        img.alt = "";
        card.appendChild(img);
      }
      const textBlock = document.createElement("div");
      const fullName = w.patronymic ? `${w.name} ${w.patronymic}` : (w.name || "Без имени");
      const title = document.createElement("div");
      title.className = "search-card-title";
      title.textContent = fullName;
      const sub = document.createElement("div");
      sub.className = "search-card-sub";
      sub.textContent = (KIND_LABELS[w.kind] || "Специалист") + " — " + (w.specialty || "");
      textBlock.appendChild(title);
      textBlock.appendChild(sub);
      if (w.price) { const p = document.createElement("div"); p.className = "card-price"; p.textContent = w.price + " ₽/час"; textBlock.appendChild(p); }
      const revCount = getReviewCount(w.username);
      if (w.rating || revCount) { const r = document.createElement("div"); r.className = "card-rating"; r.textContent = (w.rating ? "★ " + w.rating : "") + (revCount ? (w.rating ? " · " : "") + revCount + " " + (revCount === 1 ? "отзыв" : revCount < 5 ? "отзыва" : "отзывов") : ""); textBlock.appendChild(r); }
      card.appendChild(textBlock);
      card.addEventListener("click", () => {
        lastSearchQuery = searchInput.value.trim();
        renderResultsList();
        closeResultsDetail();
        searchPageEl.style.display = "none";
        resultsPageEl.style.display = "flex";
        profileFromResults = true;
        renderResultsDetail(w.username);
      });
      searchResultsEl.appendChild(card);
    });
  }

  function openResultsPage() {
    lastSearchQuery = searchInput.value.trim();
    renderResultsList();
    closeResultsDetail();
    searchPageEl.style.display = "none";
    resultsPageEl.style.display = "flex";
  }

  function closeResultsPage() {
    resultsPageEl.style.display = "none";
    searchPageEl.style.display = "block";
  }

  let profileFromResults = false;

  function buildTimetableWrap(workerUsername) {
    const w = users[workerUsername];
    if (!w || w.role !== "worker") return document.createElement("div");
    function slotOverlaps(slotStartMin, slotEndMin, segStart, segEnd) {
      const s = timeToMinutes(segStart);
      const e = timeToMinutes(segEnd);
      return s < slotEndMin && e > slotStartMin;
    }
    const WEEKDAY_LABELS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const startHour = 8;
    const endHour = 22;
    const now = new Date();
    const monOffset = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - monOffset);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d);
    }
    const wrap = document.createElement("div");
    wrap.className = "timetable-week-wrap";
    const headerRow = document.createElement("div");
    headerRow.className = "timetable-week-header";
    const timeLabel = document.createElement("div");
    timeLabel.className = "timetable-week-time-label";
    headerRow.appendChild(timeLabel);
    weekDates.forEach((d) => {
      const th = document.createElement("div");
      th.className = "timetable-week-day-header";
      th.textContent = WEEKDAY_LABELS[d.getDay()] + " " + d.getDate();
      headerRow.appendChild(th);
    });
    wrap.appendChild(headerRow);
    for (let hour = startHour; hour < endHour; hour++) {
      const row = document.createElement("div");
      row.className = "timetable-week-row";
      const slotStartMin = hour * 60;
      const slotEndMin = (hour + 1) * 60;
      const timeCell = document.createElement("div");
      timeCell.className = "timetable-week-time";
      timeCell.textContent = String(hour).padStart(2, "0") + ":00";
      row.appendChild(timeCell);
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const d = weekDates[dayIdx];
        const dateStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
        const dayNum = d.getDay();
        const workSegments = getWorkingHoursForDay(w, dayNum);
        const busySlots = getBusySlots(workerUsername, dateStr);
        let isWorking = workSegments.some((seg) => slotOverlaps(slotStartMin, slotEndMin, seg.start, seg.end));
        const cellState = getCellStateFromGrid(w, dayNum, hour);
        let isBusy = cellState === 2 || busySlots.some((seg) => slotOverlaps(slotStartMin, slotEndMin, seg.start, seg.end));
        const cell = document.createElement("div");
        cell.className = "timetable-week-cell";
        if (isBusy) cell.classList.add("busy");
        else if (isWorking) cell.classList.add("working");
        row.appendChild(cell);
      }
      wrap.appendChild(row);
    }
    const legend = document.createElement("div");
    legend.className = "timetable-legend";
    legend.innerHTML = "<span><span class=\"dot working\"></span> Работает</span><span><span class=\"dot busy\"></span> Занято</span>";
    wrap.appendChild(legend);
    return wrap;
  }

  function renderResultsDetail(workerUsername) {
    if (!resultsDetailContentEl) return;
    const w = users[workerUsername];
    if (!w || w.role !== "worker") return;
    const fullName = w.patronymic ? w.name + " " + w.patronymic : (w.name || "Без имени");
    const kindLabel = KIND_LABELS[w.kind] || "Специалист";
    const contactParts = [];
    if (w.telegram) {
      const tg = String(w.telegram).trim();
      const tgHref = tg.startsWith("http") ? tg : (tg.startsWith("@") ? "https://t.me/" + tg.slice(1) : "https://t.me/" + tg);
      contactParts.push("Telegram: <a href=\"" + tgHref + "\" target=\"_blank\" rel=\"noopener\">" + escapeHtml(tg) + "</a>");
    }
    if (w.email) contactParts.push("Email: <a href=\"mailto:" + escapeHtml(w.email) + "\">" + escapeHtml(w.email) + "</a>");
    let html = "";
    if (w.avatar) html += "<div class=\"profile-header-inner\"><img class=\"profile-avatar\" src=\"" + escapeHtml(w.avatar) + "\" alt=\"\" /></div>";
    html += "<div class=\"profile-name\">" + escapeHtml(fullName) + "</div>";
    html += "<div class=\"profile-meta\">" + escapeHtml(kindLabel + " — " + (w.specialty || "") + (w.city ? " · " + w.city : "")) + "</div>";
    html += "<div class=\"profile-price\">" + (w.price ? w.price + " ₽/час" : "Цена не указана") + "</div>";
    html += "<div class=\"rating-stars\">" + escapeHtml(formatRatingAndCount(workerUsername)) + "</div>";
    html += "<div class=\"profile-about\">" + escapeHtml(w.about || "Нет описания.") + "</div>";
    html += "<div class=\"profile-contact\">" + (contactParts.length ? contactParts.join(" · ") : "Способ связи не указан.") + "</div>";
    html += "<h4 style=\"margin-top:14px\">Расписание</h4>";
    resultsDetailContentEl.innerHTML = html;
    const timetableContainer = document.createElement("div");
    timetableContainer.className = "profile-timetable";
    timetableContainer.appendChild(buildTimetableWrap(workerUsername));
    resultsDetailContentEl.appendChild(timetableContainer);
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "favorite-btn" + (isFavorite(workerUsername) ? " in-favorites" : "");
    favBtn.textContent = isFavorite(workerUsername) ? "В избранном" : "В избранное";
    favBtn.onclick = function() {
      toggleFavorite(workerUsername);
      favBtn.textContent = isFavorite(workerUsername) ? "В избранном" : "В избранное";
      favBtn.classList.toggle("in-favorites", isFavorite(workerUsername));
    };
    resultsDetailContentEl.appendChild(favBtn);
    const reviewsTitle = document.createElement("h4");
    reviewsTitle.style.marginTop = "16px";
    reviewsTitle.textContent = "Отзывы";
    resultsDetailContentEl.appendChild(reviewsTitle);
    const reviewsList = document.createElement("div");
    reviewsList.className = "reviews-list";
    getReviews(workerUsername).forEach((r) => {
      const div = document.createElement("div");
      div.className = "review-item";
      const authorLabel = (r.authorUsername && r.authorUsername === currentUserUsername) ? "Вы" : (r.author || "Гость");
      div.innerHTML = "<div class=\"review-author\">" + escapeHtml(authorLabel) + " · " + r.date + " · ★" + r.rating + "</div><div>" + (r.text && r.text.trim() ? escapeHtml(r.text) : getReviewLabel(r.rating)) + "</div>";
      reviewsList.appendChild(div);
    });
    resultsDetailContentEl.appendChild(reviewsList);
    const isUser = currentUserUsername && users[currentUserUsername] && users[currentUserUsername].role === "user";
    const isSelf = currentUserUsername === workerUsername;
    if (isUser && !isSelf) {
      const reviewForm = document.createElement("div");
      reviewForm.className = "review-form";
      reviewForm.innerHTML = "<label>Ваша оценка (1–5):</label><input type=\"number\" min=\"1\" max=\"5\" value=\"5\" class=\"js-detail-review-rating\" /><textarea placeholder=\"Текст отзыва\" class=\"js-detail-review-text\"></textarea><button type=\"button\" class=\"js-detail-review-submit\">Отправить отзыв</button>";
      const ratingInput = reviewForm.querySelector(".js-detail-review-rating");
      const textInput = reviewForm.querySelector(".js-detail-review-text");
      const submitBtn = reviewForm.querySelector(".js-detail-review-submit");
      submitBtn.onclick = function() {
        const rating = parseInt(ratingInput.value, 10);
        if (rating < 1 || rating > 5) return;
        saveReview(workerUsername, { rating, text: "" });
        renderResultsDetail(workerUsername);
      };
      resultsDetailContentEl.appendChild(reviewForm);
    }
    resultsPageEl.classList.add("has-detail");
  }

  function closeResultsDetail() {
    resultsPageEl.classList.remove("has-detail");
    if (resultsDetailContentEl) resultsDetailContentEl.innerHTML = "";
  }

  function openProfile(workerUsername) {
    currentProfileUsername = workerUsername;
    const w = users[workerUsername];
    if (!w || w.role !== "worker") return;
    if (profileFromResults && resultsDetailContentEl) {
      renderResultsDetail(workerUsername);
      return;
    }
    const fullName = w.patronymic ? `${w.name} ${w.patronymic}` : (w.name || "Без имени");
    const kindLabel = KIND_LABELS[w.kind] || "Специалист";
    if (profileAvatarEl) {
      profileAvatarEl.src = w.avatar || "";
      profileAvatarEl.style.display = w.avatar ? "block" : "none";
    }
    profileNameEl.textContent = fullName;
    profileMetaEl.textContent = `${kindLabel} — ${w.specialty}` + (w.city ? " · " + w.city : "");
    profilePriceEl.textContent = w.price ? w.price + " ₽/час" : "Цена не указана";
    profileRatingEl.textContent = formatRatingAndCount(workerUsername);
    profileAboutEl.textContent = w.about || "Нет описания.";
    profileAboutEl.style.display = (w.about ? "block" : "block");
    const contactParts = [];
    if (w.telegram) {
      const tg = String(w.telegram).trim();
      const tgHref = tg.startsWith("http") ? tg : (tg.startsWith("@") ? "https://t.me/" + tg.slice(1) : "https://t.me/" + tg);
      contactParts.push('Telegram: <a href="' + tgHref + '" target="_blank" rel="noopener">' + escapeHtml(tg) + "</a>");
    }
    if (w.email) {
      const em = String(w.email).trim();
      contactParts.push('Email: <a href="mailto:' + escapeHtml(em) + '">' + escapeHtml(em) + "</a>");
    }
    profileContactEl.innerHTML = contactParts.length ? contactParts.join(" · ") : "Способ связи не указан.";
    profileContactEl.style.display = "block";
    profileFavoriteBtn.textContent = isFavorite(workerUsername) ? "В избранном" : "В избранное";
    profileFavoriteBtn.classList.toggle("in-favorites", isFavorite(workerUsername));
    profileFavoriteBtn.onclick = () => {
      toggleFavorite(workerUsername);
      profileFavoriteBtn.textContent = isFavorite(workerUsername) ? "В избранном" : "В избранное";
      profileFavoriteBtn.classList.toggle("in-favorites", isFavorite(workerUsername));
    };

    const profileTimetableEl = document.getElementById("profile-timetable");
    if (profileTimetableEl) {
      profileTimetableEl.innerHTML = "";
      profileTimetableEl.appendChild(buildTimetableWrap(workerUsername));
    }

    const reviews = getReviews(workerUsername);
    profileReviewsEl.innerHTML = "";
    reviews.forEach((r) => {
      const div = document.createElement("div");
      div.className = "review-item";
      const authorLabel = (r.authorUsername && r.authorUsername === currentUserUsername) ? "Вы" : (r.author || "Гость");
      div.innerHTML = "<div class=\"review-author\">" + escapeHtml(authorLabel) + " · " + r.date + " · ★" + r.rating + "</div><div>" + (r.text && r.text.trim() ? escapeHtml(r.text) : getReviewLabel(r.rating)) + "</div>";
      profileReviewsEl.appendChild(div);
    });
    const isUser = currentUserUsername && users[currentUserUsername] && users[currentUserUsername].role === "user";
    const isSelf = currentUserUsername === workerUsername;
    if (isUser && !isSelf) {
      reviewFormEl.style.display = "block";
      reviewRatingInput.value = 5;
      reviewTextInput.value = "";
      reviewSubmitBtn.onclick = () => {
        const rating = parseInt(reviewRatingInput.value, 10);
        const text = reviewTextInput.value.trim();
        if (rating < 1 || rating > 5) return;
        saveReview(workerUsername, { rating, text });
        reviewTextInput.value = "";
        openProfile(workerUsername);
      };
    } else {
      reviewFormEl.style.display = "none";
    }
    searchPageEl.style.display = "none";
    resultsPageEl.style.display = "none";
    profilePageEl.classList.add("visible");
    profilePageEl.style.display = "block";
  }

  function closeProfile() {
    profilePageEl.classList.remove("visible");
    profilePageEl.style.display = "none";
    if (profileFromResults) resultsPageEl.style.display = "flex";
    else searchPageEl.style.display = "block";
  }

  profileBackBtn.addEventListener("click", () => { closeProfile(); });

  searchBtn.addEventListener("click", openResultsPage);
  searchInput.addEventListener("input", renderSearchSuggestions);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openResultsPage();
  });
  resultsBackBtn.addEventListener("click", () => { closeResultsDetail(); closeResultsPage(); });
  if (resultsDetailCloseBtn) resultsDetailCloseBtn.addEventListener("click", closeResultsDetail);
  favoritesBackBtn.addEventListener("click", () => { hideAllPages(); searchPageEl.style.display = "block"; });

  cabinetKindSelect.addEventListener("change", () => {
    const list = WORKER_SPECIALTIES[cabinetKindSelect.value] || [];
    cabinetSpecialtySelect.innerHTML = "";
    list.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name; opt.textContent = name;
      cabinetSpecialtySelect.appendChild(opt);
    });
  });
  if (cabinetAvatarInput) {
    cabinetAvatarInput.addEventListener("change", function() {
      const file = this.files && this.files[0];
      if (!file) return;
      const fr = new FileReader();
      fr.onload = function() {
        cabinetAvatarDataUrl = fr.result;
        if (cabinetAvatarPreview) {
          cabinetAvatarPreview.src = cabinetAvatarDataUrl;
          cabinetAvatarPreview.style.display = "block";
        }
      };
      fr.readAsDataURL(file);
    });
  }
  cabinetSaveBtn.addEventListener("click", () => {
    if (!currentUserUsername) return;
    const w = users[currentUserUsername];
    if (!w || w.role !== "worker") return;
    w.name = cabinetNameInput.value.trim() || w.name;
    w.patronymic = cabinetPatronymicInput.value.trim();
    w.city = cabinetCityInput.value.trim();
    w.price = parseInt(cabinetPriceInput.value, 10) || 0;
    w.about = cabinetAboutInput.value.trim();
    w.kind = cabinetKindSelect.value;
    w.specialty = cabinetSpecialtySelect.value;
    w.telegram = cabinetTelegramInput ? cabinetTelegramInput.value.trim() : "";
    w.email = cabinetEmailInput ? cabinetEmailInput.value.trim() : "";
    if (cabinetAvatarDataUrl) w.avatar = cabinetAvatarDataUrl;
    const cabinetTimetableEl = document.getElementById("cabinet-timetable");
    const overrides = {};
    if (cabinetAvatarDataUrl) overrides.avatar = w.avatar;
    if (cabinetTimetableEl) {
      const timetableGrid = {};
      for (let dayNum = 0; dayNum <= 6; dayNum++) timetableGrid[dayNum] = new Array(CABINET_HOURS).fill(0);
      cabinetTimetableEl.querySelectorAll(".cabinet-timetable-cell").forEach((cell) => {
        const dayNum = parseInt(cell.dataset.day, 10);
        const hour = parseInt(cell.dataset.hour, 10);
        const state = parseInt(cell.dataset.state, 10);
        const idx = hour - CABINET_START_HOUR;
        if (dayNum >= 0 && dayNum <= 6 && idx >= 0 && idx < CABINET_HOURS) timetableGrid[dayNum][idx] = state;
      });
      w.timetableGrid = timetableGrid;
      w.workingHoursByDay = {};
      for (let dayNum = 0; dayNum <= 6; dayNum++) {
        w.workingHoursByDay[dayNum] = gridStateToIntervals(timetableGrid[dayNum]);
      }
      overrides.timetableGrid = w.timetableGrid;
      overrides.workingHoursByDay = w.workingHoursByDay;
    }
    if (Object.keys(overrides).length) saveWorkerOverride(currentUserUsername, overrides);
    if (!Object.prototype.hasOwnProperty.call(BASE_USERS, currentUserUsername)) {
      const extraUsers = { ...users };
      Object.keys(BASE_USERS).forEach((k) => delete extraUsers[k]);
      saveUsers(extraUsers);
    }
    showWorkerCabinet(currentUserUsername);
  });
  cabinetLogoutBtn.addEventListener("click", () => {
    hideAllPages(); cardEl.style.display = "block"; setStatus(""); passwordInput.value = "";
    localStorage.removeItem("current_user"); currentUserUsername = null;
    if (topNavEl) topNavEl.style.display = "none";
  });

  [filterKind, filterCity, filterPriceMin, filterPriceMax, sortBy].forEach((el) => {
    if (el) el.addEventListener("change", () => { if (resultsPageEl.style.display !== "none") renderResultsList(); });
    if (el && el.tagName === "INPUT") el.addEventListener("input", () => { if (resultsPageEl.style.display !== "none") renderResultsList(); });
  });
})();
