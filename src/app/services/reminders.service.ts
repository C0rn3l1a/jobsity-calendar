import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reminder } from '../types';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class RemindersService {

    reminder_list: Reminder

    constructor() {}

    get_reminders(month, year): Observable<Reminder[]>{
        // simulated API call
        // TODO: implement basic reminder API
        let reminder_list: any[] = JSON.parse(localStorage.getItem(`${month}-${year}_reminders`) || '[]')

        reminder_list = [
            {city: "Cordoba", id: "1236574", color: "red", date:"2020-07-24T23:08:51.738Z", text: "mock reminder!!! ams largooooooo"}
        ]

        return of(reminder_list).pipe(
            // transform ISOStrings to moment instances and return only reminders from selected month
            map(reminders => reminders
                .map(r => {r.date = moment(r.date); return r})
                .filter(r => r.date.month() === month && r.date.year() === year)))
    }
}
