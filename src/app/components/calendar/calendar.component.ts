import { Component, OnInit } from '@angular/core';
import { RemindersService } from 'src/app/services/reminders.service';
import { Reminder, CalendarDay } from 'src/app/types';
import moment from 'moment';

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
    
    _overlay_mode: 'reminder_detail' | 'extend_reminders' = 'reminder_detail'
    _overlay_anchor: {x:string, y:string}
    
    constructor(private _reminders_service: RemindersService) { }

    /**
     * @author N4cho!
     * @description 
     * The following Actions are excecuted in order:
     * 1. subscribes to reminder_list where each reminder is placed in it's corresponding day
     * 2. populates the list of days to display in the calendar
     * 3. triggers above subscription calling get_reminders with current month and year
     * @memberof CalendarComponent
     */
    ngOnInit(): void {
        this._reminders_service.reminder_list.subscribe(reminders => {
            this.calendar_days.map(day => day.reminders = [])
            for(let reminder of reminders){
                this.reminder_map.set(reminder.id, reminder)
                let index = this.calendar_days.findIndex(day => {
                    // console.log(day.moment.month(),' vs ',reminder.date.month())
                    return day.moment.date() === reminder.date.date() && day.moment.month() === reminder.date.month()
                })
                if(index > 0){
                    this.calendar_days[index].reminders.push(reminder)
                    this.calendar_days[index].reminders.sort((a,b) => a.date.unix() - b.date.unix() )
                }                
            }
        })
        this.calendar_days = this.get_calendar_days(this.current_month, this.current_year)
        this._reminders_service.get_reminders(this.current_month, this.current_year)   
    }
    
    // Core Functionality
    /**
     * @author N4cho!
     * @description Generates all days needed to fill the week gap to the start of the given month
     * @param {number} month
     * @param {number} year
     * @returns
     * @memberof CalendarComponent
     */
    get_fill_start(month: number, year: number){
        let fill_start = []
        let start_of_month = moment().year(year).month(month).startOf('month')
        let control = moment(start_of_month).subtract(1,'month').endOf('month')
        if(start_of_month.weekday() === 0){ // no filling needed
            return []
        }
        while(control.weekday() > 0){
            fill_start.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, last_month: true})
            control.subtract(1,'day')
        }
        fill_start.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, last_month: true})
        
        return fill_start.reverse()
    }
    
    /**
     * @author N4cho!
     * @description Generates all days needed to fill the week gap to the end of the given month
     * @param {number} month
     * @param {number} year
     * @returns
     * @memberof CalendarComponent
     */
    get_fill_end(month, year){
        let fill_end = []
        let end_of_month = moment().year(year).month(month).endOf('month')
        let control = moment(end_of_month).add(1,'month').startOf('month')
        if(end_of_month.weekday() === 6){ // no filling needed
            return []
        }
        while(control.weekday() < 6){
            fill_end.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, next_month: true})
            control.add(1,'day')
        }
        fill_end.push({code: control.format('MM-DD-YYYY') ,date: control.date(), moment: control, next_month: true})
        
        return fill_end
    }

    /**
     * @author N4cho!
     * @description Generates all days needed populate the calendar
     * @param {number} month
     * @param {number} year
     * @returns
     * @memberof CalendarComponent
     */
    get_calendar_days(month, year){
        let month_days_amount = moment().year(year).month(month).daysInMonth()
        let calendar_days = []
        for(let i = 1; i <= month_days_amount; i++){
            calendar_days.push({date: i, code: moment().year(year).month(month).date(i).format('MM-DD-YYYY'), moment: moment().year(year).month(month).date(i)})
        }

        let fill_start = this.get_fill_start(month, year)
        let fill_end = this.get_fill_end(month, year)

        return [
            ...fill_start,
            ...calendar_days,
            ...fill_end,
        ]
    }

    // User Interactions
    /**
     * @author N4cho!
     * @description Opens the overlay and sets it's parameters to add a new one
     * @param {CalendarDay} day
     * @param {MouseEvent} $event
     * @returns
     * @memberof CalendarComponent
     */
    open_add_reminder(day: CalendarDay, $event: MouseEvent){
        this._toggle_overlay = true
        this._reminder_edition = true
        this._overlay_mode = "reminder_detail"
        this.chosen_day = day
        this.chosen_reminder = null
        this.generate_overlay_anchor($event.screenX, $event.screenY)
    }
    
    /**
     * @author N4cho!
     * @description Opens the overlay and sets it's parameters to show the selected reminder
     * @param {CalendarDay} day
     * @param {Reminder} reminder
     * @param {MouseEvent} $event
     * @param {boolean} calculate_anchor - indicates that overlay position should be calculated
     * @returns
     * @memberof CalendarComponent
     */
    open_reminder(day: CalendarDay, reminder: Reminder, $event: MouseEvent, calculate_anchor = true){
        this._toggle_overlay = true
        this._reminder_edition = false
        this._overlay_mode = "reminder_detail"
        this.chosen_day = day
        this.chosen_reminder = reminder
        if(calculate_anchor){
            this.generate_overlay_anchor($event.screenX, $event.screenY)
        }
    }

    /**
     * @author N4cho!
     * @description Closes the reminder overlay and clears current data
     * @memberof CalendarComponent
     */
    close_reminder(){
        this._toggle_overlay = false
        this._reminder_edition = false
        this.chosen_day = null
        this.chosen_reminder = null
        this._overlay_anchor = null
    }

    /**
     * @author N4cho!
     * @description Opens the overlay and sets it's parameters to show the complete list of reminders for the given day
     * @param {CalendarDay} day
     * @param {MouseEvent} $event
     * @returns
     * @memberof CalendarComponent
     */
    extend_reminders(day: CalendarDay, $event: MouseEvent){
        this._toggle_overlay = true
        this._overlay_mode = "extend_reminders"
        this.chosen_day = day
        this.generate_overlay_anchor($event.screenX, $event.screenY)
    }

    /**
     * @author N4cho!
     * @description Closes the overlay and clears current data
     * @param {CalendarDay} day
     * @param {MouseEvent} $event
     * @returns
     * @memberof CalendarComponent
     */
    close_extend_reminders(){
        this._toggle_overlay = false
        this.chosen_day = null
        this._overlay_anchor = null
    }

    /**
     * @author N4cho!
     * @description Changes current month and year if necessary, then loads all days and reminders for the selected month
     * @param {number} mod
     * @memberof CalendarComponent
     */
    change_month(mod: number){
        this.current_month += mod
        if(this.current_month > 11){
            this.current_month = 0
            this.current_year += 1
        }
        if(this.current_month < 0){
            this.current_month = 11
            this.current_year -= 1
        }
        this.calendar_days = this.get_calendar_days(this.current_month, this.current_year)
        this._reminders_service.get_reminders(this.current_month, this.current_year)   
    }

    /**
     * @author N4cho!
     * @description Deletes all reminders from the selected day
     * @param {CalendarDay} day
     * @memberof CalendarComponent
     */
    clear_day_reminders(day: CalendarDay){
        this._reminders_service.delete_day_reminders(day, day.moment.month(), day.moment.year())
    }

    /**
     * @author N4cho!
     * @description Generates a relative position for the overlay from some (x,y) coordinates from a mouse event
     * @param {CalendarDay} day
     * @memberof CalendarComponent
     */
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
