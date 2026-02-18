import { useState, useEffect, useCallback } from "react";

// ==================== DATA ====================
const SCHEMES = [
  { id: "LKSH-2027", mat: 2027, tenor: "Short", yrs: 1.3, zcyc: 6.20, nav: 98.52, inav: 98.55, imv: 120.48, aum: 850, units: 863008, spread: 22, vol: 14520, status: "ACTIVE" },
  { id: "LKSH-2028", mat: 2028, tenor: "Short", yrs: 2.3, zcyc: 6.30, nav: 86.73, inav: 86.78, imv: 120.90, aum: 620, units: 714789, vol: 8730, spread: 25, status: "ACTIVE" },
  { id: "LKSH-2029", mat: 2029, tenor: "Short", yrs: 3.3, zcyc: 6.35, nav: 81.24, inav: 81.28, imv: 121.32, aum: 540, units: 664697, vol: 6210, spread: 28, status: "ACTIVE" },
  { id: "LKSH-2030", mat: 2030, tenor: "Short", yrs: 4.3, zcyc: 6.40, nav: 76.12, inav: 76.18, imv: 121.75, aum: 480, units: 630582, vol: 5840, spread: 28, status: "ACTIVE" },
  { id: "LKSH-2031", mat: 2031, tenor: "Short", yrs: 5.3, zcyc: 6.45, nav: 71.43, inav: 71.48, imv: 122.20, aum: 410, units: 573843, vol: 4120, spread: 30, status: "ACTIVE" },
  { id: "LKSH-2033", mat: 2033, tenor: "Medium", yrs: 7.3, zcyc: 6.52, nav: 63.18, inav: 63.22, imv: 123.20, aum: 380, units: 601456, vol: 3250, spread: 38, status: "ACTIVE" },
  { id: "LKSH-2035", mat: 2035, tenor: "Medium", yrs: 9.3, zcyc: 6.60, nav: 55.89, inav: 55.93, imv: 124.25, aum: 340, units: 608144, vol: 2890, spread: 42, status: "ACTIVE" },
  { id: "LKSH-2037", mat: 2037, tenor: "Medium", yrs: 11.3, zcyc: 6.68, nav: 49.42, inav: 49.46, imv: 125.35, aum: 310, units: 627276, vol: 2410, spread: 45, status: "ACTIVE" },
  { id: "LKSH-2040", mat: 2040, tenor: "Medium", yrs: 14.3, zcyc: 6.75, nav: 41.23, inav: 41.27, imv: 126.92, aum: 520, units: 1261218, vol: 5670, spread: 48, status: "ACTIVE" },
  { id: "LKSH-2045", mat: 2045, tenor: "Long", yrs: 19.3, zcyc: 6.85, nav: 28.67, inav: 28.70, imv: 128.80, aum: 280, units: 976490, vol: 1840, spread: 58, status: "ACTIVE" },
  { id: "LKSH-2050", mat: 2050, tenor: "Long", yrs: 24.3, zcyc: 6.90, nav: 20.12, inav: 20.14, imv: 130.20, aum: 190, units: 944334, vol: 1250, spread: 65, status: "ACTIVE" },
  { id: "LKSH-2055", mat: 2055, tenor: "Ultra", yrs: 29.3, zcyc: 6.95, nav: 14.18, inav: 14.19, imv: 131.68, aum: 140, units: 987306, vol: 890, spread: 78, status: "ACTIVE" },
  { id: "LKSH-2060", mat: 2060, tenor: "Ultra", yrs: 34.3, zcyc: 7.00, nav: 10.02, inav: 10.03, imv: 133.25, aum: 100, units: 998004, vol: 620, spread: 88, status: "ACTIVE" },
];

const ORDERS = [
  { id: "CR-2026-0341", type: "Creation", scheme: "LKSH-2040", fv: 2500000, units: 60627, status: "Completed", time: "2026-02-14 10:23", settled: "2026-02-15" },
  { id: "CR-2026-0342", type: "Redemption", scheme: "LKSH-2027", fv: 1000000, units: 10152, status: "Completed", time: "2026-02-14 14:15", settled: "2026-02-15" },
  { id: "CR-2026-0343", type: "Creation", scheme: "LKSH-2035", fv: 5000000, units: 89445, status: "Settled", time: "2026-02-17 09:45", settled: "2026-02-17" },
  { id: "CR-2026-0344", type: "Redemption", scheme: "LKSH-2045", fv: 2500000, units: 87166, status: "Processing", time: "2026-02-17 11:30", settled: "-" },
  { id: "CR-2026-0345", type: "Creation", scheme: "LKSH-2040", fv: 2500000, units: 60627, status: "Pending Approval", time: "2026-02-17 14:02", settled: "-" },
];

