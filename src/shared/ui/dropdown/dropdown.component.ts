import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface DropdownOption {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'sc-dropdown',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dropdown" [ngClass]="{ open: isOpen() }">
      <button
        type="button"
        class="dropdown__trigger"
        (click)="toggle()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="true"
      >
        <span class="dropdown__label">{{ selectedLabel() }}</span>
        <svg
          class="dropdown__arrow"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 5L7 9L11 5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      @if (isOpen()) {
        <div class="dropdown__menu" role="listbox">
          @for (option of options(); track option.id) {
            <button
              type="button"
              class="dropdown__item"
              role="option"
              [ngClass]="{ selected: isSelected(option.id) }"
              [attr.aria-selected]="isSelected(option.id)"
              (click)="select(option)"
            >
              <span>
                {{ option.label }}
                @if (option.count !== undefined) {
                  <span class="dropdown__count"> ({{ option.count }})</span>
                }
              </span>
              @if (isSelected(option.id)) {
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 7L5.5 10.5L12 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
            </button>
          }

          @if (multiSelect()) {
            <div class="dropdown__footer">
              <button
                type="button"
                class="dropdown__save"
                (click)="save()"
              >
                Сохранить
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .dropdown {
      position: relative;
    }

    .dropdown__trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text-primary);
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-accent);
      }
    }

    .dropdown__label {
      font-weight: 500;
    }

    .dropdown__arrow {
      transition: transform var(--transition-fast);
      color: var(--color-text-secondary);
      flex-shrink: 0;

      .open & {
        transform: rotate(180deg);
      }
    }

    .dropdown__menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      z-index: 100;
      overflow: hidden;
      animation: fadeDown 0.15s ease;
    }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .dropdown__item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      color: var(--color-text-primary);
      cursor: pointer;
      transition: background var(--transition-fast);
      text-align: left;
      background: transparent;
      border: none;

      &:hover {
        background: var(--color-border-light);
      }

      &.selected {
        color: var(--color-accent);
        font-weight: 500;
      }
    }

    .dropdown__count {
      color: var(--color-text-muted);
      font-weight: 400;
    }

    .dropdown__footer {
      padding: 8px 12px;
      border-top: 1px solid var(--color-border-light);
    }

    .dropdown__save {
      width: 100%;
      padding: 6px;
      background: var(--color-accent);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 600;
      font-family: var(--font-family);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--color-accent-hover);
      }
    }
  `],
})
export class DropdownComponent {
  private readonly elRef = inject(ElementRef);

  options = input.required<DropdownOption[]>();
  selected = model<string>('');
  multiSelect = input(false);
  placeholder = input('Выберите...');

  saved = output<string>();

  isOpen = signal(false);

  get selectedLabel(): () => string {
    return () => {
      const opt = this.options().find((o) => o.id === this.selected());
      return opt
        ? `${opt.label}${opt.count !== undefined ? ` (${opt.count})` : ''}`
        : this.placeholder();
    };
  }

  isSelected(id: string): boolean {
    return this.selected() === id;
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  select(option: DropdownOption): void {
    this.selected.set(option.id);
    if (!this.multiSelect()) {
      this.isOpen.set(false);
      this.saved.emit(option.id);
    }
  }

  save(): void {
    this.isOpen.set(false);
    this.saved.emit(this.selected());
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
