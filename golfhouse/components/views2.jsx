/* ============================================================
   Views part 2: Timeline (PI map) · Playbook
   ============================================================ */

// ---------- TIMELINE / PI MAP -------------------------------
function Timeline({ filter, open }) {
  const G = window.GOLF;
  const kindCol = {
    prep: "var(--ink-dim)", milestone: "var(--cyan)", run: "var(--line)",
    checkpoint: "var(--warn)", harden: "oklch(0.78 0.13 70)", live: "oklch(0.74 0.13 150)", close: "oklch(0.72 0.13 300)"
  };
  const active = (s) => !filter.sprint || filter.sprint === s;
  // phases for grouping label
  return React.createElement("div", { className: "tl-scroll" },
    React.createElement("div", { className: "tl-inner" },
      React.createElement("div", { className: "tl-head" },
        React.createElement("h2", null, "Timeline PI · 10 tuần thực thi"),
        React.createElement("p", null, "1 PI duy nhất = toàn bộ dự án. Sprint nén 1 tuần → 10 vòng feedback. Hardening = Sprint 9. Inspect & Adapt = 8 tuần đóng dự án.")
      ),
      // critical path strip
      React.createElement("div", { className: "cp-strip" },
        React.createElement("span", { className: "cp-tag" }, "CRITICAL PATH (VN lần đầu)"),
        ["License", "Venue/ngày", "Title sponsor", "Broadcast", "UBND approval", "Visa cluster", "Carnet hải quan", "Build", "Giải", "Closure"].map((c, i, a) =>
          React.createElement("span", { key: c, className: "cp-node" }, c, i < a.length - 1 && React.createElement("i", null, "→")))
      ),
      // sprint rail
      React.createElement("div", { className: "tl-rail" },
        G.sprints.map(s => React.createElement("button", {
          key: s.id, className: "tl-card kind-" + s.kind + (active(s.id) ? "" : " dim"),
          style: { "--kc": kindCol[s.kind] }, "data-no-pan": true,
          onClick: () => open({ type: "sprint", id: s.id })
        },
          React.createElement("div", { className: "tl-top" },
            React.createElement("span", { className: "tl-label" }, s.label),
            React.createElement("span", { className: "tl-t" }, s.tminus)),
          React.createElement("div", { className: "tl-phase" }, s.phase),
          React.createElement("div", { className: "tl-title" }, s.title),
          React.createElement("p", { className: "tl-goal" }, s.goal),
          React.createElement("div", { className: "tl-foot" }, s.deliver.length + " deliverable" + (s.demo ? " · System Demo" : ""))
        ))
      ),
      // ceremony cadence matrix
      React.createElement("div", { className: "cad-wrap" },
        React.createElement("h3", null, "Ma trận Ceremony Cadence — nhịp tăng dần theo gần ngày giải"),
        React.createElement("div", { className: "cad-table" },
          React.createElement("div", { className: "cad-row cad-hd" },
            React.createElement("div", { className: "cad-c0" }, "Ceremony"),
            G.ceremonyPhases.map(p => React.createElement("div", { key: p, className: "cad-c" }, p))),
          G.ceremonies.map(c => React.createElement("div", { key: c.name, className: "cad-row" },
            React.createElement("div", { className: "cad-c0" }, c.name),
            c.c.map((v, i) => React.createElement("div", { key: i, className: "cad-c" + (v === "—" ? " cad-x" : "") }, v))))
        )
      ),
      // run-of-show
      React.createElement("div", { className: "ros-wrap" },
        React.createElement("h3", null, "Run-of-Show — một ngày thi đấu (tuần giải) theo giờ"),
        React.createElement("div", { className: "ros" },
          (G.runOfShow || []).map((r, i) => React.createElement("div", { key: i, className: "ros-row ros-" + r.k },
            React.createElement("div", { className: "ros-t" }, r.t),
            React.createElement("div", { className: "ros-line" }),
            React.createElement("div", { className: "ros-a" }, r.a, React.createElement("span", { className: "ros-who" }, r.who)))))
      )
    )
  );
}

