/* ============================================================
   TAB TỔ CHỨC — quy mô · org chart · stakeholder · vai trò
   ============================================================ */

function OrgScale() {
  const O = window.GOLF.org;
  return React.createElement("div", { className: "org-scale" },
    O.scale.map((s, i) => React.createElement("div", { key: i, className: "oscale" },
      React.createElement("div", { className: "oscale-n" }, s.n),
      React.createElement("div", { className: "oscale-l" }, s.l),
      React.createElement("div", { className: "oscale-s" }, s.s))));
}

// ---- ORG CHART (fixed plane + SVG connectors, inside PanZoom) ----
function OrgChart({ open }) {
  const G = window.GOLF, O = G.org;
  const W = 1180, H = 560;
  const box = (x, y, w, h) => ({ x, y, w, h, cx: x + w / 2, cy: y + h / 2 });
  // layout
  const steer = box(W / 2 - 130, 0, 260, 70);
  const lead = O.chart.artLead.map((r, i) => box(150 + i * 230, 150, 200, 70));
  const sol = box(W - 250, 56, 230, 70);
  const teamW = 128, gap = (W - 60 - teamW * 8) / 7;
  const teamB = G.teams.map((t, i) => box(30 + i * (teamW + gap), 330, teamW, 150));
  const support = box(W / 2 - 220, 500, 440, 48);
  const roleColor = (id) => { const r = O.roles.find(x => x.id === id); return r ? `oklch(0.78 0.13 ${r.hue})` : "var(--cyan)"; };

  const Node = (b, cls, hue, onClick, children) => React.createElement("button", {
    className: "ochart-node " + cls, "data-no-pan": true, onClick,
    style: { left: b.x, top: b.y, width: b.w, height: b.h, "--nc": hue }
  }, children);

  return React.createElement(PanZoom, { fitKey: "org", initialScale: 0.9 },
    React.createElement("div", { className: "ochart", style: { width: W, height: H } },
      React.createElement("svg", { className: "ochart-svg", width: W, height: H },
        // steering → leadership bus
        React.createElement("line", { x1: steer.cx, y1: steer.y + steer.h, x2: steer.cx, y2: 130, className: "oc-line" }),
        React.createElement("line", { x1: lead[0].cx, y1: 130, x2: lead[3].cx, y2: 130, className: "oc-line" }),
        lead.map((b, i) => React.createElement("line", { key: "ll" + i, x1: b.cx, y1: 130, x2: b.cx, y2: b.y, className: "oc-line" })),
        // steering → solution (dashed advisory)
        React.createElement("line", { x1: steer.x + steer.w, y1: steer.cy, x2: sol.x, y2: sol.cy, className: "oc-line oc-dash" }),
        // leadership → team bus
        React.createElement("line", { x1: lead[1].cx, y1: lead[1].y + lead[1].h, x2: lead[1].cx, y2: 300, className: "oc-line" }),
        React.createElement("line", { x1: teamB[0].cx, y1: 300, x2: teamB[7].cx, y2: 300, className: "oc-line" }),
        teamB.map((b, i) => React.createElement("line", { key: "tl" + i, x1: b.cx, y1: 300, x2: b.cx, y2: b.y, className: "oc-line" })),
        // teams → support bus
        React.createElement("line", { x1: support.cx, y1: 480, x2: support.cx, y2: support.y, className: "oc-line oc-dash" })
      ),
      // steering
      Node(steer, "on-gov", roleColor("LPM"), () => open({ type: "role", id: "LPM" }),
        [React.createElement("b", { key: "t" }, "STEERING COMMITTEE"), React.createElement("span", { key: "s" }, "Lean Portfolio Mgmt · ngân sách & strategic")]),
      // solution train
      Node(sol, "on-sol", roleColor("STE"), () => open({ type: "role", id: "STE" }),
        [React.createElement("b", { key: "t" }, "SOLUTION TRAIN"), React.createElement("span", { key: "s" }, "STE + Architect · đối tác ngoài")]),
      // leadership
      O.chart.artLead.map((r, i) => Node(lead[i], "on-art", roleColor(r.role), () => open({ type: "role", id: r.role }),
        [React.createElement("b", { key: "t" }, r.title), React.createElement("span", { key: "s" }, r.sub)])),
      // teams
      G.teams.map((t, i) => {
        const cs = window.statusOf ? null : null;
        return React.createElement("button", {
          key: t.id, className: "ochart-team", "data-no-pan": true, onClick: () => open({ type: "team", id: t.id }),
          style: { left: teamB[i].x, top: teamB[i].y, width: teamB[i].w, height: teamB[i].h, "--nc": vsColor(t.vs) }
        },
          React.createElement("div", { className: "oct-id" }, t.id),
          React.createElement("div", { className: "oct-name" }, t.name),
          React.createElement("div", { className: "oct-po" }, t.po),
          React.createElement("div", { className: "oct-sz" }, t.size + " người · 1 PO · 1 SM"));
      }),
      // support
      Node(support, "on-support", roleColor("SS"), () => open({ type: "role", id: "SS" }),
        [React.createElement("b", { key: "t" }, "SHARED SERVICES + SYSTEM TEAM"), React.createElement("span", { key: "s" }, "Legal · Finance · HR · Procurement · QC")])
    )
  );
}

