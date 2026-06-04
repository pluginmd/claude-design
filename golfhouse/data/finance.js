/* ============================================================
   TÀI CHÍNH — Vietnam Legends Festival 2026 (VLF2026)
   Đối tác địa phương: The Golf House · Sự kiện 18–23/8/2026
   Nguồn: VLF2026_Financial_Model.xlsx (12 sheet) — số liệu thật
   Đơn vị nội bộ: triệu VND. Hiển thị tỷ = /1000.
   ============================================================ */
(function () {
  const FX = 26000; // USD/VND
  const scenarios = ["Conservative", "Base Case", "Aggressive"];

  // KPI theo kịch bản (triệu VND)
  const kpi = {
    Conservative: { budget: 35000, revenue: 35000, net: 0, coverage: 1.00, margin: 0, roi: 0, peakWC: 2937.85 },
    "Base Case": { budget: 50000, revenue: 52500, net: 2500, coverage: 1.05, margin: 0.0476, roi: 0.05, peakWC: 2937.85 },
    Aggressive: { budget: 70000, revenue: 77000, net: 7000, coverage: 1.10, margin: 0.0909, roi: 0.10, peakWC: 2937.85 }
  };
  const tourRightsPaid = 2600; // 100k USD đã trả 31/5/25
  const legendsFee = 18850;    // cố định mọi kịch bản

  // Cơ cấu CHI PHÍ theo kịch bản (triệu)
  const costCats = [
    { name: "Tour Rights & Legends Fee", fixed: true, v: { Conservative: 18850, "Base Case": 18850, Aggressive: 18850 }, note: "Phí Legends cố định (bản quyền + prize + TT quốc tế)" },
    { name: "Event Production", v: { Conservative: 5254.88, "Base Case": 10135.57, Aggressive: 16643.17 }, w: 0.15, note: "Overlay, kỹ thuật AV/LED, branding, gian hàng & entertainment" },
    { name: "Golf Operations", v: { Conservative: 2802.60, "Base Case": 5405.64, Aggressive: 8876.36 }, w: 0.08, note: "Course setup, scoring, caddies-carts-on course" },
    { name: "Hospitality", v: { Conservative: 1751.63, "Base Case": 3378.52, Aggressive: 5547.72 }, w: 0.05, note: "VIP lounge & F&B, welcome dinner, gala & awards" },
    { name: "Marketing & Communications", v: { Conservative: 3503.25, "Base Case": 6757.05, Aggressive: 11095.44 }, w: 0.10, note: "Broadcast & livestream, content, PR-social, OOH" },
    { name: "Logistics", v: { Conservative: 1786.66, "Base Case": 3446.10, Aggressive: 5658.68 }, w: 0.051, note: "Accommodation, transport-fleet, cargo & customs" },
    { name: "Contingency", v: { Conservative: 1050.98, "Base Case": 2027.11, Aggressive: 3328.63 }, w: 0.03, note: "Bảo hiểm + HIO, FX & price-escalation buffer" }
  ];

  // Cơ cấu DOANH THU theo kịch bản (triệu)
  const revCats = [
    { name: "Title Partner", kind: "sponsor", v: { Conservative: 12250, "Base Case": 18375, Aggressive: 26950 } },
    { name: "Diamond Sponsor", kind: "sponsor", v: { Conservative: 8750, "Base Case": 13125, Aggressive: 19250 } },
    { name: "Platinum Sponsor", kind: "sponsor", v: { Conservative: 5250, "Base Case": 7875, Aggressive: 11550 } },
    { name: "Official Partner", kind: "sponsor", v: { Conservative: 3500, "Base Case": 5250, Aggressive: 7700 } },
    { name: "VIP Packages", kind: "commercial", v: { Conservative: 2800, "Base Case": 4200, Aggressive: 6160 } },
    { name: "Pro-Am Slots", kind: "commercial", v: { Conservative: 1400, "Base Case": 2100, Aggressive: 3080 } },
    { name: "Booth & Activation", kind: "commercial", v: { Conservative: 1050, "Base Case": 1575, Aggressive: 2310 } }
  ];

  // Reconciliation tham khảo (triệu VND)
  const reconciliation = {
    gross: 48570, partner: 14800, ghNet: 33770,
    note: "Gross 48,57 tỷ = GH net 33,77 tỷ + Đối tác/in-kind 14,8 tỷ. Phí Legends 18,85 tỷ (gồm 100k USD đã trả) cố định."
  };

  // BUDGET DETAIL — line items (Base, triệu) với tỷ trọng nội bộ
  const budgetDetail = [
    { cat: "Tour Rights & Legends Fee", total: 18850, lines: [["Bản quyền (đã trả 100k USD · 31/5/25)", 0.138, 2601.3, "Sunk cost"], ["Giải thưởng – phần GH (550k USD)", 0.759, 14307.15, "Prize fund"], ["Truyền thông quốc tế Legends (75k USD)", 0.103, 1941.55, ""]] },
    { cat: "Event Production", total: 10135.57, lines: [["Overlay & temporary structures", 0.34, 3446.10, ""], ["Technical (AV, LED, power)", 0.30, 3040.67, ""], ["Branding & signage", 0.16, 1621.69, ""], ["Gian hàng & entertainment", 0.20, 2027.11, ""]] },
    { cat: "Golf Operations", total: 5405.64, lines: [["Course setup & agronomy", 0.45, 2432.54, ""], ["Scoring & leaderboard", 0.25, 1351.41, ""], ["Caddies, carts & on-course", 0.30, 1621.69, ""]] },
    { cat: "Hospitality", total: 3378.52, lines: [["VIP lounge & F&B", 0.45, 1520.34, ""], ["Welcome dinner", 0.20, 675.70, ""], ["Gala & awards", 0.35, 1182.48, ""]] },
    { cat: "Marketing & Communications", total: 6757.05, lines: [["Broadcast & livestream", 0.30, 2027.11, ""], ["Content & creative", 0.20, 1351.41, ""], ["PR, media & social", 0.25, 1689.26, ""], ["OOH / media buying", 0.25, 1689.26, ""]] },
    { cat: "Logistics", total: 3446.10, lines: [["Accommodation (room block)", 0.40, 1378.44, ""], ["Transport & fleet", 0.35, 1206.13, ""], ["Cargo & customs", 0.25, 861.52, ""]] },
    { cat: "Contingency", total: 2027.11, lines: [["Bảo hiểm + HIO & dự phòng vận hành", 0.70, 1418.98, ""], ["FX & price escalation buffer", 0.30, 608.13, ""]] }
  ];

  // MANPOWER — 203 headcount, 2262 triệu
  const manpower = {
    total: 2262, headcount: 203, pctBudget: 0.04524,
    byBlock: [
      { block: "Admin", cost: 1026, hc: 11 },
      { block: "Marketing", cost: 456, hc: 11 },
      { block: "Production", cost: 300, hc: 159 },
      { block: "Golf", cost: 258, hc: 7 },
      { block: "Hospitality", cost: 162, hc: 10 },
      { block: "Logistics", cost: 60, hc: 4 }
    ],
    roles: [
      ["Festival Director", "Admin", 1, 3, 60, 180], ["Operations Director", "Admin", 1, 3, 45, 135],
      ["Commercial Director", "Admin", 1, 3, 45, 135], ["Sponsorship account mgrs", "Admin", 4, 3, 20, 240],
      ["Media, PR & Content", "Marketing", 5, 3, 16, 240], ["Broadcast liaison & crew", "Marketing", 6, 2, 18, 216],
      ["Tournament Ops team", "Golf", 3, 3, 22, 198], ["Event-week volunteers", "Production", 150, 1, 1.2, 180],
      ["Interpreters & liaison", "Hospitality", 6, 1, 15, 90], ["Volunteer mgr & leads", "Production", 6, 1, 12, 72],
      ["Hospitality & VIP team", "Hospitality", 4, 1, 18, 72], ["PMO / Coordinators", "Admin", 2, 3, 20, 120]
    ]
  };

  // VENDOR — 31200 triệu, deposit 11640
  const vendor = {
    total: 31200, deposit: 11640, pctBudget: 0.624,
    byBlock: [
      { block: "Production", cost: 10000 }, { block: "Marketing", cost: 6400 },
      { block: "Hospitality", cost: 5000 }, { block: "Logistics", cost: 4600 },
      { block: "Golf", cost: 4300 }, { block: "Contingency", cost: 900 }
    ],
    packages: [
      ["Broadcast & livestream", "Marketing", 3200, 0.4], ["Overlay & structures", "Production", 2600, 0.4],
      ["Hospitality build & F&B", "Hospitality", 2600, 0.3], ["AV, LED & technical", "Production", 2400, 0.4],
      ["Accommodation block", "Logistics", 2400, 0.3], ["OOH / media buying", "Marketing", 2000, 0.5],
      ["Welcome dinner & gala", "Hospitality", 1700, 0.3], ["Transport fleet", "Logistics", 1700, 0.3],
      ["Stage, gala & ceremony", "Production", 1500, 0.3], ["Course setup & agronomy", "Golf", 1500, 0.3],
      ["Caddies, carts & on-course", "Golf", 1500, 0.3], ["Scoring & leaderboard", "Golf", 1300, 0.5],
      ["Security services", "Production", 1200, 0.3], ["Content & photography", "Marketing", 1200, 0.3],
      ["Branding & signage", "Production", 1100, 0.3], ["Event & liability insurance", "Contingency", 900, 1.0],
      ["Medical & emergency", "Production", 700, 0.3], ["Merchandise", "Hospitality", 700, 0.4],
      ["Accreditation system", "Production", 500, 0.5], ["Cleaning & sustainability", "Logistics", 500, 0.3]
    ]
  };

  // SPONSORSHIP — pipeline
  const sponsorship = {
    tiers: [
      { tier: "Title Partner", range: "15–25 tỷ", slots: 1, v: { Conservative: 12250, "Base Case": 18375, Aggressive: 26950 }, commit: 0.70, pipeline: 55125 },
      { tier: "Diamond Sponsor", range: "10–15 tỷ", slots: 2, v: { Conservative: 8750, "Base Case": 13125, Aggressive: 19250 }, commit: 0.60, pipeline: 39375 },
      { tier: "Platinum Sponsor", range: "6–10 tỷ", slots: 3, v: { Conservative: 5250, "Base Case": 7875, Aggressive: 11550 }, commit: 0.50, pipeline: 23625 },
      { tier: "Official Partner", range: "3–6 tỷ", slots: 4, v: { Conservative: 3500, "Base Case": 5250, Aggressive: 7700 }, commit: 0.45, pipeline: 15750 }
    ],
    baseTotal: 44625, pipelineTotal: 133875, riskAdjusted: 27037.5
  };

  // COMMERCIAL
  const commercial = [
    { src: "VIP Packages", unit: 250, v: { Conservative: 2800, "Base Case": 4200, Aggressive: 6160 }, units: 17 },
    { src: "Pro-Am Slots", unit: 400, v: { Conservative: 1400, "Base Case": 2100, Aggressive: 3080 }, units: 5 },
    { src: "Booth & Activation", unit: 350, v: { Conservative: 1050, "Base Case": 1575, Aggressive: 2310 }, units: 5 }
  ];

  // CASHFLOW (Base) — 19 mốc tháng
  const cashMonths = ["05/25", "06/25", "07/25", "08/25", "09/25", "10/25", "11/25", "12/25", "01/26", "02/26", "03/26", "04/26", "05/26", "06/26", "07/26", "08/26", "09/26", "10/26", "11/26"];
  const cashLabels = ["≤T-15", "T-14", "T-13", "T-12", "T-11", "T-10", "T-9", "T-8", "T-7", "T-6", "T-5", "T-4", "T-3", "T-2", "T-1", "T0", "T+1", "T+2", "T+3"];
  const cashflow = {
    inflow: [0, 0, 0, 0, 0, 0, 2677.5, 3570, 3570, 4462.5, 4462.5, 4462.5, 5250, 5643.75, 6037.5, 7218.75, 5145, 0, 0],
    outflow: [2600, 0, 0, 0, 0, 337.85, 975, 675.70, 0, 675.70, 506.78, 2432.54, 4319.74, 5729.98, 22296.97, 9449.73, 0, 0, 0],
    net: [-2600, 0, 0, 0, 0, -337.85, 1702.5, 2894.30, 3570, 3786.80, 3955.72, 2029.96, 930.26, -86.23, -16259.47, -2230.98, 5145, 0, 0],
    cumulative: [-2600, -2600, -2600, -2600, -2600, -2937.85, -1235.35, 1658.94, 5228.94, 9015.74, 12971.46, 15001.42, 15931.68, 15845.45, -414.02, -2645, 2500, 2500, 2500],
    eventIdx: 15, peakIdx: 5, troughIdx: 14,
    note: "Opening = Tour Rights 100k USD đã trả. Cú chi lớn nhất tại T-1 (07/26): 22,3 tỷ — chủ yếu prize fund 14,3 tỷ. Đáy luỹ kế −2,65 tỷ tại T0 → cần vốn lưu động đệm."
  };

  // FUNDING & ROI
  const funding = {
    facility: 3231.64, safetyBuffer: 293.79, peakWC: 2937.85,
    sources: [
      { src: "Đối tác chiến lược / Host", amt: 20000, pct: 0.40 },
      { src: "Hỗ trợ ngân sách & xúc tiến", amt: 7500, pct: 0.15 },
      { src: "Hạn mức vốn lưu động (bank)", amt: 15000, pct: 0.30 },
      { src: "Nhà đầu tư / equity", amt: 7500, pct: 0.15 }
    ],
    mediaValue: 18000, year2Upside: 10500,
    roiNote: "Doanh thu ≥ chi phí nên nhu cầu vốn chủ yếu là vốn lưu động (timing), không phải tài trợ thâm hụt."
  };

  // RISK drivers
  const riskDrivers = [
    { r: "Giải thưởng (prize) lớn — đối tác chia sẻ", l: "T.Bình", i: "Cao", m: "HĐ chia sẻ prize, milestone trước sự kiện, FX buffer" },
    { r: "Sponsorship dưới mục tiêu", l: "T.Bình", i: "Cao", m: "Pipeline ≥ 3×, anchor Title sớm, gói linh hoạt" },
    { r: "Chi phí vận hành vượt", l: "T.Bình", i: "T.Bình", m: "Contingency, hợp đồng giá cố định, change-request control" },
    { r: "Dòng tiền lệch pha", l: "Cao", i: "Cao", m: "Facility vốn lưu động, deposit sponsor sớm, milestone vendor" },
    { r: "Permit/chính quyền chậm", l: "T.Thấp", i: "Cao", m: "Permit roadmap T-30, government lead" },
    { r: "Tỷ giá USD/VND (Legends fee)", l: "T.Bình", i: "Cao", m: "Rights đã trả; FX buffer cho prize/media còn lại" }
  ];

  // các bước sensitivity
  const revSteps = [0.8, 0.9, 1.0, 1.05, 1.1, 1.2];
  const costSteps = [0, 0.05, 0.10, 0.15, 0.20];

  // ---- CROSS-LINKS: nối tài chính ↔ team / khung giá trị / rủi ro ----
  // team = id team trong GOLF.teams · biz = id khung giá trị (Playbook) · risk = chỉ số riskMatrix (Mission Control)
  const links = {
    cost: {
      "Tour Rights & Legends Fee": { team: "T8", biz: "BIZ11", fa: "FA1", note: "Phí chủ quản & license — Legal/Gov Relations" },
      "Event Production": { team: "T2", biz: "BIZ7", fa: "FA8", note: "Overlay & hạ tầng — Venue & Overlay" },
      "Golf Operations": { team: "T1", biz: "BIZ1", fa: "FA3", note: "Course setup, scoring — Sport & Competition" },
      "Hospitality": { team: "T4", biz: "BIZ9", fa: "FA5", note: "VIP, gala — Commercial & Experience" },
      "Marketing & Communications": { team: "T3", biz: "BIZ4", fa: "FA7", note: "Broadcast & marketing — Media & Brand" },
      "Logistics": { team: "T5", biz: "BIZ7", fa: "FA9", note: "Accommodation & transport — Player/Logistics" },
      "Contingency": { team: "T7", biz: "BIZ10", fa: "FA10", note: "Bảo hiểm & dự phòng — Risk & Safety" }
    },
    // doanh thu & sponsorship → Commercial (T4, VS3, BIZ3)
    revenue: { team: "T4", biz: "BIZ3", fa: "FA5", note: "Doanh thu & mô hình thương mại — Commercial & Sponsorship" },
    // manpower blocks → org
    manpowerBlock: {
      Admin: { biz: "BIZ5" }, Marketing: { team: "T3", biz: "BIZ4" }, Production: { team: "T2", biz: "BIZ7" },
      Golf: { team: "T1", biz: "BIZ1" }, Hospitality: { team: "T4", biz: "BIZ9" }, Logistics: { team: "T5", biz: "BIZ7" }
    },
    // risk drivers → khung giá trị / team liên quan
    riskLink: ["BIZ3", "BIZ3", "BIZ7", "BIZ6", "BIZ11", "BIZ6"]
  };

  window.GOLF_FINANCE = {
    FX, scenarios, kpi, tourRightsPaid, legendsFee, costCats, revCats, reconciliation,
    budgetDetail, manpower, vendor, sponsorship, commercial,
    cashMonths, cashLabels, cashflow, funding, riskDrivers, revSteps, costSteps, links,
    meta: { title: "Vietnam Legends Festival 2026", partner: "The Golf House", date: "18–23/8/2026", unit: "triệu VND" }
  };
  if (window.GOLF) window.GOLF.finance2 = window.GOLF_FINANCE;
})();
