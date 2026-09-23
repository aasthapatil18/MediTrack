/* =========================================================
   MediTrack - Main Stylesheet
   ========================================================= */

/* ---------- Basic Reset ---------- */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #167c80;
    --primary-dark: #0f6265;
    --primary-light: #e8f7f6;

    --background: #f5f8f9;
    --surface: #ffffff;
    --surface-soft: #f8fbfb;

    --text: #1e2b32;
    --text-light: #6d7c83;
    --text-muted: #8b989e;

    --border: #e2e9eb;

    --success: #218a62;
    --success-bg: #eaf7f1;

    --warning: #c98314;
    --warning-bg: #fff6e5;

    --danger: #d64d55;
    --danger-bg: #fdeced;

    --shadow: 0 8px 25px rgba(31, 52, 59, 0.06);

    --sidebar-width: 255px;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: Arial, Helvetica, sans-serif;
    background: var(--background);
    color: var(--text);
    line-height: 1.5;
}

button,
input,
select,
textarea {
    font-family: inherit;
}

button {
    cursor: pointer;
}

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 3px solid rgba(22, 124, 128, 0.18);
    outline-offset: 1px;
}

.hidden {
    display: none !important;
}


/* =========================================================
   APP LAYOUT
   ========================================================= */

.app {
    min-height: 100vh;
    display: flex;
}


/* =========================================================
   SIDEBAR
   ========================================================= */

.sidebar {
    width: var(--sidebar-width);
    min-height: 100vh;
    background: #ffffff;
    border-right: 1px solid var(--border);
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    z-index: 100;
}

.brand {
    height: 88px;
    padding: 20px 22px;
    display: flex;
    align-items: center;
    gap: 13px;
    border-bottom: 1px solid var(--border);
}

.brand-icon {
    width: 42px;
    height: 42px;
    background: var(--primary);
    color: white;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    font-weight: bold;
}

.brand h2 {
    font-size: 20px;
    color: var(--text);
    line-height: 1.1;
}

.brand span {
    color: var(--text-muted);
    font-size: 11px;
}

.navigation {
    padding: 24px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.nav-item {
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--text-light);
    min-height: 48px;
    border-radius: 9px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    gap: 13px;
    font-size: 14px;
    text-align: left;
    transition: 0.2s ease;
}

.nav-item:hover {
    background: var(--primary-light);
    color: var(--primary);
}

.nav-item.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
}

.nav-icon {
    width: 24px;
    text-align: center;
    font-size: 19px;
}

.sidebar-footer {
    margin-top: auto;
    padding: 20px 15px;
    border-top: 1px solid var(--border);
}

.sidebar-info {
    display: flex;
    gap: 10px;
    align-items: center;
    background: var(--surface-soft);
    border-radius: 10px;
    padding: 12px;
}

.sidebar-info > span {
    color: var(--success);
    font-size: 12px;
}

.sidebar-info strong {
    display: block;
    font-size: 12px;
}

.sidebar-info small {
    color: var(--text-muted);
    font-size: 10px;
}


/* =========================================================
   MAIN CONTENT
   ========================================================= */

.main-content {
    width: calc(100% - var(--sidebar-width));
    margin-left: var(--sidebar-width);
    min-height: 100vh;
}

.topbar {
    height: 70px;
    background: rgba(255, 255, 255, 0.96);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 50;
}

.topbar-title {
    font-size: 14px;
    color: var(--text-light);
    font-weight: 600;
}

.topbar-actions {
    display: flex;
    align-items: center;
    gap: 18px;
}

.date-display {
    color: var(--text-light);
    font-size: 13px;
}

.profile-mini {
    width: 35px;
    height: 35px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
}

.mobile-menu {
    display: none;
    background: transparent;
    border: 0;
    font-size: 23px;
    color: var(--text);
}


/* =========================================================
   PAGE
   ========================================================= */

.page {
    display: none;
    padding: 32px;
    max-width: 1600px;
    margin: 0 auto;
}

.page.active {
    display: block;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 28px;
}