const PCF_DATA = [
  { isin: "IN0020230189", name: "GOI STRIPS 2040", qty: 2083, fv: 100, pv: 41.23, total_pv: 85923 },
  { isin: "IN0020230197", name: "GOI STRIPS 2040-B", qty: 417, fv: 100, pv: 41.18, total_pv: 17172 },
];

const INVENTORY = [
  { scheme: "LKSH-2027", units: 25000, avgCost: 98.10, currentNav: 98.52, pnl: 10500, pnlPct: 0.43 },
  { scheme: "LKSH-2040", units: 121254, avgCost: 40.80, currentNav: 41.23, pnl: 52139, pnlPct: 1.05 },
  { scheme: "LKSH-2035", units: -45000, avgCost: 56.20, currentNav: 55.89, pnl: 13950, pnlPct: 0.55 },
  { scheme: "LKSH-2045", units: 87166, avgCost: 28.40, currentNav: 28.67, pnl: 23535, pnlPct: 0.95 },
  { scheme: "LKSH-2050", units: -12000, avgCost: 20.30, currentNav: 20.12, pnl: 2160, pnlPct: 0.89 },
];

const ZCYC_POINTS = [
  { tenor: "3M", rate: 5.85 }, { tenor: "6M", rate: 5.95 }, { tenor: "1Y", rate: 6.10 },
  { tenor: "2Y", rate: 6.25 }, { tenor: "3Y", rate: 6.35 }, { tenor: "5Y", rate: 6.45 },
  { tenor: "7Y", rate: 6.55 }, { tenor: "10Y", rate: 6.68 }, { tenor: "14Y", rate: 6.75 },
  { tenor: "15Y", rate: 6.78 }, { tenor: "20Y", rate: 6.85 }, { tenor: "25Y", rate: 6.92 },
  { tenor: "30Y", rate: 6.98 },
];

// ==================== HELPERS ====================
const fmt = (n, d = 2) => Number(n).toFixed(d);
const fmtL = (n) => n >= 100 ? `${fmt(n / 100, 0)} Cr` : `${fmt(n, 0)} L`;
const fmtN = (n) => n.toLocaleString("en-IN");
const tenorColor = { Short: "#0CC695", Medium: "#1565C0", Long: "#FF6D00", Ultra: "#9C27B0" };
const statusColor = { "Completed": "#0CC695", "Settled": "#097053", "Processing": "#FF6D00", "Pending Approval": "#1565C0", "Rejected": "#CC0000" };

// ==================== COMPONENTS ====================

const TabButton = ({ active, onClick, children, count }) => (
  <button onClick={onClick} style={{
    padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
    background: active ? "#0a1a14" : "transparent", color: active ? "#0CC695" : "#8a9a94",
    borderBottom: active ? "2px solid #0CC695" : "2px solid transparent",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
  }}>
    {children}
    {count !== undefined && <span style={{ background: active ? "#0CC695" : "#2a3a34", color: active ? "#0a1a14" : "#8a9a94", fontSize: 10, padding: "1px 6px", borderRadius: 8, fontWeight: 700 }}>{count}</span>}
  </button>
);

const Card = ({ title, children, accent, action }) => (
  <div style={{ background: "#0f1f19", border: "1px solid #1a2f28", borderRadius: 10, padding: "16px 18px", borderTop: accent ? `3px solid ${accent}` : undefined }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: "#6a8a7a", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>
      {action}
    </div>
    {children}
  </div>
);

const Badge = ({ color, children }) => (
  <span style={{ background: color + "22", color, fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{children}</span>
);

const Stat = ({ label, value, sub, color }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: color || "#0CC695", fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    <div style={{ fontSize: 10, color: "#6a8a7a", marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 9, color: "#4a6a5a", marginTop: 1 }}>{sub}</div>}
  </div>
);

const LiveDot = () => {
  const [on, setOn] = useState(true);
  useEffect(() => { const i = setInterval(() => setOn(p => !p), 1000); return () => clearInterval(i); }, []);
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? "#0CC695" : "#064", display: "inline-block", marginRight: 6 }} />;
};

// ==================== MAIN TABS ====================

