const CHART_JS_URL = "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";

export function loadChartJs() {
  if (window.Chart) return Promise.resolve(window.Chart);

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CHART_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.Chart);
    script.onerror = () => {
      console.warn("Chart.js could not be loaded from CDN.");
      resolve(null);
    };
    document.head.appendChild(script);
  });
}
