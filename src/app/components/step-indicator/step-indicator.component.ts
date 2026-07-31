import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss'],
  standalone: false
})
export class StepIndicatorComponent {
  @Input() currentStep = 1;
  steps = [1, 2, 3, 4];
}
