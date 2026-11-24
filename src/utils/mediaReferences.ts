import type { MediaUsageRef } from '../types';
import { POPULAR_ATTRACTIONS, syncCustomAttractions } from '../data/mockData';
import {
  getStoredBanners,
  saveStoredBanners,
  getStoredLargeHeroBannerConfig,
  saveStoredLargeHeroBannerConfig,
} from './bannerStorage';
import { FAVICON_STORAGE_KEY, applyFaviconToDocument, type FaviconConfig } from './faviconManager';

function urlsMatch(candidate: string | undefined | null, targetUrl: string, targetPath?: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();
  if (!trimmed) return false;
  if (targetUrl && trimmed === targetUrl) return true;
  if (targetUrl && trimmed.includes(targetUrl)) return true;
  if (targetPath && targetPath.length > 4 && trimmed.includes(targetPath)) return true;
  return false;
}

/**
 * Scans client-side cached & persisted website records (activities, banners, hero slides,
 * blog posts, favicon) to find every place a given Supabase Storage media URL is linked.
 */
export function findClientMediaReferences(publicUrl: string, objectPath?: string): MediaUsageRef[] {
  const refs: MediaUsageRef[] = [];
  if (!publicUrl && !objectPath) return refs;

  try {
    // 1. Activities (cover image, gallery images, activity video)
    for (const attr of POPULAR_ATTRACTIONS) {
      if (urlsMatch(attr.imageUrl, publicUrl, objectPath)) {
        refs.push({
          type: 'activity',
          id: attr.id,
          title: attr.name,
          field: 'Cover Image',
        });
      }
      if (Array.isArray(attr.galleryUrls) && attr.galleryUrls.some((g) => urlsMatch(g, publicUrl, objectPath))) {
        refs.push({
          type: 'activity',
          id: attr.id,
          title: attr.name,
          field: 'Gallery Photo',
        });
      }
      if (urlsMatch(attr.videoUrl, publicUrl, objectPath)) {
        refs.push({
          type: 'activity',
          id: attr.id,
          title: attr.name,
          field: 'Activity Video',
        });
      }
    }

    // 2. Promotional Banners
    const banners = getStoredBanners();
    for (const banner of banners) {
      if (urlsMatch(banner.customImageUrl, publicUrl, objectPath)) {
        refs.push({
          type: 'banner',
          id: banner.id,
          title: banner.title || 'Promotional Banner',
          field: 'Banner Image',
        });
      }
    }

    // 3. Large Hero Banner Slides
    const heroConfig = getStoredLargeHeroBannerConfig();
    for (const slide of heroConfig.slides || []) {
      if (urlsMatch(slide.imageUrl, publicUrl, objectPath)) {
        refs.push({
          type: 'hero-slide',
          id: slide.id,
          title: slide.title || 'Hero Slide',
          field: 'Hero Slide Image',
        });
      }
    }

    // 4. Blog Posts
    if (typeof window !== 'undefined') {
      try {
        const rawBlogs = localStorage.getItem('tiqsey_blog_posts');
        if (rawBlogs) {
          const posts = JSON.parse(rawBlogs);
          if (Array.isArray(posts)) {
            for (const post of posts) {
              if (urlsMatch(post?.featuredImage, publicUrl, objectPath)) {
                refs.push({
                  type: 'blog',
                  id: String(post.id || ''),
                  title: post.title || 'Blog Post',
                  field: 'Featured Image',
                });
              } else if (typeof post?.content === 'string' && urlsMatch(post.content, publicUrl, objectPath)) {
                refs.push({
                  type: 'blog',
                  id: String(post.id || ''),
                  title: post.title || 'Blog Post',
                  field: 'Inline Article Media',
                });
              }
            }
          }
        }
      } catch {
        // Ignore malformed localStorage blog entries
      }

      // 5. Active Favicon
      try {
        const rawFav = localStorage.getItem(FAVICON_STORAGE_KEY);
        if (rawFav) {
          const fav: FaviconConfig = JSON.parse(rawFav);
          if (urlsMatch(fav?.url, publicUrl, objectPath)) {
            refs.push({
              type: 'favicon',
              id: 'site_favicon',
              title: 'Website Favicon',
              field: 'Favicon Asset',
            });
          }
        }
      } catch {
        // Ignore malformed favicon entry
      }
    }
  } catch (err) {
    console.warn('[mediaReferences] Failed scanning client references:', err);
  }

  return refs;
}

/**
 * Merges server-reported references and client-side references without duplicates.
 */
export function mergeMediaReferences(
  serverRefs: MediaUsageRef[],
  clientRefs: MediaUsageRef[]
): MediaUsageRef[] {
  const map = new Map<string, MediaUsageRef>();
  for (const ref of [...serverRefs, ...clientRefs]) {
    const key = `${ref.type}:${ref.id}:${ref.field}`;
    if (!map.has(key)) {
      map.set(key, ref);
    }
  }
  return Array.from(map.values());
}

