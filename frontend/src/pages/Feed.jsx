import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Composer from "../components/Composer";
import PostCard from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import { usePosts } from "../context/PostContext";
import { AlertTriangle, RefreshCw } from "lucide-react";

function FrameSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-line bg-ink-soft">
      <div className="h-10 border-b border-ink-line bg-ink-line/20" />
      <div className="aspect-[4/5] animate-pulse bg-gradient-to-br from-ink-line/50 to-ink sm:aspect-[4/3]" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 animate-pulse rounded bg-ink-line/50" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink-line/50" />
      </div>
    </div>
  );
}

export default function Feed() {
  const { posts, loadingFeed, feedError, fetchPosts, lastCreatedId } = usePosts();
  const [composerOpen, setComposerOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const total = posts.length;

  return (
    <div className="min-h-screen bg-ink">
      <Navbar onUploadClick={() => setComposerOpen(true)} />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber">Your roll</span>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-paper">The feed</h1>
          </div>
          {!loadingFeed && !feedError && (
            <span className="font-mono text-[11px] text-paper-dim">
              {total} {total === 1 ? "frame" : "frames"}
            </span>
          )}
        </div>

        {loadingFeed && (
          <div className="flex flex-col gap-6">
            <FrameSkeleton />
            <FrameSkeleton />
          </div>
        )}

        {!loadingFeed && feedError && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-safelight/40 bg-safelight/10 px-6 py-12 text-center">
            <AlertTriangle className="h-7 w-7 text-safelight" />
            <p className="font-mono text-sm text-paper">{feedError}</p>
            <button
              onClick={fetchPosts}
              className="mt-1 flex items-center gap-2 rounded-full border border-ink-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper hover:border-amber hover:text-amber"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        )}

        {!loadingFeed && !feedError && total === 0 && (
          <EmptyState onUploadClick={() => setComposerOpen(true)} />
        )}

        {!loadingFeed && !feedError && total > 0 && (
          <div className="flex flex-col gap-6">
            {posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                frameNumber={total - index}
                isNew={post._id === lastCreatedId}
              />
            ))}
          </div>
        )}
      </main>

      <Composer open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}
