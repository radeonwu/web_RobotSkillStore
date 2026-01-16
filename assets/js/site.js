
(function(){
  const root = document.documentElement;

  // --- Auto anchor offset: measure top sticky/fixed bars and expose as CSS var --topbar-h
  function __rss_measureTopbarHeight(){
    const candidates = Array.from(document.querySelectorAll('.topbar, .site-topbar, .navbar, header, nav'));
    let maxH = 0;
    for(const el of candidates){
      try{
        const cs = getComputedStyle(el);
        const pos = (cs.position || '').toLowerCase();
        const top = (cs.top || '').trim();
        if(pos !== 'fixed' && pos !== 'sticky') continue;
        // Only count elements that stick to the very top (top: 0 / 0px)
        if(top !== '0' && top !== '0px') continue;
        const h = el.getBoundingClientRect().height || 0;
        if(h > maxH) maxH = h;
      }catch(e){}
    }
    // Fallback to 64px if we couldn't find a topbar
    if(!maxH || maxH < 40) maxH = 64;
    root.style.setProperty('--topbar-h', Math.round(maxH) + 'px');
  }

  function __rss_scheduleTopbarMeasure(){
    // measure a few times to stabilize (fonts/images can affect height)
    __rss_measureTopbarHeight();
    requestAnimationFrame(__rss_measureTopbarHeight);
    setTimeout(__rss_measureTopbarHeight, 250);
    setTimeout(__rss_measureTopbarHeight, 800);
  }


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

    const headings = content.querySelectorAll('h1[id], h2[id], h3[id]');
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


// v6.16 demo message board
function submitMessage(form){
  const box=document.getElementById('msg-status');
  box.style.display='block';
  box.textContent='Thank you! Your message has been recorded locally (demo only).';
  form.reset();
  return false;
}


/* v6.17 contact backend + evidence */
const RSP_CONTACT_ENDPOINT = "/api/contact"; // configure in deployment (serverless)

function _rsp_nowIso() {
  try { return new Date().toISOString(); } catch(e) { return "" + Date.now(); }
}

function _rsp_makeEvidence(payload, delivery) {
  const id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : ("msg_" + Math.random().toString(16).slice(2));
  const evidence = {
    id,
    type: "contact_message",
    created_at: _rsp_nowIso(),
    message: {
      name: payload.name || "",
      email: payload.email || "",
      text: payload.message || ""
    },
    delivery: delivery || {}
  };
  const outcome = {
    id,
    status: delivery && delivery.ok ? "success" : "accepted_local",
    reason: delivery && delivery.ok ? "delivered" : "stored_locally",
    created_at: evidence.created_at
  };
  const context = {
    page: (typeof location !== "undefined") ? location.pathname : "",
    user_agent: (typeof navigator !== "undefined") ? navigator.userAgent : "",
    endpoint: RSP_CONTACT_ENDPOINT,
    version: "v6.17.0"
  };
  return {
    id,
    files: {
      "message.json": evidence,
      "outcome.json": outcome,
      "execution_context.json": context
    }
  };
}

function _rsp_saveLastEvidence(bundle) {
  try {
    localStorage.setItem("rsp_last_evidence", JSON.stringify(bundle));
  } catch(e) {}
}

function exportLastEvidence() {
  let raw=null;
  try { raw = localStorage.getItem("rsp_last_evidence"); } catch(e) {}
  if (!raw) {
    alert("No evidence found yet. Submit a message first.");
    return;
  }
  const bundle = JSON.parse(raw);
  const zipLike = {
    evidence: bundle.files
  };
  const blob = new Blob([JSON.stringify(zipLike, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rsp_evidence_${bundle.id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function submitMessage(form) {
  // IMPORTANT: must return false synchronously for inline onsubmit="return submitMessage(this);"
  // Otherwise Promise is truthy and the browser submits + reloads.
  (async () => {
    const box = document.getElementById('msg-status');
    const payload = {
      name: form.name.value.trim(),
      email: (form.email && form.email.value) ? form.email.value.trim() : "",
      message: form.message.value.trim(),
      send_email: !!(form.send_email && form.send_email.checked)
    };
    if (!payload.message) return;

    box.style.display='block';
    box.textContent = _rsp_isZh() ? "提交中..." : "Submitting...";

    let delivery = { ok:false, mode:"local" };
    if (payload.send_email) {
      try {
        const res = await fetch(RSP_CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "towu.xiaojun@gmail.com",
            from_name: payload.name,
            from_email: payload.email,
            message: payload.message,
            page: (typeof location !== "undefined") ? location.href : ""
          })
        });
        const j = await res.json().catch(() => ({}));
        delivery = { ok: res.ok, mode:"serverless", status: res.status, response: j };
      } catch(e) {
        delivery = { ok:false, mode:"serverless", error: String(e) };
      }
    }

    const evidenceBundle = _rsp_makeEvidence(payload, delivery);
    _rsp_saveLastEvidence(evidenceBundle);

    const msgRecord = {
      id: evidenceBundle.id,
      name: payload.name || "",
      email: payload.email || "",
      message: payload.message || "",
      created_at: Date.now(),
      delivery,
      evidence: evidenceBundle.files
    };
    const msgs = _rsp_loadMessages();
    msgs.push(msgRecord);
    _rsp_saveMessages(msgs);

    box.textContent = delivery.ok
      ? (_rsp_isZh() ? "已发送并保存（本地）✅ 已生成证据。" : "Sent and saved locally ✅ Evidence generated.")
      : (_rsp_isZh() ? "已保存到本地（演示）✅ 已生成证据。部署后配置 /api/contact 可启用邮件转发。" : "Saved locally (demo) ✅ Evidence generated. Configure /api/contact to enable email relay.");

    form.reset();
    _rsp_renderMessages();
  })();

  return false;
}

/* v6.18 message board rendering + local persistence */
const RSP_MESSAGES_KEY = "rsp_contact_messages";
const RSP_LAST_EVIDENCE_KEY = "rsp_last_evidence";

function _rsp_formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch (e) {
    return String(ts);
  }
}

function _rsp_loadMessages() {
  try {
    const raw = localStorage.getItem(RSP_MESSAGES_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function _rsp_saveMessages(arr) {
  try {
    localStorage.setItem(RSP_MESSAGES_KEY, JSON.stringify(arr));
  } catch (e) {}
}

function _rsp_escape(s) {
  return String(s || "").replace(/[&<>]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[ch]));
}

function _rsp_renderMessages() {
  const list = document.getElementById("message-list");
  const count = document.getElementById("message-count");
  if (!list) return;
  const msgs = _rsp_loadMessages();
  if (count) count.textContent = String(msgs.length);

  if (msgs.length === 0) {
    list.innerHTML = _rsp_isZh()
      ? '<div class="note">暂无留言，欢迎留下第一条。</div>'
      : '<div class="note">No messages yet. Be the first to leave a message.</div>';
    return;
  }

  const html = msgs.slice().sort((a,b) => (b.created_at||0) - (a.created_at||0)).map(m => {
    const name = (m.name && m.name.trim()) ? m.name.trim() : (_rsp_isZh() ? "匿名" : "Anonymous");
    const time = _rsp_formatTime(m.created_at || Date.now());
    const text = _rsp_escape(m.message || "");
    const exportLabel = _rsp_isZh() ? "导出证据" : "Export evidence";
    const delLabel = _rsp_isZh() ? "删除（本地）" : "Delete (local)";
    return `
      <div class="msg-item">
        <div class="msg-meta">
          <div class="msg-name">${_rsp_escape(name)}</div>
          <div class="msg-time">${_rsp_escape(time)}</div>
        </div>
        <div class="msg-text">${text}</div>
        <div class="msg-actions">
          <a href="javascript:void(0)" onclick="exportEvidenceById('${m.id}')">${exportLabel}</a>
          <a href="javascript:void(0)" onclick="deleteMessage('${m.id}')">${delLabel}</a>
        </div>
      </div>
    `;
  }).join("");
  list.innerHTML = html;
}

function toggleMessageBoard() {
  const board = document.getElementById("message-board");
  if (!board) return;
  const hidden = board.style.display === "none";
  board.style.display = hidden ? "block" : "none";
}

function clearMessages() {
  const msg = _rsp_isZh() ? "确认清空全部本地留言？" : "Clear all local messages?";
  if (!confirm(msg)) return;
  _rsp_saveMessages([]);
  _rsp_renderMessages();
}

function deleteMessage(id) {
  const msgs = _rsp_loadMessages().filter(m => m.id !== id);
  _rsp_saveMessages(msgs);
  _rsp_renderMessages();
}

function exportEvidenceById(id) {
  const msgs = _rsp_loadMessages();
  const m = msgs.find(x => x.id === id);
  if (!m || !m.evidence) {
    alert(_rsp_isZh() ? "未找到该留言的证据。" : "No evidence found for this message.");
    return;
  }
  const blob = new Blob([JSON.stringify({ evidence: m.evidence }, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rsp_evidence_${id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Override exportLastEvidence to reuse last evidence key */
function exportLastEvidence() {
  let raw=null;
  try { raw = localStorage.getItem(RSP_LAST_EVIDENCE_KEY); } catch(e) {}
  if (!raw) {
    alert(_rsp_isZh() ? "暂无证据。请先提交留言。" : "No evidence found yet. Submit a message first.");
    return;
  }
  const bundle = JSON.parse(raw);
  const blob = new Blob([JSON.stringify({ evidence: bundle.files }, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rsp_evidence_${bundle.id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Override submitMessage to: send (optional), generate evidence, append to message list */
async function submitMessage(form) {
  const box = document.getElementById('msg-status');
  const payload = {
    name: form.name.value.trim(),
    email: (form.email && form.email.value) ? form.email.value.trim() : "",
    message: form.message.value.trim(),
    send_email: !!(form.send_email && form.send_email.checked)
  };
  if (!payload.message) return false;

  box.style.display='block';
  box.textContent = _rsp_isZh() ? "提交中..." : "Submitting...";

  let delivery = { ok:false, mode:"local" };
  if (payload.send_email) {
    try {
      const res = await fetch(RSP_CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "towu.xiaojun@gmail.com",
          from_name: payload.name,
          from_email: payload.email,
          message: payload.message,
          page: (typeof location !== "undefined") ? location.href : ""
        })
      });
      const j = await res.json().catch(() => ({}));
      delivery = { ok: res.ok, mode:"serverless", status: res.status, response: j };
    } catch(e) {
      delivery = { ok:false, mode:"serverless", error: String(e) };
    }
  }

  const evidenceBundle = _rsp_makeEvidence(payload, delivery);
  _rsp_saveLastEvidence(evidenceBundle);

  const msgRecord = {
    id: evidenceBundle.id,
    name: payload.name || "",
    email: payload.email || "",
    message: payload.message || "",
    created_at: Date.now(),
    delivery,
    evidence: evidenceBundle.files
  };
  const msgs = _rsp_loadMessages();
  msgs.push(msgRecord);
  _rsp_saveMessages(msgs);

  box.textContent = delivery.ok
    ? (_rsp_isZh() ? "已发送并保存（本地）✅ 已生成证据。" : "Sent and saved locally ✅ Evidence generated.")
    : (_rsp_isZh() ? "已保存到本地（演示）✅ 已生成证据。部署后配置 /api/contact 可启用邮件转发。" : "Saved locally (demo) ✅ Evidence generated. Configure /api/contact to enable email relay.");

  form.reset();
  _rsp_renderMessages();
  return false;
}

function _rsp_isZh() {
  try { return (document.documentElement.lang || "").toLowerCase().startsWith("zh"); } catch(e) { return false; }
}


// --- Docs inline tab groups (no navigation) ---
function initTabGroups(){
  const groups = document.querySelectorAll('[data-tabgroup]');
  if(!groups.length) return;

  function activate(groupEl, tab){
    const group = groupEl.getAttribute('data-tabgroup');
    // pills
    groupEl.querySelectorAll('.pill-link').forEach(btn=>{
      const t = btn.getAttribute('data-tab');
      if(t === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    // panels
    document.querySelectorAll('[data-tabpanel-group="'+group+'"]').forEach(panel=>{
      const p = panel.getAttribute('data-panel');
      panel.style.display = (p === tab) ? '' : 'none';
    });
  }

  groups.forEach(groupEl=>{
    // initial
    const active = groupEl.querySelector('.pill-link.active');
    const first = groupEl.querySelector('.pill-link');
    const initTab = (active && active.getAttribute('data-tab')) || (first && first.getAttribute('data-tab'));
    if(initTab) activate(groupEl, initTab);

    groupEl.querySelectorAll('.pill-link').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if(!tab) return;
        activate(groupEl, tab);
      });
    });
  });

  // Links that jump to a tab (but stay on the same page)
  document.querySelectorAll('[data-tab-jump]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const spec = a.getAttribute('data-tab-jump') || '';
      const parts = spec.split(':');
      if(parts.length !== 2) return;
      const group = parts[0], tab = parts[1];
      const groupEl = document.querySelector('[data-tabgroup="'+group+'"]');
      if(!groupEl) return;
      e.preventDefault();
      activate(groupEl, tab);
      const panel = document.querySelector('[data-tabpanel-group="'+group+'"][data-panel="'+tab+'"]');
      if(panel) panel.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}

// Inline pillbar toggle nav (used by Docs RSS/RSP summaries, etc.)
function initInlineToggleNav(){
  // Avoid initial anchor-jump to a tab panel (can scroll to bottom on page entry)
  try {
    if (typeof location !== "undefined" && location.hash) {
      if (history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      window.scrollTo(0, 0);
    }
  } catch (e) {}

  // Docs uses `hidden` to control visibility, while some older pages used `active`.
  // This implementation supports BOTH.
  // Requirements:
  //  - .pillbar[data-toggle-group] contains .pill elements with data-toggle-target
  //  - Panels have id=<data-toggle-target> and data-panel=<group>

  function setPills(bar, targetId){
    const pills = bar.querySelectorAll('.pill');
    pills.forEach((p) => {
      const tid = p.getAttribute('data-toggle-target');
      const isActive = tid === targetId;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function getScope(bar){
    // Prefer an explicit scope wrapper to avoid cross-page / duplicate-ID interference.
    // Falls back to the nearest section/card container, then the document.
    return (
      bar.closest('[data-toggle-scope]') ||
      bar.closest('section') ||
      bar.closest('.card') ||
      document
    );
  }

  function setPanels(scope, group, targetId){
    const panels = scope.querySelectorAll(`[data-panel="${group}"]`);
    panels.forEach((panel) => {
      // Support both styles
      if (panel.classList.contains('active')) panel.classList.remove('active');
      if (!panel.classList.contains('hidden')) panel.classList.add('hidden');
    });

    // Query inside scope first; fallback to global by id.
    let target = null;
    try {
      // CSS.escape is not available in some older browsers; this is best-effort.
      const sel = '#' + (window.CSS && CSS.escape ? CSS.escape(targetId) : targetId);
      target = scope.querySelector(sel);
    } catch (e) {
      target = null;
    }
    if (!target) target = document.getElementById(targetId);
    if (!target) return;

    // Show target
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  function activate(bar, group, targetId, updateHash=true){
    if (!bar || !group || !targetId) return;
    const scope = getScope(bar);
    setPills(bar, targetId);
    setPanels(scope, group, targetId);

    // Persist selection (best-effort)
    try { sessionStorage.setItem('tabgroup:'+group, targetId); } catch (e) {}

    // Update hash (without jumping)
    if(updateHash){
      try {
        if (history && history.replaceState) {
          history.replaceState(null, '', '#' + targetId);
        }
      } catch (e) {}
    }
  }

  // Initialize every tab group on the page
  document.querySelectorAll('.pillbar[data-toggle-group]').forEach((bar) => {
    const group = bar.getAttribute('data-toggle-group');

    // Delegated click
    bar.addEventListener('click', (e) => {
      const pill = e.target && e.target.closest ? e.target.closest('.pill') : null;
      if (!pill || !bar.contains(pill)) return;
      e.preventDefault();
      const href = pill.getAttribute('href');
      const targetId = pill.getAttribute('data-toggle-target')
        || pill.getAttribute('data-tab')
        || (href && href.startsWith('#') ? href.slice(1) : null);
      activate(bar, group, targetId);
    });

    // Initial state: restore or default to first pill
    let initial = null;
    try { initial = sessionStorage.getItem('tabgroup:'+group); } catch (e) { initial = null; }

    const pills = bar.querySelectorAll('.pill');
    const first = pills && pills.length ? pills[0].getAttribute('data-toggle-target') : null;
    const chosen = initial || first;
    if (chosen) activate(bar, group, chosen, false);
  });
}


// Expose for older builds that call window.initInlineToggleNav()
window.initInlineToggleNav = initInlineToggleNav;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof location !== "undefined" && location.pathname && location.pathname.includes("contact.html")) {
    _rsp_renderMessages();
  }
});

/* v6.19 demo D2 mock runner + evidence */
const RSP_DEMO_EVIDENCE_KEY = "rsp_last_demo_evidence";

function _rsp_demo_setStatus(msg) {
  const el = document.getElementById("rsp-demo-status");
  if (!el) return;
  el.style.display = "block";
  el.textContent = msg;
}

function _rsp_demo_setEvidence(obj) {
  const pre = document.getElementById("rsp-demo-evidence");
  if (!pre) return;
  const code = pre.querySelector("code");
  if (!code) return;
  code.textContent = JSON.stringify(obj, null, 2);
}

function _rsp_demo_renderTimeline(items) {
  const box = document.getElementById("rsp-demo-timeline");
  if (!box) return;
  box.innerHTML = items.map(it => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-body">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div class="tl-title">${_rsp_escape(it.title)}</div>
          <div class="tl-badge">${_rsp_escape(it.status)}</div>
        </div>
        <div class="tl-meta">${_rsp_escape(it.component)} · ${_rsp_escape(it.time)}</div>
      </div>
    </div>
  `).join("");
}

function _rsp_demo_makeId() {
  try {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
  } catch(e) {}
  return "demo_" + Math.random().toString(16).slice(2);
}

function _rsp_demo_nowIso() {
  try { return new Date().toISOString(); } catch(e) { return "" + Date.now(); }
}

function _rsp_demo_rand(n=1.0) {
  return Math.round((0.6 + Math.random()*0.8) * n * 1000) / 1000;
}

function _rsp_demo_makeEvidence(lang) {
  const id = _rsp_demo_makeId();
  const t0 = Date.now();
  const iso = _rsp_demo_nowIso();

  // mock binding
  const binding = {
    frames: {
      base: { link: "base_link", pose: { x: 0, y: 0, z: 0, roll: 0, pitch: 0, yaw: 0 } },
      tcp:  { link: "tool0",     offset: { x: 0, y: 0, z: 0.18, roll: 0, pitch: 0, yaw: 0 } },
    },
    env: {
      mode: "sim",
      simulator: "pybullet",
      scene: "tabletop",
      seed: Math.floor(Math.random()*1e6)
    }
  };

  // skill spec (minimal)
  const skill_spec = {
    id: "skill.ur5.reach_target_pose",
    version: "0.1.0",
    intent: { goal: "reach_target_pose" },
    context: { robot: "ur5", frames: { base: "base_link", tcp: "tool0" } },
    constraints: {
      speed_limit: 0.25,
      force_limit: 40,
      timeout_s: 8
    },
    outcomes: {
      success: { criteria: "TCP within tolerance at target pose" }
    },
    evidence: {
      required: ["runtime.log","metrics.json","tcp_trace.csv","outcome.json","execution_context.yaml"]
    }
  };

  // mock exec + possibly violation
  const violated = Math.random() < 0.18; // 18% fail-fast
  const metrics = {
    duration_s: Math.round((1.8 + Math.random()*1.6) * 1000) / 1000,
    tcp_error_m: violated ? _rsp_demo_rand(0.02) : _rsp_demo_rand(0.004),
    constraint_violations: violated ? ["tcp_error_too_large"] : [],
  };

  const outcome = {
    id,
    created_at: iso,
    status: violated ? "failed" : "success",
    reason: violated ? "constraint_violation" : "completed",
    metrics
  };

  const exec = {
    id,
    created_at: iso,
    trace: [
      { ts: t0+0,   event: "skill_selected" },
      { ts: t0+120, event: "context_bound" },
      { ts: t0+240, event: "constraints_checked" },
      { ts: t0+420, event: "execution_started" },
      { ts: t0+1200, event: violated ? "aborted" : "execution_finished" },
    ]
  };

  const evidence = {
    "skill.json": skill_spec,
    "binding.json": binding,
    "execution.json": exec,
    "outcome.json": outcome,
    "meta.json": {
      type: "demo_reference_execution",
      lang,
      created_at: iso,
      version: "v6.19.0",
      note: "Mock Run in browser. Wire to POST /runs to request a platform-managed Run (policy-gated, auditable)."
    }
  };

  // timeline items
  const tl = [
    { title: lang==="zh" ? "选择技能" : "Skill Selected", component: "Agent", status: "ok" },
    { title: lang==="zh" ? "绑定上下文（Base/TCP/Env）" : "Context Bound (Base/TCP/Env)", component: "Runtime", status: "ok" },
    { title: lang==="zh" ? "检查与强制约束" : "Constraints Enforced", component: "Runtime", status: violated ? "violated" : "ok" },
    { title: lang==="zh" ? "开始执行" : "Execution Started", component: "Runtime", status: "ok" },
    { title: violated ? (lang==="zh" ? "快速失败并输出证据" : "Fail-fast + Evidence") : (lang==="zh" ? "执行完成并输出证据" : "Finished + Evidence"),
       component: "Runtime", status: violated ? "failed" : "success" },
  ].map((it, i) => ({
    ...it,
    time: new Date(t0 + i*250).toLocaleTimeString()
  }));

  return { id, evidence, tl, outcome };
}

function rspRunDemo(lang) {
  // Ensure on demo page
  const tlBox = document.getElementById("rsp-demo-timeline");
  const evBox = document.getElementById("rsp-demo-evidence");
  if (!tlBox || !evBox) {
    return;
  }

  _rsp_demo_setStatus(lang==="zh" ? "运行中（mock）..." : "Running (mock)...");
  const run = _rsp_demo_makeEvidence(lang || "en");

  // simulate async steps for nicer UX
  _rsp_demo_renderTimeline(run.tl.slice(0,1));
  setTimeout(() => _rsp_demo_renderTimeline(run.tl.slice(0,2)), 160);
  setTimeout(() => _rsp_demo_renderTimeline(run.tl.slice(0,3)), 320);
  setTimeout(() => _rsp_demo_renderTimeline(run.tl.slice(0,4)), 520);
  setTimeout(() => {
    _rsp_demo_renderTimeline(run.tl);
    _rsp_demo_setEvidence(run.evidence);
    try { localStorage.setItem(RSP_DEMO_EVIDENCE_KEY, JSON.stringify(run)); } catch(e) {}
    const msg = run.outcome.status === "success"
      ? (lang==="zh" ? "✅ 成功：已生成证据包（可下载）" : "✅ Success: evidence bundle generated (downloadable)")
      : (lang==="zh" ? "⚠️ 失败（快速失败）：已生成证据包（可下载）" : "⚠️ Failed (fail-fast): evidence bundle generated (downloadable)");
    _rsp_demo_setStatus(msg);
  }, 860);
}

function rspDownloadLastDemoEvidence() {
  let raw=null;
  try { raw = localStorage.getItem(RSP_DEMO_EVIDENCE_KEY); } catch(e) {}
  if (!raw) {
    alert(_rsp_isZh() ? "暂无 Demo 证据。请先点击运行。" : "No demo evidence yet. Click Run first.");
    return;
  }
  const run = JSON.parse(raw);
  const blob = new Blob([JSON.stringify({ evidence: run.evidence }, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rsp_demo_evidence_${run.id}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
/* v6.22 public skill status (Website ↔ Platform linkage) */
(function(){
  function _rss_apiBase(){
    // Allow override by setting window.RSS_PUBLIC_API_BASE before site.js loads.
    // Default: same origin.
    try { return (window.RSS_PUBLIC_API_BASE || '').replace(/\/$/, ''); } catch(e){ return ''; }
  }

  function _rss_timeout(ms){
    return new Promise((_, rej)=>setTimeout(()=>rej(new Error('timeout')), ms));
  }

  async function _rss_fetchJson(url, opts){
    const o = opts || {};
    const timeoutMs = o.timeoutMs || 2500;
    const res = await Promise.race([
      fetch(url, {headers: o.headers || {}}),
      _rss_timeout(timeoutMs)
    ]);
    if(!res || !res.ok) throw new Error('http');
    return await res.json();
  
function _rss_assetsPrefix(){
  // Works for /en/*.html, /zh/*.html, and docs subpages.
  const p = (location && location.pathname ? location.pathname : "").replace(/\\/g, "/");
  if (p.includes("/en/docs/") || p.includes("/zh/docs/")) return "../../assets";
  return "../assets";
}

async function _rss_fetchLocalJson(relPath){
  const res = await fetch(relPath);
  if(!res || !res.ok) throw new Error("local_http");
  return await res.json();
}

}

  function _rss_fmtPct(x){
    if(x === null || x === undefined || isNaN(x)) return '—';
    return (Math.round(x*1000)/10).toFixed(1) + '%';
  }

  function _rss_fmtNum(n){
    if(n === null || n === undefined || isNaN(n)) return '—';
    return String(n);
  }

  function _rss_cardHtml(item){
    const name = item.name || item.skill_id;
    const latest = item.latest_version || '—';
    const runs = (item.runs_30d !== undefined) ? item.runs_30d : (item.runs || '—');
    const sr = (item.success_rate_30d !== undefined) ? item.success_rate_30d : item.success_rate;
    const robots = item.robots_supported || item.robots_supported_count || '—';
    const maturity = item.maturity || '';

    return `
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
          <div>
            <div class="card-title">${_rsp_escape(name)}</div>
            <div class="status-muted">${_rsp_escape(item.skill_id || '')}</div>
          </div>
          ${maturity ? `<div class="status-badge">${_rsp_escape(maturity)}</div>` : ''}
        </div>
        <div class="status-row" style="margin-top:10px;">
          <div class="status-pill"><span class="k">Latest</span><span class="v">${_rsp_escape(latest)}</span></div>
          <div class="status-pill"><span class="k">Runs(30d)</span><span class="v">${_rsp_escape(_rss_fmtNum(runs))}</span></div>
          <div class="status-pill"><span class="k">Success</span><span class="v">${_rsp_escape(_rss_fmtPct(sr))}</span></div>
          <div class="status-pill"><span class="k">Robots</span><span class="v">${_rsp_escape(_rss_fmtNum(robots))}</span></div>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
          <a class="btn ghost" href="skills/${_rsp_escape(item.skill_id)}.html">Concept</a>
          <a class="btn secondary" href="https://platform.robotskill.store/skills/${_rsp_escape(item.skill_id)}">Open in Platform</a>
        </div>
      </div>
    `;
  }

  function _rss_saveCache(key, obj){
    try{ localStorage.setItem(key, JSON.stringify({t:Date.now(), v:obj})); }catch(e){}
  }

  function _rss_loadCache(key, maxAgeMs){
    try{
      const raw = localStorage.getItem(key);
      if(!raw) return null;
      const o = JSON.parse(raw);
      if(!o || !o.t) return null;
      if(maxAgeMs && (Date.now()-o.t) > maxAgeMs) return null;
      return o.v;
    }catch(e){ return null; }
  }

  async function rssGetPublicSkills(){
    const cacheKey = 'rss_public_skills_cache_v1';
    const cached = _rss_loadCache(cacheKey, 10*60*1000);
    if(cached) return cached;

    const base = _rss_apiBase();
    const url = base + '/api/public/v1/skills';
    const data = await _rss_fetchJson(url, {timeoutMs: 2500});
    _rss_saveCache(cacheKey, data);
    return data;
  }

  async function rssGetPublicSkill(skillId){
    const cacheKey = 'rss_public_skill_' + skillId;
    const cached = _rss_loadCache(cacheKey, 10*60*1000);
    if(cached) return cached;

    const base = _rss_apiBase();
    const url = base + '/api/public/v1/skills/' + encodeURIComponent(skillId);
    const data = await _rss_fetchJson(url, {timeoutMs: 2500});
    _rss_saveCache(cacheKey, data);
    return data;
  }

  window.rssRenderPublicSkillsList = async function(containerId){
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = '<div class="muted small">Loading...</div>';

    try{
      const items = await rssGetPublicSkills();
      if(!items || !items.length){
        el.innerHTML = '<div class="muted small">No public skills yet.</div>';
        return;
      }
      el.innerHTML = items.map(_rss_cardHtml).join('');
    }catch(e){
      const cached = _rss_loadCache('rss_public_skills_cache_v1');
      if(cached && cached.length){
        el.innerHTML = cached.map(_rss_cardHtml).join('');
        return;
      }
      el.innerHTML = '<div class="muted small">Platform public API not reachable. (Tip: deploy a reverse proxy so this site can reach <code>/api/public/v1</code>.)</div>';
    }
  };

  window.rssRenderSkillStatusCard = async function(containerId){
    const el = document.getElementById(containerId);
    if(!el) return;
    const skillId = el.getAttribute('data-skill-id') || '';
    if(!skillId) return;

    el.innerHTML = '<div class="muted small">Loading...</div>';

    function render(data){
      const latest = data.latest_version || '—';
      const runs = data.stats_30d ? data.stats_30d.runs : data.runs_30d;
      const sr = data.stats_30d ? data.stats_30d.success_rate : data.success_rate_30d;
      const p50 = data.stats_30d ? data.stats_30d.p50_cycle_time_s : data.p50_cycle_time_s;
      const robots = data.robots_supported || (data.compatibility && data.compatibility.robots ? data.compatibility.robots.length : '—');

      el.innerHTML = `
        <div class="status-row">
          <div class="status-pill"><span class="k">Latest</span><span class="v">${_rsp_escape(latest)}</span></div>
          <div class="status-pill"><span class="k">Runs(30d)</span><span class="v">${_rsp_escape(_rss_fmtNum(runs))}</span></div>
          <div class="status-pill"><span class="k">Success</span><span class="v">${_rsp_escape(_rss_fmtPct(sr))}</span></div>
          <div class="status-pill"><span class="k">p50</span><span class="v">${_rsp_escape(_rss_fmtNum(p50))}</span></div>
          <div class="status-pill"><span class="k">Robots</span><span class="v">${_rsp_escape(_rss_fmtNum(robots))}</span></div>
        </div>
      `;
    }

    try{
      const data = await rssGetPublicSkill(skillId);
      render(data);
    }catch(e){
      const cached = _rss_loadCache('rss_public_skill_' + skillId);
      if(cached){ render(cached); return; }
      el.innerHTML = '<div class="muted small">No public status available.</div>';
    }
  };
})();

/* v6.22 Platform-linked Skill Status (public, read-only)
 * - Website fetches Platform public endpoints:
 *   GET /public/v1/skills
 *   GET /public/v1/skills/{skill_id}
 * - Safe boundary: aggregated only, no run_id/artifact URLs.
 */

function _rss_publicBase() {
  try {
    if (typeof window !== "undefined" && window.RSS_PUBLIC_API_BASE) {
      return String(window.RSS_PUBLIC_API_BASE).replace(/\/+$/,'');
    }
  } catch(e) {}
  return ""; // same-origin by default (use gateway/proxy in deployment)
}

function _rss_platformAppBase() {
  // Allow override: window.RSS_PLATFORM_APP_BASE = "https://platform.example.com"
  try {
    if (typeof window !== "undefined" && window.RSS_PLATFORM_APP_BASE) {
      return String(window.RSS_PLATFORM_APP_BASE).replace(/\/+$/,'');
    }
  } catch(e) {}
  // default: same origin (e.g., via gateway reverse proxy) under /platform
  return "";
}


function _rss_withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

async function _rss_fetchJson(path) {
  const base = _rss_publicBase();
  const url = base + path;
  const res = await _rss_withTimeout(fetch(url, { headers: { "Accept": "application/json" }}), 6000);
  if (!res.ok) throw new Error("http_" + res.status);
  return await res.json();
}

function _rss_fmtPct(x) {
  if (x === null || x === undefined || isNaN(x)) return "--";
  const v = Math.round(Number(x) * 1000) / 10;
  return v.toFixed(1) + "%";
}

function _rss_fmtNum(x) {
  if (x === null || x === undefined || isNaN(x)) return "--";
  const n = Number(x);
  if (n >= 1000000) return (Math.round(n/100000)/10) + "M";
  if (n >= 1000) return (Math.round(n/100)/10) + "K";
  return String(Math.round(n));
}

function _rss_escape(s) {
  try { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); } catch(e) { return ""; }
}

function _rss_isZhSafe() {
  try { return (document.documentElement.lang || "").toLowerCase().startsWith("zh"); } catch(e) { return false; }
}

function _rss_statusCardHTML(d) {
  const zh = _rss_isZhSafe();
  const title = zh ? "平台状态" : "Platform Status";
  const note = zh ? "数据来自 RSS Platform public API（聚合统计）" : "Data from RSS Platform public API (aggregated).";
  const latest = d && d.latest_version ? d.latest_version : "--";
  const runs = d && d.stats_30d && typeof d.stats_30d.runs === "number" ? d.stats_30d.runs : (d && typeof d.runs_30d === "number" ? d.runs_30d : null);
  const succ = d && d.stats_30d ? d.stats_30d.success_rate : (d ? d.success_rate_30d : null);
  const p50 = d && d.stats_30d ? d.stats_30d.p50_cycle_time_s : (d ? d.p50_cycle_time_s : null);
  const robots = d && d.compatibility && Array.isArray(d.compatibility.robots) ? d.compatibility.robots.length : (d && typeof d.robots_supported === "number" ? d.robots_supported : null);

  return `
    <div class="card">
      <div class="status-row">
        <div class="card-title">${_rss_escape(title)}</div>
        <span class="status-pill">${_rss_escape("v" + latest)}</span>
      </div>
      <div class="status-kpis">
        <div class="kpi">
          <div class="kpi-label">${zh ? "近30天运行次数" : "Runs (30d)"}</div>
          <div class="kpi-value">${_rss_escape(_rss_fmtNum(runs))}</div>
          <div class="kpi-sub">${zh ? "仅公开聚合" : "Public aggregation only"}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">${zh ? "成功率(30d)" : "Success rate (30d)"}</div>
          <div class="kpi-value">${_rss_escape(_rss_fmtPct(succ))}</div>
          <div class="kpi-sub">${zh ? "按 succeeded/failed" : "Succeeded / (succeeded+failed)"}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">${zh ? "周期时间 P50" : "Cycle time P50"}</div>
          <div class="kpi-value">${p50 === null || p50 === undefined || isNaN(p50) ? "--" : _rss_escape((Math.round(Number(p50)*10)/10).toFixed(1) + "s")}</div>
          <div class="kpi-sub">${zh ? "近30天" : "Last 30 days"}</div>
        </div>
        <div class="kpi">
          <div class="kpi-label">${zh ? "支持机器人" : "Robots supported"}</div>
          <div class="kpi-value">${_rss_escape(_rss_fmtNum(robots))}</div>
          <div class="kpi-sub">${zh ? "摘要展示" : "Summary"}</div>
        </div>
      </div>
      <div class="small-note">${_rss_escape(note)}</div>
    </div>
  `;
}

async function rssRenderSkillStatus(skillId, containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  box.setAttribute('data-rss-skill-status','1');
  box.setAttribute('data-skill-id', skillId);
  box.innerHTML = `<div class="card"><div class="card-title">${_rss_isZhSafe() ? "平台状态" : "Platform Status"}</div><div class="status-muted">${_rss_isZhSafe() ? "加载中..." : "Loading..."}</div></div>`;
  try {
    const d = await _rss_fetchJson(`/public/v1/skills/${encodeURIComponent(skillId)}`);
    box.innerHTML = _rss_statusCardHTML(d);
  } catch(e) {
    box.innerHTML = `<div class="card"><div class="card-title">${_rss_isZhSafe() ? "平台状态" : "Platform Status"}</div><div class="status-muted">${_rss_isZhSafe() ? "无法从平台获取公开状态（可能未启用 public stats 或未部署反代）。" : "Unable to load public status from Platform (public stats may be disabled or proxy not configured)."}</div></div>`;
  }
}

function _rss_skillRowHTML(it, basePath) {
  const zh = _rss_isZhSafe();
  const href = (basePath || "") + (it.skill_id ? `skills/${encodeURIComponent(it.skill_id)}.html` : "#");
  const name = it.name || it.skill_id || "";
  const cat = it.category || "";
  const maturity = it.maturity || "";
  const latest = it.latest_version || "--";
  const runs = (typeof it.runs_30d === "number") ? it.runs_30d : null;
  const succ = (typeof it.success_rate_30d === "number") ? it.success_rate_30d : null;
  const robots = (typeof it.robots_supported === "number") ? it.robots_supported : null;

  return `
    <tr>
      <td>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <a href="${_rss_escape(href)}"><strong>${_rss_escape(name)}</strong></a>
          <div class="status-muted">${_rss_escape(cat)}</div>
        </div>
      </td>
      <td><span class="pill">${_rss_escape(maturity || (zh ? "—" : "--"))}</span></td>
      <td><span class="pill">v${_rss_escape(latest)}</span></td>
      <td>${_rss_escape(_rss_fmtNum(runs))}</td>
      <td>${_rss_escape(_rss_fmtPct(succ))}</td>
      <td>${_rss_escape(_rss_fmtNum(robots))}</td>
    </tr>
  `;
}

async function rssRenderPublicSkillsList(containerId, basePath) {
  const box = document.getElementById(containerId);
  if (!box) return;
  const zh = _rss_isZhSafe();
  // IMPORTANT:
  // Many users open pages via file://. In that mode, JS may partially run and then fail
  // (or fetch may be blocked), which would leave the page blank if we wipe existing HTML.
  // Therefore, keep any static fallback content already in the container, and only
  // render a loading card if the container is empty.
  const hasStaticFallback = !!box.querySelector('table, .skills-table, .card');
  if (!hasStaticFallback) {
    box.innerHTML = `<div class="card"><div class="card-title">${zh ? "技能目录" : "Skills Catalog"}</div><div class="status-muted">${zh ? "加载中..." : "Loading..."}</div></div>`;
  }
  let items = null;
  let offline = false;

  // Built-in offline preview data (works even when opening via file:// where fetch() may be restricted).
  const builtinOffline = [
    {
      skill_id: "pick",
      name: zh ? "抓取" : "Pick",
      category: zh ? "装配/搬运" : "Assembly/Handling",
      maturity: "beta",
      latest_version: "0.1.0",
      runs_30d: 42,
      success_rate_30d: 0.93,
      robots_supported: 2
    },
    {
      skill_id: "insert",
      name: zh ? "插入" : "Insert",
      category: zh ? "装配/插接" : "Assembly/Insertion",
      maturity: "alpha",
      latest_version: "0.1.0",
      runs_30d: 27,
      success_rate_30d: 0.81,
      robots_supported: 2
    },
    {
      skill_id: "tighten_screw",
      name: zh ? "拧螺丝" : "Screw Tighten",
      category: zh ? "装配/紧固" : "Assembly/Fastening",
      maturity: "alpha",
      latest_version: "0.1.0",
      runs_30d: 18,
      success_rate_30d: 0.78,
      robots_supported: 1
    }
  ];

  try {
    // Preferred: platform public aggregation endpoint (via reverse proxy).
    items = await _rss_fetchJson(`/public/v1/skills`);
  } catch (e) {
    // Fallback: offline preview data (useful when opening via file:// or before proxy is configured).
    try {
      items = await _rss_fetchLocalJson(`${_rss_assetsPrefix()}/data/public_skills.json`);
      offline = true;
    } catch (e2) {
      items = builtinOffline;
      offline = true;
    }
  }

  // If we are rendering into the dynamic container and the platform is not connected,
  // keep the static preview table untouched (do not duplicate the offline table).
  if (offline && /-dyn$/.test(containerId)) {
    return;
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    // If we already have static fallback, do not wipe it.
    if (!hasStaticFallback) {
      box.innerHTML = `<div class="card"><div class="card-title">${zh ? "平台公开 API 不可达" : "Platform public API not reachable"}</div><div class="status-muted">${zh ? "提示：请用本地静态服务器打开本站（避免 file:// 限制），并配置反向代理使本站可访问 /public/v1/skills。" : "Tip: serve this site with a local static server (avoid file://), and configure a reverse proxy so this site can reach /public/v1/skills."}</div></div>`;
    }
    return;
  }

  const html = `
    <table class="skills-table">
      <thead>
        <tr>
          <th>${zh ? "技能" : "Skill"}</th>
          <th>${zh ? "成熟度" : "Maturity"}</th>
          <th>${zh ? "最新版本" : "Latest"}</th>
          <th>${zh ? "运行(30d)" : "Runs(30d)"}</th>
          <th>${zh ? "成功率(30d)" : "Success(30d)"}</th>
          <th>${zh ? "机器人" : "Robots"}</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(it => _rss_skillRowHTML(it, basePath)).join('')}
      </tbody>
    </table>
    <div class="small-note">${offline
      ? (zh ? "离线预览数据：未连接平台，仅用于展示页面布局。" : "Offline preview data: platform not connected; for layout preview only.")
      : (zh ? "注：仅展示 visibility=public 且允许公开聚合的技能。" : "Note: only visibility=public skills that allow public aggregation are shown.")}
    </div>
  `;
  box.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  // Skills page: prefer dynamic container if present.
  const listDyn = document.getElementById("rss-public-skills-dyn");
  const listLegacy = document.getElementById("rss-public-skills");
  if (listDyn) {
    rssRenderPublicSkillsList("rss-public-skills-dyn", "");
  } else if (listLegacy) {
    rssRenderPublicSkillsList("rss-public-skills", "");
  }

  const links = document.querySelectorAll("[data-rss-platform-skill-link]");
  if (links && links.length) {
    const base = _rss_platformAppBase();
    links.forEach(a => {
      const sid = a.getAttribute("data-rss-platform-skill-link") || "";
      if (!sid) return;
      // if base provided, use it; else default to '/platform' path on same origin
      const app = base || "/platform";
      a.setAttribute("href", app.replace(/\/+$/,'') + "/skills/" + encodeURIComponent(sid));
      a.setAttribute("rel", "noopener");
      a.setAttribute("target", "_blank");
    });
  }

  const statusBoxes = document.querySelectorAll("[data-rss-skill-status]");
  if (statusBoxes && statusBoxes.length) {
    // Support multiple status boxes on a page.
    statusBoxes.forEach((statusBox) => {
      const sid = statusBox.getAttribute('data-skill-id') || '';
      if (!sid) return;
      const cid = statusBox.getAttribute('id') || 'rss-skill-status';
      rssRenderSkillStatus(sid, cid);
    });
  }
  initTabGroups();
  initInlineToggleNav();

});