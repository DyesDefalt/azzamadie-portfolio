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
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/* ---------- Categories ---------- */
async function fetchCategories() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_categories')
    .select('*')
    .order('name');
  if (error) { console.error('Error fetching categories:', error); return []; }
  return data || [];
}

/* ---------- Posts (Published) ---------- */
async function fetchPublishedPosts({ category = null, page = 1, perPage = 10 } = {}) {
  const sb = getSupabase();
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
  if (error) { console.error('Error fetching posts:', error); return { posts: [], total: 0 }; }
  return { posts: data || [], total: count || 0 };
}

/* ---------- Single Post ---------- */
async function fetchPostBySlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('Error fetching post:', error); return null; }
  return data;
}

/* ---------- Related Posts ---------- */
async function fetchRelatedPosts(category, excludeId, limit = 3) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, category, published_at, reading_time')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) { console.error('Error fetching related:', error); return []; }
  return data || [];
}

/* ---------- Admin: All Posts ---------- */
async function fetchAllPosts({ status = null, category = null, search = '', sort = 'published_at', sortDir = 'desc' } = {}) {
  const sb = getSupabase();
  let query = sb
    .from('blog_posts')
    .select('*')
    .order(sort, { ascending: sortDir === 'asc' });

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error } = await query;
  if (error) { console.error('Error fetching all posts:', error); return []; }
  return data || [];
}

/* ---------- Admin: CRUD ---------- */
async function createPost(postData) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .insert([postData])
    .select()
    .single();
  if (error) { console.error('Error creating post:', error); return { data: null, error }; }
  return { data, error: null };
}

async function updatePost(id, postData) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single();
  if (error) { console.error('Error updating post:', error); return { data: null, error }; }
  return { data, error: null };
}

async function deletePost(id) {
  const sb = getSupabase();
  const { error } = await sb
    .from('blog_posts')
    .delete()
    .eq('id', id);
  if (error) { console.error('Error deleting post:', error); return { error }; }
  return { error: null };
}

async function fetchPostById(id) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('Error fetching post by id:', error); return null; }
  return data;
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
