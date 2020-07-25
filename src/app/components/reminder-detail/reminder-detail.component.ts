import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Reminder, CalendarDay } from 'src/app/types';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RemindersService } from 'src/app/services/reminders.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
    selector: 'reminder-detail',
    templateUrl: './reminder-detail.component.html',
    styleUrls: ['./reminder-detail.component.scss']
})
export class reminderDetailComponent implements OnInit {

    @Input('reminder') reminder: Reminder
    @Input('day') day: CalendarDay
    @Input('edition') edition

    @Output('close') close_output: EventEmitter<void> = new EventEmitter()
    @Output('new-value') new_value_output: EventEmitter<void> = new EventEmitter()

    reminder_form: FormGroup = this._form_builder.group({
        'id': new FormControl(''),
        'color': new FormControl(''),
        'date': new FormControl(''),
        'text': new FormControl(''),
        'city': new FormControl(''),
    })

    constructor(private _form_builder: FormBuilder, private _reminders_service: RemindersService, private _weather_service: WeatherService) {}

    ngOnInit(): void {
        if(this.reminder){
            this.reminder_form.setValue(this.reminder)
        } else {
            this.reminder_form.setValue({
                'id': `${new Date().getTime()}`,
                'color': 'blue',
                'date': this.day.moment,
                'text': '',
                'city': '',
            })
        }
        
    }

    action_edit(){
        this.edition = true
    }
    action_delete(){
        this.reminder = this.reminder_form.value
        this._reminders_service.delete_reminder(this.reminder, this.day.moment.month(), this.day.moment.year())
        this.edition = false
        this.close_output.emit()
    }
    action_close(){
        this.close_output.emit()
    }
    action_climate(){
        this._weather_service.get_weather()
    }

    action_save(){
        this.reminder = this.reminder_form.value
        this._reminders_service.set_reminder(this.reminder, this.day.moment.month(), this.day.moment.year())
        this.edition = false
    }
}
