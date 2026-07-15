import React, { useState, useEffect, useRef } from 'react';
import { useBackendAuth } from '../BackendApp';
import { 
  Database, 
  Terminal, 
  Play, 
  Trash2, 
  Copy, 
  Download, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Table2, 
  Code, 
  History, 
  Sparkles,
  Loader2,
  FileSpreadsheet,
  Check
} from 'lucide-react';

interface DBColumn {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  pk: boolean;
  defaultValue: any;
}

interface DBTable {
  name: string;
  rowCount: number;
  columns: DBColumn[];
}

interface QueryHistoryEntry {
  id: string;
  sql: string;
  timestamp: string;
  success: boolean;
  executionTimeMs?: string;
  rowsCount?: number;
}

export default function SqlEditor() {
  const { token } = useBackendAuth();
  const [schema, setSchema] = useState<DBTable[]>([]);
  const [loadingSchema, setLoadingSchema] = useState(true);
  
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM backend_users ORDER BY created_at DESC LIMIT 50;');
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  
  // Stats
  const [execTime, setExecTime] = useState<string>('');
  const [affectedCount, setAffectedCount] = useState<number>(0);
  const [isSelectQuery, setIsSelectQuery] = useState(true);
  
  // UI states
  const [searchTable, setSearchTable] = useState('');
  const [selectedTableInSidebar, setSelectedTableInSidebar] = useState<string | null>('backend_users');
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedData, setCopiedData] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'history'>('results');

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const fetchSchema = async () => {
    setLoadingSchema(true);
    try {
      const res = await fetch('/api/backend/sql/tables', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSchema(data.schema || []);
        if (data.schema && data.schema.length > 0 && !selectedTableInSidebar) {
          setSelectedTableInSidebar(data.schema[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve schema:', err);
    } finally {
      setLoadingSchema(false);
    }
  };

  useEffect(() => {
    fetchSchema();
    
    // Load history from localStorage if any
    const saved = localStorage.getItem('backend_sql_history');
    if (saved) {
      try {
        setQueryHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const executeQuery = async (queryToRun: string = sqlQuery) => {
    if (!queryToRun.trim()) return;
    
    setExecuting(true);
    setError('');
    setQueryResult(null);
    setActiveTab('results');

    try {
      const res = await fetch('/api/backend/sql/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sql: queryToRun })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      setQueryResult(data.result);
      setIsSelectQuery(data.isQuery);
      setExecTime(data.executionTimeMs);
      setAffectedCount(data.affectedRows);

      // Save to query history
      const historyEntry: QueryHistoryEntry = {
        id: `q-${Date.now()}-${Math.random()}`,
        sql: queryToRun,
        timestamp: new Date().toISOString(),
        success: true,
        executionTimeMs: data.executionTimeMs,
        rowsCount: data.isQuery && Array.isArray(data.result) ? data.result.length : undefined
      };

      const updatedHistory = [historyEntry, ...queryHistory].slice(0, 50); // Keep last 50 queries
      setQueryHistory(updatedHistory);
      localStorage.setItem('backend_sql_history', JSON.stringify(updatedHistory));

      // Refresh schema counts since database might have been updated
      if (!data.isQuery) {
        fetchSchema();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during execution');
      
      const historyEntry: QueryHistoryEntry = {
        id: `q-${Date.now()}-${Math.random()}`,
        sql: queryToRun,
        timestamp: new Date().toISOString(),
        success: false
      };

      const updatedHistory = [historyEntry, ...queryHistory].slice(0, 50);
      setQueryHistory(updatedHistory);
      localStorage.setItem('backend_sql_history', JSON.stringify(updatedHistory));
    } finally {
      setExecuting(false);
    }
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to execute
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleCopyResultData = () => {
    if (!queryResult || queryResult.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(queryResult, null, 2));
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const downloadCSV = () => {
    if (!queryResult || queryResult.length === 0) return;
    
    const headers = Object.keys(queryResult[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...queryResult.map((row: any) => 
        headers.map(fieldName => {
          const value = row[fieldName];
          const stringified = value === null || value === undefined ? '' : String(value);
          // Escape quotes
          const escaped = stringified.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sql_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadTemplate = (sql: string) => {
    setSqlQuery(sql);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear all query history?')) {
      setQueryHistory([]);
      localStorage.removeItem('backend_sql_history');
    }
  };

  const templates = [
    {
      name: 'All Staff Users',
      sql: 'SELECT id, full_name, username, email, role, department, status, last_login FROM backend_users ORDER BY role;',
      desc: 'Retrieves all staff accounts grouped by role'
    },
    {
      name: 'Recent Activity Logs',
      sql: 'SELECT timestamp, username, action, ip, details FROM backend_logs ORDER BY timestamp DESC LIMIT 50;',
      desc: 'Fetches the 50 most recent security and audit trail events'
    },
    {
      name: 'Database Table Statistics',
      sql: "SELECT name, type FROM sqlite_master WHERE type='table' ORDER BY name;",
      desc: 'Lists all system table structures inside the SQLite database'
    },
    {
      name: 'Active Staff Sessions',
      sql: 'SELECT s.id, u.full_name, u.username, s.created_at, s.expires_at FROM backend_sessions s JOIN backend_users u ON s.user_id = u.id ORDER BY s.created_at DESC;',
      desc: 'Views current administrative logged-in sessions'
    },
    {
      name: 'Event Types Frequency',
      sql: 'SELECT action, COUNT(*) as occurrence_count FROM backend_logs GROUP BY action ORDER BY occurrence_count DESC;',
      desc: 'Aggregates audit events to see system activity patterns'
    }
  ];

  const filteredSchema = schema.filter(t => 
    t.name.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans h-[calc(100vh-140px)] flex flex-col overflow-hidden">
      
      {/* Header Info Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950/40 text-[#5fa6d9] flex items-center justify-center">
            <Database className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Database SQL Playground</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Secure, server-side SQLite query terminal. Restricted to administrators and super administrators.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">SQLite Connected</span>
        </div>
      </div>

      {/* Main Panel Division Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-hidden">
        
        {/* Left Side Panel - Database Structure & Schema Navigator */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Table2 className="w-4 h-4 text-slate-400" />
                Database Schema
              </span>
              <button
                onClick={fetchSchema}
                disabled={loadingSchema}
                className="text-[10px] font-bold text-[#5fa6d9] hover:underline cursor-pointer disabled:opacity-50"
              >
                {loadingSchema ? 'Refreshing...' : 'Refresh Schema'}
              </button>
            </div>
            
            {/* Search filter */}
            <div className="relative">
              <input
                type="text"
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                placeholder="Search tables..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5fa6d9] text-slate-900 dark:text-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          {/* Tables scroll window */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loadingSchema && schema.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#5fa6d9]" />
                <span className="text-[11px] font-semibold">Loading tables...</span>
              </div>
            ) : filteredSchema.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">No tables found</p>
            ) : (
              filteredSchema.map((table) => {
                const isSelected = selectedTableInSidebar === table.name;
                return (
                  <div 
                    key={table.name}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isSelected 
                        ? 'border-[#5fa6d9]/30 bg-slate-50/50 dark:bg-slate-950/20' 
                        : 'border-transparent hover:bg-slate-50/40 dark:hover:bg-slate-850/10'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTableInSidebar(isSelected ? null : table.name)}
                      className="w-full text-left px-3 py-2 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Database className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5fa6d9] transition-colors" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {table.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">
                          {table.rowCount} rows
                        </span>
                        {isSelected ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                      </div>
                    </button>

                    {/* Columns sub list */}
                    {isSelected && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/40 text-[10px] space-y-1.5">
                        <div className="flex justify-between text-slate-400 font-bold mb-1">
                          <span>Column</span>
                          <span>Type</span>
                        </div>
                        {table.columns.map((col) => (
                          <div key={col.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                            <span className="flex items-center gap-1 truncate max-w-[120px]" title={col.name}>
                              {col.pk && <span className="text-amber-500 font-extrabold text-[8px]" title="Primary Key">🔑</span>}
                              {col.name}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400 uppercase">{col.type}</span>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <button
                            onClick={() => loadTemplate(`SELECT * FROM ${table.name} LIMIT 50;`)}
                            className="w-full text-center py-1 bg-[#5fa6d9]/10 hover:bg-[#5fa6d9]/20 text-[#5fa6d9] rounded-md font-bold text-[9px] transition-colors cursor-pointer"
                          >
                            Generate SELECT Query
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
        </div>

        {/* Right Side Panel - Terminal input & Results output */}
        <div className="lg:col-span-9 flex flex-col min-h-0 gap-4 overflow-hidden">
          
          {/* Top segment: SQL Editor & Command rail */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col shrink-0 overflow-hidden">
            
            {/* Template & Editor Control Rail */}
            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#5fa6d9]" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">Query Terminal</span>
              </div>
              
              {/* Pre-defined templates select dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Templates:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      loadTemplate(e.target.value);
                      e.target.value = ''; // reset
                    }
                  }}
                  className="px-2 py-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="">-- Choose Quick Preset --</option>
                  {templates.map(t => (
                    <option key={t.name} value={t.sql} title={t.desc}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SQL Code Textarea box */}
            <div className="relative flex-1">
              <textarea
                ref={editorRef}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your raw SQLite command here..."
                rows={5}
                className="w-full block px-4 py-3 bg-slate-950 text-[#52A3FF] dark:text-sky-300 font-mono text-sm border-none focus:outline-none resize-y leading-relaxed tracking-wide min-h-[120px]"
                disabled={executing}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold font-mono bg-slate-900/60 px-2 py-1 rounded">
                  Ctrl + Enter
                </span>
              </div>
            </div>

            {/* Bottom action panel */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSqlQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  title="Clear Console"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyQuery}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer relative"
                  title="Copy Query to Clipboard"
                >
                  {copiedQuery ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => executeQuery()}
                disabled={executing || !sqlQuery.trim()}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 font-black rounded-xl transition-all cursor-pointer text-xs disabled:opacity-40 shadow-xs"
              >
                {executing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Run SQL Statement
                  </>
                )}
              </button>
            </div>
            
          </div>

          {/* Bottom segment: Results and history tabs */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col min-h-0 overflow-hidden">
            
            {/* View navigation headers */}
            <div className="px-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/30 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeTab === 'results' 
                      ? 'border-[#5fa6d9] text-slate-900 dark:text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Query Results
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeTab === 'history' 
                      ? 'border-[#5fa6d9] text-slate-900 dark:text-white' 
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  Query History ({queryHistory.length})
                </button>
              </div>

              {/* Operations/Export helpers (Active only on results panel) */}
              {activeTab === 'results' && queryResult && queryResult.length > 0 && isSelectQuery && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyResultData}
                    className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                    title="Copy full JSON output"
                  >
                    {copiedData ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    JSON
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                    title="Download CSV report"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    CSV Export
                  </button>
                </div>
              )}
            </div>

            {/* Results Output Canvas content */}
            <div className="flex-1 overflow-auto min-h-0">
              {activeTab === 'results' ? (
                <div className="p-4 h-full flex flex-col min-h-0">
                  {/* Loading spinner */}
                  {executing && (
                    <div className="m-auto flex flex-col items-center gap-2 py-12 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-[#5fa6d9]" />
                      <span className="text-xs font-semibold">Executing statement on database server...</span>
                    </div>
                  )}

                  {/* Error display */}
                  {!executing && error && (
                    <div className="bg-red-50 dark:bg-red-950/25 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-semibold m-2">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-red-700 dark:text-red-300">SQLite Execution Failure</p>
                        <p className="mt-1 font-mono text-xs font-medium leading-relaxed bg-red-100/50 dark:bg-red-950/40 p-2 rounded-lg border border-red-200/20">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Empty state when no query run yet */}
                  {!executing && !error && !queryResult && (
                    <div className="m-auto text-center text-slate-400 py-12 space-y-2">
                      <Terminal className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800" />
                      <p className="font-bold text-slate-600 dark:text-slate-400">Database Terminal Ready</p>
                      <p className="text-xs">Type a query in the terminal and press "Run SQL Statement" to fetch results.</p>
                    </div>
                  )}

                  {/* Results Display */}
                  {!executing && !error && queryResult && (
                    <div className="flex-1 flex flex-col min-h-0">
                      
                      {/* Query metadata metrics */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-500 mb-3 shrink-0">
                        <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950/40 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                          <Clock className="w-3.5 h-3.5" />
                          Duration: {execTime}ms
                        </span>
                        {isSelectQuery ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/40 px-2.5 py-1 rounded-md font-bold">
                            Returned {queryResult.length} rows
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200/40 px-2.5 py-1 rounded-md font-bold">
                            Affected rows: {affectedCount}
                          </span>
                        )}
                      </div>

                      {/* Data table render */}
                      {isSelectQuery && queryResult.length > 0 ? (
                        <div className="flex-1 overflow-auto border border-slate-150 dark:border-slate-800/80 rounded-xl">
                          <table className="w-full text-left border-collapse font-mono text-xs whitespace-nowrap">
                            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-950 z-10 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-extrabold select-none">
                              <tr>
                                {Object.keys(queryResult[0]).map((header) => (
                                  <th key={header} className="px-4 py-2.5 border-r border-slate-200/30 dark:border-slate-800/30 last:border-0 font-bold uppercase tracking-wider text-[10px]">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                              {queryResult.map((row: any, rIdx: number) => (
                                <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                  {Object.values(row).map((val: any, cIdx: number) => {
                                    const isNull = val === null || val === undefined;
                                    return (
                                      <td key={cIdx} className="px-4 py-2 border-r border-slate-200/20 dark:border-slate-800/20 last:border-0 text-slate-700 dark:text-slate-300 font-medium">
                                        {isNull ? (
                                          <span className="text-slate-300 dark:text-slate-600 italic">NULL</span>
                                        ) : typeof val === 'object' ? (
                                          JSON.stringify(val)
                                        ) : (
                                          String(val)
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : isSelectQuery && queryResult.length === 0 ? (
                        <div className="m-auto text-center text-slate-400 py-12 space-y-1">
                          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                          <p className="font-bold text-slate-700 dark:text-slate-300">Statement Succeeded</p>
                          <p className="text-xs">No records matched or returned by this query.</p>
                        </div>
                      ) : (
                        // Non-SELECT query success display
                        <div className="m-auto text-center max-w-sm p-6 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-150 dark:border-emerald-900/30 rounded-2xl space-y-3">
                          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
                          <div>
                            <h3 className="font-black text-slate-900 dark:text-white text-base">Write Statement Succeeded</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                              Your database modify statement completed with no errors.
                            </p>
                          </div>
                          <div className="pt-2 grid grid-cols-2 gap-2 text-left font-semibold text-xs border-t border-slate-200 dark:border-slate-800">
                            <div>
                              <span className="text-slate-400">Affected Rows:</span>
                              <p className="font-mono font-black text-slate-800 dark:text-slate-200">{affectedCount}</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Database Action:</span>
                              <p className="font-mono font-black text-slate-800 dark:text-slate-200">COMMIT OK</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                // History logs view
                <div className="p-4 space-y-2.5 h-full overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="text-xs font-bold text-slate-400">PREVIOUS TERMINAL COMMANDS (MAX 50)</span>
                    {queryHistory.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear History
                      </button>
                    )}
                  </div>
                  
                  {queryHistory.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 space-y-1">
                      <History className="w-10 h-10 mx-auto text-slate-200 dark:text-slate-800" />
                      <p className="font-bold text-slate-600 dark:text-slate-400">No query history yet</p>
                      <p className="text-xs">Queries run in this playground session will be listed here.</p>
                    </div>
                  ) : (
                    queryHistory.map((entry) => (
                      <div 
                        key={entry.id}
                        className="p-3 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 rounded-xl border border-slate-200/40 dark:border-slate-800/40 flex items-start justify-between gap-4 font-mono text-[11px] transition-colors"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 break-all leading-relaxed whitespace-pre-wrap">{entry.sql}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-sans font-bold">
                            <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            {entry.success ? (
                              <span className="text-emerald-600 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Success ({entry.executionTimeMs}ms)
                                {entry.rowsCount !== undefined && ` · ${entry.rowsCount} rows`}
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                Failed
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => loadTemplate(entry.sql)}
                          className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#5fa6d9] rounded-lg font-bold text-[10px] font-sans text-slate-600 dark:text-slate-300 cursor-pointer transition-all hover:text-[#5fa6d9]"
                        >
                          Load
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
