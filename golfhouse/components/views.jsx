/* ============================================================
   Core views: BigPicture · ProgramBoard · Timeline
   ============================================================ */

// ---------- BIG PICTURE (tháp 4 tầng × 4 Value Stream) -------
function BigPicture({ filter, open }) {
  const G = window.GOLF;
  const vsActive = (id) => !filter.vs || filter.vs === id;
  const teamActive = (id) => !filter.team || filter.team === id;
  const tierW = { L0: "62%", L1: "74%", L2: "87%", L3: "100%" };

  return React.createElement(PanZoom, { fitKey: "bp", initialScale: 0.82 },
    React.createElement("div", { className: "bp-plane" },
      // header
      React.createElement("div", { className: "bp-head" },
        React.createElement("div", { className: "bp-eyebrow" }, "BẢN ĐỒ TẦNG LỚP · SAFe BIG PICTURE"),
        React.createElement("h1", null, G.meta.title),
        React.createElement("p", { className: "bp-sub" }, G.meta.subtitle),
        React.createElement("div", { className: "bp-pi" }, "⌖ " + G.meta.pi)
      ),
      // Value stream band
      React.createElement("div", { className: "vsband-label" }, "GỐC · 4 LỚP SẢN PHẨM (VALUE STREAMS) — mỗi lớp có khách hàng, ngân sách & metric riêng"),
      React.createElement("div", { className: "vsband" },
        G.valueStreams.map(v => React.createElement("button", {
          key: v.id, "data-no-pan": true,
          className: "vscard" + (vsActive(v.id) ? "" : " dim"),
          style: { "--vc": vsColor(v.id), "--vbg": vsDim(v.id, 0.12) },
          onClick: () => open({ type: "vs", id: v.id })
        },
          React.createElement("div", { className: "vscard-top" }, React.createElement("span", { className: "vstag" }, v.tag), React.createElement("span", { className: "vsbud" }, v.budget)),
          React.createElement("div", { className: "vsid" }, v.id),
          React.createElement("div", { className: "vsname" }, v.vi),
          React.createElement("div", { className: "vsname-en" }, v.name),
          React.createElement("div", { className: "vscust" }, v.customer)
        ))
      ),
      React.createElement("div", { className: "spine-arrow" }, React.createElement("span", null, "quản trị ▽ cấp ngân sách theo Value Stream")),

      // pyramid
      React.createElement("div", { className: "pyr" },
        G.layers.map((l, i) => {
          const isTeams = l.id === "L3";
          return React.createElement("div", { key: l.id, className: "tier-wrap" },
            React.createElement("div", {
              className: "tier tier-" + l.id, "data-no-pan": true, role: "button", tabIndex: 0,
              style: { width: tierW[l.id] },
              onClick: () => open({ type: "layer", id: l.id })
            },
              React.createElement("div", { className: "tier-badge" }, i + 1),
              React.createElement("div", { className: "tier-main" },
                React.createElement("div", { className: "tier-code" }, l.code),
                React.createElement("div", { className: "tier-name" }, l.name),
                React.createElement("div", { className: "tier-cad" }, l.cadence)
              ),
              // L0 embeds 12 epics
              l.id === "L0" && React.createElement("div", { className: "epic-grid", "data-no-pan": true },
                G.epics.map(e => React.createElement("button", {
                  key: e.id, className: "epchip" + (vsActive(e.vs) ? "" : " dim"),
                  style: { "--ec": vsColor(e.vs) },
                  onClick: (ev) => { ev.stopPropagation(); open({ type: "epic", id: e.id }); },
                  title: e.name
                }, React.createElement("b", null, e.id), React.createElement("span", null, e.name)))
              ),
              l.id === "L1" && React.createElement("div", { className: "tier-tags" },
                React.createElement("span", { className: "ttag" }, "STE = Deputy TD"),
                React.createElement("span", { className: "ttag" }, "Solution Intent: Fixed / Variable"),
                React.createElement("span", { className: "ttag" }, "Pre-PI (T-11) · Post-PI (T-9)")),
              l.id === "L2" && React.createElement("div", { className: "tier-tags" },
                ["RTE", "PM = TD", "System Architect ×3", "Business Owners", "8 PO", "8 SM", "System Team ×6", "Shared Services"].map(r =>
                  React.createElement("span", { key: r, className: "ttag" }, r)))
            ),
            // teams row
            isTeams && React.createElement("div", { className: "teamrow", "data-no-pan": true },
              G.teams.map(t => React.createElement("button", {
                key: t.id, className: "teamcard" + (teamActive(t.id) && vsActive(t.vs) ? "" : " dim"),
                style: { "--tc": vsColor(t.vs), "--tbg": vsDim(t.vs, 0.14) },
                onClick: () => open({ type: "team", id: t.id })
              },
                React.createElement("div", { className: "tc-id" }, t.id),
                React.createElement("div", { className: "tc-name" }, t.name),
                React.createElement("div", { className: "tc-meta" }, React.createElement("span", null, t.size + " ng"), React.createElement("span", { className: "tc-po" }, t.po)),
                React.createElement("div", { className: "tc-bl" }, t.backlog.slice(0, 3).map((b, k) => React.createElement("span", { key: k }, b)))
              )))
          );
        })
      )
    )
  );
}