/**
 * Auto-updates all client-side records (activities, promotional banners, hero slides,
 * blog posts, and favicon) when a media file is replaced or moved/renamed so zero broken URLs remain.
 */
export function replaceClientMediaReferences(oldUrl: string, newUrl: string): MediaUsageRef[] {
  const updated: MediaUsageRef[] = [];
  if (!oldUrl || !newUrl || oldUrl === newUrl) return updated;

  try {
    // 1. Activities
    let activitiesChanged = false;
    const nextAttractions = POPULAR_ATTRACTIONS.map((attr) => {
      let modified = false;
      const clone = { ...attr };

      if (clone.imageUrl === oldUrl) {
        clone.imageUrl = newUrl;
        modified = true;
        updated.push({ type: 'activity', id: attr.id, title: attr.name, field: 'Cover Image' });
      }
      if (Array.isArray(clone.galleryUrls) && clone.galleryUrls.includes(oldUrl)) {
        clone.galleryUrls = clone.galleryUrls.map((g) => (g === oldUrl ? newUrl : g));
        modified = true;
        updated.push({ type: 'activity', id: attr.id, title: attr.name, field: 'Gallery Photo' });
      }
      if (clone.videoUrl === oldUrl) {
        clone.videoUrl = newUrl;
        modified = true;
        updated.push({ type: 'activity', id: attr.id, title: attr.name, field: 'Activity Video' });
      }

      if (modified) activitiesChanged = true;
      return clone;
    });

    if (activitiesChanged) {
      syncCustomAttractions(nextAttractions);
    }

    // 2. Promotional Banners
    const banners = getStoredBanners();
    let bannersChanged = false;
    const nextBanners = banners.map((b) => {
      if (b.customImageUrl === oldUrl) {
        bannersChanged = true;
        updated.push({ type: 'banner', id: b.id, title: b.title || 'Promotional Banner', field: 'Banner Image' });
        return { ...b, customImageUrl: newUrl, updatedAt: new Date().toISOString() };
      }
      return b;
    });
    if (bannersChanged) {
      saveStoredBanners(nextBanners);
    }

    // 3. Large Hero Banner Slides
    const heroConfig = getStoredLargeHeroBannerConfig();
    let heroChanged = false;
    const nextSlides = (heroConfig.slides || []).map((s) => {
      if (s.imageUrl === oldUrl) {
        heroChanged = true;
        updated.push({ type: 'hero-slide', id: s.id, title: s.title || 'Hero Slide', field: 'Hero Slide Image' });
        return { ...s, imageUrl: newUrl, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    if (heroChanged) {
      saveStoredLargeHeroBannerConfig({ ...heroConfig, slides: nextSlides });
    }

    // 4. Blog Posts
    if (typeof window !== 'undefined') {
      try {
        const rawBlogs = localStorage.getItem('tiqsey_blog_posts');
        if (rawBlogs && rawBlogs.includes(oldUrl)) {
          const posts = JSON.parse(rawBlogs);
          if (Array.isArray(posts)) {
            let blogsChanged = false;
            const nextPosts = posts.map((post: any) => {
              let changed = false;
              const copy = { ...post };
              if (copy.featuredImage === oldUrl) {
                copy.featuredImage = newUrl;
                changed = true;
                updated.push({
                  type: 'blog',
                  id: String(copy.id || ''),
                  title: copy.title || 'Blog Post',
                  field: 'Featured Image',
                });
              }
              if (typeof copy.content === 'string' && copy.content.includes(oldUrl)) {
                copy.content = copy.content.split(oldUrl).join(newUrl);
                changed = true;
                updated.push({
                  type: 'blog',
                  id: String(copy.id || ''),
                  title: copy.title || 'Blog Post',
                  field: 'Inline Article Media',
                });
              }
              if (changed) blogsChanged = true;
              return copy;
            });
            if (blogsChanged) {
              localStorage.setItem('tiqsey_blog_posts', JSON.stringify(nextPosts));
              window.dispatchEvent(new Event('tiqsey_blog_posts_updated'));
            }
          }
        }
      } catch {
        // Ignore blog update errors
      }

      // 5. Active Favicon
      try {
        const rawFav = localStorage.getItem(FAVICON_STORAGE_KEY);
        if (rawFav && rawFav.includes(oldUrl)) {
          const fav: FaviconConfig = JSON.parse(rawFav);
          if (fav.url === oldUrl) {
            const nextFav = { ...fav, url: newUrl, updatedAt: new Date().toISOString() };
            localStorage.setItem(FAVICON_STORAGE_KEY, JSON.stringify(nextFav));
            applyFaviconToDocument(nextFav);
            updated.push({
              type: 'favicon',
              id: 'site_favicon',
              title: 'Website Favicon',
              field: 'Favicon Asset',
            });
          }
        }
      } catch {
        // Ignore favicon update errors
      }
    }
  } catch (err) {
    console.warn('[mediaReferences] Failed updating client references:', err);
  }

  return updated;
}
