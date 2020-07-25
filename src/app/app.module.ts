import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { reminderDetailComponent } from './components/reminder-detail/reminder-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ReminderComponent,
    reminderDetailComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
