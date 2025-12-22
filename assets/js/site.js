
(function(){
  const root = document.documentElement;

  function setTheme(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
    }else{
      root.removeAttribute('data-theme');
    }
    try{ localStorage.setItem('rss_theme', theme); }catch(e){}
    const icon = document.querySelector('#themeToggle .icon');
    if(icon){ icon.textContent = theme === 'dark' ? '☀' : '☾'; }
  }

  function initTheme(){
    let saved = null;
    try{ saved = localStorage.getItem('rss_theme'); }catch(e){}
    if(saved === 'dark' || saved === 'light'){
      setTheme(saved);
      return;
    }
    // system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  function initToggle(){
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    btn.addEventListener('click', function(){
      const isDark = root.getAttribute('data-theme') === 'dark';
      setTheme(isDark ? 'light' : 'dark');
    });
  }

function setLangPref(lang){
  try{ localStorage.setItem('rss_lang', lang); }catch(e){}
}

function initLangToggle(){
  const btn = document.getElementById('langToggle');
  if(!btn) return;
  btn.addEventListener('click', function(){
    // Use full href replacement for robustness (works for file:// and http(s)://)
    const href = window.location.href || '';
    const isEN = href.includes('/en/');
    const isZH = href.includes('/zh/');
    let target = null;

    if(isEN) target = href.replace('/en/', '/zh/');
    else if(isZH) target = href.replace('/zh/', '/en/');
    else {
      const path = window.location.pathname || '';
      const file = (path.split('/').pop() || 'index.html');
      const current = btn.getAttribute('data-current') || 'en';
      target = (current === 'en') ? ('zh/' + file) : ('en/' + file);
    }

    const nextLang = isEN ? 'zh' : 'en';
    setLangPref(nextLang);
    window.location.href = target;
  });
}

  function slugify(s){
    return s.toLowerCase()
      .replace(/[^a-z0-9\s\-]/g,'')
      .trim()
      .replace(/\s+/g,'-');
  }

  function buildTOC(){
    const toc = document.getElementById('tocNav');
    const content = document.getElementById('content');
    if(!toc || !content) return;

    const headings = content.querySelectorAll('h2[id], h3[id]');
    if(!headings.length){
      toc.innerHTML = '<div class="muted small">No sections</div>';
      return;
    }

    const links = [];
    headings.forEach(h => {
      const level = h.tagName.toLowerCase();
      const id = h.getAttribute('id');
      const text = h.textContent.trim();
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = text;
      if(level === 'h3'){
        a.style.paddingLeft = '18px';
      }
      toc.appendChild(a);
      links.push({id, a});
    });

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      let current = links[0].id;
      for(const item of links){
        const el = document.getElementById(item.id);
        if(!el) continue;
        const top = el.getBoundingClientRect().top + y - 110;
        if(y >= top) current = item.id;
      }
      links.forEach(item => {
        if(item.id === current) item.a.classList.add('active');
        else item.a.classList.remove('active');
      });
    };

    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  initTheme();
  initToggle();
  initLangToggle();
  buildTOC();
})();