// TAB 1: SCHEME DASHBOARD
const SchemeDashboard = () => {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("id");
  const filtered = SCHEMES.filter(s => filter === "All" || s.tenor === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "#6a8a7a", marginRight: 4 }}>Filter:</div>
        {["All", "Short", "Medium", "Long", "Ultra"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "4px 12px", borderRadius: 4, border: "1px solid " + (filter === f ? "#0CC695" : "#1a2f28"),
            background: filter === f ? "#0CC69520" : "transparent", color: filter === f ? "#0CC695" : "#6a8a7a",
            fontSize: 11, cursor: "pointer", fontWeight: filter === f ? 600 : 400,
          }}>{f} {f !== "All" && <span style={{ fontSize: 9, opacity: 0.7 }}>({SCHEMES.filter(s => s.tenor === f).length})</span>}</button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 10, color: "#4a6a5a" }}><LiveDot /> Live iNAV • Updated 3s ago</div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2f28" }}>
              {["Scheme", "Tenor", "iNAV", "NAV", "IMV", "Spread", "ZCYC", "AUM", "Volume", "Bid", "Ask", "Action"].map(h => (
                <th key={h} style={{ padding: "8px 6px", textAlign: "left", color: "#4a6a5a", fontWeight: 600, fontSize: 10, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const bid = (s.inav - s.spread * s.inav / 20000).toFixed(4);
              const ask = (s.inav + s.spread * s.inav / 20000).toFixed(4);
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #0f1f19", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0a1a14"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 6px", fontWeight: 600, color: "#e0f0ea" }}>{s.id}</td>
                  <td><Badge color={tenorColor[s.tenor]}>{s.tenor} ({s.yrs}y)</Badge></td>
                  <td style={{ fontFamily: "monospace", color: "#0CC695", fontWeight: 600 }}>₹{fmt(s.inav, 4)}</td>
                  <td style={{ fontFamily: "monospace", color: "#8a9a94" }}>₹{fmt(s.nav, 4)}</td>
                  <td style={{ fontFamily: "monospace", color: "#FF6D00" }}>₹{fmt(s.imv, 2)}</td>
                  <td><span style={{ color: s.spread <= 30 ? "#0CC695" : s.spread <= 50 ? "#FFB300" : "#FF6D00", fontWeight: 600 }}>{s.spread} bps</span></td>
                  <td style={{ fontFamily: "monospace", color: "#8a9a94" }}>{fmt(s.zcyc, 2)}%</td>
                  <td style={{ color: "#8a9a94" }}>₹{fmtL(s.aum)}</td>
                  <td style={{ fontFamily: "monospace", color: "#6a8a7a" }}>{fmtN(s.vol)}</td>
                  <td style={{ fontFamily: "monospace", color: "#0CC695" }}>₹{bid}</td>
                  <td style={{ fontFamily: "monospace", color: "#FF6D00" }}>₹{ask}</td>
                  <td>
                    <button style={{ padding: "3px 8px", background: "#0CC69520", border: "1px solid #0CC695", color: "#0CC695", borderRadius: 4, fontSize: 9, cursor: "pointer", fontWeight: 600 }}>CREATE</button>
                    {" "}
                    <button style={{ padding: "3px 8px", background: "#FF6D0020", border: "1px solid #FF6D00", color: "#FF6D00", borderRadius: 4, fontSize: 9, cursor: "pointer", fontWeight: 600 }}>REDEEM</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// TAB 2: CREATION / REDEMPTION
const CreateRedeem = () => {
  const [mode, setMode] = useState("create");
  const [scheme, setScheme] = useState("LKSH-2040");
  const [faceValue, setFaceValue] = useState(2500000);
  const [step, setStep] = useState(0);

  const s = SCHEMES.find(x => x.id === scheme) || SCHEMES[8];
  const pv = faceValue / Math.pow(1 + s.zcyc / 100, s.yrs);
  const units = Math.floor(pv / s.nav);
  const cashComp = pv - (units * s.nav);

  const steps = mode === "create"
    ? ["Enter Details", "Review Basket", "Confirm Order", "Deliver STRIPS", "Units Credited"]
    : ["Enter Details", "Review STRIPS Return", "Confirm Order", "Transfer Units", "Receive STRIPS"];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["create", "redeem"].map(m => (
          <button key={m} onClick={() => { setMode(m); setStep(0); }} style={{
            padding: "10px 24px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: mode === m ? (m === "create" ? "#0CC695" : "#FF6D00") : "#1a2f28",
            color: mode === m ? "#0a1a14" : "#6a8a7a",
          }}>{m === "create" ? "⊕ CREATE UNITS" : "⊖ REDEEM UNITS"}</button>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {steps.map((st, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              height: 4, borderRadius: 2, marginBottom: 6,
              background: i <= step ? (mode === "create" ? "#0CC695" : "#FF6D00") : "#1a2f28",
            }} />
            <div style={{ fontSize: 9, color: i <= step ? "#e0f0ea" : "#4a6a5a", fontWeight: i === step ? 700 : 400 }}>{st}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card title="Order Details" accent={mode === "create" ? "#0CC695" : "#FF6D00"}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: "#6a8a7a", display: "block", marginBottom: 4 }}>Select Scheme</label>
              <select value={scheme} onChange={e => setScheme(e.target.value)} style={{
                width: "100%", padding: "8px 10px", background: "#0a1a14", border: "1px solid #1a2f28",
                color: "#e0f0ea", borderRadius: 6, fontSize: 12,
              }}>
                {SCHEMES.map(s => <option key={s.id} value={s.id}>{s.id} — Maturity {s.mat} ({s.tenor})</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 10, color: "#6a8a7a", display: "block", marginBottom: 4 }}>
                {mode === "create" ? "Face Value of STRIPS to Deliver (₹)" : "Number of ETF Units to Redeem"}
              </label>
              <input type="number" value={faceValue} onChange={e => setFaceValue(Number(e.target.value))} style={{
                width: "100%", padding: "8px 10px", background: "#0a1a14", border: "1px solid #1a2f28",
                color: "#0CC695", borderRadius: 6, fontSize: 16, fontFamily: "monospace", fontWeight: 700, boxSizing: "border-box",
              }} />
              <div style={{ fontSize: 9, color: "#4a6a5a", marginTop: 4 }}>Min creation unit: ₹25,00,000 (maturity value)</div>
            </div>
            <button onClick={() => setStep(1)} style={{
              width: "100%", padding: "10px", background: mode === "create" ? "#0CC695" : "#FF6D00",
              color: "#0a1a14", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>COMPUTE {mode === "create" ? "UNITS" : "STRIPS"} →</button>
          </Card>

          <Card title="Live Computation" accent="#1565C0">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Stat label="ZCYC Rate" value={`${fmt(s.zcyc)}%`} sub={`Tenor: ${s.yrs} years`} />
              <Stat label="Current iNAV" value={`₹${fmt(s.inav, 4)}`} sub="Updated 3s ago" />
              <Stat label="Present Value" value={`₹${fmtN(Math.round(pv))}`} sub="FV discounted by ZCYC" />
              <Stat label="ETF Units" value={fmtN(units)} sub={`@ ₹${fmt(s.nav, 4)} per unit`} color="#FF6D00" />
              <Stat label="Cash Component" value={`₹${fmtN(Math.round(cashComp))}`} sub="Fractional + accrual" />
              <Stat label="IMV at Maturity" value={`₹${fmt(s.imv, 2)}`} sub={`Per unit in ${s.mat}`} color="#FF6D00" />
            </div>
            <div style={{ marginTop: 16, padding: 10, background: "#0a1a14", borderRadius: 6, fontSize: 10, color: "#6a8a7a", fontFamily: "monospace" }}>
              PV = FV / (1 + {s.zcyc}%)^{s.yrs} = ₹{fmtN(Math.round(pv))}<br />
              Units = PV / NAV = {fmtN(Math.round(pv))} / {fmt(s.nav, 4)} = {fmtN(units)}<br />
              Cash = PV - (Units × NAV) = ₹{fmtN(Math.round(cashComp))}
            </div>
          </Card>
        </div>
      )}

      {step === 1 && (
        <Card title={mode === "create" ? "Basket to Deliver (PCF)" : "STRIPS You Will Receive"} accent="#0CC695">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2f28" }}>
                {["ISIN", "Security", "Quantity", "Face Value", "PV/Unit", "Total PV"].map(h => (
                  <th key={h} style={{ padding: "6px", textAlign: "left", color: "#4a6a5a", fontSize: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PCF_DATA.map(p => (
                <tr key={p.isin} style={{ borderBottom: "1px solid #0f1f19" }}>
                  <td style={{ padding: "8px 6px", fontFamily: "monospace", color: "#0CC695" }}>{p.isin}</td>
                  <td style={{ color: "#e0f0ea" }}>{p.name}</td>
                  <td style={{ fontFamily: "monospace" }}>{fmtN(p.qty)}</td>
                  <td style={{ fontFamily: "monospace" }}>₹{fmt(p.fv)}</td>
                  <td style={{ fontFamily: "monospace" }}>₹{fmt(p.pv)}</td>
                  <td style={{ fontFamily: "monospace", fontWeight: 600, color: "#0CC695" }}>₹{fmtN(p.total_pv)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#0a1a14", borderRadius: 6, marginBottom: 16 }}>
            <span style={{ color: "#6a8a7a", fontSize: 11 }}>Total PV: <strong style={{ color: "#0CC695" }}>₹{fmtN(PCF_DATA.reduce((a, p) => a + p.total_pv, 0))}</strong></span>
            <span style={{ color: "#6a8a7a", fontSize: 11 }}>Cash Component: <strong style={{ color: "#FF6D00" }}>₹{fmtN(Math.round(cashComp))}</strong></span>
            <span style={{ color: "#6a8a7a", fontSize: 11 }}>Units: <strong style={{ color: "#e0f0ea" }}>{fmtN(units)}</strong></span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(0)} style={{ flex: 1, padding: 10, background: "#1a2f28", color: "#8a9a94", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>← Back</button>
            <button onClick={() => setStep(2)} style={{ flex: 2, padding: 10, background: mode === "create" ? "#0CC695" : "#FF6D00", color: "#0a1a14", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>CONFIRM ORDER →</button>
          </div>
        </Card>
      )}

      {step >= 2 && (
        <Card title="Order Confirmed" accent="#0CC695">
          <div style={{ textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0CC695", marginBottom: 4 }}>Order Submitted Successfully</div>
            <div style={{ fontSize: 12, color: "#6a8a7a", marginBottom: 20 }}>Order ID: CR-2026-0346 • {new Date().toLocaleString()}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 500, margin: "0 auto" }}>
              <Stat label="Scheme" value={scheme} />
              <Stat label="Units" value={fmtN(units)} />
              <Stat label="Status" value="Processing" color="#FF6D00" />
            </div>
            <div style={{ marginTop: 20, padding: 12, background: "#0a1a14", borderRadius: 6, fontSize: 11, color: "#6a8a7a", textAlign: "left" }}>
              <strong style={{ color: "#e0f0ea" }}>Next Steps:</strong><br />
              {mode === "create" ? (
                <>1. Deliver STRIPS to HDFC Custodian CSGL account<br />
                2. Settlement copy emailed to KFintech automatically<br />
                3. CA uploaded to NSDL by KFintech → Lakshya approves<br />
                4. Units credited to your demat: CDSL (T day) / NSDL (T+1)<br />
                5. Confirmation email with UTR sent to you</>
              ) : (
                <>1. Transfer ETF units via RRN or Pool Account<br />
                2. KFintech confirms unit receipt and extinguishes<br />
                3. HDFC Custodian delivers STRIPS to your account (T+1)<br />
                4. Confirmation email with settlement details sent</>
              )}
            </div>
            <button onClick={() => setStep(0)} style={{ marginTop: 16, padding: "10px 24px", background: "#1a2f28", color: "#0CC695", border: "1px solid #0CC695", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>New Order</button>
          </div>
        </Card>
      )}
    </div>
  );
};

// TAB 3: PCF VIEWER
const PcfViewer = () => {
  const [selected, setSelected] = useState("LKSH-2040");
  const s = SCHEMES.find(x => x.id === selected) || SCHEMES[8];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{
          padding: "8px 12px", background: "#0a1a14", border: "1px solid #1a2f28", color: "#e0f0ea", borderRadius: 6, fontSize: 12
        }}>
          {SCHEMES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
        </select>
        <Badge color="#0CC695">PCF Date: 17 Feb 2026</Badge>
        <div style={{ flex: 1 }} />
        <button style={{ padding: "6px 14px", background: "#0CC69520", border: "1px solid #0CC695", color: "#0CC695", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>⬇ Download CSV</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card title="Creation Unit Size"><Stat label="" value="₹25 Lakhs" sub="Maturity value" /></Card>
        <Card title="NAV (Previous)"><Stat label="" value={`₹${fmt(s.nav, 4)}`} sub="EOD 16 Feb" /></Card>
        <Card title="iNAV (Live)"><Stat label="" value={`₹${fmt(s.inav, 4)}`} sub="Updated 3s ago" /></Card>
        <Card title="IMV"><Stat label="" value={`₹${fmt(s.imv, 2)}`} sub={`Maturity ${s.mat}`} color="#FF6D00" /></Card>
      </div>
      <Card title={`Basket Composition — ${selected}`} accent="#0CC695">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2f28" }}>
              {["ISIN", "Security Name", "Maturity", "Qty", "Face Value", "ZCYC Rate", "PV/Unit", "Total PV", "Weight"].map(h => (
                <th key={h} style={{ padding: "6px", textAlign: "left", color: "#4a6a5a", fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #0f1f19" }}>
              <td style={{ padding: "8px 6px", fontFamily: "monospace", color: "#0CC695" }}>IN0020230189</td>
              <td style={{ color: "#e0f0ea" }}>GOI STRIPS 14.3Y 2040</td>
              <td>12 Jun 2040</td>
              <td style={{ fontFamily: "monospace" }}>2,083</td>
              <td style={{ fontFamily: "monospace" }}>₹100</td>
              <td style={{ fontFamily: "monospace" }}>6.75%</td>
              <td style={{ fontFamily: "monospace" }}>₹41.23</td>
              <td style={{ fontFamily: "monospace", color: "#0CC695", fontWeight: 600 }}>₹85,923</td>
              <td>83.4%</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #0f1f19" }}>
              <td style={{ padding: "8px 6px", fontFamily: "monospace", color: "#0CC695" }}>IN0020230197</td>
              <td style={{ color: "#e0f0ea" }}>GOI STRIPS 14.5Y 2040-B</td>
              <td>18 Sep 2040</td>
              <td style={{ fontFamily: "monospace" }}>417</td>
              <td style={{ fontFamily: "monospace" }}>₹100</td>
              <td style={{ fontFamily: "monospace" }}>6.76%</td>
              <td style={{ fontFamily: "monospace" }}>₹41.18</td>
              <td style={{ fontFamily: "monospace", color: "#0CC695", fontWeight: 600 }}>₹17,172</td>
              <td>16.6%</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: 10, background: "#0a1a14", borderRadius: 6, fontSize: 11 }}>
          <span style={{ color: "#6a8a7a" }}>Total Basket PV: <strong style={{ color: "#0CC695" }}>₹1,03,095</strong></span>
          <span style={{ color: "#6a8a7a" }}>Cash Component: <strong style={{ color: "#FF6D00" }}>₹1,238</strong></span>
          <span style={{ color: "#6a8a7a" }}>Total Creation Value: <strong style={{ color: "#e0f0ea" }}>₹1,04,333</strong></span>
          <span style={{ color: "#6a8a7a" }}>Units per CU: <strong style={{ color: "#e0f0ea" }}>2,530</strong></span>
        </div>
      </Card>
    </div>
  );
};

// TAB 4: ORDER HISTORY
const OrderHistory = () => (
  <Card title="Order History" accent="#1565C0">
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
      <thead>
        <tr style={{ borderBottom: "1px solid #1a2f28" }}>
          {["Order ID", "Type", "Scheme", "Face Value", "Units", "Status", "Submitted", "Settled"].map(h => (
            <th key={h} style={{ padding: "6px", textAlign: "left", color: "#4a6a5a", fontSize: 10 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ORDERS.map(o => (
          <tr key={o.id} style={{ borderBottom: "1px solid #0f1f19" }}>
            <td style={{ padding: "8px 6px", fontFamily: "monospace", color: "#0CC695", fontWeight: 600 }}>{o.id}</td>
            <td><Badge color={o.type === "Creation" ? "#0CC695" : "#FF6D00"}>{o.type}</Badge></td>
            <td style={{ fontWeight: 600, color: "#e0f0ea" }}>{o.scheme}</td>
            <td style={{ fontFamily: "monospace" }}>₹{fmtN(o.fv)}</td>
            <td style={{ fontFamily: "monospace" }}>{fmtN(o.units)}</td>
            <td><Badge color={statusColor[o.status]}>{o.status}</Badge></td>
            <td style={{ color: "#6a8a7a", fontSize: 10 }}>{o.time}</td>
            <td style={{ color: "#6a8a7a", fontSize: 10 }}>{o.settled}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

// TAB 5: INVENTORY
const InventoryTab = () => {
  const totalPnl = INVENTORY.reduce((a, i) => a + i.pnl, 0);
  const netUnits = INVENTORY.reduce((a, i) => a + i.units, 0);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <Card title="Net Position"><Stat label="" value={fmtN(netUnits)} sub={netUnits > 0 ? "NET LONG" : "NET SHORT"} color={netUnits > 0 ? "#0CC695" : "#FF6D00"} /></Card>
        <Card title="Total P&L (Today)"><Stat label="" value={`₹${fmtN(totalPnl)}`} sub="Unrealized" color="#0CC695" /></Card>
        <Card title="Schemes Active"><Stat label="" value={INVENTORY.length} sub="With open positions" /></Card>
      </div>
      <Card title="Position Breakdown" accent="#1565C0">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1a2f28" }}>
              {["Scheme", "Position", "Direction", "Avg Cost", "Current NAV", "P&L", "P&L %", "Action"].map(h => (
                <th key={h} style={{ padding: "6px", textAlign: "left", color: "#4a6a5a", fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map(inv => (
              <tr key={inv.scheme} style={{ borderBottom: "1px solid #0f1f19" }}>
                <td style={{ padding: "8px 6px", fontWeight: 600, color: "#e0f0ea" }}>{inv.scheme}</td>
                <td style={{ fontFamily: "monospace" }}>{fmtN(Math.abs(inv.units))}</td>
                <td><Badge color={inv.units > 0 ? "#0CC695" : "#FF6D00"}>{inv.units > 0 ? "LONG" : "SHORT"}</Badge></td>
                <td style={{ fontFamily: "monospace" }}>₹{fmt(inv.avgCost, 2)}</td>
                <td style={{ fontFamily: "monospace" }}>₹{fmt(inv.currentNav, 2)}</td>
                <td style={{ fontFamily: "monospace", color: inv.pnl > 0 ? "#0CC695" : "#FF6D00", fontWeight: 600 }}>₹{fmtN(inv.pnl)}</td>
                <td style={{ fontFamily: "monospace", color: inv.pnl > 0 ? "#0CC695" : "#FF6D00" }}>{fmt(inv.pnlPct)}%</td>
                <td>
                  <button style={{ padding: "3px 8px", background: inv.units > 0 ? "#FF6D0020" : "#0CC69520", border: `1px solid ${inv.units > 0 ? "#FF6D00" : "#0CC695"}`, color: inv.units > 0 ? "#FF6D00" : "#0CC695", borderRadius: 4, fontSize: 9, cursor: "pointer", fontWeight: 600 }}>
                    {inv.units > 0 ? "REDEEM" : "CREATE"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, padding: 10, background: "#0a1a14", borderRadius: 6, fontSize: 10, color: "#6a8a7a" }}>
          <strong style={{ color: "#FFB300" }}>⚠ Inventory Signal:</strong> LKSH-2040 position is {fmtN(121254)} units LONG. Consider redemption to reduce inventory risk. LKSH-2035 is SHORT — may need creation to cover.
        </div>
      </Card>
    </div>
  );
};

// TAB 6: ZCYC CURVE
const ZcycTab = () => (
  <div>
    <Card title="Live ZCYC Yield Curve — CCIL" accent="#1565C0">
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 200, padding: "10px 0" }}>
        {ZCYC_POINTS.map((p, i) => {
          const h = ((p.rate - 5.5) / 2) * 180;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, fontFamily: "monospace", color: "#0CC695", fontWeight: 600 }}>{fmt(p.rate, 2)}%</div>
              <div style={{ width: "80%", height: h, background: `linear-gradient(to top, #097053, #0CC695)`, borderRadius: "4px 4px 0 0", minHeight: 8 }} />
              <div style={{ fontSize: 8, color: "#4a6a5a" }}>{p.tenor}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #1a2f28", fontSize: 10, color: "#6a8a7a" }}>
        <span>Source: CCIL (FBIL reference rates)</span>
        <span>Date: 17 Feb 2026</span>
        <span>Last updated: 06:15 AM IST</span>
      </div>
    </Card>
    <div style={{ marginTop: 16 }}>
      <Card title="Your 38 Schemes on the Curve" accent="#0CC695">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SCHEMES.map(s => (
            <div key={s.id} style={{ padding: "6px 10px", background: "#0a1a14", borderRadius: 6, border: `1px solid ${tenorColor[s.tenor]}40`, fontSize: 10, minWidth: 100 }}>
              <div style={{ fontWeight: 600, color: "#e0f0ea" }}>{s.id}</div>
              <div style={{ fontFamily: "monospace", color: tenorColor[s.tenor] }}>{fmt(s.zcyc)}% @ {s.yrs}y</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

// TAB 7: PERFORMANCE
const PerformanceTab = () => (
  <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
      <Card title="Time on Quote"><Stat label="" value="94.2%" sub="Target: >80%" color="#0CC695" /></Card>
      <Card title="Avg Spread"><Stat label="" value="42 bps" sub="Within limit" color="#0CC695" /></Card>
      <Card title="Volume Today"><Stat label="" value="₹8.2 Cr" sub="₹58,320 units" /></Card>
      <Card title="Schemes Covered"><Stat label="" value="13 / 38" sub="Active quoting" color="#FF6D00" /></Card>
    </div>
    <Card title="Daily Performance Metrics" accent="#0CC695">
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1a2f28" }}>
            {["Scheme", "Time on Quote", "Avg Spread", "Max Spread", "Volume", "Trades", "Status"].map(h => (
              <th key={h} style={{ padding: "6px", textAlign: "left", color: "#4a6a5a", fontSize: 10 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHEMES.slice(0, 8).map(s => {
            const toq = 85 + Math.random() * 13;
            const trades = Math.floor(Math.random() * 50 + 5);
            return (
              <tr key={s.id} style={{ borderBottom: "1px solid #0f1f19" }}>
                <td style={{ padding: "8px 6px", fontWeight: 600, color: "#e0f0ea" }}>{s.id}</td>
                <td style={{ fontFamily: "monospace", color: toq > 80 ? "#0CC695" : "#FF0000" }}>{fmt(toq, 1)}%</td>
                <td style={{ fontFamily: "monospace" }}>{s.spread} bps</td>
                <td style={{ fontFamily: "monospace", color: "#FFB300" }}>{s.spread + 15} bps</td>
                <td style={{ fontFamily: "monospace" }}>{fmtN(s.vol)}</td>
                <td style={{ fontFamily: "monospace" }}>{trades}</td>
                <td><Badge color={toq > 80 ? "#0CC695" : "#FF0000"}>{toq > 80 ? "COMPLIANT" : "BREACH"}</Badge></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  </div>
);

// ==================== MAIN APP ====================
export default function MarketMakerWorkstation() {
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);

  const tabs = [
    { label: "Dashboard", icon: "◉", component: SchemeDashboard, count: 13 },
    { label: "Create / Redeem", icon: "⊕", component: CreateRedeem },
    { label: "PCF Basket", icon: "▦", component: PcfViewer },
    { label: "Orders", icon: "⧉", component: OrderHistory, count: ORDERS.length },
    { label: "Inventory", icon: "◫", component: InventoryTab, count: INVENTORY.length },
    { label: "ZCYC Curve", icon: "∿", component: ZcycTab },
    { label: "Performance", icon: "◈", component: PerformanceTab },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div style={{ background: "#060e0a", color: "#c0d0ca", minHeight: "100vh", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
      {/* HEADER */}
      <div style={{ background: "#0a1a14", borderBottom: "1px solid #1a2f28", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#e0f0ea", letterSpacing: 2 }}>LAKSHYA</div>
          <div style={{ width: 1, height: 20, background: "#1a2f28" }} />
          <div style={{ fontSize: 12, color: "#0CC695", fontWeight: 600 }}>Market Maker Workstation</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11 }}>
          <span style={{ color: "#4a6a5a" }}><LiveDot /> LIVE</span>
          <span style={{ fontFamily: "monospace", color: "#6a8a7a" }}>{time.toLocaleTimeString()}</span>
          <span style={{ color: "#4a6a5a" }}>MM: ISEC Securities</span>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#0CC695", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "#0a1a14" }}>IS</div>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ background: "#0a1a14", borderBottom: "1px solid #1a2f28", display: "flex", paddingLeft: 12, overflowX: "auto" }}>
        {tabs.map((tab, i) => (
          <TabButton key={i} active={activeTab === i} onClick={() => setActiveTab(i)} count={tab.count}>
            <span>{tab.icon}</span> {tab.label}
          </TabButton>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <ActiveComponent />
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1a2f28", padding: "10px 20px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "#3a4a44", marginTop: 20 }}>
        <span>LAKSHYA Asset Management Pvt Ltd • Market Maker Portal v1.0</span>
        <span>iNAV Feed: WebSocket Connected • API: Healthy • Last Sync: {time.toLocaleTimeString()}</span>
        <span>Confidential — For authorized Market Makers only</span>
      </div>
    </div>
  );
}