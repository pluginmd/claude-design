/* ============================================================
   TỔ CHỨC — quy mô · org chart · vai trò · stakeholder · OKR
   Sát theo Mission Control (boardStatus, control, teams)
   ============================================================ */
(function () {
  // ---- QUY MÔ TỔ CHỨC ----------------------------------------
  const scale = [
    { n: "~90", l: "Nhân sự core ART", s: "chạy suốt 10 tuần" },
    { n: "8", l: "Agile Teams", s: "two-pizza · tự tổ chức" },
    { n: "800–1500", l: "Tình nguyện viên", s: "đợt cao điểm tuần giải" },
    { n: "40–60", l: "Hợp đồng nhà cung cấp", s: "vendor master list" },
    { n: "4", l: "Tầng quản trị SAFe", s: "Portfolio → Teams" },
    { n: "6", l: "Nhóm stakeholder chính", s: "thị trường nhiều phía" },
    { n: "144", l: "VĐV + 50 officials", s: "field quốc tế" },
    { n: "32", l: "PI Objectives cam kết", s: "26 đã đạt (82%)" }
  ];

  // ---- ORG CHART (vị trí tính trong component) ---------------
  // group: gov | sol | art | team | support
  const chart = {
    steering: { id: "steering", title: "Steering Committee", sub: "Lean Portfolio Mgmt", role: "LPM", group: "gov" },
    artLead: [
      { id: "RTE", title: "RTE", sub: "COO / Deputy TD", role: "RTE", group: "art" },
      { id: "PM", title: "PM", sub: "Tournament Director", role: "PM", group: "art" },
      { id: "ARCH", title: "System Architect", sub: "Bộ ba kỹ thuật", role: "ARCH", group: "art" },
      { id: "BO", title: "Business Owners", sub: "Sponsor · Venue · Tour · UBND", role: "BO", group: "art" }
    ],
    solution: { id: "STE", title: "Solution Train", sub: "STE = Deputy TD + Solution Architect", role: "STE", group: "sol" },
    support: { id: "SS", title: "Shared Services + System Team", sub: "Legal · Finance · HR · Procurement · 6 System Team", role: "SS", group: "support" }
  };

  // ---- VAI TRÒ CHÍNH -----------------------------------------
  const roles = [
    { id: "LPM", title: "Steering Committee (LPM)", person: "Chủ đầu tư (Chair) · UBND · VGA · CFO · Legal", level: "Portfolio", hue: 300,
      mandate: "Định hướng chiến lược, cấp ngân sách theo Value Stream, approve/kill Epic, bảo vệ ART khỏi nhiễu chính trị.",
      does: ["Lock Strategic Themes (3-5)", "Duyệt Lean Budget & guardrails", "Approve/kill 12 Epic", "Quyết định strategic & escalation"],
      notdoes: ["KHÔNG quản vận hành hằng ngày", "KHÔNG can thiệp cách team tự tổ chức"],
      reports: "—", link: "exec" },
    { id: "RTE", title: "RTE — Chief Scrum Master", person: "COO / Deputy TD", level: "ART", hue: 230,
      mandate: "Đồng bộ nhịp 8 team về một deadline cứng; chủ trì PI Planning, SoS, System Demo, I&A; gỡ blocker.",
      does: ["Chủ trì ceremony toàn ART", "Quản dependency & risk ROAM", "Clear blocker xuyên team", "Giữ predictability ≥ 80%"],
      notdoes: ["KHÔNG quyền strategic", "KHÔNG own backlog (đó là PM)"],
      reports: "Steering Committee", link: "ops" },
    { id: "PM", title: "PM — Product Manager", person: "Tournament Director", level: "ART", hue: 150,
      mandate: "Own Program Backlog (Feature), đặt PI Objectives, là tiếng nói khách hàng, quyết nội dung & ưu tiên.",
      does: ["Sở hữu & ưu tiên Program Backlog (WSJF)", "Đặt PI Objectives & vision", "Quyết Solution Intent variable", "Đại diện khách hàng"],
      notdoes: ["KHÔNG quản nhịp họp (đó là RTE)", "KHÔNG vi quản team"],
      reports: "Steering Committee", link: "exec" },
    { id: "STE", title: "STE — Solution Train Engineer", person: "Deputy Tournament Director", level: "Large Solution", hue: 165,
      mandate: "Làm việc out-bound với 'ông lớn' bên ngoài: Tour, Host Broadcaster, Chủ sân, UBND — align Solution Intent.",
      does: ["Pre/Post-PI Planning với supplier", "Đàm phán Solution Intent fixed", "Architecture Sync với đối tác ngoài", "Đối ngoại & protocol"],
      notdoes: ["KHÔNG ra lệnh cho đối tác ngoài", "KHÔNG quản team nội bộ"],
      reports: "Steering Committee", link: "ops" },
    { id: "ARCH", title: "System / Solution Architect", person: "Tour Tech Dir · Course Superintendent · Broadcast Tech Dir", level: "ART + Large Solution", hue: 255,
      mandate: "Giữ tính toàn vẹn kỹ thuật của 'solution': chuẩn sân, scoring, broadcast spec — Fixed vs Variable.",
      does: ["Định nghĩa & bảo vệ Solution Intent", "Duyệt thay đổi kỹ thuật", "Architecture runway cho team", "QC chuẩn Tour"],
      notdoes: ["KHÔNG quyết thương mại", "KHÔNG vi quản thực thi"],
      reports: "PM + STE", link: "ops" },
    { id: "BO", title: "Business Owners", person: "Title Sponsor · Venue Owner · Tour · UBND", level: "ART", hue: 95,
      mandate: "Người chịu trách nhiệm kinh doanh cuối cùng; vote confidence tại PI Planning; gỡ vướng cấp cao.",
      does: ["Vote confidence PI Objectives", "Gán Business Value cho objective", "Gỡ blocker cấp cao", "Bảo trợ nguồn lực"],
      notdoes: ["KHÔNG quản hằng ngày", "KHÔNG thay PO quyết chi tiết"],
      reports: "—", link: "exec" },
    { id: "PO", title: "Product Owners (×8)", person: "8 Functional Directors", level: "Team", hue: 210,
      mandate: "Own Team Backlog, ưu tiên Story, chấp nhận công việc 'done', là tiếng nói khách hàng cấp team.",
      does: ["Quản & ưu tiên Team Backlog", "Viết & chấp nhận Story (DoD)", "Đại diện khách hàng cho team", "Phối hợp dependency"],
      notdoes: ["KHÔNG quản con người (team tự tổ chức)", "KHÔNG đặt strategic theme"],
      reports: "PM (TD)", link: "ops" },
    { id: "SM", title: "Scrum Masters (×8)", person: "8 Project Coordinators (PMO)", level: "Team", hue: 35,
      mandate: "Phục vụ team: chạy ceremony, gỡ impediment, bảo vệ team khỏi nhiễu, coach Agile.",
      does: ["Chạy daily/planning/retro của team", "Gỡ & escalate impediment", "Bảo vệ flow của team", "Cập nhật SSOT & metrics"],
      notdoes: ["KHÔNG giao việc (PO ưu tiên)", "KHÔNG là sếp của team"],
      reports: "RTE", link: "ops" },
    { id: "SS", title: "System Team + Shared Services", person: "Legal · Finance · HR · Procurement · 6 System Team", level: "ART", hue: 30,
      mandate: "Năng lực dùng chung: test event, scoring IT, broadcast IT, agronomy QC, security drill, pháp lý-tài chính-mua sắm.",
      does: ["Test event & integration sớm (shift-left)", "Dịch vụ pháp lý/tài chính/HR/mua sắm", "Build & maintain hạ tầng dùng chung", "QC & demo support"],
      notdoes: ["KHÔNG own một Value Stream riêng", "KHÔNG thay team thực thi"],
      reports: "RTE", link: "resource" }
  ];

  // ---- STAKEHOLDER MAP (power × interest) --------------------
  // power: high|low · interest: high|low → 4 ô chiến lược
  const stakeholders = [
    { name: "Chủ đầu tư", power: "high", interest: "high", strategy: "manage", note: "Ra quyết định & cấp vốn cuối cùng." },
    { name: "Tour (chủ quản)", power: "high", interest: "high", strategy: "manage", note: "Giữ license — điều kiện sống còn." },
    { name: "UBND tỉnh", power: "high", interest: "high", strategy: "manage", note: "Giấy phép tồn tại & hình ảnh điểm đến." },
    { name: "Title Sponsor", power: "high", interest: "high", strategy: "manage", note: "Phủ 50-60% chi phí; cần ROI." },
    { name: "Host Broadcaster", power: "high", interest: "med", strategy: "satisfy", note: "Quyết chất lượng world feed." },
    { name: "Chủ sân", power: "high", interest: "med", strategy: "satisfy", note: "Kiểm soát tài sản thi đấu chính." },
    { name: "VĐV & Officials", power: "med", interest: "high", strategy: "inform", note: "Khách hàng cốt lõi sản phẩm thể thao." },
    { name: "Khán giả / Fan", power: "low", interest: "high", strategy: "inform", note: "Tạo media value & doanh thu vé." },
    { name: "Nhà thầu & TNV", power: "low", interest: "high", strategy: "inform", note: "Lực lượng thực thi & vận hành." },
    { name: "Báo chí / KOL", power: "low", interest: "high", strategy: "inform", note: "Khuếch đại thương hiệu." },
    { name: "VGA", power: "med", interest: "med", strategy: "satisfy", note: "Cầu nối thủ tục đăng cai." },
    { name: "Cộng đồng golf VN", power: "low", interest: "low", strategy: "monitor", note: "Hưởng lợi legacy dài hạn." }
  ];

  // ---- OKR & CAM KẾT (ART + per team) ------------------------
  const artOKR = {
    objective: "Tổ chức giải golf quốc tế đạt chuẩn, GIỮ LICENSE, breakeven kiểm soát, và xây tài sản chiến lược cho 3 mùa kế tiếp.",
    krs: [
      ["PI Predictability", "≥ 80%", "82%", 82],
      ["License retention", "Giữ được", "đúng hướng", 80],
      ["Player NPS", "≥ 70", "đo sau giải", 0],
      ["Budget variance", "≤ ±10%", "52% spend, đúng kế hoạch", 90],
      ["Go/No-Go all green", "tại Sprint 9", "đang chuẩn bị", 55]
    ]
  };

  const teamOKR = {
    T1: { obj: "Giải đạt chuẩn thi đấu quốc tế — VĐV, officials & Tour hài lòng.",
      krs: [["Course rating từ Tour", "≥ good", "đang tinh chỉnh", 70], ["Scoring uptime", "≥ 99.9%", "test E2E S7", 45], ["Player NPS", "≥ 70", "đo sau giải", 0]],
      commits: [["Scoring system tested & live (S7)", 9, "track"], ["Course setup chuẩn Tour hằng ngày", 8, "track"], ["Rules & officials sẵn sàng", 7, "done"]] },
    T2: { obj: "Dựng & vận hành 'thành phố tạm' an toàn, đúng hạn, không sự cố hạ tầng.",
      krs: [["Overlay xong trước", "T-2 tuần", "build 50%", 70], ["Sự cố hạ tầng tuần giải", "0", "chưa tới", 0], ["MEP commissioning", "đúng hạn", "đang lắp", 40]],
      commits: [["Overlay 100% & commissioned (S8)", 9, "track"], ["Fan village + hospitality sẵn sàng", 7, "track"]] },
    T3: { obj: "World feed đạt chuẩn quốc tế, phát ổn định đi 30+ thị trường.",
      krs: [["World-feed uptime", "≥ 99.9%", "rehearsal chưa chạy", 30], ["Reach (triệu hộ)", "≥ target", "đo khi phát", 0], ["Graphics error", "< 5", "chưa tới", 0]],
      commits: [["Feed tích hợp scoring + rehearsal ×2", 9, "risk"], ["Host feed + digital distribution", 7, "track"]] },
    T4: { obj: "Phủ ≥ 50-60% chi phí bằng tài trợ; sponsor hài lòng & gia hạn.",
      krs: [["Title+presenting / chi phí", "≥ 50-60%", "đã đạt", 100], ["Sponsor NPS", "≥ 60", "đo sau giải", 0], ["Hospitality occupancy", "≥ 85%", "đang bán", 62]],
      commits: [["Title sponsor signed (S2)", 10, "done"], ["70% gói tài trợ ký (S4)", 9, "done"], ["Activation & fulfillment", 7, "track"]] },
    T5: { obj: "144 VĐV + officials đến đúng hạn, dịch vụ chuẩn tour.",
      krs: [["Visa approved", "100% trước S8", "12/160 tồn", 60], ["Player services rating", "chuẩn tour", "đo tuần giải", 0], ["Field confirmed", "100%", "chờ visa", 60]],
      commits: [["Visa batch 1+2 & field chốt", 9, "risk"], ["Logistics đón-tiễn tested", 7, "track"]] },
    T6: { obj: "Bán vé đạt target, fan experience sống động, TNV sẵn sàng.",
      krs: [["Vé sell-through", "≥ 80%", "đang bán", 60], ["Fan satisfaction", "≥ 80%", "đo tuần giải", 0], ["TNV fill-rate", "≥ 100%", "mới 52%", 52]],
      commits: [["Vé all-tier mở bán + campaign (S4-5)", 8, "done"], ["Fan village + ceremony + TNV train", 7, "track"]] },
    T7: { obj: "Không sự cố nghiêm trọng; sẵn sàng Go/No-Go xanh hoàn toàn.",
      krs: [["Incident nghiêm trọng", "0", "chưa tới", 0], ["Drill hoàn tất", "trước Go/No-Go", "đang chuẩn bị", 60], ["Accreditation phát", "100%", "chưa bắt đầu", 0]],
      commits: [["Weather/medical/security sẵn sàng", 9, "track"], ["Go/No-Go readiness (S9)", 10, "todo"]] },
    T8: { obj: "Hợp pháp 100%, permit & visa đúng hạn, tài chính kiểm soát.",
      krs: [["Permit done trước", "T-2 tuần", "batch 1 xong", 100], ["Budget variance", "≤ ±10%", "đúng kế hoạch", 100], ["Carnet / visa", "đúng hạn", "chờ hải quan", 30]],
      commits: [["12 permit + UBND approval (S3)", 10, "done"], ["Carnet + contracts 70%", 8, "pending"]] }
  };

  // ---- RACI MATRIX (quyết định/deliverable × vai trò) -------
  const raci = {
    cols: ["LPM", "PM", "RTE", "STE", "PO", "ARCH", "BO", "SS"],
    rows: [
      { d: "Ký sanctioning & license", r: { LPM: "A", PM: "R", STE: "C", BO: "C", ARCH: "I" } },
      { d: "Phê duyệt Lean Budget", r: { LPM: "A", PM: "C", BO: "C", SS: "R" } },
      { d: "Chốt title sponsor", r: { PM: "A", PO: "R", BO: "C", LPM: "I" } },
      { d: "Solution Intent (chuẩn kỹ thuật)", r: { ARCH: "A", STE: "R", PM: "C", PO: "I" } },
      { d: "PI Objectives & ưu tiên backlog", r: { PM: "A", PO: "R", RTE: "C", BO: "I" } },
      { d: "Lịch & nhịp ceremony", r: { RTE: "A", SS: "C", PO: "I" } },
      { d: "Đàm phán đối tác ngoài (Tour/đài/UBND)", r: { STE: "A", PM: "C", BO: "C", LPM: "I" } },
      { d: "Permit / visa / pháp lý", r: { SS: "R", PO: "A", STE: "C", PM: "I" } },
      { d: "Quyết định Go / No-Go", r: { LPM: "A", PM: "C", RTE: "C", BO: "C", PO: "I" } },
      { d: "Gỡ blocker xuyên team", r: { RTE: "A", PO: "R", BO: "C", PM: "I" } },
      { d: "Chấp nhận 'done' deliverable", r: { PO: "A", SS: "C", ARCH: "C" } },
      { d: "Kích hoạt contingency", r: { LPM: "A", PM: "R", BO: "C", SS: "C" } }
    ],
    legend: { R: ["Responsible", "Người thực thi"], A: ["Accountable", "Người chịu trách nhiệm cuối"], C: ["Consulted", "Tham vấn"], I: ["Informed", "Được thông báo"] }
  };

  window.GOLF_ORG = { scale, chart, roles, stakeholders, artOKR, teamOKR, raci };
  if (window.GOLF) window.GOLF.org = window.GOLF_ORG;
})();
