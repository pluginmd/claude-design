/* ============================================================
   Detail Drawer + per-type detail renderers (drill-down)
   ============================================================ */
function Section({ title, children, accent }) {
  return React.createElement("div", { className: "dsec" },
    title && React.createElement("h4", { className: "dsec-t", style: accent ? { color: accent, borderColor: accent } : undefined }, title),
    children
  );
}
function Bullets({ items, accent }) {
  return React.createElement("ul", { className: "dlist" },
    items.map((it, i) => React.createElement("li", { key: i, style: accent ? { "--mk": accent } : undefined }, it))
  );
}

// --- per-type renderers --------------------------------------
function DetailVS(vs) {
  const col = vsColor(vs.id);
  const ep = window.GOLF.epics.filter(e => e.vs === vs.id);
  return React.createElement("div", null,
    React.createElement("p", { className: "dlede" }, vs.desc),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Khách hàng"), React.createElement("b", null, vs.customer)),
      React.createElement("div", null, React.createElement("span", null, "Ngân sách Lean"), React.createElement("b", null, vs.budget))
    ),
    React.createElement(Section, { title: "Metric (Inspect & Adapt đo cuối kỳ)", accent: col }, React.createElement(Bullets, { items: vs.metrics, accent: col })),
    ep.length > 0 && React.createElement(Section, { title: "Epic thuộc Value Stream này", accent: col },
      ep.map(e => React.createElement("div", { key: e.id, className: "epline" },
        React.createElement("span", { className: "epbadge", style: { background: col } }, e.id),
        React.createElement("div", null, React.createElement("b", null, e.name), React.createElement("p", null, e.note), React.createElement("em", null, "Owner: " + e.owner)))
      ))
  );
}

function DetailLayer(l) {
  return React.createElement("div", null,
    React.createElement("p", { className: "dlede" }, l.summary),
    React.createElement("div", { className: "kv" }, React.createElement("div", { style: { gridColumn: "1/-1" } }, React.createElement("span", null, "Cadence"), React.createElement("b", null, l.cadence))),
    React.createElement(Section, { title: "Thành phần / Vai trò" }, React.createElement(Bullets, { items: l.members })),
    l.blocks.map((b, i) => React.createElement(Section, { key: i, title: b.t }, React.createElement(Bullets, { items: b.items })))
  );
}

