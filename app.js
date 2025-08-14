// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Generate mock performance data
const points = 240; // months ~20 years
let equity = 100;
const series = [];
for (let i = 0; i < points; i++) {
  const r = (Math.random() - 0.4) * 0.04;
  equity *= 1 + r;
  series.push({ x: i, y: equity });
}

// Stats
const first = series[0].y;
const last = series[series.length - 1].y;
const years = points / 12;
const cagr = Math.pow(last / first, 1 / years) - 1;

// Max Drawdown
let peak = -Infinity, maxDD = 0;
series.forEach(p => {
  peak = Math.max(peak, p.y);
  const dd = (p.y - peak) / peak;
  maxDD = Math.min(maxDD, dd);
});

// Sharpe proxy
const rets = series.slice(1).map((p, i) => p.y / series[i].y - 1);
const avg = rets.reduce((a, b) => a + b, 0) / rets.length;
const varr = rets.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / rets.length;
const vol = Math.sqrt(varr) * Math.sqrt(12);
const sharpe = vol ? (avg * 12) / vol : 0;

// Fill stats
const pct = n => (n * 100).toFixed(1) + '%';
document.getElementById('cagr').textContent = pct(cagr);
document.getElementById('maxdd').textContent = pct(-maxDD);
document.getElementById('sharpe').textContent = sharpe.toFixed(2);

// Draw equity curve
const canvas = document.getElementById('equityChart');
const ctx = canvas.getContext('2d');
const pad = 32;
const w = canvas.width - pad * 2;
const h = canvas.height - pad * 2;
const minY = Math.min(...series.map(p => p.y));
const maxY = Math.max(...series.map(p => p.y));

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.translate(pad, pad);
ctx.strokeStyle = '#8ee6d3';
ctx.lineWidth = 2;
ctx.beginPath();
series.forEach((p, i) => {
  const x = (i / (series.length - 1)) * w;
  const y = h - ((p.y - minY) / (maxY - minY)) * h;
  if (i === 0) ctx.moveTo(x, y);
  else ctx.lineTo(x, y);
});
ctx.stroke();
ctx.translate(-pad, -pad);
