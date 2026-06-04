/* ============================================================
   PanZoom + shared helpers — blueprint UI
   ============================================================ */
const { useState, useRef, useEffect, useCallback } = React;

// ---- Value-stream color helpers ----------------------------
function vsById(id) { return window.GOLF.valueStreams.find(v => v.id === id); }
function vsColor(id, l = 0.74, c = 0.13) {
  const v = vsById(id);
  if (!v) return "oklch(0.7 0.02 240)";
  return `oklch(${l} ${c} ${v.hue})`;
}
function vsDim(id, alpha = 0.16) {
  const v = vsById(id);
  if (!v) return `oklch(0.7 0.02 240 / ${alpha})`;
  return `oklch(0.74 0.13 ${v.hue} / ${alpha})`;
}

// ---- PanZoom -----------------------------------------------
// Wheel to zoom (toward cursor), drag empty space to pan,
// buttons for zoom/fit. Children render in a transformed plane.
function PanZoom({ children, minScale = 0.3, maxScale = 2.4, initialScale = 1, fitKey, padding = 60 }) {
  const wrapRef = useRef(null);
  const planeRef = useRef(null);
  const [tf, setTf] = useState({ x: 0, y: 0, k: initialScale });
  const drag = useRef(null);

  const fit = useCallback(() => {
    const wrap = wrapRef.current, plane = planeRef.current;
    if (!wrap || !plane) return;
    const wb = wrap.getBoundingClientRect();
    // measure natural plane size at scale 1
    const pw = plane.scrollWidth, ph = plane.scrollHeight;
    if (!pw || !ph) return;
    const k = Math.min((wb.width - padding * 2) / pw, (wb.height - padding * 2) / ph, maxScale);
    const kk = Math.max(k, minScale);
    const x = (wb.width - pw * kk) / 2;
    const y = (wb.height - ph * kk) / 2;
    setTf({ x, y: Math.max(y, padding), k: kk });
  }, [maxScale, minScale, padding]);

  useEffect(() => { const t = setTimeout(fit, 60); return () => clearTimeout(t); }, [fit, fitKey]);

  const onWheel = (e) => {
    e.preventDefault();
    const wrap = wrapRef.current.getBoundingClientRect();
    const mx = e.clientX - wrap.left, my = e.clientY - wrap.top;
    setTf(prev => {
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      let k = Math.min(Math.max(prev.k * factor, minScale), maxScale);
      const x = mx - (mx - prev.x) * (k / prev.k);
      const y = my - (my - prev.y) * (k / prev.k);
      return { x, y, k };
    });
  };
  const onDown = (e) => {
    if (e.target.closest("[data-no-pan]")) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: tf.x, oy: tf.y };
    wrapRef.current.style.cursor = "grabbing";
  };
  const onMove = (e) => {
    if (!drag.current) return;
    setTf(prev => ({ ...prev, x: drag.current.ox + (e.clientX - drag.current.sx), y: drag.current.oy + (e.clientY - drag.current.sy) }));
  };
  const onUp = () => { drag.current = null; if (wrapRef.current) wrapRef.current.style.cursor = "grab"; };

  const zoomBtn = (dir) => setTf(prev => {
    const wrap = wrapRef.current.getBoundingClientRect();
    const mx = wrap.width / 2, my = wrap.height / 2;
    const k = Math.min(Math.max(prev.k * (dir > 0 ? 1.2 : 1 / 1.2), minScale), maxScale);
    return { x: mx - (mx - prev.x) * (k / prev.k), y: my - (my - prev.y) * (k / prev.k), k };
  });

  return (
    React.createElement("div", { className: "pz-wrap", ref: wrapRef, onWheel, onMouseDown: onDown, onMouseMove: onMove, onMouseUp: onUp, onMouseLeave: onUp },
      React.createElement("div", { className: "pz-plane", ref: planeRef, style: { transform: `translate(${tf.x}px,${tf.y}px) scale(${tf.k})` } }, children),
      React.createElement("div", { className: "pz-ctrl", "data-no-pan": true },
        React.createElement("button", { onClick: () => zoomBtn(1), title: "Phóng to" }, "+"),
        React.createElement("button", { onClick: () => zoomBtn(-1), title: "Thu nhỏ" }, "−"),
        React.createElement("button", { onClick: fit, title: "Vừa khung", className: "pz-fit" }, "⤢"),
        React.createElement("span", { className: "pz-pct" }, Math.round(tf.k * 100) + "%")
      )
    )
  );
}

// ---- Small shared atoms ------------------------------------
function Chip({ children, color, dim, onClick, active }) {
  return React.createElement("button", {
    className: "chip" + (active ? " chip-on" : ""),
    onClick,
    style: color ? { borderColor: color, color: active ? "#071a30" : color, background: active ? color : (dim || "transparent") } : undefined
  }, children);
}

function Pill({ children, hue }) {
  return React.createElement("span", { className: "pill", style: hue != null ? { borderColor: `oklch(0.74 0.13 ${hue} / 0.5)`, color: `oklch(0.82 0.12 ${hue})` } : undefined }, children);
}

window.PanZoom = PanZoom;
window.vsById = vsById; window.vsColor = vsColor; window.vsDim = vsDim;
window.Chip = Chip; window.Pill = Pill;

// ---- status (RAG) helpers ----------------------------------
const STATUS = {
  done:   { l: "Hoàn tất",      c: "oklch(0.74 0.14 150)", k: "done" },
  track:  { l: "Đang chạy",     c: "oklch(0.78 0.13 230)", k: "track" },
  risk:   { l: "Rủi ro",        c: "oklch(0.80 0.14 75)",  k: "risk" },
  block:  { l: "Tắc nghẽn",     c: "oklch(0.64 0.20 25)",  k: "block" },
  pending:{ l: "Chờ duyệt",     c: "oklch(0.68 0.13 300)", k: "pending" },
  cancel: { l: "Đã huỷ / cắt",  c: "oklch(0.52 0.02 240)", k: "cancel" },
  todo:   { l: "Chưa bắt đầu",  c: "oklch(0.62 0.03 240)", k: "todo" }
};
function statusOf(team, sprint) { return window.GOLF.boardStatus[team + sprint] || { st: "todo", pct: 0 }; }
window.STATUS = STATUS; window.statusOf = statusOf;
