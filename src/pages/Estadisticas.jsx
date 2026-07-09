import React, { useMemo } from "react";
import "./Estadisticas.css";
import { useStats } from "../Context/StatsContext";
import { FiRefreshCw } from "react-icons/fi";

const colorsLight = {
  "chart-slice-1": "#0066cc", // Royal Blue
  "chart-slice-2": "#e65c00", // Bright Orange
  "chart-slice-3": "#10b981", // Emerald Green
  "donut-bg-ring": "#f3eadf",
  "donut-hole": "#ffffff",
  "radial-progress-bar": "#10b981"
};

const colorsDark = {
  "chart-slice-1": "#4d94ff", // Soft Electric Blue
  "chart-slice-2": "#ff8533", // Bright Orange-Coral
  "chart-slice-3": "#34d399", // Mint Green
  "donut-bg-ring": "#2b2b2b",
  "donut-hole": "#1e1e1e",
  "radial-progress-bar": "#34d399"
};

function DonutChart({ data }) {
  const parsedData = data.map(item => ({
    ...item,
    numericValue: parseFloat(item.value) || 0
  }));
  const total = parsedData.reduce((sum, item) => sum + item.numericValue, 0) || 1;
  let accumulatedLength = 0;
  const radius = 38;
  const strokeLength = 2 * Math.PI * radius; // ~238.76

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    setIsDarkMode(document.body.classList.contains("dark-mode"));
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const themeColors = isDarkMode ? colorsDark : colorsLight;

  return (
    <div className="donut-chart-wrapper">
      <div className="donut-svg-container">
        <svg viewBox="0 0 100 100" className="donut-svg">
          {/* Base background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="transparent" 
            stroke={themeColors["donut-bg-ring"]}
            strokeWidth="12" 
          />
          {parsedData.map((item, index) => {
            const percentage = item.numericValue / total;
            const strokeDash = strokeLength * percentage;
            const currentOffset = -accumulatedLength;
            accumulatedLength += strokeDash;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={themeColors[item.className]}
                strokeWidth="12"
                strokeDasharray={`${strokeDash.toFixed(1)} ${strokeLength.toFixed(1)}`}
                strokeDashoffset={`${currentOffset.toFixed(1)}`}
                transform="rotate(-90 50 50)"
              />
            );
          })}
          {/* Donut center */}
          <circle 
            cx="50" 
            cy="50" 
            r={28} 
            fill={themeColors["donut-hole"]} 
          />
        </svg>
      </div>
      <div className="donut-legend">
        {parsedData.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.numericValue / total) * 100) : 0;
          return (
            <div key={index} className="legend-item">
              <span className={`legend-dot ${item.className}`} />
              <span className="legend-text">
                <strong>{item.label}:</strong> {item.formattedValue} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RadialProgress({ percentage }) {
  const numericPercentage = parseFloat(percentage) || 0;
  const radius = 38;
  const strokeLength = 2 * Math.PI * radius; // ~238.76
  const strokeDash = strokeLength * (numericPercentage / 100);
  const strokeOffset = strokeLength - strokeDash;

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    setIsDarkMode(document.body.classList.contains("dark-mode"));
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const themeColors = isDarkMode ? colorsDark : colorsLight;

  return (
    <div className="radial-progress-wrapper">
      <svg viewBox="0 0 100 100" width="60" height="60">
        <circle 
          cx="50" 
          cy="50" 
          r={radius} 
          fill="transparent" 
          stroke={themeColors["donut-bg-ring"]} 
          strokeWidth="8" 
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={themeColors["radial-progress-bar"]}
          strokeWidth="8"
          strokeDasharray={`${strokeLength.toFixed(1)} ${strokeLength.toFixed(1)}`}
          strokeDashoffset={`${strokeOffset.toFixed(1)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="radial-progress-text" style={{ fontSize: "11px" }}>
        {numericPercentage}%
      </div>
    </div>
  );
}

export default function Estadisticas() {
  const {
    comisiones,
    ventas,
    ingresos,
    usuarios,
    loading,
    error,
    ts,
    refresh,
  } = useStats();

  const currency = (n) =>
    typeof n === "number" ? `$${n.toLocaleString("es-CO")}` : n === 0 ? "$0" : "-";
  const numberf = (n) => (typeof n === "number" ? n.toLocaleString("es-CO") : "-");

  const getBorderClass = (value) => {
    if (value === undefined || value === null || value === "" || value === "-") {
      return "border-danger";
    }
    let num = value;
    if (typeof value === "string") {
      const cleanVal = value.replace(/[$\s.]/g, "").replace(/,/g, ".");
      const parsed = parseFloat(cleanVal);
      if (!isNaN(parsed)) {
        num = parsed;
      } else {
        return value.trim() !== "" ? "border-success" : "border-danger";
      }
    }
    return num > 0 ? "border-success" : "border-danger";
  };

  const porcentajeCompran = useMemo(() => {
    if (!usuarios) return null;
    const { total_clientes_registrados: total, total_clientes_con_compras: con } = usuarios;
    if (!total || total === 0) return 0;
    return Math.round((con / total) * 100);
  }, [usuarios]);

  // ===== Cálculos para Resumen de ventas =====
  const domCli = ventas?.dominios_a_clientes ?? 0;
  const domDist = ventas?.dominios_a_distribuidores ?? 0;
  const totalDom = ventas?.total_dominios_vendidos ?? 0;
  const packs = ventas?.paquetes_vendidos ?? 0;

  const pctCli = totalDom ? Math.round((domCli / totalDom) * 100) : 0;
  const pctDist = totalDom ? Math.round((domDist / totalDom) * 100) : 0;

  const ingresosData = useMemo(() => [
    { label: "Dominios Clientes", value: ingresos?.por_dominios_clientes ?? 0, className: "chart-slice-1", formattedValue: currency(ingresos?.por_dominios_clientes) },
    { label: "Dominios Distribuidores", value: ingresos?.por_dominios_distribuidores ?? 0, className: "chart-slice-2", formattedValue: currency(ingresos?.por_dominios_distribuidores) },
    { label: "Paquetes de Hosting", value: ingresos?.por_venta_paquetes ?? 0, className: "chart-slice-3", formattedValue: currency(ingresos?.por_venta_paquetes) }
  ], [ingresos]);

  const dominiosData = useMemo(() => [
    { label: "Clientes", value: domCli, className: "chart-slice-1", formattedValue: numberf(domCli) },
    { label: "Distribuidores", value: domDist, className: "chart-slice-2", formattedValue: numberf(domDist) }
  ], [domCli, domDist]);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Estadísticas</h2>
        <div className="header-actions">
          {ts && <span className="last-update">Actualizado: {new Date(ts).toLocaleString("es-CO")}</span>}
          <button className="btn-refresh" onClick={refresh} disabled={loading} title="Actualizar">
            <FiRefreshCw className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {error && <div className="stats-error">⚠️ {error}</div>}

      {/* ======== GRID PRINCIPAL DE KPIs ======== */}
      <section className="kpi-grid">
        <article className={`kpi-card ${getBorderClass(ingresos?.total_general)}`}>
          <div className="kpi-title">Ingresos (Total general)</div>
          <div className="kpi-value">{currency(ingresos?.total_general)}</div>
          <div className="kpi-sub">
            Último mes: <strong>{currency(ingresos?.total_ultimo_mes)}</strong>
          </div>
        </article>

        <article className={`kpi-card ${getBorderClass(comisiones?.comisiones_distribuidores)}`}>
          <div className="kpi-title">Comisiones distribuidores</div>
          <div className="kpi-value">{currency(comisiones?.comisiones_distribuidores)}</div>
          <div className="kpi-sub">Acumulado</div>
        </article>

        <article className={`kpi-card ${getBorderClass(ventas?.total_dominios_vendidos)}`}>
          <div className="kpi-title">Dominios vendidos</div>
          <div className="kpi-value">{numberf(ventas?.total_dominios_vendidos)}</div>
          <div className="kpi-sub">
            Clientes: <strong>{numberf(ventas?.dominios_a_clientes)}</strong> ·{" "}
            Dist: <strong>{numberf(ventas?.dominios_a_distribuidores)}</strong>
          </div>
        </article>

        <article className={`kpi-card ${getBorderClass(ventas?.paquetes_vendidos)}`}>
          <div className="kpi-title">Paquetes vendidos</div>
          <div className="kpi-value">{numberf(ventas?.paquetes_vendidos)}</div>
          <div className="kpi-sub">Total histórico</div>
        </article>
      </section>

      {/* ======== DETALLE DE INGRESOS CON GRÁFICA ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Desglose de ingresos</h3>
        </div>
        <div className="panel-flex-layout">
          <DonutChart data={ingresosData} />
          
          <div className="panel-grid flex-1">
            <div className={`panel-item ${getBorderClass(ingresos?.por_dominios_clientes)}`}>
              <span className="label">Por dominios a clientes</span>
              <span className="value">{currency(ingresos?.por_dominios_clientes)}</span>
            </div>
            <div className={`panel-item ${getBorderClass(ingresos?.por_dominios_distribuidores)}`}>
              <span className="label">Por dominios a distribuidores</span>
              <span className="value">{currency(ingresos?.por_dominios_distribuidores)}</span>
            </div>
            <div className={`panel-item ${getBorderClass(ingresos?.por_venta_paquetes)}`}>
              <span className="label">Por venta de paquetes</span>
              <span className="value">{currency(ingresos?.por_venta_paquetes)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======== USUARIOS / DISTRIBUIDORES CON RADIAL PROGRESS ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Usuarios y Conversión</h3>
        </div>
        <div className="panel-grid">
          <div className={`panel-item ${getBorderClass(usuarios?.total_clientes_registrados)}`}>
            <span className="label">Clientes registrados</span>
            <span className="value">{numberf(usuarios?.total_clientes_registrados)}</span>
          </div>
          <div className={`panel-item ${getBorderClass(usuarios?.total_clientes_con_compras)} conversion-card`}>
            <div className="conversion-info">
              <span className="label">Clientes con compras</span>
              <span className="value">{numberf(usuarios?.total_clientes_con_compras)}</span>
            </div>
            {typeof porcentajeCompran === "number" && (
              <RadialProgress percentage={porcentajeCompran} />
            )}
          </div>
          <div className={`panel-item ${getBorderClass(usuarios?.distribuidor_mas_compro)}`}>
            <span className="label">Distribuidor que más compró</span>
            <span className="value">{usuarios?.distribuidor_mas_compro || "-"}</span>
          </div>
          <div className={`panel-item ${getBorderClass(usuarios?.distribuidor_menos_compro)}`}>
            <span className="label">Distribuidor que menos compró</span>
            <span className="value">{usuarios?.distribuidor_menos_compro || "-"}</span>
          </div>
        </div>
      </section>

      {/* ======== RESUMEN DE VENTAS CON GRÁFICA ======== */}
      <section className="panel">
        <div className="panel-header">
          <h3>Resumen y Distribución de Ventas</h3>
        </div>

        <div className="panel-flex-layout">
          <DonutChart data={dominiosData} />

          <div className="resumen-ventas-grid flex-1">
            {/* Dominios a clientes */}
            <article className="resumen-card">
              <div className="resumen-card-header">
                <span className="resumen-icon">👤</span>
                <h4>Dominios a clientes</h4>
              </div>
              <div className="resumen-value">{numberf(domCli)}</div>
              <div className="resumen-sub">Participación</div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${pctCli}%` }} />
              </div>
              <div className="bar-legend">
                <span>{pctCli}%</span>
                <span>de {numberf(totalDom)} dominios</span>
              </div>
            </article>

            {/* Dominios a distribuidores */}
            <article className="resumen-card">
              <div className="resumen-card-header">
                <span className="resumen-icon">🏷️</span>
                <h4>Dominios a distribuidores</h4>
              </div>
              <div className="resumen-value">{numberf(domDist)}</div>
              <div className="resumen-sub">Participación</div>
              <div className="bar">
                <div className="bar-fill alt" style={{ width: `${pctDist}%` }} />
              </div>
              <div className="bar-legend">
                <span>{pctDist}%</span>
                <span>de {numberf(totalDom)} dominios</span>
              </div>
            </article>

            {/* Total dominios */}
            <article className="resumen-card highlight">
              <div className="resumen-card-header">
                <span className="resumen-icon">🌐</span>
                <h4>Total dominios vendidos</h4>
              </div>
              <div className="resumen-value big">{numberf(totalDom)}</div>
              <div className="pill-row">
                <span className="pill">Clientes: {numberf(domCli)}</span>
                <span className="pill">Distribuidores: {numberf(domDist)}</span>
              </div>
            </article>

            {/* Paquetes */}
            <article className="resumen-card">
              <div className="resumen-card-header">
                <span className="resumen-icon">📦</span>
                <h4>Paquetes vendidos</h4>
              </div>
              <div className="resumen-value">{numberf(packs)}</div>
              <div className="resumen-sub">Total histórico</div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
