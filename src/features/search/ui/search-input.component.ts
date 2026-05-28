import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "sc-search-input",
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search">
      <div class="search__field">
        <svg
          class="search__icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="7"
            cy="7"
            r="5"
            stroke="currentColor"
            stroke-width="1.4"
          />
          <path
            d="M11 11L14 14"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>

        <input
          class="search__input"
          type="text"
          [placeholder]="placeholder()"
          [(ngModel)]="value"
          (ngModelChange)="onModelChange($event)"
          (keyup.enter)="submitted.emit(value())"
        />

        @if (value()) {
          <button
            class="search__clear"
            type="button"
            aria-label="Очистить поиск"
            (click)="clear()"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        }
      </div>

      <button
        class="search__btn"
        type="button"
        (click)="submitted.emit(value())"
      >
        Найти
      </button>
    </div>
  `,
  styles: [
    `
      .search {
        display: flex;
        gap: 8px;
        position: relative;
      }

      .search__field {
        flex: 1;
        position: relative;
        display: flex;
        align-items: center;
      }

      .search__icon {
        position: absolute;
        left: 10px;
        color: var(--color-text-muted);
        pointer-events: none;
        flex-shrink: 0;
      }

      .search__input {
        width: 100%;
        height: 50px;
        padding: 20px 32px 20px 34px;
        border: 0;
        border-radius: 25px;
        font-size: var(--font-size-base);
        font-family: var(--font-family);
        color: var(--color-text-primary);
        background: #eaeaea;

        &::placeholder {
          color: var(--color-text-muted);
        }
      }
      rgba(46, 48, 58, 0.1) .search__clear {
        position: absolute;
        right: 8px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        background: var(--color-border-light);

        &:hover {
          background: var(--color-border);
          color: var(--color-text-primary);
        }
      }

      .search__btn {
        position: absolute;
        right: 0;
        height: 50px;
        padding: 0 26px;
        background: #d8ffd8;
        color: #26b626;
        border: none;
        border-radius: 25px;
        font-size: var(--font-size-base);
        font-weight: 600;
        font-family: var(--font-family);
        cursor: pointer;
        transition: background var(--transition-fast);
        white-space: nowrap;

        &:hover {
          color: black;
        }
      }
    `,
  ],
})
export class SearchInputComponent {
  placeholder = input("Поиск публикации");
  value = model("");

  submitted = output<string>();

  onModelChange(val: string): void {
    this.value.set(val);
  }

  clear(): void {
    this.value.set("");
    this.submitted.emit("");
  }
}
