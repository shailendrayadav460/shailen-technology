import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { blogService } from '../services/blogService.js';

const BlogContext = createContext(null);

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading'); // loading | online | offline

  const refresh = useCallback(async (p = 1) => {
    setStatus('loading');
    try {
      const data = await blogService.list(p);
      setPosts(data.posts);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setStatus('online');
    } catch {
      setPosts([]);
      setStatus('offline');
    }
  }, []);

  useEffect(() => { refresh(1); }, [refresh]);

  const goToPage = useCallback((p) => { refresh(p); }, [refresh]);

  const getPostBySlug = useCallback(
    async (slug) => {
      try {
        return (await blogService.get(slug)).post;
      } catch (err) {
        if (err.status === 404) return null;
        return posts.find((p) => p.slug === slug) || null;
      }
    },
    [posts]
  );

  const value = useMemo(
    () => ({ posts, status, refresh, getPostBySlug, page, totalPages, total, goToPage }),
    [posts, status, refresh, getPostBySlug, page, totalPages, total, goToPage]
  );
  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export const useBlog = () => {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlog must be used inside BlogProvider');
  return ctx;
};
