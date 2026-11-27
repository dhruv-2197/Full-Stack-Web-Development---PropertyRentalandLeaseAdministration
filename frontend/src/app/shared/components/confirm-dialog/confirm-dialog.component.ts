import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (open()) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ title() }}</h5>
              <button type="button" class="btn-close" (click)="cancelled.emit()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p class="mb-0">{{ message() }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" (click)="cancelled.emit()">Cancel</button>
              <button type="button" [class]="'btn ' + confirmBtnClass()" (click)="confirmed.emit()">
                {{ confirmText() }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  readonly open = input(false);
  readonly title = input('Confirm Action');
  readonly message = input('Are you sure you want to proceed?');
  readonly confirmText = input('Confirm');
  readonly confirmBtnClass = input('btn-danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
