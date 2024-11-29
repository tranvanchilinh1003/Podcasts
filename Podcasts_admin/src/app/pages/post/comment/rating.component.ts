import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  template: `
    <div class="d-flex mt-1">
      <ng-container *ngFor="let star of stars; let i = index">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          [attr.fill]="i < value ? 'gold' : 'lightgray'"
        >
          <path
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          />
        </svg>
      </ng-container>
    </div>
  `,
  styles: [`
    svg {
      margin-right: 4px;
    }
  `],
})
export class RatingComponent {
  @Input() value: number = 0; // Giá trị đánh giá (rating)
  stars: number[] = Array(5).fill(0); // Hiển thị 5 ngôi sao mặc định
}