function DetailTeam(t, open) {
  const col = vsColor(t.vs);
  const vs = vsById(t.vs);
  const fa = window.GOLF.functionalAreas.filter(f => f.team === t.id);
  const myDeps = window.GOLF.deps.filter(d => d.from === t.id || d.to === t.id);
  const G = window.GOLF;
  const okr = G.org && G.org.teamOKR[t.id];
  const meta = G.control && G.control.teamMeta[t.id];
  const res = G.control && G.control.resources.teams[t.id];
  const myMiles = G.control ? G.control.milestones.filter(m => { const cells = G.boardCells[t.id] || {}; return cells[m.sprint]; }) : [];
  // team status rollup
  const cellPcts = Object.keys(G.boardCells[t.id] || {}).map(s => (G.boardStatus[t.id + s] || { pct: 0 }).pct);
  const teamPct = cellPcts.length ? Math.round(cellPcts.reduce((a, b) => a + b, 0) / cellPcts.length) : 0;
  const order = ["block", "risk", "pending", "track", "todo", "done"];
  const sts = Object.keys(G.boardCells[t.id] || {}).map(s => (G.boardStatus[t.id + s] || { st: "todo" }).st);
  let worst = "done"; for (const o of order) if (sts.includes(o)) { worst = o; break; }
  const sm = window.STATUS[worst];
  const commitSt = { done: "oklch(0.74 0.14 150)", track: "var(--cyan)", risk: "var(--warn)", todo: "var(--ink-faint)", pending: "oklch(0.68 0.13 300)" };

  return React.createElement("div", null,
    // status header (sát Mission Control)
    React.createElement("div", { className: "feat-status" },
      React.createElement("span", { className: "st-pill", style: { background: sm.c } }, React.createElement("i", null), sm.l),
      React.createElement("div", { className: "st-prog" },
        React.createElement("div", { className: "st-bar" }, React.createElement("div", { className: "st-bar-f", style: { width: Math.max(teamPct, 2) + "%", background: col } })),
        React.createElement("span", { className: "st-pct" }, teamPct + "%"))),
    meta && React.createElement("p", { className: "dlede" }, meta.note),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Product Owner"), React.createElement("b", null, t.po)),
      React.createElement("div", null, React.createElement("span", null, "Quy mô"), React.createElement("b", null, t.size + " người · 1 PO · 1 SM")),
      meta && React.createElement("div", null, React.createElement("span", null, "Velocity (done/plan)"), React.createElement("b", null, meta.velDone + " / " + meta.velPlan + " SP")),
      React.createElement("div", null, React.createElement("span", null, "Value Stream"), React.createElement("b", { style: { color: col } }, vs ? vs.id + " · " + vs.vi : t.vs))
    ),
    // OKR
    okr && React.createElement(Section, { title: "OKR — Mục tiêu & Key Results", accent: col },
      React.createElement("div", { className: "okr-obj sm" }, "◎ " + okr.obj),
      okr.krs.map((k, i) => React.createElement("div", { key: i, className: "okr-kr" },
        React.createElement("div", { className: "okr-kt" }, React.createElement("span", null, k[0]), React.createElement("b", { style: { color: col } }, k[1])),
        React.createElement("div", { className: "okr-bar" }, React.createElement("div", { className: "okr-fill", style: { width: Math.max(k[3], 3) + "%", background: col } })),
        React.createElement("div", { className: "okr-cur" }, k[2])))),
    // Commitments (PI objectives)
    okr && React.createElement(Section, { title: "Cam kết PI (PI Objectives + Business Value)", accent: col },
      okr.commits.map((c, i) => React.createElement("div", { key: i, className: "commit" },
        React.createElement("span", { className: "commit-st", style: { background: commitSt[c[2]] || "var(--ink-faint)" } }),
        React.createElement("span", { className: "commit-o" }, c[0]),
        React.createElement("span", { className: "commit-bv", title: "Business Value" }, "BV " + c[1])))),
    // Resources
    res && React.createElement(Section, { title: "Tài nguyên & Capacity", accent: col },
      React.createElement("div", { className: "kv" },
        React.createElement("div", null, React.createElement("span", null, "Nhân sự"), React.createElement("b", { style: { color: res.filled < res.needed ? "var(--warn)" : undefined } }, res.filled + "/" + res.needed + " người")),
        React.createElement("div", null, React.createElement("span", null, "Tải (load)"), React.createElement("b", { style: { color: res.load > 100 ? "oklch(0.7 0.2 25)" : undefined } }, res.load + "%"))),
      res.gap && React.createElement("p", { className: "res-gap" }, "⚠ " + res.gap)),
    // Milestones owned
    myMiles.length > 0 && React.createElement(Section, { title: "Cột mốc liên quan", accent: col },
      React.createElement("div", { className: "tm-miles" },
        myMiles.map((m, i) => React.createElement("button", { key: i, className: "tm-mile ms-" + m.st, "data-no-pan": true, onClick: () => open && open({ type: "sprint", id: m.sprint }) },
          React.createElement("b", null, m.sprint), React.createElement("span", null, m.name))))),
    React.createElement(Section, { title: "Backlog (Feature → Story)", accent: col }, React.createElement(Bullets, { items: t.backlog, accent: col })),
    fa.length > 0 && React.createElement(Section, { title: "Functional Area phụ trách (Playbook)", accent: col },
      fa.map(f => React.createElement("div", { key: f.id, className: "faline" }, React.createElement("b", null, f.name), React.createElement("p", null, f.d)))),
    myDeps.length > 0 && React.createElement(Section, { title: "Dependency / Interface (lock time)", accent: col },
      myDeps.map((d, i) => React.createElement("div", { key: i, className: "depline" },
        React.createElement("code", null, d.from + " → " + d.to), React.createElement("span", null, d.label), React.createElement("em", null, "lock " + d.lock))))
  );
}

function DetailRole(r) {
  const c = `oklch(0.78 0.13 ${r.hue})`;
  return React.createElement("div", null,
    React.createElement("div", { className: "biz-tagline", style: { borderColor: c, background: `oklch(0.78 0.13 ${r.hue} / 0.12)` } }, r.mandate),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Người đảm nhiệm"), React.createElement("b", null, r.person)),
      React.createElement("div", null, React.createElement("span", null, "Tầng"), React.createElement("b", { style: { color: c } }, r.level)),
      React.createElement("div", { style: { gridColumn: "1/-1" } }, React.createElement("span", null, "Báo cáo lên"), React.createElement("b", null, r.reports || "—"))),
    React.createElement("div", { className: "dsec" }, React.createElement("h4", { className: "dsec-t", style: { color: c, borderColor: c } }, "✓  CHỊU TRÁCH NHIỆM (does)"),
      React.createElement("ul", { className: "dlist" }, r.does.map((d, i) => React.createElement("li", { key: i, style: { "--mk": c } }, d)))),
    React.createElement("div", { className: "dsec" }, React.createElement("h4", { className: "dsec-t", style: { color: "var(--warn)", borderColor: "var(--warn)" } }, "✕  KHÔNG làm (ranh giới)"),
      React.createElement("div", { className: "biz-risk" }, r.notdoes.map((d, i) => React.createElement("div", { key: i, className: "brisk" }, d))))
  );
}

