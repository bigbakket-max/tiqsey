import { fetchJsonSafely } from './safeFetch';

export type DnsCheckStatus = 'healthy' | 'misconfigured' | 'missing' | 'warning';

export interface DnsRecordHealthCheck {
  id: 'cname' | 'txt' | 'apex';
  recordType: 'CNAME' | 'TXT' | 'A / Apex';
  hostChecked: string;
  hostLabel: string;
  status: DnsCheckStatus;
  expected: string;
  found: string[];
  summary: string;
  remediation: string;
}

export interface DnsHealthReport {
  domain: string;
  isApex: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  passedChecks: number;
  totalChecks: number;
  resolver: string;
  scannedAt: string;
  source: 'server-api' | 'browser-doh';
  checks: DnsRecordHealthCheck[];
}

export interface DnsProviderSupportLink {
  id: string;
  provider: string;
  cnameArticleTitle: string;
  cnameUrl: string;
  txtArticleTitle: string;
  txtUrl: string;
  dashboardUrl: string;
}

export const DNS_PROVIDER_SUPPORT_ARTICLES: DnsProviderSupportLink[] = [
  {
    id: 'cloudflare',
    provider: 'Cloudflare',
    cnameArticleTitle: 'Manage DNS Records & CNAME Setup',
    cnameUrl: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/',
    txtArticleTitle: 'CNAME Flattening & TXT Verification Docs',
    txtUrl: 'https://developers.cloudflare.com/dns/cname-flattening/',
    dashboardUrl: 'https://dash.cloudflare.com',
  },
  {
    id: 'hostinger',
    provider: 'Hostinger',
    cnameArticleTitle: 'How to Manage CNAME Records in Hostinger',
    cnameUrl: 'https://support.hostinger.com/en/articles/4738777-how-to-manage-cname-records',
    txtArticleTitle: 'How to Manage TXT Records in Hostinger',
    txtUrl: 'https://support.hostinger.com/en/articles/1583227-how-to-manage-txt-records-in-hpanel',
    dashboardUrl: 'https://hpanel.hostinger.com',
  },
  {
    id: 'godaddy',
    provider: 'GoDaddy',
    cnameArticleTitle: 'Add a CNAME Record on GoDaddy',
    cnameUrl: 'https://www.godaddy.com/help/add-a-cname-record-19236',
    txtArticleTitle: 'Add a TXT Record on GoDaddy',
    txtUrl: 'https://www.godaddy.com/help/add-a-txt-record-19232',
    dashboardUrl: 'https://dcc.godaddy.com',
  },
  {
    id: 'namecheap',
    provider: 'Namecheap',
    cnameArticleTitle: 'How to Create a CNAME Record for Your Domain',
    cnameUrl: 'https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/',
    txtArticleTitle: 'How to Add a TXT Record in Namecheap',
    txtUrl: 'https://www.namecheap.com/support/knowledgebase/article.aspx/317/2237/how-do-i-add-txtspfdkimdmarc-records-for-my-domain/',
    dashboardUrl: 'https://ap.www.namecheap.com',
  },
  {
    id: 'squarespace',
    provider: 'Squarespace / Google Domains',
    cnameArticleTitle: 'Adding Custom DNS Records (CNAME & TXT)',
    cnameUrl: 'https://support.squarespace.com/hc/en-us/articles/360002101888-Adding-custom-DNS-records',
    txtArticleTitle: 'Accessing Your Squarespace Domain DNS Settings',
    txtUrl: 'https://support.squarespace.com/hc/en-us/articles/205812348-Accessing-your-Squarespace-managed-domain-s-DNS-settings',
    dashboardUrl: 'https://account.squarespace.com/domains',
  },
  {
    id: 'route53',
    provider: 'Amazon Route 53',
    cnameArticleTitle: 'Creating DNS Records in Route 53',
    cnameUrl: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html',
    txtArticleTitle: 'Supported DNS Record Types (CNAME & TXT)',
    txtUrl: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/ResourceRecordTypes.html',
    dashboardUrl: 'https://console.aws.amazon.com/route53',
  },
];

