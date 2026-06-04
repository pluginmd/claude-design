/* ============================================================
   CEO COCKPIT — tổng quan điều hành cấp cao
   ============================================================ */
function CEOCockpit({ open, goView }) {
  const C = window.GOLF_CEO;
  const ragC = { green: "oklch(0.74 0.14 150)", amber: "oklch(0.80 0.14 75)", red: "oklch(0.64 0.2 25)" };
  const ragL = { green: "Tốt", amber: "Cần theo dõi", red: "Cảnh báo" };
  const nav = (a) => () => a && (a[0] || a[1]) ? window.__nav(a[0], a[1]) : null;
  const sevMeta = { high: { l: "CAO", c: "oklch(0.64 0.2 25)" }, med: { l: "TB", c: "oklch(0.80 0.14 75)" }, low: { l: "THẤP", c: "var(--ink-faint)" } };
  const urgMeta = { now: { l: "NGAY", c: "oklch(0.64 0.2 25)" }, soon: { l: "SỚM", c: "oklch(0.80 0.14 75)" }, scheduled: { l: "THEO LỊCH", c: "var(--ink-faint)" } };

  return React.createElement("div", { className: "ceo" },
    React.createElement("div", { className: "ceo-intro" },
      React.createElement("div", { className: "ceo-eyebrow" }, "CEO COCKPIT · TỔNG QUAN ĐIỀU HÀNH HỢP NHẤT"),
      React.createElement("h2", null, "Một màn hình — toàn cảnh giải golf như một doanh nghiệp"),
      React.createElement("p", null, "Hợp nhất Tài chính (VLF2026) × Vận hành (SAFe) × Tổ chức × Rủi ro thành góc nhìn CEO, kèm phân tích khoảng trống của chuyên gia tổ chức giải. " + C.verdict.asOf + ".")),

    // VERDICT banner
    React.createElement("div", { className: "verdict verdict-" + C.verdict.rag },
      React.createElement("div", { className: "vd-left" },
        React.createElement("div", { className: "vd-rating-l" }, "ĐÁNH GIÁ TỔNG"),
        React.createElement("div", { className: "vd-rating" }, C.verdict.rating)),
      React.createElement("div", { className: "vd-body" },
        React.createElement("p", { className: "vd-head" }, C.verdict.headline),
        React.createElement("div", { className: "vd-drivers" },
          C.verdict.drivers.map((d, i) => React.createElement("div", { key: i, className: "vd-driver" }, "› " + d))))),

    // 6 HEALTH dimensions
    React.createElement("div", { className: "ceo-sec-h" }, React.createElement("h3", null, "Sức khỏe điều hành — 6 chiều"), React.createElement("span", null, "bấm để mở tab nguồn")),
    React.createElement("div", { className: "health-grid" },
      C.health.map((h, i) => React.createElement("button", { key: i, className: "health-card", style: { "--hc": ragC[h.rag] }, onClick: () => goView(h.tab) },
        React.createElement("div", { className: "hc-top" }, React.createElement("span", { className: "hc-dot" }), React.createElement("b", null, h.dim), React.createElement("span", { className: "hc-rag" }, ragL[h.rag])),
        React.createElement("div", { className: "hc-metric" }, h.metric),
        React.createElement("p", { className: "hc-detail" }, h.detail)))),

    // 3 QUESTIONS
    React.createElement("div", { className: "ceo-sec-h" }, React.createElement("h3", null, "Ba câu hỏi lớn của CEO")),
    React.createElement("div", { className: "q3" },
      C.questions.map((q, i) => React.createElement("button", { key: i, className: "q3-card", style: { "--hc": ragC[q.rag] }, onClick: nav(q.link) },
        React.createElement("div", { className: "q3-q" }, React.createElement("span", { className: "q3-dot" }), q.q),
        React.createElement("p", { className: "q3-a" }, q.a),
        React.createElement("span", { className: "q3-more" }, "Đi tới chi tiết →")))),

    React.createElement("div", { className: "ceo-row2" },
      // DECISION cockpit
      React.createElement("div", { className: "ceo-panel" },
        React.createElement("h3", null, "Quyết định cần CEO xử lý"),
        React.createElement("div", { className: "dec-list" },
          C.decisions.map((d, i) => React.createElement("div", { key: i, className: "dec-row" },
            React.createElement("span", { className: "dec-urg", style: { background: urgMeta[d.urgency].c } }, urgMeta[d.urgency].l),
            React.createElement("div", null, React.createElement("b", null, d.d), React.createElement("p", null, d.why), React.createElement("em", null, "Chủ trì: " + d.owner)))))),
      // STRATEGIC value
      React.createElement("div", { className: "ceo-panel" },
        React.createElement("h3", null, "Giá trị chiến lược — ngoài P&L"),
        React.createElement("div", { className: "sv-list" },
          C.strategicValue.map((s, i) => React.createElement("div", { key: i, className: "sv-row" + (i === 2 ? " sv-hl" : "") },
            React.createElement("span", { className: "sv-k" }, s.k),
            React.createElement("b", { className: "sv-v" }, s.v),
            React.createElement("span", { className: "sv-n" }, s.note)))),
        React.createElement("button", { className: "sv-link", onClick: () => goView("finance") }, "₫ Mở mô hình tài chính đầy đủ →"))),

    // ASSUMPTIONS
    React.createElement("div", { className: "ceo-sec-h" }, React.createElement("h3", null, "Giả định then chốt — mô hình dựa vào")),
    React.createElement("div", { className: "asm-grid" },
      C.assumptions.map((a, i) => React.createElement("div", { key: i, className: "asm-card" },
        React.createElement("div", { className: "asm-a" }, "◆ " + a.a),
        React.createElement("div", { className: "asm-r" }, "⚠ " + a.risk)))),

    // GAP ANALYSIS — expert missing pieces
    React.createElement("div", { className: "ceo-sec-h gap-h" },
      React.createElement("h3", null, "Mảnh ghép còn thiếu — phân tích chuyên gia"),
      React.createElement("span", null, "những gì mô hình & hệ thống nên bổ sung")),
    React.createElement("div", { className: "gap-list" },
      C.gaps.map((g, i) => React.createElement("div", { key: i, className: "gap-card gap-" + g.sev },
        React.createElement("div", { className: "gap-top" },
          React.createElement("span", { className: "gap-sev", style: { background: sevMeta[g.sev].c } }, sevMeta[g.sev].l),
          React.createElement("span", { className: "gap-area" }, g.area),
          React.createElement("b", { className: "gap-title" }, g.gap)),
        React.createElement("p", { className: "gap-detail" }, g.detail),
        React.createElement("div", { className: "gap-rec" }, "↳ Khuyến nghị: " + g.rec)))),

    React.createElement("div", { className: "ceo-foot" },
      "Bản đồ điều hành hợp nhất 10 tab · dữ liệu tài chính thật từ VLF2026 · phân tích bởi góc nhìn chuyên gia tổ chức giải. Mọi khối đều bấm sâu được và liên kết chéo.")
  );
}

window.CEOCockpit = CEOCockpit;