function DetailSprint(s) {
  const kindLabel = { prep: "Chuẩn bị", milestone: "Mốc lớn", run: "Sprint chạy", checkpoint: "Mid-PI Checkpoint", harden: "Hardening", live: "Live Ops", close: "Đóng dự án" };
  return React.createElement("div", null,
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Mốc T-minus"), React.createElement("b", null, s.tminus)),
      React.createElement("div", null, React.createElement("span", null, "Pha"), React.createElement("b", null, s.phase)),
      React.createElement("div", { style: { gridColumn: "1/-1" } }, React.createElement("span", null, "Loại"), React.createElement("b", null, kindLabel[s.kind] || s.kind))
    ),
    React.createElement(Section, { title: "Mục tiêu Increment" }, React.createElement("p", { className: "dlede" }, s.goal)),
    React.createElement(Section, { title: "Deliverable cụ thể" }, React.createElement(Bullets, { items: s.deliver })),
    s.demo && React.createElement(Section, { title: "System Demo (tích hợp ≥ 2 team, demo thật)" }, React.createElement("p", { className: "demo" }, s.demo))
  );
}

function DetailEpic(e) {
  const col = vsColor(e.vs);
  const vs = vsById(e.vs);
  return React.createElement("div", null,
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Epic Owner"), React.createElement("b", null, e.owner)),
      React.createElement("div", null, React.createElement("span", null, "Value Stream"), React.createElement("b", { style: { color: col } }, vs ? vs.vi : e.vs))
    ),
    React.createElement(Section, { title: "Lean Business Case (tóm tắt)", accent: col }, React.createElement("p", { className: "dlede" }, e.note))
  );
}

function DetailKink(k) {
  return React.createElement("div", null,
    React.createElement("p", { className: "dlede" }, k.d),
    React.createElement(Section, { title: "Team liên quan" }, React.createElement("div", { className: "tagrow" },
      k.teams.map(tid => { const t = window.GOLF.teams.find(x => x.id === tid); return React.createElement(Pill, { key: tid, hue: vsById(t.vs).hue }, tid + " " + t.name); })))
  );
}

