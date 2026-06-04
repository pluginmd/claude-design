/* ============================================================
   THƯ VIỆN TÀI NGUYÊN — hiện thực hóa SSOT
   "Mỗi loại thông tin có 1 nguồn chuẩn. Mọi file khác là copy."
   6 bộ sưu tập · quản trị phiên bản · phân quyền truy cập
   Dữ liệu mang tính cấu trúc/đại diện (như toàn hệ thống)
   ============================================================ */
(function () {
  // access: public | internal | restricted | confidential
  // st: live (cập nhật liên tục) | final | review | draft | archived
  const ACCESS = {
    public: { l: "Công khai", c: "oklch(0.74 0.13 150)" },
    internal: { l: "Nội bộ ART", c: "oklch(0.78 0.13 230)" },
    restricted: { l: "Hạn chế", c: "oklch(0.80 0.14 75)" },
    confidential: { l: "Mật", c: "oklch(0.64 0.20 25)" }
  };
  const DOCST = {
    live: { l: "Sống", c: "var(--cyan)" },
    final: { l: "Chốt", c: "oklch(0.74 0.14 150)" },
    review: { l: "Đang review", c: "oklch(0.80 0.14 75)" },
    draft: { l: "Nháp", c: "var(--ink-faint)" },
    archived: { l: "Lưu trữ", c: "oklch(0.68 0.05 280)" }
  };

  const collections = [
    {
      id: "directory", name: "Danh bạ liên lạc", icon: "☏", hue: 230,
      desc: "Ai phụ trách gì, liên hệ kênh nào, SLA phản hồi bao lâu. Nguồn chuẩn cho mọi escalation.",
      groups: [
        { g: "Ban điều hành (ART Leadership)", items: [
          { t: "Tournament Director (PM)", org: "BTC", ch: "Hotline + Radio Ch.1", sla: "Tức thời tuần giải", access: "internal", team: "—" },
          { t: "RTE — COO/Deputy TD", org: "BTC", ch: "Radio Ch.1 · Email", sla: "≤ 2h", access: "internal", team: "—" },
          { t: "STE — Deputy TD (đối ngoại)", org: "BTC", ch: "Email · Phone", sla: "≤ 4h", access: "internal", team: "—" },
          { t: "CFO", org: "BTC", ch: "Email", sla: "≤ 4h", access: "restricted", team: "T8" },
          { t: "Legal Head", org: "BTC", ch: "Email", sla: "≤ 4h", access: "restricted", team: "T8" }
        ]},
        { g: "8 Product Owner / Team Lead", items: [
          { t: "Competition Director", org: "BTC", ch: "Radio Ch.2", sla: "Tức thời", access: "internal", team: "T1" },
          { t: "Venue Director", org: "BTC", ch: "Radio Ch.3", sla: "Tức thời", access: "internal", team: "T2" },
          { t: "Broadcast Director", org: "Host broadcaster", ch: "Radio Ch.4 · Intercom", sla: "Tức thời", access: "internal", team: "T3" },
          { t: "Commercial Director", org: "BTC", ch: "Email · Phone", sla: "≤ 2h", access: "internal", team: "T4" },
          { t: "Player Services Manager", org: "BTC", ch: "Radio Ch.5", sla: "Tức thời", access: "internal", team: "T5" },
          { t: "Marketing Director", org: "BTC", ch: "Email · Phone", sla: "≤ 2h", access: "internal", team: "T6" },
          { t: "Safety Director", org: "BTC", ch: "Radio Ch.1 + Ch.6", sla: "Tức thời", access: "internal", team: "T7" },
          { t: "CFO / Legal Head", org: "BTC", ch: "Email", sla: "≤ 4h", access: "restricted", team: "T8" }
        ]},
        { g: "Đối tác chiến lược (out-bound)", items: [
          { t: "Tour Liaison / Technical Director", org: "Asian Tour / Int'l Series", ch: "STE làm cầu nối", sla: "Văn bản", access: "restricted", team: "—" },
          { t: "Host Broadcaster — OB Lead", org: "Host broadcaster", ch: "Intercom · Email", sla: "≤ 1h", access: "internal", team: "T3" },
          { t: "Course Superintendent", org: "Sân golf", ch: "Radio Ch.3 · Phone", sla: "Tức thời", access: "internal", team: "T2" },
          { t: "UBND Liaison (3-5 sở)", org: "Chính quyền tỉnh", ch: "STE · công văn", sla: "Theo lịch họp", access: "restricted", team: "T8" },
          { t: "VGA Liaison", org: "Hiệp hội Golf VN", ch: "Email · Phone", sla: "≤ 1 ngày", access: "internal", team: "T8" },
          { t: "Title Sponsor — Brand Lead", org: "Title sponsor", ch: "Account manager", sla: "≤ 24h (SLA)", access: "restricted", team: "T4" }
        ]},
        { g: "Nhà cung cấp chính", items: [
          { t: "Overlay Contractor — Site Manager", org: "Nhà thầu overlay", ch: "Radio Ch.3 · Phone", sla: "Tức thời tuần build", access: "internal", team: "T2" },
          { t: "Security Vendor — Commander", org: "Nhà thầu an ninh", ch: "Radio Ch.6", sla: "Tức thời", access: "internal", team: "T7" },
          { t: "Medical Provider — Lead", org: "Đơn vị y tế", ch: "Radio Ch.6 · Hotline", sla: "Tức thời", access: "internal", team: "T7" },
          { t: "F&B / Hospitality Caterer", org: "Nhà cung cấp F&B", ch: "Phone · Email", sla: "≤ 2h", access: "internal", team: "T2" },
          { t: "Transport / Logistics", org: "Đối tác vận tải", ch: "Radio Ch.5 · Dispatch", sla: "Tức thời", access: "internal", team: "T5" }
        ]},
        { g: "Khẩn cấp & chỉ huy", items: [
          { t: "Operations Center (xương sống)", org: "BTC", ch: "Radio all-call · Hotline", sla: "24/7 tuần giải", access: "internal", team: "—" },
          { t: "Medical Lead / Cấp cứu", org: "Y tế", ch: "Radio Ch.6 · 115", sla: "Tức thời", access: "public", team: "T7" },
          { t: "Security Command", org: "An ninh", ch: "Radio Ch.6", sla: "Tức thời", access: "internal", team: "T7" },
          { t: "Weather / Met Desk", org: "Đội khí tượng", ch: "Radio Ch.1 · Lightning alert", sla: "Cảnh báo 30/30", access: "internal", team: "T7" },
          { t: "Công an / PCCC Liaison", org: "Công an tỉnh", ch: "Đường dây nóng", sla: "Tức thời", access: "restricted", team: "T7" }
        ]}
      ]
    },
    {
      id: "documents", name: "Tài liệu & Hợp đồng", icon: "▤", hue: 280,
      desc: "Hợp đồng, giấy phép, bảo hiểm, hồ sơ pháp lý — bản gốc có hiệu lực, kiểm soát phiên bản & chữ ký.",
      items: [
        { t: "Sanctioning Agreement (License)", own: "TD / Legal", v: "v3.0", st: "final", access: "confidential", upd: "T-14 tháng", note: "Hợp đồng đăng cai với Tour — gốc pháp lý của cả giải." },
        { t: "Title Sponsor Contract", own: "Commercial · T4", v: "v2.1", st: "final", access: "confidential", upd: "Sprint 2", note: "Đã ký — chốt chặn khả thi. Kèm phụ lục quyền lợi & activation." },
        { t: "Broadcast MSA + World Feed Spec", own: "Broadcast · T3", v: "v2.0", st: "final", access: "restricted", upd: "Sprint 2", note: "Master service agreement + spec 1080p HDR, ≥18 cam." },
        { t: "Venue Contract + Agronomy Annex", own: "Venue · T2", v: "v1.4", st: "final", access: "restricted", upd: "Sprint 1", note: "Hợp đồng sân + phụ lục chuẩn agronomy của Tour." },
        { t: "12 cụm Permit (hồ sơ cấp phép)", own: "Legal · T8", v: "rolling", st: "review", access: "restricted", upd: "Sprint 4", note: "Sports event, foreign worker, build, fire safety, customs… batch 1 approved." , count: "12 cụm"},
        { t: "Bảo hiểm (3 policy)", own: "CFO · T8", v: "v1.2", st: "final", access: "restricted", upd: "Sprint 5", note: "Public liability ≥ $10M, cancellation, weather parametric." },
        { t: "Visa & Carnet ATA", own: "Player Svc · T5/T8", v: "rolling", st: "review", access: "restricted", upd: "Sprint 7", note: "Batch 1 approved; batch 2 (140-160 VĐV) đang xử lý; carnet chờ hải quan." },
        { t: "Tax Registration (FCT, PIT)", own: "CFO · T8", v: "v1.0", st: "final", access: "confidential", upd: "Sprint 3", note: "Đăng ký thuế nhà thầu nước ngoài & thu nhập cá nhân." },
        { t: "Vendor Contracts (40-60)", own: "Procurement · SS", v: "rolling", st: "review", access: "restricted", upd: "liên tục", note: "Kho hợp đồng nhà cung cấp — tracker trạng thái & thanh toán.", count: "40-60 HĐ" }
      ]
    },
    {
      id: "templates", name: "Template (Artefact sống)", icon: "▦", hue: 150,
      desc: "Bộ công cụ điều hành tái sử dụng cho 3 mùa kế tiếp. Đây là tài sản 'di sản' giá trị nhất.",
      items: [
        { t: "WBS — Work Breakdown Structure", own: "PMO", v: "v2", st: "live", access: "internal", upd: "liên tục", note: "Phân rã 500+ task. Khung gốc cho schedule & RACI." },
        { t: "Master Schedule + Critical Path", own: "RTE / PMO", v: "v2", st: "live", access: "internal", upd: "hằng tuần", note: "15-25 task trên đường găng. TD dành 70% thời gian cho chúng." },
        { t: "Interface Matrix", own: "RTE", v: "v2", st: "live", access: "internal", upd: "hằng tuần", note: "Hand-off giữa 8 team + lock time. Nền của Program Board." },
        { t: "RACI Matrix", own: "PMO", v: "v1.3", st: "final", access: "internal", upd: "Sprint 1", note: "Vai trò × quyết định/deliverable. R/A/C/I rõ ràng." },
        { t: "Risk Register (ROAM)", own: "RTE", v: "live", st: "live", access: "internal", upd: "hằng tuần", note: "Resolved/Owned/Accepted/Mitigated + ma trận khả năng×tác động." },
        { t: "Budget & Cash-Flow Model", own: "CFO", v: "v3", st: "live", access: "confidential", upd: "hằng tuần", note: "Dòng tiền theo tuần, hoà vốn 3 mùa, guardrails." },
        { t: "Staffing / Volunteer Matrix", own: "HR · T6", v: "v2", st: "live", access: "internal", upd: "liên tục", note: "Committee × ngày × ca × người. 800-1500 TNV." },
        { t: "Run-of-Show (tuần giải)", own: "RTE / Ops", v: "v1.1", st: "review", access: "internal", upd: "Sprint 8", note: "Kịch bản theo giờ 05:30 → 19:30 hot-wash." },
        { t: "Sales Pipeline Dashboard", own: "Commercial · T4", v: "live", st: "live", access: "restricted", upd: "liên tục", note: "Prospect → qualified → proposal → contract → closed-won." },
        { t: "Marketing Beat Calendar", own: "Marketing · T6", v: "v2", st: "live", access: "internal", upd: "liên tục", note: "Lịch 12 tháng: teaser → title → field → daily." },
        { t: "Decision / Commitment / Blocker Log", own: "PMO", v: "live", st: "live", access: "internal", upd: "hằng ngày", note: "Quyết định có chữ ký-ngày-người · no-revisit rule." },
        { t: "DoD Library + Vendor Master List", own: "PMO / Procurement", v: "v2", st: "live", access: "internal", upd: "liên tục", note: "Definition of Done cho từng deliverable + danh mục nhà cung cấp." }
      ]
    },
    {
      id: "knowledge", name: "Tri thức & Quy trình", icon: "◈", hue: 95,
      desc: "Năm đầu 'mua' tri thức bằng tiền và sai lầm. Nơi giữ lại để mùa sau rẻ hơn, tốt hơn.",
      items: [
        { t: "Playbook vận hành v2", own: "PMO Head", v: "v2 (đang soạn)", st: "draft", access: "internal", upd: "T+7 tuần", note: "Bản nâng cấp sau mùa 1 — tái sử dụng cho mùa 2-4." },
        { t: "Lessons-Learned repository", own: "PMO", v: "live", st: "live", access: "internal", upd: "sau mỗi Sprint", note: "Thu từ retro & I&A. Phân loại theo Functional Area." },
        { t: "SOP — Weather Protocol (30/30)", own: "Safety · T7", v: "v1.2", st: "final", access: "public", upd: "Sprint 6", note: "Quy trình an toàn sét: ngưng khi sét ≤ 30s, chờ 30' sau tiếng cuối." },
        { t: "SOP — Evacuation (3 kịch bản)", own: "Safety · T7", v: "v1.1", st: "final", access: "internal", upd: "Sprint 8", note: "Sơ tán thời tiết / an ninh / y tế. Drill trước Go/No-Go." },
        { t: "SOP — Scoring & Broadcast Integration", own: "T1 · T3", v: "v1.0", st: "review", access: "internal", upd: "Sprint 7", note: "Quy trình end-to-end scoring → world feed. Test từ Sprint 4." },
        { t: "Từ điển thuật ngữ (SAFe + Golf)", own: "PMO", v: "v1", st: "final", access: "public", upd: "Sprint 0", note: "Giải nghĩa RTE, PI, WSJF, stimpmeter, carnet… cho người mới." },
        { t: "Pre-mortem outputs (×2)", own: "RTE", v: "v2", st: "final", access: "internal", upd: "Sprint 2 & 8", note: "'Giả sử giải thất bại — 20 lý do.' Đầu vào cho risk register." },
        { t: "Onboarding & Training kit", own: "HR / PMO", v: "v1.1", st: "final", access: "internal", upd: "Sprint 0", note: "SAFe overview 4h + tài liệu vai trò + training TNV." }
      ]
    },
    {
      id: "media", name: "Hình ảnh, Media & Brand", icon: "◐", hue: 330,
      desc: "Tài sản thương hiệu & nội dung — logo, brand guideline, kho ảnh, world feed, signage. Kiểm soát bản quyền & sử dụng.",
      items: [
        { t: "Logo Kit (giải + sponsor)", own: "Marketing · T6", v: "v2", st: "final", access: "restricted", upd: "Sprint 2", note: "Bộ logo đa định dạng: giải, title, presenting, partner. Kèm clear-space rules." },
        { t: "Brand Guidelines", own: "Marketing · T6", v: "v1.3", st: "final", access: "internal", upd: "Sprint 1", note: "Màu, typography, tone, ứng dụng — chuẩn nhận diện toàn giải." },
        { t: "Photo Library (ảnh chính thức)", own: "Media · T3", v: "live", st: "live", access: "restricted", upd: "liên tục", note: "Kho ảnh photographer pool — phân quyền tải cho media & sponsor." },
        { t: "World Feed / B-roll Assets", own: "Broadcast · T3", v: "live", st: "live", access: "restricted", upd: "tuần giải", note: "Tín hiệu gốc + b-roll cho 30+ nhà đài. Digital rights theo hợp đồng." },
        { t: "Signage & Overlay Artwork", own: "Venue · T2 / T4", v: "v1.4", st: "review", access: "internal", upd: "Sprint 5", note: "250-500 hạng mục signage, bản đồ vị trí branding sponsor." },
        { t: "Content Kit (KOL / Social)", own: "Marketing · T6", v: "live", st: "live", access: "internal", upd: "liên tục", note: "Template post, hashtag, video ngắn cho 15-25 KOL & 5 kênh social." },
        { t: "Highlight Package", own: "Broadcast · T3", v: "post-event", st: "draft", access: "restricted", upd: "T+1→T+6 tuần", note: "Gói highlight phân phối sau giải — kéo dài vòng đời nội dung." },
        { t: "Trophy / Ceremony Assets", own: "Marketing · T6", v: "v1", st: "final", access: "internal", upd: "Sprint 6", note: "Cúp, backdrop, kịch bản nghi thức opening/closing." }
      ]
    },
    {
      id: "reports", name: "Báo cáo", icon: "◫", hue: 35,
      desc: "Báo cáo định kỳ & tổng kết cho từng vai trò: Steering, sponsor, chính quyền, chủ quản.",
      items: [
        { t: "Daily Status Report (tuần giải)", own: "RTE", v: "live", st: "live", access: "internal", upd: "hằng ngày 19:30", note: "Tổng hợp hot-wash: incident, KPI ngày, quyết định cho ngày mai." },
        { t: "PI Status Report (Steering)", own: "RTE / TD", v: "live", st: "live", access: "restricted", upd: "hằng tuần", note: "Predictability, blocker, ngân sách, readiness — cho Steering Committee." },
        { t: "Sponsor Wrap-up Report", own: "Commercial · T4", v: "post-event", st: "draft", access: "confidential", upd: "T+4 tuần", note: "Media value, exposure, fulfillment → quyết định gia hạn sponsor." },
        { t: "Media Value Report", own: "Broadcast · T3", v: "post-event", st: "draft", access: "restricted", upd: "T+3 tuần", note: "Reach, impressions, AVE/EMV quy đổi USD — bằng chứng ROI." },
        { t: "Financial Close Report", own: "CFO · T8", v: "post-event", st: "draft", access: "confidential", upd: "T+2→T+8 tuần", note: "Settlement, retention, thuế, chuyển prize fund, P&L cuối." },
        { t: "Inspect & Adapt Output", own: "RTE / PMO", v: "post-event", st: "draft", access: "internal", upd: "T+4 tuần", note: "System Demo + quantitative + 5-Why → backlog cải tiến mùa 2." },
        { t: "Government / Host Report", own: "STE / Legal", v: "post-event", st: "draft", access: "restricted", upd: "T+6 tuần", note: "Báo cáo UBND & chủ quản: du lịch, hình ảnh, an ninh, kinh tế." },
        { t: "Volunteer & Workforce Report", own: "HR · T6", v: "post-event", st: "draft", access: "internal", upd: "T+2 tuần", note: "Fill-rate, giờ công, ghi nhận, pipeline TNV quay lại mùa sau." }
      ]
    }
  ];

  // governance principles (SSOT)
  const governance = [
    { t: "Một nguồn chuẩn", d: "Mỗi loại thông tin có đúng 1 nguồn có hiệu lực. Mọi file khác là copy — không sửa." },
    { t: "Kiểm soát phiên bản", d: "Mọi tài liệu có version + ngày + người. Bản 'sống' cập nhật liên tục, bản 'chốt' khoá lại." },
    { t: "Phân quyền truy cập", d: "4 mức: Công khai · Nội bộ ART · Hạn chế · Mật. Cấp quyền theo vai trò, không theo cá nhân." },
    { t: "Lưu trữ & bàn giao", d: "Cuối dự án archive toàn bộ SSOT → tài sản di sản cho mùa kế tiếp." }
  ];

  window.GOLF_LIBRARY = { collections, ACCESS, DOCST, governance };
  if (window.GOLF) window.GOLF.library = window.GOLF_LIBRARY;
})();