.hero-header {
    background: linear-gradient(120deg, #e9f7f6, #ffffff);
    border: 1px solid #dceeed;
    border-radius: 16px;
    padding: 28px;
}

.eyebrow {
    display: inline-block;
    color: var(--primary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.3px;
    margin-bottom: 6px;
}

.page-header h1 {
    font-size: 28px;
    line-height: 1.2;
    margin-bottom: 6px;
}

.page-header p {
    color: var(--text-light);
    font-size: 13px;
}

.header-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}


/* =========================================================
   BUTTONS
   ========================================================= */

.primary-btn,
.secondary-btn,
.text-btn {
    border: 0;
    border-radius: 8px;
    min-height: 42px;
    padding: 0 17px;
    font-size: 13px;
    font-weight: 600;
    transition: 0.2s ease;
}

.primary-btn {
    background: var(--primary);
    color: white;
}

.primary-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.secondary-btn {
    background: #ffffff;
    color: var(--text);
    border: 1px solid var(--border);
}

.secondary-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.text-btn {
    background: transparent;
    color: var(--primary);
    padding: 4px 0;
    min-height: auto;
}

.text-btn:hover {
    text-decoration: underline;
}


/* =========================================================
   STAT CARDS
   ========================================================= */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 17px;
    margin-bottom: 22px;
}

.stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 13px;
    min-height: 120px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: var(--shadow);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
}

.medicines-icon {
    background: #eaf5ff;
    color: #3276a9;
}

.warning-icon {
    background: var(--warning-bg);
    color: var(--warning);
}

.danger-icon {
    background: var(--danger-bg);
    color: var(--danger);
}

.reminder-icon {
    background: var(--primary-light);
    color: var(--primary);
}

.stat-card span {
    display: block;
    color: var(--text-light);
    font-size: 12px;
    margin-bottom: 4px;
}

.stat-card strong {
    font-size: 27px;
    font-weight: 700;
}


/* =========================================================
   DASHBOARD
   ========================================================= */

.dashboard-grid {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 22px;
}

.content-card,
.table-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 13px;
    box-shadow: var(--shadow);
}

.content-card {
    padding: 22px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 20px;
}

.card-header h2 {
    font-size: 17px;
    margin-bottom: 3px;
}

.card-header p {
    color: var(--text-muted);
    font-size: 11px;
}

.schedule-list,
.alert-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
}

.schedule-item,
.dashboard-alert-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px;
    border-radius: 9px;
    background: var(--surface-soft);
    border: 1px solid #edf1f2;
}

.schedule-left {
    display: flex;
    align-items: center;
    gap: 11px;
}

.schedule-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    justify-content: center;
    align-items: center;
}

.schedule-item strong,
.dashboard-alert-item strong {
    display: block;
    font-size: 13px;
}

.schedule-item small,
.dashboard-alert-item small {
    color: var(--text-muted);
    font-size: 11px;
}

.schedule-time {
    color: var(--primary);
    font-size: 12px;
    font-weight: 600;
}

.dashboard-alert-item {
    justify-content: flex-start;
}

.alert-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.alert-dot.danger {
    background: var(--danger);
}

.alert-dot.warning {
    background: var(--warning);
}


/* =========================================================
   TOOLBAR
   ========================================================= */

.toolbar {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 13px;
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.search-box {
    min-height: 43px;
    max-width: 470px;
    flex: 1;
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 13px;
    background: #ffffff;
}

.search-box span {
    color: var(--text-muted);
    font-size: 21px;
}

.search-box input {
    border: 0;
    outline: 0;
    width: 100%;
    color: var(--text);
    font-size: 13px;
}

.sort-box {
    display: flex;
    align-items: center;
    gap: 9px;
}

.sort-box label {
    color: var(--text-light);
    font-size: 12px;
}

.sort-box select {
    min-height: 43px;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0 12px;
    color: var(--text);
    background: white;
    font-size: 12px;
}


/* =========================================================
   TABLES
   ========================================================= */

.table-card {
    overflow: hidden;
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 850px;
}

th {
    background: #f8fafb;
    color: var(--text-light);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
}

td {
    padding: 15px 16px;
    border-bottom: 1px solid #edf1f2;
    color: var(--text);
    font-size: 12px;
    vertical-align: middle;
}

tbody tr:last-child td {
    border-bottom: 0;
}

tbody tr:hover {
    background: #fbfdfd;
}

.medicine-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 150px;
}

