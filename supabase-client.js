/* ==========================================================================
   supabase-client.js — Shared Supabase Client Module
   Blog CMS for Ahmad Azzam Fuadie Portfolio
   ========================================================================== */

const SUPABASE_URL = 'https://bpvvfbobgwrmukdqmvnw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdnZmYm9iZ3dybXVrZHFtdm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjc0MjQsImV4cCI6MjA5MDY0MzQyNH0.kPvTW49WzzwFx5QOzuDr8NGYBp7Li0HT-ww1oE2sxSY';

// Initialize after supabase SDK is loaded
let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    if (typeof supabase === 'undefined') {
      console.warn('Supabase SDK not loaded yet.');
      return null;
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init = {}) => {
          // Add a sane timeout so requests don't hang forever when the project
          // is paused or offline. AbortController is supported in all modern browsers.
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          return fetch(input, { ...init, signal: controller.signal })
            .finally(() => clearTimeout(timeoutId));
        }
      }
    });
  }
  return supabaseClient;
}

function formatSupabaseError(error) {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  return error.message || error.error_description || error.details || error.hint || JSON.stringify(error);
}

async function safeQuery(label, runner, fallback) {
  try {
    const sb = getSupabase();
    if (!sb) return fallback;
    return await runner(sb);
  } catch (err) {
    if (err && err.name === 'AbortError') {
      console.warn(`${label}: request timed out (Supabase may be paused or offline).`);
    } else {
      console.warn(`${label}: ${formatSupabaseError(err)}`);
    }
    return fallback;
  }
}

/* ---------- Categories ---------- */
async function fetchCategories() {
  return safeQuery('Error fetching categories', async (sb) => {
    const { data, error } = await sb
      .from('blog_categories')
      .select('*')
      .order('name');
    if (error) { console.warn('Error fetching categories:', formatSupabaseError(error)); return []; }
    return data || [];
  }, []);
}

/* ---------- Posts (Published) ---------- */
async function fetchPublishedPosts({ category = null, page = 1, perPage = 10 } = {}) {
  return safeQuery('Error fetching posts', async (sb) => {
    let query = sb
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, category, tags, author, status, published_at, reading_time, word_count, ai_generated, article_type', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) { console.warn('Error fetching posts:', formatSupabaseError(error)); return { posts: [], total: 0 }; }
    return { posts: data || [], total: count || 0 };
  }, { posts: [], total: 0 });
}

/* ---------- Single Post ---------- */
async function fetchPostBySlug(slug) {
  return safeQuery('Error fetching post', async (sb) => {
    const { data, error } = await sb
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) { console.warn('Error fetching post:', formatSupabaseError(error)); return null; }
    return data;
  }, null);
}

/* ---------- Related Posts ---------- */
async function fetchRelatedPosts(category, excludeId, limit = 3) {
  return safeQuery('Error fetching related', async (sb) => {
    const { data, error } = await sb
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, category, published_at, reading_time')
      .eq('status', 'published')
      .eq('category', category)
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) { console.warn('Error fetching related:', formatSupabaseError(error)); return []; }
    return data || [];
  }, []);
}

/* ---------- Admin: All Posts ---------- */
async function fetchAllPosts({ status = null, category = null, search = '', sort = 'published_at', sortDir = 'desc' } = {}) {
  return safeQuery('Error fetching all posts', async (sb) => {
    let query = sb
      .from('blog_posts')
      .select('*')
      .order(sort, { ascending: sortDir === 'asc' });

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) { console.warn('Error fetching all posts:', formatSupabaseError(error)); return []; }
    return data || [];
  }, []);
}

/* ---------- Admin: CRUD ---------- */
async function createPost(postData) {
  try {
    const sb = getSupabase();
    if (!sb) return { data: null, error: { message: 'Supabase SDK not loaded' } };
    const { data, error } = await sb
      .from('blog_posts')
      .insert([postData])
      .select()
      .single();
    if (error) { console.warn('Error creating post:', formatSupabaseError(error)); return { data: null, error }; }
    return { data, error: null };
  } catch (err) {
    console.warn('Error creating post:', formatSupabaseError(err));
    return { data: null, error: err };
  }
}

async function updatePost(id, postData) {
  try {
    const sb = getSupabase();
    if (!sb) return { data: null, error: { message: 'Supabase SDK not loaded' } };
    const { data, error } = await sb
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();
    if (error) { console.warn('Error updating post:', formatSupabaseError(error)); return { data: null, error }; }
    return { data, error: null };
  } catch (err) {
    console.warn('Error updating post:', formatSupabaseError(err));
    return { data: null, error: err };
  }
}

async function deletePost(id) {
  try {
    const sb = getSupabase();
    if (!sb) return { error: { message: 'Supabase SDK not loaded' } };
    const { error } = await sb
      .from('blog_posts')
      .delete()
      .eq('id', id);
    if (error) { console.warn('Error deleting post:', formatSupabaseError(error)); return { error }; }
    return { error: null };
  } catch (err) {
    console.warn('Error deleting post:', formatSupabaseError(err));
    return { error: err };
  }
}

async function fetchPostById(id) {
  return safeQuery('Error fetching post by id', async (sb) => {
    const { data, error } = await sb
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) { console.warn('Error fetching post by id:', formatSupabaseError(error)); return null; }
    return data;
  }, null);
}

/* ---------- Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncateText(text, maxLen = 120) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calcReadingTime(text) {
  if (!text) return 0;
  const words = text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function calcWordCount(text) {
  if (!text) return 0;
  return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
}

function parseTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean).map(String);
  if (typeof tags !== 'string') return [];
  const trimmed = tags.trim();
  if (!trimmed) return [];
  // Try JSON array first (e.g. '["a","b"]' or '[]')
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch (e) { /* fall through to comma split */ }
  }
  return trimmed.split(',').map(t => t.trim()).filter(Boolean);
}

// Gradient placeholders for posts without cover images
const GRADIENT_PLACEHOLDERS = [
  'linear-gradient(135deg, #00d4aa 0%, #6366f1 100%)',
  'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #f97316 0%, #a855f7 100%)',
];

function getPlaceholderGradient(id) {
  const idx = typeof id === 'number' ? id : (id || '').toString().charCodeAt(0) || 0;
  return GRADIENT_PLACEHOLDERS[idx % GRADIENT_PLACEHOLDERS.length];
}
