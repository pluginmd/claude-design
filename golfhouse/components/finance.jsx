/* ============================================================
   TÀI CHÍNH — FinanceView (VLF2026)
   Scenario selector điều khiển toàn bộ tab; mọi panel liên đới.
   ============================================================ */
function FinanceView({ open }) {
  const F = window.GOLF_FINANCE;
  const [sc, setSc] = React.useState("Base Case");
  const k = F.kpi[sc];

  // format: triệu → tỷ
  const ty = (m) => (m / 1000);
  const fty = (m, d = 1) => ty(m).toLocaleString("vi-VN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (x, d = 0) => (x * 100).toFixed(d) + "%";
  const scColor = { Conservative: "oklch(0.74 0.13 230)", "Base Case": "oklch(0.74 0.14 150)", Aggressive: "oklch(0.74 0.16 40)" };
  const SC = scColor[sc];

  const totalCost = k.budget, totalRev = k.revenue;
  const maxCost = Math.max(...F.costCats.map(c => c.v[sc]));
  const maxRev = Math.max(...F.revCats.map(c => c.v[sc]));

  // cashflow geometry (only Base has detailed monthly; scale others proportionally for illustration)
  const cf = F.cashflow;
  const scaleCF = sc === "Base Case" ? 1 : (sc === "Conservative" ? 35000 / 50000 : 70000 / 50000);
  const cfIn = cf.inflow.map(v => v * (sc === "Base Case" ? 1 : (totalRev / 52500)));
  const cfOut = cf.outflow.map(v => v * (sc === "Base Case" ? 1 : (totalCost / 50000)));
  let run = 0; const cfCum = cfOut.map((o, i) => { run += (cfIn[i] - o); return run; });
  const cfMax = Math.max(...cfIn, ...cfOut), cfMin = Math.min(...cfCum, 0), cfTop = Math.max(...cfCum, cfMax);

  // risk sensitivity computed live from scenario
  const sens = F.revSteps.map(rv => F.costSteps.map(ct => Math.round(totalRev * rv - totalCost * (1 + ct))));
  const breakeven = totalCost / totalRev;

  const Bar = ({ v, max, color, lab }) => React.createElement("div", { className: "fbar-wrap" },
    React.createElement("div", { className: "fbar", style: { width: Math.max(v / max * 100, 1.5) + "%", background: color } }),
    React.createElement("span", { className: "fbar-v" }, lab));

  const Kpi = ({ label, val, unit, sub, tone, big }) => React.createElement("div", { className: "fkpi fkpi-" + (tone || "n") },
    React.createElement("div", { className: "fkpi-l" }, label),
    React.createElement("div", { className: "fkpi-v" }, val, unit && React.createElement("span", null, unit)),
    sub && React.createElement("div", { className: "fkpi-s" }, sub));

  return React.createElement("div", { className: "fin" },
    React.createElement("div", { className: "fin-intro" },
      React.createElement("div", null,
        React.createElement("div", { className: "fin-eyebrow" }, "MÔ HÌNH TÀI CHÍNH · 12 SHEET LIÊN KẾT"),
        React.createElement("h2", null, F.meta.title),
        React.createElement("p", null, "Đối tác địa phương " + F.meta.partner + " · sự kiện " + F.meta.date + " · đơn vị tỷ VND. Chọn kịch bản — toàn bộ chi phí, doanh thu, dòng tiền, vốn & rủi ro tái tính theo.")),
      React.createElement("div", { className: "sc-sel" },
        React.createElement("span", { className: "sc-lab" }, "KỊCH BẢN"),
        F.scenarios.map(s => React.createElement("button", { key: s, className: "sc-btn" + (sc === s ? " on" : ""), style: { "--sc": scColor[s] }, onClick: () => setSc(s) }, s)))),

    // KPI hero
    React.createElement("div", { className: "fkpi-strip" },
      Kpi({ label: "TỔNG NGÂN SÁCH", val: fty(k.budget), unit: "tỷ", sub: "chi phí", tone: "cost" }),
      Kpi({ label: "TỔNG DOANH THU", val: fty(k.revenue), unit: "tỷ", sub: "mục tiêu", tone: "rev" }),
      Kpi({ label: "LỢI NHUẬN RÒNG", val: fty(k.net), unit: "tỷ", sub: "net surplus", tone: k.net > 0 ? "pos" : "neu" }),
      Kpi({ label: "COST COVERAGE", val: k.coverage.toFixed(2) + "×", sub: "DT / chi phí", tone: "n" }),
      Kpi({ label: "BIÊN LỢI NHUẬN", val: pct(k.margin, 1), sub: "% doanh thu", tone: "n" }),
      Kpi({ label: "ROI", val: pct(k.roi), sub: "net / chi phí", tone: "n" }),
      Kpi({ label: "PEAK WORKING CAPITAL", val: fty(k.peakWC, 1), unit: "tỷ", sub: "đỉnh vốn lưu động", tone: "warn" }),
      Kpi({ label: "TOUR RIGHTS ĐÃ TRẢ", val: fty(F.tourRightsPaid, 1), unit: "tỷ", sub: "100k USD · 31/5/25", tone: "sunk" })
    ),

    // cost + revenue structure
    React.createElement("div", { className: "fin-row2" },
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Cơ cấu chi phí"), React.createElement("span", null, fty(totalCost) + " tỷ")),
        F.costCats.map((c, i) => React.createElement("button", { key: i, className: "fcat", onClick: () => open({ type: "fincost", name: c.name }) },
          React.createElement("div", { className: "fcat-top" }, React.createElement("b", null, c.name), c.fixed && React.createElement("span", { className: "fchip-fix" }, "cố định"), React.createElement("span", { className: "fcat-amt" }, fty(c.v[sc]) + " tỷ")),
          React.createElement(Bar, { v: c.v[sc], max: maxCost, color: c.fixed ? "var(--ink-faint)" : "oklch(0.78 0.14 75)", lab: pct(c.v[sc] / totalCost) })))),
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Cơ cấu doanh thu"), React.createElement("span", null, fty(totalRev) + " tỷ")),
        F.revCats.map((c, i) => React.createElement("div", { key: i, className: "fcat fcat-rev" },
          React.createElement("div", { className: "fcat-top" }, React.createElement("b", null, c.name), React.createElement("span", { className: "fcat-kind " + c.kind }, c.kind === "sponsor" ? "tài trợ" : "thương mại"), React.createElement("span", { className: "fcat-amt" }, fty(c.v[sc]) + " tỷ")),
          React.createElement(Bar, { v: c.v[sc], max: maxRev, color: c.kind === "sponsor" ? "oklch(0.74 0.14 150)" : "oklch(0.74 0.13 285)", lab: pct(c.v[sc] / totalRev) }))))),

    // P&L bridge
    React.createElement("div", { className: "fpanel pl-bridge" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Cầu nối P&L — Doanh thu → Chi phí → Lợi nhuận"), React.createElement("span", { className: "pl-be" }, "Hoà vốn khi DT đạt " + pct(breakeven, 1))),
      React.createElement("div", { className: "bridge" },
        React.createElement("div", { className: "br-bar br-rev", style: { flex: totalRev } }, React.createElement("span", null, "DT " + fty(totalRev) + " tỷ")),
        React.createElement("div", { className: "br-bar br-cost", style: { flex: totalCost } }, React.createElement("span", null, "Chi " + fty(totalCost) + " tỷ")),
        React.createElement("div", { className: "br-bar " + (k.net >= 0 ? "br-net" : "br-loss"), style: { flex: Math.max(Math.abs(k.net), totalRev * 0.04) } }, React.createElement("span", null, (k.net >= 0 ? "Lãi " : "Lỗ ") + fty(Math.abs(k.net)) + " tỷ")))),

    // CASHFLOW
    React.createElement("div", { className: "fpanel" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Dòng tiền theo tháng — 05/25 → sự kiện 08/26 → T+3"), React.createElement("span", { className: "cf-peak" }, "Đỉnh vốn lưu động " + fty(k.peakWC, 2) + " tỷ")),
      React.createElement("div", { className: "cfchart" },
        (function () {
          const W = 1040, H = 230, padB = 38, padT = 18, padL = 4;
          const n = cf.inflow.length, bw = (W - padL * 2) / n;
          const zeroY = padT + (cfTop / (cfTop - cfMin)) * (H - padT - padB);
          const sy = (v) => padT + ((cfTop - v) / (cfTop - cfMin)) * (H - padT - padB);
          const cumPts = cfCum.map((v, i) => (padL + i * bw + bw / 2) + "," + sy(v)).join(" ");
          return React.createElement("svg", { viewBox: "0 0 " + W + " " + H, className: "cf-svg", preserveAspectRatio: "none" },
            React.createElement("line", { x1: 0, y1: zeroY, x2: W, y2: zeroY, className: "cf-zero" }),
            cfIn.map((v, i) => { const x = padL + i * bw; return React.createElement("g", { key: i },
              v > 0 && React.createElement("rect", { x: x + bw * 0.16, y: sy(v), width: bw * 0.3, height: zeroY - sy(v), className: "cf-in", rx: 1 }),
              cfOut[i] > 0 && React.createElement("rect", { x: x + bw * 0.52, y: sy(cfOut[i]), width: bw * 0.3, height: zeroY - sy(cfOut[i]), className: "cf-out", rx: 1 })); }),
            React.createElement("polyline", { points: cumPts, className: "cf-cum" }),
            cfCum.map((v, i) => React.createElement("circle", { key: "c" + i, cx: padL + i * bw + bw / 2, cy: sy(v), r: i === cf.troughIdx || i === cf.eventIdx ? 3.5 : 2, className: "cf-cumdot" + (i === cf.troughIdx ? " trough" : "") })),
            React.createElement("rect", { x: padL + cf.eventIdx * bw, y: padT, width: bw, height: H - padT - padB, className: "cf-eventband" }),
            cf.inflow.map((v, i) => React.createElement("text", { key: "t" + i, x: padL + i * bw + bw / 2, y: H - padB + 14, className: "cf-x" + (i % 2 ? " alt" : "") }, F.cashLabels[i])));
        })()),
      React.createElement("div", { className: "cf-leg" },
        React.createElement("span", { className: "cfl cfl-in" }, "▮ Tiền vào"),
        React.createElement("span", { className: "cfl cfl-out" }, "▮ Tiền ra"),
        React.createElement("span", { className: "cfl cfl-cum" }, "— Luỹ kế (trước funding)"),
        React.createElement("span", { className: "cfl cfl-evt" }, "▮ Tuần sự kiện")),
      React.createElement("p", { className: "fnote" }, "⚑ " + cf.note)),

    // FUNDING + ROI
    React.createElement("div", { className: "fin-row2" },
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Nguồn vốn đề xuất"), React.createElement("span", null, fty(50000) + " tỷ")),
        F.funding.sources.map((s, i) => React.createElement("div", { key: i, className: "fund-row" },
          React.createElement("span", { className: "fund-src" }, s.src),
          React.createElement("div", { className: "fund-bar" }, React.createElement("div", { className: "fund-f", style: { width: s.pct * 100 + "%" } })),
          React.createElement("span", { className: "fund-amt" }, fty(s.amt) + " tỷ"),
          React.createElement("span", { className: "fund-pct" }, pct(s.pct)))),
        React.createElement("div", { className: "fund-foot" },
          React.createElement("div", null, React.createElement("span", null, "Facility vốn lưu động đề xuất"), React.createElement("b", null, fty(F.funding.facility, 2) + " tỷ")),
          React.createElement("div", null, React.createElement("span", null, "Đệm an toàn (10% WC)"), React.createElement("b", null, fty(F.funding.safetyBuffer, 2) + " tỷ")))),
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Giá trị & ROI mở rộng")),
        React.createElement("div", { className: "roi-grid" },
          React.createElement("div", { className: "roi-c" }, React.createElement("span", null, "Doanh thu trực tiếp"), React.createElement("b", null, fty(totalRev) + " tỷ")),
          React.createElement("div", { className: "roi-c" }, React.createElement("span", null, "Media value ước tính"), React.createElement("b", null, fty(F.funding.mediaValue) + " tỷ")),
          React.createElement("div", { className: "roi-c roi-hl" }, React.createElement("span", null, "Tổng giá trị (DT + media)"), React.createElement("b", null, fty(totalRev + F.funding.mediaValue) + " tỷ")),
          React.createElement("div", { className: "roi-c" }, React.createElement("span", null, "Total value / Cost"), React.createElement("b", null, ((totalRev + F.funding.mediaValue) / totalCost).toFixed(2) + "×")),
          React.createElement("div", { className: "roi-c" }, React.createElement("span", null, "Upside gia hạn 2027"), React.createElement("b", null, fty(F.funding.year2Upside) + " tỷ"))),
        React.createElement("p", { className: "fnote" }, "⚑ " + F.funding.roiNote))),

    // SPONSORSHIP PIPELINE
    React.createElement("div", { className: "fpanel" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Sponsorship — cam kết vs pipeline"), React.createElement("span", null, "Target " + fty(F.sponsorship.tiers.reduce((a, t) => a + t.v[sc], 0)) + " tỷ · pipeline ≥ 3×")),
      React.createElement("div", { className: "spon" },
        F.sponsorship.tiers.map((t, i) => React.createElement("div", { key: i, className: "spon-row", onClick: () => open({ type: "finspon", tier: t.tier }) },
          React.createElement("div", { className: "spon-name" }, t.tier, React.createElement("span", null, t.range + " · " + t.slots + " slot")),
          React.createElement("div", { className: "spon-bars" },
            React.createElement("div", { className: "spon-track" },
              React.createElement("div", { className: "spon-target", style: { width: Math.min(t.v[sc] / 27000 * 100, 100) + "%" } }, fty(t.v[sc]) + " tỷ"),
              React.createElement("div", { className: "spon-commit", style: { width: Math.min(t.v[sc] * t.commit / 27000 * 100, 100) + "%" } }))),
          React.createElement("div", { className: "spon-commitpct" }, "commit " + pct(t.commit))))),
      React.createElement("div", { className: "spon-foot" },
        React.createElement("span", null, "Pipeline (3×): ", React.createElement("b", null, fty(F.sponsorship.pipelineTotal) + " tỷ")),
        React.createElement("span", null, "Risk-adjusted (weighted): ", React.createElement("b", null, fty(F.sponsorship.riskAdjusted) + " tỷ")))),

    // MANPOWER + VENDOR
    React.createElement("div", { className: "fin-row2" },
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Nhân sự (bottom-up)"), React.createElement("span", null, fty(F.manpower.total, 2) + " tỷ · " + F.manpower.headcount + " người")),
        F.manpower.byBlock.map((b, i) => React.createElement("div", { key: i, className: "bu-row bu-link", onClick: () => { const lk = F.links.manpowerBlock[b.block] || {}; if (lk.biz) window.__nav("playbook", { type: "biz", id: lk.biz }); else if (lk.team) window.__nav(null, { type: "team", id: lk.team }); } },
          React.createElement("span", { className: "bu-name" }, b.block),
          React.createElement("div", { className: "bu-bar" }, React.createElement("div", { className: "bu-f mp", style: { width: b.cost / 1026 * 100 + "%" } })),
          React.createElement("span", { className: "bu-amt" }, fty(b.cost, 2)), React.createElement("span", { className: "bu-hc" }, b.hc + " ng"))),
        React.createElement("p", { className: "fnote" }, "Chiếm " + pct(F.manpower.pctBudget, 1) + " ngân sách Base Case.")),
      React.createElement("div", { className: "fpanel" },
        React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Vendor (bottom-up)"), React.createElement("span", null, fty(F.vendor.total) + " tỷ · " + pct(F.vendor.pctBudget) + " NS")),
        F.vendor.byBlock.map((b, i) => React.createElement("div", { key: i, className: "bu-row" },
          React.createElement("span", { className: "bu-name" }, b.block),
          React.createElement("div", { className: "bu-bar" }, React.createElement("div", { className: "bu-f vd", style: { width: b.cost / 10000 * 100 + "%" } })),
          React.createElement("span", { className: "bu-amt" }, fty(b.cost, 1)))),
        React.createElement("p", { className: "fnote" }, "Tạm ứng khi ký (deposit): " + fty(F.vendor.deposit) + " tỷ — áp lực dòng tiền sớm."))),

    // RISK SENSITIVITY
    React.createElement("div", { className: "fpanel" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Độ nhạy lợi nhuận — % doanh thu đạt × % chi phí vượt"), React.createElement("span", null, "Hoà vốn khi DT ≥ " + pct(breakeven, 1))),
      React.createElement("div", { className: "sens-wrap" },
        React.createElement("table", { className: "sens" },
          React.createElement("thead", null, React.createElement("tr", null,
            React.createElement("th", null, "DT% ＼ Chi%"),
            F.costSteps.map((c, i) => React.createElement("th", { key: i }, "+" + pct(c))))),
          React.createElement("tbody", null,
            F.revSteps.map((rv, ri) => React.createElement("tr", { key: ri },
              React.createElement("th", null, pct(rv)),
              sens[ri].map((val, ci) => React.createElement("td", { key: ci, className: "sens-cell " + (val > 0 ? "pos" : val === 0 ? "zero" : val > -5000 ? "neg1" : "neg2") }, fty(val, 1)))))))),
      React.createElement("p", { className: "fnote" }, "Giá trị = tỷ VND lợi nhuận ròng. Xanh = lãi · vàng = hoà vốn · đỏ = lỗ. Bảng tái tính theo kịch bản đang chọn.")),

    // RISK DRIVERS
    React.createElement("div", { className: "fpanel" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Rủi ro chính & giảm thiểu")),
      React.createElement("div", { className: "rdrv" },
        F.riskDrivers.map((r, i) => React.createElement("div", { key: i, className: "rdrv-row rdrv-link", onClick: () => { const bz = F.links.riskLink[i]; if (bz) window.__nav("playbook", { type: "biz", id: bz }); } },
          React.createElement("div", { className: "rdrv-r" }, r.r),
          React.createElement("span", { className: "rdrv-l rl-" + r.l.replace(/[. ]/g, "") }, "KN " + r.l),
          React.createElement("span", { className: "rdrv-i ri-" + r.i.replace(/[. ]/g, "") }, "TĐ " + r.i),
          React.createElement("div", { className: "rdrv-m" }, "↳ " + r.m))))),

    // LINKAGE MAP
    React.createElement("div", { className: "fpanel linkmap" },
      React.createElement("div", { className: "fpanel-h" }, React.createElement("h3", null, "Bản đồ liên đới — mọi thứ kết nối ra sao")),
      React.createElement("div", { className: "lk-flow" },
        [
          { t: "KỊCH BẢN", d: sc, c: SC },
          { t: "CHI PHÍ", d: fty(totalCost) + " tỷ", c: "oklch(0.78 0.14 75)", nav: ["playbook", { type: "biz", id: "BIZ6" }] },
          { t: "DOANH THU", d: fty(totalRev) + " tỷ", c: "oklch(0.74 0.14 150)", nav: ["playbook", { type: "biz", id: "BIZ3" }] },
          { t: "DÒNG TIỀN", d: "đỉnh WC " + fty(k.peakWC, 1) + " tỷ", c: "var(--cyan)" },
          { t: "VỐN LƯU ĐỘNG", d: "facility " + fty(F.funding.facility, 1) + " tỷ", c: "oklch(0.78 0.13 50)" },
          { t: "LỢI NHUẬN / ROI", d: fty(k.net) + " tỷ · ROI " + pct(k.roi), c: k.net > 0 ? "oklch(0.74 0.14 150)" : "var(--warn)", nav: ["mission", null] }
        ].map((n, i, arr) => React.createElement(React.Fragment, { key: i },
          React.createElement(n.nav ? "button" : "div", { className: "lk-node" + (n.nav ? " lk-clickable" : ""), style: { "--lkc": n.c }, onClick: n.nav ? () => window.__nav(n.nav[0], n.nav[1]) : undefined }, React.createElement("b", null, n.t), React.createElement("span", null, n.d)),
          i < arr.length - 1 && React.createElement("span", { className: "lk-arrow" }, "→")))),
      React.createElement("p", { className: "fnote" }, "Đổi kịch bản ở trên → toàn chuỗi tái tính: quy mô chi phí & coverage doanh thu thay đổi → cấu trúc dòng tiền & đỉnh vốn lưu động dịch chuyển → nhu cầu funding & ROI biến đổi → độ nhạy rủi ro khác đi."))
  );
}

window.FinanceView = FinanceView;