// ---------- PLAYBOOK SURFACE (doc 1) ------------------------
function Card({ children, onClick, accent, className }) {
  return React.createElement("button", { className: "pcard " + (className || ""), onClick, style: accent ? { "--ac": accent } : undefined }, children);
}

function Playbook({ open }) {
  const G = window.GOLF;
  const biz = G.business || window.GOLF_BUSINESS || [];
  return React.createElement("div", { className: "pb2" },
    React.createElement("div", { className: "pb2-intro" },
      React.createElement("h2", null, "Playbook vận hành — điều hành giải như một doanh nghiệp"),
      React.createElement("p", null, "Một giải golf quốc tế không phải một sự kiện — nó là một doanh nghiệp đa khung giá trị bùng nổ trong 12-18 tháng: nhiều nhóm khách hàng, mạng lưới đối tác, nhiều dòng doanh thu, bộ máy nhân sự, thương hiệu, công nghệ, rủi ro. Dưới đây là toàn bộ mô hình điều hành — bấm vào bất kỳ khung nào để xem mục tiêu, khách hàng, đề xuất giá trị, năng lực, đòn bẩy, KPI và rủi ro.")
    ),

    // BUSINESS OPERATING MODEL — 12 value frameworks
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "12"), "Khung giá trị — mô hình điều hành doanh nghiệp giải golf"),
      React.createElement("div", { className: "biz-grid" },
        biz.map(b => React.createElement("button", {
          key: b.id, className: "biz-card", style: { "--bc": `oklch(0.78 0.13 ${b.hue})`, "--bcd": `oklch(0.78 0.13 ${b.hue} / 0.1)` },
          onClick: () => open({ type: "biz", id: b.id })
        },
          React.createElement("div", { className: "biz-ic" }, b.icon),
          React.createElement("div", { className: "biz-body" },
            React.createElement("div", { className: "biz-short" }, b.short),
            React.createElement("div", { className: "biz-name" }, b.name),
            React.createElement("p", { className: "biz-tag" }, b.tagline)),
          React.createElement("div", { className: "biz-foot" },
            React.createElement("span", { className: "biz-own" }, b.owner),
            React.createElement("span", { className: "biz-arrow" }, "→"))
        ))
      )
    ),

    // Functional areas
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "11 + 4"), "Functional Areas — bộ khung lõi vận hành"),
      React.createElement("div", { className: "fa-grid" },
        G.functionalAreas.map(f => {
          const t = G.teams.find(x => x.id === f.team);
          return React.createElement(Card, { key: f.id, accent: vsColor(t.vs), onClick: () => open({ type: "fa", id: f.id }) },
            React.createElement("div", { className: "fa-top" }, React.createElement("span", { className: "fa-id" }, f.id), React.createElement("span", { className: "fa-team" }, "→ " + f.team)),
            React.createElement("div", { className: "fa-name" }, f.name),
            React.createElement("p", { className: "fa-d" }, f.d));
        })
      )
    ),

    // 5 phases lifecycle
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "5 pha"), "Vòng đời dự án 12-18 tháng → hội tụ về một đỉnh"),
      React.createElement("div", { className: "phase-rail" },
        G.phases.map((p, i) => React.createElement(Card, { key: p.id, className: "phase-card", onClick: () => open({ type: "phase", id: p.id }) },
          React.createElement("div", { className: "phase-n" }, "P" + (i + 1)),
          React.createElement("div", { className: "phase-name" }, p.name),
          React.createElement("div", { className: "phase-t" }, p.tminus),
          React.createElement("ul", null, p.items.slice(0, 3).map((it, k) => React.createElement("li", { key: k }, it))),
          React.createElement("div", { className: "phase-more" }, "+ " + (p.items.length - 3) + " hạng mục")
        ))
      )
    ),

    // ecosystem
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "3 cụm"), "Hệ sinh thái hoạt động bên lề"),
      React.createElement("div", { className: "eco-grid" },
        G.ecosystem.map((c, i) => React.createElement(Card, { key: i, className: "eco-card", onClick: () => open({ type: "eco", id: i }) },
          React.createElement("div", { className: "eco-name" }, c.cluster),
          React.createElement("ul", null, c.items.slice(0, 4).map((it, k) => React.createElement("li", { key: k }, it))),
          React.createElement("div", { className: "phase-more" }, "+ chi tiết")
        ))
      )
    ),

    // finance
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "$"), "Mô hình tài chính — " + G.finance.note),
      React.createElement("button", { className: "pb-financelink", onClick: () => window.__nav && window.__nav("finance", null) }, "₫ Xem mô hình tài chính đầy đủ — VLF2026: 3 kịch bản · cashflow 19 tháng · funding · độ nhạy rủi ro →"),
      React.createElement("div", { className: "fin-grid" },
        React.createElement("div", { className: "fin-col" },
          React.createElement("div", { className: "fin-hd cost" }, "CHI PHÍ"),
          G.finance.cost.map((r, i) => React.createElement("div", { key: i, className: "fin-row" },
            React.createElement("span", null, r[0]), React.createElement("b", null, r[1]), React.createElement("em", null, r[2]))),
          React.createElement("div", { className: "fin-row fin-total" },
            React.createElement("span", null, G.finance.costTotal[0]), React.createElement("b", null, G.finance.costTotal[1]), React.createElement("em", null, G.finance.costTotal[2]))),
        React.createElement("div", { className: "fin-col" },
          React.createElement("div", { className: "fin-hd rev" }, "DOANH THU"),
          G.finance.revenue.map((r, i) => React.createElement("div", { key: i, className: "fin-row" },
            React.createElement("span", null, r[0]), React.createElement("b", null, r[1]))),
          React.createElement("div", { className: "fin-row fin-total" },
            React.createElement("span", null, G.finance.revenueTotal[0]), React.createElement("b", null, G.finance.revenueTotal[1])),
          React.createElement("div", { className: "fin-rule" }, "⚑ " + G.finance.rule))
      )
    ),

    // cashflow + breakeven
    React.createElement("section", { className: "pb2-sec pb2-two" },
      React.createElement("div", null,
        React.createElement("h3", null, React.createElement("em", null, "≈"), "Dòng tiền theo tuần — chi trước, thu sau"),
        (function () {
          const cf = G.finance.cashflow, W = 460, H = 150, pad = 8;
          const x = (i) => pad + i * ((W - 2 * pad) / (cf.length - 1));
          const y = (v) => H - pad - (v / 110) * (H - 2 * pad);
          const line = (key) => cf.map((d, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(d[key]).toFixed(1)).join(" ");
          const area = "M" + x(0) + " " + y(cf[0].in) + " " + cf.map((d, i) => "L" + x(i).toFixed(1) + " " + y(d.in).toFixed(1)).join(" ") + " " + cf.map((d, i) => "L" + x(cf.length - 1 - i).toFixed(1) + " " + y(cf[cf.length - 1 - i].out).toFixed(1)).join(" ") + " Z";
          return React.createElement("div", { className: "cash" },
            React.createElement("svg", { viewBox: "0 0 " + W + " " + H, className: "cash-svg", preserveAspectRatio: "none" },
              React.createElement("path", { d: area, className: "cash-area" }),
              React.createElement("path", { d: line("out"), className: "cash-out" }),
              React.createElement("path", { d: line("in"), className: "cash-in" })),
            React.createElement("div", { className: "cash-x" }, cf.filter((d, i) => i % 2 === 0).map((d, i) => React.createElement("span", { key: i }, d.w))),
            React.createElement("div", { className: "cash-leg" },
              React.createElement("span", { className: "cl-in" }, "● Thu luỹ kế"),
              React.createElement("span", { className: "cl-out" }, "● Chi luỹ kế")),
            React.createElement("p", { className: "cash-note" }, "⚑ " + G.finance.cashNote));
        })()),
      React.createElement("div", null,
        React.createElement("h3", null, React.createElement("em", null, "3"), "Hoà vốn qua 3 mùa"),
        React.createElement("div", { className: "beven" },
          G.finance.breakeven.map((b, i) => {
            const profit = b.rev - b.cost;
            return React.createElement("div", { key: i, className: "bev-row" },
              React.createElement("div", { className: "bev-season" }, b.season),
              React.createElement("div", { className: "bev-bars" },
                React.createElement("div", { className: "bev-track" }, React.createElement("div", { className: "bev-cost", style: { width: b.cost + "%" } }, "Chi " + b.cost)),
                React.createElement("div", { className: "bev-track" }, React.createElement("div", { className: "bev-rev", style: { width: b.rev + "%" } }, "Thu " + b.rev))),
              React.createElement("div", { className: "bev-pl " + (profit >= 0 ? "pos" : "neg") }, (profit >= 0 ? "+" : "") + profit),
              React.createElement("p", { className: "bev-note" }, b.note));
          }))
      )
    ),

    // tour ladder
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "↗"), "Bậc thang lựa chọn giải — quyết định trước mọi thứ"),
      React.createElement("div", { className: "ladder" },
        G.tourLadder.map((t, i) => React.createElement("div", { key: i, className: "ladder-row" + (i === 2 ? " ladder-hi" : "") },
          React.createElement("div", { className: "ladder-step" }, i + 1),
          React.createElement("div", { className: "ladder-tour" }, t.tour),
          React.createElement("div", { className: "ladder-purse" }, t.purse),
          React.createElement("div", { className: "ladder-acc" }, t.access),
          React.createElement("div", { className: "ladder-vn" }, t.vn)))
      )
    ),

    // patterns + anti
    React.createElement("section", { className: "pb2-sec" },
      React.createElement("h3", null, React.createElement("em", null, "12"), "Pattern thực thi — để plan không \"đẹp trên giấy\""),
      React.createElement("div", { className: "pat-grid" },
        G.patterns.map((p, i) => React.createElement(Card, { key: i, className: "pat-card", onClick: () => open({ type: "pattern", id: i }) },
          React.createElement("div", { className: "pat-n" }, p.n),
          React.createElement("div", { className: "pat-t" }, p.t)))
      ),
      React.createElement("h3", { className: "anti-h" }, React.createElement("em", { className: "warn" }, "⚠"), "Anti-pattern — không được rơi vào"),
      React.createElement("div", { className: "anti-grid" },
        G.antiPatterns.map((p, i) => React.createElement(Card, { key: i, className: "anti-card", onClick: () => open({ type: "anti", id: i }) },
          React.createElement("div", { className: "anti-t" }, "✕ " + p.t),
          React.createElement("p", null, p.d.slice(0, 90) + "…")))
    )),

    // artefacts + wsjf
    React.createElement("section", { className: "pb2-sec pb2-two" },
      React.createElement("div", null,
        React.createElement("h3", null, React.createElement("em", null, "SSOT"), "Bộ tài liệu sống điều hành"),
        React.createElement("div", { className: "arte-list" },
          G.artefacts.map((a, i) => React.createElement("div", { key: i, className: "arte" }, React.createElement("span", null, (i + 1).toString().padStart(2, "0")), a)))),
      React.createElement("div", null,
        React.createElement("h3", null, React.createElement("em", null, "WSJF"), "Ưu tiên hóa backlog"),
        React.createElement("div", { className: "wsjf-formula" }, G.wsjf.formula),
        React.createElement("div", { className: "wsjf-list" },
          G.wsjf.examples.map((e, i) => React.createElement("div", { key: i, className: "wsjf-row" }, React.createElement("b", null, e[0]), React.createElement("span", null, e[1])))),
        React.createElement("div", { className: "wsjf-rule" }, "⚑ " + G.wsjf.rule))
    )
  );
}

