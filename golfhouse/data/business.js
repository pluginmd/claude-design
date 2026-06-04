/* ============================================================
   MÔ HÌNH ĐIỀU HÀNH NHƯ MỘT DOANH NGHIỆP
   12 khung giá trị (business value frameworks)
   Mỗi khung = một "phòng ban / capability" của doanh nghiệp giải golf
   ============================================================ */
(function () {
  const business = [
    {
      id: "BIZ1", name: "Khách hàng & Phân khúc thị trường", short: "Customer", icon: "◑", hue: 210,
      owner: "Tournament Director", safe: "Xuyên suốt 4 Value Stream",
      tagline: "Một giải golf là thị trường NHIỀU PHÍA — mỗi nhóm khách hàng có 'sản phẩm' và nhu cầu riêng, đôi khi xung đột.",
      objective: "Hiểu và phục vụ đồng thời 6 nhóm khách hàng với kỳ vọng khác nhau, cân bằng khi lợi ích xung đột (vd: broadcast cần khung giờ vàng vs VĐV cần điều kiện thi đấu tốt).",
      stakeholders: [
        { name: "VĐV & Tour", need: "Điều kiện thi đấu chuẩn, prize fund, dịch vụ chuyên nghiệp, giữ license" },
        { name: "Rights holder / Đài", need: "World feed ổn định, nội dung hấp dẫn, khung giờ tốt" },
        { name: "Nhà tài trợ", need: "Media value, hospitality, kích hoạt thương hiệu, ROI đo được" },
        { name: "Khán giả / Fan", need: "Trải nghiệm tại sân, tiếp cận ngôi sao, tiện ích, giá vé hợp lý" },
        { name: "Chính quyền / UBND", need: "Hình ảnh điểm đến, du lịch, an ninh trật tự, hợp pháp" },
        { name: "Cộng đồng golf VN", need: "Cảm hứng, sân chơi nhí, nâng tầm môn thể thao" }
      ],
      valueProps: ["Mỗi phân khúc có một 'value proposition' riêng được thiết kế chủ đích", "Phân biệt khách hàng (trả tiền) vs người dùng (xem) — sponsor trả tiền, fan tạo media value"],
      capabilities: ["Customer journey mapping cho từng phân khúc", "Phân tầng dịch vụ (VĐV / VIP / GA)", "Voice-of-customer: NPS sau giải cho từng nhóm"],
      levers: ["Tối ưu trải nghiệm nhóm tạo media value cao nhất (fan + broadcast)", "Giữ VĐV & Tour hài lòng = giữ license = sống còn", "Upsell hospitality cho sponsor & doanh nghiệp"],
      kpis: [["Player NPS", "≥ 70"], ["Sponsor NPS", "≥ 60"], ["Fan satisfaction", "≥ 80%"], ["License retention", "Giữ được"]],
      risks: ["Tối ưu một nhóm làm hỏng nhóm khác (broadcast ép giờ → VĐV phản đối)", "Bỏ quên 'khách hàng thầm lặng' là chính quyền"]
    },
    {
      id: "BIZ2", name: "Đối tác & Hệ sinh thái nhà cung cấp", short: "Partners", icon: "⇄", hue: 165,
      owner: "Deputy TD (STE)", safe: "Large Solution Train",
      tagline: "Giải không tự làm mọi thứ — nó là một mạng lưới 40-60 đối tác, mỗi đối tác là một mắt xích phụ thuộc.",
      objective: "Xây và điều phối hệ sinh thái đối tác: chiến lược (Tour, đài, chính quyền) và vận hành (overlay, an ninh, F&B, logistics) — giữ trong nhà việc tạo lợi thế, outsource phần còn lại.",
      stakeholders: [
        { name: "Đối tác chiến lược", need: "Tour, Host Broadcaster, Chủ sân, UBND — quyết 'solution', không ra lệnh được" },
        { name: "Nhà thầu chính", need: "Overlay, an ninh, công nghệ — hợp đồng rõ DoD & SLA" },
        { name: "Nhà cung cấp dịch vụ", need: "F&B, vận tải, in ấn, y tế — quản theo vendor master list" }
      ],
      valueProps: ["Mỗi đối tác có interface rõ ràng (cái gì, khi nào, ai ký)", "Make-or-buy: giữ Tour-relations & điều phối, mua năng lực thực thi"],
      capabilities: ["Procurement & tender (40-60 hợp đồng)", "Interface matrix & lock time giữa các bên", "Vendor performance & SLA tracking", "Partner portal với CRM có SLA phản hồi"],
      levers: ["Đàm phán gói VIK (value-in-kind) để giảm chi tiền mặt", "Khoá đối tác tốt nhiều mùa để giảm rủi ro & giá", "Chuẩn hoá interface để giảm lỗi hand-off"],
      kpis: [["Hợp đồng ký đúng hạn", "100% trước T-2"], ["Vendor on-time delivery", "≥ 95%"], ["Tỷ lệ VIK / tổng", "tối đa hoá"]],
      risks: ["Phụ thuộc một nhà cung cấp độc quyền không backup", "Interface không khoá → chuỗi trễ lan (MEP → broadcast)"]
    },
    {
      id: "BIZ3", name: "Doanh thu & Mô hình thương mại", short: "Revenue", icon: "$", hue: 95,
      owner: "Commercial Director", safe: "VS3 · Commercial Product",
      tagline: "5-7 dòng doanh thu, mỗi dòng có tháp giá & độc quyền riêng — title sponsor là chốt chặn khả thi.",
      objective: "Tối đa hoá & đa dạng hoá doanh thu để phủ 7.5-12M chi phí; title + presenting phải phủ 50-60% trước khi khởi động.",
      stakeholders: [
        { name: "Title / Presenting sponsor", need: "Độc quyền ngành, branding world feed, hospitality lớn" },
        { name: "Official partners / suppliers", need: "Quyền lợi theo tier, kích hoạt, VIK" },
        { name: "Hospitality & Pro-am buyers", need: "Trải nghiệm cao cấp, networking, gặp pro" },
        { name: "Khán giả & F&B", need: "Vé hợp lý, dịch vụ tại sân, merchandise" }
      ],
      valueProps: ["Tháp tài trợ 4 tầng: Title → Presenting → Official Partner → Supplier (VIK)", "Bán 'media value + access' chứ không bán logo"],
      capabilities: ["Sales pipeline kiểu SaaS (prospect → closed-won)", "Pricing & packaging theo tier", "Sponsor servicing & fulfillment report", "Yield management cho vé & hospitality"],
      levers: ["Title sponsor phủ ~50-60% chi phí — ưu tiên số 1", "Hospitality & pro-am: biên lợi nhuận cao nhất", "Multi-year deal để ổn định doanh thu nền"],
      kpis: [["Doanh thu vs target", "≥ 100%"], ["Title+presenting / chi phí", "≥ 50-60%"], ["Hospitality occupancy", "≥ 85%"], ["Vé sell-through", "≥ 80%"]],
      risks: ["Không có title sponsor cam kết → KHÔNG khởi động", "Phụ thuộc 1 sponsor quá lớn (concentration risk)", "Ép giá vé/hospitality bất hợp lý để 'có lãi năm 1'"]
    },
    {
      id: "BIZ4", name: "Truyền thông, Nội dung & Thương hiệu", short: "Media & Brand", icon: "◉", hue: 285,
      owner: "Broadcast & Marketing Director", safe: "VS2 · Broadcast Product",
      tagline: "World feed là 'sản phẩm thật' tạo media value. Thương hiệu giải là tài sản tích luỹ qua nhiều mùa.",
      objective: "Sản xuất & phân phối nội dung đạt chuẩn quốc tế tới 30+ thị trường; xây thương hiệu giải & định vị điểm đến VN; biến mỗi khoảnh khắc thành nội dung.",
      stakeholders: [
        { name: "Host broadcaster & nhà đài", need: "World feed 1080p HDR, đồ hoạ, ball tracer, uptime" },
        { name: "Báo chí & KOL", need: "Media center, mixed zone, content kit, access" },
        { name: "Khán giả số", need: "Livestream, social, highlight, app trải nghiệm" },
        { name: "Sponsor", need: "Brand exposure đo được trong nội dung" }
      ],
      valueProps: ["World feed = sản phẩm phân phối đi 30+ thị trường", "Câu chuyện điểm đến VN lồng vào nội dung (soft power)"],
      capabilities: ["Sản xuất broadcast (16-18 cam, OB, ball tracer)", "Beat calendar marketing 12 tháng (teaser → field → daily)", "Social & KOL program (15-25 influencer, 5 kênh)", "PR & media value measurement"],
      levers: ["Reach & impressions = giá trị bán cho sponsor mùa sau", "Nội dung junior/CSR vừa làm đẹp vừa lên world feed", "Highlight package kéo dài vòng đời nội dung 4-6 tuần sau giải"],
      kpis: [["World-feed uptime", "≥ 99.9%"], ["Reach (triệu hộ)", "≥ target"], ["Social impressions", "≥ target"], ["Media value (USD eq.)", "đo & báo cáo"]],
      risks: ["Sự cố phát sóng giờ vàng = thảm hoạ thương hiệu", "Nội dung nhạt → sponsor không gia hạn", "Khủng hoảng truyền thông không có kịch bản"]
    },
    {
      id: "BIZ5", name: "Nhân sự, Tổ chức & Tình nguyện viên", short: "People & Org", icon: "◷", hue: 35,
      owner: "HR Lead + PMO", safe: "ART + Shared Services",
      tagline: "~90 người core + 800-1500 TNV. Quy mô doanh nghiệp bùng nổ trong 10 tuần rồi giải thể.",
      objective: "Lên đúng người đúng vai trò đúng lúc; cross-train để mọi vị trí critical có backup; tuyển-huấn luyện-phân ca 800-1500 TNV; tránh kiệt sức giai đoạn cao điểm.",
      stakeholders: [
        { name: "Core ART (~90)", need: "Vai trò rõ, RACI, không quá tải, có backup" },
        { name: "Tình nguyện viên (800-1500)", need: "Tuyển, đào tạo, đồng phục, phân ca, ghi nhận" },
        { name: "Nhà thầu thời vụ", need: "Onboarding, accreditation, an toàn lao động" }
      ],
      valueProps: ["Mô hình 'two-pizza team' tự tổ chức", "TNV là lực lượng vận hành chính & đại sứ hình ảnh"],
      capabilities: ["Staffing matrix (committee × ngày × ca × người)", "Recruit & training pipeline cho TNV", "Cross-training & backup cho vị trí critical", "Per-diem payroll & accreditation"],
      levers: ["Cross-training giảm rủi ro 'bus factor = 1'", "TNV giỏi quay lại mùa sau = giảm chi phí đào tạo", "Pre-mortem & wellbeing tránh burnout tuần cao điểm"],
      kpis: [["Vị trí critical có backup", "100%"], ["TNV fill-rate", "≥ 100% nhu cầu"], ["Roster filled trước S0", "≥ 80%"], ["Sự cố do thiếu người", "0"]],
      risks: ["Quá tải & kiệt sức giai đoạn dàn dựng", "Vị trí critical không có người thay (medical lead, RTE)", "TNV thiếu/đến muộn ngày thi đấu"]
    },
    {
      id: "BIZ6", name: "Tài chính, Ngân sách & Kiểm soát", short: "Finance", icon: "▦", hue: 145,
      owner: "CFO", safe: "LPM · Lean Budget",
      tagline: "Lean Budget theo Value Stream + guardrails. Dòng tiền và contingency là 'oxy' của giải.",
      objective: "Quản ngân sách 7.5-12M theo guardrails, kiểm soát dòng tiền, FX cho prize fund, thuế (FCT/PIT), và giải ngân contingency có kỷ luật.",
      stakeholders: [
        { name: "Steering Committee", need: "Predictability tài chính, budget variance trong ngưỡng" },
        { name: "Value Stream owners", need: "Ngân sách linh hoạt trong guardrail 5%" },
        { name: "Nhà cung cấp & VĐV", need: "Thanh toán đúng hạn, prize fund chuyển hợp pháp" }
      ],
      valueProps: ["Lean Budget: cấp tiền theo Value Stream, không theo dự án cứng", "Guardrails: dịch >5% giữa VS cần LPM duyệt; >50k cần 2 chữ ký"],
      capabilities: ["Budget & cash-flow model theo tuần", "FX hedge cho prize fund (ngoại tệ)", "Tax registration & compliance (FCT, PIT)", "Contingency unlock theo đợt 25% có văn bản"],
      levers: ["Contingency 30% buffer cho hạng mục rủi ro", "VIK giảm chi tiền mặt", "Settlement giữ retention 5-10% nhà thầu"],
      kpis: [["Budget variance", "≤ ±10%"], ["Breakeven", "năm 2-3"], ["Lỗ năm 1", "≤ 15-25%"], ["Chi > 50k có 2 chữ ký", "100%"]],
      risks: ["Cạn dòng tiền giai đoạn dàn dựng (chi trước, thu sau)", "FX biến động ảnh hưởng prize fund", "Tiêu hết contingency quá sớm"]
    },
    {
      id: "BIZ7", name: "Vận hành, Logistics & Hạ tầng", short: "Operations", icon: "⚙", hue: 230,
      owner: "COO / Venue Director", safe: "VS1 + OPS · T2",
      tagline: "Biến một sân golf thành một 'thành phố tạm' vận hành 4 ngày liên tục, rồi tháo dỡ sạch.",
      objective: "Dựng & vận hành overlay (khán đài, media center, hospitality, fan village), MEP (điện 1-2MW, nước, wifi 5000 user), logistics, F&B, vệ sinh, Operations Center.",
      stakeholders: [
        { name: "Toàn bộ chức năng tại sân", need: "Hạ tầng điện-nước-mạng, mặt bằng, lối đi" },
        { name: "Khán giả & VĐV", need: "Toilet, F&B, di chuyển, chỗ ngồi, an toàn" },
        { name: "Broadcast & sponsor", need: "Vị trí camera, signage zone, hospitality" }
      ],
      valueProps: ["Overlay = nhà máy sản xuất trải nghiệm tạm thời", "Operations Center & radio = hệ thần kinh tuần giải"],
      capabilities: ["Overlay build-up & teardown", "MEP & utilities (điện 1-2MW, wifi 5000)", "Transport, parking, F&B, sanitation", "Operations Center & run-of-show hằng ngày"],
      levers: ["Fast-track cấp nguồn khu camera (đường găng)", "Buffer 30% ngân sách overlay", "Test event để phát hiện lỗi vận hành sớm"],
      kpis: [["Overlay xong trước", "T-2 tuần"], ["Sự cố hạ tầng tuần giải", "0"], ["MEP commissioning", "đúng hạn"], ["Crowd flow", "không tắc"]],
      risks: ["MEP trễ → trễ cả chuỗi broadcast (đường găng)", "Không occupancy permit → không vận hành", "Thời tiết phá overlay/lịch dàn dựng"]
    },
    {
      id: "BIZ8", name: "Công nghệ, Dữ liệu & Số hoá", short: "Technology", icon: "▣", hue: 255,
      owner: "CTO / Tech Lead", safe: "OPS · E11 · System Team",
      tagline: "Scoring real-time, ticketing, app, CRM, accreditation, an ninh mạng — nền tảng số của giải.",
      objective: "Vận hành tech stack tin cậy: scoring chuẩn Tour, vé điện tử, app khán giả, CRM/partner portal, accreditation 5000+ thẻ, tuân thủ luật dữ liệu cá nhân VN.",
      stakeholders: [
        { name: "Competition & Broadcast", need: "Scoring real-time chính xác, feed tích hợp" },
        { name: "Khán giả & sponsor", need: "Vé điện tử, app, partner portal mượt" },
        { name: "An ninh & BTC", need: "Accreditation, kiểm soát truy cập, an ninh mạng" }
      ],
      valueProps: ["Scoring uptime 99.9% — sự cố = mất uy tín với Tour", "Dữ liệu khán giả/sponsor = tài sản cho mùa sau"],
      capabilities: ["Scoring system test từ Sprint 4 (shift-left)", "Ticketing & app platform", "CRM / partner portal có SLA", "Accreditation & cybersecurity (PDPD VN)"],
      levers: ["Test sớm & continuous integration giảm rủi ro ngày giải", "Dữ liệu first-party để bán & cá nhân hoá", "Tự động hoá accreditation gắn với visa"],
      kpis: [["Scoring uptime", "≥ 99.9%"], ["Ticketing checkout success", "≥ 99%"], ["Sự cố bảo mật", "0"], ["Accreditation phát đúng hạn", "100%"]],
      risks: ["Sự cố scoring/feed ngày thi đấu", "Rò rỉ dữ liệu cá nhân (vi phạm luật VN)", "Tích hợp scoring-broadcast lỗi"]
    },
    {
      id: "BIZ9", name: "Trải nghiệm & Dịch vụ khách hàng", short: "Experience", icon: "❋", hue: 330,
      owner: "Marketing + Player Services", safe: "VS1 + VS3",
      tagline: "Mọi điểm chạm — từ VĐV check-in tới fan mua vé — là một 'khoảnh khắc sự thật' định hình thương hiệu.",
      objective: "Thiết kế & vận hành trải nghiệm xuất sắc cho từng phân khúc: player services chuẩn tour, hospitality cao cấp, fan village sống động, ceremony & cultural program.",
      stakeholders: [
        { name: "VĐV & đoàn", need: "Locker, lounge, range, transport, gift, family lounge" },
        { name: "VIP & hospitality", need: "Chalet, suite, gala, pro-am, networking" },
        { name: "Fan", need: "Fan village, autograph, kids zone, F&B, check-in" }
      ],
      valueProps: ["Phân tầng trải nghiệm rõ ràng theo giá trị khách hàng", "Cultural & destination program = soft power VN"],
      capabilities: ["Player services desk & journey", "Hospitality & pro-am operations", "Fan village & opening/closing ceremony", "Service design & complaint handling"],
      levers: ["VĐV hài lòng → quay lại & nói tốt → giữ field chất lượng", "Trải nghiệm hospitality cao cấp → upsell & gia hạn sponsor", "Fan experience → vé & media value mùa sau"],
      kpis: [["Player services rating", "chuẩn tour"], ["Hospitality NPS", "≥ 60"], ["Fan satisfaction", "≥ 80%"], ["Complaint resolution", "< 24h"]],
      risks: ["Một sự cố dịch vụ VĐV lan truyền xấu", "Fan village vắng/nhạt → trải nghiệm kém", "Ceremony lỗi nghi thức ngoại giao"]
    },
    {
      id: "BIZ10", name: "Rủi ro, An toàn, Pháp lý & Tuân thủ", short: "Risk & Legal", icon: "⚠", hue: 25,
      owner: "Safety Director + Legal Head", safe: "OPS · T7 + T8",
      tagline: "Khối rủi ro-thời gian lớn nhất ở VN. An toàn & pháp lý là điều kiện 'được phép tồn tại'.",
      objective: "Quản toàn diện rủi ro (ROAM), an ninh-y tế-PCCC, weather protocol (golf cực nhạy với sét), 12 cụm permit, visa, thuế, bảo hiểm, ứng phó khủng hoảng.",
      stakeholders: [
        { name: "Cơ quan quản lý", need: "Tuân thủ 12 cụm permit, thuế, lao động, an ninh" },
        { name: "VĐV, khán giả, nhân sự", need: "An toàn tính mạng, y tế, sơ tán, weather" },
        { name: "Chủ đầu tư & bảo hiểm", need: "Risk register, insurance, cancellation cover" }
      ],
      valueProps: ["Risk Register ROAM sống, review hằng tuần", "Weather/lightning protocol bắt buộc (quy trình 30/30)"],
      capabilities: ["Permit stack (12 cụm) & visa & carnet", "An ninh (phối hợp công an) & accreditation", "Y tế, AED, evacuation 3 kịch bản, weather", "Insurance (public liability ≥10M, cancellation, parametric)"],
      levers: ["Buffer 30% thời gian cho pháp lý-cấp phép", "Pre-mortem ×2 phát hiện rủi ro trước", "Parametric weather insurance chuyển rủi ro"],
      kpis: [["Permit done trước", "T-2 tuần"], ["Incident tuần giải", "0 nghiêm trọng"], ["Insurance valid", "100% hạng mục"], ["Drill hoàn tất", "trước Go/No-Go"]],
      risks: ["Permit/visa trễ = huỷ hoặc hoãn giải", "Sét/thời tiết cực đoan không có protocol", "Sự cố an ninh/y tế không kịp ứng phó"]
    },
    {
      id: "BIZ11", name: "Quan hệ Chính phủ & Đối ngoại", short: "Gov & External", icon: "⌂", hue: 300,
      owner: "Deputy TD + Legal Head", safe: "VS4 · T8 + Large Solution",
      tagline: "Ở VN, quan hệ chính quyền là 'giấy phép tồn tại' và cũng là tài sản chiến lược dài hạn.",
      objective: "Xây & duy trì quan hệ với UBND tỉnh, các sở ngành, VGA, Tour; bảo vệ ART khỏi nhiễu chính trị; biến goodwill thành năng lực đăng cai bền vững.",
      stakeholders: [
        { name: "UBND & sở ngành (3-5)", need: "Chủ trương, hình ảnh tỉnh, du lịch, an ninh, hợp pháp" },
        { name: "VGA & Tour", need: "Đăng cai đúng chuẩn, quan hệ bền vững" },
        { name: "Đối ngoại & ngoại giao", need: "Welcome reception, cultural program, protocol" }
      ],
      valueProps: ["Government goodwill = điều kiện cần & tài sản chiến lược", "Quan hệ Tour bền vững = giữ & nâng cấp license"],
      capabilities: ["UBND liaison (3-5 sở) & VGA liaison", "Quản lý chủ trương & permit ở cấp chính sách", "Protocol & ngoại giao (reception, summit)", "Bảo vệ ART khỏi can thiệp ngoài quy trình"],
      levers: ["Định vị giải là dự án du lịch-kinh tế của tỉnh", "Junior program & legacy tạo thiện cảm chính sách", "Tourism summit gắn lợi ích địa phương"],
      kpis: [["Government goodwill", "tích cực (định tính)"], ["Chủ trương & permit", "đúng hạn"], ["Quan hệ Tour", "giữ/nâng license"], ["Vị thế điểm đến", "tăng"]],
      risks: ["Quan hệ cá nhân vượt quy trình làm hỏng kỷ luật vận hành", "Thay đổi nhân sự/chính sách giữa chừng", "Kỳ vọng chính quyền vượt nguồn lực giải"]
    },
    {
      id: "BIZ12", name: "Bền vững, Di sản & Phát triển dài hạn", short: "Legacy", icon: "♺", hue: 150,
      owner: "Tournament Director + PMO Head", safe: "VS4 · Strategic Asset · E10/E12",
      tagline: "Năm đầu 'mua' tri thức bằng tiền và sai lầm. Giá trị thật là tài sản tích luỹ cho 3 mùa kế tiếp.",
      objective: "Biến mỗi mùa thành tài sản: playbook tái sử dụng, pipeline tài năng nhí, brand equity, media value, quan hệ — để mùa sau rẻ hơn, tốt hơn, có lãi.",
      stakeholders: [
        { name: "Chủ đầu tư", need: "ROI dài hạn, breakeven năm 2-3, tài sản tái dùng" },
        { name: "Cộng đồng golf VN", need: "Junior pipeline, cảm hứng, nâng tầm môn thể thao" },
        { name: "Mùa giải kế tiếp", need: "Playbook v2, decision log, lessons-learned" }
      ],
      valueProps: ["Knowledge capture: decision log + template library", "Junior development = đòn bẩy strategic & CSR"],
      capabilities: ["Inspect & Adapt (8 tuần đóng dự án)", "Playbook v2 & SSOT archive", "Junior program (qualifier → clinic với pro)", "Brand equity & media value measurement"],
      levers: ["Playbook tái dùng giảm chi phí & rủi ro mùa sau", "Junior pipeline xây cộng đồng & thiện cảm chính sách", "Multi-year sponsor & venue deals ổn định nền tảng"],
      kpis: [["Brand equity", "survey trước/sau tăng"], ["Junior pipeline", "số tài năng nuôi dưỡng"], ["Playbook tái dùng", "v2 hoàn chỉnh"], ["Breakeven", "năm 2-3"]],
      risks: ["Coi giải là sự kiện một lần → mất toàn bộ tri thức", "Không đo lường → không chứng minh được ROI dài hạn", "Bỏ junior/legacy để cắt chi phí ngắn hạn"]
    }
  ];

  window.GOLF_BUSINESS = business;
  if (window.GOLF) window.GOLF.business = business;
})();
