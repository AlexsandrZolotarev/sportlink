import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sc-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="footer__inner">

        <div class="footer__col">
          <p class="footer__col-title">Скачайте мобильное приложение</p>
          <div class="footer__apps">
            <a class="footer__app-badge" href="#" aria-label="Скачать в Google Play">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 2L17 10L3 18V2Z" fill="white"/>
              </svg>
              <span>
                <small>Доступно в</small>
                Google Play
              </span>
            </a>
            <a class="footer__app-badge" href="#" aria-label="Скачать в App Store">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 1C13 1 13 4 10 4C7 4 7 1 7 1" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="3" y="4" width="14" height="13" rx="3" stroke="white" stroke-width="1.5"/>
              </svg>
              <span>
                <small>Доступно в</small>
                App Store
              </span>
            </a>
          </div>
        </div>

        <div class="footer__col">
          <p class="footer__col-title">Мы в соцсетях</p>
          <div class="footer__socials">
            <a class="footer__social" href="#" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10C2 5.6 5.6 2 10 2s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" stroke="currentColor" stroke-width="1.4"/>
                <path d="M6 10l2 2 6-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a class="footer__social" href="#" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/>
                <path d="M6.5 7.5C7 9 9 13 13.5 13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </a>
            <a class="footer__social" href="#" aria-label="ВКонтакте">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" stroke-width="1.4"/>
                <path d="M5 8h2v4M5 8c0 0 1 4 5 4M15 8h-2v4M15 8c0 0-1 4-5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer__col">
          <p class="footer__col-title">О нас</p>
          <nav class="footer__links" aria-label="О компании">
            <a class="footer__link" href="#">Карта сайта</a>
            <a class="footer__link" href="#">Партнёрам</a>
          </nav>
        </div>

        <div class="footer__col">
          <p class="footer__col-title">Ответим на ваши вопросы в чате</p>
          <div class="footer__chat-icons">
            <a class="footer__chat-btn footer__chat-btn--wa" href="#" aria-label="Написать в WhatsApp">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 10C7.5 12 10 15 15 15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </a>
            <a class="footer__chat-btn footer__chat-btn--tg" href="#" aria-label="Написать в Telegram">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 11l3 3 7-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a class="footer__chat-btn footer__chat-btn--chat" href="#" aria-label="Онлайн-чат">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 3h14c.6 0 1 .4 1 1v9c0 .6-.4 1-1 1H7l-4 4V4c0-.6.4-1 1-1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div class="footer__bottom">
        <p>Copyright © {{ year }} SPORT CLICK</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-dark-bg);
      color: var(--color-dark-text);
      margin-top: auto;
    }

    .footer__inner {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 40px 24px 32px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
    }

    .footer__col-title {
      font-size: var(--font-size-sm);
      font-weight: 600;
      color: #fff;
      margin-bottom: 14px;
      line-height: 1.4;
    }

    /* ── App badges ────────────────────────────────────────────────────────── */
    .footer__apps {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer__app-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.14);
      border-radius: var(--radius-md);
      text-decoration: none;
      color: #fff;
      font-size: var(--font-size-sm);
      font-weight: 600;
      transition: background var(--transition-fast);

      small { display: block; font-size: 10px; font-weight: 400; opacity: .7; }
      &:hover { background: rgba(255,255,255,.14); }
    }

    /* ── Socials ────────────────────────────────────────────────────────────── */
    .footer__socials {
      display: flex;
      gap: 8px;
    }

    .footer__social {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.14);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-dark-text);
      text-decoration: none;
      transition: all var(--transition-fast);

      &:hover { background: rgba(255,255,255,.18); color: #fff; }
    }

    /* ── Links ──────────────────────────────────────────────────────────────── */
    .footer__links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer__link {
      font-size: var(--font-size-base);
      color: var(--color-dark-text);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover { color: #fff; }
    }

    /* ── Chat buttons ───────────────────────────────────────────────────────── */
    .footer__chat-icons {
      display: flex;
      gap: 8px;
    }

    .footer__chat-btn {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-decoration: none;
      transition: opacity var(--transition-fast);

      &:hover { opacity: .85; }
    }

    .footer__chat-btn--wa   { background: #25D366; }
    .footer__chat-btn--tg   { background: #2AABEE; }
    .footer__chat-btn--chat { background: var(--color-accent); }

    /* ── Bottom bar ──────────────────────────────────────────────────────────── */
    .footer__bottom {
      border-top: 1px solid rgba(255,255,255,.08);
      padding: 14px 24px;
      text-align: center;
      font-size: var(--font-size-sm);
      color: rgba(255,255,255,.4);
      max-width: var(--container-max);
      margin: 0 auto;
    }

    /* ── Responsive ─────────────────────────────────────────────────────────── */
    @media (max-width: 900px) {
      .footer__inner { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .footer__inner { grid-template-columns: 1fr; padding: 24px 16px; }
    }
  `],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
