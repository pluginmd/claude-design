/* ============================================================
   MISSION CONTROL — phòng điều hành đa lăng kính
   Đa chiều · đa vai trò · phơi bày nghẽn / ổn / thiếu / pending / huỷ
   Ảnh chụp trạng thái tại Sprint 6 (T-5 tuần)
   ============================================================ */

function RagDot({ st, size = 10 }) {
  const m = window.STATUS[st] || window.STATUS.todo;
  return React.createElement("span", { className: "ragdot" + (st === "risk" || st === "block" ? " pulse" : ""), style: { width: size, height: size, background: m.c } });
}
function Bar({ pct, color, h = 7 }) {
  return React.createElement("div", { className: "mbar", style: { height: h } },
    React.createElement("div", { className: "mbar-fill", style: { width: Math.max(pct, 2) + "%", background: color } }));
}
function KpiTile({ big, unit, label, sub, tone, children }) {
  return React.createElement("div", { className: "kpi kpi-" + (tone || "n") },
    React.createElement("div", { className: "kpi-label" }, label),
    React.createElement("div", { className: "kpi-big" }, big, unit && React.createElement("span", { className: "kpi-unit" }, unit)),
    children,
    sub && React.createElement("div", { className: "kpi-sub" }, sub)
  );
}
function Panel({ title, link, onLink, tag, cls, children }) {
  return React.createElement("section", { className: "panel " + (cls || "") },
    React.createElement("div", { className: "panel-h" },
      React.createElement("h3", null, title),
      link && React.createElement("button", { className: "panel-link", onClick: onLink }, link),
      tag && React.createElement("span", { className: "panel-tag" }, tag)),
    children);
}