// ---------- PROGRAM BOARD (10 Sprint × 8 Team) ---------------
const SPCOLS = ["S0", "PI", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11"];
const MILES = { PI: "PI Planning", S2: "Title + Broadcaster", S3: "Build authorization", S4: "Mid-PI checkpoint", S5: "Overlay start", S7: "Test event", S8: "Dress rehearsal", S9: "Go / No-Go", S10: "TOURNAMENT", S11: "Inspect & Adapt" };

function depCol(d) {
  const m = { "T-8 / T-1": "S3", "T-8": "S3", "T-6": "S5", "T-5": "S6", "T-4": "S7", "T-3": "S8", "T-2": "S9", "T-1": "S9" };
  if (d.lock !== "rolling") return m[d.lock] || "S5";
  if (d.from === "T5") return "S6";
  if (d.from === "T8") return d.to === "T1" ? "S3" : d.to === "T2" ? "S4" : d.to === "T3" ? "S7" : "S3";
  return "S3";
}

function ProgramBoard({ filter, open, live, statusVer }) {
  const G = window.GOLF;
  const [hover, setHover] = React.useState(null);
  const [whatif, setWhatif] = React.useState(null); // {team, sprint} delayed source
  const [whatifMode, setWhatifMode] = React.useState(false); // picking mode
  const LW = 158, CW = 122, HH = 64, RH = 92, MH = 40, CM = 9;
  const teamActive = (id) => (!filter.team || filter.team === id) && (!filter.vs || G.teams.find(t => t.id === id).vs === filter.vs);
  const colActive = (s) => !filter.sprint || filter.sprint === s;
  const colX = (s) => LW + SPCOLS.indexOf(s) * CW;
  const rowY = (tid) => HH + MH + G.teams.findIndex(t => t.id === tid) * RH;
  const W = LW + SPCOLS.length * CW, H = HH + MH + G.teams.length * RH + 50;
  const cx = (s) => colX(s) + CW / 2, cyOf = (tid) => rowY(tid) + RH / 2;

  // WHAT-IF: BFS downstream from a delayed cell over boardLinks
  const cellKey = (a) => a[0] + a[1];
  const rippleSet = React.useMemo(() => {
    if (!whatif) return null;
    const start = whatif.team + whatif.sprint;
    const adj = {};
    const addEdge = (a, b) => { (adj[a] = adj[a] || []).push(b); };
    // cross-team hand-offs
    G.boardLinks.forEach(l => addEdge(cellKey(l.from), cellKey(l.to)));
    // intra-team sequence: a delay cascades down a team's own chain
    G.teams.forEach(t => {
      const cells = Object.keys(G.boardCells[t.id] || {}).sort((a, b) => SPCOLS.indexOf(a) - SPCOLS.indexOf(b));
      for (let i = 0; i < cells.length - 1; i++) addEdge(t.id + cells[i], t.id + cells[i + 1]);
    });
    const seen = new Set([start]); const q = [start]; const affected = new Set();
    while (q.length) { const cur = q.shift(); (adj[cur] || []).forEach(n => { if (!seen.has(n)) { seen.add(n); affected.add(n); q.push(n); } }); }
    // milestones at risk: any milestone at/AFTER an affected cell's sprint
    const milesAtRisk = new Set();
    G.control && G.control.milestones.forEach(m => {
      affected.forEach(a => { const sp = a.slice(2); if (SPCOLS.indexOf(m.sprint) >= SPCOLS.indexOf(sp)) milesAtRisk.add(m.sprint); });
    });
    return { affected, start, miles: milesAtRisk };
  }, [whatif]);

  // stagger channel per target column
  const tcSeen = {};
  const links = G.boardLinks.map((d, i) => {
    const [ft, fs] = d.from, [tt, ts] = d.to;
    const key = ts; tcSeen[key] = (tcSeen[key] || 0); const k = tcSeen[key]++;
    return { d, i, ft, fs, tt, ts, k };
  });
  const relevant = (l) => {
    const f = filter.team, h = hover;
    if (h) return l.d.from[0] === h.t && l.d.from[1] === h.s || l.d.to[0] === h.t && l.d.to[1] === h.s;
    if (f) return l.ft === f || l.tt === f;
    return true;
  };
  const anyHi = !!(hover || filter.team);

  const affectedCount = rippleSet ? rippleSet.affected.size : 0;
  const srcName = whatif ? (G.boardCells[whatif.team] && G.boardCells[whatif.team][whatif.sprint]) : "";

  return React.createElement(React.Fragment, null,
    React.createElement("div", { className: "wi-bar" + (whatifMode ? " active" : "") },
      React.createElement("button", { className: "wi-toggle" + (whatifMode ? " on" : ""), onClick: () => { setWhatifMode(m => !m); if (whatifMode) setWhatif(null); } },
        whatifMode ? "● Đang mô phỏng trễ" : "▶ Mô phỏng \"What-if\" trễ"),
      whatifMode && !whatif && React.createElement("span", { className: "wi-hint" }, "Bấm một ô bất kỳ để giả định nó TRỄ — xem chuỗi ảnh hưởng lan xuống."),
      whatif && React.createElement("span", { className: "wi-result" },
        React.createElement("b", null, "↯ \"" + srcName + "\" (" + whatif.team + "·" + whatif.sprint + ") trễ"),
        " → ", React.createElement("b", { className: "wi-count" }, affectedCount + " ô"), " downstream bị ảnh hưởng",
        rippleSet.miles.size > 0 && React.createElement("span", { className: "wi-miles" }, " · " + rippleSet.miles.size + " cột mốc nguy cơ trượt: " + [...rippleSet.miles].join(", "))),
      whatif && React.createElement("button", { className: "wi-reset", onClick: () => setWhatif(null) }, "✕ Chọn ô khác")),
    React.createElement(PanZoom, { fitKey: "pb", initialScale: 0.9 },
    React.createElement("div", { className: "pb-plane", style: { width: W, height: H } },
      SPCOLS.map(s => {
        const sp = G.sprints.find(x => x.id === s);
        return React.createElement("button", {
          key: "h" + s, className: "pb-head" + (colActive(s) ? "" : " dim"), "data-no-pan": true,
          style: { left: colX(s), top: 0, width: CW, height: HH },
          onClick: () => sp && open({ type: "sprint", id: s })
        }, React.createElement("b", null, sp ? sp.label : s), React.createElement("span", null, sp ? sp.tminus : ""));
      }),
      React.createElement("div", { className: "pb-corner", style: { width: LW, height: HH } }, "TEAM \\ SPRINT"),
      React.createElement("div", { className: "pb-mlabel", style: { left: 0, top: HH, width: LW, height: MH } }, "★ MILESTONE"),
      SPCOLS.map(s => MILES[s] ? React.createElement("div", {
        key: "m" + s, className: "pb-mile" + (s === "S10" ? " mile-big" : "") + (rippleSet && rippleSet.miles.has(s) ? " mile-risk" : ""), style: { left: colX(s) + 4, top: HH + 4, width: CW - 8, height: MH - 8 }
      }, (rippleSet && rippleSet.miles.has(s) ? "⚠ " : "◆ ") + MILES[s]) : null),
      G.teams.map(t => React.createElement("button", {
        key: "r" + t.id, className: "pb-rowlabel" + (teamActive(t.id) ? "" : " dim"), "data-no-pan": true,
        style: { left: 0, top: rowY(t.id), width: LW, height: RH, "--tc": vsColor(t.vs) },
        onClick: () => open({ type: "team", id: t.id })
      }, React.createElement("b", null, t.id), React.createElement("span", null, t.name))),

      // dependency connectors — UNDER the cards, real cell→cell
      React.createElement("svg", { className: "pb-deps", width: W, height: H },
        React.createElement("defs", null,
          G.teams.map(t => React.createElement("marker", {
            key: "a" + t.id, id: "arr-" + t.id, markerWidth: 9, markerHeight: 9, refX: 6.5, refY: 3, orient: "auto"
          }, React.createElement("path", { d: "M0,0 L6.5,3 L0,6 Z", fill: vsColor(t.vs) })))),
        links.map(l => {
          const c = vsColor(G.teams.find(t => t.id === l.ft).vs);
          const fci = SPCOLS.indexOf(l.fs), tci = SPCOLS.indexOf(l.ts);
          const sy = cyOf(l.ft), ty = cyOf(l.tt);
          const srcR = colX(l.fs) + CW - CM;
          const tgtL = colX(l.ts) + CM, tgtR = colX(l.ts) + CW - CM;
          let path, sx;
          if (tci > fci) {                       // target to the right → smooth horizontal S-curve
            sx = srcR;
            const dx = (tgtL - srcR), bend = Math.max(dx * 0.42, 44);
            path = `M ${srcR} ${sy} C ${srcR + bend} ${sy}, ${tgtL - bend} ${ty}, ${tgtL} ${ty}`;
          } else {                               // same column → arc bulging into the right gutter
            sx = srcR;
            const bulge = 34 + (l.k % 3) * 12;
            path = `M ${srcR} ${sy} C ${srcR + bulge} ${sy}, ${tgtR + bulge} ${ty}, ${tgtR} ${ty}`;
          }
          const on = relevant(l);
          return React.createElement("g", { key: "d" + l.i, opacity: anyHi ? (on ? 1 : 0.07) : 0.6, className: "depg" },
            React.createElement("title", null, `${l.ft} → ${l.tt} · ${l.d.label}`),
            React.createElement("path", { d: path, className: "deppath" + (on && anyHi ? " dep-on" : ""), style: { stroke: c }, markerEnd: `url(#arr-${l.ft})` }),
            React.createElement("circle", { cx: sx, cy: sy, r: 3.5, style: { fill: c } })
          );
        })
      ),

      // feature post-its (ON TOP of lines)
      G.teams.map(t => SPCOLS.map(s => {
        const f = G.boardCells[t.id] && G.boardCells[t.id][s];
        if (!f) return null;
        const hi = MILES[s] && (f.includes("SIGNED") || f.includes("Go/No"));
        const isHover = hover && hover.t === t.id && hover.s === s;
        const linked = anyHi && links.some(l => relevant(l) && ((l.ft === t.id && l.fs === s) || (l.tt === t.id && l.ts === s)));
        const detail = G.boardDetail[t.id + s];
        const cst = G.boardStatus[t.id + s];
        const ck = t.id + s;
        const isRippleSrc = rippleSet && rippleSet.start === ck;
        const isRippleHit = rippleSet && rippleSet.affected.has(ck);
        return React.createElement("div", {
          key: "f" + t.id + s,
          className: "pb-feat st-" + (cst ? cst.st : "todo") + ((teamActive(t.id) && colActive(s)) || linked ? "" : " dim") + (hi ? " feat-hi" : "") + (linked ? " feat-link" : "") + (detail && detail.crit ? " feat-crit" : "") + (isRippleSrc ? " ripple-src" : "") + (isRippleHit ? " ripple-hit" : "") + (whatif ? " wi-mode" : ""),
          style: { left: colX(s) + CM, top: rowY(t.id) + 8, width: CW - 2 * CM, height: RH - 16, "--tc": vsColor(t.vs) },
          onMouseEnter: () => setHover({ t: t.id, s }), onMouseLeave: () => setHover(null),
          onClick: () => whatifMode ? setWhatif({ team: t.id, sprint: s }) : open({ type: "feat", team: t.id, sprint: s }),
          title: whatifMode ? "Mô phỏng: ô này trễ → xem chuỗi ảnh hưởng" : "Bấm để xem chi tiết · trạng thái · input · output · phụ thuộc"
        }, cst && React.createElement("span", { className: "feat-st", style: { background: window.STATUS[cst.st].c } }), React.createElement("span", { className: "feat-txt" }, f), detail && React.createElement("span", { className: "feat-i" }, isRippleSrc ? "⚠" : isRippleHit ? "↯" : "ⓘ"));
      })),

      React.createElement("div", { className: "pb-cap", style: { left: LW, top: HH + MH + G.teams.length * RH + 14 } },
        React.createElement("b", null, "↳ Đường nối = dependency"),
        React.createElement("span", null, "màu theo team xuất phát · mũi tên trỏ vào việc phụ thuộc. Rê chuột lên một khối để soi liên kết của nó · chọn Team ở thanh lọc để cô lập.")
      )
    )
    )
  );
}

window.BigPicture = BigPicture;
window.ProgramBoard = ProgramBoard;
