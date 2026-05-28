import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sc-pagination',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (totalPages() > 1) {
      <nav class="pagination" aria-label="Навигация по страницам">
        <button
          class="pagination__btn pagination__nav"
          [disabled]="currentPage() === 1"
          (click)="goTo(1)"
          aria-label="Первая страница"
        >
          «
        </button>

        <button
          class="pagination__btn pagination__nav"
          [disabled]="currentPage() === 1"
          (click)="goTo(currentPage() - 1)"
          aria-label="Предыдущая страница"
        >
          ‹
        </button>

        @for (page of visiblePages(); track page) {
          @if (page === -1) {
            <span class="pagination__dots">…</span>
          } @else {
            <button
              class="pagination__btn"
              [ngClass]="{ active: page === currentPage() }"
              (click)="goTo(page)"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
            >
              {{ page }}
            </button>
          }
        }

        <button
          class="pagination__btn pagination__nav"
          [disabled]="currentPage() === totalPages()"
          (click)="goTo(currentPage() + 1)"
          aria-label="Следующая страница"
        >
          ›
        </button>

        <button
          class="pagination__btn pagination__nav"
          [disabled]="currentPage() === totalPages()"
          (click)="goTo(totalPages())"
          aria-label="Последняя страница"
        >
          »
        </button>
      </nav>
    }
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .pagination__btn {
      min-width: 34px;
      height: 34px;
      padding: 0 8px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        border-color: var(--color-accent);
        color: var(--color-accent);
      }

      &.active {
        background: var(--color-accent);
        border-color: var(--color-accent);
        color: #fff;
        font-weight: 600;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .pagination__nav {
      font-size: var(--font-size-lg);
    }

    .pagination__dots {
      color: var(--color-text-muted);
      padding: 0 4px;
    }
  `],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  pageChanged = output<number>();

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 1;
    const pages: number[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    pages.push(1);
    if (left > 2) pages.push(-1);
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push(-1);
    if (total > 1) pages.push(total);

    return pages;
  });

  goTo(page: number): void {
    const p = Math.max(1, Math.min(page, this.totalPages()));
    if (p !== this.currentPage()) {
      this.pageChanged.emit(p);
    }
  }
}
