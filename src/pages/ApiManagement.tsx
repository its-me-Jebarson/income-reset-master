import { useState } from "react";
import { ArrowLeft, Zap, Eye, EyeOff, Copy, RefreshCw, BarChart3, Clock, DollarSign, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from "@/config/api";

interface UsageStats {
  totalCalls: number;
  compressionRatio: string;
  avgLatency: string;
  totalSavings: string;
  originalTokens: number;
  compressedTokens: number;
  responseTokens: number;
  tokensSaved: number;
}

export default function ApiManagementPage() {
  const navigate = useNavigate();
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UsageStats>({
    totalCalls: 0,
    compressionRatio: "0.0%",
    avgLatency: "0ms",
    totalSavings: "$0.00",
    originalTokens: 0,
    compressedTokens: 0,
    responseTokens: 0,
    tokensSaved: 0,
  });

  const copyKey = async () => {
    await navigator.clipboard.writeText(API_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchUsageStats = async () => {
    setLoading(true);
    try {
      // Make a test compression call to ScaleDown API to get real usage data
      const response = await fetch("https://api.scaledown.xyz/compress/raw/", {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context: "ScaleDown is an intelligent prompt compression service that reduces AI token usage while preserving semantic meaning.",
          prompt: "What is ScaleDown?",
          scaledown: { rate: "auto" },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const originalTokens = data.original_prompt_tokens || 0;
        const compressedTokens = data.compressed_prompt_tokens || 0;
        const latency = data.latency_ms || data.request_metadata?.compression_time_ms || 0;
        const tokensSaved = originalTokens - compressedTokens;
        const ratio = originalTokens > 0 ? ((tokensSaved / originalTokens) * 100).toFixed(1) : "0.0";
        const savings = (tokensSaved * 0.00003).toFixed(4); // Approximate cost per token

        setStats(prev => ({
          totalCalls: prev.totalCalls + 1,
          compressionRatio: `${ratio}%`,
          avgLatency: `${latency}ms`,
          totalSavings: `$${savings}`,
          originalTokens: prev.originalTokens + originalTokens,
          compressedTokens: prev.compressedTokens + compressedTokens,
          responseTokens: compressedTokens,
          tokensSaved: prev.tokensSaved + tokensSaved,
        }));
      } else {
        console.error("API call failed:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const maskedKey = API_KEY.replace(/./g, (_, i) => (i < 8 ? API_KEY[i] : "•"));

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">API Management</h1>
          <p className="text-xs text-muted-foreground">ScaleDown API integration</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-6 px-6 pb-6">
        {/* API Key Section */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">API Key Management</h2>
          </div>
          <p className="text-sm text-muted-foreground">Generate and manage your API access keys</p>

          <div>
            <label className="text-sm font-medium text-foreground">Your API Key</label>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground">
                {showKey ? API_KEY : maskedKey}
              </div>
              <button onClick={() => setShowKey(!showKey)} className="rounded-md border border-border bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={copyKey} className="rounded-md border border-border bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-primary mt-1">Copied to clipboard!</p>}
            <p className="text-xs text-muted-foreground mt-1">Keep this key secure and don't share it publicly.</p>
          </div>

          <a href="https://docs.scaledown.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <BarChart3 className="h-3.5 w-3.5" /> View documentation for implementation examples
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.open("https://scaledown.ai/getapikey", "_blank")}
            className="w-full rounded-lg border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Generate New API Key
          </button>
          <button
            onClick={fetchUsageStats}
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <BarChart3 className="h-4 w-4" /> {loading ? "Fetching..." : "Fetch Usage Statistics Now"}
          </button>
        </div>

        {/* Usage Statistics */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Usage Statistics</h2>
            </div>
            <button onClick={fetchUsageStats} disabled={loading} className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatBox icon={Activity} label="Total Calls" value={stats.totalCalls.toString()} />
            <StatBox icon={Zap} label="Compression Ratio" value={stats.compressionRatio} />
            <StatBox icon={Clock} label="Avg Latency" value={stats.avgLatency} />
            <StatBox icon={DollarSign} label="Total Savings" value={stats.totalSavings} />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatBox label="Original Tokens" value={stats.originalTokens.toString()} />
            <StatBox label="Compressed Tokens" value={stats.compressedTokens.toString()} />
            <StatBox label="Response Tokens" value={stats.responseTokens.toString()} />
            <StatBox label="Tokens Saved" value={stats.tokensSaved.toString()} highlight />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, highlight }: { icon?: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 space-y-1">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <p className={`text-xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