function MissionControl({ open, goView, statusVer }) {
  const G = window.GOLF, C = G.control, S = window.STATUS;
  const [lens, setLens] = React.useState("overview");
  const [T, setT] = React.useState(6); // sprint scrub time (S6 = snapshot)
  const show = (...ls) => lens === "overview" || ls.includes(lens);
  const isNow = T === 6;

  // TIME MACHINE: status of a cell at scrub time T (derived evolution)
  const num = (s) => parseInt(s.slice(1)) || 0;
  const stAt = (team, sprint) => {
    const authored = G.boardStatus[team + sprint] || { st: "todo", pct: 0 };
    const due = num(sprint);
    if (due < T) return { st: "done", pct: 100 };
    if (due === T) { if (["risk", "block", "pending"].includes(authored.st)) return authored; return { st: "track", pct: authored.pct && authored.pct < 100 ? authored.pct : 60 }; }
    return { st: "todo", pct: 0 };
  };

  // rollups (time-aware)
  const teamPct = (tid) => {
    const cells = Object.keys(G.boardCells[tid]).map(s => stAt(tid, s).pct);
    return Math.round(cells.reduce((a, b) => a + b, 0) / cells.length);
  };
  const teamWorst = (tid) => {
    const order = ["block", "risk", "pending", "track", "todo", "done"];
    const sts = Object.keys(G.boardCells[tid]).map(s => stAt(tid, s).st);
    for (const o of order) if (sts.includes(o)) return o;
    return "done";
  };
  const teamBlockers = (tid) => isNow ? C.impediments.filter(i => i.team === tid).length : Object.keys(G.boardCells[tid]).filter(s => ["block", "risk"].includes(stAt(tid, s).st)).length;
  const overall = Math.round(G.teams.reduce((a, t) => a + teamPct(t.id), 0) / G.teams.length);
  const critCells = Object.keys(G.boardDetail).filter(k => G.boardDetail[k].crit);
  const maxVel = Math.max(...C.velocityBySprint.map(v => v.v));
  const sevMeta = { high: { l: "CAO", c: "oklch(0.64 0.20 25)" }, med: { l: "TB", c: "oklch(0.80 0.14 75)" }, low: { l: "THẤP", c: "var(--ink-faint)" } };

  // live counts at time T
  const allCells = [];
  G.teams.forEach(t => Object.keys(G.boardCells[t.id]).forEach(s => allCells.push(stAt(t.id, s))));
  const countSt = (k) => allCells.filter(c => c.st === k).length;
  const kpiBlockers = isNow ? C.kpi.blockers : countSt("block");
  const kpiRisk = isNow ? C.kpi.atRisk : countSt("risk");
  const kpiPending = isNow ? C.kpi.pending : countSt("pending");
  const kpiBudget = Math.min(Math.round(T * 8.7), 100);
  const kpiCountdown = Math.max((10 - T) * 7, 0);

  // status distribution (time-aware)
  const dist = {};
  allCells.forEach(c => { dist[c.st] = (dist[c.st] || 0) + 1; });
  dist.cancel = C.descoped.length;
  const distOrder = ["done", "track", "risk", "block", "pending", "todo", "cancel"];
  const distTotal = Object.values(G.boardStatus).length + C.descoped.length;

  const alignMeta = { aligned: { l: "Đã align", c: "oklch(0.74 0.14 150)" }, atrisk: { l: "Rủi ro", c: "oklch(0.80 0.14 75)" }, notaligned: { l: "Chưa align", c: "oklch(0.64 0.20 25)" }, pending: { l: "Chờ", c: "oklch(0.68 0.13 300)" } };

  return React.createElement("div", { className: "mc" },
    // header
    React.createElement("div", { className: "mc-top" },
      React.createElement("div", null,
        React.createElement("div", { className: "mc-eyebrow" }, "MISSION CONTROL · PHÒNG ĐIỀU HÀNH GIẢI"),
        React.createElement("h2", null, "Bảng điều khiển năng suất — đa chiều, đa vai trò"),
        React.createElement("div", { className: "mc-asof" }, "◷ " + C.asOf.label + " · " + C.asOf.cadence)),
      React.createElement("div", { className: "mc-overall" },
        React.createElement("div", { className: "mc-ring", style: { "--p": overall } }, React.createElement("span", null, overall + "%")),
        React.createElement("div", { className: "mc-overall-l" }, "Tiến độ\ntoàn PI"))
    ),

    // LENS SWITCHER
    React.createElement("div", { className: "lensbar" },
      React.createElement("span", { className: "lens-label" }, "GÓC NHÌN"),
      C.lenses.map(L => React.createElement("button", {
        key: L.id, className: "lens" + (lens === L.id ? " on" : ""), onClick: () => setLens(L.id), title: L.desc
      }, React.createElement("span", { className: "lens-ic" }, L.icon), React.createElement("b", null, L.name))),
      React.createElement("span", { className: "lens-desc" }, (C.lenses.find(l => l.id === lens) || {}).desc)
    ),

    // TIME MACHINE scrubber
    React.createElement("div", { className: "timemachine" + (isNow ? "" : " past") },
      React.createElement("div", { className: "tm-head" },
        React.createElement("span", { className: "tm-label" }, "⏱ CỖ MÁY THỜI GIAN"),
        React.createElement("span", { className: "tm-cur" }, "Đang xem: ", React.createElement("b", null, "Sprint " + T + (T <= 5 ? " · T-" + ((10 - T) + 1) + " tuần" : T === 10 ? " · Tuần giải" : " · T-" + (10 - T) + " tuần")), isNow ? React.createElement("em", null, " (ảnh chụp hiện tại)") : React.createElement("button", { className: "tm-now", onClick: () => setT(6) }, "↺ Về hiện tại")),
        React.createElement("span", { className: "tm-hint" }, "Kéo để tua trạng thái qua từng tuần")),
      React.createElement("div", { className: "tm-track" },
        React.createElement("input", { type: "range", min: 1, max: 10, step: 1, value: T, onChange: (e) => setT(+e.target.value), className: "tm-range" }),
        React.createElement("div", { className: "tm-ticks" },
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => React.createElement("button", { key: n, className: "tm-tick" + (n === T ? " on" : "") + (n === 6 ? " snap" : ""), onClick: () => setT(n) }, "S" + n))))
    ),

    // KPI strip
    React.createElement("div", { className: "kpi-strip" },
      KpiTile({ big: kpiCountdown, unit: "ngày", label: "ĐẾM NGƯỢC KHAI MẠC", sub: "Deadline cứng — không lùi", tone: "hot" }),
      KpiTile({ big: C.kpi.predictability, unit: "%", label: "PI PREDICTABILITY", sub: C.kpi.objectivesDone + "/" + C.kpi.objectivesTotal + " Objectives", tone: C.kpi.predictability >= 80 ? "ok" : "warn", children: React.createElement(Bar, { pct: C.kpi.predictability, color: C.kpi.predictability >= 80 ? S.done.c : S.risk.c }) }),
      KpiTile({ big: kpiBudget, unit: "%", label: "NGÂN SÁCH ĐÃ DÙNG", sub: "trên tổng " + C.kpi.budgetTotal, tone: "n", children: React.createElement(Bar, { pct: kpiBudget, color: "var(--cyan)" }) }),
      KpiTile({ big: kpiBlockers, label: "BLOCKER ĐANG MỞ", sub: "cần escalate hôm nay", tone: "bad" }),
      KpiTile({ big: kpiRisk, label: "HẠNG MỤC AT-RISK", sub: "ô vàng trên board", tone: "warn" }),
      KpiTile({ big: kpiPending, label: "CHỜ DUYỆT NGOÀI", sub: "phụ thuộc bên thứ ba", tone: "pend" })
    ),

    React.createElement("div", { className: "mc-grid" },
      // STATUS DISTRIBUTION
      show("flow") && React.createElement(Panel, { title: "Phân bố trạng thái — toàn bộ hạng mục", cls: "span3 panel-short" },
        React.createElement("div", { className: "distbar" },
          distOrder.map(k => dist[k] ? React.createElement("div", { key: k, className: "distseg", style: { flex: dist[k], background: S[k].c }, title: S[k].l + ": " + dist[k] }, dist[k]) : null)),
        React.createElement("div", { className: "distleg" },
          distOrder.map(k => dist[k] ? React.createElement("span", { key: k, className: "distlg" }, React.createElement("i", { style: { background: S[k].c } }), S[k].l, React.createElement("b", null, dist[k])) : null))
      ),

      // BLOCKER HEATMAP
      show("ops", "flow") && React.createElement(Panel, { title: "Bản đồ nhiệt — nghẽn ở đâu, ổn ở đâu", link: "Mở Program Board →", onLink: () => goView("board"), cls: "span1" },
        React.createElement("div", { className: "heat" },
          React.createElement("div", { className: "heat-row heat-hd" },
            React.createElement("div", { className: "heat-c0" }, ""),
            ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"].map(s => React.createElement("div", { key: s, className: "heat-x" }, s.replace("S", "")))),
          G.teams.map(t => React.createElement("div", { key: t.id, className: "heat-row" },
            React.createElement("div", { className: "heat-c0", style: { color: vsColor(t.vs) } }, t.id),
            ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"].map(s => {
              const has = G.boardCells[t.id] && G.boardCells[t.id][s];
              const cs = has ? stAt(t.id, s) : null;
              return React.createElement("button", {
                key: s, className: "heat-cell" + (cs ? "" : " empty"),
                style: cs ? { background: S[cs.st].c } : {},
                onClick: () => has && open({ type: "feat", team: t.id, sprint: s }),
                title: has ? has + " · " + S[cs.st].l : ""
              });
            })))),
        React.createElement("div", { className: "cp-foot" }, "Mỗi ô = một hạng mục. Đỏ = tắc · vàng = rủi ro · tím = chờ duyệt · lam = đang chạy · xanh lá = xong.")
      ),

      // TEAM STATUS BOARD
      show("ops", "resource") && React.createElement(Panel, { title: "Trạng thái 8 Team (Agile Release Train)", link: "Mở Program Board →", onLink: () => goView("board"), cls: "span2" },
        React.createElement("div", { className: "teamboard" },
          G.teams.map(t => {
            const pct = teamPct(t.id), st = teamWorst(t.id), m = C.teamMeta[t.id], bl = teamBlockers(t.id);
            return React.createElement("button", { key: t.id, className: "tb-row", onClick: () => open({ type: "team", id: t.id }), style: { "--tc": vsColor(t.vs) } },
              React.createElement(RagDot, { st }),
              React.createElement("div", { className: "tb-id" }, t.id),
              React.createElement("div", { className: "tb-name" }, t.name, React.createElement("div", { className: "tb-note" }, m.note)),
              React.createElement("div", { className: "tb-prog" }, React.createElement(Bar, { pct, color: vsColor(t.vs) }), React.createElement("span", null, pct + "%")),
              React.createElement("div", { className: "tb-vel" }, React.createElement("b", null, m.velDone + "/" + m.velPlan), React.createElement("em", null, "SP")),
              React.createElement("div", { className: "tb-bl" + (bl ? " on" : "") }, bl ? "⚑ " + bl : "—"));
          }))
      ),

      // READINESS / GO-NO-GO
      show("exec") && React.createElement(Panel, { title: "Sẵn sàng Go / No-Go — 5 hạng mục bắt buộc xanh", cls: "span1" },
        React.createElement("div", { className: "ready" },
          C.readiness.map((r, i) => React.createElement("div", { key: i, className: "ready-row" },
            React.createElement(RagDot, { st: r.st }),
            React.createElement("div", { className: "ready-area" }, r.area, React.createElement("div", { className: "ready-note" }, r.note)),
            React.createElement("div", { className: "ready-mini" }, React.createElement(Bar, { pct: r.pct, color: S[r.st].c, h: 5 }), React.createElement("span", null, r.pct + "%"))))),
        React.createElement("div", { className: "cp-foot" }, "Tất cả phải XANH tại Sprint 9 mới được khai mạc.")
      ),

      // RISK ROAM
      show("exec", "ops") && React.createElement(Panel, { title: "Risk Board (ROAM)", cls: "span1" },
        React.createElement("div", { className: "roam" },
          [["resolved", "Resolved · đã gỡ"], ["owned", "Owned · có chủ"], ["accepted", "Accepted · chấp nhận"], ["mitigated", "Mitigated · giảm thiểu"]].map(([k, lbl]) =>
            React.createElement("div", { key: k, className: "roam-q roam-" + k },
              React.createElement("div", { className: "roam-h" }, lbl),
              C.roam[k].map((r, i) => React.createElement("div", { key: i, className: "roam-item" }, React.createElement("b", null, r.t), React.createElement("p", null, r.d))))))
      ),

      // RISK HEAT MATRIX (likelihood × impact)
      show("exec", "ops") && React.createElement(Panel, { title: "Ma trận rủi ro (Khả năng × Tác động)", cls: "span1" },
        React.createElement("div", { className: "rmx" },
          React.createElement("div", { className: "rmx-yl" }, "KHẢ NĂNG →"),
          React.createElement("div", { className: "rmx-grid" },
            [3, 2, 1].map(l => [1, 2, 3].map(i => {
              const cell = C.riskMatrix.filter(r => r.l === l && r.i === i);
              const zone = l * i >= 6 ? "hi" : l * i >= 3 ? "mid" : "lo";
              return React.createElement("div", { key: l + "" + i, className: "rmx-cell rmx-" + zone, title: cell.map(c => c.t).join("\n") },
                cell.map((c, k) => React.createElement("span", { key: k, className: "rmx-dot", title: c.t + " · " + c.own })));
            }))),
          React.createElement("div", { className: "rmx-xl" }, "TÁC ĐỘNG →")),
        React.createElement("div", { className: "cp-foot" }, C.riskMatrix.length + " rủi ro · ô đỏ = ưu tiên xử lý. Rê chuột lên chấm để xem.")
      ),

      // CRITICAL PATH
      show("exec", "ops") && React.createElement(Panel, { title: "⚑ Critical Path tracker", cls: "span1" },
        React.createElement("div", { className: "cp-list" },
          critCells.map(k => {
            const team = k.slice(0, 2), sprint = k.slice(2), t = G.teams.find(x => x.id === team), cs = stAt(team, sprint), name = G.boardCells[team][sprint];
            return React.createElement("button", { key: k, className: "cp-item", onClick: () => open({ type: "feat", team, sprint }) },
              React.createElement(RagDot, { st: cs.st }),
              React.createElement("div", { className: "cp-tag", style: { color: vsColor(t.vs) } }, team + "·" + sprint),
              React.createElement("div", { className: "cp-name" }, name),
              React.createElement("div", { className: "cp-mini" }, React.createElement(Bar, { pct: cs.pct, color: S[cs.st].c, h: 5 })));
          })),
        React.createElement("div", { className: "cp-foot" }, "Trễ một ô = trễ cả giải. TD dành ~70% thời gian cho các ô này.")
      ),

      // RESOURCE & CAPACITY
      show("resource") && React.createElement(Panel, { title: "Nguồn lực & Capacity — ai đang quá tải / thiếu người", cls: "span2" },
        React.createElement("div", { className: "rescap" },
          G.teams.map(t => {
            const r = C.resources.teams[t.id], over = r.load > 100, gap = r.filled < r.needed;
            return React.createElement("button", { key: t.id, className: "rc-row", onClick: () => open({ type: "team", id: t.id }), style: { "--tc": vsColor(t.vs) } },
              React.createElement("div", { className: "rc-id" }, t.id),
              React.createElement("div", { className: "rc-hc" }, React.createElement("b", { className: gap ? "short" : "" }, r.filled + "/" + r.needed), React.createElement("em", null, "người")),
              React.createElement("div", { className: "rc-load" },
                React.createElement("div", { className: "rc-loadbar" }, React.createElement("div", { className: "rc-loadf" + (over ? " over" : ""), style: { width: Math.min(r.load, 100) + "%" } }), over && React.createElement("div", { className: "rc-over", style: { left: "100%" } })),
                React.createElement("span", { className: over ? "over" : "" }, r.load + "%")),
              React.createElement("div", { className: "rc-gap" }, r.gap || "— đủ tải"));
          })),
        React.createElement("div", { className: "vol" },
          React.createElement("span", { className: "vol-l" }, "TÌNH NGUYỆN VIÊN"),
          React.createElement(Bar, { pct: Math.round(C.resources.volunteers.filled / C.resources.volunteers.needed * 100), color: "var(--warn)" }),
          React.createElement("b", null, C.resources.volunteers.filled + "/" + C.resources.volunteers.needed),
          React.createElement("em", null, C.resources.volunteers.note))
      ),

      // RESOURCE SHORTFALLS
      show("resource") && React.createElement(Panel, { title: "Thiếu hụt nhân sự — cần lấp gấp", tag: C.resources.shortfalls.length + " vị trí", cls: "span1" },
        React.createElement("div", { className: "short-list" },
          C.resources.shortfalls.map((s, i) => React.createElement("div", { key: i, className: "short-row" },
            React.createElement("span", { className: "short-sev", style: { background: sevMeta[s.sev].c } }, sevMeta[s.sev].l),
            React.createElement("div", null, React.createElement("b", null, s.role, " ", React.createElement("span", { className: "short-team" }, s.team)), React.createElement("p", null, s.note)))))
      ),

      // INTERFACE ALIGNMENT
      show("ops", "flow") && React.createElement(Panel, { title: "Align giao diện giữa Team — chỗ nào chưa khớp", cls: "span2" },
        React.createElement("div", { className: "align" },
          C.alignment.map((a, i) => React.createElement("div", { key: i, className: "align-row al-" + a.st },
            React.createElement("span", { className: "al-dot", style: { background: alignMeta[a.st].c } }),
            React.createElement("span", { className: "al-pair" }, a.pair),
            React.createElement("span", { className: "al-if" }, a.interface, a.note && React.createElement("em", null, " — " + a.note)),
            React.createElement("span", { className: "al-st", style: { color: alignMeta[a.st].c } }, alignMeta[a.st].l))))
      ),

      // PENDING APPROVALS
      show("exec", "flow") && React.createElement(Panel, { title: "Đang chờ duyệt — phụ thuộc bên ngoài", tag: C.approvals.length + " mục", cls: "span1" },
        React.createElement("div", { className: "appr-list" },
          C.approvals.map((a, i) => React.createElement("div", { key: i, className: "appr-row" },
            React.createElement("span", { className: "appr-sev", style: { background: sevMeta[a.sev].c } }),
            React.createElement("div", null, React.createElement("b", null, a.what), React.createElement("p", null, "Chờ: " + a.who + " · Owner: " + a.owner)),
            React.createElement("span", { className: "appr-age" }, a.age + "n"))))
      ),

      // DESCOPED / CANCELLED
      show("flow") && React.createElement(Panel, { title: "Đã huỷ / cắt khỏi phạm vi", tag: C.descoped.length + " mục", cls: "span1" },
        React.createElement("div", { className: "desc-list" },
          C.descoped.map((d, i) => React.createElement("div", { key: i, className: "desc-row" },
            React.createElement("span", { className: "desc-x" }, "✕"),
            React.createElement("div", null, React.createElement("b", null, d.what), React.createElement("p", null, d.reason)),
            React.createElement("span", { className: "desc-when" }, d.when))))
      ),

      // BUDGET BY VS
      show("exec") && React.createElement(Panel, { title: "Ngân sách đã dùng theo Value Stream", cls: "span1" },
        React.createElement("div", { className: "budg" },
          C.budgetByVS.map((b, i) => React.createElement("div", { key: i, className: "budg-row" },
            React.createElement("span", { className: "budg-vs", style: { color: vsColor(b.vs) } }, b.vs),
            React.createElement("div", { className: "budg-bar" }, React.createElement("div", { className: "budg-f", style: { width: b.pct + "%", background: vsColor(b.vs) } })),
            React.createElement("span", { className: "budg-pct" }, b.pct + "%"))))
      ),

      // MILESTONES
      show("exec") && React.createElement(Panel, { title: "Mốc lớn (Milestones)", link: "Mở Timeline →", onLink: () => goView("timeline"), cls: "span2" },
        React.createElement("div", { className: "ms-rail" },
          C.milestones.map((m, i) => React.createElement("button", { key: i, className: "ms-node ms-" + m.st, onClick: () => open({ type: "sprint", id: m.sprint }) },
            React.createElement("div", { className: "ms-dot" }, m.st === "done" ? "✓" : m.st === "next" ? "▶" : "○"),
            React.createElement("div", { className: "ms-sp" }, m.sprint),
            React.createElement("div", { className: "ms-name" }, m.name))))
      ),

      // VELOCITY
      show("ops") && React.createElement(Panel, { title: "Program Velocity", cls: "span1" },
        React.createElement("div", { className: "velo" },
          C.velocityBySprint.map((v, i) => { const vn = parseInt(v.s.slice(1)); const future = vn > T; return React.createElement("div", { key: i, className: "velo-col" },
            React.createElement("div", { className: "velo-bar-wrap" }, React.createElement("div", { className: "velo-bar" + (vn === T ? " wip" : "") + (future ? " future" : ""), style: { height: (future ? 6 : v.v / maxVel * 100) + "%" } }, !future && React.createElement("span", null, v.v))),
            React.createElement("div", { className: "velo-x" }, v.s)); })),
        React.createElement("div", { className: "cp-foot" }, "Story point hoàn tất / Sprint · S6 đang chạy (WIP).")
      ),

      // IMPEDIMENTS
      show("ops") && React.createElement(Panel, { title: "Blocker / Impediment Log — escalate hằng ngày", tag: C.impediments.length + " đang mở", cls: "span3" },
        React.createElement("div", { className: "imp-table" },
          React.createElement("div", { className: "imp-row imp-hd" },
            React.createElement("div", null, "Mức"), React.createElement("div", null, "Team"), React.createElement("div", null, "Mô tả"),
            React.createElement("div", null, "Owner"), React.createElement("div", null, "Tuổi"), React.createElement("div", null, "Tác động")),
          C.impediments.map((im, i) => {
            const sm = sevMeta[im.sev], t = G.teams.find(x => x.id === im.team);
            return React.createElement("div", { key: i, className: "imp-row", onClick: () => im.cell && open({ type: "feat", team: im.cell.slice(0, 2), sprint: im.cell.slice(2) }), style: { cursor: im.cell ? "pointer" : "default" } },
              React.createElement("div", null, React.createElement("span", { className: "sev", style: { background: sm.c } }, sm.l)),
              React.createElement("div", { className: "imp-team", style: { color: vsColor(t.vs) } }, im.team),
              React.createElement("div", { className: "imp-what" }, im.what),
              React.createElement("div", { className: "imp-owner" }, im.owner),
              React.createElement("div", { className: "imp-age" }, im.age + "n"),
              React.createElement("div", { className: "imp-impact" }, "→ " + im.impact));
          }))
      )
    )
  );
}

window.MissionControl = MissionControl;
window.RagDot = RagDot; window.MBar = Bar;