// --- Program Board feature cell detail -----------------------
function DetailFeat(team, sprint, open, live, setStatus) {
  const G = window.GOLF;
  const t = G.teams.find(x => x.id === team);
  const sp = G.sprints.find(x => x.id === sprint);
  const col = vsColor(t.vs);
  const d = G.boardDetail[team + sprint] || {};
  const label = (G.boardCells[team] && G.boardCells[team][sprint]) || "—";
  const upstream = G.boardLinks.filter(l => l.to[0] === team && l.to[1] === sprint);
  const downstream = G.boardLinks.filter(l => l.from[0] === team && l.from[1] === sprint);
  const cellName = (a) => (G.boardCells[a[0]] && G.boardCells[a[0]][a[1]]) || a[0];
  const teamName = (id) => { const x = G.teams.find(y => y.id === id); return x ? x.name : id; };

  const ioBlock = (icon, lbl, val, cls) => React.createElement("div", { className: "io " + cls },
    React.createElement("div", { className: "io-h" }, React.createElement("span", { className: "io-ic" }, icon), lbl),
    React.createElement("p", null, val || "—"));

  // status snapshot + Definition of Done (auto-derived from status)
  const st = window.statusOf(team, sprint);
  const sm = window.STATUS[st.st];
  const imp = G.control.impediments.find(i => i.cell === team + sprint);
  const dodItems = [
    { t: d.output ? d.output + " — hoàn tất & nghiệm thu" : "Output hoàn tất & nghiệm thu" },
    { t: "Sign-off bởi " + t.po + " (Product Owner)" },
    { t: "Hand-off cập nhật vào SSOT ≤ 48h" },
    { t: downstream.length ? "Thông báo đầu ra cho " + downstream.map(l => l.to[0]).join(", ") : "Không có team hạ nguồn cần thông báo" }
  ];
  // how many DoD checked based on % progress
  const checkedN = st.pct >= 100 ? 4 : st.pct >= 75 ? 3 : st.pct >= 45 ? 2 : st.pct >= 20 ? 1 : 0;

  return React.createElement("div", null,
    // status header
    React.createElement("div", { className: "feat-status" },
      React.createElement("span", { className: "st-pill", style: { background: sm.c } }, React.createElement("i", null), sm.l),
      React.createElement("div", { className: "st-prog" },
        React.createElement("div", { className: "st-bar" }, React.createElement("div", { className: "st-bar-f", style: { width: Math.max(st.pct, 2) + "%", background: sm.c } })),
        React.createElement("span", { className: "st-pct" }, st.pct + "%"))
    ),
    // LIVE mode — edit status
    live && setStatus && React.createElement("div", { className: "live-edit" },
      React.createElement("div", { className: "live-h" }, "● LIVE — đặt trạng thái ô này:"),
      React.createElement("div", { className: "live-btns" },
        [["done", 100], ["track", 60], ["risk", 45], ["block", 30], ["pending", 30], ["todo", 0]].map(([k, p]) =>
          React.createElement("button", { key: k, className: "live-btn" + (st.st === k ? " on" : ""), style: { "--lc": window.STATUS[k].c }, onClick: () => setStatus(team + sprint, k, st.st === k ? st.pct : p) }, window.STATUS[k].l))),
      React.createElement("div", { className: "live-pct" },
        React.createElement("span", null, "% hoàn thành"),
        React.createElement("input", { type: "range", min: 0, max: 100, step: 5, value: st.pct, onChange: (e) => setStatus(team + sprint, st.st, +e.target.value) }),
        React.createElement("b", null, st.pct + "%"))),
    d.crit && React.createElement("div", { className: "crit-flag" }, "⚑ Nằm trên CRITICAL PATH — trễ ô này là trễ cả giải"),
    imp && React.createElement("div", { className: "risk-call risk-" + imp.sev },
      React.createElement("div", { className: "risk-h" }, "⚠ BLOCKER ĐANG MỞ · " + imp.age + " ngày"),
      React.createElement("p", null, imp.what),
      React.createElement("div", { className: "risk-meta" }, "Owner: " + imp.owner + " · Tác động: " + imp.impact)),
    React.createElement("p", { className: "dlede" }, d.what || label),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Team · Owner"), React.createElement("b", { style: { color: col } }, team + " · " + t.po)),
      React.createElement("div", null, React.createElement("span", null, "Thời điểm"), React.createElement("b", null, sp ? sp.label + " (" + sp.tminus + ")" : sprint))
    ),
    // INPUT → OUTPUT → OUTCOME (visual flow)
    React.createElement("div", { className: "dsec-t", style: { marginBottom: 10 } }, "LUỒNG GIÁ TRỊ — INPUT → OUTPUT → OUTCOME"),
    React.createElement("div", { className: "iorow" },
      ioBlock("▼", "INPUT — cần gì để bắt đầu", d.input, "io-in"),
      React.createElement("div", { className: "io-arrow" }, "↓"),
      ioBlock("■", "OUTPUT — sản phẩm giao ra", d.output, "io-out"),
      React.createElement("div", { className: "io-arrow" }, "↓"),
      ioBlock("★", "OUTCOME — giá trị / kết quả", d.outcome, "io-res")
    ),
    // Definition of Done
    React.createElement(Section, { title: "Definition of Done — thế nào là 'xong'" },
      React.createElement("div", { className: "dod" },
        dodItems.map((it, i) => React.createElement("div", { key: i, className: "dod-item" + (i < checkedN ? " ok" : "") },
          React.createElement("span", { className: "dod-box" }, i < checkedN ? "✓" : ""),
          React.createElement("span", null, it.t))))),
    // dependencies
    React.createElement(Section, { title: "Phụ thuộc — cần ô khác xong trước (input)", accent: "var(--warn)" },
      upstream.length ? upstream.map((l, i) => React.createElement("button", {
        key: i, className: "depnav up", "data-no-pan": true,
        onClick: () => open({ type: "feat", team: l.from[0], sprint: l.from[1] })
      },
        React.createElement("span", { className: "depnav-tag", style: { background: vsColor(G.teams.find(x => x.id === l.from[0]).vs) } }, l.from[0] + "·" + l.from[1]),
        React.createElement("div", null, React.createElement("b", null, cellName(l.from)), React.createElement("em", null, l.label))
      )) : React.createElement("p", { className: "depnone" }, "Không phụ thuộc ô nào — có thể khởi động độc lập.")),
    React.createElement(Section, { title: "Cấp đầu vào cho — ô khác chờ ô này (output)", accent: "var(--cyan)" },
      downstream.length ? downstream.map((l, i) => React.createElement("button", {
        key: i, className: "depnav down", "data-no-pan": true,
        onClick: () => open({ type: "feat", team: l.to[0], sprint: l.to[1] })
      },
        React.createElement("span", { className: "depnav-tag", style: { background: vsColor(G.teams.find(x => x.id === l.to[0]).vs) } }, l.to[0] + "·" + l.to[1]),
        React.createElement("div", null, React.createElement("b", null, cellName(l.to)), React.createElement("em", null, l.label))
      )) : React.createElement("p", { className: "depnone" }, "Không có ô nào phụ thuộc trực tiếp đầu ra này.")),
    sp && React.createElement(Section, { title: "Bối cảnh Sprint" },
      React.createElement("button", { className: "ctxbtn", "data-no-pan": true, onClick: () => open({ type: "sprint", id: sprint }) },
        "Mở mục tiêu " + sp.label + " →"))
  );
}

