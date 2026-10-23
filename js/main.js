/* PVS demo: local navigation and demo session only; no backend authentication. */
(function () {
  "use strict";

  var sessionKey = "pvs.demo.session";
  var isDashboard = document.body.classList.contains("app");
  var loginForm = document.getElementById("login-form");

  function hasSession() {
    try {
      return sessionStorage.getItem(sessionKey) === "active" ||
        localStorage.getItem(sessionKey) === "active";
    } catch (error) { return false; }
  }

  function clearSession() {
    ["sessionStorage", "localStorage"].forEach(function (name) {
      try { window[name].removeItem(sessionKey); } catch (error) { /* Storage may be disabled. */ }
    });
  }

  function checkSession() {
    if (isDashboard && !hasSession()) {
      document.body.classList.add("session-pending");
      window.location.replace("index.html");
      return false;
    }
    document.body.classList.remove("session-pending");
    return true;
  }

  if (!checkSession()) return;
  window.addEventListener("pageshow", checkSession);
  window.addEventListener("storage", checkSession);

  function toast(message) {
    var previous = document.querySelector(".toast");
    if (previous) previous.remove();
    var notification = document.createElement("div");
    notification.className = "toast show";
    notification.setAttribute("role", "status");
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function () { notification.remove(); }, 4000);
  }

  if (loginForm) {
    var username = loginForm.elements.user;
    username.addEventListener("input", function () { username.setCustomValidity(""); });
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      username.setCustomValidity(username.value.trim() ? "" : "Bitte einen Benutzernamen eingeben.");
      if (!loginForm.reportValidity()) return;
      clearSession();
      try {
        var storage = loginForm.elements.remember.checked ? localStorage : sessionStorage;
        storage.setItem(sessionKey, "active");
      } catch (error) {
        toast("Bitte Browser-Speicher erlauben, um die Demo zu starten.");
        return;
      }
      // Never store or transmit the entered password.
      loginForm.elements.pass.value = "";
      window.location.assign("dashboard.html");
    });
  }

  var passwordHelp = document.getElementById("passwordHelpBtn");
  if (passwordHelp) passwordHelp.addEventListener("click", function () {
    toast("Demo: Ein beliebiges Passwort ist ausreichend. Es gibt kein Benutzerkonto.");
  });

  var logoutButton = document.getElementById("logoutBtn");
  if (logoutButton) logoutButton.addEventListener("click", function () {
    clearSession();
    document.body.classList.add("session-pending");
    window.location.replace("index.html");
  });

  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var menuButton = document.getElementById("menuBtn");
  var mobile = window.matchMedia("(max-width: 900px)");

  function closeSidebar(restoreFocus) {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    sidebar.inert = mobile.matches;
    overlay.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Men\u00fc \u00f6ffnen");
    if (restoreFocus) menuButton.focus();
  }

  if (sidebar && menuButton && overlay) {
    closeSidebar(false);
    menuButton.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) { closeSidebar(true); return; }
      sidebar.inert = false;
      sidebar.classList.add("open");
      overlay.classList.add("show");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Men\u00fc schlie\u00dfen");
      sidebar.querySelector("button").focus();
    });
    overlay.addEventListener("click", function () { closeSidebar(true); });
    mobile.addEventListener("change", function () { closeSidebar(false); });
    document.addEventListener("keydown", function (event) {
      if (!sidebar.classList.contains("open")) return;
      if (event.key === "Escape") { event.preventDefault(); closeSidebar(true); }
      if (event.key === "Tab") {
        var buttons = sidebar.querySelectorAll("button");
        var first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  var navItems = document.querySelectorAll(".nav-item[data-view]");
  var pageTitle = document.getElementById("pageTitle");

  function switchView(view, focusTitle) {
    var selected = Array.from(navItems).find(function (item) { return item.dataset.view === view; });
    if (!selected) selected = navItems[0];
    if (!selected) return;
    document.querySelectorAll(".view").forEach(function (section) {
      section.classList.toggle("hidden", section.id !== "view-" + selected.dataset.view);
    });
    navItems.forEach(function (item) {
      item.classList.toggle("active", item === selected);
      if (item === selected) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    pageTitle.textContent = selected.dataset.title;
    document.title = "PVS | " + selected.dataset.title + " | INTER";
    closeSidebar(false);
    if (focusTitle) { pageTitle.setAttribute("tabindex", "-1"); pageTitle.focus(); }
  }

  function navigate(view, focusTitle) {
    if (window.location.hash !== "#" + view) history.pushState(null, "", "#" + view);
    switchView(view, focusTitle);
  }

  navItems.forEach(function (item) {
    item.addEventListener("click", function () { navigate(item.dataset.view, true); });
  });
  document.querySelectorAll("[data-view-link]").forEach(function (button) {
    button.addEventListener("click", function () { navigate(button.dataset.viewLink, true); });
  });
  window.addEventListener("popstate", function () { switchView(window.location.hash.slice(1), false); });
  window.addEventListener("hashchange", function () { switchView(window.location.hash.slice(1), false); });
  switchView(window.location.hash.slice(1), false);

  var chips = document.querySelectorAll(".chip[data-filter]");
  var search = document.getElementById("globalSearch");
  var activeFilter = "alle";
  var rows = document.querySelectorAll("#view-vorgaenge tbody tr[data-type]");
  var emptyRow;
  if (rows.length) {
    emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 7;
    emptyCell.textContent = "Keine passenden Vorg\u00e4nge gefunden.";
    emptyRow.appendChild(emptyCell);
    emptyRow.className = "hidden";
    rows[0].parentElement.appendChild(emptyRow);
  }
  function filterRows() {
    var query = search ? search.value.trim().toLocaleLowerCase("de-DE") : "";
    var visible = 0;
    rows.forEach(function (row) {
      var matches = (activeFilter === "alle" || row.dataset.type === activeFilter) &&
        row.textContent.toLocaleLowerCase("de-DE").includes(query);
      row.classList.toggle("hidden", !matches);
      if (matches) visible++;
    });
    if (emptyRow) emptyRow.classList.toggle("hidden", visible !== 0);
  }
  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", String(chip.dataset.filter === activeFilter));
    chip.addEventListener("click", function () {
      activeFilter = chip.dataset.filter;
      chips.forEach(function (item) {
        item.classList.toggle("active", item === chip);
        item.setAttribute("aria-pressed", String(item === chip));
      });
      filterRows();
    });
  });
  if (search) search.addEventListener("input", function () { navigate("vorgaenge", false); filterRows(); });
  var notifications = document.getElementById("notificationsBtn");
  if (notifications) notifications.addEventListener("click", function () { navigate("hinweise", true); });

  var settingsForm = document.getElementById("settings-form");
  if (settingsForm) settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    toast("Demo: Einstellungen werden nicht gespeichert.");
  });
})();
