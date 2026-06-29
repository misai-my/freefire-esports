(function(){
  'use strict';

  const SIDEBAR_VERSION = '20260629-sidebar-clean-v2';
  const STORAGE_KEY = 'ff_sidebar_collapsed_v1';

  const ICONS = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    update: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 5h14v14H5V5Z" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    character: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pet: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 14c-1.7 0-3-1.3-3-3S5.3 8 7 8s3 1.3 3 3-1.3 3-3 3Zm10 0c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3ZM7 20c-2.8 0-5-1.8-5-4v-1h6v1c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-1h6v1c0 2.2-2.2 4-5 4H7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    weapon: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 21l6-6m0 0 2 2 8-8-2-2-8 8Zm0 0-2-2 4-4 2 2-4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    loadout: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 7V6a3 3 0 0 1 6 0v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 20V11a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 12h6M8 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    preset: '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 4.5a5 5 0 0 0-6.7 6.7l-4.3 4.3a2 2 0 0 0 2.8 2.8l4.3-4.3A5 5 0 0 0 19.5 9.5l-3 3-2-2 3-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 4l1-1M20 6h1M18 5V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none"><path d="M10 6 4 8v14l6-2 4 2 6-2V6l-6 2-4-2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16M6 7l1 12h10l1-12M9 11h6M10 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19H20M8 17V11M12 17V8M16 17V13M7 11l4-3 4 5 5-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none"><path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 13c-3 0-5 1.5-5 3.5V19h10v-2.5C13 14.5 11 13 8 13Zm8 0c-.7 0-1.4.1-2 .3 1.2.8 2 1.9 2 3.2V19h5v-2.5C21 14.5 19 13 16 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    swords: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 16l6-6M16 16l-6-6M13.5 8.5l2-2 2 2-2 2M10.5 8.5l-2-2-2 2 2 2M7.2 17.8l2-2M16.8 17.8l-2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    draft: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v4a2 2 0 0 0 2 2h4M11 16l1-3 6-6 2 2-6 6-3 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    split: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5h7v14H4V5ZM13 5h7v14h-7V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0-4 4m4-4 4 4M5 16v3h14v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    report: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3h9l3 3v15H6V3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 3v4h4M9 12h6M9 16h6M9 8h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" stroke="currentColor" stroke-width="2"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.8-1L14.4 3h-4.8l-.3 3a7 7 0 0 0-1.8 1L5 6l-2 3.5L5.1 11a7 7 0 0 0 0 2L3 14.5 5 18l2.5-1a7 7 0 0 0 1.8 1l.3 3h4.8l.3-3a7 7 0 0 0 1.8-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const NAV_GROUPS = [
    { label: 'Command Center', items: [
      { href:'home.html', label:'Home', title:'Home Dashboard', icon:'dashboard', aliases:['index.html','dashboard.html','x-dashboard.html'] },
      { href:'ff-update.html', label:'FF Updates', title:'Patch Updates', icon:'update' },
      { href:'split-view.html', label:'Split View', title:'Split View', icon:'split' }
    ]},
    { label: 'Reference', items: [
      { href:'character.html', label:'Character Skills', title:'Character Skills', icon:'character' },
      { href:'pet.html', label:'Pets', title:'Pets', icon:'pet' },
      { href:'weapon.html', label:'Weapons', title:'Weapons', icon:'weapon' },
      { href:'loadout.html', label:'Loadouts', title:'Loadouts', icon:'loadout' },
      { href:'preset.html', label:'Preset Builder', title:'Preset Builder', icon:'preset' },
      { href:'map.html', label:'Maps', title:'Maps', icon:'map' },
      { href:'store.html', label:'CS Store', title:'Clash Squad Store', icon:'store' }
    ]},
    { label: 'Analytics', items: [
      { href:'br-team.html', label:'BR Data', title:'Battle Royale Data', icon:'chart' },
    ]},
    { label: 'Clash Squad', items: [
      { href:'clash-draft-team.html', label:'CS Draft', title:'CS Draft', icon:'draft' },
      { href:'clash-data.html', label:'CS Data', title:'CS Data', icon:'swords' },
      { href:'clash-compare.html', label:'CS Compare', title:'CS Compare', icon:'swords' },
      { href:'clash-combo.html', label:'CS Combos', title:'CS Combos', icon:'swords' },
    ]},
  ];

  function pageName(){
    const path = (window.location.pathname || '').split('/').pop();
    return path || 'index.html';
  }

  function escapeHTML(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isActive(item, current){
    return item.href === current || (item.aliases || []).includes(current);
  }

  function navItemHTML(item, current){
    const active = isActive(item, current) ? ' active' : '';
    const icon = ICONS[item.icon] || ICONS.dashboard;
    return `
      <a class="nav-item${active}" href="${escapeHTML(item.href)}" data-page="${escapeHTML(item.href)}" title="${escapeHTML(item.title || item.label)}">
        <span class="nav-ico" aria-hidden="true">${icon}</span>
        <span class="nav-label">${escapeHTML(item.label)}</span>
      </a>`;
  }

  function buildNavHTML(current){
    return NAV_GROUPS.map(group => `
      <div class="ff-nav-section" role="presentation"><span>${escapeHTML(group.label)}</span></div>
      ${group.items.map(item => navItemHTML(item, current)).join('')}
    `).join('');
  }

  function ensureStyles(){
    if(document.getElementById('ffSharedSidebarStyles')) return;
    const style = document.createElement('style');
    style.id = 'ffSharedSidebarStyles';
    style.textContent = `
      #sidebar[data-shared-sidebar="true"] .nav{overflow-y:auto;overscroll-behavior:contain;padding-bottom:18px;}
      #sidebar[data-shared-sidebar="true"] .ff-nav-section{padding:12px 10px 4px;margin-top:4px;color:var(--muted,#93a4bd);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.13em;line-height:1.2;}
      #sidebar[data-shared-sidebar="true"].collapsed .ff-nav-section{display:none;}
      @media (max-width:900px){#sidebar[data-shared-sidebar="true"] .ff-nav-section{display:block;}}
      #sidebar[data-shared-sidebar="true"] .nav-item{min-height:42px;}
      #sidebar[data-shared-sidebar="true"] .nav-label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      #sidebar[data-shared-sidebar="true"] .nav-ico svg{width:20px;height:20px;display:block;}
      #sidebar .sb-close{display:none!important;}
      #sidebar[data-shared-sidebar="true"] .sb-close{display:none!important;}
    `;
    document.head.appendChild(style);
  }

  function setupSidebar(){
    const sidebar = document.getElementById('sidebar');
    if(!sidebar) return;

    ensureStyles();
    const current = pageName();

    sidebar.setAttribute('data-shared-sidebar', 'true');
    sidebar.setAttribute('data-shared-sidebar-version', SIDEBAR_VERSION);
    sidebar.setAttribute('aria-label', 'Sidebar navigation');

    sidebar.innerHTML = `
      <div class="brand">
        <div class="brand-left">
          <div class="logo">FF</div>
          <div class="brand-text">
            <h1>Free Fire</h1>
            <small class="muted">Caster Dashboard</small>
          </div>
        </div>
</div>
      <nav class="nav" id="nav" aria-label="Main navigation">
        ${buildNavHTML(current)}
      </nav>
    `;

    try{
      if(!window.matchMedia('(max-width: 900px)').matches && localStorage.getItem(STORAGE_KEY) === '1'){
        sidebar.classList.add('collapsed');
      }
    }catch(_err){}

    const overlay = document.getElementById('sbOverlay');
    const closeBtn = document.getElementById('sbClose');
    const closeMobile = () => {
      sidebar.classList.remove('open');
      overlay?.classList.remove('show');
      overlay?.setAttribute('aria-hidden','true');
      document.body.classList.remove('sb-open');
    };

    closeBtn?.addEventListener('click', closeMobile);
    overlay?.addEventListener('click', closeMobile);
    sidebar.querySelectorAll('a.nav-item').forEach(link => {
      link.addEventListener('click', () => {
        if(window.matchMedia('(max-width: 900px)').matches) closeMobile();
      });
    });

    document.dispatchEvent(new CustomEvent('ff:shared-sidebar-ready', { detail:{ version: SIDEBAR_VERSION, current } }));
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupSidebar, { once:true });
  }else{
    setupSidebar();
  }
})();