.medicine-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.medicine-name {
    font-weight: 600;
}

.medicine-strength {
    display: block;
    color: var(--text-muted);
    font-size: 10px;
    margin-top: 2px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}

.status-safe {
    background: var(--success-bg);
    color: var(--success);
}

.status-soon {
    background: var(--warning-bg);
    color: var(--warning);
}

.status-expired {
    background: var(--danger-bg);
    color: var(--danger);
}

.action-buttons {
    display: flex;
    gap: 6px;
}

.action-btn {
    border: 1px solid var(--border);
    background: white;
    border-radius: 6px;
    height: 31px;
    padding: 0 9px;
    font-size: 10px;
    font-weight: 600;
}

.action-btn.edit {
    color: var(--primary);
}

.action-btn.edit:hover {
    background: var(--primary-light);
}

.action-btn.delete {
    color: var(--danger);
}

.action-btn.delete:hover {
    background: var(--danger-bg);
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

.empty-state {
    text-align: center;
    padding: 50px 20px;
    color: var(--text-light);
}

.empty-state.small-empty {
    padding: 30px 20px;
}

.empty-icon {
    width: 52px;
    height: 52px;
    margin: 0 auto 12px;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 23px;
}

.empty-state h3 {
    color: var(--text);
    font-size: 15px;
    margin-bottom: 4px;
}

.empty-state p {
    font-size: 12px;
}


/* =========================================================
   REMINDERS
   ========================================================= */

.reminder-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 17px;
}

.reminder-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 13px;
    padding: 20px;
    box-shadow: var(--shadow);
    position: relative;
}

.reminder-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 17px;
}

.reminder-icon {
    width: 43px;
    height: 43px;
    border-radius: 10px;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 19px;
}

.reminder-status {
    padding: 5px 8px;
    border-radius: 20px;
    background: var(--success-bg);
    color: var(--success);
    font-size: 9px;
    font-weight: bold;
}

.reminder-card h3 {
    font-size: 16px;
    margin-bottom: 5px;
}

.reminder-type {
    color: var(--text-muted);
    font-size: 11px;
    margin-bottom: 16px;
}

.reminder-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding-top: 15px;
    border-top: 1px solid var(--border);
}

.reminder-detail span {
    display: block;
    color: var(--text-muted);
    font-size: 10px;
    margin-bottom: 3px;
}

.reminder-detail strong {
    font-size: 12px;
}

.delete-reminder {
    margin-top: 15px;
    width: 100%;
    border: 1px solid var(--border);
    background: white;
    color: var(--danger);
    border-radius: 7px;
    height: 34px;
    font-size: 11px;
    font-weight: 600;
}

.delete-reminder:hover {
    background: var(--danger-bg);
}


/* =========================================================
   ALERTS
   ========================================================= */

.alert-summary-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-bottom: 30px;
}

.alert-summary-card {
    border-radius: 13px;
    padding: 22px;
    display: flex;
    align-items: center;
    gap: 17px;
    border: 1px solid;
}

.expired-summary {
    background: var(--danger-bg);
    border-color: #f6d4d7;
}

.soon-summary {
    background: var(--warning-bg);
    border-color: #f6e2ba;
}

.summary-number {
    width: 55px;
    height: 55px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    font-size: 23px;
    font-weight: 700;
}

.expired-summary .summary-number {
    color: var(--danger);
}

.soon-summary .summary-number {
    color: var(--warning);
}

.alert-summary-card h3 {
    font-size: 15px;
    margin-bottom: 3px;
}

.alert-summary-card p {
    color: var(--text-light);
    font-size: 11px;
}

.alert-section {
    margin-bottom: 28px;
}

.section-heading {
    margin-bottom: 12px;
}

.section-heading h2 {
    font-size: 17px;
}


