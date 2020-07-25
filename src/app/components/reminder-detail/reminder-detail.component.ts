import { Component, OnInit, Input } from '@angular/core';
import { Reminder } from 'src/app/types';

@Component({
    selector: 'reminder-detail',
    templateUrl: './reminder-detail.component.html',
    styleUrls: ['./reminder-detail.component.scss']
})
export class reminderDetailComponent implements OnInit {

    @Input('reminder') reminder: Reminder
    @Input('day') day
    @Input('edition') edition

    constructor() { }

    ngOnInit(): void {
    }

}
