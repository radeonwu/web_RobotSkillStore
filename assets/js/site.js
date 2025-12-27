
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
      note: "Mock run in browser. Wire to POST /api/execute-skill for real execution."
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