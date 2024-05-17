import { Component } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  starRate = 2;
  heartRate = 4;
  radioGroupValue = 'This is value 2';
}