const STRICT_DOMAIN_REGEX =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export function sanitizeDomainInput(raw: string): string | null {
  const clean = (raw || '')
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.+$/, '');

  if (!clean || clean.length > 253) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(clean)) return null; // Reject IPv4
  if (clean === 'localhost' || clean.endsWith('.local') || clean.endsWith('.internal')) return null;
  if (!STRICT_DOMAIN_REGEX.test(clean)) return null;
  return clean;
}

interface GoogleDohAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface GoogleDohResponse {
  Status: number;
  Answer?: GoogleDohAnswer[];
}

async function queryGoogleDohDirect(
  name: string,
  type: 'CNAME' | 'TXT' | 'A' | 'AAAA'
): Promise<{ status: number; values: string[] }> {
  const typeCodeMap: Record<typeof type, number> = {
    A: 1,
    CNAME: 5,
    TXT: 16,
    AAAA: 28,
  };
  const expectedTypeCode = typeCodeMap[type];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/dns-json' },
      signal: controller.signal,
    });
    if (!resp.ok) {
      return { status: -1, values: [] };
    }
    const json = (await resp.json()) as GoogleDohResponse;
    const answers = Array.isArray(json.Answer) ? json.Answer : [];
    const values = answers
      .filter((a) => a.type === expectedTypeCode && typeof a.data === 'string')
      .map((a) => {
        const trimmed = a.data.trim();
        if (type === 'CNAME') return trimmed.replace(/\.+$/, '').toLowerCase();
        if (type === 'TXT') return trimmed.replace(/^"|"$/g, '').replace(/"\s*"/g, '');
        return trimmed;
      });
    return { status: json.Status, values };
  } catch {
    return { status: -1, values: [] };
  } finally {
    clearTimeout(timer);
  }
}