function DetailBusiness(b) {
  const c = `oklch(0.78 0.13 ${b.hue})`;
  const cdim = `oklch(0.78 0.13 ${b.hue} / 0.14)`;
  const sub = (icon, title, accent) => React.createElement("h4", { className: "dsec-t", style: { color: accent || c, borderColor: accent || c } }, icon ? icon + "  " + title : title);
  return React.createElement("div", null,
    React.createElement("div", { className: "biz-tagline", style: { borderColor: c, background: cdim } }, b.tagline),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Owner"), React.createElement("b", null, b.owner)),
      React.createElement("div", null, React.createElement("span", null, "Ánh xạ SAFe"), React.createElement("b", { style: { color: c } }, b.safe))
    ),
    React.createElement(Section, { title: "Mục tiêu khung giá trị" }, React.createElement("p", { className: "dlede" }, b.objective)),
    // stakeholders served
    React.createElement("div", { className: "dsec" }, sub("◑", "Khách hàng / bên liên quan được phục vụ"),
      React.createElement("div", { className: "biz-stk" },
        b.stakeholders.map((s, i) => React.createElement("div", { key: i, className: "stk", style: { "--bc": c } },
          React.createElement("b", null, s.name), React.createElement("p", null, s.need))))),
    // value props
    React.createElement("div", { className: "dsec" }, sub("◆", "Đề xuất giá trị (Value Proposition)"),
      React.createElement(Bullets, { items: b.valueProps, accent: c })),
    // capabilities
    React.createElement("div", { className: "dsec" }, sub("⚙", "Năng lực / quy trình chính"),
      React.createElement(Bullets, { items: b.capabilities, accent: c })),
    // value levers
    React.createElement("div", { className: "dsec" }, sub("↗", "Đòn bẩy giá trị — cách tối đa hoá"),
      React.createElement("div", { className: "biz-lev" },
        b.levers.map((l, i) => React.createElement("div", { key: i, className: "lev", style: { "--bc": c } }, l)))),
    // KPIs
    React.createElement("div", { className: "dsec" }, sub("▦", "KPI / chỉ số đo lường"),
      React.createElement("div", { className: "biz-kpi" },
        b.kpis.map((k, i) => React.createElement("div", { key: i, className: "bkpi" },
          React.createElement("span", null, k[0]), React.createElement("b", { style: { color: c } }, k[1]))))),
    // risks
    React.createElement("div", { className: "dsec" }, sub("⚠", "Rủi ro chính", "var(--warn)"),
      React.createElement("div", { className: "biz-risk" },
        b.risks.map((r, i) => React.createElement("div", { key: i, className: "brisk" }, "✕ " + r))))
  );
}

function DetailSimple({ title, body, list }) {
  return React.createElement("div", null,
    body && React.createElement("p", { className: "dlede" }, body),
    list && React.createElement(Bullets, { items: list })
  );
}

