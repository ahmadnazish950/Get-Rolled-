import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Upload, ImagePlus } from "lucide-react";
import { usePosts } from "../context/PostContext";
import toast from "react-hot-toast";

const MAX_SIZE_MB = 8;

export default function Composer({ open, onClose }) {
  const { createPost, uploading, uploadProgress } = usePosts();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setDragActive(false);
  }, []);

  function handleClose() {
    if (uploading) return; // don't let the roll close mid-development
    reset();
    onClose();
  }

  function acceptFile(candidate) {
    if (!candidate) return;
    if (!candidate.type.startsWith("image/")) {
      toast.error("That's not an image file.");
      return;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Keep it under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  async function handleSubmit() {
    if (!file) return;
    const result = await createPost(file);
    if (result.ok) {
      toast.success("Developed and posted.");
      reset();
      onClose();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl border border-ink-line bg-ink-soft p-5 sm:rounded-3xl sm:p-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-paper">New exposure</h2>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-paper-dim hover:text-paper disabled:opacity-40"
                disabled={uploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* viewfinder dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              className={`relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border transition-colors ${
                dragActive ? "border-amber bg-amber/5" : "border-ink-line bg-ink"
              }`}
            >
              {/* corner brackets, camera AF style */}
              {["-top-0 -left-0 border-t-2 border-l-2 rounded-tl-lg", "-top-0 -right-0 border-t-2 border-r-2 rounded-tr-lg", "-bottom-0 -left-0 border-b-2 border-l-2 rounded-bl-lg", "-bottom-0 -right-0 border-b-2 border-r-2 rounded-br-lg"].map(
                (cls, i) => (
                  <span
                    key={i}
                    className={`pointer-events-none absolute h-6 w-6 border-amber/70 m-3 ${cls}`}
                  />
                )
              )}

              {preview ? (
                <img src={preview} alt="Selected preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 px-6 text-center">
                  <ImagePlus className="h-8 w-8 text-ink-line" strokeWidth={1.5} />
                  <p className="font-mono text-xs text-paper-dim">
                    Drag a photo here, or tap to choose one
                  </p>
                </div>
              )}

              {/* developing overlay */}
              {uploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70">
                  <div className="relative h-full w-full overflow-hidden">
                    <div className="animate-scan absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-safelight/30 to-transparent" />
                  </div>
                  <div className="absolute flex flex-col items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-amber animate-flicker">
                      Developing…
                    </span>
                    <span className="font-mono text-[11px] text-paper-dim">{uploadProgress}%</span>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />

            <p className="mt-3 font-mono text-[11px] text-paper-dim">
              The caption is written by AI once you upload. Sarcasm may occur.
            </p>

            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-amber py-3 font-mono text-xs font-medium uppercase tracking-wide text-ink transition-transform enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Upload className="h-4 w-4" strokeWidth={2.4} />
              {uploading ? "Developing…" : "Post to the roll"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
