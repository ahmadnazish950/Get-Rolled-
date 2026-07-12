import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Pencil, Trash2, Check, X, CornerDownRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function timeAgo(dateString) {
  const diffMs = Math.max(0, Date.now() - new Date(dateString).getTime());
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(dateString).toLocaleDateString();
}

function buildTree(list) {
  const map = new Map();
  list.forEach((c) => map.set(c._id, { ...c, children: [] }));
  const roots = [];
  map.forEach((c) => {
    if (c.parent && map.has(c.parent)) {
      map.get(c.parent).children.push(c);
    } else {
      roots.push(c);
    }
  });
  return roots;
}

function CommentRow({ comment, postId, depth, onChanged, replyingTo, setReplyingTo }) {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);
  const isOwner = comment.user?._id === user?.id;
  const isReplying = replyingTo === comment._id;
  const initial = comment.user?.username?.[0]?.toUpperCase() || "?";

  async function saveEdit() {
    if (!editText.trim()) return;
    setBusy(true);
    try {
      await api.patch(`/comment/${comment._id}`, { text: editText.trim() });
      setEditing(false);
      onChanged();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't update the comment.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await api.delete(`/comment/${comment._id}`);
      onChanged();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't delete the comment.");
      setBusy(false);
    }
  }

  async function submitReply() {
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      await api.post(`/comment/post/${postId}`, {
        text: replyText.trim(),
        parentId: comment._id,
      });
      setReplyText("");
      setReplyingTo(null);
      onChanged();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't post the reply.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={depth > 0 ? "ml-6 border-l border-ink-line pl-4 sm:ml-8" : ""}>
      <div className="flex gap-2.5 py-2.5">
        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-amber/25 bg-amber/10 font-display text-[10px] font-semibold text-amber">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-mono text-xs font-medium text-paper">
              {comment.user?.username || "unknown"}
            </span>
            <span className="font-mono text-[10px] text-paper-dim">{timeAgo(comment.createdAt)}</span>
            {comment.edited && (
              <span className="font-mono text-[10px] italic text-paper-dim">(edited)</span>
            )}
          </div>

          {editing ? (
            <div className="mt-1.5 flex items-center gap-2">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                className="w-full rounded-lg border border-ink-line bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-amber"
                autoFocus
              />
              <button
                onClick={saveEdit}
                disabled={busy}
                aria-label="Save edit"
                className="text-sage transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditText(comment.text);
                }}
                disabled={busy}
                aria-label="Cancel edit"
                className="text-paper-dim hover:text-paper disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="mt-0.5 whitespace-pre-wrap break-words font-body text-sm text-paper">
              {comment.text}
            </p>
          )}

          <div className="mt-1 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wide text-paper-dim">
            <button
              onClick={() => setReplyingTo(isReplying ? null : comment._id)}
              className="flex items-center gap-1 hover:text-amber"
            >
              <CornerDownRight className="h-3 w-3" />
              Reply
            </button>
            {isOwner && !editing && (
              <>
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 hover:text-amber">
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={busy}
                  className="flex items-center gap-1 hover:text-safelight disabled:opacity-40"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </>
            )}
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 flex items-center gap-2 overflow-hidden"
              >
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user?.username || "this comment"}…`}
                  className="w-full rounded-lg border border-ink-line bg-ink px-3 py-1.5 font-body text-sm text-paper outline-none focus:border-amber"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && submitReply()}
                />
                <button
                  onClick={submitReply}
                  disabled={busy}
                  aria-label="Send reply"
                  className="text-amber transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {comment.children?.length > 0 && (
        <div className="flex flex-col">
          {comment.children.map((child) => (
            <CommentRow
              key={child._id}
              comment={child}
              postId={postId}
              depth={depth + 1}
              onChanged={onChanged}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Comments({ postId, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/comment/post/${postId}`);
      setComments(data.comments || []);
      onCountChange?.(data.comments?.length || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't load comments.");
    } finally {
      setLoading(false);
    }
  }, [postId, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitComment() {
    if (!text.trim()) return;
    setPosting(true);
    try {
      await api.post(`/comment/post/${postId}`, { text: text.trim() });
      setText("");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't post the comment.");
    } finally {
      setPosting(false);
    }
  }

  const tree = buildTree(comments);

  return (
    <div className="border-t border-ink-line bg-ink/40 px-4 py-3.5">
      <div className="mb-2 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          className="w-full rounded-full border border-ink-line bg-ink px-4 py-2 font-body text-sm text-paper outline-none focus:border-amber"
        />
        <button
          onClick={submitComment}
          disabled={posting || !text.trim()}
          aria-label="Post comment"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber text-ink transition-transform hover:scale-105 disabled:opacity-40"
        >
          {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      {loading ? (
        <p className="py-3 text-center font-mono text-xs text-paper-dim">Loading comments…</p>
      ) : tree.length === 0 ? (
        <p className="py-3 text-center font-mono text-xs text-paper-dim">No comments yet. Say something.</p>
      ) : (
        <div className="flex flex-col divide-y divide-ink-line/60">
          {tree.map((c) => (
            <CommentRow
              key={c._id}
              comment={c}
              postId={postId}
              depth={0}
              onChanged={load}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
