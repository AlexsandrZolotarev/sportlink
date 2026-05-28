import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { Article } from "../../../entities/article";
import { ArticleCardComponent } from "../../../entities/article";
import { SkeletonComponent } from "../../../shared/ui/skeleton/skeleton.component";

@Component({
  selector: "sc-article-grid",
  standalone: true,
  imports: [ArticleCardComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="grid-section" aria-label="Лента публикаций">
      <!-- Loading skeleton -->
      @if (loading()) {
        <div class="grid">
          <div class="skeleton-card">
            <div class="skeleton-card__header">
              <div class="sk-circle"></div>
              <div class="sk-lines">
                <sc-skeleton height="12px" radius="4px" />
                <sc-skeleton height="10px" radius="4px" />
              </div>
            </div>
            <sc-skeleton height="200px" radius="0" />
            <div class="sk-body">
              <sc-skeleton height="14px" radius="4px" />
              <sc-skeleton height="12px" radius="4px" />
              <sc-skeleton height="12px" radius="4px" style="width:75%" />
            </div>
          </div>
        </div>
      } @else if (articles().length === 0) {
        <!-- Empty state -->
        <div class="empty">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#e0e0e0" stroke-width="2" />
            <path
              d="M22 32h20M32 22v20"
              stroke="#ccc"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <h3 class="empty__title">Публикации не найдены</h3>
          <p class="empty__text">
            Попробуйте изменить фильтры или поисковый запрос
          </p>
        </div>
      } @else {
        <!-- Single article -->
        <div class="grid">
          <sc-article-card
            [article]="articles()[0]"
            (liked)="liked.emit($event)"
            (deleted)="deleted.emit($event)"
            (commentsToggled)="commentsToggled.emit($event)"
          />
        </div>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        flex: 1;
        min-width: 0;
      }

      /* ── Grid ─────────────────────────────────────────────────────────────── */
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      /* ── Skeleton card ──────────────────────────────────────────────────── */
      .skeleton-card {
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
      }

      .skeleton-card__header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
      }

      .sk-circle {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e8e8e8 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s ease infinite;
        flex-shrink: 0;
      }

      .sk-lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .sk-body {
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* ── Empty state ──────────────────────────────────────────────────────── */
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 24px;
        text-align: center;
        gap: 12px;
      }

      .empty__title {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .empty__text {
        font-size: var(--font-size-base);
        color: var(--color-text-muted);
        max-width: 300px;
      }
    `,
  ],
})
export class ArticleGridComponent {
  articles = input.required<Article[]>();
  loading = input(false);

  liked = output<number>();
  deleted = output<number>();
  commentsToggled = output<number>();
}
