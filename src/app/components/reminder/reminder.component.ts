import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'reminder',
    templateUrl: './reminder.component.html',
    styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

    @Input('reminder') reminder

    constructor() {}

    ngOnInit(): void {
    }

}
