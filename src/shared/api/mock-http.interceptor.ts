import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { MOCK_ARTICLES, MOCK_SPORTS, MOCK_TAGS, RawArticle } from './mock-data';

const DELAY = 350;

export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;

  if (url.startsWith('/api/articles') && method === 'GET') {
    const p = req.params;
    const page    = Math.max(1, Number(p.get('page')    ?? 1));
    const perPage = Math.max(1, Number(p.get('perPage') ?? 8));
    const search  = (p.get('search') ?? '').toLowerCase();
    const sport   = p.get('sport')  ?? '';
    const tags    = p.getAll('tags') ?? [];
    let items: RawArticle[] = [...MOCK_ARTICLES];
    if (search) {
      items = items.filter(
        (a) => a.title.toLowerCase().includes(search) ||
               a.description.toLowerCase().includes(search),
      );
    }
    if (sport && sport !== 'all') { items = items.filter((a) => a.sport === sport); }
    if (tags.length) { items = items.filter((a) => tags.every((t) => a.tags.includes(t))); }
    const total      = items.length;
    const totalPages = Math.ceil(total / perPage);
    const data       = items.slice((page - 1) * perPage, page * perPage);
    const body       = { data, meta: { page, perPage, total, totalPages } };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(DELAY));
  }

  if (/\/api\/articles\/\d+\/like/.test(url) && method === 'PATCH') {
    const id = Number(url.split('/')[3]);
    const a  = MOCK_ARTICLES.find((x) => x.id === id);
    if (a) { a.liked = !a.liked; a.stats.likes += a.liked ? 1 : -1; }
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(120));
  }

  if (/\/api\/articles\/\d+\/comments/.test(url) && method === 'PATCH') {
    const id = Number(url.split('/')[3]);
    const a  = MOCK_ARTICLES.find((x) => x.id === id);
    if (a) { a.commentsOpen = !a.commentsOpen; }
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(120));
  }

  if (/\/api\/articles\/\d+$/.test(url) && method === 'DELETE') {
    const id  = Number(url.split('/')[3]);
    const idx = MOCK_ARTICLES.findIndex((x) => x.id === id);
    if (idx !== -1) { MOCK_ARTICLES.splice(idx, 1); }
    return of(new HttpResponse({ status: 200, body: { success: true } })).pipe(delay(120));
  }

  if (url === '/api/sports' && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_SPORTS })).pipe(delay(DELAY));
  }

  if (url === '/api/tags' && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_TAGS })).pipe(delay(DELAY));
  }

  return next(req);
};
