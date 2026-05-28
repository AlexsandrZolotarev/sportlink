import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MediaStore } from '../model/media.store';
import { SidebarFiltersComponent } from '../../../widgets/sidebar-filters';
import { ArticleGridComponent } from '../../../widgets/article-grid';

@Component({
  selector: 'sc-media-page',
  standalone: true,
  providers: [MediaStore],
  imports: [SidebarFiltersComponent, ArticleGridComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">

      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Хлебные крошки">
        <a class="breadcrumb__item" href="/">Главная</a>
        <span class="breadcrumb__sep" aria-hidden="true">›</span>
        <span class="breadcrumb__item breadcrumb__item--active">Журнал</span>
      </nav>

      <h1 class="page__title">Медиа</h1>

      <!-- Mobile filter button -->
      <button
        class="mobile-filter-btn"
        type="button"
        (click)="mobileSidebarOpen.set(true)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Фильтры
        @if (store.activeFilterCount() > 0) {
          <span class="mobile-filter-badge">{{ store.activeFilterCount() }}</span>
        }
      </button>

      <!-- Layout -->
      <div class="layout">

        <sc-sidebar-filters
          [filters]="store.filters()"
          [sports]="store.sports()"
          [tags]="store.tags()"
          [total]="store.total()"
          [activeTags]="store.activeTags()"
          [filterCount]="store.activeFilterCount()"
          [mobileOpen]="mobileSidebarOpen()"
          (searchSubmitted)="store.setSearch($event)"
          (sportChanged)="store.setSport($event)"
          (tagToggled)="store.toggleTag($event)"
          (cleared)="store.clearFilters()"
          (applied)="store.applyFilters()"
          (closed)="mobileSidebarOpen.set(false)"
        />

        <sc-article-grid
          [articles]="store.articles()"
          [loading]="store.loading()"
          (liked)="store.toggleLike($event)"
          (deleted)="store.deleteArticle($event)"
          (commentsToggled)="store.toggleComments($event)"
        />

      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 20px 24px 48px;
    }

    /* ── Breadcrumb ──────────────────────────────────────────────────────── */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }

    .breadcrumb__item {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      text-decoration: none;

      &[href]:hover { color: var(--color-accent); }
    }

    .breadcrumb__item--active { color: var(--color-text-secondary); }

    .breadcrumb__sep { color: var(--color-text-muted); font-size: var(--font-size-sm); }

    /* ── Title ───────────────────────────────────────────────────────────── */
    .page__title {
      font-size: var(--font-size-3xl);
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 20px;
    }

    /* ── Mobile filter btn ──────────────────────────────────────────────── */
    .mobile-filter-btn {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      color: var(--color-text-primary);
      cursor: pointer;
      margin-bottom: 16px;
      transition: all var(--transition-fast);

      &:hover { border-color: var(--color-accent); color: var(--color-accent); }
    }

    .mobile-filter-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: var(--color-accent);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      border-radius: 50%;
    }

    /* ── Layout ──────────────────────────────────────────────────────────── */
    .layout {
      display: flex;
      align-items: flex-start;
      gap: 28px;
    }

    /* ── Responsive ─────────────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .page { padding: 16px 16px 40px; }
      .mobile-filter-btn { display: flex; }
      .layout { display: block; }
    }
  `],
})
export class MediaPageComponent {
  readonly store = inject(MediaStore);
  readonly mobileSidebarOpen = signal(false);

}
