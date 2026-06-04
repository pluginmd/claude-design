/* ============================================================
   WELCOME / ONBOARDING TOUR — hiện lần đầu, mở lại bằng nút "?"
   ============================================================ */
function Welcome({ onClose, setView }) {
  const tabs = [
    { ic: "◉", t: "Dễ hiểu", d: "Dẫn nhập không cần biết SAFe — 4 cấp tổ chức kể bằng tiếng Việt thường + từ điển.", v: "plain" },
    { ic: "▦", t: "Mission Control", d: "Phòng điều hành đa lăng kính: KPI, heatmap nghẽn/ổn, ROAM, nguồn lực, ma trận rủi ro.", v: "mission" },
    { ic: "♔", t: "Tổ chức", d: "Quy mô, org chart, vai trò, stakeholder, OKR, RACI — bấm để drill-down.", v: "org" },
    { ic: "⛳", t: "Bản đồ tổng", d: "Tháp 4 tầng SAFe × 4 lớp sản phẩm (Value Stream).", v: "big" },
    { ic: "▤", t: "Program Board", d: "10 Sprint × 8 Team, đường nối phụ thuộc, chi tiết input/output/outcome từng ô.", v: "board" },
    { ic: "◷", t: "Timeline + Playbook", d: "Dòng thời gian, ceremony, run-of-show · 12 khung giá trị doanh nghiệp, tài chính.", v: "timeline" }
  ];
  const powers = [
    { k: "⏱", t: "Cỗ máy thời gian", d: "Tua trạng thái qua từng tuần (Mission Control)." },
    { k: "▶", t: "Mô phỏng What-if", d: "Giả định một ô trễ → xem sóng lan (Program Board)." },
    { k: "⌘K", t: "Tìm nhanh", d: "Nhảy tới bất kỳ đâu bằng Ctrl/Cmd-K." },
    { k: "●", t: "Live mode", d: "Cập nhật trạng thái ô, lưu trên máy." }
  ];
  return React.createElement("div", { className: "wel-scrim", onClick: onClose },
    React.createElement("div", { className: "wel", onClick: (e) => e.stopPropagation() },
      React.createElement("button", { className: "wel-x", onClick: onClose, "aria-label": "Đóng" }, "✕"),
      React.createElement("div", { className: "wel-head" },
        React.createElement("div", { className: "wel-eyebrow" }, "BẢN ĐỒ ĐIỀU HÀNH · THE GOLF HOUSE"),
        React.createElement("h2", null, "Điều hành một giải golf quốc tế như điều hành một doanh nghiệp"),
        React.createElement("p", null, "7 tab — từ bức tranh dễ hiểu cho lãnh đạo tới dashboard vận hành sát sao. Bấm vào bất kỳ khối nào để xem chi tiết. Chọn một điểm khởi đầu:")),
      React.createElement("div", { className: "wel-tabs" },
        tabs.map((t, i) => React.createElement("button", { key: i, className: "wel-tab", onClick: () => { setView(t.v); onClose(); } },
          React.createElement("span", { className: "wel-ic" }, t.ic),
          React.createElement("div", null, React.createElement("b", null, t.t), React.createElement("p", null, t.d))))),
      React.createElement("div", { className: "wel-powers" },
        React.createElement("div", { className: "wel-pw-h" }, "4 tính năng mạnh"),
        React.createElement("div", { className: "wel-pw-grid" },
          powers.map((p, i) => React.createElement("div", { key: i, className: "wel-pw" },
            React.createElement("span", { className: "wel-pw-k" }, p.k),
            React.createElement("div", null, React.createElement("b", null, p.t), React.createElement("span", null, p.d)))))),
      React.createElement("button", { className: "wel-go", onClick: onClose }, "Bắt đầu khám phá →"))
  );
}
window.Welcome = Welcome;
