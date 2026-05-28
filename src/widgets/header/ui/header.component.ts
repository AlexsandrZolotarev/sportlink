import { ChangeDetectionStrategy, Component, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IconComponent } from "../../../shared/ui/icon/icon.component";

@Component({
  selector: "sc-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="header__inner">
        <!-- Logo -->
        <a
          class="header__logo"
          routerLink="/"
          aria-label="SportClick — на главную"
        >
          <img
            src="assets/icons/logo.svg"
            class="header__logo-img"
            alt="SportClick"
          />
        </a>

        <!-- Primary nav -->
        <nav class="header__nav" aria-label="Основная навигация">
          <a
            class="header__nav-link"
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            Главная
          </a>
          <a
            class="header__nav-link"
            routerLink="/services"
            routerLinkActive="active"
          >
            Сервисы
          </a>
        </nav>

        <!-- CTA -->
        <button class="header__cta" type="button" (click)="addListing.emit()">
          Добавить объявление
          <sc-icon name="plus" style="font-size:14px" />
        </button>

        <!-- Icon bar -->
        <div
          class="header__icons"
          role="toolbar"
          aria-label="Панель пользователя"
        >
          <button class="header__icon-btn" type="button" aria-label="Входящие">
            <sc-icon name="inbox" style="font-size:22px" />
            <span class="header__icon-label">Входящие</span>
          </button>

          <button
            class="header__icon-btn header__icon-btn--active"
            type="button"
            aria-label="Журнал"
          >
            <sc-icon name="journal" style="font-size:22px" />
            <span class="header__icon-label">Журнал</span>
          </button>

          <button class="header__icon-btn" type="button" aria-label="Желаемое">
            <sc-icon name="wishlist" style="font-size:22px" />
            <span class="header__icon-label">Желаемое</span>
          </button>

          <button class="header__icon-btn" type="button" aria-label="Корзина">
            <sc-icon name="cart" style="font-size:22px" />
            <span class="header__icon-label">Корзина</span>
          </button>

          <button
            class="header__icon-btn"
            type="button"
            aria-label="Уведомления (4 новых)"
          >
            <div class="header__badge-wrap">
              <sc-icon name="bell" style="font-size:22px" />
              <span class="header__badge">4</span>
            </div>
            <span class="header__icon-label">Уведомления</span>
          </button>

          <button
            class="header__icon-btn"
            type="button"
            aria-label="Войти в аккаунт"
          >
            <sc-icon name="user" style="font-size:22px" />
            <span class="header__icon-label">Войти</span>
          </button>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="header__burger"
          type="button"
          aria-label="Меню"
          (click)="mobileMenuOpen.emit()"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 500;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
        padding-block: 30px;
      }

      .header__inner {
        max-width: var(--container-max);
        margin: 0 auto;
        padding: 0 24px;
        height: var(--header-height);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* Logo */
      .header__logo {
        display: flex;
        align-items: center;
        text-decoration: none;
        flex-shrink: 0;
        margin-right: 8px;
      }

      .header__logo-img {
        height: 36px;
        width: auto;
        display: block;
      }

      /* Nav */
      .header__nav {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 8px;
      }

      .header__nav-link {
        padding: 15px 30px;
        border-radius: 25px;
        font-size: var(--font-size-base);
        font-weight: 500;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: all var(--transition-fast);
        background: #eaeaea;
      }

      .header__nav-link:hover {
        background: var(--color-border-light);
        color: var(--color-text-primary);
      }

      .header__nav-link.active {
        background: #4c4c4c;
        color: #fff;
      }

      /* CTA */
      .header__cta {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 18px 30px;
        border: none;
        border-radius: var(--radius-full);
        background: transparent;
        background: rgba(255, 51, 51, 0.06);
        color: var(--color-primary);
        font-size: var(--font-size-base);
        font-weight: 600;
        font-family: var(--font-family);
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }

      .header__cta:hover {
        background: transparent;
      }

      /* Icon toolbar */
      .header__icons {
        display: flex;
        align-items: center;
        gap: 2px;
        margin-left: auto;
      }

      .header__icon-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 6px 10px;
        border: none;
        background: transparent;
        color: var(--color-text-secondary);
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        position: relative;
      }
      .header__icon-btn sc-icon {
        background: #e0e0e0;
        padding: 9px 17px;
        border-radius: 25px;
      }
      .header__icon-btn:hover {
        color: var(--color-text-primary);
      }

      .header__icon-btn--active {
        color: var(--color-accent);
      }

      .header__icon-label {
        font-size: 10px;
        font-family: var(--font-family);
        line-height: 1;
      }

      .header__badge-wrap {
        position: relative;
      }

      .header__badge {
        position: absolute;
        top: -4px;
        right: -6px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        background: var(--color-primary);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        font-family: var(--font-family);
        border-radius: var(--radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      /* Mobile burger */
      .header__burger {
        display: none;
        flex-direction: column;
        gap: 5px;
        padding: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        margin-left: auto;
      }

      .header__burger span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--color-text-primary);
        border-radius: 2px;
        transition: all var(--transition-fast);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .header__cta {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .header__inner {
          padding: 0 16px;
        }
        .header__nav {
          display: none;
        }
        .header__icons {
          display: none;
        }
        .header__burger {
          display: flex;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  addListing = output<void>();
  mobileMenuOpen = output<void>();
}
