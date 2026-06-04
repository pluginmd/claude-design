/* ============================================================
   CEO COCKPIT — tổng hợp điều hành cấp cao
   Hợp nhất Tài chính (VLF2026) × Vận hành (SAFe) × Tổ chức × Rủi ro
   + Phân tích khoảng trống (góc nhìn chuyên gia tổ chức giải)
   ============================================================ */
(function () {
  // Verdict tổng — đánh giá khả thi
  const verdict = {
    rating: "KHẢ THI — BIÊN MỎNG",
    rag: "amber",
    headline: "Giải có thể tổ chức và hoà vốn (+2,5 tỷ ở Base Case), nhưng kết quả treo trên hai chốt: chốt được Title Sponsor sớm và thu xếp vốn lưu động cho cú chi prize fund tại T-1.",
    asOf: "Sprint 6 · T-5 tuần · kịch bản Base Case",
    drivers: [
      "Coverage chỉ 1,05× — hoà vốn cần doanh thu đạt ≥ 95,2%",
      "Title + 3 tier tài trợ = 85% doanh thu → rủi ro tập trung cao",
      "Đỉnh vốn lưu động 2,94 tỷ; đáy âm 2,65 tỷ tại tuần sự kiện",
      "Tổng giá trị (DT + media 18 tỷ) = 70,5 tỷ = 1,41× chi phí — bức tranh chiến lược tích cực"
    ]
  };

  // 6 chiều sức khỏe điều hành
  const health = [
    { dim: "Tài chính", rag: "amber", metric: "Coverage 1,05× · Net +2,5 tỷ", detail: "Hoà vốn mỏng; phụ thuộc đạt target doanh thu. Breakeven 95,2%.", tab: "finance" },
    { dim: "Dòng tiền & Vốn", rag: "amber", metric: "Peak WC 2,94 tỷ · facility 3,2 tỷ", detail: "Cú chi prize 14,3 tỷ tại T-1 tạo đáy âm — bắt buộc có hạn mức vốn lưu động.", tab: "finance" },
    { dim: "Thương mại", rag: "amber", metric: "Title commit 70% · pipeline 3×", detail: "Tập trung vào Title Sponsor. Cần anchor sớm + đa dạng hoá nguồn thu.", tab: "finance" },
    { dim: "Sẵn sàng vận hành", rag: "red", metric: "Predictability 82% · 1 hạng mục tắc", detail: "Scoring/Broadcast đang nghẽn; visa cluster at-risk. Go/No-Go chưa xanh hết.", tab: "mission" },
    { dim: "Chiến lược & Di sản", rag: "green", metric: "Giá trị 70,5 tỷ · upside 2027: 10,5 tỷ", detail: "Quan hệ Tour, nation branding, media value, gia hạn năm 2 — nền tảng dài hạn tốt.", tab: "playbook" },
    { dim: "Rủi ro", rag: "amber", metric: "2 rủi ro Cao đang mở", detail: "Dòng tiền lệch pha (Cao) & sponsorship dưới mục tiêu (Cao) là hai mối lo lớn nhất.", tab: "finance" }
  ];

  // 3 câu hỏi lớn của CEO
  const questions = [
    { q: "Có hoà vốn / có lãi không?", a: "Base Case +2,5 tỷ (ROI 5%). Conservative hoà vốn đúng 0. Aggressive +7 tỷ. Biên mỏng — breakeven khi DT ≥ 95,2%.", rag: "amber", link: ["finance", null] },
    { q: "Có kịp sẵn sàng không?", a: "Predictability 82%, nhưng Scoring/Broadcast đang tắc và 12 visa tồn. 5 hạng mục Go/No-Go chưa xanh hoàn toàn. Cần xử lý nghẽn trong 5 tuần.", rag: "red", link: ["mission", null] },
    { q: "Có giữ được license & quan hệ Tour không?", a: "Tour Rights đã trả (sunk 2,6 tỷ), prize fund chia sẻ với đối tác, giải đúng chuẩn Legends. Quan hệ Tour & nền tảng năm 2 là tài sản chiến lược lớn nhất.", rag: "green", link: ["playbook", { type: "biz", id: "BIZ11" }] }
  ];

  // Quyết định cần CEO xử lý (decision cockpit)
  const decisions = [
    { d: "Chốt kịch bản ngân sách (lock Base Case 50 tỷ)", why: "Mọi authorization chi tiêu phụ thuộc kịch bản đã khoá.", urgency: "now", owner: "CEO + CFO" },
    { d: "Phê duyệt hạn mức vốn lưu động 3,2 tỷ", why: "Phủ đáy dòng tiền âm tại T-1 (prize fund 14,3 tỷ).", urgency: "now", owner: "CEO + Bank" },
    { d: "Anchor Title Sponsor (ký sớm)", why: "Then chốt khả thi — 35% doanh thu. Không ký → không khởi động pha sau.", urgency: "now", owner: "CEO + Commercial" },
    { d: "Duyệt HĐ chia sẻ prize fund + FX buffer", why: "Đối tác 450k + GH 550k USD; phần USD còn lại chịu rủi ro tỷ giá.", urgency: "soon", owner: "CEO + CFO + Legal" },
    { d: "Chính sách giải ngân contingency (theo đợt 25%)", why: "Tránh tiêu hết dự phòng sớm; mở khoá có văn bản.", urgency: "soon", owner: "Steering" },
    { d: "Ownership cổng Go/No-Go (Sprint 9)", why: "5 hạng mục bắt buộc xanh; ai ký quyết định khai mạc.", urgency: "scheduled", owner: "CEO + RTE" }
  ];

  // Giá trị chiến lược ngoài P&L
  const strategicValue = [
    { k: "Doanh thu trực tiếp", v: "52,5 tỷ", note: "Tài trợ + thương mại (Base Case)" },
    { k: "Media value", v: "18,0 tỷ", note: "Quy đổi exposure world-feed + digital" },
    { k: "Tổng giá trị", v: "70,5 tỷ", note: "= 1,41× chi phí — bức tranh thật sự" },
    { k: "Upside gia hạn 2027", v: "10,5 tỷ", note: "Năm 2 rẻ hơn nhờ playbook & quan hệ" },
    { k: "Nation branding", v: "Định tính", note: "Xúc tiến đầu tư · du lịch cao cấp · hệ sinh thái golf" },
    { k: "License & quan hệ Tour", v: "Nền tảng", note: "IP thường niên — tài sản chiến lược lớn nhất" }
  ];

  // Giả định then chốt mà cả mô hình dựa vào
  const assumptions = [
    { a: "Tỷ giá USD/VND = 26.000", risk: "FX phần USD chưa trả (prize 550k + media 75k) biến động" },
    { a: "Title Sponsor commit 70%, ký trước Pha 3", risk: "Trượt → toàn bộ kế hoạch doanh thu lung lay" },
    { a: "Prize fund chia sẻ: đối tác 450k + GH 550k USD", risk: "Đối tác rút phần chia → GH gánh thêm 11,7 tỷ" },
    { a: "Pipeline tài trợ ≥ 3× target", risk: "Tỷ lệ chốt thực tế thấp hơn commit% giả định" },
    { a: "Sân golf in-kind (6 ngày miễn phí)", risk: "Nếu phải trả phí thuê sân → đội chi phí Golf Ops" },
    { a: "Coverage doanh thu 1,05× (Base)", risk: "Chỉ cần lệch 5% doanh thu là về hoà vốn 0" }
  ];

  // PHÂN TÍCH KHOẢNG TRỐNG — góc nhìn chuyên gia tổ chức giải
  // Những mảnh ghép mô hình tài chính/hệ thống CHƯA bao phủ
  const gaps = [
    { area: "Doanh thu", sev: "high", gap: "Thiếu dòng vé khán giả đại chúng & F&B/merchandise",
      detail: "Revenue model chỉ có tài trợ + VIP/Pro-Am/Booth. Một festival công chúng cần ticketing phổ thông, F&B concession, bán lẻ — dòng thu biên cao và giảm phụ thuộc sponsor.",
      rec: "Thêm 2-3 dòng: vé GA theo ngày, F&B revenue-share, merchandise. Có thể bù 3-8% doanh thu & hạ rủi ro tập trung." },
    { area: "Doanh thu", sev: "high", gap: "Rủi ro tập trung Title Sponsor (35% DT, top-4 tier = 85%)",
      detail: "Nếu Title hoặc 1 Diamond rút, doanh thu sụt mạnh xuống dưới breakeven 95,2%.",
      rec: "Anchor Title sớm có điều khoản phạt; chia nhỏ gói; xây tầng Official/Supplier rộng hơn để phân tán." },
    { area: "Tài chính", sev: "med", gap: "Chưa tính chi phí lãi vay vốn lưu động",
      detail: "Facility 3,2 tỷ có cost of capital (lãi vay) chưa phản ánh vào P&L — bào mòn phần net 2,5 tỷ vốn đã mỏng.",
      rec: "Đưa lãi vay facility (vài trăm triệu) vào chi phí tài chính; tái kiểm net thực." },
    { area: "Rủi ro", sev: "high", gap: "Chưa có kịch bản huỷ/hoãn do thời tiết",
      detail: "Golf cực nhạy với mưa bão/sét; tháng 8 VN mùa mưa. Mô hình không có downside cancellation — cú sốc lớn nhất.",
      rec: "Mua weather/cancellation parametric insurance; dựng kịch bản 'rút gọn 3 vòng' & sizing tổn thất." },
    { area: "Tài chính", sev: "med", gap: "Thuế & settlement sau sự kiện chưa chi tiết hoá",
      detail: "FCT/PIT cho phần nước ngoài, chuyển prize fund ra nước ngoài, retention nhà thầu 5-10% — ảnh hưởng dòng tiền T+1→T+8.",
      rec: "Lập lịch settlement & nghĩa vụ thuế chi tiết; giữ retention; dự trù FX khi chuyển prize." },
    { area: "Vận hành", sev: "high", gap: "Permit & visa roadmap chưa gắn vào tài chính",
      detail: "Đây là critical path ở VN; mô hình giả định trơn tru. Trễ permit = trễ build = đội chi phí & rủi ro huỷ.",
      rec: "Gắn cột mốc permit T-30 vào cashflow; chi phí 'government lead' & buffer thời gian 30%." },
    { area: "Vận hành", sev: "med", gap: "Sizing khán giả, crowd-flow & an toàn theo ngày",
      detail: "Không có công suất khán giả/ngày, lối thoát, y tế theo quy mô đám đông — ảnh hưởng cả doanh thu vé lẫn an toàn.",
      rec: "Mô hình hoá sức chứa/ngày → vé bán → cổng/y tế/an ninh tương ứng." },
    { area: "Chiến lược", sev: "med", gap: "Junior/Legacy & ESG chưa có trong mô hình",
      detail: "Chương trình nhí và ESG là đòn bẩy goodwill chính quyền & sponsor, nhưng không xuất hiện trong chi phí/giá trị.",
      rec: "Thêm dòng CSR/junior (100-300tr) & ESG plan; tính vào media value & quan hệ chính quyền." },
    { area: "Chiến lược", sev: "low", gap: "Post-event content & doanh thu năm 2 chưa vào dòng tiền",
      detail: "Highlight package, gia hạn sponsor, IP thường niên 2027 — giá trị có nhưng chưa nằm trong cashflow T+.",
      rec: "Đưa upside 10,5 tỷ năm 2 vào mô hình đa năm để thể hiện ROI tích luỹ." }
  ];

  window.GOLF_CEO = { verdict, health, questions, decisions, strategicValue, assumptions, gaps };
  if (window.GOLF) window.GOLF.ceo = window.GOLF_CEO;
})();
