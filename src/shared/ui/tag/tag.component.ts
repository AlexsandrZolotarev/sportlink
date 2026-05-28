import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sc-tag',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="tag" [ngClass]="[color(), removable() ? 'removable' : '']">
      {{ label() }}
      @if (removable()) {
        <button
          class="tag__remove"
          type="button"
          aria-label="Удалить фильтр"
          (click)="removed.emit()"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      }
    </span>
  `,
  styles: [`
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: 500;
      background: #eef2ff;
      color: var(--color-accent);
      border: 1px solid #c7d2fe;
      white-space: nowrap;

      &.sport {
        background: rgba(74, 144, 226, 0.15);
        color: var(--color-hockey);
        border-color: rgba(74, 144, 226, 0.3);
      }

      &.training {
        background: rgba(155, 89, 182, 0.15);
        color: var(--color-training);
        border-color: rgba(155, 89, 182, 0.3);
      }
    }

    .tag__remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      cursor: pointer;
      transition: background var(--transition-fast);
      background: transparent;
      border: none;
      color: inherit;
      padding: 0;
      margin-left: 2px;

      &:hover {
        background: rgba(58, 94, 236, 0.15);
      }
    }
  `],
})
export class TagComponent {
  label = input.required<string>();
  color = input<string>('');
  removable = input(false);
  removed = output<void>();
}
