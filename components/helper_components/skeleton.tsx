export default function Skeleton() {
  return (
    <div className="lead-insights">
      <div className="lead-insights__header">
        <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-3 w-72 bg-slate-200 rounded-md animate-pulse mt-2" />
      </div>
      <div className="lead-insights__grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="insight-card">
            <div className="h-3 w-2/5 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse mt-2" />
            <div className="h-20 w-full bg-slate-200 rounded-md animate-pulse mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
