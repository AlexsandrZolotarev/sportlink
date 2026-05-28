import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IconService } from "./icon.service";

const FALLBACK_ICONS: Record<string, string> = {
  like: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.92607 6.11688C4.61536 6.47937 4.44458 6.94104 4.44458 7.41847V14.4565C4.44458 15.5611 5.34001 16.4565 6.44458 16.4565H12.5534C13.5199 16.4565 14.3482 15.7653 14.5211 14.8143L15.5716 9.03639C15.7948 7.80871 14.8517 6.67862 13.6039 6.67862H9.778L11.225 2.33752C11.4148 1.76813 11.1571 1.14583 10.6202 0.877418C10.1252 0.629923 9.52534 0.75107 9.16518 1.17125L4.92607 6.11688Z" stroke="currentColor" stroke-width="1.5"/><path d="M0.888903 15.5681V7.56796" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  comment: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.4068 14.4059C11.9619 16.8511 8.34158 17.3794 5.37889 16.0092C4.94152 15.8331 4.58294 15.6908 4.24205 15.6908C3.29255 15.6964 2.11069 16.6171 1.49644 16.0036C0.882199 15.3893 1.80357 14.2065 1.80357 13.2512C1.80357 12.9103 1.66689 12.5581 1.49082 12.1199C0.12002 9.1577 0.649043 5.53615 3.09396 3.09177C6.21503 -0.0304545 11.2858 -0.0304543 14.4068 3.09096C17.5335 6.21801 17.5279 11.2845 14.4068 14.4059Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "comment-close": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.4068 14.4059C11.9619 16.8511 8.34158 17.3794 5.37889 16.0092C4.94152 15.8331 4.58294 15.6908 4.24205 15.6908C3.29255 15.6964 2.11069 16.6171 1.49644 16.0036C0.882199 15.3893 1.80357 14.2065 1.80357 13.2512C1.80357 12.9103 1.66689 12.5581 1.49082 12.1199C0.12002 9.1577 0.649043 5.53615 3.09396 3.09177C6.21503 -0.0304545 11.2858 -0.0304543 14.4068 3.09096C17.5335 6.21801 17.5279 11.2845 14.4068 14.4059Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6L12 12M12 6L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  trash: `<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.75 6.35L12.9416 15.4268C12.8754 15.7975 12.6787 16.1334 12.386 16.3754C12.0932 16.6174 11.7232 16.75 11.3409 16.75H3.15906C2.77682 16.75 2.40679 16.6174 2.11404 16.3754C1.8213 16.1334 1.62457 15.7975 1.55844 15.4268L0.75 6.35M13.75 3.95H9.99219M9.99219 3.95V2.35C9.99219 1.92565 9.82098 1.51869 9.51624 1.21863C9.21149 0.918571 8.79816 0.75 8.36719 0.75H6.13281C5.70184 0.75 5.28851 0.918571 4.98376 1.21863C4.67902 1.51869 4.50781 1.92565 4.50781 2.35V3.95M9.99219 3.95H7.25H4.50781M0.75 3.95H4.50781" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

@Component({
  selector: "sc-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [innerHTML]="safeHtml()"></span>`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
      }
      :host span {
        display: contents;
      }
      :host ::ng-deep svg {
        width: 1em;
        height: 1em;
        display: block;
      }
    `,
  ],
})
export class IconComponent {
  readonly name = input.required<string>();

  private readonly svc = inject(IconService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly safeHtml = signal<SafeHtml>("");

  constructor() {
    effect((onCleanup) => {
      const name = this.name();
      const fallback = FALLBACK_ICONS[name];

      if (fallback) {
        this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(fallback));
      }

      const sub = this.svc.load(name).subscribe({
        next: (svg) => {
          this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(svg));
        },
        error: () => {
          this.safeHtml.set(
            fallback ? this.sanitizer.bypassSecurityTrustHtml(fallback) : "",
          );
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }
}
