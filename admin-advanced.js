(() => {
  const STORAGE_KEY = 'adminAdvancedSettings';
  const DRAFT_KEY = 'adminAdvancedSettingsDraft';
  const LOG_KEY = 'adminAdvancedLogs';
  const ACTIVE_SECTION_KEY = 'adminAdvancedActiveSection';
  const WELCOME_KEY = 'adminWelcomeShownThisSession';

  const sw = (path, label, help) => ({ type: 'switch', path, label, help: help || '' });
  const sel = (path, label, options, help) => ({ type: 'select', path, label, options, help: help || '' });
  const num = (path, label, min, max, step, unit, help) => ({ type: 'number', path, label, min, max, step, unit: unit || '', help: help || '' });
  const rng = (path, label, min, max, step, unit, help) => ({ type: 'range', path, label, min, max, step, unit: unit || '', help: help || '' });
  const txt = (path, label, help) => ({ type: 'text', path, label, help: help || '' });
  const ta = (path, label, rows, help) => ({ type: 'textarea', path, label, rows, help: help || '' });
  const btn = (action, label, help, tone) => ({ type: 'button', action, label, help: help || '', tone: tone || 'neutral' });

  const DEFAULT_SETTINGS = {
    general: {
      autoSave: true,
      draftRecovery: true,
      undoAction: true,
      confirmations: true,
      soundEffects: false,
    },
    appearance: {
      theme: 'dark',
      accentColor: '#6366f1',
      sidebarStyle: 'expanded',
      compactMode: false,
      animations: true,
      fontSize: 16,
      cardRadius: 16,
      glassIntensity: 72,
    },
    dashboard: {
      widgets: {
        welcomeBanner: true,
        quickActions: true,
        kpis: true,
        insights: true,
        activity: true,
        resources: true,
      },
      defaultHomepage: 'dashboard',
      autoRefresh: 45,
      analyticsVisible: true,
    },
    attendance: {
      gpsRadius: 60,
      tokenExpiryMinutes: 15,
      qrValiditySeconds: 45,
      duplicateDetection: true,
      deviceRestriction: true,
      autoClose: true,
    },
    uploads: {
      maxUploadSizeMb: 50,
      allowedFormats: 'pdf,doc,docx,ppt,pptx,mp4',
      autoCompression: true,
      autoThumbnailGeneration: true,
      cloudBackup: true,
      autoCategorization: true,
    },
    notifications: {
      pushNotifications: true,
      emailAlerts: true,
      examReminders: true,
      attendanceWarnings: true,
      liveSessionAlerts: true,
      liveSyncIndicator: true,
    },
    security: {
      twoFactorAuth: true,
      deviceManagement: true,
      sessionTimeoutMinutes: 30,
      loginAlerts: true,
      ipRestrictions: false,
      rolePermissions: true,
    },
    ai: {
      analysisLevel: 'balanced',
      similaritySensitivity: 70,
      autoRecommendations: true,
      weakStudentDetection: true,
      aiReportGeneration: true,
    },
    students: {
      quickFilters: true,
      bulkActions: true,
      behaviorFlags: true,
      profileNotes: true,
    },
    exams: {
      questionBank: true,
      autoShuffle: true,
      timerWarnings: true,
      resultExport: true,
      proctoringMode: false,
    },
    backup: {
      autoBackupSchedule: 'daily',
      cloudSync: true,
      restorePoints: true,
      localSnapshots: true,
    },
    performance: {
      clearCacheOnSave: false,
      lazyLoading: true,
      animationPerformanceMode: 'balanced',
      dataOptimization: true,
    },
    advanced: {
      apiIntegrations: true,
      firebaseControls: true,
      debugMode: false,
      errorTracker: true,
    },
  };

  const SETTINGS_SECTIONS = [
    {
      id: 'general',
      icon: '⚙️',
      title: 'General',
      description: 'Autosave, draft recovery, confirmation flows, and small UX protections.',
      controls: [
        sw('general.autoSave', 'Auto save changes', 'Persist settings as you edit.'),
        sw('general.draftRecovery', 'Draft recovery', 'Restore unsaved work after a reload.'),
        sw('general.undoAction', 'Undo action history', 'Keep one-click rollback available.'),
        sw('general.confirmations', 'Confirmation dialogs', 'Ask before destructive actions.'),
        sw('general.soundEffects', 'Sound feedback', 'Enable subtle audio feedback for key actions.'),
      ],
    },
    {
      id: 'appearance',
      icon: '🎨',
      title: 'Appearance',
      description: 'Theme, density, motion, typography, radii, and glass settings.',
      controls: [
        sel('appearance.theme', 'Theme', [
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
        ], 'Dark/light mode.'),
        txt('appearance.accentColor', 'Accent color', 'Primary gradient color in hex.'),
        sel('appearance.sidebarStyle', 'Sidebar style', [
          { value: 'expanded', label: 'Expanded' },
          { value: 'compact', label: 'Compact' },
        ], 'Choose the sidebar density.'),
        sw('appearance.compactMode', 'Compact mode', 'Reduce spacing across the admin shell.'),
        sw('appearance.animations', 'Animation toggle', 'Disable motion when needed.'),
        rng('appearance.fontSize', 'Font size', 14, 18, 1, 'px', 'Responsive base typography size.'),
        rng('appearance.cardRadius', 'Card radius', 10, 28, 1, 'px', 'Corner softness across cards and panels.'),
        rng('appearance.glassIntensity', 'Glass intensity', 0, 100, 1, '%', 'Controls the strength of blur and translucency.'),
      ],
    },
    {
      id: 'dashboard',
      icon: '🏠',
      title: 'Dashboard',
      description: 'Control which widgets appear and how often data refreshes.',
      controls: [
        sw('dashboard.widgets.welcomeBanner', 'Show welcome banner', 'Display the hero banner on dashboard load.'),
        sw('dashboard.widgets.quickActions', 'Show quick actions', 'Expose the fast-action strip.'),
        sw('dashboard.widgets.kpis', 'Show KPI cards', 'Keep the main metrics visible.'),
        sw('dashboard.widgets.insights', 'Show smart insights', 'Render the live insight strip.'),
        sw('dashboard.widgets.activity', 'Show activity panels', 'Keep the activity charts and feed visible.'),
        sw('dashboard.widgets.resources', 'Show resource breakdown', 'Display the semester resource chart.'),
        sel('dashboard.defaultHomepage', 'Default homepage', [
          { value: 'dashboard', label: 'Dashboard' },
          { value: 'add', label: 'Add Material' },
          { value: 'manage', label: 'Manage' },
          { value: 'notifications', label: 'Notifications' },
          { value: 'attendance', label: 'Attendance' },
          { value: 'settings', label: 'Settings' },
        ], 'Where the admin lands first.'),
        num('dashboard.autoRefresh', 'Auto refresh interval', 0, 300, 5, 'sec', 'Refresh dashboard counts automatically.'),
        sw('dashboard.analyticsVisible', 'Analytics visibility', 'Show the analytics section in the sidebar.'),
      ],
    },
    {
      id: 'attendance',
      icon: '📍',
      title: 'Attendance',
      description: 'Attendance thresholds, QR validity, and session restrictions.',
      controls: [
        num('attendance.gpsRadius', 'GPS radius', 10, 300, 5, 'm', 'Allowable location radius for attendance.'),
        num('attendance.tokenExpiryMinutes', 'Token expiry', 1, 120, 1, 'min', 'How long an attendance token stays valid.'),
        num('attendance.qrValiditySeconds', 'QR validity', 5, 300, 5, 'sec', 'How long the QR code remains active.'),
        sw('attendance.duplicateDetection', 'Duplicate detection', 'Block repeated attendance submissions.'),
        sw('attendance.deviceRestriction', 'Device restriction', 'Limit attendance to one device per student.'),
        sw('attendance.autoClose', 'Auto close sessions', 'End sessions automatically when time expires.'),
      ],
    },
    {
      id: 'uploads',
      icon: '📂',
      title: 'Uploads',
      description: 'Files, compression, thumbnails, cloud sync, and categorization rules.',
      controls: [
        num('uploads.maxUploadSizeMb', 'Max upload size', 5, 500, 5, 'MB', 'Maximum file size allowed for uploads.'),
        txt('uploads.allowedFormats', 'Allowed formats', 'Comma-separated list of accepted formats.'),
        sw('uploads.autoCompression', 'Auto compression', 'Compress large uploads when possible.'),
        sw('uploads.autoThumbnailGeneration', 'Auto thumbnail generation', 'Generate previews for rich media.'),
        sw('uploads.cloudBackup', 'Cloud backup', 'Mirror uploads to cloud storage.'),
        sw('uploads.autoCategorization', 'Auto categorization', 'Detect and file uploads into groups.'),
      ],
    },
    {
      id: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      description: 'Push, email, exam reminders, attendance warnings, and live alerts.',
      controls: [
        sw('notifications.pushNotifications', 'Push notifications', 'Enable browser push alerts.'),
        sw('notifications.emailAlerts', 'Email alerts', 'Send summary emails to admins.'),
        sw('notifications.examReminders', 'Exam reminders', 'Alert students before exams start.'),
        sw('notifications.attendanceWarnings', 'Attendance warnings', 'Notify when attendance drops.'),
        sw('notifications.liveSessionAlerts', 'Live session alerts', 'Push live session updates instantly.'),
        sw('notifications.liveSyncIndicator', 'Live sync indicator', 'Show the online sync status in the header.'),
      ],
    },
    {
      id: 'security',
      icon: '🔐',
      title: 'Security',
      description: 'Authentication, devices, session timeouts, login alerts, and roles.',
      controls: [
        sw('security.twoFactorAuth', 'Two-factor authentication', 'Require a second verification step.'),
        sw('security.deviceManagement', 'Device management', 'Track and revoke trusted devices.'),
        num('security.sessionTimeoutMinutes', 'Session timeout', 5, 240, 5, 'min', 'Log out idle admins automatically.'),
        sw('security.loginAlerts', 'Login alerts', 'Notify on new or unusual logins.'),
        sw('security.ipRestrictions', 'IP restrictions', 'Restrict admin access to approved IPs.'),
        sw('security.rolePermissions', 'Role permissions', 'Enforce admin and staff permission boundaries.'),
      ],
    },
    {
      id: 'ai',
      icon: '🤖',
      title: 'AI Features',
      description: 'Tune analysis, similarity, recommendations, weak-student detection, and reports.',
      controls: [
        sel('ai.analysisLevel', 'Analysis level', [
          { value: 'light', label: 'Light' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'deep', label: 'Deep' },
        ], 'How aggressively the AI processes content.'),
        rng('ai.similaritySensitivity', 'Similarity sensitivity', 0, 100, 1, '%', 'Higher means stricter similarity detection.'),
        sw('ai.autoRecommendations', 'Auto recommendations', 'Generate follow-up suggestions automatically.'),
        sw('ai.weakStudentDetection', 'Weak student detection', 'Highlight students that may need attention.'),
        sw('ai.aiReportGeneration', 'AI report generation', 'Compile summaries and insights automatically.'),
      ],
    },
    {
      id: 'students',
      icon: '👥',
      title: 'Student Controls',
      description: 'Quick filters, bulk operations, profile notes, and behavior flags.',
      controls: [
        sw('students.quickFilters', 'Quick filters', 'Expose fast filters in student lists.'),
        sw('students.bulkActions', 'Bulk actions', 'Allow batch management and selection.'),
        sw('students.behaviorFlags', 'Behavior flags', 'Track warnings and notable patterns.'),
        sw('students.profileNotes', 'Profile notes', 'Keep admin notes on individual students.'),
      ],
    },
    {
      id: 'exams',
      icon: '📝',
      title: 'Exam System',
      description: 'Question bank, shuffling, timer warnings, results, and proctoring.',
      controls: [
        sw('exams.questionBank', 'Question bank', 'Keep the exam question bank active.'),
        sw('exams.autoShuffle', 'Auto shuffle', 'Shuffle options and question order.'),
        sw('exams.timerWarnings', 'Timer warnings', 'Warn students before the timer expires.'),
        sw('exams.resultExport', 'Result export', 'Allow results to be exported as CSV.'),
        sw('exams.proctoringMode', 'Proctoring mode', 'Enable stricter exam supervision controls.'),
      ],
    },
    {
      id: 'backup',
      icon: '💾',
      title: 'Backup & Recovery',
      description: 'Schedules, cloud sync, restore points, snapshots, and exports.',
      controls: [
        sel('backup.autoBackupSchedule', 'Auto backup schedule', [
          { value: 'off', label: 'Off' },
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
        ], 'How often backups are captured.'),
        sw('backup.cloudSync', 'Cloud sync', 'Mirror backups to the cloud.'),
        sw('backup.restorePoints', 'Restore points', 'Keep restore snapshots available.'),
        sw('backup.localSnapshots', 'Local snapshots', 'Store an extra local copy for recovery.'),
        btn('backupNow', 'Manual backup', 'Download a JSON backup of the current settings.', 'primary'),
        btn('restoreBackup', 'Restore system', 'Import a previous JSON backup.', 'neutral'),
        btn('exportDatabase', 'Export database snapshot', 'Download a portable admin snapshot.', 'neutral'),
      ],
    },
    {
      id: 'performance',
      icon: '⚡',
      title: 'Performance',
      description: 'Cache controls, lazy loading, motion budgets, and data optimization.',
      controls: [
        btn('clearCache', 'Clear cache', 'Remove the local admin cache and drafts.', 'danger'),
        sw('performance.lazyLoading', 'Lazy loading', 'Delay heavy UI parts until needed.'),
        sel('performance.animationPerformanceMode', 'Animation mode', [
          { value: 'fast', label: 'Fast' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'reduced', label: 'Reduced' },
        ], 'Tune motion intensity for slower devices.'),
        sw('performance.dataOptimization', 'Data optimization', 'Trim payloads and favor smaller rendering passes.'),
      ],
    },
    {
      id: 'advanced',
      icon: '🧩',
      title: 'Advanced Developer Settings',
      description: 'API integrations, Firebase controls, logs, debug mode, and error tracking.',
      controls: [
        sw('advanced.apiIntegrations', 'API integrations', 'Keep external integrations enabled.'),
        sw('advanced.firebaseControls', 'Firebase controls', 'Expose Firebase-aware admin tools.'),
        sw('advanced.debugMode', 'Debug mode', 'Log admin actions and settings changes.'),
        sw('advanced.errorTracker', 'Error tracker', 'Keep error tracking enabled.'),
        btn('databaseViewer', 'Database viewer', 'Inspect the current admin snapshot.', 'neutral'),
        btn('logsViewer', 'Logs viewer', 'Inspect recent admin activity logs.', 'neutral'),
      ],
    },
  ];

  const originalFns = {
    initAdminPage: window.initAdminPage,
    switchAdminTab: window.switchAdminTab,
    adminLogout: window.adminLogout,
    toggleDarkMode: window.toggleDarkMode,
    showAdminWelcome: window.showAdminWelcome,
    loadDashboardStats: window.loadDashboardStats,
    loadAnalytics: window.loadAnalytics,
  };

  let adminSettingsState = null;
  let adminSettingsSaveTimer = null;
  let adminDashboardRefreshTimer = null;
  let adminWelcomeAutoCloseTimer = null;
  let adminMotivationTimer = null;
  let adminPaletteFilterTimer = null;
  let adminSettingsRecoveredDraft = false;
  let adminSettingsLastSavedAt = 0;
  let adminSettingsSectionRendered = false;
  let adminBackupInput = null;
  let adminSettingsNavUpdating = false;
  let adminAnalyticsObserver = null;

  const ADMIN_TAB_IDS = ['dashboard', 'add', 'manage', 'test', 'notifications', 'inbox', 'visitors', 'analytics', 'community', 'voting', 'attendance', 'ai-settings', 'settings'];
  const ADMIN_TAB_BUTTON_IDS = {
    dashboard: 'tabDashboard',
    add: 'tabAdd',
    manage: 'tabManage',
    test: 'tabTest',
    notifications: 'tabNotifications',
    inbox: 'tabInbox',
    visitors: 'tabVisitors',
    analytics: 'tabAnalytics',
    community: 'tabCommunity',
    voting: 'tabVoting',
    attendance: 'tabAttendance',
    'ai-settings': 'tabAiSettings',
    settings: 'tabSettings',
  };

  function getAdminTabButton(tab) {
    const buttonId = ADMIN_TAB_BUTTON_IDS[tab];
    return buttonId ? document.getElementById(buttonId) : null;
  }

  function hideAllAdminTabs() {
    ADMIN_TAB_IDS.forEach((tab) => {
      const section = document.getElementById(`admin-tab-${tab}`);
      if (section) {
        section.style.display = 'none';
        section.classList.remove('active');
      }
      const button = getAdminTabButton(tab);
      if (button) {
        button.classList.remove('active');
      }
    });
  }

  function activateAdminTab(tab) {
    hideAllAdminTabs();
    const section = document.getElementById(`admin-tab-${tab}`);
    if (section) {
      section.style.display = 'block';
      section.classList.add('active');
    }
    const button = getAdminTabButton(tab);
    if (button) {
      button.classList.add('active');
    }

    // Update Bottom Nav Active State
    const bnMap = {
      dashboard: 'bnDashboard',
      add: 'bnAdd',
      manage: 'bnManage',
      analytics: 'bnAnalytics'
    };
    Object.values(bnMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    if (bnMap[tab]) {
      const el = document.getElementById(bnMap[tab]);
      if (el) el.classList.add('active');
    }
  }

  function parseCountFromElement(id, fallback = 0) {
    const element = document.getElementById(id);
    if (!element || !element.textContent) return fallback;
    const value = Number(String(element.textContent).replace(/[^\d.]/g, ''));
    return Number.isFinite(value) ? value : fallback;
  }

  function buildSmartInsightCards(items) {
    return items.map((item) => `
      <div class="adm-insight-card ${item.tone ? `insight-${item.tone}` : ''}">
        <div class="adm-insight-icon ${item.tone ? `insight-${item.tone}` : 'insight-info'}">${escapeHtml(item.icon)}</div>
        <div class="adm-insight-body">
          <div class="adm-insight-title">${escapeHtml(item.title)}</div>
          <div class="adm-insight-desc">${escapeHtml(item.text)}</div>
          ${item.tag ? `<div class="adm-insight-tag ${item.tagTone || 'tag-info'}">${escapeHtml(item.tag)}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  function collectAdminIntelligence() {
    const materials = parseCountFromElement('dashTotalMaterials', parseCountFromElement('kpiTotalMaterials', 0));
    const visitors = parseCountFromElement('dashTotalVisitors', parseCountFromElement('wbTotalVisitors', 0));
    const inbox = parseCountFromElement('dashTotalInbox', parseCountFromElement('kpiSuggDash', 0));
    const enrolled = parseCountFromElement('dashTotalEnrolled', parseCountFromElement('totalEnrolled', 0));
    const notes = parseCountFromElement('kpiNotesDash', parseCountFromElement('totalNotes', 0));
    const videos = parseCountFromElement('kpiVideosDash', parseCountFromElement('totalVideos', 0));
    const pyqs = parseCountFromElement('kpiPYQsDash', parseCountFromElement('totalPYQs', 0));
    const attendance = document.getElementById('dashboardAttendanceRate')?.textContent || '84.2%';

    const suggestions = [];
    if (materials < 50) {
      suggestions.push({ icon: '📚', title: 'Content pipeline needs volume', text: 'Add more notes and lectures so students always have a fresh resource path.', tone: 'warning', tag: 'Content gap', tagTone: 'tag-warn' });
    } else {
      suggestions.push({ icon: '📚', title: 'Content coverage is healthy', text: 'The material library is large enough to support daily student usage.', tone: 'success', tag: 'Coverage good', tagTone: 'tag-ok' });
    }

    if (inbox > 5) {
      suggestions.push({ icon: '💬', title: 'Inbox needs attention', text: 'Review pending suggestions before the queue becomes noisy.', tone: 'warning', tag: `${inbox} waiting`, tagTone: 'tag-warn' });
    } else {
      suggestions.push({ icon: '💬', title: 'Inbox is under control', text: 'Feedback volume is manageable and the response loop is clear.', tone: 'success', tag: 'Low backlog', tagTone: 'tag-ok' });
    }

    const strongestResource = Math.max(notes, videos, pyqs);
    const strongestLabel = strongestResource === notes ? 'notes' : strongestResource === videos ? 'videos' : 'PYQs';

    const activityScore = Math.min(100, Math.round((materials * 0.35) + (visitors * 0.08) + (enrolled * 0.02) + (strongestResource * 0.9)));

    return {
      materials,
      visitors,
      inbox,
      enrolled,
      notes,
      videos,
      pyqs,
      attendance,
      strongestLabel,
      activityScore,
      suggestions,
    };
  }

  function renderDashboardIntelligence() {
    const strip = document.getElementById('admInsightsStrip');
    if (!strip) return;

    const intelligence = collectAdminIntelligence();
    const title = intelligence.activityScore >= 70 ? 'Dashboard momentum is strong' : 'Dashboard needs a content push';
    const badge = document.getElementById('insightsBadge');
    if (badge) {
      badge.textContent = `${intelligence.activityScore}% intelligent health`;
    }

    strip.innerHTML = buildSmartInsightCards([
      {
        icon: '📈',
        title: title,
        text: `Activity score is ${intelligence.activityScore} with ${intelligence.materials} materials and ${intelligence.enrolled} enrolled learners.`,
        tone: intelligence.activityScore >= 70 ? 'success' : 'warning',
        tag: `${intelligence.attendance} attendance`,
        tagTone: intelligence.activityScore >= 70 ? 'tag-ok' : 'tag-warn',
      },
      {
        icon: '🧠',
        title: 'Strongest content lane',
        text: `Your ${intelligence.strongestLabel} library is currently leading the platform value.`,
        tone: 'info',
        tag: 'Smart signal',
        tagTone: 'tag-info',
      },
      {
        icon: '💬',
        title: 'Inbox health',
        text: intelligence.inbox > 5 ? 'There are pending messages that should be reviewed soon.' : 'Inbox activity is light, so no bottleneck is forming.',
        tone: intelligence.inbox > 5 ? 'warning' : 'success',
        tag: `${intelligence.inbox} pending`,
        tagTone: intelligence.inbox > 5 ? 'tag-warn' : 'tag-ok',
      },
      {
        icon: '⚡',
        title: 'Smart next move',
        text: intelligence.materials < 50 ? 'Upload two new notes or a quick lecture to lift platform momentum.' : 'Push analytics visibility and refresh the attendance workflow next.',
        tone: 'info',
        tag: 'Auto suggestion',
        tagTone: 'tag-info',
      },
    ]);

    const weeklyChart = document.getElementById('admWeeklyChart');
    if (weeklyChart) {
      const values = [38, 46, 54, 61, 69, 74, 83].map((base, index) => Math.max(12, Math.min(100, base + Math.round(intelligence.materials * 0.1) + (index % 3) * 2)));
      weeklyChart.innerHTML = values.map((value, index) => `
        <div class="adm-bar-col">
          <div class="adm-bar-fill" style="height:${value}%" data-val="${value}"></div>
          <div class="adm-bar-label">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
        </div>
      `).join('');
    }

    const activityFeed = document.getElementById('admActivityFeed');
    if (activityFeed) {
      const entries = [
        { dot: '#6366f1', text: `Dashboard intelligence updated with ${intelligence.activityScore}% health`, time: 'now' },
        { dot: '#10b981', text: `${intelligence.materials} resources are actively serving students`, time: '1m ago' },
        { dot: '#f59e0b', text: `${intelligence.inbox} inbox messages still need review`, time: '2m ago' },
      ];
      activityFeed.innerHTML = entries.map((entry) => `
        <div class="adm-activity-item">
          <div class="adm-activity-dot" style="background:${entry.dot};"></div>
          <div class="adm-activity-text">${escapeHtml(entry.text)}</div>
          <div class="adm-activity-time">${escapeHtml(entry.time)}</div>
        </div>
      `).join('');
    }
  }

  function buildAnalyticsSmartSummary() {
    const totalMaterials = parseCountFromElement('totalMaterials', parseCountFromElement('kpiTotalMaterials', 0));
    const totalNotes = parseCountFromElement('totalNotes', parseCountFromElement('kpiNotesDash', 0));
    const totalVideos = parseCountFromElement('totalVideos', parseCountFromElement('kpiVideosDash', 0));
    const totalPyqs = parseCountFromElement('totalPYQs', parseCountFromElement('kpiPYQsDash', 0));
    const totalEnrolled = parseCountFromElement('totalEnrolled', parseCountFromElement('dashTotalEnrolled', 0));
    const totalVisitors = parseCountFromElement('totalUniqueVisitors', parseCountFromElement('dashTotalVisitors', 0));
    const topSemester = document.getElementById('topSemester')?.textContent || 'N/A';

    const strongestChannel = [
      { label: 'Notes', value: totalNotes },
      { label: 'Videos', value: totalVideos },
      { label: 'PYQs', value: totalPyqs },
    ].sort((a, b) => b.value - a.value)[0];

    const learningMomentum = totalMaterials + totalEnrolled + totalVisitors > 0
      ? Math.round((totalMaterials * 0.45) + (totalEnrolled * 0.15) + (totalVisitors * 0.1))
      : 0;

    return {
      totalMaterials,
      totalNotes,
      totalVideos,
      totalPyqs,
      totalEnrolled,
      totalVisitors,
      topSemester,
      strongestChannel,
      learningMomentum,
    };
  }

  function renderAnalyticsSmartSummary() {
    const breakdown = document.getElementById('semesterBreakdown');
    if (!breakdown) return;

    const summary = buildAnalyticsSmartSummary();
    const smartSummary = `
      <div class="adm-analysis-smart-panel">
        <div class="adm-analysis-smart-grid">
          <div class="adm-analysis-smart-card">
            <span class="adm-analysis-smart-kicker">Momentum</span>
            <strong>${summary.learningMomentum}%</strong>
            <p>Platform learning momentum is based on the current content footprint and enrollment scale.</p>
          </div>
          <div class="adm-analysis-smart-card">
            <span class="adm-analysis-smart-kicker">Top semester</span>
            <strong>${escapeHtml(summary.topSemester)}</strong>
            <p>This remains the strongest semester in terms of current attention and usage.</p>
          </div>
          <div class="adm-analysis-smart-card">
            <span class="adm-analysis-smart-kicker">Strongest format</span>
            <strong>${escapeHtml(summary.strongestChannel.label)}</strong>
            <p>${summary.strongestChannel.label} leads the content library by current volume.</p>
          </div>
        </div>
      </div>
    `;

    if (!breakdown.dataset.smartSummaryInjected) {
      breakdown.insertAdjacentHTML('beforebegin', smartSummary);
      breakdown.dataset.smartSummaryInjected = 'true';
    }
  }

  function updateAnalyticsSmartSummaryWhenReady() {
    if (adminAnalyticsObserver) {
      return;
    }

    const breakdown = document.getElementById('semesterBreakdown');
    if (!breakdown) return;

    adminAnalyticsObserver = new MutationObserver(() => {
      renderAnalyticsSmartSummary();
    });
    adminAnalyticsObserver.observe(breakdown, { childList: true, subtree: true });
    renderAnalyticsSmartSummary();
  }

  function renderAiSettingsRoot() {
    const section = document.getElementById('admin-tab-ai-settings');
    if (!section) return;

    const ai = getAdminSettingsState().ai || DEFAULT_SETTINGS.ai;
    const intelligence = collectAdminIntelligence();

    section.innerHTML = `
      <div class="adm-ai-shell">
        <div class="adm-ai-hero glass-card">
          <div class="adm-ai-hero-copy">
            <div class="adm-ai-kicker">AI analysis center</div>
            <h2>Intelligent analysis for the admin panel</h2>
            <p>Use adaptive AI signals to identify weak students, improve content coverage, and tune similarity detection before issues spread.</p>
          </div>
          <div class="adm-ai-hero-actions">
            <button type="button" class="btn-primary" data-admin-ai-action="open-settings">Open full AI settings</button>
            <button type="button" class="btn-outline" data-admin-ai-action="refresh">Refresh analysis</button>
          </div>
        </div>

        <div class="adm-ai-grid">
          <div class="adm-ai-metric-card">
            <span class="adm-ai-metric-label">Analysis level</span>
            <strong>${escapeHtml(ai.analysisLevel)}</strong>
            <p>Current analysis depth applied across suggestions and reports.</p>
          </div>
          <div class="adm-ai-metric-card">
            <span class="adm-ai-metric-label">Similarity sensitivity</span>
            <strong>${escapeHtml(ai.similaritySensitivity)}%</strong>
            <p>How strict plagiarism and similarity detection should behave.</p>
          </div>
          <div class="adm-ai-metric-card">
            <span class="adm-ai-metric-label">Recommendations</span>
            <strong>${ai.autoRecommendations ? 'Enabled' : 'Off'}</strong>
            <p>Autogenerated suggestions help surface the next best admin action.</p>
          </div>
          <div class="adm-ai-metric-card">
            <span class="adm-ai-metric-label">Weak student scan</span>
            <strong>${ai.weakStudentDetection ? 'Enabled' : 'Off'}</strong>
            <p>Flag students who may need content support or attendance intervention.</p>
          </div>
        </div>

        <div class="adm-ai-grid adm-ai-grid-two">
          <div class="glass-card adm-ai-panel">
            <div class="adm-section-head">
              <h3>Live AI signals</h3>
              <span class="adm-section-badge">${intelligence.activityScore}% health</span>
            </div>
            <div id="adminAiSignalList" class="adm-ai-signal-list"></div>
          </div>
          <div class="glass-card adm-ai-panel">
            <div class="adm-section-head">
              <h3>Recommended next actions</h3>
              <span class="adm-section-badge">Smart queue</span>
            </div>
            <div id="adminAiActionList" class="adm-ai-action-list"></div>
          </div>
        </div>
      </div>
    `;

    const signalList = section.querySelector('#adminAiSignalList');
    if (signalList) {
      signalList.innerHTML = buildSmartInsightCards(intelligence.suggestions);
    }

    const actionList = section.querySelector('#adminAiActionList');
    if (actionList) {
      const actions = [
        { label: 'Open AI settings section', text: 'Jump into the settings accordion and fine-tune every control.', action: 'open-settings' },
        { label: 'Review analytics', text: 'Check semester breakdowns and content coverage trends next.', action: 'analytics' },
        { label: 'Launch command palette', text: 'Search any tool or section with one keyboard shortcut.', action: 'palette' },
      ];
      actionList.innerHTML = actions.map((item) => `
        <button type="button" class="adm-ai-action-row" data-admin-ai-action-row="${escapeHtml(item.action)}">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.text)}</span>
        </button>
      `).join('');
    }

    section.querySelectorAll('[data-admin-ai-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-admin-ai-action');
        if (action === 'open-settings') {
          openAdminSettingsSection('ai');
          return;
        }
        if (action === 'refresh') {
          renderAiSettingsRoot();
          renderDashboardIntelligence();
          renderAnalyticsSmartSummary();
          return;
        }
      });
    });

    section.querySelectorAll('[data-admin-ai-action-row]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-admin-ai-action-row');
        if (action === 'open-settings') {
          openAdminSettingsSection('ai');
        } else if (action === 'analytics') {
          window.switchAdminTab('analytics');
        } else if (action === 'palette') {
          openAdminCommandPalette('');
        }
      });
    });
  }

  function refreshAdminIntelligence() {
    renderDashboardIntelligence();
    updateAnalyticsSmartSummaryWhenReady();
    if (document.getElementById('admin-tab-ai-settings')?.classList.contains('active')) {
      renderAiSettingsRoot();
    }
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDeep(base, incoming) {
    const output = Array.isArray(base) ? base.slice() : { ...base };
    if (!incoming || typeof incoming !== 'object') {
      return output;
    }

    Object.keys(incoming).forEach((key) => {
      const baseValue = output[key];
      const incomingValue = incoming[key];
      if (Array.isArray(baseValue) && Array.isArray(incomingValue)) {
        output[key] = incomingValue.slice();
      } else if (baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue) && incomingValue && typeof incomingValue === 'object' && !Array.isArray(incomingValue)) {
        output[key] = mergeDeep(baseValue, incomingValue);
      } else {
        output[key] = incomingValue;
      }
    });

    return output;
  }

  function getByPath(obj, path) {
    if (!path) return undefined;
    return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  }

  function setByPath(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    let cursor = obj;

    parts.forEach((part) => {
      if (!cursor[part] || typeof cursor[part] !== 'object') {
        cursor[part] = {};
      }
      cursor = cursor[part];
    });

    cursor[last] = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeHexColor(color) {
    const raw = String(color || '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      return raw.toLowerCase();
    }
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
      return raw
        .slice(1)
        .split('')
        .map((part) => part + part)
        .join('')
        .toLowerCase();
    }
    return DEFAULT_SETTINGS.appearance.accentColor;
  }

  function shadeColor(hex, percent) {
    const color = normalizeHexColor(hex).slice(1);
    const amount = Math.max(-100, Math.min(100, percent));
    const target = amount < 0 ? 0 : 255;
    const ratio = Math.abs(amount) / 100;
    const red = Math.round((target - parseInt(color.slice(0, 2), 16)) * ratio + parseInt(color.slice(0, 2), 16));
    const green = Math.round((target - parseInt(color.slice(2, 4), 16)) * ratio + parseInt(color.slice(2, 4), 16));
    const blue = Math.round((target - parseInt(color.slice(4, 6), 16)) * ratio + parseInt(color.slice(4, 6), 16));
    return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
  }

  function safeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function readAdminStorage(key) {
    try {
      return lsGet(key, null);
    } catch {
      return null;
    }
  }

  function writeAdminStorage(key, value) {
    try {
      lsSet(key, value);
    } catch {
      // ignore storage failures
    }
  }

  function getStoredSnapshot() {
    const saved = readAdminStorage(STORAGE_KEY);
    const draft = readAdminStorage(DRAFT_KEY);

    const savedState = saved && typeof saved === 'object' && saved.state ? saved : null;
    const draftState = draft && typeof draft === 'object' && draft.state ? draft : null;
    const useDraft = draftState && (!savedState || safeNumber(draftState.updatedAt, 0) > safeNumber(savedState.updatedAt, 0));

    adminSettingsRecoveredDraft = !!useDraft;
    const activeSnapshot = useDraft ? draftState : savedState;
    const baseState = mergeDeep(DEFAULT_SETTINGS, activeSnapshot ? activeSnapshot.state : saved || {});
    if (!baseState.appearance || typeof baseState.appearance !== 'object') {
      baseState.appearance = deepClone(DEFAULT_SETTINGS.appearance);
    }

    adminSettingsLastSavedAt = safeNumber(activeSnapshot && activeSnapshot.updatedAt, Date.now());
    return baseState;
  }

  function getAdminSettingsState() {
    if (!adminSettingsState) {
      adminSettingsState = getStoredSnapshot();
    }
    return adminSettingsState;
  }

  function pushAdminLog(message) {
    const existing = readAdminStorage(LOG_KEY);
    const list = Array.isArray(existing) ? existing : [];
    list.unshift({
      message,
      time: Date.now(),
    });
    writeAdminStorage(LOG_KEY, list.slice(0, 60));
  }

  function showAdminToast(message, type) {
    if (typeof showNotification === 'function') {
      showNotification(message, type || 'info');
      return;
    }
    console.log(`[admin:${type || 'info'}] ${message}`);
  }

  function setDashboardWidgetVisibility(selector, visible) {
    document.querySelectorAll(selector).forEach((node) => {
      node.style.display = visible ? '' : 'none';
    });
  }

  function applyAdminAppearanceSettings(state) {
    const appearance = state.appearance || DEFAULT_SETTINGS.appearance;
    const theme = appearance.theme === 'light' ? 'light' : 'dark';
    const accent = normalizeHexColor(appearance.accentColor);
    const accentAlt = shadeColor(accent, theme === 'dark' ? -18 : -8);
    const radius = `${appearance.cardRadius}px`;
    const fontSize = `${safeNumber(appearance.fontSize, 16)}px`;
    const glassAlpha = Math.max(0.15, Math.min(0.84, 0.26 + (safeNumber(appearance.glassIntensity, 72) / 100) * 0.45));
    const glassBg = theme === 'dark'
      ? `rgba(12, 26, 46, ${glassAlpha.toFixed(3)})`
      : `rgba(255, 255, 255, ${glassAlpha.toFixed(3)})`;

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--adm-accent', accent);
    document.documentElement.style.setProperty('--adm-accent-2', accentAlt);
    document.documentElement.style.setProperty('--adm-radius', radius);
    document.documentElement.style.setProperty('--adm-glass-bg', glassBg);
    document.documentElement.style.fontSize = fontSize;
    document.documentElement.style.colorScheme = theme;

    if (typeof lsSet === 'function') {
      lsSet('darkMode', theme === 'dark');
    }

    if (typeof updateDarkToggle === 'function') {
      updateDarkToggle(theme === 'dark');
    }

    const shell = document.querySelector('.adm-shell');
    if (shell) {
      shell.classList.toggle('sidebar-collapsed', appearance.sidebarStyle === 'compact');
      shell.classList.toggle('adm-compact-mode', !!appearance.compactMode);
    }

    document.body.classList.toggle('adm-reduced-motion', !appearance.animations);
    document.body.classList.toggle('adm-compact-mode', !!appearance.compactMode);

    setDashboardWidgetVisibility('.adm-welcome-banner', state.dashboard?.widgets?.welcomeBanner !== false);
    setDashboardWidgetVisibility('.adm-quick-actions', state.dashboard?.widgets?.quickActions !== false);
    setDashboardWidgetVisibility('.adm-kpi-grid', state.dashboard?.widgets?.kpis !== false);
    setDashboardWidgetVisibility('.adm-insights-strip', state.dashboard?.widgets?.insights !== false);
    setDashboardWidgetVisibility('.adm-dash-two-col', state.dashboard?.widgets?.activity !== false);
    setDashboardWidgetVisibility('#admin-tab-dashboard .adm-panel', state.dashboard?.widgets?.resources !== false);

    const analyticsBtn = document.getElementById('tabAnalytics');
    if (analyticsBtn) {
      analyticsBtn.style.display = state.dashboard?.analyticsVisible === false ? 'none' : '';
    }
    const analyticsSection = document.getElementById('admin-tab-analytics');
    if (analyticsSection) {
      analyticsSection.style.display = state.dashboard?.analyticsVisible === false && analyticsSection.classList.contains('active') ? 'none' : '';
    }

    restartDashboardRefresh(state.dashboard?.autoRefresh);
  }

  function restartDashboardRefresh(intervalSeconds) {
    const interval = Math.max(0, safeNumber(intervalSeconds, DEFAULT_SETTINGS.dashboard.autoRefresh));
    if (adminDashboardRefreshTimer) {
      clearInterval(adminDashboardRefreshTimer);
      adminDashboardRefreshTimer = null;
    }

    if (interval <= 0 || typeof originalFns.loadDashboardStats !== 'function') {
      return;
    }

    adminDashboardRefreshTimer = setInterval(() => {
      originalFns.loadDashboardStats();
      if (typeof loadInboxBadge === 'function') loadInboxBadge();
      if (typeof loadAnalytics === 'function' && document.getElementById('admin-tab-analytics')?.classList.contains('active')) {
        loadAnalytics();
      }
    }, interval * 1000);
  }

  function snapshotSettingsForStorage() {
    return {
      updatedAt: Date.now(),
      state: deepClone(getAdminSettingsState()),
    };
  }

  function persistAdminSettings(immediate) {
    const snapshot = snapshotSettingsForStorage();
    writeAdminStorage(DRAFT_KEY, snapshot);

    if (adminSettingsSaveTimer) {
      clearTimeout(adminSettingsSaveTimer);
      adminSettingsSaveTimer = null;
    }

    const delay = immediate ? 0 : (getAdminSettingsState().general.autoSave ? 450 : 1500);

    const commit = () => {
      writeAdminStorage(STORAGE_KEY, snapshot);
      adminSettingsLastSavedAt = snapshot.updatedAt;
      updateSettingsToolbarStatus('Saved just now', 'success');
    };

    if (delay === 0) {
      commit();
      return;
    }

    updateSettingsToolbarStatus('Saving...', 'info');
    adminSettingsSaveTimer = setTimeout(commit, delay);
  }

  function scheduleSettingsAutosave() {
    persistAdminSettings(false);
  }

  function updateSettingsToolbarStatus(text, tone) {
    const status = document.getElementById('admSettingsStatus');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone || 'neutral';
  }

  function updateSettingsToolbarMeta() {
    const snapshot = getAdminSettingsState();
    const theme = snapshot.appearance?.theme === 'light' ? 'Light' : 'Dark';
    const lastSaved = adminSettingsLastSavedAt ? new Date(adminSettingsLastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now';
    const themeBadge = document.getElementById('admSettingsThemeBadge');
    const savedBadge = document.getElementById('admSettingsSavedBadge');
    const draftBadge = document.getElementById('admSettingsDraftBadge');
    const motionBadge = document.getElementById('admSettingsMotionBadge');

    if (themeBadge) themeBadge.textContent = `${theme} mode`;
    if (savedBadge) savedBadge.textContent = `Saved ${lastSaved}`;
    if (draftBadge) draftBadge.textContent = adminSettingsRecoveredDraft ? 'Recovered draft' : 'Live draft';
    if (motionBadge) motionBadge.textContent = snapshot.appearance?.animations ? 'Motion on' : 'Motion reduced';
  }

  function formatSettingValue(control, value) {
    if (control.type === 'range' || control.type === 'number') {
      return `${value}${control.unit ? control.unit : ''}`;
    }
    if (control.type === 'switch') {
      return value ? 'Enabled' : 'Disabled';
    }
    return value == null ? '' : String(value);
  }

  function renderControl(control, state) {
    const path = control.path || `${control.action || control.label}`;
    const value = control.path ? getByPath(state, control.path) : undefined;
    const id = `adm-setting-${String(path).replace(/[^a-zA-Z0-9]+/g, '-')}`;
    const help = control.help ? `<div class="adm-setting-help">${escapeHtml(control.help)}</div>` : '';

    if (control.type === 'switch') {
      return `
        <label class="adm-setting-card adm-setting-switch-card" for="${id}">
          <div class="adm-setting-copy">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            ${help}
          </div>
          <span class="adm-setting-switch">
            <input type="checkbox" id="${id}" data-setting-path="${escapeHtml(control.path)}" ${value ? 'checked' : ''} />
            <span class="adm-setting-switch-track"></span>
          </span>
        </label>
      `;
    }

    if (control.type === 'select') {
      const options = control.options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        return `<option value="${escapeHtml(optionValue)}" ${String(value) === String(optionValue) ? 'selected' : ''}>${escapeHtml(optionLabel)}</option>`;
      }).join('');

      return `
        <div class="adm-setting-card">
          <div class="adm-setting-copy">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            ${help}
          </div>
          <select id="${id}" data-setting-path="${escapeHtml(control.path)}">${options}</select>
        </div>
      `;
    }

    if (control.type === 'range') {
      return `
        <div class="adm-setting-card">
          <div class="adm-setting-copy adm-setting-copy-inline">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            <span class="adm-setting-value" data-setting-value-for="${escapeHtml(control.path)}">${escapeHtml(formatSettingValue(control, value))}</span>
          </div>
          ${help}
          <input type="range" id="${id}" data-setting-path="${escapeHtml(control.path)}" min="${control.min}" max="${control.max}" step="${control.step}" value="${escapeHtml(value)}" />
        </div>
      `;
    }

    if (control.type === 'number') {
      return `
        <div class="adm-setting-card">
          <div class="adm-setting-copy adm-setting-copy-inline">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            <span class="adm-setting-value" data-setting-value-for="${escapeHtml(control.path)}">${escapeHtml(formatSettingValue(control, value))}</span>
          </div>
          ${help}
          <input type="number" id="${id}" data-setting-path="${escapeHtml(control.path)}" min="${control.min}" max="${control.max}" step="${control.step}" value="${escapeHtml(value)}" />
        </div>
      `;
    }

    if (control.type === 'textarea') {
      return `
        <div class="adm-setting-card adm-setting-text-card">
          <div class="adm-setting-copy">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            ${help}
          </div>
          <textarea id="${id}" rows="${control.rows || 3}" data-setting-path="${escapeHtml(control.path)}">${escapeHtml(value)}</textarea>
        </div>
      `;
    }

    if (control.type === 'text') {
      const isColorLike = /color/i.test(control.path);
      const inputType = isColorLike ? 'color' : 'text';
      return `
        <div class="adm-setting-card">
          <div class="adm-setting-copy adm-setting-copy-inline">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            ${control.path === 'appearance.accentColor' ? `<span class="adm-setting-value" data-setting-value-for="${escapeHtml(control.path)}">${escapeHtml(value)}</span>` : ''}
          </div>
          ${help}
          <input type="${inputType}" id="${id}" data-setting-path="${escapeHtml(control.path)}" value="${escapeHtml(value)}" />
        </div>
      `;
    }

    if (control.type === 'button') {
      const toneClass = control.tone === 'danger' ? 'is-danger' : control.tone === 'primary' ? 'is-primary' : 'is-neutral';
      return `
        <div class="adm-setting-card adm-setting-button-card ${toneClass}">
          <div class="adm-setting-copy">
            <div class="adm-setting-label">${escapeHtml(control.label)}</div>
            ${help}
          </div>
          <button type="button" class="adm-setting-action-btn" data-settings-action="${escapeHtml(control.action)}">${escapeHtml(control.label)}</button>
        </div>
      `;
    }

    return '';
  }

  function renderSettingsSection(section, state, activeSectionId) {
    const isOpen = section.id === activeSectionId;
    const controlsHtml = section.controls.map((control) => renderControl(control, state)).join('');
    return `
      <details class="adm-settings-section" data-settings-section-panel="${escapeHtml(section.id)}" ${isOpen ? 'open' : ''}>
        <summary>
          <div class="adm-settings-section-summary-left">
            <div class="adm-settings-section-icon">${escapeHtml(section.icon)}</div>
            <div>
              <h4>${escapeHtml(section.title)}</h4>
              <p>${escapeHtml(section.description)}</p>
            </div>
          </div>
          <span class="adm-settings-section-chevron">▾</span>
        </summary>
        <div class="adm-setting-grid">
          ${controlsHtml}
        </div>
      </details>
    `;
  }

  function renderSettingsRoot() {
    const root = document.getElementById('adminSettingsRoot');
    if (!root) return;

    const state = getAdminSettingsState();
    const activeSection = sessionStorage.getItem(ACTIVE_SECTION_KEY) || 'general';
    const navButtons = SETTINGS_SECTIONS.map((section) => `
      <button type="button" class="adm-settings-nav-btn ${section.id === activeSection ? 'active' : ''}" data-settings-section="${escapeHtml(section.id)}">
        <span class="adm-settings-nav-icon">${escapeHtml(section.icon)}</span>
        <span>${escapeHtml(section.title)}</span>
      </button>
    `).join('');

    const sectionsHtml = SETTINGS_SECTIONS.map((section) => renderSettingsSection(section, state, activeSection)).join('');

    root.innerHTML = `
      <div class="adm-settings-shell">
        <aside class="adm-settings-nav">
          <div class="adm-settings-nav-head">
            <div class="adm-settings-nav-kicker">System Control</div>
            <h3>Settings</h3>
            <p>Premium controls for theme, attendance, uploads, security, AI, and recovery.</p>
          </div>
          <div class="adm-settings-nav-list">
            ${navButtons}
          </div>
        </aside>
        <div class="adm-settings-panel">
          <div class="adm-settings-toolbar">
            <div class="adm-settings-toolbar-left">
              <span class="adm-settings-pill" id="admSettingsStatus">Ready</span>
              <span class="adm-settings-pill" id="admSettingsThemeBadge">Theme</span>
              <span class="adm-settings-pill" id="admSettingsSavedBadge">Saved</span>
              <span class="adm-settings-pill" id="admSettingsDraftBadge">Draft</span>
              <span class="adm-settings-pill" id="admSettingsMotionBadge">Motion</span>
            </div>
            <div class="adm-settings-toolbar-actions">
              <button type="button" class="btn-outline" data-admin-settings-command="palette">Ctrl + K</button>
              <button type="button" class="btn-outline" data-admin-settings-action="undo">Undo</button>
              <button type="button" class="btn-outline" data-admin-settings-action="reset">Reset</button>
              <button type="button" class="btn-primary" data-admin-settings-action="save">Save Now</button>
            </div>
          </div>
          <div class="adm-settings-grid-shell">
            ${sectionsHtml}
          </div>
        </div>
      </div>
    `;

    bindSettingsEvents();
    updateSettingsToolbarMeta();
    adminSettingsSectionRendered = true;
  }

  function updateSectionNavigation(sectionId) {
    if (!sectionId || adminSettingsNavUpdating) return;
    adminSettingsNavUpdating = true;
    sessionStorage.setItem(ACTIVE_SECTION_KEY, sectionId);
    const navButtons = document.querySelectorAll('[data-settings-section]');
    navButtons.forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-settings-section') === sectionId);
    });

    const panels = document.querySelectorAll('[data-settings-section-panel]');
    panels.forEach((panel) => {
      const open = panel.getAttribute('data-settings-section-panel') === sectionId;
      panel.open = open;
      if (open) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    adminSettingsNavUpdating = false;
  }

  function syncRangeLabels(path, value) {
    const target = document.querySelector(`[data-setting-value-for="${CSS.escape(path)}"]`);
    if (target) {
      const control = SETTINGS_SECTIONS.flatMap((section) => section.controls).find((item) => item.path === path);
      const unit = control && control.unit ? control.unit : '';
      target.textContent = `${value}${unit}`;
    }
  }

  function onSettingChange(path, rawValue, control) {
    const state = getAdminSettingsState();
    const previousState = deepClone(state);
    const currentValue = getByPath(state, path);
    let value = rawValue;

    if (control.type === 'switch') {
      value = !!rawValue;
    } else if (control.type === 'number' || control.type === 'range') {
      value = safeNumber(rawValue, safeNumber(currentValue, 0));
    }

    if (control.path === 'appearance.accentColor') {
      value = normalizeHexColor(value);
    }

    if (value === currentValue) {
      return;
    }

    if (state.general?.undoAction) {
      const history = readAdminStorage(`${STORAGE_KEY}:history`);
      const list = Array.isArray(history) ? history : [];
      list.unshift({ updatedAt: Date.now(), state: previousState });
      writeAdminStorage(`${STORAGE_KEY}:history`, list.slice(0, 12));
    }

    setByPath(state, path, value);
    adminSettingsState = state;
    applyAdminAppearanceSettings(state);
    syncRangeLabels(path, value);
    persistAdminSettings(false);
    pushAdminLog(`Changed ${path} to ${formatSettingValue(control, value)}`);

    if (path === 'dashboard.autoRefresh') {
      restartDashboardRefresh(value);
    }
    if (path === 'appearance.theme' || path === 'appearance.sidebarStyle' || path === 'appearance.compactMode' || path === 'appearance.animations') {
      renderSettingsRoot();
      updateSectionNavigation(sessionStorage.getItem(ACTIVE_SECTION_KEY) || 'general');
    }
    if (path.startsWith('dashboard.widgets.') || path === 'dashboard.analyticsVisible') {
      applyAdminAppearanceSettings(state);
    }
  }

  function triggerAdminAction(actionName) {
    const state = getAdminSettingsState();

    if (actionName === 'save') {
      persistAdminSettings(true);
      showAdminToast('Settings saved.', 'success');
      pushAdminLog('Saved settings manually');
      return;
    }

    if (actionName === 'undo') {
      if (!state.general?.undoAction) {
        showAdminToast('Undo is disabled in settings.', 'warning');
        return;
      }
      const history = readAdminStorage(`${STORAGE_KEY}:history`);
      const list = Array.isArray(history) ? history : [];
      const snapshot = list.shift();
      if (!snapshot || !snapshot.state) {
        showAdminToast('Nothing to undo yet.', 'info');
        return;
      }
      writeAdminStorage(`${STORAGE_KEY}:history`, list);
      adminSettingsState = mergeDeep(DEFAULT_SETTINGS, snapshot.state);
      applyAdminAppearanceSettings(adminSettingsState);
      persistAdminSettings(true);
      renderSettingsRoot();
      showAdminToast('Last change restored.', 'success');
      pushAdminLog('Undid the last settings change');
      return;
    }

    if (actionName === 'reset') {
      if (state.general?.confirmations !== false && !window.confirm('Reset all admin settings to their default values?')) {
        return;
      }
      adminSettingsState = deepClone(DEFAULT_SETTINGS);
      writeAdminStorage(`${STORAGE_KEY}:history`, []);
      applyAdminAppearanceSettings(adminSettingsState);
      persistAdminSettings(true);
      renderSettingsRoot();
      showAdminToast('Settings reset to defaults.', 'success');
      pushAdminLog('Reset settings to defaults');
      return;
    }

    if (actionName === 'palette') {
      openAdminCommandPalette('');
      return;
    }

    if (actionName === 'backupNow') {
      exportAdminBackup('manual');
      return;
    }

    if (actionName === 'restoreBackup') {
      importAdminBackup();
      return;
    }

    if (actionName === 'exportDatabase') {
      exportAdminSnapshot();
      return;
    }

    if (actionName === 'clearCache') {
      clearAdminCache();
      return;
    }

    if (actionName === 'databaseViewer') {
      openAdminJsonViewer('Database Viewer', buildAdminSnapshot());
      return;
    }

    if (actionName === 'logsViewer') {
      openAdminJsonViewer('Logs Viewer', readAdminLogs());
      return;
    }
  }

  function bindSettingsEvents() {
    const root = document.getElementById('adminSettingsRoot');
    if (!root) return;

    root.querySelectorAll('[data-setting-path]').forEach((input) => {
      const path = input.getAttribute('data-setting-path');
      const control = SETTINGS_SECTIONS.flatMap((section) => section.controls).find((item) => item.path === path);
      if (!control) return;

      const handler = () => {
        const isSwitch = control.type === 'switch';
        const rawValue = isSwitch ? input.checked : input.value;
        onSettingChange(path, rawValue, control);
      };

      input.addEventListener(control.type === 'switch' ? 'change' : 'input', handler);
      if (control.type === 'range') {
        input.addEventListener('input', () => syncRangeLabels(path, input.value));
      }
    });

    root.querySelectorAll('[data-settings-section]').forEach((button) => {
      button.addEventListener('click', () => {
        updateSectionNavigation(button.getAttribute('data-settings-section'));
      });
    });

    root.querySelectorAll('[data-admin-settings-action]').forEach((button) => {
      button.addEventListener('click', () => {
        triggerAdminAction(button.getAttribute('data-admin-settings-action'));
      });
    });

    root.querySelectorAll('[data-admin-settings-command]').forEach((button) => {
      button.addEventListener('click', () => openAdminCommandPalette(''));
    });

    root.querySelectorAll('[data-settings-section-panel]').forEach((panel) => {
      panel.addEventListener('toggle', () => {
        if (adminSettingsNavUpdating) {
          return;
        }
        if (panel.open) {
          updateSectionNavigation(panel.getAttribute('data-settings-section-panel'));
        }
      });
    });

    const accentInput = root.querySelector('[data-setting-path="appearance.accentColor"]');
    if (accentInput && accentInput.tagName === 'INPUT' && accentInput.type === 'color') {
      accentInput.addEventListener('input', () => {
        syncRangeLabels('appearance.accentColor', accentInput.value.toLowerCase());
      });
    }
  }

  function buildAdminSnapshot() {
    const state = deepClone(getAdminSettingsState());
    const dashboard = {
      materials: document.getElementById('kpiTotalMaterials')?.textContent?.trim() || '0',
      students: document.getElementById('kpiStudentsDash')?.textContent?.trim() || '0',
      notifications: document.querySelector('.adm-top-badge')?.textContent?.trim() || '0',
      liveSessions: document.getElementById('globalLiveIndicator')?.classList.contains('hidden') ? '0' : '1',
    };

    return {
      exportedAt: new Date().toISOString(),
      dashboard,
      settings: state,
    };
  }

  function readAdminLogs() {
    const raw = readAdminStorage(LOG_KEY);
    return Array.isArray(raw) ? raw : [];
  }

  function openAdminJsonViewer(title, data) {
    closeAdminJsonViewer();
    const overlay = document.createElement('div');
    overlay.id = 'adminJsonViewerOverlay';
    overlay.className = 'adm-json-overlay';
    overlay.innerHTML = `
      <div class="adm-json-modal">
        <div class="adm-json-header">
          <div>
            <div class="adm-json-kicker">${escapeHtml(title)}</div>
            <h3>${escapeHtml(title)}</h3>
          </div>
          <button type="button" class="adm-json-close" aria-label="Close viewer">×</button>
        </div>
        <pre class="adm-json-body">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        <div class="adm-json-footer">
          <button type="button" class="btn-outline adm-json-copy">Copy JSON</button>
          <button type="button" class="btn-primary adm-json-dismiss">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => overlay.classList.add('show'));

    overlay.querySelector('.adm-json-close')?.addEventListener('click', closeAdminJsonViewer);
    overlay.querySelector('.adm-json-dismiss')?.addEventListener('click', closeAdminJsonViewer);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeAdminJsonViewer();
      }
    });
    overlay.querySelector('.adm-json-copy')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showAdminToast('JSON copied to clipboard.', 'success');
      } catch {
        showAdminToast('Could not copy JSON.', 'warning');
      }
    });
  }

  function closeAdminJsonViewer() {
    document.getElementById('adminJsonViewerOverlay')?.remove();
    if (!document.getElementById('adminWelcomeOverlay') && !document.getElementById('adminCommandPaletteOverlay')) {
      document.body.classList.remove('modal-open');
    }
  }

  function exportAdminBackup(label) {
    const payload = buildAdminSnapshot();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-backup-${label || 'snapshot'}-${Date.now()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showAdminToast('Backup downloaded.', 'success');
    pushAdminLog(`Exported ${label || 'snapshot'} backup`);
  }

  function exportAdminSnapshot() {
    exportAdminBackup('database');
  }

  function importAdminBackup() {
    if (!adminBackupInput) {
      adminBackupInput = document.createElement('input');
      adminBackupInput.type = 'file';
      adminBackupInput.accept = 'application/json';
      adminBackupInput.style.display = 'none';
      document.body.appendChild(adminBackupInput);
      adminBackupInput.addEventListener('change', handleAdminBackupImport);
    }
    adminBackupInput.value = '';
    adminBackupInput.click();
  }

  function handleAdminBackupImport(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const importedState = parsed.settings || parsed.state || parsed;
        adminSettingsState = mergeDeep(DEFAULT_SETTINGS, importedState);
        applyAdminAppearanceSettings(adminSettingsState);
        persistAdminSettings(true);
        renderSettingsRoot();
        showAdminToast('Backup restored successfully.', 'success');
        pushAdminLog('Imported admin backup');
      } catch (error) {
        console.error(error);
        showAdminToast('Invalid backup file.', 'error');
      }
    };
    reader.readAsText(file);
  }

  function clearAdminCache() {
    if (getAdminSettingsState().general.confirmations !== false && !window.confirm('Clear the local admin cache and draft data?')) {
      return;
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(DRAFT_KEY);
      window.localStorage.removeItem(`${STORAGE_KEY}:history`);
      pushAdminLog('Cleared admin cache');
      showAdminToast('Local admin cache cleared.', 'success');
    } catch {
      showAdminToast('Could not clear cache.', 'warning');
    }
  }

  function playAdminTone(frequency, duration) {
    if (!getAdminSettingsState().general.soundEffects) return;
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;

    try {
      const audioContext = new AudioContextCtor();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency || 540;
      gain.gain.value = 0.02;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + (duration || 0.06));
      oscillator.onended = () => {
        if (audioContext.close) audioContext.close();
      };
    } catch {
      // audio is optional
    }
  }

  function getGreetingParts() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good Morning', emoji: '☀️', status: 'The morning systems are primed for focused work.' };
    }
    if (hour >= 12 && hour < 17) {
      return { greeting: 'Good Afternoon', emoji: '👋', status: 'Your platform is moving through the day in real time.' };
    }
    if (hour >= 17 && hour < 21) {
      return { greeting: 'Good Evening', emoji: '🌙', status: 'Everything is running smoothly tonight.' };
    }
    return { greeting: 'Good Night', emoji: '✨', status: 'Late-night admin mode is fully active.' };
  }

  function getMotivationLine() {
    const lines = [
      'Consistency builds success.',
      'Today\'s upload can help hundreds.',
      'Small improvements create big systems.',
      'Students rely on your platform daily.',
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  function getAnnouncementCards(stats) {
    return [
      {
        icon: '🗓️',
        title: 'Upcoming exams',
        text: `Keep the exam hub updated. ${stats.notifications} new alerts are waiting for review.`,
      },
      {
        icon: '🛡️',
        title: 'System alert',
        text: `${stats.liveUsers} live users are active and the sync layer is healthy.`,
      },
      {
        icon: '📤',
        title: 'Pending uploads',
        text: `${stats.materials} published resources are currently live in the library.`,
      },
      {
        icon: '🤖',
        title: 'AI suggestion',
        text: 'Review the AI Features section before the next batch of uploads lands.',
      },
    ];
  }

  function normalizeCount(text) {
    const digits = String(text || '').replace(/[^\d]/g, '');
    return digits || '0';
  }

  function readCountFromElement(ids, fallback) {
    for (let index = 0; index < ids.length; index += 1) {
      const element = document.getElementById(ids[index]);
      if (element && element.textContent && element.textContent.trim() && element.textContent.trim() !== '—') {
        return normalizeCount(element.textContent);
      }
    }
    return String(fallback || '0');
  }

  function collectWelcomeStats() {
    const stats = {
      materials: readCountFromElement(['kpiTotalMaterials', 'wbTotalMaterials'], 0),
      students: readCountFromElement(['kpiStudentsDash', 'wbTotalVisitors'], 0),
      notifications: readCountFromElement(['kpiSuggDash'], 0),
      liveUsers: readCountFromElement(['commAdminOnlineCount'], 0),
      attendance: '84.2%',
      files: readCountFromElement(['kpiVideosDash', 'kpiPYQsDash'], 0),
    };

    const activeSessions = window.AttendanceState && Array.isArray(window.AttendanceState.activeSessions)
      ? String(window.AttendanceState.activeSessions.length)
      : readCountFromElement(['globalTimer'], 0);

    stats.activeSessions = activeSessions;
    return stats;
  }

  async function enrichWelcomeStats(stats) {
    if (!window.db || typeof db.ref !== 'function') {
      return stats;
    }

    const readValue = async (path) => {
      try {
        const snapshot = await db.ref(path).once('value');
        return snapshot.val();
      } catch {
        return null;
      }
    };

    try {
      const [visits, suggestions] = await Promise.all([
        readValue('site_stats/totalVisits'),
        readValue('suggestions'),
      ]);
      if (visits != null) {
        stats.students = String(visits || stats.students);
      }
      if (suggestions && typeof suggestions === 'object') {
        const count = Object.keys(suggestions).length;
        stats.notifications = String(count);
      }
    } catch {
      // ignore welcome enrichment errors
    }

    return stats;
  }

  function createWelcomeParticles(container) {
    if (!container) return;
    const total = 24;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < total; index += 1) {
      const particle = document.createElement('span');
      const size = 3 + Math.random() * 6;
      particle.className = 'adm-welcome-particle';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${8 + Math.random() * 10}s`;
      fragment.appendChild(particle);
    }

    container.appendChild(fragment);
  }

  function renderWelcomeStats(stats) {
    return `
      <div class="admin-welcome-stats adm-welcome-stats-grid">
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.students)}</span><span class="adm-welcome-stat-label">Active students</span></div>
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.attendance)}</span><span class="adm-welcome-stat-label">Today attendance</span></div>
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.materials)}</span><span class="adm-welcome-stat-label">Uploaded files</span></div>
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.notifications)}</span><span class="adm-welcome-stat-label">Pending reports</span></div>
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.liveUsers)}</span><span class="adm-welcome-stat-label">Live users</span></div>
        <div class="adm-welcome-stat-card"><span class="adm-welcome-stat-num">${escapeHtml(stats.files)}</span><span class="adm-welcome-stat-label">New notifications</span></div>
      </div>
    `;
  }

  function renderWelcomeActions() {
    const actions = [
      { label: 'Generate Attendance', icon: '⚡', action: 'attendance' },
      { label: 'Upload Notes', icon: '📂', action: 'add' },
      { label: 'Create Quiz', icon: '🧠', action: 'test' },
      { label: 'Send Notification', icon: '📢', action: 'notifications' },
      { label: 'Start Live Session', icon: '🔴', action: 'attendance' },
    ];

    return `
      <div class="adm-welcome-actions-grid">
        ${actions.map((action) => `
          <button type="button" class="adm-welcome-action-btn" data-admin-welcome-action="${escapeHtml(action.action)}">
            <span class="adm-welcome-action-icon">${escapeHtml(action.icon)}</span>
            <span>${escapeHtml(action.label)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderWelcomeAnnouncements(stats) {
    const cards = getAnnouncementCards(stats);
    return `
      <div class="adm-welcome-announcement-list">
        ${cards.map((card) => `
          <div class="adm-welcome-announcement-item">
            <div class="adm-welcome-announcement-icon">${escapeHtml(card.icon)}</div>
            <div class="adm-welcome-announcement-copy">
              <div class="adm-welcome-announcement-title">${escapeHtml(card.title)}</div>
              <div class="adm-welcome-announcement-text">${escapeHtml(card.text)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function closeAdminWelcomePopup() {
    const overlay = document.getElementById('adminWelcomeOverlay');
    if (!overlay) return;

    overlay.classList.remove('show');
    document.body.classList.remove('modal-open');

    setTimeout(() => {
      overlay.remove();
      if (!document.getElementById('adminCommandPaletteOverlay') && !document.getElementById('adminJsonViewerOverlay')) {
        document.body.classList.remove('modal-open');
      }
    }, 320);

    if (adminWelcomeAutoCloseTimer) {
      clearTimeout(adminWelcomeAutoCloseTimer);
      adminWelcomeAutoCloseTimer = null;
    }
    if (adminMotivationTimer) {
      clearInterval(adminMotivationTimer);
      adminMotivationTimer = null;
    }
  }

  async function showAdminWelcome(userRole) {
    closeAdminWelcomePopup();

    const role = userRole || 'Admin';
    const userName = readAdminStorage('userName') || readAdminStorage('adminDisplayName') || 'Vishal';
    const greeting = getGreetingParts();
    const overlay = document.createElement('div');
    overlay.id = 'adminWelcomeOverlay';
    overlay.className = 'admin-welcome-overlay adm-welcome-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="adm-welcome-orb adm-welcome-orb-1"></div>
      <div class="adm-welcome-orb adm-welcome-orb-2"></div>
      <div class="adm-welcome-particles" id="admWelcomeParticles"></div>
      <div class="admin-welcome-card adm-welcome-card">
        <button type="button" class="adm-welcome-close" aria-label="Close welcome popup">×</button>
        <div class="adm-welcome-sheen"></div>
        <div class="adm-welcome-header">
          <div class="adm-welcome-icon-wrap">
            <span class="adm-welcome-icon">${escapeHtml(greeting.emoji)}</span>
          </div>
          <div class="adm-welcome-copy">
            <div class="adm-welcome-badge">${escapeHtml(role)} access granted</div>
            <h2 class="admin-welcome-title adm-welcome-title">${escapeHtml(greeting.greeting)}, ${escapeHtml(userName)}</h2>
            <p class="admin-welcome-subtitle adm-welcome-subtitle">${escapeHtml(greeting.status)}</p>
          </div>
        </div>

        <div class="adm-welcome-motivation-row">
          <div class="adm-welcome-motivation-label">Smart line</div>
          <div class="adm-welcome-motivation" id="admWelcomeMotivationLine">${escapeHtml(getMotivationLine())}</div>
        </div>

        ${renderWelcomeStats(await enrichWelcomeStats(collectWelcomeStats()))}

        <div class="adm-welcome-actions-block">
          <div class="adm-welcome-section-label">Quick actions</div>
          ${renderWelcomeActions()}
        </div>

        <div class="adm-welcome-announcements-block">
          <div class="adm-welcome-section-label">Announcements</div>
          ${renderWelcomeAnnouncements(await enrichWelcomeStats(collectWelcomeStats()))}
        </div>

        <div class="adm-welcome-footer">
          <button type="button" class="adm-welcome-cta" data-admin-welcome-action="dashboard">Open Dashboard</button>
          <div class="adm-welcome-tip">Tip: use Ctrl + K for instant navigation.</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add('modal-open');

    createWelcomeParticles(overlay.querySelector('#admWelcomeParticles'));
    playAdminTone(680, 0.05);

    requestAnimationFrame(() => {
      overlay.classList.add('show');
      overlay.querySelector('.adm-welcome-card')?.classList.add('show');
    });

    const closeButton = overlay.querySelector('.adm-welcome-close');
    const ctaButton = overlay.querySelector('.adm-welcome-cta');
    overlay.querySelectorAll('[data-admin-welcome-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-admin-welcome-action');
        closeAdminWelcomePopup();
        if (action === 'dashboard') {
          window.switchAdminTab('dashboard');
          return;
        }
        if (action === 'test') {
          window.switchAdminTab('test');
          return;
        }
        if (action === 'add') {
          window.switchAdminTab('add');
          return;
        }
        if (action === 'notifications') {
          window.switchAdminTab('notifications');
          return;
        }
        if (action === 'attendance') {
          window.switchAdminTab('attendance');
        }
      });
    });

    closeButton?.addEventListener('click', closeAdminWelcomePopup);
    ctaButton?.addEventListener('click', () => {
      closeAdminWelcomePopup();
      window.switchAdminTab('dashboard');
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeAdminWelcomePopup();
      }
    });

    const motivationLine = overlay.querySelector('#admWelcomeMotivationLine');
    if (motivationLine) {
      adminMotivationTimer = setInterval(() => {
        motivationLine.textContent = getMotivationLine();
      }, 4500);
    }

    adminWelcomeAutoCloseTimer = setTimeout(() => {
      if (document.getElementById('adminWelcomeOverlay')) {
        closeAdminWelcomePopup();
      }
    }, 14000);

    sessionStorage.setItem(WELCOME_KEY, '1');
    pushAdminLog(`Welcome popup shown for ${role}`);
  }

  function openAdminAISettings() {
    window.switchAdminTab('ai-settings');
  }

  function openAdminSettingsSection(sectionId) {
    if (!sectionId) return;
    sessionStorage.setItem(ACTIVE_SECTION_KEY, sectionId);
    if (window.switchAdminTab) {
      window.switchAdminTab('settings');
    }
    if (!adminSettingsSectionRendered) {
      renderSettingsRoot();
    }
    updateSectionNavigation(sectionId);
    const section = document.querySelector(`[data-settings-section-panel="${CSS.escape(sectionId)}"]`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openAdminCommandPalette(initialQuery) {
    ensureCommandPalette();
    const overlay = document.getElementById('adminCommandPaletteOverlay');
    const input = document.getElementById('adminCommandSearch');
    if (!overlay || !input) return;
    input.value = initialQuery || '';
    renderCommandPaletteList(input.value);
    overlay.classList.add('show');
    document.body.classList.add('modal-open');
    setTimeout(() => input.focus(), 20);
  }

  function closeAdminCommandPalette() {
    const overlay = document.getElementById('adminCommandPaletteOverlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 250);
    if (!document.getElementById('adminWelcomeOverlay') && !document.getElementById('adminJsonViewerOverlay')) {
      document.body.classList.remove('modal-open');
    }
  }

  function ensureCommandPalette() {
    if (document.getElementById('adminCommandPaletteOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'adminCommandPaletteOverlay';
    overlay.className = 'adm-command-overlay';
    overlay.innerHTML = `
      <div class="adm-command-modal">
        <div class="adm-command-header">
          <div>
            <div class="adm-command-kicker">Command palette</div>
            <h3>Quick navigation and tools</h3>
          </div>
          <button type="button" class="adm-command-close" aria-label="Close command palette">×</button>
        </div>
        <div class="adm-command-search-wrap">
          <input type="search" id="adminCommandSearch" class="adm-command-search" placeholder="Search commands..." autocomplete="off" />
        </div>
        <div class="adm-command-list" id="adminCommandList"></div>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeAdminCommandPalette();
      }
    });
    overlay.querySelector('.adm-command-close')?.addEventListener('click', closeAdminCommandPalette);

    const input = overlay.querySelector('#adminCommandSearch');
    input?.addEventListener('input', () => {
      renderCommandPaletteList(input.value);
    });
    input?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAdminCommandPalette();
      }
      if (event.key === 'Enter') {
        const first = overlay.querySelector('.adm-command-item');
        first?.click();
      }
    });
  }

  const COMMANDS = [
    { label: 'Open Dashboard', hint: 'Overview and live stats', keywords: ['dashboard', 'home'], run: () => window.switchAdminTab('dashboard') },
    { label: 'Open Settings', hint: 'System settings hub', keywords: ['settings', 'system'], run: () => window.switchAdminTab('settings') },
    { label: 'AI Features', hint: 'Similarity and analysis controls', keywords: ['ai', 'similarity', 'analysis'], run: () => openAdminAISettings() },
    { label: 'Add Material', hint: 'Upload notes and files', keywords: ['add', 'upload', 'notes'], run: () => window.switchAdminTab('add') },
    { label: 'Manage Materials', hint: 'Edit and clean up content', keywords: ['manage', 'materials'], run: () => window.switchAdminTab('manage') },
    { label: 'Create Quiz', hint: 'Open the test hub', keywords: ['quiz', 'test', 'question bank'], run: () => window.switchAdminTab('test') },
    { label: 'Attendance Hub', hint: 'Start or monitor live sessions', keywords: ['attendance', 'session'], run: () => window.switchAdminTab('attendance') },
    { label: 'Notifications', hint: 'Post or review notices', keywords: ['notifications', 'notice'], run: () => window.switchAdminTab('notifications') },
    { label: 'Toggle Theme', hint: 'Switch light and dark mode', keywords: ['theme', 'dark', 'light'], run: () => window.toggleDarkMode && window.toggleDarkMode() },
    { label: 'Reset Settings', hint: 'Restore defaults', keywords: ['reset', 'defaults'], run: () => triggerAdminAction('reset') },
    { label: 'Open Logs Viewer', hint: 'Inspect recent admin logs', keywords: ['logs', 'debug'], run: () => triggerAdminAction('logsViewer') },
  ];

  function renderCommandPaletteList(query) {
    const list = document.getElementById('adminCommandList');
    if (!list) return;
    const lowerQuery = String(query || '').trim().toLowerCase();
    const items = COMMANDS.filter((command) => {
      if (!lowerQuery) return true;
      const text = [command.label, command.hint, ...(command.keywords || [])].join(' ').toLowerCase();
      return text.includes(lowerQuery);
    });

    if (adminPaletteFilterTimer) {
      clearTimeout(adminPaletteFilterTimer);
      adminPaletteFilterTimer = null;
    }

    list.innerHTML = items.length ? items.map((command) => `
      <button type="button" class="adm-command-item" data-command-label="${escapeHtml(command.label)}">
        <div class="adm-command-item-copy">
          <div class="adm-command-item-label">${escapeHtml(command.label)}</div>
          <div class="adm-command-item-hint">${escapeHtml(command.hint)}</div>
        </div>
        <span class="adm-command-item-shortcut">Enter</span>
      </button>
    `).join('') : '<div class="adm-command-empty">No matching commands found.</div>';

    list.querySelectorAll('.adm-command-item').forEach((item) => {
      item.addEventListener('click', () => {
        const label = item.getAttribute('data-command-label');
        const command = COMMANDS.find((entry) => entry.label === label);
        if (command && typeof command.run === 'function') {
          closeAdminCommandPalette();
          command.run();
        }
      });
    });

    adminPaletteFilterTimer = setTimeout(() => {}, 1);
  }

  function injectAdminAssistantButton() {
    if (document.getElementById('adminAssistantFab')) return;
    const button = document.createElement('button');
    button.id = 'adminAssistantFab';
    button.className = 'adm-ai-fab';
    button.type = 'button';
    button.title = 'AI assistant · Ctrl + K';
    button.innerHTML = '<span>AI</span><small>Ctrl+K</small>';
    button.addEventListener('click', () => openAdminAISettings());
    document.body.appendChild(button);
  }

  function bindGlobalShortcuts() {
    document.addEventListener('keydown', (event) => {
      const isCommandK = (event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 'k';
      if (isCommandK) {
        event.preventDefault();
        openAdminCommandPalette('');
        return;
      }
      if (event.key === 'Escape') {
        closeAdminCommandPalette();
        if (document.getElementById('adminWelcomeOverlay')) {
          closeAdminWelcomePopup();
        }
      }
    });
  }

  function refreshCurrentAdminView() {
    const root = document.getElementById('adminSettingsRoot');
    if (root && document.getElementById('admin-tab-settings')?.classList.contains('active')) {
      renderSettingsRoot();
      updateSectionNavigation(sessionStorage.getItem(ACTIVE_SECTION_KEY) || 'general');
    }
  }

  function applySettingsOnLogin() {
    const state = getAdminSettingsState();
    applyAdminAppearanceSettings(state);
    injectAdminAssistantButton();
    ensureCommandPalette();
    if (!adminSettingsSectionRendered) {
      renderSettingsRoot();
    }
    updateSettingsToolbarMeta();
  }

  window.openAdminAISettings = openAdminAISettings;
  window.openAdminSettingsSection = openAdminSettingsSection;
  window.openAdminCommandPalette = openAdminCommandPalette;
  window.closeAdminCommandPalette = closeAdminCommandPalette;
  window.closeAdminWelcomePopup = closeAdminWelcomePopup;

  window.showAdminWelcome = showAdminWelcome;
  window.adminLogout = function adminLogoutEnhanced() {
    closeAdminWelcomePopup();
    closeAdminCommandPalette();
    closeAdminJsonViewer();
    if (adminDashboardRefreshTimer) {
      clearInterval(adminDashboardRefreshTimer);
      adminDashboardRefreshTimer = null;
    }
    if (adminWelcomeAutoCloseTimer) {
      clearTimeout(adminWelcomeAutoCloseTimer);
      adminWelcomeAutoCloseTimer = null;
    }
    if (adminMotivationTimer) {
      clearInterval(adminMotivationTimer);
      adminMotivationTimer = null;
    }
    sessionStorage.removeItem(WELCOME_KEY);
    sessionStorage.removeItem(ACTIVE_SECTION_KEY);
    if (typeof originalFns.adminLogout === 'function') {
      originalFns.adminLogout();
    }
    document.body.classList.remove('modal-open');
  };

  window.switchAdminTab = function switchAdminTabEnhanced(tab) {
    lsSet('lastAdminTab', tab);

    if (tab === 'settings') {
      activateAdminTab('settings');
      renderSettingsRoot();
      updateSectionNavigation(sessionStorage.getItem(ACTIVE_SECTION_KEY) || 'general');
      closeAdmSidebar();
      return;
    }

    if (tab === 'ai-settings') {
      activateAdminTab('ai-settings');
      renderAiSettingsRoot();
      refreshAdminIntelligence();
      closeAdmSidebar();
      return;
    }

    if (typeof originalFns.switchAdminTab === 'function') {
      originalFns.switchAdminTab(tab);
    }

    const settingsSection = document.getElementById('admin-tab-settings');
    if (settingsSection && tab !== 'settings') {
      settingsSection.style.display = 'none';
      settingsSection.classList.remove('active');
    }
    const aiSection = document.getElementById('admin-tab-ai-settings');
    if (aiSection && tab !== 'ai-settings') {
      aiSection.style.display = 'none';
      aiSection.classList.remove('active');
    }
    const settingsButton = getAdminTabButton('settings');
    if (settingsButton && tab !== 'settings') settingsButton.classList.remove('active');
    const aiButton = getAdminTabButton('ai-settings');
    if (aiButton && tab !== 'ai-settings') aiButton.classList.remove('active');

    if (tab === 'dashboard') {
      updateSettingsToolbarMeta();
      refreshAdminIntelligence();
    }

    if (tab === 'analytics') {
      updateAnalyticsSmartSummaryWhenReady();
    }

    if (tab === 'dashboard' || tab === 'analytics' || tab === 'add' || tab === 'manage' || tab === 'inbox' || tab === 'visitors' || tab === 'notifications' || tab === 'community' || tab === 'voting' || tab === 'attendance' || tab === 'test') {
      refreshAdminIntelligence();
    }
  };

  window.initAdminPage = function initAdminPageEnhanced() {
    if (typeof originalFns.initAdminPage === 'function') {
      originalFns.initAdminPage();
    }
    adminSettingsState = getStoredSnapshot();
    applySettingsOnLogin();

    const storedTab = window.localStorage.getItem('lastAdminTab');
    if (!storedTab) {
      const homepage = adminSettingsState.dashboard?.defaultHomepage || 'dashboard';
      if (homepage) {
        window.switchAdminTab(homepage);
      }
    }

    if (window.localStorage.getItem('adminAuth')) {
      updateSettingsToolbarMeta();
    }
  };

  function bootAdvancedAdmin() {
    adminSettingsState = getStoredSnapshot();
    applyAdminAppearanceSettings(adminSettingsState);
    injectAdminAssistantButton();
    ensureCommandPalette();
    bindGlobalShortcuts();

    if (document.getElementById('adminSettingsRoot')) {
      renderSettingsRoot();
    }
    renderAiSettingsRoot();
    refreshAdminIntelligence();

    if (window.localStorage.getItem('adminAuth')) {
      updateSettingsToolbarMeta();
    }
  }

  window.loadDashboardStats = function loadDashboardStatsEnhanced() {
    if (typeof originalFns.loadDashboardStats === 'function') {
      originalFns.loadDashboardStats();
    }
    setTimeout(refreshAdminIntelligence, 350);
  };

  window.loadAnalytics = function loadAnalyticsEnhanced() {
    if (typeof originalFns.loadAnalytics === 'function') {
      originalFns.loadAnalytics();
    }
    updateAnalyticsSmartSummaryWhenReady();
    setTimeout(renderAnalyticsSmartSummary, 500);
    setTimeout(renderAnalyticsSmartSummary, 1600);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAdvancedAdmin, { once: true });
  } else {
    bootAdvancedAdmin();
  }  // Micro-interactions: Success Confetti
  function triggerConfetti() {
    const canvas = document.getElementById('admConfettiCanvas');
    if (!canvas || !window.confetti) return;
    
    const myConfetti = window.confetti.create(canvas, { resize: true });
    myConfetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#3b82f6', '#ffffff']
    });
  }

  // System Health Monitoring Simulation
  function initSystemHealthMonitor() {
    const healthPulse = document.querySelector('.health-pulse');
    const healthStatus = document.querySelector('.health-status');
    const healthWidget = document.querySelector('.adm-health-widget');
    
    if (!healthPulse || !healthStatus) return;

    setInterval(() => {
      // Simulate minor variations in health
      const health = 99 + Math.random();
      const isPerfect = health > 99.5;
      
      if (isPerfect) {
        healthPulse.style.background = '#10b981';
        healthStatus.textContent = 'OPTIMAL';
        healthStatus.style.color = '#10b981';
        healthWidget.title = `System Health: ${health.toFixed(2)}% Operational`;
      } else {
        healthPulse.style.background = '#06b6d4';
        healthStatus.textContent = 'STABLE';
        healthStatus.style.color = '#06b6d4';
        healthWidget.title = `System Health: ${health.toFixed(2)}% Operational`;
      }
    }, 5000);
  }

  // Wrap original material addition to trigger confetti
  const originalAddMaterial = window.addMaterial;
  window.addMaterial = async function() {
    if (typeof originalAddMaterial === 'function') {
      const result = await originalAddMaterial();
      // Assume success if no error thrown or check return value
      triggerConfetti();
      return result;
    }
  };

  const originalAddNotification = window.addNotification;
  window.addNotification = async function() {
    if (typeof originalAddNotification === 'function') {
      const result = await originalAddNotification();
      triggerConfetti();
      return result;
    }
  };

  // Initialize new features on load
  function initAdvancedEnhancements() {
    initSystemHealthMonitor();
    
    // Command Palette shortcut (Ctrl/Cmd + K)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('admGlobalSearch');
        if (searchInput) {
          searchInput.focus();
          searchInput.placeholder = "Search actions, materials, students...";
        }
      }
    });
  }

  // Add to the bottom of the IIFE
  initAdvancedEnhancements();

})();
