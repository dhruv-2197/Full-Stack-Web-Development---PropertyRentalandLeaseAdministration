import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  template: `
    @if (message()) {
      <div
        class="alert d-flex align-items-center justify-content-between gap-2 mb-3"
        [class.alert-danger]="type() === 'error'"
        [class.alert-success]="type() === 'success'"
        role="alert"
      >
        <div>
          <i
            class="bi me-2"
            [class.bi-exclamation-triangle-fill]="type() === 'error'"
            [class.bi-check-circle-fill]="type() === 'success'"
          ></i>
          <span>{{ message() }}</span>
        </div>
        <button type="button" class="btn-close" (click)="dismissed.emit()" aria-label="Dismiss"></button>
      </div>
    }
  `
})
export class AlertBannerComponent {
  readonly message = input<string | null>(null);
  readonly type = input<'error' | 'success'>('error');
  readonly dismissed = output<void>();
}