/* =========================================================
   REPORTS
   ========================================================= */

.report-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 22px;
}

.report-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 19px;
    box-shadow: var(--shadow);
}

.report-card span {
    display: block;
    color: var(--text-light);
    font-size: 11px;
    margin-bottom: 5px;
}

.report-card strong {
    font-size: 25px;
}

.report-card-container {
    padding: 0;
    overflow: hidden;
}

.report-card-container .card-header {
    padding: 22px 22px 0;
}


/* =========================================================
   PROFILE
   ========================================================= */

.profile-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 22px;
    align-items: start;
}

.profile-intro {
    background: linear-gradient(145deg, #e9f7f6, #ffffff);
    border: 1px solid #dceeed;
    border-radius: 13px;
    padding: 28px;
    text-align: center;
}

.large-profile-icon {
    width: 90px;
    height: 90px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
}

.profile-intro h2 {
    font-size: 18px;
    margin-bottom: 7px;
}

.profile-intro p {
    color: var(--text-light);
    font-size: 11px;
}

.profile-form-card {
    min-height: 260px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 17px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
}

.form-group label span {
    color: var(--danger);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    border: 1px solid var(--border);
    background: #ffffff;
    border-radius: 8px;
    padding: 0 12px;
    color: var(--text);
    font-size: 12px;
    transition: border-color 0.2s;
}

.form-group input,
.form-group select {
    height: 43px;
}

.form-group textarea {
    padding: 11px 12px;
    resize: vertical;
    min-height: 80px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
    border-color: var(--danger);
}

.field-error {
    color: var(--danger);
    font-size: 10px;
    margin-top: 4px;
    min-height: 0;
}

.form-help {
    color: var(--text-muted);
    font-size: 10px;
    margin-top: 5px;
}

.form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
}

.success-message {
    margin-top: 15px;
    background: var(--success-bg);
    color: var(--success);
    padding: 10px 12px;
    border-radius: 7px;
    font-size: 12px;
}


/* =========================================================
   MODALS
   ========================================================= */

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(17, 34, 39, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 500;
}

.modal-overlay.active {
    display: flex;
}

.modal {
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    background: white;
    border-radius: 15px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
    animation: modalOpen 0.18s ease;
}

.large-modal {
    max-width: 760px;
}

@keyframes modalOpen {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.99);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
    padding: 22px 24px;
    border-bottom: 1px solid var(--border);
}

.modal-header h2 {
    font-size: 20px;
}

.close-btn {
    width: 32px;
    height: 32px;
    border: 0;
    background: var(--surface-soft);
    color: var(--text-light);
    border-radius: 7px;
    font-size: 21px;
    line-height: 1;
}

.close-btn:hover {
    background: var(--danger-bg);
    color: var(--danger);
}

.modal form {
    padding: 22px 24px 24px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 9px;
    padding-top: 23px;
    margin-top: 22px;
    border-top: 1px solid var(--border);
}

.time-input-group {
    display: grid;
    grid-template-columns: 1fr 95px;
    gap: 8px;
}

.scan-modal {
    max-width: 440px;
}

.scan-content {
    padding: 35px 28px 10px;
    text-align: center;
}

.scan-icon {
    width: 80px;
    height: 80px;
    border: 2px dashed var(--primary);
    color: var(--primary);
    border-radius: 14px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 31px;
}

.scan-content h3 {
    font-size: 17px;
    margin-bottom: 7px;
}

.scan-content p {
    color: var(--text-light);
    font-size: 12px;
}

.scan-modal .modal-actions {
    margin: 15px 24px 0;
    padding-bottom: 24px;
}


/* =========================================================
   TOAST
   ========================================================= */

.toast {
    position: fixed;
    right: 25px;
    bottom: 25px;
    min-width: 230px;
    max-width: 350px;
    padding: 13px 15px;
    background: #1f3136;
    color: white;
    border-radius: 9px;
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.18);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    transform: translateY(120px);
    opacity: 0;
    transition: 0.25s ease;
    z-index: 800;
}

.toast.show {
    transform: translateY(0);
    opacity: 1;
}

.toast-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--success);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}


