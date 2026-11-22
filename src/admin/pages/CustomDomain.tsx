import React, { useState, useEffect } from 'react';
import {
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Server,
  Sparkles,
  Trash2,
  Layers,
  Info,
  Zap,
  Lock,
  BookOpen,
  XCircle
} from 'lucide-react';
import { fetchJsonSafely } from '../../utils/safeFetch';
import {
  scanDomainDnsHealth,
  sanitizeDomainInput,
  DNS_PROVIDER_SUPPORT_ARTICLES,
  type DnsHealthReport,
  type DnsRecordHealthCheck
} from '../../utils/dnsHealthScanner';

const LOCAL_DOMAIN_STORAGE_KEY = 'tiqsey_custom_domain_config';
const DEFAULT_TARGET_HOST = 'ais-pre-3xmqqplj6iyf7445xaenj4-389000849295.asia-southeast1.run.app';
const DEFAULT_VERIFICATION_TOKEN = 'tiqsey-site-verification=8be44669-b47a-4636-9b11-7512a6d26a0e';

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
  description: string;
  recommended?: boolean;
}

interface DomainSettings {
  id: string;
  domain: string;
  subdomain: string;
  targetHost: string;
  provider: string;
  verificationStatus: 'verified' | 'propagating' | 'pending' | 'unresolved';
  sslStatus: 'active' | 'pending';
  verifiedAt?: string;
  lastCheckedAt?: string;
  notes?: string;
  dnsRecords?: {
    domain: string;
    rootDomain: string;
    subdomain: string;
    isApex: boolean;
    targetHost: string;
    records: DnsRecord[];
  };
}

