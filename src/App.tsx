import { useMemo, useState, type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowUpRight,
  CalendarDays,
  CircleAlert,
  Clock3,
  ExternalLink,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function AptSunLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="20" fill="#FEBD11" />
      {Array.from({ length: 21 }).map((_, i) => {
        const angle = (i * 360) / 21;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 38 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 38 * Math.sin((angle * Math.PI) / 180)}
            stroke="#FEBD11"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function Home() {
  const topics = [
    { key: 'all', label: 'هەموو هەواڵەکان' },
    { key: 'ناوخۆیی', label: 'ناوخۆیی' },
    { key: 'گشتی', label: 'گشتی' },
  ];
  
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // هێنانی هەواڵەکان لە ئەی پی ئای خۆمان (تەلەگرام بۆت)
  const fetchNews = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/news');
      const json = await res.json();
      if (json.success && json.articles) {
        setArticles(json.articles);
      }
    } catch (err) {
      console.error('هەڵە لە هێنانی هەواڵەکان:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // نوێکردنەوەی خۆکار هەموو ١٠ چرکەیەک جارێک
    const interval = setInterval(fetchNews, 10000);
    return () => clearInterval(interval);
  }, []);

  // فلتەرکردنی هەواڵەکان بەپێی گەڕان
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery]);

  return (
    <div className="grain min-h-[100dvh] bg-background font-sans text-foreground" dir="rtl" lang="ku">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black border border-amber-500/30 p-1.5 shadow-md">
              <AptSunLogo className="h-full w-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-2xl font-black tracking-tight text-foreground">APT M</span>
                <span className="text-2xl font-black text-[#ED2024]">+</span>
              </div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">APT Media / پلاتفۆرمی زانیاری</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-[#278E43] animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground">تەلەگرام لایڤ بۆت</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:px-10">
        {/* Banner Section */}
        <section className="animate-rise-in relative overflow-hidden border-b border-border/80 pb-8 pt-8 sm:pb-12 sm:pt-12">
          <div className="relative max-w-3xl">
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#ED2024]">
              <span className="h-2 w-2 rounded-full bg-[#278E43]" />
              سیستمی خۆکاری تەلەگرام
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              هەواڵی خێرا و لایڤ، <br />
              <span className="text-[#278E43]">ڕاستەوخۆ لە تەلەگرامەوە.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              هەر پەیامێک لە بۆتی `@APTmedia_bot` بنێریت، دەستبەجێ لەسەر ئەم سایتە بڵاو دەبێتەوە.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="گەڕان بەدوای هەواڵەکاندا..."
                className="w-full rounded-2xl border border-border bg-card/80 py-3.5 pr-12 pl-4 text-sm text-foreground shadow-sm transition-all focus:border-[#278E43] focus:outline-none focus:ring-2 focus:ring-[#278E43]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  سڕینەوە
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Refresh Bar */}
        <section className="animate-rise-in border-b border-border/80 py-4" aria-label="کردارەکان">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground">نوێترین بڵاوکراوەکان</p>
            <button
              type="button"
              onClick={fetchNews}
              disabled={isRefreshing}
              className="group inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : 'transition-transform group-hover:rotate-45'} />
              {isRefreshing ? 'نوێکردنەوە...' : 'نوێکردنەوە'}
            </button>
          </div>
        </section>

        {/* News Feed Section */}
        <div className="pt-8 lg:pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <SectionKicker icon={<Clock3 size={14} className="text-[#ED2024]" />} label="لیستی هەواڵەکان" />
              <h2 className="mt-2 text-2xl font-bold tracking-tight">هەواڵە لایفەکان</h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">{filteredArticles.length} بابەت</span>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <HeadlineSkeleton />
            ) : filteredArticles.length === 0 ? (
              <EmptyStories topic="هیچ هەواڵێک نییە" />
            ) : (
              <div className="divide-y divide-border/80 rounded-2xl border border-border bg-card p-6">
                {filteredArticles.map((article, index) => (
                  <StoryRow key={`${article.url}-${index}`} article={article} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/80 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex items-center gap-2">
            <AptSunLogo className="h-5 w-5" />
            <span className="font-bold">APT Media</span>
          </div>
          <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
            تەواوی مافەکانی پارێزراوە بۆ APT Media Plus
          </p>
        </div>
      </footer>
    </div>
  );
}

type Article = {
  title: string;
  url: string;
  summary: string;
  published: string;
  source: string;
};

function SectionKicker({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#278E43]">
      {icon}
      {label}
    </p>
  );
}

function StoryRow({ article, index }: { article: Article; index: number }) {
  return (
    <article className="group py-4 first:pt-0 last:pb-0">
      <div className="flex items-start gap-3">
        <span className="pt-1 font-mono text-[10px] font-bold text-[#ED2024]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="block text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-[#278E43]">
            {article.title}
          </h3>
          {article.summary && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground whitespace-pre-line">{article.summary}</p>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            <span className="font-bold text-[#278E43]">{article.source || 'APT Media'}</span>
            <span>•</span>
            <span>{article.published}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function HeadlineSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((item) => (
        <div className="h-16 w-full bg-muted animate-pulse rounded-xl" key={item} />
      ))}
    </div>
  );
}

function EmptyStories({ topic }: { topic: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center">
      <p className="text-sm font-medium">{topic}</p>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
