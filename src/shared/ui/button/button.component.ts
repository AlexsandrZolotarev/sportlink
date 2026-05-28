import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'sc-button',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [ngClass]="classes"
      (click)="clicked.emit($event)"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: var(--font-family);
      font-weight: 500;
      border-radius: var(--radius-md);
      border: 1.5px solid transparent;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      position: relative;
      outline: none;

      &:focus-visible {
        box-shadow: 0 0 0 3px rgba(58, 94, 236, 0.25);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Sizes */
      &.sm {
        padding: 5px 12px;
        font-size: var(--font-size-sm);
        height: 30px;
      }

      &.md {
        padding: 8px 16px;
        font-size: var(--font-size-base);
        height: 38px;
      }

      &.lg {
        padding: 10px 20px;
        font-size: var(--font-size-md);
        height: 44px;
        border-radius: var(--radius-lg);
      }

      /* Variants */
      &.primary {
        background: var(--color-accent);
        color: #fff;

        &:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }
      }

      &.secondary {
        background: #fff;
        color: var(--color-text-primary);
        border-color: var(--color-border);

        &:hover:not(:disabled) {
          background: var(--color-surface-hover);
        }
      }

      &.ghost {
        background: transparent;
        color: var(--color-text-secondary);

        &:hover:not(:disabled) {
          background: var(--color-border-light);
          color: var(--color-text-primary);
        }
      }

      &.danger {
        background: transparent;
        color: var(--color-primary);

        &:hover:not(:disabled) {
          background: rgba(255, 51, 51, 0.06);
        }
      }

      &.full-width {
        width: 100%;
      }
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  loading = input(false);
  fullWidth = input(false);

  clicked = output<MouseEvent>();

  get classes(): Record<string, boolean> {
    return {
      [this.variant()]: true,
      [this.size()]: true,
      'full-width': this.fullWidth(),
    };
  }
}