function readLocalDomainSettings(): DomainSettings | null {
  try {
    const raw = localStorage.getItem(LOCAL_DOMAIN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.domain === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalDomainSettings(settings: DomainSettings | null) {
  try {
    if (settings) {
      localStorage.setItem(LOCAL_DOMAIN_STORAGE_KEY, JSON.stringify(settings));
    } else {
      localStorage.removeItem(LOCAL_DOMAIN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota errors
  }
}

function statusFromHealthReport(report: DnsHealthReport): 'verified' | 'propagating' | 'unresolved' {
  const cnameCheck = report.checks.find((c) => c.id === 'cname');
  const txtCheck = report.checks.find((c) => c.id === 'txt');
  if (cnameCheck?.status === 'healthy' && txtCheck?.status === 'healthy') {
    return 'verified';
  }
  if (cnameCheck?.status === 'healthy' || txtCheck?.status === 'healthy' || report.checks.some((c) => c.found.length > 0)) {
    return 'propagating';
  }
  return 'unresolved';
}

export default function CustomDomain() {
  const [domainInput, setDomainInput] = useState('');
  const [provider, setProvider] = useState('cloudflare');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [scanningHealth, setScanningHealth] = useState(false);
  const [healthReport, setHealthReport] = useState<DnsHealthReport | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<DomainSettings | null>(null);
  const [targetHost, setTargetHost] = useState(DEFAULT_TARGET_HOST);
  const [verificationToken, setVerificationToken] = useState(DEFAULT_VERIFICATION_TOKEN);
  const [cloudRegion, setCloudRegion] = useState('asia-southeast1');
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string; details?: any } | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'cloudflare' | 'hostinger' | 'godaddy' | 'namecheap' | 'universal'>('cloudflare');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch initial domain settings (Node API with static Hostinger localStorage fallback)
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetchJsonSafely<any>('/api/custom-domain');
      if (res.isJson && res.ok && res.data) {
        const data = res.data;
        if (data.targetHost) setTargetHost(data.targetHost);
        if (data.verificationToken) setVerificationToken(data.verificationToken);
        if (data.cloudRegion) setCloudRegion(data.cloudRegion);

        if (data.configured && data.settings) {
          setSettings(data.settings);
          setDomainInput(data.settings.domain);
          if (data.settings.provider) {
            setProvider(data.settings.provider);
            if (['cloudflare', 'hostinger', 'godaddy', 'namecheap'].includes(data.settings.provider)) {
              setActiveGuideTab(data.settings.provider as any);
            }
          }
          writeLocalDomainSettings(data.settings);
          return;
        }
      }

      const cached = readLocalDomainSettings();
      if (cached) {
        setSettings(cached);
        setDomainInput(cached.domain);
        if (cached.provider) {
          setProvider(cached.provider);
          if (['cloudflare', 'hostinger', 'godaddy', 'namecheap'].includes(cached.provider)) {
            setActiveGuideTab(cached.provider as any);
          }
        }
      } else {
        setSettings(null);
        setDomainInput((prev) => prev || 'tiqsey.com');
      }
    } catch (err) {
      console.error('Failed to load custom domain configuration', err);
      const cached = readLocalDomainSettings();
      if (cached) {
        setSettings(cached);
        setDomainInput(cached.domain);
      } else {
        setDomainInput((prev) => prev || 'tiqsey.com');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeDomainInput(domainInput);
    if (!clean) {
      setVerifyMessage({
        type: 'error',
        text: 'Please enter a valid public domain name (e.g. tiqsey.com or tickets.yourbrand.com)'
      });
      return;
    }

    try {
      setSaving(true);
      setVerifyMessage(null);
      const res = await fetchJsonSafely<any>('/api/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: clean, provider })
      });

      if (res.isJson) {
        if (!res.ok) throw new Error(res.data?.error || 'Failed to save custom domain');
        setSettings(res.data.settings);
        writeLocalDomainSettings(res.data.settings);
        setVerifyMessage({
          type: res.data.settings.verificationStatus === 'verified' ? 'success' : 'info',
          text: res.data.message || `Custom domain ${clean} saved.`,
          details: res.data.diagnostics
        });
      } else {
        // Static hosting fallback (persist in localStorage)
        const parts = clean.split('.');
        const localSettings: DomainSettings = {
          id: 'local-domain',
          domain: clean,
          subdomain: parts.length === 2 ? 'www' : parts[0],
          targetHost,
          provider,
          verificationStatus: 'pending',
          sslStatus: 'pending',
          lastCheckedAt: new Date().toISOString()
        };
        setSettings(localSettings);
        writeLocalDomainSettings(localSettings);
        setVerifyMessage({
          type: 'info',
          text: `Saved ${clean} configuration. Click "Scan Health" to query live DNS records for CNAME and TXT status.`
        });
      }
    } catch (err: any) {
      setVerifyMessage({
        type: 'error',
        text: err.message || 'An error occurred while saving domain configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleScanHealth = async () => {
    const candidate = domainInput.trim() || settings?.domain || 'tiqsey.com';
    const clean = sanitizeDomainInput(candidate);
    if (!clean) {
      setHealthError('Please enter a valid public domain name (e.g. tiqsey.com or www.tiqsey.com) before scanning.');
      return;
    }

    try {
      setScanningHealth(true);
      setHealthError(null);
      const report = await scanDomainDnsHealth(clean, targetHost, verificationToken);
      setHealthReport(report);

      if (settings && settings.domain.toLowerCase() === clean.toLowerCase()) {
        const nextStatus = statusFromHealthReport(report);
        const updated: DomainSettings = {
          ...settings,
          verificationStatus: nextStatus,
          sslStatus: nextStatus === 'verified' ? 'active' : 'pending',
          lastCheckedAt: report.scannedAt
        };
        setSettings(updated);
        writeLocalDomainSettings(updated);
      }
    } catch (err: any) {
      setHealthError(err.message || 'Unable to complete DNS health scan. Please try again.');
    } finally {
      setScanningHealth(false);
    }
  };

  const handleVerifyDns = async () => {
    const candidate = settings?.domain || domainInput || 'tiqsey.com';
    const clean = sanitizeDomainInput(candidate);
    if (!clean) {
      setVerifyMessage({
        type: 'error',
        text: 'Please enter a valid domain name before verifying DNS.'
      });
      return;
    }

    try {
      setVerifying(true);
      setVerifyMessage(null);
      setHealthError(null);

      const res = await fetchJsonSafely<any>('/api/custom-domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: clean })
      });

      if (res.isJson) {
        if (!res.ok) throw new Error(res.data?.error || 'Verification request failed');
        const data = res.data;

        if (data.report) {
          setHealthReport(data.report);
        }

        if (settings) {
          const updated: DomainSettings = {
            ...settings,
            verificationStatus: data.status,
            sslStatus: data.sslStatus,
            lastCheckedAt: data.lastCheckedAt
          };
          setSettings(updated);
          writeLocalDomainSettings(updated);
        }

        const diag = data.diagnostics;
        if (data.verified) {
          setVerifyMessage({
            type: 'success',
            text: `Verification successful! Domain ${data.domain} has valid CNAME and TXT DNS records pointing to your Tiqsey application.`,
            details: diag
          });
        } else if (data.status === 'propagating') {
          setVerifyMessage({
            type: 'warning',
            text: `Some DNS records were detected for ${data.domain}, but CNAME or TXT verification is still incomplete or propagating. See the DNS Health Report below.`,
            details: diag
          });
        } else {
          setVerifyMessage({
            type: 'error',
            text: `No matching CNAME record pointing to ${targetHost} was detected yet for ${data.domain}. Review the DNS Health Report below to fix it.`,
            details: diag
          });
        }
        return;
      }

      // Static hosting fallback: run live browser DNS-over-HTTPS scan directly
      const report = await scanDomainDnsHealth(clean, targetHost, verificationToken);
      setHealthReport(report);
      const nextStatus = statusFromHealthReport(report);
      if (settings) {
        const updated: DomainSettings = {
          ...settings,
          verificationStatus: nextStatus,
          sslStatus: nextStatus === 'verified' ? 'active' : 'pending',
          lastCheckedAt: report.scannedAt
        };
        setSettings(updated);
        writeLocalDomainSettings(updated);
      }

      if (nextStatus === 'verified') {
        setVerifyMessage({
          type: 'success',
          text: `Verification successful! Both CNAME and TXT records are properly configured for ${clean}.`
        });
      } else if (nextStatus === 'propagating') {
        setVerifyMessage({
          type: 'warning',
          text: `Partial DNS records found for ${clean}. Check the DNS Health Scanner report below for misconfigured or missing CNAME/TXT records.`
        });
      } else {
        setVerifyMessage({
          type: 'error',
          text: `Required CNAME and TXT records were not detected yet for ${clean}. See the DNS Health Scanner report below.`
        });
      }
    } catch (err: any) {
      setVerifyMessage({
        type: 'error',
        text: err.message || 'DNS check failed. Please check your network connection.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDeleteDomain = async () => {
    try {
      setSaving(true);
      await fetchJsonSafely('/api/custom-domain', { method: 'DELETE' });
      setSettings(null);
      setHealthReport(null);
      writeLocalDomainSettings(null);
      setDomainInput('tiqsey.com');
      setVerifyMessage({
        type: 'info',
        text: 'Custom domain removed. Application is running on default Cloud Run address.'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const currentDomain = sanitizeDomainInput(domainInput) || settings?.domain || 'tiqsey.com';
  const isApex = currentDomain.split('.').length === 2;
  const subdomain = isApex ? 'www' : currentDomain.split('.')[0];

  const hasRecordIssues = Boolean(
    healthReport && healthReport.checks.some((c) => c.status === 'misconfigured' || c.status === 'missing')
  );

  // Order DNS provider support articles so the user's selected provider appears first
  const orderedSupportArticles = [...DNS_PROVIDER_SUPPORT_ARTICLES].sort((a, b) => {
    if (a.id === provider) return -1;
    if (b.id === provider) return 1;
    return 0;
  });

  const renderCheckStatusBadge = (status: DnsRecordHealthCheck['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Healthy
          </span>
        );
      case 'misconfigured':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800/70">
            <XCircle className="w-3.5 h-3.5" />
            Misconfigured
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800/70">
            <AlertCircle className="w-3.5 h-3.5" />
            Missing Record
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70">
            <AlertTriangle className="w-3.5 h-3.5" />
            Review Recommended
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold tracking-wide border border-sky-400/20">
            <Globe className="w-3.5 h-3.5" />
            <span>Storefront Branding & Routing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Custom Domain Management
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-normal leading-relaxed">
            Connect your branded domain (e.g. <span className="text-sky-300 font-mono font-medium">tiqsey.com</span> or <span className="text-sky-300 font-mono font-medium">tickets.yourbrand.com</span>) to your Tiqsey marketplace with free automatic SSL & global CDN delivery.
          </p>
        </div>

        {/* Status Chip */}
        <div className="shrink-0 relative z-10">
          {settings?.verificationStatus === 'verified' ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500/15 border border-emerald-400/30 rounded-2xl text-emerald-300 text-sm font-bold shadow-lg shadow-emerald-950/20 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Domain Connected & Active</span>
            </div>
          ) : settings?.verificationStatus === 'propagating' ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-amber-500/15 border border-amber-400/30 rounded-2xl text-amber-300 text-sm font-bold shadow-lg shadow-amber-950/20 backdrop-blur-md">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" />
              <span>DNS Propagating (2-15m)</span>
            </div>
          ) : settings ? (
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-sky-500/15 border border-sky-400/30 rounded-2xl text-sky-200 text-sm font-bold shadow-lg shadow-sky-950/20 backdrop-blur-md">
              <AlertCircle className="w-4 h-4 text-sky-400" />
              <span>Action Required: Add DNS</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-300 text-sm font-semibold">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Default Cloud Run URL</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Connection Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Domain Setup Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Domain Setup</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure your root or subdomain</p>
              </div>
            </div>

            <form onSubmit={handleSaveDomain} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Domain Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="e.g. tiqsey.com or tickets.brand.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Works with apex domains (<span className="font-mono">example.com</span>) or subdomains (<span className="font-mono">www.example.com</span>).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  DNS Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => {
                    setProvider(e.target.value);
                    if (['cloudflare', 'hostinger', 'godaddy', 'namecheap'].includes(e.target.value)) {
                      setActiveGuideTab(e.target.value as any);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
                >
                  <option value="cloudflare">Cloudflare (Recommended - Free SSL & Proxy)</option>
                  <option value="hostinger">Hostinger</option>
                  <option value="godaddy">GoDaddy</option>
                  <option value="namecheap">Namecheap</option>
                  <option value="squarespace">Google Domains / Squarespace</option>
                  <option value="route53">Amazon Route 53</option>
                  <option value="universal">Other / General DNS Registrar</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs md:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Domain...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{settings ? 'Update Configuration' : 'Connect Domain & Generate DNS'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleScanHealth}
                  disabled={scanningHealth || loading}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs md:text-sm shadow-md shadow-emerald-600/15 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {scanningHealth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Live DNS Records...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Scan Health</span>
                    </>
                  )}
                </button>

                {settings && (
                  <button
                    type="button"
                    onClick={handleVerifyDns}
                    disabled={verifying}
                    className="w-full min-h-[44px] py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin text-sky-500' : ''}`} />
                    <span>{verifying ? 'Checking DNS Propagation...' : 'Check DNS & Verify Now'}</span>
                  </button>
                )}
              </div>
            </form>

            {settings && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">
                  Last checked: {settings.lastCheckedAt ? new Date(settings.lastCheckedAt).toLocaleTimeString() : 'Just now'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-500 hover:text-red-600 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>

          {/* Infrastructure Specs Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-500" />
              <span>Target Cloud Run Deployment</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 border border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-medium">Canonical Target Host</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold break-all text-[11.5px]">
                    {targetHost}
                  </span>
                  <button
                    onClick={() => handleCopy(targetHost, 'target_host_btn')}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors shrink-0 text-slate-500"
                    title="Copy Target Host"
                  >
                    {copiedId === 'target_host_btn' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Region</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{cloudRegion}</p>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">SSL / TLS</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Auto-Managed</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Required DNS Records & Step-by-Step Guides */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification / Feedback Banner */}
          {verifyMessage && (
            <div className={`p-4 rounded-2xl border text-sm font-medium flex items-start gap-3 transition-all ${
              verifyMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
                : verifyMessage.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : verifyMessage.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                : 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-200'
            }`}>
              <div className="shrink-0 mt-0.5">
                {verifyMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {verifyMessage.type === 'warning' && <Clock className="w-5 h-5 text-amber-500" />}
                {verifyMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {verifyMessage.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
              </div>
              <div className="space-y-1 flex-1">
                <p className="leading-snug">{verifyMessage.text}</p>
                {verifyMessage.details && (
                  <div className="text-xs opacity-80 pt-1 font-mono">
                    {verifyMessage.details.cnameFound?.length > 0 && (
                      <p>Found CNAME: {verifyMessage.details.cnameFound.join(', ')}</p>
                    )}
                    {verifyMessage.details.aRecords?.length > 0 && (
                      <p>Found A IPs: {verifyMessage.details.aRecords.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live DNS Health Scanner Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  healthReport?.overallStatus === 'healthy'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : healthReport?.overallStatus === 'critical'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : healthReport?.overallStatus === 'warning'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                }`}>
                  {healthReport?.overallStatus === 'critical' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : healthReport?.overallStatus === 'healthy' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <Activity className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Live DNS Health Scanner
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Queries live CNAME, TXT, and Apex DNS records via Google Public DNS to detect misconfigurations.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleScanHealth}
                disabled={scanningHealth}
                className="shrink-0 min-h-[40px] px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${scanningHealth ? 'animate-spin' : ''}`} />
                <span>{scanningHealth ? 'Scanning...' : healthReport ? 'Re-scan Health' : 'Scan Health'}</span>
              </button>
            </div>

            {healthError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{healthError}</span>
              </div>
            )}

            {!healthReport && !scanningHealth && !healthError && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                <Activity className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Ready to scan <span className="font-mono text-sky-600 dark:text-sky-400">{currentDomain}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Click <strong>Scan Health</strong> to inspect your live CNAME and TXT records and pinpoint any incorrect values or missing entries.
                </p>
              </div>
            )}

            {scanningHealth && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-2.5 text-center">
                <RefreshCw className="w-6 h-6 text-sky-500 animate-spin" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Querying public DNS resolvers for <span className="font-mono">{currentDomain}</span> (CNAME, TXT, A/AAAA)...
                </p>
              </div>
            )}

            {healthReport && !scanningHealth && (
              <div className="space-y-4">
                {/* Overall Summary Strip */}
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  healthReport.overallStatus === 'healthy'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/70'
                    : healthReport.overallStatus === 'critical'
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/70'
                    : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/70'
                }`}>
                  <div className="flex items-start gap-3">
                    {healthReport.overallStatus === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : healthReport.overallStatus === 'critical' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-sm font-bold ${
                        healthReport.overallStatus === 'healthy'
                          ? 'text-emerald-900 dark:text-emerald-200'
                          : healthReport.overallStatus === 'critical'
                          ? 'text-rose-900 dark:text-rose-200'
                          : 'text-amber-900 dark:text-amber-200'
                      }`}>
                        {healthReport.overallStatus === 'healthy'
                          ? `All DNS Records Healthy for ${healthReport.domain}`
                          : healthReport.overallStatus === 'critical'
                          ? `CNAME / TXT Misconfiguration Detected on ${healthReport.domain}`
                          : `DNS Checks Mostly Passing — Review Apex Routing on ${healthReport.domain}`}
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Resolver: {healthReport.resolver} · Scanned {new Date(healthReport.scannedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 w-fit">
                    <span>{healthReport.passedChecks} / {healthReport.totalChecks} Checks Passed</span>
                  </div>
                </div>

                {/* Per-Record Visual Diagnostic Cards */}
                <div className="space-y-3">
                  {healthReport.checks.map((check) => {
                    const isError = check.status === 'misconfigured' || check.status === 'missing';
                    const isWarning = check.status === 'warning';
                    return (
                      <div
                        key={check.id}
                        className={`p-4 rounded-2xl border transition-all space-y-3 ${
                          check.status === 'healthy'
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-200/80 dark:border-emerald-900/50'
                            : isError
                            ? 'bg-rose-50/35 dark:bg-rose-950/15 border-rose-200/90 dark:border-rose-900/60'
                            : 'bg-amber-50/35 dark:bg-amber-950/15 border-amber-200/90 dark:border-amber-900/60'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border ${
                              check.recordType === 'CNAME'
                                ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800'
                                : check.recordType === 'TXT'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}>
                              {check.recordType}
                            </span>
                            <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 break-all">
                              {check.hostChecked}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              (Host: <strong className="font-mono text-slate-600 dark:text-slate-300">{check.hostLabel}</strong>)
                            </span>
                          </div>
                          {renderCheckStatusBadge(check.status)}
                        </div>

                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                          {check.summary}
                        </p>

                        {/* Expected vs Found Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Expected Value
                              </span>
                              {(check.id === 'cname' || check.id === 'txt') && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(check.expected, `health_exp_${check.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                                >
                                  {copiedId === `health_exp_${check.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-500" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all">
                              {check.expected}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Live DNS Found
                            </span>
                            {check.found.length > 0 ? (
                              <div className="space-y-1">
                                {check.found.map((val, idx) => (
                                  <p
                                    key={idx}
                                    className={`font-mono text-[11px] break-all ${
                                      check.status === 'healthy'
                                        ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                                        : isError
                                        ? 'text-rose-700 dark:text-rose-300 font-semibold'
                                        : 'text-amber-700 dark:text-amber-300'
                                    }`}
                                  >
                                    {val}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="font-mono text-[11px] italic text-rose-600 dark:text-rose-400">
                                No matching {check.recordType} record found
                              </p>
                            )}
                          </div>
                        </div>

                        {(isError || isWarning) && (
                          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">
                              <strong className="text-slate-900 dark:text-white">How to fix: </strong>
                              {check.remediation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direct DNS Provider Support Articles */}
            <div className={`pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 ${
              hasRecordIssues ? 'animate-fade-in' : ''
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    DNS Provider Support Articles (CNAME & TXT Guides)
                  </h3>
                </div>
                {hasRecordIssues && (
                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Need help fixing misconfigured records? Open your provider guide below.
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {orderedSupportArticles.map((article) => {
                  const isSelected = article.id === provider;
                  return (
                    <div
                      key={article.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        isSelected
                          ? 'bg-sky-50/60 dark:bg-sky-950/25 border-sky-300 dark:border-sky-800'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{article.provider}</span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">
                              Selected
                            </span>
                          )}
                        </span>
                        <a
                          href={article.dashboardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 inline-flex items-center gap-1"
                        >
                          <span>Console</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs">
                        <a
                          href={article.cnameUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        >
                          <span className="truncate font-medium">
                            <strong className="font-mono text-[10px] text-sky-600 dark:text-sky-400 mr-1.5">CNAME</strong>
                            {article.cnameArticleTitle}
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                        <a
                          href={article.txtUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                        >
                          <span className="truncate font-medium">
                            <strong className="font-mono text-[10px] text-amber-600 dark:text-amber-400 mr-1.5">TXT</strong>
                            {article.txtArticleTitle}
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Required DNS Records Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 break-words">
                  <Layers className="w-5 h-5 text-sky-500 shrink-0" />
                  <span>Required DNS Records for {currentDomain}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Copy and add these records to your domain DNS settings (in Cloudflare, GoDaddy, Namecheap, etc.)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300 font-medium w-fit shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Validated</span>
              </div>
            </div>

            {/* Desktop Table of Records */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Host / Name</th>
                    <th className="py-3 px-4">Target / Value</th>
                    <th className="py-3 px-3">TTL</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {/* Record 1: CNAME */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-sky-600 dark:text-sky-400">CNAME</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {isApex ? 'www' : subdomain}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs break-all">
                      {targetHost}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-sans">Auto / 3600</td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => handleCopy(targetHost, 'rec_cname')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-600 dark:text-sky-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-sky-200 dark:border-sky-800/50"
                      >
                        {copiedId === 'rec_cname' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Target</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Record 2: TXT Verification */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-amber-600 dark:text-amber-400">TXT</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {isApex ? '@' : `_tiqsey-challenge`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate" title={verificationToken}>
                      {verificationToken}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-sans">Auto</td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => handleCopy(verificationToken, 'rec_txt')}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer border border-amber-200 dark:border-amber-800/50"
                      >
                        {copiedId === 'rec_txt' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Value</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Record 3: Apex (@) Handling */}
                  {isApex && (
                    <tr className="bg-sky-50/30 dark:bg-sky-950/10">
                      <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">
                        {provider === 'cloudflare' ? 'CNAME (Flattened)' : 'URL Redirect'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">@ (Root)</td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-sans">
                        {provider === 'cloudflare' ? (
                          <span>Target: <span className="font-mono break-all">{targetHost}</span> (with Cloudflare Proxy)</span>
                        ) : (
                          <span>Forward <span className="font-mono font-medium">http://{currentDomain}</span> to <span className="font-mono font-medium text-sky-600 dark:text-sky-400">https://www.{currentDomain}</span></span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400 font-sans">Auto</td>
                      <td className="py-3.5 px-4 text-right font-sans">
                        <span className="text-[11px] text-slate-400 font-medium">Recommended</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Stacked DNS Record Cards */}
            <div className="lg:hidden space-y-3">
              {/* Record 1 Card */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60">
                    CNAME
                  </span>
                  <span className="text-slate-400">Host: <strong className="font-mono text-slate-700 dark:text-slate-200">{isApex ? 'www' : subdomain}</strong> · TTL: Auto</span>
                </div>
                <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {targetHost}
                </p>
                <button
                  onClick={() => handleCopy(targetHost, 'rec_cname')}
                  className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-600 dark:text-sky-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-sky-200 dark:border-sky-800/50"
                >
                  {copiedId === 'rec_cname' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied Target</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Target</span>
                    </>
                  )}
                </button>
              </div>

              {/* Record 2 Card */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                    TXT
                  </span>
                  <span className="text-slate-400">Host: <strong className="font-mono text-slate-700 dark:text-slate-200">{isApex ? '@' : `_tiqsey-challenge`}</strong></span>
                </div>
                <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {verificationToken}
                </p>
                <button
                  onClick={() => handleCopy(verificationToken, 'rec_txt')}
                  className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-amber-200 dark:border-amber-800/50"
                >
                  {copiedId === 'rec_txt' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied Value</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Value</span>
                    </>
                  )}
                </button>
              </div>

              {/* Record 3 Card */}
              {isApex && (
                <div className="p-3.5 rounded-2xl border border-sky-200/70 dark:border-sky-900/50 bg-sky-50/40 dark:bg-sky-950/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      {provider === 'cloudflare' ? 'CNAME (Flattened)' : 'URL Redirect'}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Recommended</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 break-all">
                    Host: <strong className="font-mono">@ (Root)</strong> →{' '}
                    {provider === 'cloudflare' ? (
                      <span className="font-mono">{targetHost} (Cloudflare Proxy)</span>
                    ) : (
                      <span>Forward <span className="font-mono">http://{currentDomain}</span> to <span className="font-mono text-sky-600 dark:text-sky-400">https://www.{currentDomain}</span></span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Why CNAME www vs Apex?</strong> Standard DNS RFCs prohibit CNAME records on root apex domains (<span className="font-mono">example.com</span>) unless you use <strong>Cloudflare CNAME Flattening</strong> or an ALIAS record. If you are using GoDaddy or Namecheap, setting a CNAME for <span className="font-mono">www</span> and enabling <strong>Domain Forwarding</strong> for the root apex domain gives you 100% compatibility across all browsers.
              </p>
            </div>
          </div>

          {/* Registrar Instructions Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Step-by-Step Registrar Guides
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your domain registrar to view exact copy-paste steps
                </p>
              </div>

              {/* Guide Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveGuideTab('cloudflare')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeGuideTab === 'cloudflare' 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Cloudflare (Fastest)
                </button>
                <button
                  onClick={() => setActiveGuideTab('hostinger')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeGuideTab === 'hostinger' 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Hostinger
                </button>
                <button
                  onClick={() => setActiveGuideTab('godaddy')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeGuideTab === 'godaddy' 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  GoDaddy
                </button>
                <button
                  onClick={() => setActiveGuideTab('namecheap')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeGuideTab === 'namecheap' 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Namecheap
                </button>
                <button
                  onClick={() => setActiveGuideTab('universal')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeGuideTab === 'universal' 
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Universal / Other
                </button>
              </div>
            </div>

            {/* Guide Content */}
            <div className="space-y-4 pt-1 break-words">
              {activeGuideTab === 'cloudflare' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl flex items-center gap-2 text-sky-900 dark:text-sky-200 font-semibold">
                    <Zap className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Cloudflare provides instant zero-downtime SSL, free CDN caching, and DDoS defense.</span>
                  </div>

                  <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                    <li className="font-medium">
                      Log into your <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold inline-flex items-center gap-1">Cloudflare Dashboard <ExternalLink className="w-3 h-3" /></a> and select your domain.
                    </li>
                    <li className="font-medium">
                      Navigate to the <strong>DNS</strong> tab and click <strong>Add record</strong>:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>@</strong> (or <strong>www</strong>)</p>
                        <p><span className="text-slate-400">Target:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">Proxy status:</span> <strong>Proxied (Orange Cloud)</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Navigate to <strong>SSL/TLS</strong> → Set encryption mode to <strong>Full</strong> or <strong>Full (strict)</strong>.
                    </li>
                    <li className="font-medium">
                      In Cloudflare <strong>Rules</strong> → <strong>Origin Rules</strong> (optional):
                      <span className="block text-slate-500 dark:text-slate-400 mt-0.5 sm:ml-4 break-words">
                        If your DNS is set to Proxied, add an Origin Rule to override the Host header to <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold break-all">{targetHost}</span> so Cloud Run routes traffic directly.
                      </span>
                    </li>
                    <li className="font-medium">
                      Click <strong>"Scan Health"</strong> above once records are added to verify live DNS resolution!
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === 'hostinger' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                    <li className="font-medium">
                      Log in to <a href="https://hpanel.hostinger.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold inline-flex items-center gap-1">Hostinger hPanel <ExternalLink className="w-3 h-3" /></a>, open <strong>Domains</strong>, select your domain, and click <strong>DNS / Nameservers</strong>.
                    </li>
                    <li className="font-medium">
                      Under <strong>Manage DNS records</strong>, add or edit the <strong>CNAME</strong> record:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>{isApex ? 'www' : subdomain}</strong></p>
                        <p><span className="text-slate-400">Target:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">TTL:</span> <strong>14400 (Default)</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Add the domain ownership verification <strong>TXT</strong> record:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>TXT</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>{isApex ? '@' : '_tiqsey-challenge'}</strong></p>
                        <p><span className="text-slate-400">TXT value:</span> <strong>{verificationToken}</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Save your records and click <strong>"Scan Health"</strong> above to confirm both CNAME and TXT records report <strong>Healthy</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === 'godaddy' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                    <li className="font-medium">
                      Log in to <a href="https://dcc.godaddy.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold inline-flex items-center gap-1">GoDaddy Domain Portfolio <ExternalLink className="w-3 h-3" /></a> and click on your domain.
                    </li>
                    <li className="font-medium">
                      Scroll to <strong>DNS Records</strong> and click <strong>Add New Record</strong>:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>www</strong></p>
                        <p><span className="text-slate-400">Value:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">TTL:</span> <strong>1 Hour (or 1/2 Hour)</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Add the verification TXT record:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>TXT</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>@</strong></p>
                        <p><span className="text-slate-400">Value:</span> <strong>{verificationToken}</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Set up <strong>Domain Forwarding</strong> (for apex/root domain):
                      <span className="block text-slate-500 dark:text-slate-400 mt-0.5 sm:ml-4 break-words">
                        In GoDaddy under <strong>Forwarding</strong>, forward <span className="font-mono">http://{currentDomain}</span> to <span className="font-mono text-sky-600 dark:text-sky-400">https://www.{currentDomain}</span> with redirect type <strong>Permanent (301)</strong>.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === 'namecheap' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                    <li className="font-medium">
                      Log in to your <a href="https://ap.www.namecheap.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold inline-flex items-center gap-1">Namecheap Dashboard <ExternalLink className="w-3 h-3" /></a>, find your domain, and click <strong>Manage</strong>.
                    </li>
                    <li className="font-medium">
                      Go to the <strong>Advanced DNS</strong> tab and click <strong>Add New Record</strong>:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME Record</strong></p>
                        <p><span className="text-slate-400">Host:</span> <strong>www</strong></p>
                        <p><span className="text-slate-400">Target:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">TTL:</span> <strong>Automatic</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Set up URL Redirect for apex:
                      <div className="mt-2 sm:ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px] break-all">
                        <p><span className="text-slate-400">Type:</span> <strong>URL Redirect Record</strong></p>
                        <p><span className="text-slate-400">Host:</span> <strong>@</strong></p>
                        <p><span className="text-slate-400">Value:</span> <strong>https://www.{currentDomain}</strong> (Permanent 301)</p>
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {activeGuideTab === 'universal' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="leading-relaxed">
                    For any DNS provider (AWS Route 53, Hostinger, Squarespace, Porkbun, OVH):
                  </p>
                  <ol className="space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                    <li>Create a <strong>CNAME record</strong> pointing your desired subdomain (<span className="font-mono">www</span> or <span className="font-mono">tickets</span>) to <span className="font-mono font-semibold break-all">{targetHost}</span>.</li>
                    <li>Add the ownership <strong>TXT record</strong> with value <span className="font-mono font-semibold break-all">{verificationToken}</span>.</li>
                    <li>If using the root domain (<span className="font-mono">@</span>), set an ALIAS / ANAME record pointing to <span className="font-mono font-semibold break-all">{targetHost}</span> or configure HTTP domain forwarding to <span className="font-mono break-all">https://www.{currentDomain}</span>.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 max-w-md w-full max-h-[90dvh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Disconnect Custom Domain?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove the custom domain <strong className="text-slate-900 dark:text-white break-all">{settings?.domain}</strong>? The application will immediately revert to the default Cloud Run URL.
            </p>
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="min-h-[42px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDomain}
                disabled={saving}
                className="min-h-[42px] px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-colors disabled:opacity-50"
              >
                {saving ? 'Disconnecting...' : 'Yes, Disconnect Domain'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