// --- Drawer shell --------------------------------------------
function Drawer({ sel, onClose, open, live, setStatus }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!sel) return null;
  let title = "", tag = "", accent = "var(--line)", body = null;
  const G = window.GOLF;
  if (sel.type === "vs") { const v = vsById(sel.id); title = v.id + " · " + v.vi; tag = v.name + " — " + v.tag; accent = vsColor(v.id); body = DetailVS(v); }
  else if (sel.type === "layer") { const l = G.layers.find(x => x.id === sel.id); title = l.code; tag = l.name; body = DetailLayer(l); }
  else if (sel.type === "team") { const t = G.teams.find(x => x.id === sel.id); title = t.id + " · " + t.name; tag = "Agile Team · " + t.size + " người"; accent = vsColor(t.vs); body = DetailTeam(t, open); }
  else if (sel.type === "sprint") { const s = G.sprints.find(x => x.id === sel.id); title = s.label + " · " + s.title; tag = s.tminus + " — " + s.phase; body = DetailSprint(s); }
  else if (sel.type === "epic") { const e = G.epics.find(x => x.id === sel.id); title = e.id + " · " + e.name; tag = "Epic · " + e.owner; accent = vsColor(e.vs); body = DetailEpic(e); }
  else if (sel.type === "kink") { const k = G.kinks[sel.id]; title = "Cross-team kink"; tag = k.t; accent = "var(--warn)"; body = DetailKink(k); }
  else if (sel.type === "fa") { const f = G.functionalAreas.find(x => x.id === sel.id); const t = G.teams.find(x => x.id === f.team); const vs = vsById(t.vs); title = f.name; tag = "Functional Area · " + f.id; accent = vsColor(t.vs); body = React.createElement("div", null,
    React.createElement("p", { className: "dlede" }, f.d),
    React.createElement("div", { className: "kv" },
      React.createElement("div", null, React.createElement("span", null, "Team thực thi"), React.createElement("b", { style: { color: accent } }, f.team + " · " + t.name)),
      React.createElement("div", null, React.createElement("span", null, "Value Stream"), React.createElement("b", null, vs ? vs.vi : t.vs))),
    React.createElement("div", { className: "dsec" }, React.createElement("button", { className: "ctxbtn", "data-no-pan": true, onClick: () => open({ type: "team", id: f.team }) }, "Mở chi tiết team " + f.team + " →"))
  ); }
  else if (sel.type === "phase") { const p = G.phases.find(x => x.id === sel.id); title = "Pha " + sel.id.slice(1) + " · " + p.name; tag = p.tminus; body = DetailSimple({ list: p.items }); }
  else if (sel.type === "pattern") { const p = G.patterns[sel.id]; title = "Pattern " + p.n; tag = p.t; body = DetailSimple({ body: p.d }); }
  else if (sel.type === "anti") { const p = G.antiPatterns[sel.id]; title = "Anti-pattern"; tag = p.t; accent = "var(--warn)"; body = DetailSimple({ body: p.d }); }
  else if (sel.type === "eco") { const c = G.ecosystem[sel.id]; title = "Hệ sinh thái bên lề"; tag = c.cluster; body = DetailSimple({ list: c.items }); }
  else if (sel.type === "role") { const o = G.org || window.GOLF_ORG; const r = o.roles.find(x => x.id === sel.id); title = r.title; tag = "Vai trò · " + r.level; accent = `oklch(0.78 0.13 ${r.hue})`; body = DetailRole(r); }
  else if (sel.type === "biz") { const b = (G.business || window.GOLF_BUSINESS).find(x => x.id === sel.id); title = b.name; tag = "Khung giá trị · " + b.short; accent = `oklch(0.78 0.13 ${b.hue})`; body = DetailBusiness(b); }
  else if (sel.type === "feat") { const t = G.teams.find(x => x.id === sel.team); const lbl = (G.boardCells[sel.team] && G.boardCells[sel.team][sel.sprint]) || ""; const sp = G.sprints.find(x => x.id === sel.sprint); title = lbl; tag = sel.team + " · " + t.name + " — " + (sp ? sp.label : sel.sprint); accent = vsColor(t.vs); body = DetailFeat(sel.team, sel.sprint, open, live, setStatus); }
  else if (sel.type === "custom") { title = sel.title; tag = sel.tag; body = sel.body; }

  return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "scrim", onClick: onClose }),
    React.createElement("aside", { className: "drawer", role: "dialog" },
      React.createElement("div", { className: "drawer-top", style: { borderColor: accent } },
        React.createElement("div", null,
          React.createElement("div", { className: "drawer-tag", style: { color: accent } }, tag),
          React.createElement("h3", { className: "drawer-title" }, title)),
        React.createElement("button", { className: "drawer-x", onClick: onClose, "aria-label": "Đóng" }, "✕")),
      React.createElement("div", { className: "drawer-body" }, body)
    )
  );
}

window.Drawer = Drawer;
