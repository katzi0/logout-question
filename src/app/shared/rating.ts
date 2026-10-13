import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-rating',
  imports: [DecimalPipe],
  template: `
    <span class="stars" [attr.aria-label]="value() + ' out of 5 stars'">
      @for (fill of stars(); track $index) {
        <span class="star" [style.--fill]="fill"></span>
      }
    </span>
    <span class="rating-count">{{ count() | number }}</span>
  `,
  host: { class: 'rating' },
})
export class Rating {
  readonly value = input.required<number>();
  readonly count = input.required<number>();

  /** Fill of each of the 5 stars, 0–1. */
  protected readonly stars = computed(() =>
    [0, 1, 2, 3, 4].map((i) => Math.max(0, Math.min(1, this.value() - i))),
  );
}
