import {
  PortfolioSummary,
  Stock,
  DigestResponse,
  TriggeredAlert,
  AlertThresholds,
  PullResearchReport
} from '../types';

const API_BASE = 'http://localhost:8000/api';

export async function fetchPortfolio(): Promise<PortfolioSummary> {
  const res = await fetch(`${API_BASE}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolio summary');
  return res.json();
}

export async function fetchStocks(): Promise<Stock[]> {
  const res = await fetch(`${API_BASE}/portfolio/stocks`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
}

export async function addStock(ticker: string, isAdhoc: boolean = true): Promise<any> {
  const res = await fetch(`${API_BASE}/portfolio/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker, is_adhoc: isAdhoc })
  });
  if (!res.ok) throw new Error('Failed to add ticker');
  return res.json();
}

export async function removeStock(ticker: string): Promise<any> {
  const res = await fetch(`${API_BASE}/portfolio/remove/${encodeURIComponent(ticker)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to remove ticker');
  return res.json();
}

export async function fetchDigest(
  window: string = '24h',
  includeRoutine: boolean = true,
  ticker?: string
): Promise<DigestResponse> {
  let url = `${API_BASE}/push/digest?window=${window}&include_routine=${includeRoutine}`;
  if (ticker) url += `&ticker=${encodeURIComponent(ticker)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch digest');
  return res.json();
}

export async function fetchAlerts(
  volumeThreshold?: number,
  priceThreshold?: number
): Promise<TriggeredAlert[]> {
  let url = `${API_BASE}/push/alerts`;
  const params: string[] = [];
  if (volumeThreshold !== undefined) params.push(`volume_threshold=${volumeThreshold}`);
  if (priceThreshold !== undefined) params.push(`price_threshold=${priceThreshold}`);
  if (params.length > 0) url += `?${params.join('&')}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchThresholds(): Promise<AlertThresholds> {
  const res = await fetch(`${API_BASE}/push/thresholds`);
  if (!res.ok) throw new Error('Failed to fetch thresholds');
  return res.json();
}

export async function saveThresholds(thresholds: AlertThresholds): Promise<AlertThresholds> {
  const res = await fetch(`${API_BASE}/push/thresholds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(thresholds)
  });
  if (!res.ok) throw new Error('Failed to save thresholds');
  return res.json();
}

export async function fetchResearch(ticker: string): Promise<PullResearchReport> {
  const res = await fetch(`${API_BASE}/pull/research/${encodeURIComponent(ticker)}`);
  if (!res.ok) throw new Error(`Failed to fetch research for ${ticker}`);
  return res.json();
}

export async function queryCopilot(ticker: string, question: string): Promise<any> {
  const res = await fetch(`${API_BASE}/pull/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker, question })
  });
  if (!res.ok) throw new Error('Failed to query copilot');
  return res.json();
}
