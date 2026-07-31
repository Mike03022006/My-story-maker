import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_INTERESTS } from '../../services/profile.service';

@Component({
  selector: 'app-step-interests',
  templateUrl: './step-interests.component.html',
  styleUrls: ['./step-interests.component.scss'],
  standalone: false
})
export class StepInterestsComponent {

  @Input() selectedInterests: string[] = [];
  @Input() error = '';

  @Output() interestsChange = new EventEmitter<string[]>();
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  allInterests = ALL_INTERESTS;

  toggle(id: string) {
    let updated = [...this.selectedInterests];

    if (updated.includes(id)) {
      updated = updated.filter(i => i !== id);
    } else {
      updated.push(id);
    }

    this.interestsChange.emit(updated);
  }
}