// ---- STAKEHOLDER POWER/INTEREST MATRIX ---------------------
function StakeMatrix({ open }) {
  const O = window.GOLF.org;
  const quad = { manage: { l: "QUẢN LÝ SÁT", x: 1, y: 1, c: "oklch(0.64 0.2 25)" }, satisfy: { l: "GIỮ HÀI LÒNG", x: 0, y: 1, c: "oklch(0.80 0.14 75)" }, inform: { l: "GIỮ THÔNG TIN", x: 1, y: 0, c: "oklch(0.78 0.13 230)" }, monitor: { l: "THEO DÕI", x: 0, y: 0, c: "var(--ink-faint)" } };
  const cell = (sx, sy) => O.stakeholders.filter(s => { const q = quad[s.strategy]; return q.x === sx && q.y === sy; });
  const Q = (sx, sy, key) => {
    const q = quad[key];
    return React.createElement("div", { className: "sm-cell", style: { "--qc": q.c } },
      React.createElement("div", { className: "sm-qh" }, q.l),
      React.createElement("div", { className: "sm-chips" },
        cell(sx, sy).map((s, i) => React.createElement("button", { key: i, className: "sm-chip", "data-no-pan": true, title: s.note }, s.name))));
  };
  return React.createElement("div", { className: "stakematrix" },
    React.createElement("div", { className: "sm-yaxis" }, React.createElement("span", null, "QUYỀN LỰC →")),
    React.createElement("div", { className: "sm-grid" },
      Q(0, 1, "satisfy"), Q(1, 1, "manage"),
      Q(0, 0, "monitor"), Q(1, 0, "inform")),
    React.createElement("div", { className: "sm-xaxis" }, "MỨC QUAN TÂM →")
  );
}

function OrgView({ open }) {
  const G = window.GOLF, O = G.org;
  return React.createElement("div", { className: "orgview" },
    React.createElement("div", { className: "org-intro" },
      React.createElement("h2", null, "Tổ chức — quy mô · bộ máy · vai trò · stakeholder"),
      React.createElement("p", null, "Một doanh nghiệp ~90 người core bùng nổ trong 10 tuần, điều phối 800-1500 TNV và 40-60 nhà cung cấp. Bấm bất kỳ ô nào để xem mandate, OKR, cột mốc, tài nguyên và cam kết — sát với Mission Control.")),

    React.createElement("section", { className: "org-sec" },
      React.createElement("h3", null, "Quy mô tổ chức"),
      React.createElement(OrgScale, null)),

    React.createElement("section", { className: "org-sec" },
      React.createElement("h3", null, "Sơ đồ tổ chức (Org Chart) — bấm để drill-down vai trò"),
      React.createElement("div", { className: "ochart-wrap" }, React.createElement(OrgChart, { open }))),

    React.createElement("section", { className: "org-sec org-2col" },
      React.createElement("div", null,
        React.createElement("h3", null, "Bản đồ Stakeholder (Quyền lực × Quan tâm)"),
        React.createElement(StakeMatrix, { open })),
      React.createElement("div", null,
        React.createElement("h3", null, "OKR cấp ART — mục tiêu & key results"),
        React.createElement("div", { className: "artokr" },
          React.createElement("div", { className: "okr-obj" }, "◎ " + O.artOKR.objective),
          O.artOKR.krs.map((k, i) => React.createElement("div", { key: i, className: "okr-kr" },
            React.createElement("div", { className: "okr-kt" }, React.createElement("span", null, k[0]), React.createElement("b", null, k[1])),
            React.createElement("div", { className: "okr-bar" }, React.createElement("div", { className: "okr-fill", style: { width: Math.max(k[3], 3) + "%" } })),
            React.createElement("div", { className: "okr-cur" }, k[2])))))),

    React.createElement("section", { className: "org-sec" },
      React.createElement("h3", null, "Vai trò chính — mandate & ranh giới trách nhiệm"),
      React.createElement("div", { className: "roles-grid" },
        O.roles.map(r => React.createElement("button", { key: r.id, className: "role-card", style: { "--rc": `oklch(0.78 0.13 ${r.hue})` }, onClick: () => open({ type: "role", id: r.id }) },
          React.createElement("div", { className: "role-lvl" }, r.level),
          React.createElement("div", { className: "role-title" }, r.title),
          React.createElement("div", { className: "role-person" }, r.person),
          React.createElement("p", { className: "role-mandate" }, r.mandate),
          React.createElement("div", { className: "role-more" }, "Xem mandate · ranh giới →"))))),

    React.createElement("section", { className: "org-sec" },
      React.createElement("h3", null, "RACI — ai chịu trách nhiệm gì (R/A/C/I)"),
      React.createElement("div", { className: "raci-wrap" },
        React.createElement("div", { className: "raci" },
          React.createElement("div", { className: "raci-row raci-head" },
            React.createElement("div", { className: "raci-d" }, "Quyết định / Deliverable"),
            O.raci.cols.map(c => React.createElement("div", { key: c, className: "raci-c" }, c))),
          O.raci.rows.map((row, i) => React.createElement("div", { key: i, className: "raci-row" },
            React.createElement("div", { className: "raci-d" }, row.d),
            O.raci.cols.map(c => { const v = row.r[c]; return React.createElement("div", { key: c, className: "raci-c" },
              v && React.createElement("span", { className: "raci-cell raci-" + v }, v)); })))),
        React.createElement("div", { className: "raci-legend" },
          Object.keys(O.raci.legend).map(k => React.createElement("span", { key: k, className: "raci-lg" },
            React.createElement("span", { className: "raci-cell raci-" + k }, k),
            O.raci.legend[k][0] + " · " + O.raci.legend[k][1])))))
  );
}

window.OrgView = OrgView;
