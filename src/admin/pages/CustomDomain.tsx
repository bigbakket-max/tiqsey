import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Layers, 
  Info,
  ChevronRight,
  HelpCircle,
  Zap,
  Lock
} from 'lucide-react';

interface DnsRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
  description: string;
  recommended?: boolean;
}

async function parseJsonSafely(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(`Server returned unexpected response (${res.status}). Expected JSON.`);
  }
  return res.json();
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

export default function CustomDomain() {
  const [domainInput, setDomainInput] = useState('');
  const [provider, setProvider] = useState('cloudflare');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<DomainSettings | null>(null);
  const [targetHost, setTargetHost] = useState('ais-pre-3xmqqplj6iyf7445xaenj4-389000849295.asia-southeast1.run.app');
  const [verificationToken, setVerificationToken] = useState('tiqsey-site-verification=8be44669-b47a-4636-9b11-7512a6d26a0e');
  const [cloudRunService, setCloudRunService] = useState('ais-pre-3xmqqplj6iyf7445xaenj4-389000849295');
  const [cloudRegion, setCloudRegion] = useState('asia-southeast1');
  const [verifyMessage, setVerifyMessage] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string; details?: any } | null>(null);
  const [activeGuideTab, setActiveGuideTab] = useState<'cloudflare' | 'godaddy' | 'namecheap' | 'gcp' | 'universal'>('cloudflare');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch initial domain settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/custom-domain');
      const data = await parseJsonSafely(res);
      if (data.targetHost) setTargetHost(data.targetHost);
      if (data.verificationToken) setVerificationToken(data.verificationToken);
      if (data.cloudRunService) setCloudRunService(data.cloudRunService);
      if (data.cloudRegion) setCloudRegion(data.cloudRegion);

      if (data.configured && data.settings) {
        setSettings(data.settings);
        setDomainInput(data.settings.domain);
        if (data.settings.provider) setProvider(data.settings.provider);
      } else {
        setSettings(null);
        // Default preview domain
        if (!domainInput) setDomainInput('tiqsey.com');
      }
    } catch (err) {
      console.error('Failed to load custom domain configuration', err);
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
    const clean = domainInput.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!clean || !clean.includes('.')) {
      setVerifyMessage({
        type: 'error',
        text: 'Please enter a valid domain name (e.g. tiqsey.com or tickets.yourbrand.com)'
      });
      return;
    }

    try {
      setSaving(true);
      setVerifyMessage(null);
      const res = await fetch('/api/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: clean, provider })
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data.error || 'Failed to save custom domain');

      setSettings(data.settings);
      setVerifyMessage({
        type: data.settings.verificationStatus === 'verified' ? 'success' : 'info',
        text: data.message,
        details: data.diagnostics
      });
    } catch (err: any) {
      setVerifyMessage({
        type: 'error',
        text: err.message || 'An error occurred while saving domain configuration.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyDns = async () => {
    try {
      setVerifying(true);
      setVerifyMessage(null);
      const res = await fetch('/api/custom-domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: settings?.domain || domainInput })
      });
      const data = await parseJsonSafely(res);
      if (!res.ok) throw new Error(data.error || 'Verification request failed');

      if (settings) {
        setSettings({
          ...settings,
          verificationStatus: data.status,
          sslStatus: data.sslStatus,
          lastCheckedAt: data.lastCheckedAt
        });
      }

      const diag = data.diagnostics;
      if (data.verified) {
        setVerifyMessage({
          type: 'success',
          text: `Verification successful! Domain ${data.domain} is actively pointing to your Tiqsey Cloud Run application with SSL active.`,
          details: diag
        });
      } else if (data.status === 'propagating') {
        setVerifyMessage({
          type: 'warning',
          text: `DNS records detected, but routing is still propagating globally. Please allow 2-15 minutes for DNS TTL to refresh.`,
          details: diag
        });
      } else {
        setVerifyMessage({
          type: 'error',
          text: `No matching CNAME record pointing to ${targetHost} was detected yet for ${data.domain}.`,
          details: diag
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
      const res = await fetch('/api/custom-domain', { method: 'DELETE' });
      if (res.ok) {
        setSettings(null);
        setDomainInput('tiqsey.com');
        setVerifyMessage({
          type: 'info',
          text: 'Custom domain removed. Application is running on default Cloud Run address.'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const currentDomain = settings?.domain || domainInput || 'tiqsey.com';
  const isApex = currentDomain.split('.').length === 2;
  const subdomain = isApex ? 'www' : currentDomain.split('.')[0];

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
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
                    if (['cloudflare', 'godaddy', 'namecheap'].includes(e.target.value)) {
                      setActiveGuideTab(e.target.value as any);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all"
                >
                  <option value="cloudflare">Cloudflare (Recommended - Free SSL & Proxy)</option>
                  <option value="godaddy">GoDaddy</option>
                  <option value="namecheap">Namecheap</option>
                  <option value="hostinger">Hostinger</option>
                  <option value="squarespace">Google Domains / Squarespace</option>
                  <option value="route53">Amazon Route 53</option>
                  <option value="universal">Other / General DNS Registrar</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs md:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

                {settings && (
                  <button
                    type="button"
                    onClick={handleVerifyDns}
                    disabled={verifying}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs md:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

          {/* Required DNS Records Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sky-500" />
                  <span>Required DNS Records for {currentDomain}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Copy and add these records to your domain DNS settings (in Cloudflare, GoDaddy, Namecheap, etc.)
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-600 dark:text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSL Validated</span>
              </div>
            </div>

            {/* Table of Records */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
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
                          <span>Target: <span className="font-mono">{targetHost}</span> (with Cloudflare Proxy)</span>
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

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Why CNAME www vs Apex?</strong> Standard DNS RFCs prohibit CNAME records on root apex domains (<span className="font-mono">example.com</span>) unless you use <strong>Cloudflare CNAME Flattening</strong> or an ALIAS record. If you are using GoDaddy or Namecheap, setting a CNAME for <span className="font-mono">www</span> and enabling <strong>Domain Forwarding</strong> for the root apex domain gives you 100% compatibility across all browsers.
              </p>
            </div>
          </div>

          {/* Registrar Instructions Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
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
            <div className="space-y-4 pt-1">
              {activeGuideTab === 'cloudflare' && (
                <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl flex items-center gap-2 text-sky-900 dark:text-sky-200 font-semibold">
                    <Zap className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Cloudflare provides instant zero-downtime SSL, free CDN caching, and DDoS defense.</span>
                  </div>

                  <ol className="space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                    <li className="font-medium">
                      Log into your <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 underline font-bold inline-flex items-center gap-1">Cloudflare Dashboard <ExternalLink className="w-3 h-3" /></a> and select your domain.
                    </li>
                    <li className="font-medium">
                      Navigate to the <strong>DNS</strong> tab and click <strong>Add record</strong>:
                      <div className="mt-2 ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
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
                      <span className="block text-slate-500 dark:text-slate-400 mt-0.5 ml-4">
                        If your DNS is set to Proxied, add an Origin Rule to override the Host header to <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{targetHost}</span> so Cloud Run routes traffic directly.
                      </span>
                    </li>
                    <li className="font-medium">
                      Click <strong>"Check DNS & Verify Now"</strong> above once records are added!
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
                      <div className="mt-2 ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>www</strong></p>
                        <p><span className="text-slate-400">Value:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">TTL:</span> <strong>1 Hour (or 1/2 Hour)</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Add the verification TXT record:
                      <div className="mt-2 ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
                        <p><span className="text-slate-400">Type:</span> <strong>TXT</strong></p>
                        <p><span className="text-slate-400">Name:</span> <strong>@</strong></p>
                        <p><span className="text-slate-400">Value:</span> <strong>{verificationToken}</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Set up <strong>Domain Forwarding</strong> (for apex/root domain):
                      <span className="block text-slate-500 dark:text-slate-400 mt-0.5 ml-4">
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
                      <div className="mt-2 ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
                        <p><span className="text-slate-400">Type:</span> <strong>CNAME Record</strong></p>
                        <p><span className="text-slate-400">Host:</span> <strong>www</strong></p>
                        <p><span className="text-slate-400">Target:</span> <strong>{targetHost}</strong></p>
                        <p><span className="text-slate-400">TTL:</span> <strong>Automatic</strong></p>
                      </div>
                    </li>
                    <li className="font-medium">
                      Set up URL Redirect for apex:
                      <div className="mt-2 ml-4 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
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
                    <li>Create a <strong>CNAME record</strong> pointing your desired subdomain (<span className="font-mono">www</span> or <span className="font-mono">tickets</span>) to <span className="font-mono font-semibold">{targetHost}</span>.</li>
                    <li>Add the ownership <strong>TXT record</strong> with value <span className="font-mono font-semibold">{verificationToken}</span>.</li>
                    <li>If using the root domain (<span className="font-mono">@</span>), set an ALIAS / ANAME record pointing to <span className="font-mono font-semibold">{targetHost}</span> or configure HTTP domain forwarding to <span className="font-mono">https://www.{currentDomain}</span>.</li>
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Disconnect Custom Domain?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to remove the custom domain <strong className="text-slate-900 dark:text-white">{settings?.domain}</strong>? The application will immediately revert to the default Cloud Run URL.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteDomain}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-colors disabled:opacity-50"
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
