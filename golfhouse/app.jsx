/* ============================================================
   App shell — nav, filters, view switching, drawer
   + deep-link (URL hash), command palette, live mode
   ============================================================ */
const VIEWS = [
  { id: "plain", label: "Dễ hiểu", sub: "Bản dẫn nhập" },
  { id: "ceo", label: "CEO Cockpit", sub: "Tổng quan hợp nhất" },
  { id: "mission", label: "Mission Control", sub: "Dashboard điều hành" },
  { id: "org", label: "Tổ chức", sub: "Org · vai trò · OKR" },
  { id: "big", label: "Bản đồ tổng", sub: "Tháp 4 tầng × 4 lớp" },
  { id: "board", label: "Program Board", sub: "10 Sprint × 8 Team" },
  { id: "timeline", label: "Timeline PI", sub: "10 tuần · ceremony" },
  { id: "playbook", label: "Playbook vận hành", sub: "FA · pha · pattern · $" },
  { id: "finance", label: "Tài chính", sub: "VLF2026 · kịch bản · cashflow" },
  { id: "library", label: "Thư viện", sub: "SSOT · danh bạ · file" }
];

// ---- deep-link encode/decode -------------------------------
function encodeSel(s) {
  if (!s) return "";
  if (s.type === "feat") return `feat:${s.team}:${s.sprint}`;
  if (s.id != null) return `${s.type}:${s.id}`;
  return "";
}
function decodeSel(str) {
  if (!str) return null;
  const p = str.split(":");
  if (p[0] === "feat") return { type: "feat", team: p[1], sprint: p[2] };
  if (p.length >= 2) { const id = isNaN(+p[1]) ? p[1] : +p[1]; return { type: p[0], id }; }
  return null;
}
function readHash() {
  const h = (location.hash || "").replace(/^#/, "");
  const params = new URLSearchParams(h);
  return { view: params.get("view"), sel: decodeSel(params.get("sel")) };
}

function App() {
  const G = window.GOLF;
  const init = readHash();
  const [view, setView] = useState(init.view && VIEWS.some(v => v.id === init.view) ? init.view : "plain");
  const [filter, setFilter] = useState({ vs: null, team: null, sprint: null });
  const [sel, setSel] = useState(init.sel);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [live, setLive] = useState(false);
  const [statusVer, setStatusVer] = useState(0);
  const [tour, setTour] = useState(false);
  const open = useCallback((s) => setSel(s), []);

  // cross-link navigation: jump to a tab AND optionally open a drawer
  const nav = useCallback((v, s) => { if (v) setView(v); setSel(s || null); }, []);
  useEffect(() => { window.__nav = nav; window.__open = open; }, [nav, open]);

  // first-visit welcome
  useEffect(() => {
    try { if (!localStorage.getItem("golf_seen_tour")) { setTour(true); localStorage.setItem("golf_seen_tour", "1"); } } catch (e) {}
  }, []);

  // live-mode: edit a board cell status (persisted in localStorage)
  const setStatus = useCallback((key, st, pct) => {
    G.boardStatus[key] = { st, pct };
    try {
      const saved = JSON.parse(localStorage.getItem("golf_status_override") || "{}");
      saved[key] = { st, pct }; localStorage.setItem("golf_status_override", JSON.stringify(saved));
    } catch (e) {}
    setStatusVer(v => v + 1);
  }, [G]);

  // restore saved overrides once
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("golf_status_override") || "{}");
      Object.keys(saved).forEach(k => { if (G.boardStatus[k]) G.boardStatus[k] = saved[k]; });
      if (Object.keys(saved).length) setStatusVer(v => v + 1);
    } catch (e) {}
  }, [G]);

  // deep-link: write hash when view/sel change
  useEffect(() => {
    const parts = [`view=${view}`];
    const es = encodeSel(sel); if (es) parts.push(`sel=${es}`);
    const next = "#" + parts.join("&");
    if (location.hash !== next) history.replaceState(null, "", next);
  }, [view, sel]);

  // command palette hotkey
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(p => !p); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const clearFilters = () => setFilter({ vs: null, team: null, sprint: null });
  const hasFilter = filter.vs || filter.team || filter.sprint;
  const setVS = (id) => setFilter(f => ({ ...f, vs: f.vs === id ? null : id }));
  const setTeam = (id) => setFilter(f => ({ ...f, team: f.team === id ? null : id }));
  const setSprint = (id) => setFilter(f => ({ ...f, sprint: f.sprint === id ? null : id }));

  const showVSFilter = view === "big" || view === "board";
  const showTeamFilter = view === "big" || view === "board";
  const showSprintFilter = view === "board" || view === "timeline";

  return React.createElement(React.Fragment, null,
    React.createElement("header", { className: "topbar" },
      React.createElement("div", { className: "brand" },
        React.createElement("div", { className: "brand-mark" },
          React.createElement("img", { src: "uploads/golfhouse-logo.png", alt: "The Golf House", className: "brand-logo" })),
        React.createElement("div", null,
          React.createElement("div", { className: "brand-t" }, "THE GOLF HOUSE"),
          React.createElement("div", { className: "brand-s" }, "Bản đồ điều hành giải golf quốc tế tại Việt Nam"))),
      React.createElement("nav", { className: "nav" },
        VIEWS.map(v => React.createElement("button", {
          key: v.id, className: "navbtn" + (view === v.id ? " on" : ""), onClick: () => setView(v.id)
        }, React.createElement("b", null, v.label), React.createElement("span", null, v.sub)))),
      React.createElement("div", { className: "topctl" },
        React.createElement("button", { className: "tctl tctl-help", onClick: () => setTour(true), title: "Hướng dẫn" }, "?"),
        React.createElement("button", { className: "tctl" + (live ? " on" : ""), onClick: () => setLive(l => !l), title: "Chế độ Live — cập nhật trạng thái ô (lưu trên máy)" }, live ? "● LIVE" : "○ Live"),
        React.createElement("button", { className: "tctl tctl-k", onClick: () => setPaletteOpen(true), title: "Tìm nhanh (Ctrl/Cmd-K)" }, "⌕ Tìm ⌘K"))
    ),

    (showVSFilter || showTeamFilter || showSprintFilter) && React.createElement("div", { className: "filterbar" },
      showVSFilter && React.createElement("div", { className: "fgroup" },
        React.createElement("span", { className: "flabel" }, "LỚP / VS"),
        G.valueStreams.map(v => React.createElement(Chip, {
          key: v.id, color: vsColor(v.id), dim: vsDim(v.id, 0.16), active: filter.vs === v.id, onClick: () => setVS(v.id)
        }, v.id))),
      showTeamFilter && React.createElement("div", { className: "fgroup" },
        React.createElement("span", { className: "flabel" }, "TEAM"),
        G.teams.map(t => React.createElement(Chip, {
          key: t.id, color: vsColor(t.vs), dim: vsDim(t.vs, 0.16), active: filter.team === t.id, onClick: () => setTeam(t.id)
        }, t.id))),
      showSprintFilter && React.createElement("div", { className: "fgroup" },
        React.createElement("span", { className: "flabel" }, "SPRINT"),
        G.sprints.map(s => React.createElement(Chip, {
          key: s.id, active: filter.sprint === s.id, onClick: () => setSprint(s.id)
        }, s.label.replace("Sprint ", "S").replace("PI Planning", "PI")))),
      hasFilter && React.createElement("button", { className: "clearbtn", onClick: clearFilters }, "✕ Xóa lọc")
    ),

    React.createElement("main", { className: "stage" + (!(showVSFilter || showTeamFilter || showSprintFilter) ? " no-filter" : "") },
      view === "plain" && React.createElement(PlainView, { open, goView: setView }),
      view === "ceo" && React.createElement(CEOCockpit, { open, goView: setView }),
      view === "mission" && React.createElement(MissionControl, { open, goView: setView, statusVer }),
      view === "org" && React.createElement(OrgView, { open }),
      view === "big" && React.createElement(BigPicture, { filter, open }),
      view === "board" && React.createElement(ProgramBoard, { filter, open, live, statusVer }),
      view === "timeline" && React.createElement(Timeline, { filter, open }),
      view === "playbook" && React.createElement(Playbook, { open }),
      view === "finance" && React.createElement(FinanceView, { open }),
      view === "library" && React.createElement(LibraryView, { open })
    ),

    (view === "big" || view === "board") && React.createElement("div", { className: "legend" },
      G.valueStreams.map(v => React.createElement("span", { key: v.id, className: "lg" },
        React.createElement("i", { style: { background: vsColor(v.id) } }), v.id + " " + v.vi))),

    React.createElement(Drawer, { sel, onClose: () => setSel(null), open, live, setStatus }),
    paletteOpen && React.createElement(CommandPalette, { onClose: () => setPaletteOpen(false), setView, open }),
    tour && React.createElement(Welcome, { onClose: () => setTour(false), setView })
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
