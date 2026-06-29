(function(){
  'use strict';
  const BLOCKED_LABELS = new Set([
    'team center','ewc team center','team database','match report','cs draft v2','cs report','cs converter','br upload','match upload','cs upload','team settings'
  ]);
  const BLOCKED_HREFS = [
    'ewc-team-overview.html','ewc-center.html','team-database.html','match-report.html','clash-draft-team-v2.html',
    'clash-data-report.html','clash-data-convert.html','data-upload.html','match-upload.html','cs-match-upload.html','team_settings.html'
  ];
  function norm(v){ return String(v || '').trim().toLowerCase().replace(/\s+/g,' '); }
  function cleanSidebar(){
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;
    sidebar.querySelectorAll('.sb-close,#sbClose,[aria-label="Close sidebar"]').forEach(el => el.remove());
    sidebar.querySelectorAll('a,button').forEach(el => {
      const text = norm(el.textContent);
      const title = norm(el.getAttribute('title'));
      const href = String(el.getAttribute('href') || el.getAttribute('data-page') || el.getAttribute('onclick') || '');
      const blockedByText = BLOCKED_LABELS.has(text) || BLOCKED_LABELS.has(title) || [...BLOCKED_LABELS].some(label => text === label || text.endsWith(label));
      const blockedByHref = BLOCKED_HREFS.some(x => href.includes(x));
      if(blockedByText || blockedByHref){
        const row = el.closest('.nav-item, li, .sidebar-item, .menu-item, .button-row') || el;
        // Do not remove whole .button-row if it also contains allowed controls.
        if(row.classList && row.classList.contains('button-row')) el.remove();
        else row.remove();
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cleanSidebar, {once:true});
  else cleanSidebar();
  document.addEventListener('ff:shared-sidebar-ready', cleanSidebar);
  setTimeout(cleanSidebar, 50);
  setTimeout(cleanSidebar, 500);
})();
