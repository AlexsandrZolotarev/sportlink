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
            <button class="card__popup-item" type="button" role="menuitem">
              <svg
                class="card__popup-icon"
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.92607 6.11688C4.61536 6.47937 4.44458 6.94104 4.44458 7.41847V14.4565C4.44458 15.5611 5.34001 16.4565 6.44458 16.4565H12.5534C13.5199 16.4565 14.3482 15.7653 14.5211 14.8143L15.5716 9.03639C15.7948 7.80871 14.8517 6.67862 13.6039 6.67862H9.778L11.225 2.33752C11.4148 1.76813 11.1571 1.14583 10.6202 0.877418C10.1252 0.629923 9.52534 0.75107 9.16518 1.17125L4.92607 6.11688Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M0.888903 15.5681V7.56796"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Понравилось
            </button>
            <button class="card__popup-item" type="button" role="menuitem">
              @if (article().commentsOpen) {
                <svg
                  class="card__popup-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.4068 14.4059C11.9619 16.8511 8.34158 17.3794 5.37889 16.0092C4.94152 15.8331 4.58294 15.6908 4.24205 15.6908C3.29255 15.6964 2.11069 16.6171 1.49644 16.0036C0.882199 15.3893 1.80357 14.2065 1.80357 13.2512C1.80357 12.9103 1.66689 12.5581 1.49082 12.1199C0.12002 9.1577 0.649043 5.53615 3.09396 3.09177C6.21503 -0.0304545 11.2858 -0.0304543 14.4068 3.09096C17.5335 6.21801 17.5279 11.2845 14.4068 14.4059Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 6L12 12M12 6L6 12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              } @else {
                <svg
                  class="card__popup-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.4068 14.4059C11.9619 16.8511 8.34158 17.3794 5.37889 16.0092C4.94152 15.8331 4.58294 15.6908 4.24205 15.6908C3.29255 15.6964 2.11069 16.6171 1.49644 16.0036C0.882199 15.3893 1.80357 14.2065 1.80357 13.2512C1.80357 12.9103 1.66689 12.5581 1.49082 12.1199C0.12002 9.1577 0.649043 5.53615 3.09396 3.09177C6.21503 -0.0304545 11.2858 -0.0304543 14.4068 3.09096C17.5335 6.21801 17.5279 11.2845 14.4068 14.4059Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
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
            >
              <svg
                class="card__popup-icon"
                width="15"
                height="18"
                viewBox="0 0 15 18"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M13.75 6.35L12.9416 15.4268C12.8754 15.7975 12.6787 16.1334 12.386 16.3754C12.0932 16.6174 11.7232 16.75 11.3409 16.75H3.15906C2.77682 16.75 2.40679 16.6174 2.11404 16.3754C1.8213 16.1334 1.62457 15.7975 1.55844 15.4268L0.75 6.35M13.75 3.95H9.99219M9.99219 3.95V2.35C9.99219 1.92565 9.82098 1.51869 9.51624 1.21863C9.21149 0.918571 8.79816 0.75 8.36719 0.75H6.13281C5.70184 0.75 5.28851 0.918571 4.98376 1.21863C4.67902 1.51869 4.50781 1.92565 4.50781 2.35V3.95M9.99219 3.95H7.25H4.50781M0.75 3.95H4.50781"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
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

      .card__popup-icon {
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
        display: block;
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
        cursor: pointer;
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
