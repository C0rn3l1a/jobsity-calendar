import { Injectable } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reminder } from '../types';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class RemindersService {

    reminder_list: Subject<Reminder[]> = new Subject()

    constructor() {}

    get_reminders(month, year): void{
        // simulated API call
        // TODO: implement basic reminder API
        let reminder_list: any[] = JSON.parse(localStorage.getItem(`${month}-${year}_reminders`) || '[]')

        reminder_list = reminder_list
            .map(r => {r.date = moment(r.date); return r})
            .filter(r => r.date.month() === month && r.date.year() === year)

        this.reminder_list.next(reminder_list as Reminder[])
            // transform ISOStrings to moment instances and return only reminders from selected month
            
    }

    set_reminder(reminder: Reminder, month: number, year: number){
        let reminder_list: any[] = JSON.parse(localStorage.getItem(`${month}-${year}_reminders`) || '[]')
        reminder_list = reminder_list.map(r => {r.date = moment(r.date); return r})
        let existing_reminder_index = reminder_list.findIndex(r => r.id === reminder.id)

        if(existing_reminder_index > -1){
            // reminder already exists, this is an edition
            reminder_list[existing_reminder_index] = reminder
        } else {
            reminder_list.push(reminder)
        }

        this.reminder_list.next(reminder_list as Reminder[])
        this.save_reminder_list(reminder_list, month, year)
    }

    delete_reminder(reminder: Reminder, month: number, year: number){
        let reminder_list: any[] = JSON.parse(localStorage.getItem(`${month}-${year}_reminders`) || '[]')
        reminder_list = reminder_list.map(r => {r.date = moment(r.date); return r})
        let existing_reminder_index = reminder_list.findIndex(r => r.id === reminder.id)
        if(existing_reminder_index > -1){
            reminder_list.splice(existing_reminder_index, 1)
        }

        this.reminder_list.next(reminder_list as Reminder[])
        this.save_reminder_list(reminder_list, month, year)
    }

    private save_reminder_list(reminder_list: any[], month: number, year: number){
        localStorage.setItem(`${month}-${year}_reminders`, JSON.stringify(reminder_list))
    }
}
