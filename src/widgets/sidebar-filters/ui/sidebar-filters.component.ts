import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { NgClass } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SportType, Tag, ActiveFilters } from "../../../entities/article";
import { SearchInputComponent } from "../../../features/search";

interface DropdownOption {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: "sc-sidebar-filters",
  standalone: true,
  imports: [NgClass, FormsModule, SearchInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" [ngClass]="{ 'sidebar--mobile-open': mobileOpen() }">
      <!-- Mobile close -->
      <div class="sidebar__mobile-header">
        <span class="sidebar__mobile-title">Фильтры</span>
        <button
          type="button"
          class="sidebar__mobile-close"
          aria-label="Закрыть"
          (click)="closed.emit()"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 2L14 14M14 2L2 14"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Search -->
      <div class="sidebar__section">
        <sc-search-input
          [value]="filters().search"
          (submitted)="searchSubmitted.emit($event)"
        />
      </div>

      <!-- Active filter tags -->
      @if (hasFilters()) {
        <div class="sidebar__section sidebar__section--filters">
          <div class="sidebar__filter-row">
            <span class="sidebar__filter-label">
              Выбранные фильтры
              <span class="sidebar__filter-count">{{ selectedFilterCount() }}</span>
            </span>
            <button
              type="button"
              class="sidebar__clear"
              (click)="clearLocalFilters()"
            >
              Очистить
            </button>
          </div>

          <div class="sidebar__chips">
            @for (tag of selectedTags(); track tag.id) {
              <span class="sidebar__chip">
                {{ tag.name }}
                <button
                  type="button"
                  class="sidebar__chip-remove"
                  [attr.aria-label]="'Удалить фильтр ' + tag.name"
                  (click)="toggleLocalTag(tag.id)"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 1L9 9M9 1L1 9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </span>
            }

            @if (selectedSportId() !== "all") {
              <span class="sidebar__chip">
                {{ activeSportName() }}
                <button
                  type="button"
                  class="sidebar__chip-remove"
                  aria-label="Убрать фильтр по виду спорта"
                  (click)="selectedSportId.set('all')"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 1L9 9M9 1L1 9"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </span>
            }
          </div>
        </div>
      }

      <!-- Sport type dropdown -->
      <div class="sidebar__section">
        <p class="sidebar__section-title">Вид спорта</p>

        <div class="sidebar__dropdown" [ngClass]="{ open: sportOpen() }">
          <button
            type="button"
            class="sidebar__dropdown-trigger"
            (click)="toggleSportOpen()"
            [attr.aria-expanded]="sportOpen()"
          >
            <span>{{ selectedSportLabel() }}</span>
            <svg
              class="sidebar__dropdown-arrow"
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

          @if (sportOpen()) {
            <div class="sidebar__dropdown-menu">
              @for (sport of sportOptions(); track sport.id) {
                <button
                  type="button"
                  class="sidebar__dropdown-item"
                  [ngClass]="{ selected: selectedSportId() === sport.id }"
                  (click)="selectSport(sport.id)"
                >
                  <span
                    >{{ sport.label }}
                    <span class="muted">({{ sport.count }})</span></span
                  >
                  @if (selectedSportId() === sport.id) {
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
              <div class="sidebar__dropdown-footer">
                <button
                  type="button"
                  class="sidebar__save-btn"
                  (click)="saveSport()"
                >
                  Сохранить
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Tags dropdown -->
      <div class="sidebar__section">
        <p class="sidebar__section-title">Теги</p>

        <div class="sidebar__dropdown" [ngClass]="{ open: tagsOpen() }">
          <button
            type="button"
            class="sidebar__dropdown-trigger"
            (click)="toggleTagsOpen()"
            [attr.aria-expanded]="tagsOpen()"
          >
            <span>{{ selectedTagsLabel() }}</span>
            <svg
              class="sidebar__dropdown-arrow"
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

          @if (tagsOpen()) {
            <div class="sidebar__dropdown-menu">
              @for (tag of tags(); track tag.id) {
                <button
                  type="button"
                  class="sidebar__dropdown-item"
                  [ngClass]="{ selected: selectedTagIds().includes(tag.id) }"
                  (click)="toggleLocalTag(tag.id)"
                >
                  <span
                    >{{ tag.name }}
                    <span class="muted">({{ tag.count }})</span></span
                  >
                  @if (selectedTagIds().includes(tag.id)) {
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
              <div class="sidebar__dropdown-footer">
                <button
                  type="button"
                  class="sidebar__save-btn"
                  (click)="tagsOpen.set(false)"
                >
                  Сохранить
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Apply button -->
      <div class="sidebar__section">
        <button
          type="button"
          class="sidebar__apply-btn"
          (click)="closed.emit()"
        >
          Показать {{ total() }} публикаций
        </button>
      </div>
    </aside>

    <!-- Mobile backdrop -->
    @if (mobileOpen()) {
      <div class="sidebar__backdrop" (click)="closed.emit()"></div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      /* ── Sidebar ──────────────────────────────────────────────────────────── */
      .sidebar {
        width: var(--sidebar-width);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .sidebar__mobile-header {
        display: none;
      }

      /* ── Section ──────────────────────────────────────────────────────────── */
      .sidebar__section {
        padding: 14px 0;
        border-bottom: 1px solid var(--color-border-light);
      }

      .sidebar__section:last-child {
        border-bottom: none;
      }

      .sidebar__section--filters {
        padding-top: 10px;
      }

      .sidebar__section-title {
        font-size: var(--font-size-base);
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 10px;
      }

      /* ── Active filters ─────────────────────────────────────────────────────── */
      .sidebar__filter-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .sidebar__filter-label {
        font-size: var(--font-size-sm);
        font-weight: 500;
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .sidebar__filter-count {
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

      .sidebar__clear {
        font-size: var(--font-size-sm);
        color: var(--color-text-muted);
        background: none;
        border: none;
        cursor: pointer;
        font-family: var(--font-family);
        padding: 2px 4px;
        border-radius: var(--radius-sm);
        transition: color var(--transition-fast);

        &:hover {
          color: var(--color-primary);
        }
      }

      .sidebar__chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .sidebar__chip {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 10px 15px;
        background: #eaeaea;

        border-radius: var(--radius-full);
        font-size: var(--font-size-sm);
        font-weight: 500;
      }

      .sidebar__chip-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: none;

        cursor: pointer;

        padding: 0;
        transition: background var(--transition-fast);
      }

      /* ── Dropdown ─────────────────────────────────────────────────────────── */
      .sidebar__dropdown {
        position: relative;
      }

      .sidebar__dropdown-trigger {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        font-size: var(--font-size-base);
        font-weight: 500;
        font-family: var(--font-family);
        color: var(--color-text-primary);
        cursor: pointer;
        transition: border-color var(--transition-fast);

        &:hover,
        .open & {
          border-color: var(--color-accent);
        }
      }

      .sidebar__dropdown-arrow {
        color: var(--color-text-secondary);
        transition: transform var(--transition-fast);
        flex-shrink: 0;

        .open & {
          transform: rotate(180deg);
        }
      }

      .sidebar__dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        z-index: 200;
        overflow: hidden;
        animation: slideDown 0.15s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .sidebar__dropdown-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        font-size: var(--font-size-base);
        font-family: var(--font-family);
        color: var(--color-text-primary);
        background: transparent;
        border: none;
        text-align: left;
        cursor: pointer;
        transition: background var(--transition-fast);

        &:hover {
          background: var(--color-border-light);
        }

        &.selected {
          color: var(--color-accent);
          font-weight: 600;
        }
      }

      .muted {
        color: var(--color-text-muted);
        font-weight: 400;
      }

      .sidebar__dropdown-footer {
        padding: 8px 10px;
        border-top: 1px solid var(--color-border-light);
      }

      .sidebar__save-btn {
        width: 100%;
        padding: 7px;
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

      /* ── Apply button ─────────────────────────────────────────────────────── */
      .sidebar__apply-btn {
        width: 100%;
        padding: 11px;
        background: var(--color-accent);
        color: #fff;
        border: none;
        border-radius: var(--radius-lg);
        font-size: var(--font-size-base);
        font-weight: 600;
        font-family: var(--font-family);
        cursor: pointer;
        transition: background var(--transition-fast);

        &:hover {
          background: var(--color-accent-hover);
        }
      }

      /* ── Mobile ─────────────────────────────────────────────────────────────── */
      @media (max-width: 768px) {
        .sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: min(320px, 90vw);
          background: var(--color-surface);
          z-index: 600;
          padding: 0 20px 20px;
          overflow-y: auto;
          transform: translateX(-100%);
          transition: transform var(--transition-base);
          box-shadow: var(--shadow-lg);
        }

        .sidebar--mobile-open {
          transform: translateX(0);
        }

        .sidebar__mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0 12px;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 4px;
        }

        .sidebar__mobile-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
        }

        .sidebar__mobile-close {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          border: none;
          background: var(--color-border-light);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);

          &:hover {
            background: var(--color-border);
          }
        }

        .sidebar__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 599;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      }
    `,
  ],
})
export class SidebarFiltersComponent {
  filters = input.required<ActiveFilters>();
  sports = input<SportType[]>([]);
  tags = input<Tag[]>([]);
  total = input(0);
  activeTags = input<Tag[]>([]);
  filterCount = input(0);
  mobileOpen = input(false);

  searchSubmitted = output<string>();
  sportChanged = output<string>();
  tagToggled = output<string>();
  cleared = output<void>();
  applied = output<void>();
  closed = output<void>();

  sportOpen = signal(false);
  tagsOpen = signal(false);
  selectedSportId = signal("all");
  selectedTagIds = signal<string[]>([]);

  readonly sportOptions = computed<DropdownOption[]>(() =>
    this.sports().map((s) => ({ id: s.id, label: s.name, count: s.count })),
  );

  readonly selectedTags = computed(() =>
    this.tags().filter((t) => this.selectedTagIds().includes(t.id)),
  );

  readonly selectedFilterCount = computed(() => {
    const sportCount = this.selectedSportId() === "all" ? 0 : 1;
    return sportCount + this.selectedTagIds().length;
  });

  readonly hasFilters = computed(() => this.selectedFilterCount() > 0);

  readonly selectedSportLabel = computed(() => {
    const sport = this.sports().find((s) => s.id === this.selectedSportId());
    return sport ? `${sport.name} (${sport.count})` : "Все";
  });

  readonly selectedTagsLabel = computed(() => {
    const selected = this.selectedTagIds();
    if (!selected.length) return "Выберите теги";
    const names = this.tags()
      .filter((t) => selected.includes(t.id))
      .map((t) => t.name);
    return names.join(", ");
  });

  readonly activeSportName = computed(() => {
    const sport = this.sports().find((s) => s.id === this.selectedSportId());
    return sport?.name ?? "";
  });

  toggleSportOpen(): void {
    this.sportOpen.update((v) => !v);
  }

  toggleTagsOpen(): void {
    this.tagsOpen.update((v) => !v);
  }

  selectSport(id: string): void {
    this.selectedSportId.set(id);
  }

  saveSport(): void {
    this.sportOpen.set(false);
  }

  toggleLocalTag(id: string): void {
    this.selectedTagIds.update((ids) =>
      ids.includes(id) ? ids.filter((tagId) => tagId !== id) : [...ids, id],
    );
  }

  clearLocalFilters(): void {
    this.selectedSportId.set("all");
    this.selectedTagIds.set([]);
  }
}
