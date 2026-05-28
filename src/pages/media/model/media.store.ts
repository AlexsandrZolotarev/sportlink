import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { ArticlesApiService } from '../../../entities/article';
import { Article, ActiveFilters, SportType, Tag } from '../../../entities/article';

export interface MediaState {
  articles: Article[];
  sports: SportType[];
  tags: Tag[];
  filters: ActiveFilters;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  loading: boolean;
  loadingMeta: boolean;
}

@Injectable()
export class MediaStore {
  private readonly api = inject(ArticlesApiService);

  // ── State ────────────────────────────────────────────────────────────────
  private readonly _articles   = signal<Article[]>([]);
  private readonly _sports     = signal<SportType[]>([]);
  private readonly _tags       = signal<Tag[]>([]);
  private readonly _page       = signal(1);
  private readonly _perPage    = signal(1);
  private readonly _total      = signal(0);
  private readonly _totalPages = signal(1);
  private readonly _loading    = signal(false);
  private readonly _loadingMeta = signal(false);
  private readonly _filters    = signal<ActiveFilters>({ search: '', sport: 'all', tags: [] });

  // ── Selectors ────────────────────────────────────────────────────────────
  readonly articles   = this._articles.asReadonly();
  readonly sports     = this._sports.asReadonly();
  readonly tags       = this._tags.asReadonly();
  readonly page       = this._page.asReadonly();
  readonly perPage    = this._perPage.asReadonly();
  readonly total      = this._total.asReadonly();
  readonly totalPages = this._totalPages.asReadonly();
  readonly loading    = this._loading.asReadonly();
  readonly loadingMeta = this._loadingMeta.asReadonly();
  readonly filters    = this._filters.asReadonly();

  readonly activeFilterCount = computed(() => {
    const f = this._filters();
    let count = 0;
    if (f.search) count++;
    if (f.sport && f.sport !== 'all') count++;
    count += f.tags.length;
    return count;
  });

  readonly hasActiveFilters = computed(() => this.activeFilterCount() > 0);

  readonly activeTags = computed(() =>
    this._tags().filter((t) => this._filters().tags.includes(t.id)),
  );

  // ── Search debounce stream ───────────────────────────────────────────────
  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => this._page.set(1)),
        switchMap(() => this.fetchArticles$()),
        takeUntilDestroyed(),
      )
      .subscribe();

    this.loadMeta();
    this.loadArticles();
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  setSearch(value: string): void {
    this._filters.update((f) => ({ ...f, search: value }));
    this.search$.next(value);
  }

  setSport(sportId: string): void {
    this._filters.update((f) => ({ ...f, sport: sportId }));
    this._page.set(1);
    this.loadArticles();
  }

  toggleTag(tagId: string): void {
    this._filters.update((f) => {
      const tags = f.tags.includes(tagId)
        ? f.tags.filter((t) => t !== tagId)
        : [...f.tags, tagId];
      return { ...f, tags };
    });
    this._page.set(1);
    this.loadArticles();
  }

  clearFilters(): void {
    this._filters.set({ search: '', sport: 'all', tags: [] });
    this._page.set(1);
    this.loadArticles();
  }

  setPage(page: number): void {
    this._page.set(page);
    this.loadArticles();
  }

  applyFilters(): void {
    this._page.set(1);
    this.loadArticles();
  }

  toggleLike(articleId: number): void {
    // Optimistic update
    this._articles.update((list) =>
      list.map((a) =>
        a.id === articleId
          ? { ...a, liked: !a.liked, stats: { ...a.stats, likes: a.stats.likes + (a.liked ? -1 : 1) } }
          : a,
      ),
    );
    this.api.toggleLike(articleId).subscribe();
  }

  toggleComments(articleId: number): void {
    this._articles.update((list) =>
      list.map((a) =>
        a.id === articleId ? { ...a, commentsOpen: !a.commentsOpen } : a,
      ),
    );
    this.api.toggleComments(articleId).subscribe();
  }

  deleteArticle(articleId: number): void {
    this._articles.update((list) => list.filter((a) => a.id !== articleId));
    this._total.update((t) => t - 1);
    this.api.deleteArticle(articleId).subscribe();
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private loadMeta(): void {
    this._loadingMeta.set(true);
    this.api.getSports().subscribe({
      next: (sports) => this._sports.set(sports),
      complete: () => this._loadingMeta.set(false),
    });
    this.api.getTags().subscribe({
      next: (tags) => this._tags.set(tags),
    });
  }

  private loadArticles(): void {
    this._loading.set(true);
    const f = this._filters();
    this.api
      .getArticles({
        page: this._page(),
        perPage: this._perPage(),
        search: f.search,
        sport: f.sport,
        tags: f.tags,
      })
      .subscribe({
        next: (res) => {
          this._articles.set(res.data as unknown as Article[]);
          this._total.set(res.meta.total);
          this._totalPages.set(res.meta.totalPages);
        },
        complete: () => this._loading.set(false),
      });
  }

  private fetchArticles$() {
    this._loading.set(true);
    const f = this._filters();
    return this.api
      .getArticles({
        page: this._page(),
        perPage: this._perPage(),
        search: f.search,
        sport: f.sport,
        tags: f.tags,
      })
      .pipe(
        tap({
          next: (res) => {
            this._articles.set(res.data as unknown as Article[]);
            this._total.set(res.meta.total);
            this._totalPages.set(res.meta.totalPages);
            this._loading.set(false);
          },
          error: () => this._loading.set(false),
        }),
      );
  }
}
