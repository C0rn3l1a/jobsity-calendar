import { Component, OnInit } from '@angular/core';
import { RemindersService } from 'src/app/services/reminders.service';
import { Reminder, CalendarDay } from 'src/app/types';
import * as moment from 'moment';

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    days: string[] = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

    calendar_days: CalendarDay[] = []
    hovered_day: CalendarDay
    chosen_day: CalendarDay
    chosen_reminder: Reminder

    current_day = moment().date()
    current_month = moment().month()
    current_year = moment().year()

    reminder_map: Map<string, Reminder> = new Map()

    // toggles
    _toggle_overlay: boolean = false
    _reminder_edition: boolean = false
    _overlay_anchor: {x:string, y:string}

    constructor(private _reminders_service: RemindersService) { }

    ngOnInit(): void {
        this.calendar_days = this.get_calendar_days(this.current_month, this.current_year)
        this._reminders_service.get_reminders(this.current_month, this.current_year).subscribe(reminders => {
            for(let reminder of reminders){
                this.reminder_map.set(reminder.id, reminder)
                let index = this.calendar_days.findIndex(day => {
                    return day.moment.date() === reminder.date.date() && day.moment.month() === reminder.date.month()
                })
                if(index > 0){
                    !this.calendar_days[index].reminders && ( this.calendar_days[index].reminders = [] )
                    this.calendar_days[index].reminders.push(reminder)
                }
                // TODO: order remindes by time
            }
        })
    }

    get_fill_start(month, year){
        let fill_start = []
        let start_of_month = moment().year(year).month(month).startOf('month')
        let control = moment(start_of_month).subtract(1,'month').endOf('month')
        while(control.weekday() > 0){
            fill_start.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, last_month: true})
            control.subtract(1,'day')
        }
        fill_start.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, last_month: true})
        
        return fill_start.reverse()
    }
    
    get_fill_end(month, year){
        let fill_end = []
        let end_of_month = moment().year(year).month(month).endOf('month')
        let control = moment(end_of_month).add(1,'month').startOf('month')
        while(control.weekday() < 6){
            fill_end.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, next_month: true})
            control.add(1,'day')
        }
        fill_end.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, next_month: true})
        
        return fill_end
    }

    get_calendar_days(month, year){
        let month_days_amount = moment().year(month).month(year).daysInMonth();
        let calendar_days = []
        for(let i = 1; i <= month_days_amount; i++){
            calendar_days.push({date: i, code: moment().date(i).format('MM-DD-YYYY'), moment: moment().year(month).month(month).date(i)})
        }

        let fill_start = this.get_fill_start(month, year)
        let fill_end = this.get_fill_end(month, year)

        return [
            ...fill_start,
            ...calendar_days,
            ...fill_end,
        ]
    }

    open_add_reminder(day: CalendarDay, $event: MouseEvent){
        this._toggle_overlay = true
        this._reminder_edition = true
        this.chosen_day = day
        this.chosen_reminder = null
        this.generate_overlay_anchor($event.screenX, $event.screenY)
    }

    generate_overlay_anchor(x,y){
        x += 25 // a little aestetic offset
        y -= 80 // a little aestetic offset

        // controls that overlay won't show up outside the window
        if(y > window.innerHeight - 400){
            y = window.innerHeight - 450 
        }
        if(x > window.innerWidth - 350){
            x = window.innerWidth - 400 
        }

        this._overlay_anchor = {
            x: `${x}px`,
            y: `${y}px`,
        }
    }
}
