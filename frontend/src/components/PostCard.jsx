import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Share2, Check, X, Heart, MessageCircle, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostContext";
import Comments from "./Comments";

const HOLES = Array.from({ length: 8 });
const BURST_ANGLES = [0, 60, 120, 180, 240, 300];

function LikeBurst() {
  return (
    <>
      {BURST_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 16;
        const y = Math.sin(rad) * 16;
        return (
          <motion.span
            key={angle}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1, x, y }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-safelight"
          />
        );
      })}
    </>
  );
}

export default function PostCard({ post, frameNumber, isNew, isBestCaption }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? 0);
  const { user } = useAuth();
  const { deletePost, toggleLike } = usePosts();

  const [liked, setLiked] = useState((post.likes || []).includes(user?.id));
  const [likesCount, setLikesCount] = useState(post.likesCount ?? (post.likes || []).length);
  const [justLiked, setJustLiked] = useState(false);

  const label = String(frameNumber).padStart(3, "0");
  const username = post.user?.username || "unknown";
  const initial = username[0]?.toUpperCase() || "?";
  const isOwner = post.user?._id === user?.id;

  async function handleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => c + (nextLiked ? 1 : -1));
    if (nextLiked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 550);
    }

    const result = await toggleLike(post._id, user?.id);
    if (result.ok) {
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } else if (result.reverted) {
      // context already refetched the feed to resync state
      setLiked((prev) => prev);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deletePost(post._id);
    setDeleting(false);
    if (result.ok) {
      toast("Post deleted.", { icon: "🗑️" });
    } else {
      toast.error(result.message);
      setConfirmingDelete(false);
    }
  }

  async function handleShare() {
    const shareData = {
      title: "Roll",
      text: post.caption,
      url: post.image,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the share sheet, nothing to do
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(post.image);
      toast.success("Image link copied.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-ink-soft transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.55)] ${
        isBestCaption ? "border-amber/50 shadow-[0_0_0_1px_rgba(245,166,35,0.15)]" : "border-ink-line"
      } ${isNew ? "animate-develop" : ""}`}
    >
      <div className="flex">
        {/* sprocket rail */}
        <div className="hidden w-6 shrink-0 flex-col items-center justify-around bg-ink py-3 sm:flex">
          {HOLES.map((_, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-ink-soft" />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          {/* meta row */}
          <div className="flex items-center justify-between gap-2 border-b border-ink-line px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-amber/25 bg-amber/10 font-display text-[11px] font-semibold text-amber">
                {initial}
              </span>
              <span className="truncate font-mono text-xs text-paper-dim">{username}</span>
              {isBestCaption && (
                <span className="flex flex-none items-center gap-1 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber">
                  <Trophy className="h-2.5 w-2.5" />
                  Best caption
                </span>
              )}
            </div>

            <div className="flex flex-none items-center gap-1">
              <span className="mr-1 font-mono text-[11px] tracking-widest text-amber">No. {label}</span>

              <button
                onClick={handleShare}
                aria-label="Share this post"
                className="rounded-full p-1.5 text-paper-dim transition-colors hover:bg-ink-line hover:text-paper"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>

              {isOwner &&
                (confirmingDelete ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      aria-label="Confirm delete"
                      className="rounded-full bg-safelight/20 p-1.5 text-safelight transition-colors hover:bg-safelight/30 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleting}
                      aria-label="Cancel delete"
                      className="rounded-full p-1.5 text-paper-dim transition-colors hover:bg-ink-line hover:text-paper disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    aria-label="Delete this post"
                    className="rounded-full p-1.5 text-paper-dim transition-colors hover:bg-safelight/20 hover:text-safelight"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ))}
            </div>
          </div>

          {/* image */}
          <div className="relative aspect-[4/5] w-full bg-ink sm:aspect-[4/3]">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-line/60 to-ink" />
            )}
            <img
              src={post.image}
              alt={post.caption || "A photo shared on Roll"}
              onLoad={() => setImgLoaded(true)}
              className={`h-full w-full object-cover transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              } ${deleting ? "opacity-40" : ""}`}
              loading="lazy"
            />
            <AnimatePresence>
              {confirmingDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-ink/75 px-6 text-center backdrop-blur-[2px]"
                >
                  <p className="font-mono text-xs text-paper">
                    {deleting ? "Deleting…" : "Delete this exposure? This can't be undone."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* caption */}
          <div className="px-4 py-3.5">
            <p
              className={`whitespace-pre-wrap font-mono text-sm leading-relaxed text-paper ${
                isNew ? "animate-typewriter" : ""
              }`}
            >
              {post.caption}
            </p>
          </div>

          {/* like + comment action row */}
          <div className="flex items-center gap-1 border-t border-ink-line px-3 py-2">
            <button
              onClick={handleLike}
              aria-label={liked ? "Unlike this post" : "Like this post"}
              className="relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-xs text-paper-dim transition-colors hover:bg-ink-line"
            >
              <span className="relative inline-flex">
                <motion.span
                  animate={justLiked ? { scale: [1, 1.5, 0.9, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      liked ? "fill-safelight text-safelight" : "text-paper-dim"
                    }`}
                  />
                </motion.span>
                <AnimatePresence>{justLiked && <LikeBurst />}</AnimatePresence>
              </span>
              <span className={liked ? "text-safelight" : ""}>{likesCount}</span>
            </button>

            <button
              onClick={() => setCommentsOpen((v) => !v)}
              aria-expanded={commentsOpen}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-xs text-paper-dim transition-colors hover:bg-ink-line"
            >
              <MessageCircle className={`h-4 w-4 ${commentsOpen ? "text-amber" : ""}`} />
              <span className={commentsOpen ? "text-amber" : ""}>{commentsCount}</span>
            </button>
          </div>

          {commentsOpen && <Comments postId={post._id} onCountChange={setCommentsCount} />}
        </div>
      </div>
    </article>
  );
}