window.Timeline = Timeline;
window.Playbook = Playbook;

// ---------- PLAIN-LANGUAGE VIEW ("Dễ hiểu") -----------------
function PlainView({ open, goView }) {
  const P = window.GOLF.plain;
  const G = window.GOLF;
  return React.createElement("div", { className: "plain" },
    React.createElement("div", { className: "plain-hero" },
      React.createElement("div", { className: "plain-eyebrow" }, "BẮT ĐẦU TỪ ĐÂY · KHÔNG CẦN BIẾT SAFe"),
      React.createElement("h2", null, P.hero.lead),
      React.createElement("p", null, P.hero.body)
    ),

    // 4 floors as plain org
    React.createElement("section", { className: "plain-sec" },
      React.createElement("h3", null, "Bộ máy có 4 cấp — như một tổ chức quen thuộc"),
      React.createElement("div", { className: "floors" },
        P.floors.map((f, i) => React.createElement("div", { key: i, className: "floor" },
          React.createElement("div", { className: "floor-rail" },
            React.createElement("span", { className: "floor-icon" }, f.icon),
            i < P.floors.length - 1 && React.createElement("span", { className: "floor-down" }, "▼")),
          React.createElement("div", { className: "floor-body" },
            React.createElement("div", { className: "floor-head" },
              React.createElement("span", { className: "floor-plain" }, f.plain),
              React.createElement("span", { className: "floor-safe" }, "SAFe: " + f.safe),
              React.createElement("span", { className: "floor-who" }, f.who)),
            React.createElement("p", { className: "floor-analogy" }, "“ " + f.analogy + " ”"),
            React.createElement("p", { className: "floor-job" }, f.job)
          )
        ))
      )
    ),

    // glossary
    React.createElement("section", { className: "plain-sec" },
      React.createElement("h3", null, "Từ điển: thuật ngữ SAFe → tiếng Việt thường"),
      React.createElement("div", { className: "gloss" },
        React.createElement("div", { className: "gloss-row gloss-hd" },
          React.createElement("div", null, "Thuật ngữ"), React.createElement("div", null, "Dịch dễ hiểu"), React.createElement("div", null, "Nghĩa trong giải golf")),
        P.glossary.map((g, i) => React.createElement("div", { key: i, className: "gloss-row" },
          React.createElement("div", { className: "gloss-safe" }, g.safe),
          React.createElement("div", { className: "gloss-vi" }, g.vi),
          React.createElement("div", { className: "gloss-g" }, g.g)))
      )
    ),

    // key principles
    React.createElement("section", { className: "plain-sec" },
      React.createElement("h3", null, "4 nguyên tắc cốt lõi — nhớ chừng này là đủ"),
      React.createElement("div", { className: "princ-grid" },
        P.principles.map((p, i) => React.createElement("div", { key: i, className: "princ" },
          React.createElement("div", { className: "princ-n" }, i + 1),
          React.createElement("div", null,
            React.createElement("div", { className: "princ-t" }, p.t),
            React.createElement("p", null, p.d))))
      )
    ),

    // reading guide → jumps to tabs
    React.createElement("section", { className: "plain-sec" },
      React.createElement("h3", null, "Cách đọc các bản đồ còn lại"),
      React.createElement("div", { className: "guide-grid" },
        P.guide.map((g, i) => React.createElement("button", { key: i, className: "guide-card", onClick: () => goView(g.view) },
          React.createElement("div", { className: "guide-n" }, "0" + (i + 1)),
          React.createElement("div", { className: "guide-t" }, g.t),
          React.createElement("p", null, g.d),
          React.createElement("span", { className: "guide-go" }, "Mở bản đồ →")))
      )
    )
  );
}

window.PlainView = PlainView;
