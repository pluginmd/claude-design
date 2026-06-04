/* ============================================================
   GOLF × SAFe — Mô hình dữ liệu trung tâm (SSOT)
   Trực quan hóa: Triển khai giải golf quốc tế tại Việt Nam
   Tổng hợp từ Playbook vận hành + Khung SAFe 10 tuần
   ============================================================ */
(function () {
  // ---- 4 LỚP SẢN PHẨM / VALUE STREAMS -----------------------
  const valueStreams = [
    {
      id: "VS1",
      name: "Sport Product",
      vi: "Sản phẩm thể thao",
      tag: "Lớp 1",
      hue: 150,
      budget: "~32%",
      customer: "Tour chủ quản · VĐV · Officials",
      desc: "Giải đạt chuẩn quốc tế, VĐV hài lòng, Tour hài lòng. Điều kiện cần để giữ license.",
      metrics: ["License retention (binary)", "Player NPS ≥ 70", "Scoring uptime ≥ 99.9%", "Course rating từ Tour ≥ \"good\""],
      epicOwner: "Epic E1·E2·E6"
    },
    {
      id: "VS2",
      name: "Broadcast Product",
      vi: "Sản phẩm truyền hình",
      tag: "Lớp 2",
      hue: 240,
      budget: "~25%",
      customer: "Rights holder · Host broadcaster · Ad buyers",
      desc: "World feed phát đi 30+ thị trường. Đây mới là 'sản phẩm' thực sự tạo media value cho sponsor.",
      metrics: ["World-feed uptime ≥ 99.9%", "Reach (triệu hộ) ≥ target", "Social impressions ≥ target", "Graphics error < 5 incidents"],
      epicOwner: "Epic E4 · (E11)"
    },
    {
      id: "VS3",
      name: "Commercial Product",
      vi: "Sản phẩm thương mại",
      tag: "Lớp 3",
      hue: 70,
      budget: "~18%",
      customer: "Title sponsor · Hospitality buyers · Fan",
      desc: "Hospitality, pro-am, fan village, kích hoạt thương hiệu — nơi tiền về và biên lợi nhuận cao nhất.",
      metrics: ["Doanh thu vs target", "Sponsor NPS ≥ 60", "Hospitality occupancy ≥ 85%", "Ticketing sell-through ≥ 80%"],
      epicOwner: "Epic E3·E7·E9"
    },
    {
      id: "VS4",
      name: "Strategic Asset",
      vi: "Tài sản chiến lược",
      tag: "Lớp 4",
      hue: 300,
      budget: "~10%",
      customer: "Chủ đầu tư · UBND · Ecosystem golf VN",
      desc: "Quan hệ Tour, năng lực tổ chức, vị thế điểm đến, tri thức tích lũy, cộng đồng golf trẻ.",
      metrics: ["Brand equity (survey trước/sau)", "Government goodwill (định tính)", "Junior pipeline (số tài năng)", "Media value (USD equivalent)"],
      epicOwner: "Epic E5·E10·E12"
    },
    {
      id: "OPS",
      name: "Operations chung",
      vi: "Vận hành nền",
      tag: "Nền",
      hue: 30,
      budget: "~15%",
      customer: "Toàn ART · nhà thầu · TNV",
      desc: "Safety, logistics, staffing, legal/tax, contingency — lớp nền phục vụ cả 4 Value Stream.",
      metrics: ["Incident count tuần giải", "Predictability ≥ 80%", "Budget variance", "Volunteer fill-rate"],
      epicOwner: "Epic E8 · (E11)"
    }
  ];

  // ---- 4 TẦNG QUẢN TRỊ SAFe ---------------------------------
  const layers = [
    {
      id: "L0",
      code: "PORTFOLIO",
      name: "Portfolio — Steering Committee (LPM)",
      vi: "Tầng chiến lược",
      cadence: "Họp 2 tuần/lần · T-4 tuần → 1 tuần/lần · Tuần giải hằng ngày 19:30",
      summary: "Lean Portfolio Management 5-7 người: định hướng, cấp ngân sách theo Value Stream, approve/kill Epic, ra quyết định strategic, bảo vệ ART khỏi nhiễu chính trị.",
      members: ["Chủ đầu tư (Chair)", "Đại diện UBND tỉnh", "Đại diện VGA", "Đại diện Tour (qua liên lạc)", "Tournament Director (trình bày)", "CFO", "Legal Head", "(+ Title Sponsor khi cần)"],
      blocks: [
        { t: "Strategic Themes (3-5, lock từ Sprint 0)", items: ["ST1 — Giữ license & xây quan hệ Tour bền vững (ưu tiên cao nhất)", "ST2 — Định vị Việt Nam là điểm đến golf cao cấp châu Á", "ST3 — Tạo legacy junior development trong nước", "ST4 — Breakeven hoặc lỗ kiểm soát ≤ 20% ngân sách", "ST5 — Xây playbook tái sử dụng cho 3 mùa kế tiếp"] },
        { t: "Portfolio Kanban — 6 cột + WIP limit", items: ["Funnel (∞) → Reviewing (5) → Analyzing (3) → Portfolio Backlog (5) → Implementing (8) → Done", "Vi phạm WIP → LPM phải kill hoặc defer"] },
        { t: "Lean Budget — guardrails", items: ["Chuyển dịch > 5% giữa VS → cần LPM approve; trong 5% → TD tự quyết", "Mọi chi tiêu > USD 50k → 2 chữ ký (TD + CFO)", "Contingency 10% chỉ unlock từng đợt 25% có lý do văn bản"] }
      ]
    },
    {
      id: "L1",
      code: "LARGE SOLUTION",
      name: "Large Solution — Solution Train",
      vi: "Tầng tích hợp nhà cung cấp ngoài",
      cadence: "Architecture Sync 2 tuần/lần → 1 tuần/lần → hằng ngày tuần giải",
      summary: "Cần vì ≥ 4 supplier kỹ thuật nằm ngoài ART nhưng quyết định 'solution': Tour, Host Broadcaster, Course Superintendent, Government.",
      members: ["STE = Deputy Tournament Director (làm việc out-bound: Tour, UBND, broadcaster)", "Solution Architect = bộ ba: Tour Technical Director · Course Superintendent · Broadcast Technical Director"],
      blocks: [
        { t: "Solution Intent — Fixed (không thương lượng)", items: ["Chuẩn Tour: slope, course rating, green speed 11-12 stimp, firmness 120-140 gravities", "Prize fund đã công bố", "Broadcast spec: 1080p HDR, ≥18 camera, RF, ball tracer", "Scoring system chuẩn Tour · Anti-doping protocol", "→ Mọi thay đổi cần Tour approve bằng văn bản"] },
        { t: "Solution Intent — Variable (thương lượng được)", items: ["Bố trí grandstand · fan village layout · hospitality design", "Marketing creative · junior program format · ceremony nội dung", "→ TD quyết"] },
        { t: "Pre/Post-PI Planning", items: ["Pre-PI Planning (1 ngày, T-11 tuần): align Solution Intent với Tour/broadcaster/venue/UBND TRƯỚC khi 8 team ngồi vào PI Planning", "Post-PI Planning (1 ngày, T-9 tuần): confirm với supplier về cam kết teams đã đưa ra"] }
      ]
    },
    {
      id: "L2",
      code: "ART",
      name: "Agile Release Train — \"Golf ART\"",
      vi: "Tầng chương trình",
      cadence: "Scrum of Scrums 2-3 lần/tuần → hằng ngày → 2 lần/ngày tuần giải",
      summary: "Core ART ~60-90 người chạy suốt 10 tuần. Một ART duy nhất đồng bộ nhịp 8 team về một đỉnh deadline cứng.",
      members: [
        "RTE — COO / Deputy TD: Chief Scrum Master, chủ trì PI Planning · SoS · System Demo · I&A; clear blocker; KHÔNG quyền strategic",
        "PM — Tournament Director: own Program Backlog (Feature), đặt PI Objectives, tiếng nói khách hàng",
        "System Architect — bộ ba Solution Architect",
        "Business Owners — Title Sponsor · Venue Owner · Tour · UBND (vote confidence, không quản hằng ngày)",
        "Product Owners — 8 Functional Directors",
        "Scrum Masters — 8 Project Coordinators (PMO), toàn thời gian",
        "System Team — 1 lead + 5 (test event, scoring IT, broadcast IT, agronomy QC, security drill)",
        "Shared Services — Legal · Finance · HR · Procurement"
      ],
      blocks: [
        { t: "Built-in Quality — 5 trụ", items: ["Shift-left testing: scoring test từ Sprint 4, không phải Sprint 8", "Continuous integration: hand-off vào SSOT, sign-off ≤ 48h", "Definition of Done strict: không 'gần done'", "Pair work & cross-training: mọi vị trí critical có backup", "Pre-mortem ×2 (Sprint 2 & Sprint 8)"] },
        { t: "Metric ART", items: ["Predictability ≥ 80% PI Objectives đạt", "Program Velocity (story point/Sprint)", "Defect/Incident count", "Flow metrics: velocity · efficiency · time · load"] }
      ]
    },
    {
      id: "L3",
      code: "TEAMS",
      name: "8 Agile Teams (two-pizza)",
      vi: "Tầng đội thực thi",
      cadence: "Daily standup 15' → tuần giải 6:00 + 18:30",
      summary: "Mỗi team 5-9 người, cross-functional, tự tổ chức. Mỗi team 1 PO + 1 SM, own một phần backlog và một slice của Value Stream.",
      members: ["Tổng core ART: 57 (8 team) + 6 System Team + RTE + PM + 3 Architect + 8 SM ≈ 76 người", "+ Shared Services + LPM ≈ 15 → ~90 người hằng ngày"],
      blocks: []
    }
  ];

  // ---- 12 EPIC ----------------------------------------------
  const epics = [
    { id: "E1", name: "Sanctioning & License", owner: "TD", vs: "VS1", note: "License ký = đồng hồ chạy. Chỉ ký khi có chủ trương UBND + MOU title sponsor + cấu trúc thuế xác nhận." },
    { id: "E2", name: "Venue Lock & Agronomy Program", owner: "Venue Director", vs: "VS1", note: "Dự án con nhiều tháng. Superintendent kinh nghiệm tournament + agronomist Tour kiểm tra trước. Có thể nâng cấp tưới/thoát nước cả năm trước." },
    { id: "E3", name: "Title Sponsor Acquisition", owner: "Commercial Director", vs: "VS3", note: "Then chốt khả thi. Không có title cam kết trước Pha 3 → không khởi động. Quản như sales pipeline SaaS." },
    { id: "E4", name: "Broadcast Deal & World Feed", owner: "Broadcast Director", vs: "VS2", note: "Chi cứng lớn thứ hai sau purse. ~16 camera, OB trucks, 40km cáp. International Series phân phối 30+ nhà đài." },
    { id: "E5", name: "Government Approval & Permit Stack", owner: "Legal Head", vs: "VS4", note: "Khối rủi ro-thời gian lớn nhất ở VN. 12 cụm permit. Critical path bị chi phối bởi cấp phép-visa-hải quan-thuế." },
    { id: "E6", name: "Player Field & Services", owner: "Competition Director", vs: "VS1", note: "Field VĐV, player services chuẩn tour, visa coordination, khách sạn-di chuyển-ăn uống." },
    { id: "E7", name: "Fan Experience & Ticketing", owner: "Marketing Director", vs: "VS3", note: "Ticketing 4 hạng, fan village, opening ceremony, countdown campaign 12 tháng." },
    { id: "E8", name: "Safety, Security & Medical", owner: "Safety Director", vs: "OPS", note: "An ninh phối hợp công an, weather protocol (golf cực nhạy với sét), y tế, evacuation 3 kịch bản." },
    { id: "E9", name: "Hospitality & Pro-Am Revenue", owner: "Commercial Director", vs: "VS3", note: "Chalet điều hòa tại hố 17-18, suite cao cấp, pro-am gala. Doanh thu cao + tài sản quan hệ." },
    { id: "E10", name: "Junior Development Program", owner: "TD", vs: "VS4", note: "Hoạt động đòn bẩy nhất ở thị trường mới. Vòng loại 3-6 thành phố → chung kết → clinic với pro. Ngân sách 100-300k USD." },
    { id: "E11", name: "Tournament Tech Stack", owner: "CTO / Tech Lead", vs: "OPS", note: "Scoring real-time, app khán giả, vé điện tử, CRM/partner portal, accreditation, an ninh mạng (luật dữ liệu cá nhân VN)." },
    { id: "E12", name: "Legacy & Knowledge Capture", owner: "PMO Head", vs: "VS4", note: "Decision log, lessons-learned, bộ template tái sử dụng. Năm đầu 'mua' tri thức bằng tiền và sai lầm." }
  ];

  // ---- 8 TEAMS ----------------------------------------------
  const teams = [
    { id: "T1", name: "Sport & Competition", po: "Competition Director", size: 8, vs: "VS1",
      backlog: ["Rules of competition · tee time · pairing", "Scoring system test", "Rules officials (8-12) · starter", "Walking scorer (54 = 18 hố × 3 nhóm × ca)", "Pace of play · anti-doping", "Agronomy daily cut · course setup (pin, tee)", "Practice round logistics"] },
    { id: "T2", name: "Venue & Overlay", po: "Venue Director", size: 9, vs: "VS1",
      backlog: ["Course superintendent coordination", "Grandstand (3-5, sức chứa 500-2000)", "Media center (200m²) · tournament office", "Hospitality tent (3-5) · volunteer HQ", "F&B booth (15-30) · signage (250-500)", "MEP (điện 1-2MW, nước, mạng) · Wi-Fi 5000 user", "Porta-toilet (80-120) · traffic flow"] },
    { id: "T3", name: "Broadcast & Media", po: "Broadcast Director", size: 7, vs: "VS2",
      backlog: ["Host broadcaster contract", "World feed (18 cam + 4 RF + 2 ball tracer + drone)", "OB truck (HD1, HD2 backup) · commentary booth", "Graphics · replay · satellite uplink", "Host country feed (VTV/FPT) · digital rights", "Photographer pool · written media (~150-250)", "Mixed zone · press conference room"] },
    { id: "T4", name: "Commercial & Sponsorship", po: "Commercial Director", size: 7, vs: "VS3",
      backlog: ["Title sponsor negotiation & activation", "Presenting sponsor (2) · official partners (5-8)", "Supplier deals (apparel, beverage, car, watch, airline, hotel)", "Hospitality sales (50-200 slots)", "Pro-am sales (20-30 teams × $5-15k)", "Sponsor servicing & activation", "Signage rights · fulfillment report"] },
    { id: "T5", name: "Player & Officials Services", po: "Player Services Manager", size: 6, vs: "VS1",
      backlog: ["Visa coordination 144 VĐV + 50 officials + caddy", "Charter/commercial flight · hotel block (200-300 phòng)", "Airport transfer (50-80 lượt) · shuttle (mỗi 20')", "Locker room · player lounge (F&B chuẩn)", "Range & practice green · family lounge", "Courtesy car (10-15) · gift bag", "Departure service"] },
    { id: "T6", name: "Fan Experience & Ticketing", po: "Marketing Director", size: 8, vs: "VS3",
      backlog: ["Ticketing platform (4 hạng vé)", "Promo & campaign 12 tháng", "Junior development program (4 sub-project)", "KOL/influencer (15-25) · social (5 kênh)", "PR (press release ×20+)", "Fan village (expo, autograph, kids, F&B)", "Opening/closing ceremony · charity · trophy tour"] },
    { id: "T7", name: "Safety, Security & Medical", po: "Safety Director", size: 6, vs: "OPS",
      backlog: ["An ninh (200-400, phối hợp công an)", "Accreditation system (5000+ thẻ)", "Perimeter & access · bag check", "Weather monitoring (lightning detector 12km)", "Evacuation plan (3 kịch bản)", "Medical (1 chính + 4 phụ, 8-12 bác sĩ, 2 xe cứu thương)", "AED 6-10 · fire/food safety · drill"] },
    { id: "T8", name: "Legal, Finance & Gov Relations", po: "CFO / Legal Head", size: 6, vs: "VS4",
      backlog: ["Hồ sơ đăng cai (đơn, điều lệ, chương trình)", "12 cụm permit · foreign-exchange (prize fund)", "Tax registration (FCT, PIT)", "Insurance (public liability ≥ $10M, cancellation, weather parametric)", "Banking & FX hedge · payroll (TNV per diem)", "Procurement & contract (40-60 hợp đồng)", "UBND liaison (3-5 sở) · VGA liaison"] }
  ];

  // ---- 12 SPRINT (PI MAP 10 TUẦN) ---------------------------
  const sprints = [
    { id: "S0", label: "Sprint 0", phase: "Chuẩn bị", tminus: "T-12 → T-10", title: "Foundation prep", kind: "prep",
      goal: "ART đã lên người (80% filled, RTE+8 PO chắc 100%), SSOT setup, charter mỗi team, Solution Intent v0.1, Portfolio Kanban 12 Epic, Pre-PI Planning đã chạy.",
      deliver: ["ART roster 80% filled", "SSOT live (Jira/Notion + Program Board template)", "Team Charter ×8 (mission, scope, DoD draft)", "12 Epic có Lean Business Case 1 trang", "Strategic Theme + Lean Budget v1 LPM approve", "Training cấp tốc 4h SAFe overview"] },
    { id: "PI", label: "PI Planning", phase: "Khởi động", tminus: "T-10 (Th5+Th6)", title: "PI Planning — 2 ngày", kind: "milestone",
      goal: "Buổi quan trọng nhất toàn dự án. 8 team tự xác định PI Objectives, break Feature→Story, identify dependency + risk (ROAM), dựng Program Board, Confidence Vote ≥ 3 thì go.",
      deliver: ["Ngày 1: Business Context · Vision · Architecture · Team Breakouts · Draft Review", "Đêm: Management Review & Problem Solving", "Ngày 2: Adjustments · Breakouts 2 · Final Review · Risk ROAM · Confidence Vote", "Output: PI Objectives ×8 + BV score · Program Board · Risk ROAM Board"] },
    { id: "S1", label: "Sprint 1", phase: "Lập kế hoạch", tminus: "T-10 → T-9", title: "Foundation Lock", kind: "run",
      goal: "Tất cả Epic P0 có owner, LOI/contract draft, hồ sơ permit chuẩn bị xong nội dung.",
      deliver: ["Title Sponsor LOI ký (E3)", "Broadcaster term sheet (E4)", "Hồ sơ đăng cai nộp VGA (E1, E5)", "Venue contract finalized (E2)", "12 cụm permit có draft", "Ticketing platform spec'd · sponsor deck v1"],
      demo: "Program Board cho LPM · SSOT · sponsor deck pitch thử" },
    { id: "S2", label: "Sprint 2", phase: "Lập kế hoạch", tminus: "T-9 → T-8", title: "Contract Wave 1", kind: "run",
      goal: "Title Sponsor chính thức ký, broadcaster ký, 50% permit submitted, 5 nhà thầu chính chọn xong.",
      deliver: ["Title Sponsor contract SIGNED (mọi việc khác phụ thuộc)", "Broadcaster MSA signed", "Nhà thầu overlay + security chọn", "Agronomy schedule khoá", "Hospitality sale khởi động (30%)", "Junior qualifier mở đăng ký · teaser launch"],
      demo: "Contract pack · hospitality landing page · junior qualifier microsite" },
    { id: "S3", label: "Sprint 3", phase: "Lập kế hoạch", tminus: "T-8 → T-7", title: "Build Authorization", kind: "run",
      goal: "100% permit submitted, build authorization từ UBND, visa application mở batch 1.",
      deliver: ["12/12 permit đã nộp", "UBND ra văn bản cho phép organizing", "Build permit overlay · carnet ATA (broadcast gear)", "Visa batch 1 (officials, advance team)", "Vé early-bird mở · pro-am 50%", "Sponsor activation plan v1"],
      demo: "Dry-run ticketing checkout · junior qualifier vòng 1 (3-5 sân) · advance team site visit" },
    { id: "S4", label: "Sprint 4", phase: "Chuẩn bị thực thi", tminus: "T-7 → T-6", title: "Marketing Launch + Mid-PI Checkpoint", kind: "checkpoint",
      goal: "Marketing campaign launch chính thức, 70% sponsor ký, hồi đáp permit batch 1. Mid-PI: LPM re-plan nếu confidence < 3.",
      deliver: ["Press conference 1 (announce field 50%)", "Social campaign launch chính thức", "5/8 official partner ký · visa batch 1 approved", "Permit batch 1 approved (sports event, foreign worker)", "KOL contract · trophy tour kick-off", "Agronomy intensive (90 ngày trước giải)"],
      demo: "Press conference rehearsal · agronomy report (green speed) · broadcast graphics draft" },
    { id: "S5", label: "Sprint 5", phase: "Chuẩn bị thực thi", tminus: "T-6 → T-5", title: "Overlay Groundbreaking", kind: "run",
      goal: "Overlay khởi công, tất cả nhà thầu onboard, vé chính thức mở toàn bộ.",
      deliver: ["Overlay site mobilization (rào, kho, lán)", "Grandstand foundation · MEP rough-in plan duyệt", "Vé all-tier mở bán", "Sponsor activation creative finalize", "Player invitation 100% sent", "Accommodation block locked · volunteer recruit (800-1500)"],
      demo: "Site walk-through video · sponsor activation mock-up · volunteer onboarding portal" },
    { id: "S6", label: "Sprint 6", phase: "Chuẩn bị thực thi", tminus: "T-5 → T-4", title: "Overlay Mid-build + Test Event Prep", kind: "run",
      goal: "Overlay 50% xong, test event scheduled, visa batch 2 (VĐV) nộp.",
      deliver: ["Grandstand 50% · hospitality tent erected · MEP 60%", "Fan village layout staked", "Test event date locked (cuối Sprint 7)", "Visa batch 2 (140-160 VĐV) nộp", "Ticketing 50% target · pro-am full booked", "Junior chung kết schedule"],
      demo: "Test event run sheet · world feed scoring integration test · Walk-the-course #1" },
    { id: "S7", label: "Sprint 7", phase: "Dàn dựng", tminus: "T-4 → T-3", title: "Test Event & Integration", kind: "run",
      goal: "Chạy test event (9 hố/soft event), tích hợp scoring-broadcast-signage, broadcast rehearsal lần 1.",
      deliver: ["Test event 1-2 ngày, 30-50 golfer mời (ghép pro-am)", "Scoring tested end-to-end", "Broadcast graphics tested with live data", "Visa batch 2 đa phần approved · carnet approved", "Volunteer training batch 1 · accreditation badge in xong", "Sponsor signage installed 70%"],
      demo: "Test event after-action review · broadcast rehearsal recording · Walk-the-course #2" },
    { id: "S8", label: "Sprint 8", phase: "Dàn dựng", tminus: "T-3 → T-2", title: "Final Build & Rehearsal", kind: "run",
      goal: "Overlay 100%, broadcast rehearsal lần 2, volunteer training xong, player arrival logistics tested.",
      deliver: ["Overlay 100% (grandstand, tent, signage, MEP commissioned)", "Broadcast rehearsal full (commentary + graphics + replay)", "Volunteer training batch 2 + vị trí lock", "Player transport dry run · ticketing 80%", "Tất cả hợp đồng thanh toán 70%", "Daily ops manual in · emergency drill (evac, medical, fire)"],
      demo: "Full dress rehearsal Day 0 sim · Walk-the-course #3 (final) · Go/No-Go preliminary" },
    { id: "S9", label: "Sprint 9", phase: "Dàn dựng", tminus: "T-2 → T-1", title: "Hardening & Readiness", kind: "harden",
      goal: "HARDENING SPRINT — KHÔNG nhận scope mới. Chỉ rehearsal, fix bug, polish. 100% readiness, all green Go/No-Go.",
      deliver: ["Daily rehearsal đầy đủ · opening ceremony rehearsal", "Player arrival (Mon-Tue) · practice round (Tue-Wed)", "Pro-am (Wed) · media day", "Readiness review checklist (xanh hoàn toàn)", "Contingency activation plans tested"],
      demo: "Go/No-Go formal Th5. 5 hạng mục bắt buộc xanh: agronomy · scoring/broadcast · safety/medical · player check-in · sponsor activation" },
    { id: "S10", label: "Sprint 10", phase: "Tuần giải", tminus: "Tournament Week", title: "Live Operations", kind: "live",
      goal: "Chạy giải, deliver Increment hằng ngày. Mỗi ngày = 1 mini-Sprint: briefing → execution → debrief → hot-wash.",
      deliver: ["6:00 Daily stand-up (ops huddle 30')", "6:30 Pre-round briefing · 6:30-18:00 on-course ops", "18:30 Post-round debrief (RTE)", "19:30 Evening hot-wash (LPM + TD + PO) → quyết định ngày sau", "Operations Center · radio là xương sống"] },
    { id: "S11", label: "Sprint 11+", phase: "Đóng dự án", tminus: "T+1 → T+8 tuần", title: "Inspect & Adapt", kind: "close",
      goal: "8 tuần đóng dự án. Output không phải để chạy PI mới mà để bán playbook và chuẩn bị mùa 2.",
      deliver: ["T+1: teardown · financial close prelim · sponsor thank-you", "T+2: settlement (giữ retention 5-10%)", "T+3: media value report cho sponsor", "T+4: I&A workshop (System Demo + Quantitative + 5-Why)", "T+5-6: lessons-learned · T+7-8: playbook v2 · archive SSOT"] }
  ];

  // ---- CEREMONY CADENCE -------------------------------------
  const ceremonies = [
    { name: "LPM Review", c: ["2 tuần/lần", "1 tuần/lần", "2 lần/tuần", "Hằng ngày 19:30", "1 tuần/lần"] },
    { name: "Scrum of Scrums", c: ["2 lần/tuần", "3 lần/tuần", "Hằng ngày", "2 lần/ngày", "1 lần/tuần"] },
    { name: "Team Daily Stand-up", c: ["Hằng ngày 15'", "Hằng ngày", "Hằng ngày", "6:00 + 18:30", "Tuỳ"] },
    { name: "Sprint Planning", c: ["Th2 60'", "Th2 60'", "Th2 90'", "Mini hằng ngày", "—"] },
    { name: "System Demo", c: ["Th6 2h", "Th6 3h", "Th6 4h", "—", "—"] },
    { name: "Sprint Review", c: ["Th6 60'", "Th6 90'", "Th6 90'", "—", "—"] },
    { name: "Sprint Retrospective", c: ["Th6 45'", "Th6 45'", "Th6 60'", "Hot-wash", "I&A workshop"] },
    { name: "Architecture Sync", c: ["2 tuần/lần", "1 tuần/lần", "2 lần/tuần", "Hằng ngày", "—"] },
    { name: "Pre/Post-PI Planning", c: ["T-11, T-9", "—", "—", "—", "—"] }
  ];
  const ceremonyPhases = ["T-10→-5", "T-5→-2", "T-2→0", "Tournament", "Đóng dự án"];

  // ---- DEPENDENCY (INTERFACE MATRIX 8×8) --------------------
  const deps = [
    { from: "T1", to: "T2", label: "Tee box & green setup, hole location, range layout", lock: "T-6" },
    { from: "T1", to: "T3", label: "Scoring data feed spec · tee time & pairing", lock: "T-8 / T-1" },
    { from: "T2", to: "T3", label: "Camera tower position, cable pathway, OB truck, power & fiber", lock: "T-6" },
    { from: "T2", to: "T4", label: "Sponsor signage map, hospitality tent layout, branding zone", lock: "T-5" },
    { from: "T2", to: "T7", label: "Evacuation route, gate count, lane width, fire access", lock: "T-6" },
    { from: "T3", to: "T6", label: "Broadcast restriction zone (no fan), commentary booth view", lock: "T-4" },
    { from: "T4", to: "T6", label: "Sponsor activation booth in fan village, brand experience", lock: "T-5" },
    { from: "T5", to: "T2", label: "Locker room, player lounge, range, courtesy car parking", lock: "T-6" },
    { from: "T5", to: "T8", label: "Visa list & timing", lock: "rolling" },
    { from: "T6", to: "T7", label: "Vé bán → gate capacity/giờ, crowd flow simulation", lock: "T-3" },
    { from: "T7", to: "T6", label: "Accreditation rule, search protocol → fan messaging", lock: "T-2" },
    { from: "T8", to: "T1", label: "Permit approval → unlock activity", lock: "rolling" },
    { from: "T8", to: "T2", label: "Build permit → construction start", lock: "rolling" },
    { from: "T8", to: "T3", label: "Carnet ATA → broadcast gear import", lock: "rolling" }
  ];

  // 3 cross-team kink lớn nhất
  const kinks = [
    { t: "Overlay ↔ MEP ↔ Broadcast", d: "Overlay rough → MEP rough-in → broadcast cable → overlay finish → broadcast install → MEP commissioning. Trễ 1 ngày ở MEP = trễ cả chuỗi 5-7 ngày.", teams: ["T2", "T3"] },
    { t: "Visa ↔ Player Services ↔ Field Confirmation", d: "Visa batch 2 chậm 7 ngày → VĐV không xác nhận → broadcast không công bố field → sponsor không activate campaign tuần cuối.", teams: ["T5", "T8", "T3"] },
    { t: "Permit ↔ Construction ↔ Insurance", d: "Không fire safety permit → không occupancy → không insurance valid → không vận hành. Mọi permit phải done trước T-2 tuần.", teams: ["T8", "T2", "T7"] }
  ];

  // ---- PLAYBOOK: 11 FUNCTIONAL AREA + chuyên sâu ------------
  const functionalAreas = [
    { id: "FA1", name: "Rights, Legal & Governance", team: "T8", d: "Hợp đồng license & nghĩa vụ, pháp nhân vận hành, hợp đồng chủ sân, bảo hiểm, SHTT & brand guideline." },
    { id: "FA2", name: "Government Relations & Permits", team: "T8", d: "Khối rủi ro-thời gian lớn nhất ở VN. 12 cụm permit." },
    { id: "FA3", name: "Competition & Sport — 'linh hồn'", team: "T1", d: "Agronomy, course setup hằng ngày, rules officials (Tour cử), scoring & pairings, starter/marshal, caddie, games committee." },
    { id: "FA4", name: "Player & Officials Services", team: "T5", d: "Đăng ký field, player services desk, sân tập, khách sạn-di chuyển-ăn chuẩn tour, locker, dịch vụ đoàn tùy tùng." },
    { id: "FA5", name: "Commercial & Partnerships", team: "T4", d: "Tháp tài trợ, hospitality, pro-am, sponsor activation, merchandising, sales pipeline & partner portal." },
    { id: "FA6", name: "Ticketing & Spectator Experience", team: "T6", d: "Giá vé, bán-soát vé điện tử, sơ đồ khán giả, tiện ích, tiếp cận người khuyết tật." },
    { id: "FA7", name: "Broadcast, Media & Marketing", team: "T3", d: "Host feed, phân phối tín hiệu, livestream, media center, chiến dịch marketing, social." },
    { id: "FA8", name: "Venue & Infrastructure (Overlay)", team: "T2", d: "Khán đài, lều VIP, media center, hàng rào, branding, điện-nước-wifi, fan village, build-up & teardown." },
    { id: "FA9", name: "Logistics & Operations", team: "T2", d: "Vận chuyển, bãi đỗ, kho vận, accreditation, F&B, vệ sinh, Operations Center tuần giải." },
    { id: "FA10", name: "Safety, Security, Medical & Risk", team: "T7", d: "An ninh, y tế, PCCC, weather protocol, ứng phó khủng hoảng, bảo hiểm." },
    { id: "FA11", name: "Volunteers & Workforce (xuyên suốt)", team: "T6", d: "Tuyển, huấn luyện, phân ca, đồng phục, điều phối 800-1500 TNV." },
    { id: "FA12", name: "★ Agronomy — dự án con nhiều tháng", team: "T1", d: "Double-cut mỗi sáng, stimpmeter + firmness (120-140 gravities), rough height, bunker. Cỏ nhiệt đới VN ứng xử khác cỏ ôn đới." },
    { id: "FA13", name: "★ Broadcast — chi cứng #2 sau purse", team: "T3", d: "~16 camera, 9 OB trucks, 40km cáp. International Series phân phối 30+ nhà đài (Star Sports, SonyLIV, Astro, NBC, FPT...)." },
    { id: "FA14", name: "★ Accreditation — xương sống ra vào", team: "T7", d: "Thẻ phân vùng: VĐV, caddie, media, VIP, BTC, nhà thầu, an ninh. Khởi động sớm vì gắn với visa." },
    { id: "FA15", name: "★ Weather Protocol — bắt buộc", team: "T7", d: "Golf cực nhạy với sét. Kế hoạch an toàn sét, đội khí tượng on-site, quy trình 30/30, shelter, chuỗi ra quyết định rõ." }
  ];

  // ---- 5 PHA VÒNG ĐỜI ---------------------------------------
  const phases = [
    { id: "P1", name: "Khởi tạo", tminus: "T-24 → T-15 tháng", items: ["Đàm phán + ký sanctioning (thường 3 năm)", "Chốt sân & ngày · lập pháp nhân", "Thiết kế cấu trúc thuế & pháp lý", "Xin chủ trương UBND + tiếp xúc VGA", "Business case + ngân sách khung", "Khởi động agronomy + partner portal"] },
    { id: "P2", name: "Lập kế hoạch", tminus: "T-15 → T-9", items: ["Nộp hồ sơ đăng cai qua VGA", "CHỐT title sponsor (then chốt khả thi)", "Ký hợp đồng broadcast", "Bổ nhiệm TD + tuyển ban điều hành", "WBS chi tiết · Announcement event (T-12)", "Mở tuyển chọn nhí · Công bố title (T-9)"] },
    { id: "P3", name: "Chuẩn bị thực thi", tminus: "T-9 → T-2", items: ["Mở bán vé + hospitality · teasing campaign", "Hoàn tất giấy phép + visa + work permit", "Ký toàn bộ nhà thầu · tuyển + huấn luyện TNV", "Hệ thống công nghệ (scoring, ticketing, app)", "Công bố sân (T-6) · field (T-3) · media tour (T-3)", "Trophy tour (T-4→T-1) · Tourism Summit (T-1 tuần)"] },
    { id: "P4", name: "Dàn dựng & thi đấu", tminus: "T-2 tháng → tuần giải", items: ["Build-up overlay + fan village + hospitality", "Agronomy intensive (cao điểm tháng cuối)", "Test event / soft launch · pre-mortem", "Tổng duyệt vận hành · readiness review", "Welcome reception + Opening Ceremony", "Pro-am gala · Operations Center · charity moment"] },
    { id: "P5", name: "Đóng dự án", tminus: "T+1 → T+12 tháng", items: ["Teardown + retention release", "Settlement tài chính (thuế, chuyển prize fund)", "Highlight package (T+1→T+6 tuần)", "Sponsor wrap-up report (T+4 tuần)", "Báo cáo chủ quản + sponsor + chính quyền", "Debrief · legacy program · marketing năm 2 (T+8)"] }
  ];

  // ---- HỆ SINH THÁI BÊN LỀ ----------------------------------
  const ecosystem = [
    { cluster: "Pre-event (T-12 → T-1 tháng)", items: ["Teasing & countdown: T-12 announce → T-9 title → T-6 sân → T-3 field → T-1 daily", "Tuyển chọn tuyển thủ nhí / golf phong trào (đòn bẩy nhất ở VN)", "Pro-am qualifier & amateur events", "Vietnam Golf Tourism Summit / Industry Forum", "Media tour & site visit · KOL & influencer program", "Partner Portal (7 form) → CRM có SLA (sponsor 24h, khác 72h)", "Sales pipeline: prospect → qualified → proposal → negotiation → contract → closed-won", "Trophy tour & PR runway (4-6 tuần)"] },
    { cluster: "Trong tuần giải mở rộng", items: ["Fan Village / Golf Expo (gian hàng sponsor, thiết bị, du lịch tỉnh, check-in)", "Opening Ceremony / Welcome Reception (ngoại giao bắt buộc)", "Pro-am day chuyên nghiệp (gala, draw party, gift bags)", "Hospitality activation (Banking Day, Auto Day theo tier)", "Junior clinic & meet-the-pro (CSR + nội dung world feed)", "Cultural & destination program (soft power VN)", "Charity component bắt buộc · Community day / open practice"] },
    { cluster: "Post-event (T+1 → T+12 tháng)", items: ["Highlight package & content distribution (4-6 tuần)", "Sponsor wrap-up report → quyết định gia hạn", "Community legacy program · học bổng junior", "Anniversary content & countdown to next edition"] }
  ];

  // ---- 12 PATTERN THỰC THI ----------------------------------
  const patterns = [
    { n: 1, t: "Plan 100 trang chết, plan 1 trang sống", d: "Mỗi cấp cần 1 tầng tóm tắt 1 trang. Plan chi tiết là kho tham chiếu; plan 1 trang là công cụ làm việc." },
    { n: 2, t: "Critical path là 'đường tử thần'", d: "Chỉ 15-25/500+ task trên CP. TD dành 70% thời gian cho chúng. Lập 'Critical Path Watch' hằng tuần." },
    { n: 3, t: "Trễ 1 ngày sớm = trễ 1 tuần muộn", d: "Kỷ luật tiến độ cứng nhất ở Pha 1-2. Milestone trễ > 5 ngày → escalate Steering." },
    { n: 4, t: "Buffer 30-30-30", d: "30% thời gian cho task pháp lý-cấp phép; 30% ngân sách dự phòng overlay; 30 ngày buffer deadline nội bộ vs deadline thật." },
    { n: 5, t: "Mọi cam kết phải có chữ ký, ngày, người", d: "'Anh A đồng ý rồi' không phải cam kết. Duy trì Commitment Log review hằng tuần." },
    { n: 6, t: "Định nghĩa Done trước khi bắt đầu", d: "Mỗi deliverable có Definition of Done viết ra trước. Không có DoD, 'done' là cuộc cãi nhau ngày cuối." },
    { n: 7, t: "Cadence giao ban tăng theo gần ngày", d: "Weekly → 2-3/tuần → daily standup → morning + evening huddle. Blocker là tin tức duy nhất quan trọng." },
    { n: 8, t: "Walk the course — test thực địa", d: "TD + FA Lead đi bộ 18 hố ≥ 3 lần trong 60 ngày cuối. Đi cùng Tour, an ninh, broadcast." },
    { n: 9, t: "Pre-mortem — tưởng tượng thất bại trước", d: "'Giả sử giải thất bại, viết 20 lý do.' Hiệu quả hơn risk register thông thường (Kahneman)." },
    { n: 10, t: "Decision log + No-revisit rule", d: "Quyết định đã chốt không mở lại trừ khi có thông tin mới quan trọng." },
    { n: 11, t: "Single Source of Truth (SSOT)", d: "Mỗi loại thông tin có 1 nguồn chuẩn. Mọi file khác là copy. Notion/Monday/Airtable + SharePoint phân quyền." },
    { n: 12, t: "Người gánh trách nhiệm là 1, không phải N", d: "'Cả team A phụ trách' = không ai phụ trách. Accountability không chia. Sự cố > 30s không tìm ra owner → RACI hỏng." }
  ];

  // ---- ANTI-PATTERN -----------------------------------------
  const antiPatterns = [
    { t: "'Cứ ký license đã, các thứ tính sau'", d: "License ký = đồng hồ chạy. Quy tắc: không ký đến khi có (a) chủ trương UBND văn bản, (b) MOU title sponsor, (c) cấu trúc thuế-pháp nhân xác nhận khả thi." },
    { t: "'Năm đầu phải có lãi để chứng minh'", d: "Cắt sai chỗ (broadcast, agronomy, an toàn) + đẩy giá bất hợp lý. Quy tắc: năm 1 hòa vốn/lỗ kiểm soát 15-25%, năm 2 hòa vốn, năm 3 có lãi." },
    { t: "'Tự làm cho chắc'", d: "Ôm quá nhiều việc → thiếu chuyên môn + quá tải điều phối. Giữ trong nhà việc tạo lợi thế (Tour, chính quyền, title, điều phối) — outsource phần còn lại." },
    { t: "SAFe: PI Planning thành PowerPoint show", d: "Ceremony làm đủ form nhưng không thực chất. System Demo bằng slide thay vì demo thật. SoS thành status report." },
    { t: "VN: Quan hệ cá nhân vượt quy trình", d: "Commitment Log bị bypass nếu sếp gọi điện. 'Trên bảo dưới nghe' không hợp self-organize. RTE phải đủ uy bảo vệ quy trình." }
  ];

  // ---- TÀI CHÍNH (giải International Series, purse 2tr USD) --
  const finance = {
    note: "Khung tổng quát theo range tài liệu — giải tầm International Series, purse 2 triệu USD.",
    cost: [
      ["Prize fund", "2,000,000", "~25%"], ["Sanctioning/rights fee", "500k-1.2M", "8-13%"],
      ["Broadcast/host feed", "1.5-3M", "20-30%"], ["Venue prep & agronomy", "300-700k", "5-8%"],
      ["Infrastructure tạm (+ Fan Village)", "600k-1.2M", "8-12%"], ["Player services & logistics", "400-800k", "6-9%"],
      ["Marketing, PR & branding", "300-600k", "4-7%"], ["Nhân sự & TNV", "250-500k", "4-6%"],
      ["An ninh, y tế, bảo hiểm", "200-450k", "3-5%"], ["Pháp lý, thuế, hành chính", "150-350k", "2-4%"],
      ["Junior program & CSR", "100-300k", "1-3%"], ["Ceremony, gala, side events", "150-400k", "2-4%"],
      ["Dự phòng", "8-12% tổng", "~10%"]
    ],
    costTotal: ["TỔNG CHI", "7.5-12M", "100%"],
    revenue: [
      ["Title sponsor", "2.5-5M"], ["Presenting sponsor", "800k-1.5M"], ["Official partners (3-5)", "300-700k/đv"],
      ["Official suppliers (VIK)", "hiện vật"], ["Corporate hospitality", "400-900k"], ["Pro-am", "150-400k"],
      ["Vé khán giả", "100-400k"], ["F&B + merchandise", "50-200k"], ["Fan Village booth fees", "50-200k"],
      ["Tourism Summit tài trợ", "50-150k"]
    ],
    revenueTotal: ["TỔNG THU", "7.5-12M"],
    tiers: [
      { name: "Title", price: "2.5-5M", perks: ["Tên trong tên giải", "Logo world feed nổi bật", "Branding sân tối đa", "Hospitality lớn nhất", "Pro-am nhiều suất", "Độc quyền ngành"] },
      { name: "Presenting", price: "0.8-1.5M", perks: ["'Presented by'", "Logo world feed có", "Branding cao", "Hospitality lớn", "Độc quyền ngành"] },
      { name: "Official Partner (3-5)", price: "0.3-0.7M", perks: ["Logo world feed hạn chế", "Branding trung bình", "1 suất pro-am", "Độc quyền ngành"] },
      { name: "Official Supplier (VIK)", price: "hiện vật", perks: ["Logo nhỏ", "Vé", "Độc quyền theo ngành"] }
    ],
    rule: "Title + presenting cần phủ 50-60% tổng chi phí. Không có title sponsor cam kết trước → không khởi động.",
    // Dòng tiền theo tuần (T-12 → T+8) — % luỹ kế thu vs chi
    cashflow: [
      { w: "T-12", out: 8, in: 6 }, { w: "T-10", out: 16, in: 18 }, { w: "T-9", out: 22, in: 34 },
      { w: "T-8", out: 30, in: 46 }, { w: "T-6", out: 44, in: 55 }, { w: "T-5", out: 52, in: 60 },
      { w: "T-4", out: 64, in: 68 }, { w: "T-3", out: 76, in: 76 }, { w: "T-2", out: 88, in: 84 },
      { w: "T-1", out: 96, in: 90 }, { w: "Tuần giải", out: 100, in: 96 }, { w: "T+4", out: 100, in: 102 }, { w: "T+8", out: 100, in: 105 }
    ],
    cashNote: "Chi trước – thu sau: vùng âm (T-2 → T+2) là lúc dòng tiền căng nhất — cần contingency & cầu vốn ngắn hạn.",
    // Hoà vốn 3 mùa
    breakeven: [
      { season: "Mùa 1", rev: 88, cost: 105, note: "Lỗ kiểm soát ~17% — 'mua' tri thức & quan hệ" },
      { season: "Mùa 2", rev: 100, cost: 100, note: "Hoà vốn — playbook tái dùng, sponsor gia hạn" },
      { season: "Mùa 3", rev: 118, cost: 102, note: "Có lãi — brand equity & media value tích luỹ" }
    ]
  };

  // ---- RUN-OF-SHOW một ngày thi đấu (tuần giải) -------------
  const runOfShow = [
    { t: "05:30", a: "Agronomy: double-cut, đo green speed & firmness, set pin/tee", who: "T1", k: "ops" },
    { t: "06:00", a: "Daily stand-up toàn ART (ops huddle 30')", who: "RTE", k: "cer" },
    { t: "06:30", a: "Pre-round briefing: officials, marshals, an ninh, y tế vào vị trí", who: "T1·T7", k: "ops" },
    { t: "07:00", a: "Cổng mở · accreditation & bag check · shuttle khán giả", who: "T6·T7", k: "fan" },
    { t: "07:30", a: "Tee off nhóm đầu · scoring live · world feed lên sóng", who: "T1·T3", k: "sport" },
    { t: "09:00", a: "Hospitality mở · sponsor activation · fan village vận hành", who: "T4·T6", k: "comm" },
    { t: "12:00", a: "Cao điểm khán giả · giám sát crowd flow & weather", who: "T7", k: "fan" },
    { t: "15:00", a: "Nhóm cuối lên green · khung giờ vàng broadcast", who: "T3", k: "sport" },
    { t: "17:30", a: "Kết thúc vòng đấu · ký thẻ điểm · phỏng vấn mixed zone", who: "T1·T3", k: "sport" },
    { t: "18:00", a: "Khán giả ra về · teardown nhẹ · an ninh quét sân", who: "T2·T7", k: "ops" },
    { t: "18:30", a: "Post-round debrief (RTE) · cập nhật SSOT", who: "RTE", k: "cer" },
    { t: "19:30", a: "Evening hot-wash (LPM+TD+PO) → quyết định cho ngày mai", who: "LPM", k: "cer" }
  ];

  // ---- BẬC THANG GIẢI ---------------------------------------
  const tourLadder = [
    { tour: "Asian Development Tour (ADT)", purse: "85k-100k USD", access: "Thấp nhất", vn: "BRG Open Đà Nẵng" },
    { tour: "Asian Tour (sole-sanctioned)", purse: "1-1.5M USD", access: "Trung bình", vn: "Nam A Bank Vietnam Masters" },
    { tour: "International Series (Asian Tour × LIV)", purse: "≥ 2M USD", access: "Cao", vn: "International Series Vietnam — KN Golf Links" },
    { tour: "DP World Tour", purse: "2-9M USD", access: "Rất cao", vn: "Chưa từng có tại VN" },
    { tour: "LIV Golf League event", purse: "~25M USD", access: "Cực cao, chỉ định", vn: "—" }
  ];

  // ---- 12 ARTEFACT SỐNG -------------------------------------
  const artefacts = [
    "WBS (Work Breakdown Structure)", "Master Schedule + Critical Path", "Interface Matrix",
    "Contract & Procurement Tracker", "RACI Matrix", "Risk Register (ROAM)",
    "Budget & Cash Flow Model", "Volunteer/Staffing Matrix (committee × ngày × ca × người)",
    "Run-of-Show", "Sales Pipeline Dashboard", "Marketing Beat Calendar",
    "Decision Log · Commitment Log · Blocker Log · DoD Library · Vendor Master List"
  ];

  // ---- WSJF -------------------------------------------------
  const wsjf = {
    formula: "WSJF = Cost of Delay / Job Size = (Business Value + Time Criticality + Risk Reduction) / Job Size",
    examples: [
      ["License & permit", "Time Criticality = 20 (trượt = huỷ giải)"],
      ["Title sponsor deal", "Business Value = 20"],
      ["Test event", "Risk Reduction = 20 (giảm risk vận hành cực lớn)"],
      ["Broadcast rehearsal / agronomy lead time", "Risk Reduction = 13"],
      ["Junior program", "Business Value = 8 (strategic theme)"],
      ["Merchandise", "Time Criticality = 3"]
    ],
    rule: "Top 20 Feature phải có WSJF tại PI Planning. Item không có WSJF không được vào Sprint."
  };

  // ---- "DỄ HIỂU" — diễn giải SAFe sang ngôn ngữ đời thường ----
  const plain = {
    hero: {
      lead: "Tổ chức một giải golf quốc tế giống như xây một toà nhà rồi tổ chức lễ khánh thành đúng một ngày đã hẹn — không được lùi.",
      body: "Bộ khung SAFe ở các tab kia chỉ là cách chia việc cho ~90 người chạy cùng nhịp về đúng ngày khai mạc. Dưới đây là toàn bộ mô hình kể bằng tiếng Việt thường, không cần biết SAFe."
    },
    // 4 tầng SAFe = 4 cấp ra quyết định, kể bằng phép ví
    floors: [
      { safe: "Portfolio · LPM", plain: "BAN CHỈ ĐẠO", icon: "♚", who: "Chủ đầu tư, UBND, VGA, CFO",
        analogy: "Như Hội đồng quản trị: quyết chiến lược và rót tiền, KHÔNG làm việc hằng ngày.",
        job: "Chọn đẳng cấp giải, duyệt ngân sách theo 4 lớp sản phẩm, được quyền 'bật đèn xanh / đỏ' cho 12 hạng mục lớn." },
      { safe: "Large Solution", plain: "BAN ĐỐI NGOẠI", icon: "⇄", who: "Phó TĐ + 3 chuyên gia kỹ thuật",
        analogy: "Như ban ngoại giao: làm việc với các 'ông lớn' bên ngoài mà mình không ra lệnh được.",
        job: "Chốt chuẩn với Tour, đài truyền hình, chủ sân, chính quyền — những thứ KHÔNG mặc cả được (chuẩn sân, tiền thưởng, chuẩn phát sóng)." },
      { safe: "ART · RTE + PM", plain: "BAN ĐIỀU HÀNH GIẢI", icon: "⚙", who: "Tổng đạo diễn (TĐ) + Trưởng vận hành",
        analogy: "Như ban điều hành công trường: giữ cho 8 tổ chạy cùng một nhịp, gỡ vướng mỗi ngày.",
        job: "Đồng bộ 8 tổ về một deadline cứng. Trưởng vận hành lo nhịp họp & gỡ tắc; Tổng đạo diễn quyết nội dung & là 'tiếng nói khách hàng'." },
      { safe: "8 Agile Teams", plain: "8 TỔ CHUYÊN MÔN", icon: "◷", who: "Mỗi tổ 5–9 người tự quản",
        analogy: "Như 8 nhà thầu phụ chuyên biệt: mỗi tổ ôm trọn một mảng và tự tổ chức.",
        job: "Thi đấu, sân bãi, truyền hình, tài trợ, dịch vụ VĐV, khán giả, an toàn, pháp lý-tài chính — mỗi tổ một mảng." }
    ],
    // từ điển thuật ngữ
    glossary: [
      { safe: "PI (Program Increment)", vi: "Cả mùa giải", g: "Toàn bộ dự án 12–18 tháng, đích đến là ngày khai mạc." },
      { safe: "Sprint", vi: "Một chặng ngắn", g: "Mỗi chặng ~1 tuần có mục tiêu rõ; 10 chặng nối nhau tới ngày giải." },
      { safe: "PI Planning", vi: "Họp lập kế hoạch tổng", d: "", g: "2 ngày cả 8 tổ ngồi lại, tự nhận việc & cam kết — buổi quan trọng nhất dự án." },
      { safe: "Feature / Story", vi: "Đầu việc lớn / việc nhỏ", g: "Hạng mục lớn được chẻ nhỏ thành việc làm được trong một chặng." },
      { safe: "Epic", vi: "Hạng mục chiến lược", g: "12 khối việc 'sống còn' như giấy phép, tài trợ, truyền hình, sân bãi." },
      { safe: "Dependency", vi: "Việc phụ thuộc nhau", g: "Tổ A chưa xong thì tổ B chưa làm được — chính là các đường nối trên Program Board." },
      { safe: "Milestone", vi: "Cột mốc bắt buộc", g: "Điểm không được trễ: ký tài trợ, giấy phép, tổng duyệt, ngày khai mạc." },
      { safe: "Critical Path", vi: "Đường tử thần", g: "Chuỗi 15–25 việc mà chỉ cần một việc trễ là cả giải trễ theo." },
      { safe: "Go / No-Go", vi: "Chốt 'chạy hay dừng'", d: "", g: "Buổi duyệt cuối: mọi hạng mục phải 'xanh' mới được khai mạc." },
      { safe: "Hardening Sprint", vi: "Tuần chỉ rà soát", g: "Tuần áp chót KHÔNG nhận việc mới, chỉ tổng duyệt và sửa lỗi." },
      { safe: "Inspect & Adapt", vi: "Họp rút kinh nghiệm", g: "Sau giải: mổ xẻ cái được/mất để bán 'cẩm nang' cho mùa sau." },
      { safe: "Definition of Done", vi: "Thế nào là 'xong'", g: "Viết rõ tiêu chí hoàn thành TRƯỚC khi làm, tránh cãi nhau ngày cuối." },
      { safe: "SSOT", vi: "Một nguồn dữ liệu chuẩn", g: "Mọi người nhìn cùng một bảng thật, không ai dùng file riêng." },
      { safe: "Value Stream", vi: "Lớp sản phẩm tạo giá trị", g: "4 'sản phẩm' của giải: thể thao, truyền hình, thương mại, tài sản chiến lược." }
    ],
    // cách đọc các tab còn lại
    guide: [
      { view: "mission", t: "Mission Control", d: "Phòng điều hành: sức khoẻ dự án, chỗ nào đang tắc/ổn, nguồn lực, rủi ro. Có 'cỗ máy thời gian' tua trạng thái theo từng tuần." },
      { view: "org", t: "Tổ chức", d: "Quy mô bộ máy, sơ đồ tổ chức, ai làm gì (vai trò), các bên liên quan, mục tiêu (OKR) và bảng phân trách nhiệm RACI." },
      { view: "big", t: "Bản đồ tổng", d: "Nhìn toàn cảnh: ai ở trên, ai ở dưới. Bấm vào bất kỳ ô nào để đọc chi tiết." },
      { view: "board", t: "Program Board", d: "Lịch 10 tuần × 8 tổ. Đường nối = việc phụ thuộc nhau. Rê chuột lên một khối để soi liên kết, hoặc mô phỏng 'việc trễ'." },
      { view: "timeline", t: "Timeline", d: "Dòng thời gian từ chuẩn bị → tuần giải → đóng dự án, kèm nhịp họp tăng dần và kịch bản một ngày thi đấu." },
      { view: "playbook", t: "Playbook vận hành", d: "Phần 'chân núi': 12 khung giá trị doanh nghiệp, tiền nong, đối tác, an toàn, sự kiện bên lề, bài học." },
      { view: "library", t: "Thư viện", d: "Kho tài nguyên chuẩn (SSOT): danh bạ liên lạc, hợp đồng, template, tri thức, media-brand, báo cáo." }
    ],
    principles: [
      { t: "Tất cả hội tụ về MỘT ngày", d: "Khác mọi dự án thường, deadline là ngày khai mạc — bất di bất dịch. Mọi việc đếm ngược về đó." },
      { t: "Càng gần ngày, họp càng dày", d: "Từ 2 tuần/lần → hằng ngày → sáng-tối. Tin tức duy nhất đáng nói: 'việc gì đang tắc'." },
      { t: "Không có tài trợ chính → không khởi động", d: "Tiền tài trợ phủ 50–60% chi phí. Đây là chốt chặn khả thi của cả giải." },
      { t: "Một việc, một người chịu trách nhiệm", d: "'Cả tổ lo' nghĩa là không ai lo. Mỗi đầu việc gắn đúng một cái tên." }
    ]
  };

  // ---- PROGRAM BOARD: ô việc (team × sprint) ------------------
  const boardCells = {
    T1: { S2: "Rules & format", S4: "Scoring spec", S6: "Course setup plan", S7: "Scoring test E2E", S9: "Pin/tee daily" },
    T2: { S1: "Overlay tender", S5: "Groundbreaking", S6: "Build 50%", S8: "Build 100%", S9: "Commissioning" },
    T3: { S1: "Broadcaster term", S2: "MSA signed", S6: "Feed integration", S7: "Rehearsal #1", S8: "Rehearsal #2" },
    T4: { S1: "Sponsor deck", S2: "Title SIGNED", S4: "70% sponsor", S5: "Activation creative", S8: "Fulfillment" },
    T5: { S3: "Visa batch 1", S5: "Invitation 100%", S6: "Visa batch 2", S8: "Transport dry-run", S9: "Player arrival" },
    T6: { S2: "Teaser launch", S4: "Campaign launch", S5: "Vé all-tier", S7: "Volunteer train", S9: "Opening rehearsal" },
    T7: { S2: "Security vendor", S6: "Lightning det.", S7: "Accreditation", S8: "Emergency drill", S9: "Go/No-Go" },
    T8: { S1: "Hồ sơ đăng cai", S3: "UBND approval", S4: "Permit batch 1", S7: "Carnet", S8: "Contracts 70%" }
  };
  // Dependency: [team,sprint] nguồn → [team,sprint] đích
  const boardLinks = [
    { from: ["T8", "S1"], to: ["T1", "S2"], label: "Sanctioning/hồ sơ đăng cai → mở khoá thiết lập thi đấu" },
    { from: ["T8", "S3"], to: ["T2", "S5"], label: "UBND approval → được phép khởi công overlay" },
    { from: ["T4", "S2"], to: ["T6", "S4"], label: "Title sponsor ký → marketing campaign launch chính thức" },
    { from: ["T1", "S4"], to: ["T3", "S6"], label: "Scoring spec → tích hợp dữ liệu vào world feed" },
    { from: ["T2", "S6"], to: ["T3", "S7"], label: "Tháp camera & cáp (build 50%) → broadcast rehearsal #1" },
    { from: ["T8", "S4"], to: ["T7", "S8"], label: "Permit batch 1 → emergency drill & occupancy hợp lệ" },
    { from: ["T4", "S5"], to: ["T2", "S8"], label: "Activation creative → lắp signage trong overlay (build 100%)" },
    { from: ["T1", "S7"], to: ["T3", "S7"], label: "Scoring test E2E → rehearsal khớp số liệu trực tiếp" },
    { from: ["T5", "S6"], to: ["T3", "S8"], label: "Visa batch 2 chốt field → công bố VĐV trên feed" },
    { from: ["T6", "S5"], to: ["T7", "S9"], label: "Vé bán all-tier → sức chứa cổng / quyết định Go-NoGo" },
    { from: ["T2", "S8"], to: ["T7", "S9"], label: "Overlay 100% → readiness review Go/No-Go" }
  ];
  // Chi tiết từng ô: what / input / output / outcome. Khoá = team+sprint (vd "T1S2")
  const boardDetail = {
    T1S2: { what: "Chốt thể thức thi đấu, luật giải, cơ cấu vòng & cắt loại theo chuẩn Tour.", input: "Solution Intent từ Tour (chuẩn luật, anti-doping), số VĐV dự kiến.", output: "Bộ luật giải + format văn bản, template tee-time & pairing.", outcome: "Khung thi đấu hợp chuẩn để mọi tổ khác bám theo.", crit: false },
    T1S4: { what: "Đặc tả hệ thống tính điểm real-time và luồng dữ liệu ra ngoài.", input: "Chuẩn scoring của Tour, danh sách hố/nhóm, hạ tầng IT.", output: "Spec tích hợp scoring (API/feed) cho broadcast & app khán giả.", outcome: "Cơ sở để T3 đưa số liệu trực tiếp vào world feed." },
    T1S6: { what: "Lập kế hoạch setup sân hằng ngày: vị trí pin, tee, tốc độ green, rough.", input: "Báo cáo agronomy, yêu cầu của Tour.", output: "Lịch setup 4 ngày + bản đồ vị trí pin/tee.", outcome: "Sân đạt chuẩn thi đấu mỗi sáng." },
    T1S7: { what: "Test toàn trình hệ thống điểm với dữ liệu giả lập tại test event.", input: "Scoring spec, hệ thống đã dựng, test event (T3/T2).", output: "Báo cáo pass/fail, bug list đã đóng.", outcome: "Giảm rủi ro sự cố điểm số; cấp số liệu cho rehearsal." },
    T1S9: { what: "Vận hành setup sân hằng ngày trong tuần giải.", input: "Course setup plan, điều kiện thời tiết sáng sớm.", output: "Sân sẵn sàng thi đấu trước 6:00 mỗi ngày.", outcome: "Điều kiện thi đấu công bằng, ổn định." },

    T2S1: { what: "Đấu thầu & chọn nhà thầu dựng lắp overlay.", input: "Thiết kế overlay sơ bộ, ngân sách hạ tầng.", output: "Hợp đồng nhà thầu overlay đã ký.", outcome: "Sẵn sàng khởi công ngay khi có giấy phép." },
    T2S5: { what: "Khởi công, mobilize công trường tạm (rào, kho, lán).", input: "UBND approval (T8·S3), hợp đồng nhà thầu, mặt bằng.", output: "Site mobilized, bắt đầu thi công.", outcome: "Khởi động chuỗi xây dựng overlay.", crit: true },
    T2S6: { what: "Dựng khán đài, lều hospitality, tháp camera; MEP rough-in.", input: "Site mobilized, bản vẽ MEP đã duyệt.", output: "Kết cấu khán đài + tháp camera & cáp 50%.", outcome: "Đủ hạ tầng để T3 lắp camera/cáp và rehearsal #1." },
    T2S8: { what: "Hoàn thiện overlay, lắp signage, nghiệm thu MEP.", input: "Build 50%, activation creative (T4·S5) cho signage.", output: "Overlay hoàn chỉnh 100%, đã nghiệm thu.", outcome: "Mặt bằng sẵn sàng cho readiness Go/No-Go." },
    T2S9: { what: "Chạy thử & bàn giao điện–nước–mạng toàn công trường.", input: "Build 100% đã nghiệm thu.", output: "Hệ thống kỹ thuật vận hành ổn định.", outcome: "Không sự cố hạ tầng trong tuần giải." },

    T3S1: { what: "Đàm phán term sheet với host broadcaster.", input: "Solution Intent broadcast spec (1080p HDR, ≥18 cam).", output: "Term sheet đã thống nhất.", outcome: "Khởi động deal truyền hình — chi cứng lớn #2." },
    T3S2: { what: "Ký hợp đồng dịch vụ chính (MSA) với broadcaster.", input: "Term sheet, ngân sách broadcast được duyệt.", output: "MSA signed.", outcome: "Khoá năng lực sản xuất world feed." },
    T3S6: { what: "Tích hợp dữ liệu scoring & đồ hoạ vào world feed.", input: "Scoring spec (T1·S4), tháp camera & cáp (T2·S6).", output: "Hệ thống feed hiển thị số liệu trực tiếp.", outcome: "World feed thể hiện điểm/đồ hoạ chính xác." },
    T3S7: { what: "Tổng duyệt sản xuất lần 1 cùng test event.", input: "Feed integration, scoring test (T1·S7), build 50%.", output: "Bản ghi rehearsal + danh sách lỗi cần sửa.", outcome: "Phát hiện lỗi sản xuất sớm." },
    T3S8: { what: "Tổng duyệt đầy đủ: commentary + graphics + replay.", input: "Field đã chốt (T5·S6), rehearsal #1.", output: "Quy trình phát sóng chuẩn, sẵn sàng.", outcome: "Sẵn sàng phát trực tiếp đi 30+ thị trường." },

    T4S1: { what: "Xây bộ hồ sơ chào tài trợ (sponsor deck).", input: "Định vị giải, media value ước tính, tháp tài trợ.", output: "Sponsor deck + bảng giá theo tier.", outcome: "Công cụ bán tài trợ cho cả pipeline." },
    T4S2: { what: "Ký nhà tài trợ chính (title sponsor).", input: "Sponsor deck, MOU, vòng đàm phán.", output: "Hợp đồng title sponsor đã ký.", outcome: "MỞ KHOÁ khả thi tài chính & cho phép T6 launch campaign.", crit: true },
    T4S4: { what: "Ký 70% gói tài trợ mục tiêu (presenting + partner).", input: "Title đã ký, sales pipeline.", output: "Các hợp đồng presenting & official partner.", outcome: "Đảm bảo doanh thu nền của giải." },
    T4S5: { what: "Chốt thiết kế kích hoạt thương hiệu & bản đồ signage.", input: "Brand guideline của sponsor.", output: "Bộ creative + bản đồ vị trí signage.", outcome: "Cấp dữ liệu cho T2 lắp signage khi build 100%." },
    T4S8: { what: "Thực hiện & báo cáo quyền lợi cho sponsor.", input: "Signage trong overlay, hospitality vận hành.", output: "Fulfillment report (ảnh, số liệu, media value).", outcome: "Cơ sở để sponsor gia hạn hợp đồng." },

    T5S3: { what: "Xin visa cho officials & advance team (đợt 1).", input: "Danh sách officials (T1), hồ sơ nhân thân.", output: "Visa batch 1 approved.", outcome: "Đội tiền trạm & trọng tài Tour vào được VN." },
    T5S5: { what: "Gửi thư mời chính thức toàn bộ field VĐV.", input: "Field list đã xác nhận với Tour.", output: "144 lời mời đã gửi.", outcome: "Khoá danh sách VĐV tham dự." },
    T5S6: { what: "Xin visa cho VĐV (140–160 người, đợt 2).", input: "Invitation đã gửi, hồ sơ VĐV.", output: "Visa batch 2 approved.", outcome: "CHỐT field → cho phép T3 công bố VĐV trên feed.", crit: true },
    T5S8: { what: "Chạy thử logistics đón–tiễn VĐV.", input: "Hotel block, courtesy car, lịch bay.", output: "Run sheet vận chuyển đã test.", outcome: "Đón–tiễn đoàn trơn tru, đúng giờ." },
    T5S9: { what: "Đón VĐV thực tế, check-in, practice round.", input: "Transport dry-run, visa đã duyệt.", output: "VĐV check-in & tập luyện.", outcome: "VĐV sẵn sàng thi đấu." },

    T6S2: { what: "Chiến dịch nhá hàng (teaser) khởi động nhận biết.", input: "Concept campaign, kênh social.", output: "Teaser content live trên các kênh.", outcome: "Tạo nhận biết sớm trước launch." },
    T6S4: { what: "Ra mắt marketing chính thức + họp báo.", input: "Title sponsor đã ký (T4·S2).", output: "Campaign đa kênh live, press conference.", outcome: "Khởi động bán vé & độ phủ truyền thông." },
    T6S5: { what: "Mở bán toàn bộ 4 hạng vé.", input: "Ticketing platform, campaign đang chạy.", output: "Vé all-tier mở bán.", outcome: "Doanh thu vé + dữ liệu sức chứa cho T7." },
    T6S7: { what: "Huấn luyện tình nguyện viên đợt 1.", input: "TNV đã tuyển (800–1500), giáo trình.", output: "TNV đã train & phân ca.", outcome: "Lực lượng vận hành sẵn sàng." },
    T6S9: { what: "Tổng duyệt lễ khai mạc.", input: "Kịch bản ceremony, sân khấu.", output: "Lễ khai mạc chạy thử hoàn chỉnh.", outcome: "Khai mạc trơn tru, đúng nghi thức ngoại giao." },

    T7S2: { what: "Chọn nhà thầu an ninh, phối hợp công an.", input: "Risk assessment, yêu cầu phối hợp địa phương.", output: "Hợp đồng an ninh đã ký.", outcome: "Khung an ninh nền cho toàn giải." },
    T7S6: { what: "Lắp & cấu hình hệ thống phát hiện sét.", input: "Weather protocol, bản đồ sân.", output: "Lightning detector (bán kính 12km) hoạt động.", outcome: "An toàn thời tiết — yếu tố sống còn của golf." },
    T7S7: { what: "Phát hành thẻ ra vào phân vùng (accreditation).", input: "Danh sách visa/role, layout overlay.", output: "5000+ thẻ in & cấp phát.", outcome: "Kiểm soát ra vào toàn bộ khu vực." },
    T7S8: { what: "Diễn tập sơ tán / y tế / cháy nổ.", input: "Permit batch 1 (T8·S4), evacuation plan 3 kịch bản.", output: "Drill hoàn tất + checklist phản ứng.", outcome: "Đội ngũ phản ứng thuần thục; occupancy hợp lệ." },
    T7S9: { what: "Duyệt sẵn sàng cuối cùng (Go/No-Go).", input: "Overlay 100% (T2·S8), vé bán (T6·S5), mọi checklist.", output: "Quyết định chính thức 'chạy hay dừng'.", outcome: "Cổng chốt khai mạc — mọi hạng mục phải XANH.", crit: true },

    T8S1: { what: "Chuẩn bị & nộp hồ sơ đăng cai qua VGA.", input: "Chủ trương UBND, điều lệ giải, chương trình.", output: "Hồ sơ đăng cai đã nộp.", outcome: "MỞ KHOÁ thiết lập thi đấu (T1) & quy trình permit." },
    T8S3: { what: "Lấy văn bản UBND cho phép tổ chức.", input: "Hồ sơ đăng cai, làm việc 3–5 sở ngành.", output: "Văn bản chấp thuận + build permit.", outcome: "CHO PHÉP khởi công overlay (T2·S5).", crit: true },
    T8S4: { what: "Xin cụm giấy phép đợt 1 (sự kiện thể thao, lao động nước ngoài).", input: "Bộ hồ sơ permit đã chuẩn bị.", output: "Permit batch 1 approved.", outcome: "Cho phép emergency drill & occupancy (T7·S8)." },
    T8S7: { what: "Xin carnet ATA để nhập thiết bị broadcast.", input: "Danh mục thiết bị, thủ tục hải quan.", output: "Carnet approved.", outcome: "Thiết bị truyền hình nhập cảnh đúng hạn." },
    T8S8: { what: "Hoàn tất & thanh toán 70% hợp đồng nhà cung cấp.", input: "Vendor master list, dòng tiền.", output: "40–60 hợp đồng ký + thanh toán đợt.", outcome: "Khoá cam kết nhà cung cấp trước tuần giải." }
  };

  // ---- ẢNH CHỤP TRẠNG THÁI (Mission Control) -----------------
  // Snapshot tại Sprint 6 (T-5 tuần). st: done|track|risk|block|todo
  const boardStatus = {
    T1S2: { st: "done", pct: 100 }, T1S4: { st: "done", pct: 100 }, T1S6: { st: "track", pct: 65 }, T1S7: { st: "todo", pct: 0 }, T1S9: { st: "todo", pct: 0 },
    T2S1: { st: "done", pct: 100 }, T2S5: { st: "done", pct: 100 }, T2S6: { st: "track", pct: 70 }, T2S8: { st: "todo", pct: 0 }, T2S9: { st: "todo", pct: 0 },
    T3S1: { st: "done", pct: 100 }, T3S2: { st: "done", pct: 100 }, T3S6: { st: "block", pct: 45 }, T3S7: { st: "todo", pct: 0 }, T3S8: { st: "todo", pct: 0 },
    T4S1: { st: "done", pct: 100 }, T4S2: { st: "done", pct: 100 }, T4S4: { st: "done", pct: 100 }, T4S5: { st: "done", pct: 100 }, T4S8: { st: "todo", pct: 0 },
    T5S3: { st: "done", pct: 100 }, T5S5: { st: "done", pct: 100 }, T5S6: { st: "risk", pct: 60 }, T5S8: { st: "todo", pct: 0 }, T5S9: { st: "todo", pct: 0 },
    T6S2: { st: "done", pct: 100 }, T6S4: { st: "done", pct: 100 }, T6S5: { st: "done", pct: 100 }, T6S7: { st: "todo", pct: 0 }, T6S9: { st: "todo", pct: 0 },
    T7S2: { st: "done", pct: 100 }, T7S6: { st: "track", pct: 80 }, T7S7: { st: "todo", pct: 0 }, T7S8: { st: "todo", pct: 0 }, T7S9: { st: "todo", pct: 0 },
    T8S1: { st: "done", pct: 100 }, T8S3: { st: "done", pct: 100 }, T8S4: { st: "done", pct: 100 }, T8S7: { st: "pending", pct: 30 }, T8S8: { st: "todo", pct: 0 }
  };

  const control = {
    asOf: { label: "Ảnh chụp tại Sprint 6 · T-5 tuần", sprint: "S6", cadence: "Scrum of Scrums: hằng ngày · LPM review: 1 tuần/lần · Architecture sync: 2 lần/tuần" },
    countdown: 35,
    kpi: { predictability: 82, budgetBurnPct: 52, budgetTotal: "9.5M USD", blockers: 3, atRisk: 1, pending: 2, objectivesDone: 26, objectivesTotal: 32 },
    lenses: [
      { id: "overview", name: "Tổng quan", icon: "◉", desc: "Toàn cảnh mọi chiều" },
      { id: "exec", name: "Steering", icon: "♚", desc: "Cấp cao: tiền · license · rủi ro · sẵn sàng" },
      { id: "ops", name: "Vận hành", icon: "⚙", desc: "Blocker · phụ thuộc · critical path · team" },
      { id: "resource", name: "Nguồn lực", icon: "◷", desc: "Nhân lực · capacity · thiếu hụt" },
      { id: "flow", name: "Dòng chảy", icon: "⇄", desc: "Trạng thái · pending · huỷ · alignment" },
      { id: "finance", name: "Tài chính", icon: "₫", desc: "Ngân sách · dòng tiền · tài trợ · vốn lưu động" }
    ],
    teamMeta: {
      T1: { velPlan: 34, velDone: 21, note: "Scoring spec đã xong; đang lập course setup plan." },
      T2: { velPlan: 55, velDone: 30, note: "Overlay đã khởi công, build 50% đúng tiến độ." },
      T3: { velPlan: 42, velDone: 18, note: "Feed integration chờ cáp từ T2 (MEP trễ 3 ngày)." },
      T4: { velPlan: 38, velDone: 34, note: "Tài trợ vượt kế hoạch — 70% gói đã ký." },
      T5: { velPlan: 30, velDone: 16, note: "Visa batch 2 đang vướng — 12/160 hồ sơ tồn ở lãnh sự." },
      T6: { velPlan: 36, velDone: 24, note: "Vé all-tier đã mở bán; chuẩn bị train TNV." },
      T7: { velPlan: 28, velDone: 14, note: "Đang lắp lightning detector; chuẩn bị accreditation." },
      T8: { velPlan: 40, velDone: 30, note: "Permit batch 1 xong; đang xử lý carnet ATA." }
    },
    roam: {
      resolved: [{ t: "Title sponsor", d: "Đã ký Sprint 2 — gỡ rủi ro khả thi tài chính lớn nhất." }],
      owned: [
        { t: "Visa cluster (field)", d: "Owner T8 + T5 · 12/160 hồ sơ tồn, theo dõi hằng ngày." },
        { t: "Weather / lightning", d: "Owner T7 · đội khí tượng on-site, quy trình 30/30." }
      ],
      accepted: [{ t: "Lỗ năm 1 ≤ 20%", d: "Chấp nhận theo chủ trương đầu tư dài hạn (xây tài sản chiến lược)." }],
      mitigated: [
        { t: "Sự cố scoring", d: "Test event S7 + scoring test E2E (S7) giảm rủi ro." },
        { t: "Sự cố phát sóng", d: "2 lần rehearsal (S7, S8)." },
        { t: "Overlay / MEP trễ", d: "Buffer 30% + fast-track cấp nguồn khu camera." }
      ]
    },
    milestones: [
      { sprint: "S2", name: "Title + Broadcaster", st: "done" },
      { sprint: "S3", name: "Build authorization", st: "done" },
      { sprint: "S4", name: "Mid-PI checkpoint", st: "done" },
      { sprint: "S5", name: "Overlay start", st: "done" },
      { sprint: "S7", name: "Test event", st: "next" },
      { sprint: "S8", name: "Dress rehearsal", st: "future" },
      { sprint: "S9", name: "Go / No-Go", st: "future" },
      { sprint: "S10", name: "TOURNAMENT", st: "future" }
    ],
    impediments: [
      { sev: "high", team: "T5", what: "Visa batch 2: 12/160 hồ sơ VĐV tồn ở lãnh sự — nguy cơ trễ công bố field.", owner: "Legal Head + Player Services", age: 6, impact: "Chặn T3 công bố field trên world feed", cell: "T5S6" },
      { sev: "high", team: "T2", what: "Nhà thầu MEP chậm 3 ngày cấp nguồn khu khán đài hố 17–18.", owner: "Venue Director", age: 3, impact: "Chặn T3 kéo cáp camera → rehearsal #1", cell: "T3S6" },
      { sev: "med", team: "T8", what: "Carnet ATA chờ xác nhận hải quan cho lô thiết bị broadcast.", owner: "CFO", age: 4, impact: "Rủi ro nhập thiết bị truyền hình trễ", cell: "T8S7" }
    ],
    velocityBySprint: [{ s: "S1", v: 62 }, { s: "S2", v: 78 }, { s: "S3", v: 71 }, { s: "S4", v: 69 }, { s: "S5", v: 74 }, { s: "S6", v: 41, wip: true }],
    budgetByVS: [{ vs: "VS1", pct: 58 }, { vs: "VS2", pct: 40 }, { vs: "VS3", pct: 62 }, { vs: "VS4", pct: 35 }, { vs: "OPS", pct: 55 }],

    // NGUỒN LỰC & CAPACITY
    resources: {
      teams: {
        T1: { filled: 7, needed: 8, load: 96, gap: "Thiếu 1 walking scorer lead trước test event" },
        T2: { filled: 9, needed: 9, load: 88, gap: "" },
        T3: { filled: 6, needed: 7, load: 104, gap: "Quá tải — thiếu 1 broadcast IT engineer" },
        T4: { filled: 7, needed: 7, load: 72, gap: "" },
        T5: { filled: 5, needed: 6, load: 98, gap: "Thiếu 1 visa coordinator" },
        T6: { filled: 8, needed: 8, load: 90, gap: "" },
        T7: { filled: 5, needed: 6, load: 101, gap: "Quá tải — thiếu 1 medical lead" },
        T8: { filled: 6, needed: 6, load: 85, gap: "" }
      },
      volunteers: { filled: 620, needed: 1200, note: "Mới đạt 52% — cần đẩy đợt tuyển 2 trước Sprint 7" },
      shortfalls: [
        { role: "Broadcast IT engineer", team: "T3", sev: "high", note: "Quá tải feed integration — tuyển gấp" },
        { role: "Medical lead (bác sĩ trưởng)", team: "T7", sev: "high", note: "Bắt buộc có trước Go/No-Go" },
        { role: "Tình nguyện viên (×580 còn thiếu)", team: "T6", sev: "high", note: "Mới 52% — đợt tuyển 2 gấp" },
        { role: "Visa coordinator", team: "T5", sev: "med", note: "Xử lý 12 hồ sơ tồn ở lãnh sự" },
        { role: "Walking scorer lead", team: "T1", sev: "med", note: "Cần trước test event Sprint 7" }
      ]
    },

    // ALIGNMENT GIAO DIỆN GIỮA TEAM (interface health)
    alignment: [
      { pair: "T8 → T2", interface: "UBND approval → khởi công overlay", st: "aligned" },
      { pair: "T4 → T6", interface: "Title sponsor → marketing campaign", st: "aligned" },
      { pair: "T1 → T3", interface: "Scoring spec → tích hợp world feed", st: "aligned" },
      { pair: "T2 → T3", interface: "Tháp camera & cáp → broadcast rehearsal", st: "atrisk", note: "MEP trễ 3 ngày cấp nguồn" },
      { pair: "T5 → T3", interface: "Visa/field → công bố VĐV trên feed", st: "notaligned", note: "12 visa tồn, field chưa chốt 100%" },
      { pair: "T4 → T2", interface: "Activation creative → lắp signage", st: "aligned" },
      { pair: "T6 → T7", interface: "Vé bán → sức chứa cổng", st: "pending", note: "Chờ số liệu vé cuối Sprint 6" },
      { pair: "T8 → T7", interface: "Permit → drill & occupancy", st: "aligned" },
      { pair: "T8 → T3", interface: "Carnet ATA → nhập thiết bị broadcast", st: "pending", note: "Chờ hải quan xác nhận" }
    ],

    // ĐANG CHỜ DUYỆT (pending approvals — chặn bởi bên ngoài)
    approvals: [
      { what: "Carnet ATA — lô thiết bị broadcast", who: "Hải quan", age: 4, owner: "CFO", sev: "med" },
      { what: "Visa batch 2 — 12 hồ sơ VĐV", who: "Lãnh sự quán", age: 6, owner: "Legal Head", sev: "high" },
      { what: "Giải ngân contingency đợt 2 (25%)", who: "Steering Committee", age: 2, owner: "Tournament Director", sev: "med" },
      { what: "Duyệt layout fan village (final)", who: "Venue Owner", age: 1, owner: "Marketing Director", sev: "low" }
    ],

    // ĐÃ HUỶ / CẮT KHỎI PHẠM VI (descoped)
    descoped: [
      { what: "Drone light show khai mạc", reason: "Cắt do ngân sách + rủi ro cấp phép bay", when: "S4" },
      { what: "Hạng vé Platinum (tier 5)", reason: "Gộp vào VIP để đơn giản hoá vận hành", when: "S3" },
      { what: "Live concert sau chung kết", reason: "Hoãn sang mùa 2", when: "S5" },
      { what: "Phát sóng 4K HDR đầy đủ", reason: "Hạ xuống 1080p HDR theo đúng chuẩn Tour — vẫn đạt yêu cầu", when: "S2" }
    ],

    // SẴN SÀNG (Go/No-Go) — 5 hạng mục bắt buộc xanh
    readiness: [
      { area: "Agronomy / sân đấu", st: "track", pct: 70, note: "Green speed đạt; firmness đang tinh chỉnh" },
      { area: "Scoring / Broadcast", st: "block", pct: 45, note: "Feed integration nghẽn chờ cáp; rehearsal chưa chạy" },
      { area: "Safety / Medical", st: "track", pct: 60, note: "Lightning detector đang lắp; thiếu medical lead" },
      { area: "Player check-in / Visa", st: "risk", pct: 60, note: "12 visa tồn — field chưa chốt" },
      { area: "Sponsor activation", st: "track", pct: 80, note: "Creative xong; chờ signage build 100%" }
    ],

    // RISK HEAT MATRIX (likelihood × impact)
    riskMatrix: [
      { t: "Visa cluster trễ → field không chốt", l: 3, i: 3, own: "T8+T5" },
      { t: "MEP trễ → broadcast cable", l: 3, i: 2, own: "T2" },
      { t: "Sự cố scoring ngày thi đấu", l: 1, i: 3, own: "T1+T3" },
      { t: "Thời tiết cực đoan / sét", l: 2, i: 3, own: "T7" },
      { t: "Carnet hải quan trễ", l: 2, i: 2, own: "T8" },
      { t: "Thiếu medical lead trước Go/No-Go", l: 2, i: 3, own: "T7" },
      { t: "TNV không đủ (mới 52%)", l: 2, i: 2, own: "T6" },
      { t: "Sponsor rút / chậm thanh toán", l: 1, i: 3, own: "T4" },
      { t: "Vượt ngân sách overlay", l: 2, i: 2, own: "T2+CFO" },
      { t: "Khủng hoảng truyền thông", l: 1, i: 2, own: "T3" }
    ]
  };

  window.GOLF = {
    meta: {
      title: "GIẢI GOLF QUỐC TẾ TẠI VIỆT NAM",
      subtitle: "Mô hình điều hành SAFe × Playbook vận hành — bản đồ tầng lớp",
      pi: "1 PI duy nhất = toàn bộ dự án · 10 Sprint × 1 tuần · deadline cứng = ngày khai mạc"
    },
    valueStreams, layers, epics, teams, sprints, ceremonies, ceremonyPhases,
    deps, kinks, functionalAreas, phases, ecosystem, patterns, antiPatterns,
    finance, tourLadder, artefacts, wsjf, plain,
    boardCells, boardLinks, boardDetail, boardStatus, control, runOfShow
  };
})();
