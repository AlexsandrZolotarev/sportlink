import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { NgClass } from "@angular/common";
import { Article } from "../model/article.model";
import { formatDateRu } from "../../../shared/lib/date.utils";
import { formatCount } from "../../../shared/lib/number.utils";
import { IconComponent } from "../../../shared/ui/icon/icon.component";

@Component({
  selector: "sc-article-card",
  standalone: true,
  imports: [NgClass, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="card">
      <!-- Header -->
      <div class="card__header">
        <div class="card__author">
          <div class="card__avatar" aria-hidden="true">
            <sc-icon name="avatar" style="font-size:54px;color:#fff" />
          </div>
          <div class="card__author-info">
            <span class="card__author-name">{{ article().author.name }}</span>
            <time class="card__date" [dateTime]="article().publishedAt">
              {{ formatDate(article().publishedAt) }}
            </time>
          </div>
        </div>

        <button
          class="card__menu-btn"
          type="button"
          aria-label="Действия с публикацией"
          (click)="toggleMenu($event)"
        >
          <sc-icon name="dots" style="font-size:18px" />
        </button>

        @if (menuOpen()) {
          <div class="card__popup" role="menu">
            <button
              class="card__popup-item"
              type="button"
              role="menuitem"
              (click)="handleLike()"
            >
              <sc-icon name="like" style="font-size:16px" />
              Понравилось
            </button>
            <button
              class="card__popup-item"
              type="button"
              role="menuitem"
              (click)="handleToggleComments()"
            >
              <sc-icon name="comment" style="font-size:16px" />
              {{
                article().commentsOpen
                  ? "Закрыть комментарии"
                  : "Открыть комментарии"
              }}
            </button>
            <button
              class="card__popup-item card__popup-item--danger"
              type="button"
              role="menuitem"
              (click)="handleDelete()"
            >
              <sc-icon name="trash" style="font-size:16px" />
              Удалить
            </button>
          </div>
        }
      </div>

      <!-- Gallery -->
      <div class="card__gallery">
        <img
          class="card__image"
          [src]="currentImage()"
          [alt]="article().title"
          loading="lazy"
          (error)="onImgError($event)"
        />

        <span class="badge badge--sport">{{ article().sportName }}</span>

        @if (article().tags.includes("training")) {
          <span class="badge badge--tag">Тренировка</span>
        }

        @if (article().images.length > 1) {
          <span class="badge badge--counter">
            {{ imgIdx() + 1 }} из {{ article().images.length }}
          </span>
          <button
            class="gallery__nav gallery__nav--prev"
            aria-label="Предыдущее"
            (click)="prevImg($event)"
          >
            ‹
          </button>
          <button
            class="gallery__nav gallery__nav--next"
            aria-label="Следующее"
            (click)="nextImg($event)"
          >
            ›
          </button>
        }
      </div>

      <!-- Body -->
      <div class="card__body">
        <h3 class="card__title">{{ article().title }}</h3>
        <p class="card__desc line-clamp-3">
          {{ article().description }}
          <a class="card__more" href="#" (click)="$event.preventDefault()"
            >дальше</a
          >
        </p>
      </div>

      <!-- Footer stats -->
      <div class="card__footer">
        <button
          class="card__stat"
          [ngClass]="{ 'card__stat--active': article().liked }"
          type="button"
          (click)="handleLike()"
          [attr.aria-pressed]="article().liked"
        >
          <sc-icon name="heart" style="font-size:15px" />
          <span>Понравилось {{ formatCount(article().stats.likes) }}</span>
        </button>

        <button class="card__stat" type="button">
          <sc-icon name="comment" style="font-size:15px" />
          <span>{{ formatCount(article().stats.comments) }}</span>
        </button>

        <button class="card__stat" type="button">
          <sc-icon name="eye" style="font-size:15px" />
          <span>{{ formatCount(article().stats.views) }}</span>
        </button>

        <button
          class="card__stat card__stat--share"
          type="button"
          aria-label="Поделиться"
        >
          <sc-icon name="share" style="font-size:15px" />
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Card shell */
      .card {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        overflow: visible;
        position: relative;
        transition:
          box-shadow var(--transition-base),
          transform var(--transition-base);
      }

      .card:hover {
        box-shadow: var(--shadow-md);
      }

      /* Header */
      .card__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 8px;
        position: relative;
      }

      .card__author {
        display: flex;
        gap: 10px;
      }

      .card__avatar {
        width: 54px;
        height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .card__author-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        justify-content: flex-start;
      }

      .card__author-name {
        font-size: var(--font-size-base);
        font-weight: 600;
        line-height: 1.3;
      }

      .card__date {
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
      }

      .card__menu-btn {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        transition: all var(--transition-fast);
        cursor: pointer;
        border: none;
        background: transparent;
        flex-shrink: 0;
      }

      .card__menu-btn:hover {
        background: var(--color-border-light);
        color: var(--color-text-primary);
      }

      /* Popup menu */
      .card__popup {
        position: absolute;
        top: calc(100% - 4px);
        right: 14px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 300;
        min-width: 210px;
        overflow: hidden;
        animation: popIn 0.15s ease;
      }

      @keyframes popIn {
        from {
          opacity: 0;
          transform: translateY(-6px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .card__popup-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        font-size: var(--font-size-base);
        font-family: var(--font-family);
        color: var(--color-text-primary);
        cursor: pointer;
        transition: background var(--transition-fast);
        background: transparent;
        border: none;
        text-align: left;
      }

      .card__popup-item:hover {
        background: var(--color-border-light);
      }
      .card__popup-item--danger {
        color: var(--color-primary);
      }

      /* Gallery */
      .card__gallery {
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background: var(--color-border-light);
      }

      .card__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }

      .card__gallery:hover .card__image {
        transform: scale(1.04);
      }

      .badge {
        position: absolute;
        bottom: 10px;
        padding: 3px 10px;
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        font-weight: 600;
        color: #fff;
        backdrop-filter: blur(6px);
        user-select: none;
      }

      .badge--sport {
        left: 10px;
        background: rgba(58, 94, 236, 0.82);
      }
      .badge--tag {
        left: 90px;
        background: rgba(155, 89, 182, 0.82);
      }
      .badge--counter {
        right: 10px;
        background: rgba(0, 0, 0, 0.48);
      }

      .gallery__nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.45);
        color: #fff;
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(4px);
        transition: background var(--transition-fast);
      }

      .gallery__nav:hover {
        background: rgba(0, 0, 0, 0.68);
      }
      .gallery__nav--prev {
        left: 8px;
      }
      .gallery__nav--next {
        right: 8px;
      }

      /* Body */
      .card__body {
        padding: 12px 14px 8px;
      }

      .card__title {
        font-size: var(--font-size-base);
        font-weight: 600;
        line-height: 1.45;
        margin-bottom: 6px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .card__title:hover {
        color: var(--color-accent);
      }
      .card__desc {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        line-height: 1.55;
      }

      .card__more {
        color: var(--color-text-link);
        font-weight: 500;
        margin-left: 3px;
      }

      .card__more:hover {
        text-decoration: underline;
      }

      /* Footer */
      .card__footer {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 8px 10px 12px;
        border-top: 1px solid var(--color-border-light);
      }

      .card__stat {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 8px;
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        font-family: var(--font-family);
        color: var(--color-text-secondary);
        border: none;
        background: transparent;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }

      .card__stat:hover {
        background: var(--color-border-light);
        color: var(--color-accent);
      }
      .card__stat--active {
        color: var(--color-accent);
      }
      .card__stat--share {
        margin-left: auto;
      }
    `,
  ],
})
export class ArticleCardComponent {
  private readonly elRef = inject(ElementRef);

  article = input.required<Article>();

  liked = output<number>();
  deleted = output<number>();
  commentsToggled = output<number>();

  menuOpen = signal(false);
  imgIdx = signal(0);

  readonly formatDate = formatDateRu;
  readonly formatCount = formatCount;

  get currentImage(): () => string {
    return () => this.article().images[this.imgIdx()] ?? "";
  }

  @HostListener("document:click", ["$event"])
  onDocClick(e: Event): void {
    if (this.menuOpen() && !this.elRef.nativeElement.contains(e.target)) {
      this.menuOpen.set(false);
    }
  }

  toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.menuOpen.update((v) => !v);
  }

  handleLike(): void {
    this.liked.emit(this.article().id);
    this.menuOpen.set(false);
  }

  handleDelete(): void {
    this.deleted.emit(this.article().id);
    this.menuOpen.set(false);
  }

  handleToggleComments(): void {
    this.commentsToggled.emit(this.article().id);
    this.menuOpen.set(false);
  }

  prevImg(e: MouseEvent): void {
    e.stopPropagation();
    const len = this.article().images.length;
    this.imgIdx.update((i) => (i - 1 + len) % len);
  }

  nextImg(e: MouseEvent): void {
    e.stopPropagation();
    const len = this.article().images.length;
    this.imgIdx.update((i) => (i + 1) % len);
  }

  onImgError(e: Event): void {
    const img = e.target as HTMLImageElement;
    img.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='375'%3E%3Crect fill='%23e8e8e8' width='600' height='375'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23aaa' text-anchor='middle' dominant-baseline='middle'%3EИзображение%3C/text%3E%3C/svg%3E";
  }
}
