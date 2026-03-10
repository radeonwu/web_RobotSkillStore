(function(){
  // ---- helpers ----
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

  var ROOT = document.documentElement;

  function currentTheme(){
    return ROOT.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyThemeToIframes(mode){
  // 1) Broadcast to iframes via postMessage (works even when direct DOM access is blocked, e.g., file://).
  qsa('iframe').forEach(function(fr){
    try{
      if(fr && fr.contentWindow){
        fr.contentWindow.postMessage({type:'rss-theme', mode: mode}, '*');
      }
    }catch(e){}
  });

  // 2) Ensure concept iframes carry a theme query param for first paint.
  // This may reload the iframe once (only when needed).
  qsa('iframe.concept-frame').forEach(function(fr){
    try{
      var src = fr.getAttribute('src');
      if(!src) return;
      var u = new URL(src, window.location.href);
      var cur = u.searchParams.get('theme');
      if(cur === mode) return;
      u.searchParams.set('theme', mode);
      var next = u.toString();
      if(next !== src) fr.setAttribute('src', next);
    }catch(e){}
  });
}

  // ---- topbar height -> CSS var ----
  function measureTopbar(){
    var topbar = qs('.topbar');
    var h = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--topbar-h', h + 'px');
  }

  // ---- theme toggle ----
  function initTheme(){
    // CSS uses [data-theme="dark"] to switch variables.
    // We keep light mode as the default (no attribute) for backward compatibility.
    function apply(mode){
      if(mode === 'dark') ROOT.setAttribute('data-theme','dark');
      else ROOT.removeAttribute('data-theme');
      // Update icon if present.
      var icon = qs('#themeToggle .icon');
      if(icon) icon.textContent = (mode === 'dark') ? '☀' : '☾';
      applyThemeToIframes(mode);
    }

    var saved = null;
    try{ saved = localStorage.getItem('rss_theme'); }catch(e){}

    if(saved === 'dark' || saved === 'light'){
      apply(saved);
    }else{
      // If user has no saved preference, follow OS preference.
      try{
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        apply(prefersDark ? 'dark' : 'light');
      }catch(e){
        apply('light');
      }
    }

    var btn = qs('#themeToggle');
    if(!btn) return;

    btn.addEventListener('click', function(){
      var isDark = ROOT.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      apply(next);
      try{ localStorage.setItem('rss_theme', next); }catch(e){}
    });
  }

  // ---- lifecycle bar ----
  var STAGES = [
    {key:'register', label:'Register'},
    {key:'validate', label:'Validate'},
    {key:'certify',  label:'Certify'},
    {key:'deploy',   label:'Deploy'}
  ];

  function parseStageAttr(el){
    var raw = (el.getAttribute('data-stage') || '').trim();
    if(!raw) return [];
    if(raw.toLowerCase() === 'all') return STAGES.map(function(s){return s.key;});
    return raw.split(',').map(function(s){return s.trim().toLowerCase();}).filter(Boolean);
  }

  function resolveLifecycleActiveStages(el){
    // If we are on lifecycle page, prefer hash
    var path = (location.pathname || '').toLowerCase();
    var isLifecycle = path.endsWith('/lifecycle.html') || path.endsWith('lifecycle.html');
    if(isLifecycle){
      var hash = (location.hash || '').replace('#','').toLowerCase();
      if(hash && ['register','validate','certify','deploy','overview'].indexOf(hash) >= 0){
        if(hash === 'overview') return ['register','validate','certify','deploy'];
        return [hash];
      }
    }
    return parseStageAttr(el);
  }

  function renderLifecycleBar(){
    qsa('.rss-lifecycle-bar').forEach(function(el){
      el.innerHTML = '';
      var active = resolveLifecycleActiveStages(el);
      STAGES.forEach(function(s){
        var pill = document.createElement('span');
        pill.className = 'rss-life-item ' + s.key + (active.indexOf(s.key)>=0 ? ' active' : '');
        pill.textContent = s.label;
        el.appendChild(pill);
      });
    });
  }

  // ---- onboarding anchor: put pills inline after the label ----
  function inlineLifecycleInOnboarding(){
    qsa('.onboarding-line.onboarding-anchor').forEach(function(row){
      var label = row.querySelector('.onboarding-label');
      var bar = row.querySelector('.rss-lifecycle-bar');
      if(!label || !bar) return;
      if(bar.parentElement !== label) label.appendChild(bar);
    });
  }

  // ---- active top navigation ----
  function setActiveTopNav(){
    var links = qsa('.topnav .toplink');
    if(!links.length) return;

    // Clear any hardcoded active states in HTML.
    links.forEach(function(a){ a.classList.remove('active'); a.removeAttribute('aria-current'); });

    // Determine current page key (supports file:// and http(s)://, EN and ZH).
    var lowerPath = ((location.pathname||'')+'').replace(/\\/g,'/').toLowerCase();
    var file = (lowerPath.split('/').pop() || 'index.html');

    // Treat docs/* as Docs.
    var inDocs = lowerPath.indexOf('/docs/') >= 0;

    function resolveHrefToKey(a){
      var href = (a.getAttribute('href') || '').trim();
      if(!href || href === '#') return '';
      try {
        var u = new URL(href, location.href);
        var p = (u.pathname||'').replace(/\\/g,'/').toLowerCase();
        // docs folder
        if(p.indexOf('/docs/') >= 0) return 'docs';
        var f = (p.split('/').pop() || 'index.html');
        if(f === '' || f === 'index.html') return 'home';
        if(f.indexOf('lifecycle') >= 0) return 'lifecycle';
        if(f.indexOf('platform') >= 0) return 'platform';
        if(f.indexOf('concept') >= 0) return 'concepts';
        if(f.indexOf('skills') >= 0) return 'skills';
        if(f.indexOf('deploy') >= 0) return 'deployment';
        if(f.indexOf('contact') >= 0) return 'contact';
        return f;
      } catch(e){
        return '';
      }
    }

    function currentKey(){
      if(inDocs) return 'docs';
      if(file === '' || file === 'index.html') return 'home';
      if(file.indexOf('lifecycle') >= 0) return 'lifecycle';
      if(file.indexOf('platform') >= 0) return 'platform';
      if(file.indexOf('concept') >= 0) return 'concepts';
      if(file.indexOf('skills') >= 0) return 'skills';
      if(file.indexOf('deploy') >= 0) return 'deployment';
      if(file.indexOf('contact') >= 0) return 'contact';
      return file;
    }

    var keyNow = currentKey();
    var hit = links.find(function(a){ return resolveHrefToKey(a) === keyNow; });
    if(hit){
      hit.classList.add('active');
      hit.setAttribute('aria-current','page');
    }
  }


  // ---- right-side toc ----
  function buildTOC(){
    var tocNav = qs('#tocNav');
    if(!tocNav) return;

    // Ensure styling hooks exist even when pages only provide an id.
    tocNav.classList.add('toc-nav');

    var main = qs('main.content') || qs('.content') || document.body;
    var headings = qsa('h2[id], h3[id]', main).filter(function(h){
      return !h.closest('aside') && !h.closest('nav') && !h.closest('footer');
    });

    tocNav.innerHTML = '';
    if(!headings.length){
      tocNav.innerHTML = '<div class="toc-empty">No sections</div>';
      return;
    }

    headings.forEach(function(h){
      var a = document.createElement('a');
      a.className = 'toc-link toc-' + h.tagName.toLowerCase();
      a.href = '#' + h.id;
      a.textContent = (h.textContent||'').trim();
      tocNav.appendChild(a);
    });
  }

  // ---- smooth scroll with topbar offset ----
  function enableAnchorOffset(){
    function scrollToHash(){
      var id = decodeURIComponent((location.hash||'').slice(1));
      if(!id) return;
      var el = document.getElementById(id);
      if(!el) return;
      var topbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')||'0',10) || 0;
      var y = window.scrollY + el.getBoundingClientRect().top - topbarH - 16;
      window.scrollTo({top:y, behavior:'smooth'});
    }

    window.addEventListener('hashchange', function(){
      renderLifecycleBar();
      setTimeout(scrollToHash, 0);
    });

    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if(!a) return;
      var href = a.getAttribute('href');
      if(!href || href === '#') return;
      var id = href.slice(1);
      var el = document.getElementById(id);
      if(!el) return;
      e.preventDefault();
      history.pushState(null, '', href);
      renderLifecycleBar();
      setTimeout(function(){
        var topbarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')||'0',10) || 0;
        var y = window.scrollY + el.getBoundingClientRect().top - topbarH - 16;
        window.scrollTo({top:y, behavior:'smooth'});
      }, 0);
    });
  }

  // ---- language toggle (EN <-> 中文) ----
  function bindLangToggle(){
    var btn = qs('#langToggle');
    if(!btn) return;

    btn.addEventListener('click', function(){
      var path = (location.pathname || '');
      var norm = path.replace(/\\/g, '/');
      var from = (btn.getAttribute('data-current') || '').toLowerCase() || (document.documentElement.lang || 'en');
      var to = (from === 'zh') ? 'en' : 'zh';

      var swapped;
      if(norm.toLowerCase().indexOf('/en/') >= 0){
        swapped = norm.replace(/\/en\//i, '/' + to + '/');
      }else if(norm.toLowerCase().indexOf('/zh/') >= 0){
        swapped = norm.replace(/\/zh\//i, '/' + to + '/');
      }else{
        var file = norm.split('/').pop() || 'index.html';
        swapped = '/' + to + '/' + file;
      }

      var hash = location.hash || '';
      try{ localStorage.setItem('rss_lang', to); }catch(e){}

      if(location.protocol === 'file:'){
        var parts = norm.split('/');
        var li = parts.findIndex(function(x){
          x = (x||'').toLowerCase();
          return x === 'en' || x === 'zh';
        });
        if(li >= 0){
          parts[li] = to;
          location.href = parts.join('/') + hash;
        }else{
          location.href = swapped + hash;
        }
      }else{
        location.href = swapped + hash;
      }
    });
  }

  // ---- Inline toggle nav for Docs (RSS/RSP summaries) ----
  function initInlineToggleNav(){
    qsa('.pillbar[data-toggle-group], .concept-tabs[data-toggle-group]').forEach(function(bar){
      var group = bar.getAttribute('data-toggle-group');
      if(!group) return;
      var pills = qsa('button.pill, button.tab-btn', bar);
      pills.forEach(function(p){
        p.addEventListener('click', function(){
          var target = p.getAttribute('data-toggle-target');
          if(!target) return;
          pills.forEach(function(pp){ pp.classList.toggle('active', pp===p); });
          qsa('.inline-panel[data-panel="'+group+'"]', bar.parentElement).forEach(function(panel){
            var show = panel.id === target;
            panel.classList.toggle('active', show);
            panel.classList.toggle('hidden', !show);
          });
        });
      });
    });
  }

  // ---- Concepts page tabs (4 tabs -> iframe content) ----
  function initConceptTabs(){
    var wrap = qs('.concept-tabs');
    if(!wrap) return;
    var buttons = qsa('[data-tab]', wrap);
    var iframe = qs('#conceptFrame');
    if(!buttons.length || !iframe) return;

    function activate(id, push){
      buttons.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-tab')===id); });
      var btn = buttons.find(function(b){ return b.getAttribute('data-tab')===id; });
      if(!btn) return;

      var src = btn.getAttribute('data-src');
      if(src){
        iframe.style.height = '200px';
        iframe.setAttribute('src', src);
      }
      if(push){
        try{ history.replaceState(null,'', '#' + id); }catch(e){}
      }
    }

    buttons.forEach(function(b){
      b.addEventListener('click', function(){ activate(b.getAttribute('data-tab'), true); });
    });

    var hid = (location.hash||'').replace('#','').trim();
    if(hid){ activate(hid, false); }
    else{ activate(buttons[0].getAttribute('data-tab'), false); }

    var toc = qs('#tocNav');
    if(toc){
      toc.innerHTML = '';
      buttons.forEach(function(b){
        var a = document.createElement('a');
        a.className = 'toc-link';
        a.href = '#' + b.getAttribute('data-tab');
        a.textContent = (b.textContent||'').trim();
        a.addEventListener('click', function(e){
          e.preventDefault();
          activate(b.getAttribute('data-tab'), true);
        });
        toc.appendChild(a);
      });
    }
  }

  // ---- Concepts iframe auto-height (prefer direct same-origin read; fall back to postMessage) ----
  function initIframeAutoHeight(){
    var iframe = qs('#conceptFrame');
    if(!iframe) return;

    function setH(h){
      var hh = Math.max(260, (Number(h)||0));
      if(!hh) return;
      var cur = parseInt((iframe.style.height||'').replace('px',''), 10) || 0;
      if(cur && Math.abs(hh - cur) < 6) return;
      iframe.style.height = hh + 'px';
    }

    // 1) same-origin polling (works on GitHub Pages and most file:// cases)
    function poll(){
      try{
        var doc = iframe.contentDocument;
        if(doc && doc.body){
          // Use the larger of body/documentElement heights.
          // IMPORTANT: Do NOT add extra padding here, otherwise height can "chase" the iframe viewport
          // and grow indefinitely when content is shorter than the iframe.
          var h = Math.max(
            doc.body.scrollHeight || 0,
            (doc.documentElement && doc.documentElement.scrollHeight) || 0
          );
          if(h) setH(h);
        }
      }catch(e){}
    }

    // 2) postMessage listener (fallback)
    window.addEventListener('message', function(ev){
      var d = ev.data || {};
      if(!d || d.type !== 'rss-embed-height') return;
      try{ if(ev.source !== iframe.contentWindow) return; }catch(e){}
      setH(d.height);
    });

    iframe.addEventListener('load', function(){
      // Ensure iframe theme matches current theme (Concepts embed pages)
      applyThemeToIframes(currentTheme());
      poll();
      // rapid polls during initial layout
      var n = 0;
      var t = setInterval(function(){
        n++;
        poll();
        try{ iframe.contentWindow && iframe.contentWindow.postMessage({type:'rss-embed-ping'}, '*'); }catch(e){}
        if(n >= 20) clearInterval(t);
      }, 150);
    });

    // keep following changes (fonts/images)
    setInterval(poll, 1200);
  }

  // ---- External platform links (viewer/public) ----
  // When the site is opened via file://, absolute paths like /viewer/ would point to a non-existent
  // local filesystem path. We rewrite those links to a configured platform base URL when provided,
  // otherwise we prevent navigation and show a helpful message.
  function normalizeBase(u){
    if(!u) return '';
    return String(u).replace(/\/+$/,'');
  }

  function bindPlatformLinks(){
    var proto = (location && location.protocol) || '';
    var platformBase = normalizeBase((window.RSS_PLATFORM_BASE_URL||window.RSS_API_BASE||''));
    var viewerBase = normalizeBase((window.RSS_VIEWER_BASE_URL||platformBase));
    var publicBase = normalizeBase((window.RSS_PUBLIC_BASE_URL||platformBase));

    // Match known platform paths used across the site.
    var patterns = [
      {re:/^\/viewer(\/|$)/, base: viewerBase, label:'Evidence Viewer'},
      {re:/^\/public\/v1(\/|$)/, base: publicBase, label:'Public API'},
      {re:/^\/platform\/(viewer|skills|runs)(\/|$)/, base: platformBase, label:'Platform'}
    ];

    qsa('a[href^="/"]').forEach(function(a){
      var href = a.getAttribute('href') || '';
      var match = patterns.find(function(p){ return p.re.test(href); });
      if(!match) return;

      if(proto === 'file:'){
        if(match.base){
          a.setAttribute('href', match.base + href);
          a.setAttribute('target','_blank');
          a.setAttribute('rel','noopener');
        }else{
          // No base configured: block navigation to avoid a confusing local-file error page.
          a.setAttribute('href', '#');
          a.addEventListener('click', function(ev){
            ev.preventDefault();
            alert('This link opens the RSS Platform (' + match.label + ').\n\n' +
                  'You are viewing the website from local disk (file://).\n' +
                  'Set window.RSS_PLATFORM_BASE_URL in assets/config.js to your platform URL, e.g. http://localhost:8080');
          });
        }
      }
    });
  }

  // ---- Contact message board (local demo) ----
  // The contact page uses inline handlers (onsubmit/onclick), so we expose a few globals.
  var CONTACT_KEY = 'rss_contact_messages';
  var EVID_KEY = 'rsp_last_evidence';

  function nowISO(){
    try{ return new Date().toISOString(); }catch(e){ return ''+Date.now(); }
  }

  function loadMessages(){
    try{
      var raw = localStorage.getItem(CONTACT_KEY);
      if(!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(e){
      return [];
    }
  }

  function saveMessages(arr){
    try{ localStorage.setItem(CONTACT_KEY, JSON.stringify(arr||[])); }catch(e){}
  }

  function renderMessages(){
    var list = qs('#message-list');
    var count = qs('#message-count');
    if(!list || !count) return;
    var msgs = loadMessages();
    count.textContent = String(msgs.length);
    list.innerHTML = '';
    if(!msgs.length){
      var empty = document.createElement('div');
      empty.className = 'note';
      empty.textContent = 'No messages yet.';
      list.appendChild(empty);
      return;
    }
    msgs
      .slice()
      .sort(function(a,b){ return (b.ts||0) - (a.ts||0); })
      .forEach(function(m){
        var item = document.createElement('div');
        item.className = 'msg-item';
        item.style.borderTop = '1px solid var(--border)';
        item.style.padding = '10px 2px';

        var head = document.createElement('div');
        head.style.display = 'flex';
        head.style.justifyContent = 'space-between';
        head.style.gap = '10px';
        head.style.flexWrap = 'wrap';

        var who = document.createElement('div');
        who.innerHTML = '<strong>' + (m.name||'Anonymous') + '</strong>' + (m.email ? (' · <span class="note">' + m.email + '</span>') : '');
        var when = document.createElement('div');
        when.className = 'note';
        when.textContent = m.time || '';

        head.appendChild(who);
        head.appendChild(when);

        var body = document.createElement('div');
        body.style.marginTop = '6px';
        body.textContent = m.message || '';

        item.appendChild(head);
        item.appendChild(body);
        list.appendChild(item);
      });
  }

  function setMsgStatus(text, ok){
    var el = qs('#msg-status');
    if(!el) return;
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = ok ? 'var(--text)' : 'var(--danger)';
  }

  function buildEvidence(msg, emailAttempt){
    var ctx = {
      time: nowISO(),
      page: String(location.href||''),
      user_agent: (navigator && navigator.userAgent) ? navigator.userAgent : '',
      mode: (location && location.protocol) ? location.protocol : ''
    };
    var outcome = {
      stored_local: true,
      email_attempted: !!emailAttempt,
      email_sent: false,
      error: null
    };
    var bundle = {
      "message.json": {
        name: msg.name || '',
        email: msg.email || '',
        message: msg.message || '',
        page: ctx.page,
        time: ctx.time
      },
      "outcome.json": outcome,
      "execution_context.json": ctx
    };
    try{ localStorage.setItem(EVID_KEY, JSON.stringify(bundle)); }catch(e){}
    return bundle;
  }

  // Global: submitMessage(form)
  window.submitMessage = function(form){
    try{
      var f = form || qs('#contact-form');
      if(!f) return false;
      var name = (f.elements.name && f.elements.name.value || '').trim();
      var email = (f.elements.email && f.elements.email.value || '').trim();
      var message = (f.elements.message && f.elements.message.value || '').trim();
      var sendEmail = !!(f.elements.send_email && f.elements.send_email.checked);

      if(!name || !message){
        setMsgStatus('Please fill in required fields.', false);
        return false;
      }

      var msg = {
        id: 'm_' + Date.now() + '_' + Math.random().toString(16).slice(2),
        ts: Date.now(),
        time: nowISO(),
        name: name,
        email: email,
        message: message
      };

      var msgs = loadMessages();
      msgs.push(msg);
      saveMessages(msgs);
      renderMessages();

      // Evidence bundle (updated with outcome after email attempt)
      var bundle = buildEvidence(msg, sendEmail);

      // Attempt email relay only when hosted (not file://)
      if(sendEmail){
        if((location && location.protocol) === 'file:'){
          setMsgStatus('Saved locally. Email relay requires hosting this site and configuring POST /api/contact.', true);
          return false;
        }
        var payload = {
          to: 'wu.xiaojun@gmail.com',
          from_name: name,
          from_email: email,
          message: message,
          page: String(location.href||'')
        };
        fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        }).then(function(r){
          if(!r.ok) throw new Error('HTTP ' + r.status);
          return r.text();
        }).then(function(){
          try{
            bundle['outcome.json'].email_sent = true;
            localStorage.setItem(EVID_KEY, JSON.stringify(bundle));
          }catch(e){}
          setMsgStatus('Saved locally and sent via email relay.', true);
        }).catch(function(err){
          try{
            bundle['outcome.json'].error = String(err && err.message ? err.message : err);
            localStorage.setItem(EVID_KEY, JSON.stringify(bundle));
          }catch(e){}
          setMsgStatus('Saved locally. Email relay failed: ' + (err && err.message ? err.message : err), false);
        });
      }else{
        setMsgStatus('Saved locally.', true);
      }

      // Reset message field (keep name/email for convenience)
      try{ f.elements.message.value = ''; }catch(e){}
      return false;
    }catch(e){
      setMsgStatus('Submit failed: ' + (e && e.message ? e.message : e), false);
      return false;
    }
  };

  // Global: exportLastEvidence()
  window.exportLastEvidence = function(){
    try{
      var raw = localStorage.getItem(EVID_KEY);
      if(!raw){
        alert('No evidence bundle found yet. Submit a message first.');
        return;
      }
      var blob = new Blob([raw], {type:'application/json'});
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'rss_contact_evidence.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 500);
    }catch(e){
      alert('Export failed: ' + (e && e.message ? e.message : e));
    }
  };

  // Global: toggleMessageBoard()
  window.toggleMessageBoard = function(){
    var board = qs('#message-board');
    if(!board) return;
    var isHidden = board.style.display === 'none';
    board.style.display = isHidden ? '' : 'none';
  };

  // Global: clearMessages()
  window.clearMessages = function(){
    try{ localStorage.removeItem(CONTACT_KEY); }catch(e){}
    renderMessages();
    setMsgStatus('Cleared local messages.', true);
  };

  function initContactBoard(){
    if(!qs('#contact-form')) return;
    renderMessages();
  }

  // ── Auth / Role management ───────────────────────────────────────────────
  //
  // Two modes depending on whether RSS_PLATFORM_BASE_URL is configured:
  //
  //  JWT mode    (platform URL set): credentials sent to /auth/login API,
  //              JWT stored in localStorage. Roles from server-issued token.
  //              Skill downloads use GET /public/v1/skills/{id}/bundle with
  //              Authorization header. Registration supported.
  //
  //  Passkey mode (no platform URL): lightweight client-side passkeys in
  //              localStorage. Works with file:// and static deployments.
  //
  var AUTH_TOKEN_KEY = 'rss_auth_token';   // JWT storage key
  var AUTH_ROLE_KEY  = 'rss_user_role';    // passkey mode role storage
  var AUTH_DEV_PAGES = ['platform.html', 'developers.html'];

  // Role UI metadata (shared by both modes)
  var ROLE_META = {
    enduser:   { label: 'User', icon: '👤', color: '#3b82f6' },
    developer: { label: 'Dev',  icon: '⚙',  color: '#22c55e' }
  };

  // ── Mode detection ────────────────────────────────────────────────────────
  function authApiBase(){ return (window.RSS_PLATFORM_BASE_URL||'').replace(/\/+$/,''); }
  function authIsJwtMode(){ return !!authApiBase(); }

  // ── JWT helpers ────────────────────────────────────────────────────────────
  function authDecodeJwt(token){
    // Decode payload (no sig verification — server enforces that)
    try{
      var parts = token.split('.');
      if(parts.length < 2) return null;
      var pad = parts[1].replace(/-/g,'+').replace(/_/g,'/');
      while(pad.length % 4) pad += '=';
      return JSON.parse(atob(pad));
    }catch(e){ return null; }
  }
  function authGetToken(){ try{ return localStorage.getItem(AUTH_TOKEN_KEY)||''; }catch(e){ return ''; } }
  function authSetToken(t){ try{ localStorage.setItem(AUTH_TOKEN_KEY, t||''); }catch(e){} }
  function authGetJwtPayload(){
    var t = authGetToken();
    return t ? authDecodeJwt(t) : null;
  }

  // ── Passkey helpers (fallback mode) ───────────────────────────────────────
  function authGetPasskeyRole(){ try{ return localStorage.getItem(AUTH_ROLE_KEY)||''; }catch(e){ return ''; } }
  function authSetPasskeyRole(r){ try{ localStorage.setItem(AUTH_ROLE_KEY, r||''); }catch(e){} }

  // ── Unified role / login state ─────────────────────────────────────────────
  function authGetRole(){
    if(authIsJwtMode()){
      var p = authGetJwtPayload();
      if(!p) return '';
      if(p.exp && p.exp < Math.floor(Date.now()/1000)) return ''; // expired
      return p.role || '';
    }
    return authGetPasskeyRole();
  }
  function authIsLoggedIn(){ var r=authGetRole(); return r==='enduser'||r==='developer'; }
  function authIsDev(){       return authGetRole()==='developer'; }
  function authGetUserInfo(){
    if(authIsJwtMode()) return authGetJwtPayload();
    var r = authGetPasskeyRole();
    return r ? { role:r, email:'', name:'' } : null;
  }

  // ── Nav visibility ─────────────────────────────────────────────────────────
  function authApplyNav(){
    var role = authGetRole();
    qsa('.topnav .toplink').forEach(function(a){
      var href = (a.getAttribute('href')||'').split('?')[0].split('#')[0];
      var file = href.split('/').pop();
      if(AUTH_DEV_PAGES.indexOf(file) >= 0){
        a.style.display = (role==='developer') ? '' : 'none';
      }
    });
  }

  // ── Page guard ─────────────────────────────────────────────────────────────
  function authGuardPage(){
    var file = ((location.pathname||'').replace(/\\/g,'/').split('/').pop()||'');
    if(AUTH_DEV_PAGES.indexOf(file) < 0) return;
    if(authGetRole()==='developer') return;

    var layout = qs('.layout');
    if(layout) layout.style.visibility = 'hidden';

    function buildGate(){
      var gate = document.createElement('div');
      gate.id = 'dev-access-gate';
      gate.innerHTML =
        '<div class="dev-gate-box">' +
          '<div class="dev-gate-icon">⚙</div>' +
          '<h2 class="dev-gate-title">Developer Access Required</h2>' +
          '<p class="dev-gate-sub">This page is restricted to RSS skill suppliers and platform developers.</p>' +
          '<button class="btn primary" id="devGateLoginBtn">Sign In as Developer</button>' +
          '<a href="index.html" class="dev-gate-back">← Back to Home</a>' +
        '</div>';
      document.body.appendChild(gate);
      qs('#devGateLoginBtn').addEventListener('click', function(){
        gate.remove();
        authShowSignInModal('developer', function(ok){
          if(ok){ if(layout) layout.style.visibility=''; authApplyNav(); authRenderAccountBtn(); }
          else { buildGate(); }
        });
      });
    }
    buildGate();
  }

  // ── Account button ─────────────────────────────────────────────────────────
  function authInjectAccountBtn(){
    var actions = qs('.top-actions');
    if(!actions || qs('#authAccountBtn')) return;
    var btn = document.createElement('button');
    btn.type='button'; btn.id='authAccountBtn';
    btn.className='iconbtn auth-account-btn';
    btn.setAttribute('aria-label','Account');
    authRenderAccountBtn(btn);
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if(authIsLoggedIn()){ authToggleAccountMenu(btn); }
      else { authShowSignInModal(null, function(ok){ if(ok){ authApplyNav(); authRenderAccountBtn(); } }); }
    });
    actions.insertBefore(btn, actions.firstChild);
  }

  function authRenderAccountBtn(btn){
    btn = btn || qs('#authAccountBtn');
    if(!btn) return;
    var role = authGetRole();
    var meta = ROLE_META[role];
    btn.className = 'iconbtn auth-account-btn' + (meta ? ' auth-active auth-role-'+role : '');
    if(meta){
      var info = authGetUserInfo();
      btn.title = (info && info.email ? info.email+' · ' : '') + meta.label;
      btn.innerHTML = '<span class="icon">'+meta.icon+'</span><span class="label">'+meta.label+'</span>';
    } else {
      btn.title = 'Sign In / Register';
      btn.innerHTML = '<span class="icon">👤</span><span class="label">Sign In</span>';
    }
  }

  // ── Signed-in dropdown ─────────────────────────────────────────────────────
  function authToggleAccountMenu(btn){
    var existing = qs('#authAccountMenu');
    if(existing){ existing.remove(); return; }
    var role = authGetRole();
    var meta = ROLE_META[role] || {};
    var info = authGetUserInfo() || {};
    var menu = document.createElement('div');
    menu.id='authAccountMenu'; menu.className='auth-menu';
    menu.innerHTML =
      '<div class="auth-menu-role">' +
        '<span class="auth-menu-dot" style="background:'+(meta.color||'#888')+'"></span>' +
        '<span>'+(meta.label||'')+'</span>' +
      '</div>' +
      (info.email ? '<div class="auth-menu-note">'+info.email+'</div>' : '') +
      '<div class="auth-menu-note">' +
        (role==='developer' ? 'Full platform access active.' : 'Skill catalog and downloads unlocked.') +
      '</div>' +
      '<button class="auth-menu-logout" id="authSignOutBtn">Sign Out</button>';
    btn.style.position='relative';
    btn.appendChild(menu);
    qs('#authSignOutBtn').addEventListener('click', function(e){ e.stopPropagation(); authLogout(); });
    function onOutside(e){ if(!btn.contains(e.target)){ menu.remove(); document.removeEventListener('click',onOutside); } }
    setTimeout(function(){ document.addEventListener('click',onOutside); }, 0);
  }

  // ── Sign-in / Register modal ───────────────────────────────────────────────
  // preferredRole — pre-selects role tab (null = no preference)
  // onDone(ok)    — called with true after successful login/register
  function authShowSignInModal(preferredRole, onDone){
    var overlay = document.createElement('div');
    overlay.id = 'authModalOverlay';

    function closeModal(){ overlay.remove(); }

    function renderLogin(selectedRole){
      var jwtMode = authIsJwtMode();
      var roleOpts =
        '<div class="auth-role-cards" id="authRoleCards">' +
          '<button class="auth-role-card'+(selectedRole==='enduser'?' selected':'')+'" data-role="enduser">' +
            '<span class="auth-role-card-icon">👤</span>' +
            '<strong>End User</strong>' +
            '<span class="auth-role-card-desc">Browse and download certified robot skills</span>' +
          '</button>' +
          '<button class="auth-role-card'+(selectedRole==='developer'?' selected':'')+'" data-role="developer">' +
            '<span class="auth-role-card-icon">⚙</span>' +
            '<strong>Developer</strong>' +
            '<span class="auth-role-card-desc">Publish skills and access platform tools</span>' +
          '</button>' +
        '</div>';
      overlay.innerHTML =
        '<div class="auth-modal-box" role="dialog" aria-modal="true">' +
          '<div class="auth-modal-title" style="margin-bottom:4px;">Sign In</div>' +
          '<div class="auth-modal-sub" style="margin-bottom:16px;">Sign in to your RobotSkillStore account.</div>' +
          (jwtMode ? roleOpts : '') +
          '<input type="email" id="authEmailInput" class="auth-modal-input" placeholder="Email address" autocomplete="email"/>' +
          '<input type="password" id="authPwInput" class="auth-modal-input" placeholder="Password" autocomplete="current-password"/>' +
          '<div class="auth-modal-err" id="authModalErr"></div>' +
          '<div class="auth-modal-actions">' +
            '<button class="btn primary" id="authSubmitBtn">Sign In</button>' +
            '<button class="auth-modal-cancel" id="authSwitchRegBtn">New here? Register</button>' +
          '</div>' +
          '<button class="auth-modal-cancel" id="authCancelBtn" style="margin-top:14px;">Continue as Visitor</button>' +
        '</div>';
      document.body.contains(overlay) || document.body.appendChild(overlay);

      // Role card selection
      qsa('.auth-role-card', overlay).forEach(function(card){
        card.addEventListener('click', function(){
          qsa('.auth-role-card', overlay).forEach(function(c){ c.classList.remove('selected'); });
          card.classList.add('selected');
        });
      });

      var emailEl = qs('#authEmailInput');
      var pwEl    = qs('#authPwInput');
      var errEl   = qs('#authModalErr');
      setTimeout(function(){ if(emailEl) emailEl.focus(); }, 50);

      function getSelectedRole(){
        var sel = qs('.auth-role-card.selected', overlay);
        return sel ? sel.dataset.role : (selectedRole || 'enduser');
      }

      function showErr(msg){ errEl.textContent=msg; errEl.style.display='block'; }
      function clearErr(){ errEl.style.display='none'; }

      function doLogin(){
        clearErr();
        var email = (emailEl && emailEl.value||'').trim();
        var pw    = (pwEl && pwEl.value||'').trim();
        if(!email || !pw){ showErr('Please enter your email and password.'); return; }

        if(authIsJwtMode()){
          var role = getSelectedRole();
          // JWT login via API
          var btn = qs('#authSubmitBtn'); if(btn) btn.disabled=true;
          fetch(authApiBase()+'/auth/login', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email:email, password:pw})
          })
          .then(function(r){ return r.json().then(function(d){ return {ok:r.ok, data:d}; }); })
          .then(function(res){
            if(btn) btn.disabled=false;
            if(!res.ok){ showErr(res.data.detail||'Sign in failed. Please check your credentials.'); return; }
            authSetToken(res.data.token);
            closeModal();
            if(onDone) onDone(true);
          })
          .catch(function(){ if(btn) btn.disabled=false; showErr('Could not reach the platform. Check your connection.'); });
        } else {
          // Passkey mode: compare against configured passkeys
          var role = getSelectedRole();
          var expected = role==='developer'
            ? (window.RSS_DEV_PASSKEY||'rss-dev-2026')
            : (window.RSS_USER_PASSKEY||'rss-user-2026');
          if(pw===expected){
            authSetPasskeyRole(role);
            closeModal();
            if(onDone) onDone(true);
          } else { showErr('Incorrect access code. Please try again.'); pwEl.value=''; pwEl.focus(); }
        }
      }

      qs('#authSubmitBtn').addEventListener('click', doLogin);
      if(pwEl) pwEl.addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); });
      qs('#authCancelBtn').addEventListener('click', closeModal);
      if(qs('#authSwitchRegBtn')) qs('#authSwitchRegBtn').addEventListener('click', function(){
        if(authIsJwtMode()){ renderRegister(getSelectedRole()); }
        else { renderNoplatformNotice(); }
      });
      overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
    }

    function renderNoplatformNotice(){
      overlay.innerHTML =
        '<div class="auth-modal-box" role="dialog" aria-modal="true">' +
          '<div class="auth-modal-title" style="margin-bottom:4px;">Create Account</div>' +
          '<div class="auth-modal-sub" style="margin-bottom:20px;">' +
            'Account registration requires a connected RSS Platform instance.' +
          '</div>' +
          '<div style="background:var(--vp-c-bg-soft);border-radius:10px;padding:14px 16px;font-size:13px;color:var(--vp-c-text-2);line-height:1.6;">' +
            'To create an account, contact your administrator or connect this site to a live platform by setting <code style="font-family:var(--vp-mono);font-size:12px;">RSS_PLATFORM_BASE_URL</code> in <code style="font-family:var(--vp-mono);font-size:12px;">assets/config.js</code>.' +
          '</div>' +
          '<div style="margin-top:20px;display:flex;gap:12px;">' +
            '<button class="auth-modal-cancel" id="authBackToLoginBtn">← Back to Sign In</button>' +
            '<button class="auth-modal-cancel" id="authCancelBtn">Close</button>' +
          '</div>' +
        '</div>';
      document.body.contains(overlay) || document.body.appendChild(overlay);
      qs('#authBackToLoginBtn').addEventListener('click', function(){ renderLogin(null); });
      qs('#authCancelBtn').addEventListener('click', closeModal);
      overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
    }

    function renderRegister(selectedRole){
      overlay.innerHTML =
        '<div class="auth-modal-box" role="dialog" aria-modal="true">' +
          '<div class="auth-modal-title" style="margin-bottom:4px;">Create Account</div>' +
          '<div class="auth-modal-sub" style="margin-bottom:16px;">Join RobotSkillStore to access skills and downloads.</div>' +
          '<input type="text"     id="authNameInput"   class="auth-modal-input" placeholder="Your name (optional)" autocomplete="name"/>' +
          '<input type="email"    id="authEmailInput"  class="auth-modal-input" placeholder="Email address" autocomplete="email"/>' +
          '<input type="password" id="authPwInput"     class="auth-modal-input" placeholder="Password (min 8 chars)" autocomplete="new-password"/>' +
          '<select id="authRoleSelect" class="auth-modal-input" style="cursor:pointer;">' +
            '<option value="enduser"'   +(selectedRole==='enduser'   ?' selected':'')+'>End User — browse and deploy skills</option>' +
            '<option value="developer"' +(selectedRole==='developer' ?' selected':'')+'>Developer / Supplier — publish and manage skills</option>' +
          '</select>' +
          '<input type="text" id="authInviteInput" class="auth-modal-input" placeholder="Developer invite code" style="display:none;"/>' +
          '<div class="auth-modal-err" id="authModalErr"></div>' +
          '<div class="auth-modal-actions">' +
            '<button class="btn primary" id="authSubmitBtn">Create Account</button>' +
            '<button class="auth-modal-cancel" id="authSwitchLoginBtn">Already have an account?</button>' +
          '</div>' +
          '<button class="auth-modal-cancel" id="authCancelBtn" style="margin-top:14px;">Continue as Visitor</button>' +
        '</div>';
      document.body.contains(overlay) || document.body.appendChild(overlay);

      var nameEl   = qs('#authNameInput');
      var emailEl  = qs('#authEmailInput');
      var pwEl     = qs('#authPwInput');
      var roleEl   = qs('#authRoleSelect');
      var inviteEl = qs('#authInviteInput');
      var errEl    = qs('#authModalErr');
      setTimeout(function(){ if(nameEl) nameEl.focus(); }, 50);

      function showErr(msg){ errEl.textContent=msg; errEl.style.display='block'; }
      function clearErr(){ errEl.style.display='none'; }

      function updateInviteVisibility(){
        inviteEl.style.display = (roleEl.value==='developer') ? '' : 'none';
      }
      roleEl.addEventListener('change', updateInviteVisibility);
      updateInviteVisibility();

      function doRegister(){
        clearErr();
        var email  = (emailEl&&emailEl.value||'').trim();
        var pw     = (pwEl&&pwEl.value||'').trim();
        var name   = (nameEl&&nameEl.value||'').trim();
        var role   = roleEl.value;
        var invite = (inviteEl&&inviteEl.value||'').trim();
        if(!email||!pw){ showErr('Email and password are required.'); return; }
        if(pw.length<8){ showErr('Password must be at least 8 characters.'); return; }

        var body = {email:email, password:pw, name:name, role:role};
        if(role==='developer') body.invite_code = invite;

        var btn = qs('#authSubmitBtn'); if(btn) btn.disabled=true;
        fetch(authApiBase()+'/auth/register', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(body)
        })
        .then(function(r){ return r.json().then(function(d){ return {ok:r.ok, data:d}; }); })
        .then(function(res){
          if(btn) btn.disabled=false;
          if(!res.ok){ showErr(res.data.detail||'Registration failed. Please try again.'); return; }
          authSetToken(res.data.token);
          closeModal();
          if(onDone) onDone(true);
        })
        .catch(function(){ if(btn) btn.disabled=false; showErr('Could not reach the platform. Check your connection.'); });
      }

      qs('#authSubmitBtn').addEventListener('click', doRegister);
      if(pwEl) pwEl.addEventListener('keydown', function(e){ if(e.key==='Enter') doRegister(); });
      qs('#authSwitchLoginBtn').addEventListener('click', function(){ renderLogin(roleEl.value); });
      qs('#authCancelBtn').addEventListener('click', closeModal);
      overlay.addEventListener('click', function(e){ if(e.target===overlay) closeModal(); });
    }

    renderLogin(preferredRole);
    document.body.appendChild(overlay);
  }

  // ── Sign out ───────────────────────────────────────────────────────────────
  function authLogout(){
    authSetToken('');
    authSetPasskeyRole('');
    authRenderAccountBtn();
    authApplyNav();
    var menu = qs('#authAccountMenu');
    if(menu) menu.remove();
    var file = ((location.pathname||'').replace(/\\/g,'/').split('/').pop()||'');
    if(AUTH_DEV_PAGES.indexOf(file)>=0){
      location.href = (location.pathname||'').replace(/[^/]*$/,'index.html');
    }
  }

  // ── Public auth API (used by page-level scripts) ───────────────────────────
  window.RSSAuth = {
    isLoggedIn:  authIsLoggedIn,
    isDev:       authIsDev,
    isJwtMode:   authIsJwtMode,
    getToken:    authGetToken,
    // Call fn() immediately if logged in, else show sign-in modal first
    requireLogin: function(fn){
      if(authIsLoggedIn()){ fn(); return; }
      authShowSignInModal(null, function(ok){
        if(ok){ authApplyNav(); authRenderAccountBtn(); fn(); }
      });
    }
  };

  function initAuth(){
    authInjectAccountBtn();
    authApplyNav();
    authGuardPage();
  }
  // ── End Auth ──────────────────────────────────────────────────────────────

  function init(){
    measureTopbar();
    initTheme();
    initAuth();
    setActiveTopNav();
    inlineLifecycleInOnboarding();
    renderLifecycleBar();
    buildTOC();
    initConceptTabs();
    initIframeAutoHeight();
    initInlineToggleNav();
    bindPlatformLinks();
    initContactBoard();
    enableAnchorOffset();
    bindLangToggle();
    window.addEventListener('resize', measureTopbar);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
