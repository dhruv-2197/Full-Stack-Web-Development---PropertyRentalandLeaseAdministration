import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  template: `
    @if (control() && control()!.invalid && (control()!.touched || control()!.dirty)) {
      <div class="text-danger small mt-1">
        @if (control()!.errors?.['required']) {
          <span>{{ label() }} is required.</span>
        } @else if (control()!.errors?.['minlength']) {
          <span>{{ label() }} must be at least {{ control()!.errors?.['minlength'].requiredLength }} characters.</span>
        } @else if (control()!.errors?.['maxlength']) {
          <span>{{ label() }} cannot exceed {{ control()!.errors?.['maxlength'].requiredLength }} characters.</span>
        } @else if (control()!.errors?.['email']) {
          <span>Please enter a valid email address.</span>
        } @else if (control()!.errors?.['pattern']) {
          <span>{{ patternMessage() }}</span>
        } @else if (control()!.errors?.['min']) {
          <span>{{ label() }} must be at least {{ control()!.errors?.['min'].min }}.</span>
        } @else if (control()!.errors?.['max']) {
          <span>{{ label() }} cannot exceed {{ control()!.errors?.['max'].max }}.</span>
        } @else {
          <span>Invalid {{ label().toLowerCase() }}.</span>
        }
      </div>
    }
  `
})
export class FieldErrorComponent {
  readonly control = input<AbstractControl | null>(null);
  readonly label = input('This field');
  readonly patternMessage = input('Invalid format.');
}
