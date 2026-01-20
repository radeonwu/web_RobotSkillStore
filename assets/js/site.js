(function(){
  // ---- helpers ----
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.from((root||document).querySelectorAll(sel)); }

  // ---- topbar height -> CSS var ----
  function measureTopbar(){
    var topbar = qs('.topbar');
    var h = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
    document.documentElement.style.setProperty('--topbar-h', h + 'px');
  }

  // ---- theme toggle ----
  function initTheme(){
    var root = document.documentElement;
    var saved = null;
    try{ saved = localStorage.getItem('rss_theme'); }catch(e){}
    if(saved === 'dark') root.classList.add('theme-dark');
    if(saved === 'light') root.classList.remove('theme-dark');

    var btn = qs('#themeToggle');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var dark = !root.classList.contains('theme-dark');
      root.classList.toggle('theme-dark', dark);
      try{ localStorage.setItem('rss_theme', dark ? 'dark' : 'light'); }catch(e){}
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
          to: 'towu.xiaojun@gmail.com',
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

  // ---- Apple 风格滚动动画 ----
  function initScrollAnimations(){
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('animate-in');
          // 可选：动画后停止观察
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 观察所有需要动画的元素
    var animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el){
      observer.observe(el);
    });
  }

  // ---- 移动端汉堡菜单 ----
  function initMobileMenu(){
    var menuBtn = document.querySelector('.mobile-menu-btn');
    var topnav = document.querySelector('.topnav');

    if(!menuBtn || !topnav) return;

    menuBtn.addEventListener('click', function(){
      menuBtn.classList.toggle('active');
      topnav.classList.toggle('active');

      // 防止背景滚动
      if(topnav.classList.contains('active')){
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow = '';
      }
    });

    // 点击链接后关闭菜单
    var links = topnav.querySelectorAll('.toplink');
    links.forEach(function(link){
      link.addEventListener('click', function(){
        menuBtn.classList.remove('active');
        topnav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  function init(){
    measureTopbar();
    initTheme();
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
    initScrollAnimations(); // Apple 风格滚动动画
    initMobileMenu(); // 移动端汉堡菜单
    window.addEventListener('resize', measureTopbar);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