/* =========================================================
   RESPONSIVE - TABLET
   ========================================================= */

@media (max-width: 1100px) {

    :root {
        --sidebar-width: 220px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .dashboard-grid {
        grid-template-columns: 1fr;
    }

    .reminder-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .report-summary-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .profile-layout {
        grid-template-columns: 1fr;
    }

    .profile-intro {
        text-align: left;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .large-profile-icon {
        margin: 0;
        width: 65px;
        height: 65px;
        font-size: 24px;
        flex-shrink: 0;
    }
}


/* =========================================================
   RESPONSIVE - MOBILE
   ========================================================= */

@media (max-width: 760px) {

    :root {
        --sidebar-width: 0px;
    }

    .sidebar {
        width: 250px;
        transform: translateX(-100%);
        transition: transform 0.25s ease;
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.08);
    }

    .sidebar.mobile-open {
        transform: translateX(0);
    }

    .main-content {
        width: 100%;
        margin-left: 0;
    }

    .mobile-menu {
        display: block;
    }

    .topbar {
        padding: 0 17px;
        gap: 12px;
    }

    .topbar-title {
        margin-right: auto;
    }

    .date-display {
        display: none;
    }

    .page {
        padding: 20px 15px;
    }

    .page-header {
        flex-direction: column;
        margin-bottom: 20px;
    }

    .hero-header {
        padding: 20px;
    }

    .page-header h1 {
        font-size: 24px;
    }

    .header-buttons {
        width: 100%;
    }

    .header-buttons button {
        flex: 1;
    }

    .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }

    .stat-card {
        padding: 14px;
        min-height: 105px;
        gap: 10px;
    }

    .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 17px;
    }

    .stat-card strong {
        font-size: 22px;
    }

    .stat-card span {
        font-size: 10px;
    }

    .toolbar {
        flex-direction: column;
    }

    .search-box {
        max-width: none;
    }

    .sort-box {
        width: 100%;
    }

    .sort-box select {
        flex: 1;
    }

    .alert-summary-grid {
        grid-template-columns: 1fr;
    }

    .reminder-grid {
        grid-template-columns: 1fr;
    }

    .report-summary-grid {
        grid-template-columns: 1fr 1fr;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .form-group.full-width {
        grid-column: auto;
    }

    .modal {
        max-height: 94vh;
    }

    .large-modal {
        max-width: 100%;
    }

    .modal form {
        padding: 18px;
    }

    .modal-header {
        padding: 18px;
    }

    .modal-actions {
        flex-wrap: wrap;
    }

    .modal-actions button {
        flex: 1;
    }

    .profile-intro {
        padding: 20px;
    }
}


/* =========================================================
   RESPONSIVE - SMALL MOBILE
   ========================================================= */

@media (max-width: 480px) {

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .report-summary-grid {
        grid-template-columns: 1fr;
    }

    .page-header .primary-btn {
        width: 100%;
    }

    .hero-header .primary-btn {
        margin-top: 5px;
    }

    .profile-intro {
        display: block;
        text-align: center;
    }

    .large-profile-icon {
        margin: 0 auto 12px;
    }

    .toast {
        left: 15px;
        right: 15px;
        bottom: 15px;
        min-width: 0;
    }
}


/* =========================================================
   PRINT STYLES
   ========================================================= */

@media print {

    body {
        background: white;
    }

    .sidebar,
    .topbar,
    .page-header .primary-btn,
    .page-header .secondary-btn,
    .toolbar,
    .action-buttons,
    .toast,
    .mobile-menu {
        display: none !important;
    }

    .main-content {
        width: 100%;
        margin: 0;
    }

    .page {
        display: none !important;
        padding: 0;
    }

    #reportsPage {
        display: block !important;
    }

    .report-summary-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    .report-card,
    .content-card,
    .table-card {
        box-shadow: none;
    }

    .report-card-container {
        border: 1px solid #ddd;
    }

    table {
        min-width: 0;
    }

    th,
    td {
        font-size: 9px;
        padding: 8px;
    }

    .medicine-avatar {
        display: none;
    }
}