function evaluateDnsChecks(
  cleanDomain: string,
  targetHost: string,
  verificationToken: string,
  records: {
    cnameValues: string[];
    apexCnameValues: string[];
    txtRootValues: string[];
    txtChallengeValues: string[];
    aValues: string[];
    aaaaValues: string[];
  }
): DnsHealthReport {
  const parts = cleanDomain.split('.');
  const isApex = parts.length === 2;
  const cnameHost = isApex ? `www.${cleanDomain}` : cleanDomain;
  const txtPrimaryHost = isApex ? cleanDomain : `_tiqsey-challenge.${cleanDomain}`;
  const normalizedTarget = targetHost.trim().toLowerCase().replace(/\.+$/, '');

  // 1. Evaluate CNAME
  const allFoundCnames = Array.from(new Set([...records.cnameValues, ...records.apexCnameValues]));
  const cnameMatches = allFoundCnames.some((val) => val.toLowerCase() === normalizedTarget);

  let cnameCheck: DnsRecordHealthCheck;
  if (cnameMatches) {
    cnameCheck = {
      id: 'cname',
      recordType: 'CNAME',
      hostChecked: cnameHost,
      hostLabel: isApex ? 'www' : parts[0],
      status: 'healthy',
      expected: targetHost,
      found: allFoundCnames,
      summary: `CNAME record for ${cnameHost} correctly points to ${targetHost}.`,
      remediation: 'No action needed — traffic routing is configured properly.',
    };
  } else if (records.cnameValues.length > 0) {
    cnameCheck = {
      id: 'cname',
      recordType: 'CNAME',
      hostChecked: cnameHost,
      hostLabel: isApex ? 'www' : parts[0],
      status: 'misconfigured',
      expected: targetHost,
      found: records.cnameValues,
      summary: `CNAME record on ${cnameHost} points to "${records.cnameValues.join(', ')}" instead of "${targetHost}".`,
      remediation: `Edit the CNAME record for "${isApex ? 'www' : parts[0]}" in your DNS provider and replace the target value with ${targetHost}.`,
    };
  } else {
    cnameCheck = {
      id: 'cname',
      recordType: 'CNAME',
      hostChecked: cnameHost,
      hostLabel: isApex ? 'www' : parts[0],
      status: 'missing',
      expected: targetHost,
      found: [],
      summary: `No CNAME record was found for ${cnameHost}.`,
      remediation: `Create a new CNAME record with Host "${isApex ? 'www' : parts[0]}" pointing to ${targetHost}.`,
    };
  }

  // 2. Evaluate TXT verification record (check both root @ and _tiqsey-challenge)
  const combinedTxt = Array.from(new Set([...records.txtRootValues, ...records.txtChallengeValues]));
  const txtMatches = combinedTxt.some((val) => val.includes(verificationToken));

  let txtCheck: DnsRecordHealthCheck;
  if (txtMatches) {
    txtCheck = {
      id: 'txt',
      recordType: 'TXT',
      hostChecked: txtPrimaryHost,
      hostLabel: isApex ? '@' : '_tiqsey-challenge',
      status: 'healthy',
      expected: verificationToken,
      found: combinedTxt.filter((v) => v.includes(verificationToken)),
      summary: `Ownership TXT verification token detected and verified for ${cleanDomain}.`,
      remediation: 'No action needed — domain ownership token is verified.',
    };
  } else if (combinedTxt.length > 0) {
    txtCheck = {
      id: 'txt',
      recordType: 'TXT',
      hostChecked: txtPrimaryHost,
      hostLabel: isApex ? '@' : '_tiqsey-challenge',
      status: 'misconfigured',
      expected: verificationToken,
      found: combinedTxt.slice(0, 4),
      summary: `TXT records exist on ${txtPrimaryHost}, but none match the required Tiqsey verification token.`,
      remediation: `Add a new TXT record on "${isApex ? '@' : '_tiqsey-challenge'}" with the exact value "${verificationToken}" (keep existing SPF/email TXT records intact).`,
    };
  } else {
    txtCheck = {
      id: 'txt',
      recordType: 'TXT',
      hostChecked: txtPrimaryHost,
      hostLabel: isApex ? '@' : '_tiqsey-challenge',
      status: 'missing',
      expected: verificationToken,
      found: [],
      summary: `No TXT verification record was found on ${txtPrimaryHost}.`,
      remediation: `Add a TXT record with Host "${isApex ? '@' : '_tiqsey-challenge'}" and Value "${verificationToken}".`,
    };
  }

  const checks: DnsRecordHealthCheck[] = [cnameCheck, txtCheck];

  // 3. Apex routing check (for root domains like tiqsey.com)
  if (isApex) {
    const apexIps = [...records.aValues, ...records.aaaaValues];
    if (records.apexCnameValues.some((v) => v.toLowerCase() === normalizedTarget)) {
      checks.push({
        id: 'apex',
        recordType: 'A / Apex',
        hostChecked: cleanDomain,
        hostLabel: '@ (Root)',
        status: 'healthy',
        expected: `Flattened CNAME → ${targetHost} or 301 redirect to https://www.${cleanDomain}`,
        found: records.apexCnameValues,
        summary: `Root domain ${cleanDomain} resolves via flattened CNAME to ${targetHost}.`,
        remediation: 'No action needed.',
      });
    } else if (apexIps.length > 0) {
      checks.push({
        id: 'apex',
        recordType: 'A / Apex',
        hostChecked: cleanDomain,
        hostLabel: '@ (Root)',
        status: cnameCheck.status === 'healthy' ? 'warning' : 'misconfigured',
        expected: `Flattened CNAME → ${targetHost} or 301 forward to https://www.${cleanDomain}`,
        found: apexIps,
        summary:
          cnameCheck.status === 'healthy'
            ? `Root domain ${cleanDomain} resolves to IP(s) ${apexIps.join(', ')}. Ensure it forwards to https://www.${cleanDomain} or uses Cloudflare proxy.`
            : `Root domain ${cleanDomain} resolves to IP(s) ${apexIps.join(', ')} (likely registrar parking or another host) while CNAME is not yet configured.`,
        remediation: `In your DNS provider, either enable Cloudflare CNAME flattening on "@" pointing to ${targetHost} or set up a 301 redirect from ${cleanDomain} to https://www.${cleanDomain}.`,
      });
    } else {
      checks.push({
        id: 'apex',
        recordType: 'A / Apex',
        hostChecked: cleanDomain,
        hostLabel: '@ (Root)',
        status: 'missing',
        expected: `Flattened CNAME → ${targetHost} or 301 forward to https://www.${cleanDomain}`,
        found: [],
        summary: `No A, AAAA, or flattened CNAME record detected for root domain ${cleanDomain}.`,
        remediation: `Configure Cloudflare CNAME flattening on "@" or enable 301 Domain Forwarding to https://www.${cleanDomain}.`,
      });
    }
  }

  const passedChecks = checks.filter((c) => c.status === 'healthy').length;
  const hasCritical = checks.some(
    (c) => (c.id === 'cname' || c.id === 'txt') && (c.status === 'misconfigured' || c.status === 'missing')
  );
  const overallStatus: DnsHealthReport['overallStatus'] =
    passedChecks === checks.length ? 'healthy' : hasCritical ? 'critical' : 'warning';

  return {
    domain: cleanDomain,
    isApex,
    overallStatus,
    passedChecks,
    totalChecks: checks.length,
    resolver: 'Google Public DNS (dns.google)',
    scannedAt: new Date().toISOString(),
    source: 'browser-doh',
    checks,
  };
}

