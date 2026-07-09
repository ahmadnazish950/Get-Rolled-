import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/axios";

const PostContext = createContext(null);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [feedError, setFeedError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastCreatedId, setLastCreatedId] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoadingFeed(true);
    setFeedError(null);
    try {
      const { data } = await api.get("/post");
      setPosts(data.posts || []);
    } catch (error) {
      setFeedError(error?.response?.data?.message || "Couldn't load the roll. Check your connection.");
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  const createPost = useCallback(async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/post", formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      });

      setPosts((prev) => [data.post, ...prev]);
      setLastCreatedId(data.post._id);
      return { ok: true, post: data.post };
    } catch (error) {
      return {
        ok: false,
        message: error?.response?.data?.message || "Couldn't develop that photo. Try again.",
      };
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      await api.delete(`/post/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error?.response?.data?.message || "Couldn't delete that post. Try again.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({
      posts,
      loadingFeed,
      feedError,
      fetchPosts,
      createPost,
      deletePost,
      uploading,
      uploadProgress,
      lastCreatedId,
    }),
    [posts, loadingFeed, feedError, fetchPosts, createPost, deletePost, uploading, uploadProgress, lastCreatedId]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error("usePosts must be used inside a PostProvider");
  return ctx;
}
