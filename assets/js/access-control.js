/* Free Fire Esports — Supabase profile based access control
   UI gate for static pages. Security for data still depends on Supabase RLS. */
(function(){
  'use strict';

  const VERSION = '20260801-profile-access-v1';
  const cfg = window.FF_CONFIG || {};
  const enabled = cfg.ACCESS_ENABLED !== false;
  const PROFILE_TABLE = cfg.ACCESS_PROFILE_TABLE || 'profiles';
  const LOGIN_PAGE = cfg.ACCESS_LOGIN_PAGE || 'index.html';
  const HOME_PAGE = cfg.ACCESS_HOME_PAGE || 'home.html';
  const DEFAULT_ROLE = (cfg.ACCESS_DEFAULT_ROLE || 'viewer').toLowerCase();

  const PUBLIC_PAGES = new Set(['index.html']);
  const REDIRECT_ALIASES = {
    'dashboard.html': 'home.html',
    'ewc-team-overview.html': 'ewc-center.html'
  };

  const PAGE_META = {
    'home.html': { title:'Home Dashboard', group:'command' },
    'ff-update.html': { title:'FF Updates', group:'reference' },
    'split-view.html': { title:'Split View', group:'command' },
    'character.html': { title:'Character Skills', group:'reference' },
    'pet.html': { title:'Pets', group:'reference' },
    'weapon.html': { title:'Weapons', group:'reference' },
    'loadout.html': { title:'Loadouts', group:'reference' },
    'preset.html': { title:'Preset Builder', group:'reference' },
    'map.html': { title:'Maps', group:'reference' },
    'store.html': { title:'CS Store', group:'reference' },
    'br-team.html': { title:'BR Data', group:'analytics' },
    'clash-draft-team.html': { title:'CS Draft', group:'clash' },
    'clash-draft-team-v2.html': { title:'CS Draft V2', group:'clash' },
    'clash-data.html': { title:'CS Data', group:'clash' },
    'clash-compare.html': { title:'CS Compare', group:'clash' },
    'clash-combo.html': { title:'CS Combos', group:'clash' },
    'data-upload.html': { title:'BR Upload', group:'upload' },
    'match-upload.html': { title:'Match Upload', group:'upload' },
    'cs-match-upload.html': { title:'CS Upload', group:'upload' },
    'match-report.html': { title:'Match Report', group:'analytics' },
    'clash-data-report.html': { title:'CS Report', group:'analytics' },
    'clash-data-convert.html': { title:'CS Converter', group:'tools' },
    'team-database.html': { title:'Team Database', group:'admin' },
    'team_settings.html': { title:'Team Settings', group:'admin' },
    'ewc.html': { title:'EWC Team Center', group:'analytics' },
    'ewc-center.html': { title:'Free Fire Data Center', group:'analytics' },
    'ewc-team-overview.html': { title:'Team Overview Redirect', group:'analytics', aliasFor:'ewc-center.html' },
    'admin-user-access.html': { title:'User Access', group:'admin' }
  };

  const ALL_PAGES = Object.keys(PAGE_META);
  const GROUPS = {
    command: ['home.html','ff-update.html','split-view.html'],
    reference: ['ff-update.html','character.html','pet.html','weapon.html','loadout.html','preset.html','map.html','store.html','split-view.html'],
    analytics: ['br-team.html','match-report.html','clash-data-report.html','ewc.html','ewc-center.html','ewc-team-overview.html'],
    clash: ['clash-draft-team.html','clash-draft-team-v2.html','clash-data.html','clash-compare.html','clash-combo.html','clash-data-report.html','clash-data-convert.html','cs-match-upload.html'],
    upload: ['data-upload.html','match-upload.html','cs-match-upload.html'],
    tools: ['clash-data-convert.html','split-view.html'],
    admin: ['admin-user-access.html','team-database.html','team_settings.html','data-upload.html','match-upload.html','cs-match-upload.html'],
    all: ALL_PAGES
  };

  window.FF_ACCESS_PAGE_META = PAGE_META;
  window.FF_ACCESS_GROUPS = GROUPS;

  try{
    injectStyles();
    if(enabled && !PUBLIC_PAGES.has(currentPage())) document.documentElement.classList.add('ff-access-pending');
  }catch(_earlyAccessError){}

  const ROLE_PRESETS = Object.assign({
    owner: ['all'],
    super_admin: ['all'],
    admin: ['all'],
    manager: ['command','reference','analytics','clash','upload','tools'],
    analyst: ['command','reference','analytics','clash','tools'],
    caster: ['command','reference','analytics','clash'],
    producer: ['command','reference','analytics','clash','tools'],
    data: ['command','reference','analytics','upload','tools'],
    editor: ['command','reference','clash','upload','tools'],
    viewer: ['command','reference'],
    guest: ['home.html','ff-update.html','character.html','pet.html','weapon.html','loadout.html','preset.html','map.html','store.html'],
    none: []
  }, cfg.ACCESS_ROLE_PRESETS || {});

  function currentPage(){
    return normalizePage((location.pathname.split('/').pop() || 'index.html'));
  }
  function normalizePage(page){
    const clean = String(page || '').split('?')[0].split('#')[0].split('/').pop().trim().toLowerCase() || 'index.html';
    return REDIRECT_ALIASES[clean] || clean;
  }
  function unique(arr){ return [...new Set((arr || []).filter(Boolean))]; }
  function escapeHtml(v){
    return String(v == null ? '' : v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function parseList(value){
    if(value == null || value === '') return [];
    if(Array.isArray(value)) return value.map(String).map(s=>s.trim()).filter(Boolean);
    if(typeof value === 'object'){
      if(Array.isArray(value.pages)) return parseList(value.pages);
      if(Array.isArray(value.allowed_pages)) return parseList(value.allowed_pages);
      return Object.entries(value).filter(([,v]) => !!v).map(([k]) => k);
    }
    const raw = String(value).trim();
    if(!raw) return [];
    try{ return parseList(JSON.parse(raw)); }catch(_e){}
    return raw.split(/[\n,;|]+/).map(s=>s.trim()).filter(Boolean);
  }
  function getFirstList(profile, keys){
    for(const key of keys){
      const list = parseList(profile && profile[key]);
      if(list.length) return list;
    }
    return [];
  }
  function expandTokens(tokens){
    const out = [];
    for(const token of tokens || []){
      const key = String(token || '').trim().toLowerCase();
      if(!key) continue;
      if(key === '*' || key === 'all') out.push(...ALL_PAGES);
      else if(GROUPS[key]) out.push(...GROUPS[key]);
      else out.push(normalizePage(key));
    }
    return unique(out).filter(p => PAGE_META[p] || p === 'index.html');
  }
  function profileRole(profile){
    return String(profile?.role || profile?.app_role || profile?.user_role || profile?.account_role || profile?.access_role || DEFAULT_ROLE).trim().toLowerCase() || DEFAULT_ROLE;
  }
  function profileIsActive(profile){
    if(!profile) return true;
    if(profile.disabled === true) return false;
    if(profile.is_active === false || profile.active === false) return false;
    const status = String(profile.status || '').trim().toLowerCase();
    if(['disabled','inactive','blocked','suspended','banned'].includes(status)) return false;
    return true;
  }
  function buildAccess(profile, session){
    const role = profileRole(profile);
    const active = profileIsActive(profile);
    const explicit = getFirstList(profile, ['page_access','allowed_pages','pages','permissions','allowed_routes','feature_access','access_pages']);
    const blocked = expandTokens(getFirstList(profile, ['blocked_pages','denied_pages','restricted_pages','hidden_pages']));
    let allowed;
    const accessAll = profile?.access_all === true || profile?.is_super_admin === true || ['owner','super_admin','admin'].includes(role);
    if(!active){
      allowed = [];
    }else if(accessAll){
      allowed = ALL_PAGES.slice();
    }else if(explicit.length){
      allowed = expandTokens(explicit);
    }else{
      allowed = expandTokens(ROLE_PRESETS[role] || ROLE_PRESETS[DEFAULT_ROLE] || []);
    }
    allowed = allowed.filter(p => !blocked.includes(p));
    allowed.push('index.html');
    return {
      version: VERSION,
      session,
      profile: profile || null,
      role,
      active,
      allowedPages: unique(allowed.map(normalizePage)),
      blockedPages: blocked,
      pageMeta: PAGE_META,
      groups: GROUPS
    };
  }
  function canAccessPage(page){
    const p = normalizePage(page);
    const access = window.FF_ACCESS_STATE;
    if(PUBLIC_PAGES.has(p)) return true;
    if(!access) return false;
    return access.allowedPages.includes(p);
  }
  function firstAllowedHome(){
    const access = window.FF_ACCESS_STATE;
    if(!access) return LOGIN_PAGE;
    return access.allowedPages.find(p => p !== 'index.html' && p !== currentPage()) || HOME_PAGE;
  }
  function expose(access){
    window.FF_ACCESS_STATE = access;
    window.FF_ACCESS = {
      version: VERSION,
      pageMeta: PAGE_META,
      groups: GROUPS,
      normalizePage,
      canAccessPage,
      getAllowedPages: () => (window.FF_ACCESS_STATE?.allowedPages || []).slice(),
      getRole: () => window.FF_ACCESS_STATE?.role || 'guest',
      getProfile: () => window.FF_ACCESS_STATE?.profile || null,
      isReady: () => true
    };
  }
  function injectStyles(){
    if(document.getElementById('ffAccessControlStyles')) return;
    const style = document.createElement('style');
    style.id = 'ffAccessControlStyles';
    style.textContent = `
      html.ff-access-pending body{visibility:hidden!important;}
      .ff-access-blocker{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at top left,rgba(255,189,89,.14),transparent 32%),linear-gradient(135deg,#080b14,#121827);color:#eef3ff;font-family:Inter,Roboto,Arial,sans-serif;}
      .ff-access-card{max-width:560px;width:min(560px,100%);border:1px solid rgba(255,255,255,.14);border-radius:26px;background:rgba(15,23,42,.86);box-shadow:0 30px 90px rgba(0,0,0,.45);padding:28px;backdrop-filter:blur(16px);}
      .ff-access-card h1{margin:0 0 10px;color:#ffbd59;font-size:1.35rem;letter-spacing:.02em;}
      .ff-access-card p{margin:8px 0;color:rgba(238,243,255,.82);line-height:1.5;}
      .ff-access-card .ff-access-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;}
      .ff-access-card a,.ff-access-card button{border:0;border-radius:999px;padding:10px 14px;font-weight:900;text-decoration:none;cursor:pointer;}
      .ff-access-primary{background:#ffbd59;color:#111827;}.ff-access-secondary{background:rgba(255,255,255,.09);color:#eef3ff;border:1px solid rgba(255,255,255,.14)!important;}
      [data-ff-access-hidden="true"]{display:none!important;}
    `;
    document.head.appendChild(style);
  }
  function clearPending(){ document.documentElement.classList.remove('ff-access-pending'); }
  function showAccessDenied(message){
    clearPending();
    const home = firstAllowedHome();
    document.body.innerHTML = `<div class="ff-access-blocker"><section class="ff-access-card"><h1>Access restricted</h1><p>${escapeHtml(message || 'Your Supabase profile does not allow access to this page.')}</p><p>Current role: <strong>${escapeHtml(window.FF_ACCESS_STATE?.role || 'not loaded')}</strong></p><div class="ff-access-actions"><a class="ff-access-primary" href="${escapeHtml(home)}">Open allowed page</a><button class="ff-access-secondary" type="button" id="ffAccessLogout">Logout</button></div></section></div>`;
    document.getElementById('ffAccessLogout')?.addEventListener('click', async () => {
      try{ await getClient()?.auth.signOut(); }catch(_e){}
      location.href = LOGIN_PAGE;
    });
  }
  function showAccessError(message){
    clearPending();
    document.body.innerHTML = `<div class="ff-access-blocker"><section class="ff-access-card"><h1>Access check failed</h1><p>${escapeHtml(message || 'Unable to verify your access profile.')}</p><div class="ff-access-actions"><a class="ff-access-primary" href="${escapeHtml(LOGIN_PAGE)}">Back to login</a></div></section></div>`;
  }
  function redirectToLogin(){
    const next = location.pathname.split('/').pop() + location.search + location.hash;
    const url = new URL(LOGIN_PAGE, location.href);
    if(next && !PUBLIC_PAGES.has(currentPage())) url.searchParams.set('next', next);
    location.replace(url.pathname.split('/').pop() + url.search);
  }

  let cachedClient = null;
  function getClient(){
    if(cachedClient) return cachedClient;
    if(window.__FF_SUPABASE_CLIENT) return (cachedClient = window.__FF_SUPABASE_CLIENT);
    if(!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    cachedClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    window.__FF_SUPABASE_CLIENT = cachedClient;
    return cachedClient;
  }
  async function maybeSingle(client, table, column, value){
    try{
      const { data, error } = await client.from(table).select('*').eq(column, value).maybeSingle();
      if(error) throw error;
      return data || null;
    }catch(err){
      console.warn(`[access] profile lookup skipped ${table}.${column}:`, err?.message || err);
      return null;
    }
  }
  async function loadProfile(client, user){
    const tables = unique([PROFILE_TABLE, PROFILE_TABLE === 'profiles' ? 'profile' : 'profiles']);
    for(const table of tables){
      let row = await maybeSingle(client, table, 'id', user.id);
      if(row) return row;
      row = await maybeSingle(client, table, 'user_id', user.id);
      if(row) return row;
      if(user.email){
        row = await maybeSingle(client, table, 'email', user.email);
        if(row) return row;
      }
    }
    return null;
  }
  function filterDomByAccess(){
    const access = window.FF_ACCESS;
    if(!access) return;
    document.querySelectorAll('a[href],button[data-page],[data-access-page]').forEach(node => {
      const raw = node.getAttribute('data-access-page') || node.getAttribute('data-page') || node.getAttribute('href') || '';
      if(!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || /^https?:/i.test(raw)) return;
      const page = normalizePage(raw);
      if(PAGE_META[page] && !access.canAccessPage(page)){
        node.setAttribute('data-ff-access-hidden','true');
        node.setAttribute('aria-hidden','true');
        node.setAttribute('tabindex','-1');
      }else{
        node.removeAttribute('data-ff-access-hidden');
        node.removeAttribute('aria-hidden');
        node.removeAttribute('tabindex');
      }
    });
  }
  async function init(){
    injectStyles();
    if(!enabled){ clearPending(); return; }
    const page = currentPage();
    if(PUBLIC_PAGES.has(page)){
      expose(buildAccess({ role:'public', page_access:['index.html'] }, null));
      clearPending();
      document.dispatchEvent(new CustomEvent('ff:access-ready', { detail: window.FF_ACCESS_STATE }));
      return;
    }
    document.documentElement.classList.add('ff-access-pending');
    const client = getClient();
    if(!client){ showAccessError('Supabase is not configured for access control. Check assets/js/app-config.js.'); return; }
    try{
      const { data: { session }, error } = await client.auth.getSession();
      if(error) throw error;
      if(!session || !session.user){ redirectToLogin(); return; }
      let profile = await loadProfile(client, session.user);
      if(!profile){
        profile = { id: session.user.id, email: session.user.email, role: DEFAULT_ROLE, _source:'default' };
      }
      const access = buildAccess(profile, session);
      expose(access);
      if(!canAccessPage(page)){
        document.dispatchEvent(new CustomEvent('ff:access-ready', { detail: access }));
        showAccessDenied(`You are logged in as ${session.user.email || 'this user'}, but this page is not included in your profile access.`);
        return;
      }
      clearPending();
      filterDomByAccess();
      document.dispatchEvent(new CustomEvent('ff:access-ready', { detail: access }));
      setTimeout(filterDomByAccess, 100);
      setTimeout(filterDomByAccess, 600);
      const mo = new MutationObserver(() => filterDomByAccess());
      mo.observe(document.documentElement, { childList:true, subtree:true });
    }catch(err){
      console.error('[access] fatal:', err);
      showAccessError(err?.message || 'Unable to verify access.');
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  }else{
    init();
  }
})();