/**
 * Runs a live DNS health scan for CNAME, TXT, and Apex records.
 * Prefers the Node.js server endpoint and falls back automatically to direct
 * Google Public DNS-over-HTTPS queries when running on static hosting.
 */
export async function scanDomainDnsHealth(
  rawDomain: string,
  targetHost: string,
  verificationToken: string
): Promise<DnsHealthReport> {
  const cleanDomain = sanitizeDomainInput(rawDomain);
  if (!cleanDomain) {
    throw new Error('Please enter a valid public domain name (e.g. tiqsey.com or tickets.yourbrand.com).');
  }

  // 1. Try Node.js server endpoint first
  const serverRes = await fetchJsonSafely<{ success?: boolean; report?: DnsHealthReport; error?: string }>(
    '/api/custom-domain/scan-health',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: cleanDomain }),
    }
  );

  if (serverRes.isJson) {
    if (!serverRes.ok || !serverRes.data?.report) {
      throw new Error(serverRes.data?.error || 'DNS health scan failed.');
    }
    return serverRes.data.report;
  }

  // 2. Direct browser DNS-over-HTTPS fallback (works on Hostinger static hosting!)
  const parts = cleanDomain.split('.');
  const isApex = parts.length === 2;
  const cnameHost = isApex ? `www.${cleanDomain}` : cleanDomain;
  const challengeHost = `_tiqsey-challenge.${cleanDomain}`;

  const [cnameRes, apexCnameRes, txtRootRes, txtChallengeRes, aRes, aaaaRes] = await Promise.all([
    queryGoogleDohDirect(cnameHost, 'CNAME'),
    isApex ? queryGoogleDohDirect(cleanDomain, 'CNAME') : Promise.resolve({ status: 0, values: [] }),
    queryGoogleDohDirect(cleanDomain, 'TXT'),
    queryGoogleDohDirect(challengeHost, 'TXT'),
    isApex ? queryGoogleDohDirect(cleanDomain, 'A') : Promise.resolve({ status: 0, values: [] }),
    isApex ? queryGoogleDohDirect(cleanDomain, 'AAAA') : Promise.resolve({ status: 0, values: [] }),
  ]);

  if (cnameRes.status === -1 && txtRootRes.status === -1) {
    throw new Error('Unable to reach the DNS lookup API. Please check your internet connection and retry.');
  }

  return evaluateDnsChecks(cleanDomain, targetHost, verificationToken, {
    cnameValues: cnameRes.values,
    apexCnameValues: apexCnameRes.values,
    txtRootValues: txtRootRes.values,
    txtChallengeValues: txtChallengeRes.values,
    aValues: aRes.values,
    aaaaValues: aaaaRes.values,
  });
}
