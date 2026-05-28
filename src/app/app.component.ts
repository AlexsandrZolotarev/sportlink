import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../widgets/header";
import { IconComponent } from "../shared/ui/icon/icon.component";

@Component({
  selector: "sc-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell">
      <sc-header
        (addListing)="onAddListing()"
        (mobileMenuOpen)="mobileNavOpen.set(true)"
      />

      <main class="app-shell__main" id="main-content">
        <router-outlet />
      </main>
    </div>

    @if (mobileNavOpen()) {
      <div
        class="mobile-nav-overlay"
        (click)="mobileNavOpen.set(false)"
        role="dialog"
        aria-modal="true"
        aria-label="Навигация"
      >
        <div class="mobile-nav" (click)="$event.stopPropagation()">
          <button
            class="mobile-nav__close"
            type="button"
            aria-label="Закрыть навигацию"
            (click)="mobileNavOpen.set(false)"
          >
            <sc-icon name="close" style="font-size:18px" />
          </button>
          <nav class="mobile-nav__links">
            <a class="mobile-nav__link" href="/" (click)="mobileNavOpen.set(false)">Главная</a>
            <a class="mobile-nav__link" href="/media" (click)="mobileNavOpen.set(false)">Журнал</a>
            <a class="mobile-nav__link" href="/services" (click)="mobileNavOpen.set(false)">Сервисы</a>
          </nav>
        </div>
      </div>
    }
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--color-bg);
    }

    .app-shell__main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Mobile nav overlay */
    .mobile-nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 700;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .mobile-nav {
      position: absolute;
      top: 0;
      right: 0;
      width: min(280px, 80vw);
      height: 100%;
      background: var(--color-surface);
      padding: 20px;
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-lg);
      animation: slideLeft 0.2s ease;
    }

    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }

    .mobile-nav__close {
      align-self: flex-end;
      width: 36px;
      height: 36px;
      border: none;
      background: var(--color-border-light);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-text-secondary);
      margin-bottom: 24px;
      transition: all var(--transition-fast);
    }

    .mobile-nav__close:hover {
      background: var(--color-border);
    }

    .mobile-nav__links {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mobile-nav__link {
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-lg);
      font-weight: 500;
      color: var(--color-text-primary);
      text-decoration: none;
      transition: background var(--transition-fast);
    }

    .mobile-nav__link:hover {
      background: var(--color-border-light);
    }
  `],
})
export class AppComponent {
  readonly mobileNavOpen = signal(false);

  onAddListing(): void {
    console.info("Add listing clicked");
  }
}
