/* ============================================================
   THƯ VIỆN — bộ làm giàu chi tiết (dossier cấp sâu)
   Suy ra: nơi lưu · định dạng · review · lưu trữ · người đóng góp
            · lịch sử phiên bản · tài nguyên liên kết
   ============================================================ */
(function () {
  const LOC = {
    directory: "Operations Center · ma trận radio + Notion People",
    documents: "SharePoint › /Legal/Contracts (phân quyền theo vai trò)",
    templates: "Notion / Jira / Sheets — bản 'sống' của SSOT",
    knowledge: "Notion › /Knowledge Base (wiki nội bộ)",
    media: "DAM — Digital Asset Manager › /Brand & Content",
    reports: "SharePoint › /Reports + dashboard live"
  };
  const FMT = {
    directory: "Thẻ liên hệ + kênh radio/hotline",
    documents: "PDF (bản ký có hiệu lực) · DOCX (bản soạn)",
    templates: "Live doc (Notion/Sheets) · export PDF khi chốt",
    knowledge: "Notion page · PDF SOP in được tại sân",
    media: "AI/EPS/SVG/PNG · MP4/MOV · RAW/JPG",
    reports: "PDF (bản phát hành) · dashboard cập nhật live"
  };

  function reviewOf(it) {
    const u = (it.upd || "").toLowerCase();
    if (u.includes("liên tục") || u.includes("hằng")) return it.upd + " (bản sống)";
    if (it.st === "live") return "Rà soát hằng tuần tại Scrum of Scrums";
    if (it.st === "review") return "Đang review — chốt trước cột mốc liên quan";
    if (it.st === "draft") return "Đang soạn — chưa phát hành";
    if (it.st === "final") return "Khoá bản — chỉ mở lại khi có thay đổi pháp lý/kỹ thuật";
    return "Theo lịch dự án";
  }
  function retentionOf(it, col) {
    if (it.access === "confidential") return "Lưu vĩnh viễn — nghĩa vụ pháp lý & kiểm toán";
    if (col === "templates" || col === "knowledge") return "Lưu ≥ 3 mùa — tài sản di sản tái dùng";
    if (col === "media") return "Lưu theo thời hạn bản quyền (digital rights)";
    if (col === "reports") return "Lưu 3 mùa — đối chiếu xu hướng & ROI";
    if (col === "documents") return "Lưu tối thiểu 5 năm sau giải";
    return "Lưu 3 mùa";
  }
  // contributors derived from owner + sensible reviewers
  function contribOf(it, col) {
    const owner = (it.own || "").trim();
    const out = owner ? [owner + " — chủ sở hữu (Accountable)"] : [];
    const map = {
      documents: ["Legal Head — soát điều khoản", "CFO — soát tài chính", "RTE — đưa vào SSOT"],
      templates: ["PMO — chuẩn hoá mẫu", "8 PO — cập nhật dữ liệu team", "RTE — review hằng tuần"],
      knowledge: ["PMO — biên tập", "Functional Directors — đóng góp lessons", "RTE — phê duyệt"],
      media: ["Marketing/Broadcast — sản xuất", "Title sponsor — duyệt quyền lợi", "Legal — soát bản quyền"],
      reports: ["RTE — tổng hợp", "Data/PMO — số liệu", "TD — phê duyệt phát hành"]
    };
    (map[col] || []).slice(0, 2).forEach(c => out.push(c));
    return out;
  }
  // version history derived from current version + status
  function historyOf(it, col) {
    const cur = it.v || "v1";
    const upd = it.upd || "gần đây";
    const rolling = /rolling|live|post|đang/i.test(cur);
    if (rolling) {
      return [
        ["khởi tạo", "Sprint 0", "Tạo cấu trúc & template gốc"],
        ["giữa kỳ", "Sprint 3-5", "Bổ sung dữ liệu, mở rộng phạm vi"],
        [cur, upd, "Bản hiện hành — cập nhật liên tục theo tiến độ"]
      ];
    }
    const m = cur.match(/v?(\d+)\.?(\d+)?/);
    const major = m ? +m[1] : 1, minor = m ? (+m[2] || 0) : 0;
    const h = [["v1.0", "khởi tạo", "Bản đầu — phê duyệt nội bộ"]];
    if (major >= 2) h.push(["v" + major + ".0", "bản chính", "Đại tu sau review/đàm phán"]);
    h.push([cur, upd, minor ? "Tinh chỉnh & phụ lục — bản hiện hành" : "Bản hiện hành đã chốt"]);
    return h;
  }
  // linked resources (authored by title keyword) — titles must match items
  const LINK = {
    "WBS": ["Master Schedule + Critical Path", "RACI Matrix", "Interface Matrix"],
    "Master Schedule": ["WBS — Work Breakdown Structure", "Run-of-Show (tuần giải)", "Risk Register (ROAM)"],
    "Interface Matrix": ["WBS — Work Breakdown Structure", "RACI Matrix"],
    "RACI": ["WBS — Work Breakdown Structure", "Interface Matrix"],
    "Risk Register": ["Pre-mortem outputs (×2)", "PI Status Report (Steering)"],
    "Budget": ["Financial Close Report", "Sales Pipeline Dashboard"],
    "Staffing": ["Volunteer & Workforce Report", "Run-of-Show (tuần giải)"],
    "Run-of-Show": ["SOP — Weather Protocol (30/30)", "SOP — Evacuation (3 kịch bản)", "Master Schedule + Critical Path"],
    "Sales Pipeline": ["Title Sponsor Contract", "Sponsor Wrap-up Report"],
    "Sanctioning": ["Venue Contract + Agronomy Annex", "Broadcast MSA + World Feed Spec"],
    "Title Sponsor Contract": ["Sales Pipeline Dashboard", "Sponsor Wrap-up Report", "Logo Kit (giải + sponsor)"],
    "Broadcast MSA": ["World Feed / B-roll Assets", "Media Value Report", "SOP — Scoring & Broadcast Integration"],
    "Visa": ["Vendor Contracts (40-60)", "Government / Host Report"],
    "Bảo hiểm": ["SOP — Evacuation (3 kịch bản)", "Risk Register (ROAM)"],
    "Logo Kit": ["Brand Guidelines", "Signage & Overlay Artwork"],
    "Brand Guidelines": ["Logo Kit (giải + sponsor)", "Content Kit (KOL / Social)"],
    "World Feed": ["Broadcast MSA + World Feed Spec", "Highlight Package", "Media Value Report"],
    "Weather Protocol": ["SOP — Evacuation (3 kịch bản)", "Run-of-Show (tuần giải)"],
    "Lessons-Learned": ["Inspect & Adapt Output", "Playbook vận hành v2"],
    "Playbook": ["Lessons-Learned repository", "Onboarding & Training kit"],
    "Sponsor Wrap-up": ["Media Value Report", "Title Sponsor Contract"],
    "Media Value": ["World Feed / B-roll Assets", "Sponsor Wrap-up Report"],
    "Financial Close": ["Budget & Cash-Flow Model", "Tax Registration (FCT, PIT)"],
    "Inspect & Adapt": ["Lessons-Learned repository", "PI Status Report (Steering)"]
  };
  function linkedOf(it) {
    for (const k in LINK) if (it.t.includes(k)) return LINK[k];
    return [];
  }

  // CONTACT enrichment
  function contactDetail(it, group) {
    const fast = /tức thời|24\/7|≤ 1h/i.test(it.sla || "");
    const isLead = group.includes("điều hành");
    const isEmerg = group.includes("Khẩn cấp");
    const isPartner = group.includes("Đối tác");
    const isVendor = group.includes("Nhà cung cấp");
    return {
      backup: isEmerg ? "Phó chỉ huy trực ca + đầu mối dự phòng" : isLead ? "Trợ lý điều hành / Chief of Staff" : it.team !== "—" ? "Scrum Master " + it.team + " (đầu mối thay)" : "Đầu mối dự phòng được chỉ định",
      escalation: isLead ? "→ Tournament Director → Steering Committee" : isEmerg ? "→ Operations Center → Safety Director → TD" : it.team !== "—" ? "→ Scrum Master → RTE → TD" : "→ RTE → TD",
      hours: fast ? "Trực 24/7 trong tuần giải · on-call giai đoạn dàn dựng" : "Giờ hành chính + on-call khi gần cột mốc",
      loc: isEmerg ? "Operations Center (phòng điều hành)" : isLead ? "Tournament Office / Operations Center" : isPartner ? "Văn phòng đối tác · liên lạc qua STE" : isVendor ? "Site compound / khu thi công" : "Khu chức năng tại sân"
    };
  }

  function detailFor(it, col, group) {
    if (it.kind === "contact" || group) return { contact: true, ...contactDetail(it, group || "") };
    return {
      loc: LOC[col] || "SSOT trung tâm",
      fmt: FMT[col] || "—",
      review: reviewOf(it),
      retention: retentionOf(it, col),
      contrib: contribOf(it, col),
      history: historyOf(it, col),
      linked: linkedOf(it)
    };
  }

  // find an item by exact title across all collections (for linked nav)
  function findByTitle(title) {
    const cols = (window.GOLF_LIBRARY || {}).collections || [];
    for (const c of cols) {
      if (c.id === "directory") continue;
      const hit = c.items.find(x => x.t === title);
      if (hit) return { item: { ...hit, col: c.id, kind: "doc" } };
    }
    return null;
  }

  if (window.GOLF_LIBRARY) {
    window.GOLF_LIBRARY.detailFor = detailFor;
    window.GOLF_LIBRARY.findByTitle = findByTitle;
  }
})();
