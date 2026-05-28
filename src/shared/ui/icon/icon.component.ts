import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IconService } from "./icon.service";

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
  private readonly destroyRef = inject(DestroyRef);

  readonly safeHtml = signal<SafeHtml>("");

  constructor() {
    effect(() => {
      this.svc
        .load(this.name())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((svg) => {
          this.safeHtml.set(this.sanitizer.bypassSecurityTrustHtml(svg));
        });
    });
  }
}
