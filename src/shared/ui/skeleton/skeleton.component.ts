import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sc-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="skeleton" [style.height]="height()" [style.border-radius]="radius()"></div>`,
  styles: [`
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease infinite;
      width: 100%;
      border-radius: 8px;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class SkeletonComponent {
  height = input('16px');
  radius = input('8px');
}
