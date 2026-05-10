import { AnalysisResult, UserInput } from './types';

function getRiskColor(score: number): string {
  if (score > 75) return '#ef4444';
  if (score > 50) return '#f97316';
  if (score > 25) return '#eab308';
  return '#22c55e';
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function generateShareCardCanvas(
  result: AnalysisResult,
  userInput: UserInput
): HTMLCanvasElement {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Background gradient ──────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── Decorative glow blob (top-right) ─────────────────────────
  const glow = ctx.createRadialGradient(W, 0, 10, W, 0, 480);
  glow.addColorStop(0, 'rgba(59,130,246,0.22)');
  glow.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Subtle grid lines ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const riskColor = getRiskColor(result.riskScore);

  // ── Top label ─────────────────────────────────────────────────
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('AI AUTOMATION EXPOSURE', 60, 70);
  ctx.letterSpacing = '0px';

  // ── Job title ─────────────────────────────────────────────────
  ctx.fillStyle = '#94a3b8';
  ctx.font = '32px system-ui, -apple-system, sans-serif';
  ctx.fillText('Role:', 60, 125);
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillText(userInput.jobTitle, 118, 125);

  // ── Score circle ─────────────────────────────────────────────
  const cx = 200, cy = 340, radius = 110;

  // Outer ring background
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `${riskColor}33`;
  ctx.lineWidth = 14;
  ctx.stroke();

  // Progress arc
  const pct = result.riskScore / 100;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
  ctx.strokeStyle = riskColor;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Glow
  ctx.shadowColor = riskColor;
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
  ctx.strokeStyle = riskColor;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Score number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 68px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${result.riskScore}%`, cx, cy + 12);

  // Risk label
  ctx.fillStyle = riskColor;
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.riskLabel, cx, cy + 46);
  ctx.textAlign = 'left';

  // ── Right column cards ────────────────────────────────────────
  const cardX = 360;
  const cardW = 780;

  // Verdict box
  drawRoundedRect(ctx, cardX, 160, cardW, 110, 16);
  ctx.fillStyle = 'rgba(15,23,42,0.65)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  ctx.fillText('VERDICT', cardX + 20, 186);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 19px system-ui, -apple-system, sans-serif';
  const verdictLines = wrapText(ctx, result.verdict, cardW - 40);
  verdictLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, cardX + 20, 210 + i * 26);
  });

  // Stats row: Human Advantage & Career Moat
  const statY = 295;
  const statH = 90;
  const halfW = (cardW - 12) / 2;

  // Card 1 — Human Advantage
  drawRoundedRect(ctx, cardX, statY, halfW, statH, 14);
  const g1 = ctx.createLinearGradient(cardX, statY, cardX + halfW, statY + statH);
  g1.addColorStop(0, 'rgba(99,102,241,0.18)');
  g1.addColorStop(1, 'rgba(15,23,42,0.6)');
  ctx.fillStyle = g1;
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,102,241,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText('Human Advantage', cardX + 16, statY + 24);
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(result.humanAdvantage, cardX + 16, statY + 58);

  // Card 2 — Career Moat
  const card2X = cardX + halfW + 12;
  drawRoundedRect(ctx, card2X, statY, halfW, statH, 14);
  const g2 = ctx.createLinearGradient(card2X, statY, card2X + halfW, statY + statH);
  g2.addColorStop(0, 'rgba(59,130,246,0.18)');
  g2.addColorStop(1, 'rgba(15,23,42,0.6)');
  ctx.fillStyle = g2;
  ctx.fill();
  ctx.strokeStyle = 'rgba(59,130,246,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText('Career Moat Score', card2X + 16, statY + 24);
  ctx.fillStyle = '#60a5fa';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(`${result.careerMoatScore} / 100`, card2X + 16, statY + 58);

  // ── Skills tags ───────────────────────────────────────────────
  const skillsY = 410;
  ctx.fillStyle = '#64748b';
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillText('SKILLS TO BUILD', cardX, skillsY);

  let tagX = cardX;
  const tagY = skillsY + 14;
  const tags = result.skillsToBuild.slice(0, 4);
  ctx.font = '600 14px system-ui, -apple-system, sans-serif';
  for (const tag of tags) {
    const tw = ctx.measureText(tag).width + 24;
    if (tagX + tw > cardX + cardW) break;
    drawRoundedRect(ctx, tagX, tagY, tw, 32, 8);
    ctx.fillStyle = 'rgba(99,102,241,0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(99,102,241,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(tag, tagX + 12, tagY + 21);
    tagX += tw + 10;
  }

  // ── Bottom bar ─────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(0, H - 68, W, 68);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('amireplaceablebyai.vercel.app', 60, H - 28);

  ctx.fillStyle = '#475569';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('For education & entertainment only', W - 60, H - 28);
  ctx.textAlign = 'left';

  return canvas;
}

export function downloadCanvasCard(result: AnalysisResult, userInput: UserInput) {
  const canvas = generateShareCardCanvas(result, userInput);
  const filename = `ai-risk-${userInput.jobTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
