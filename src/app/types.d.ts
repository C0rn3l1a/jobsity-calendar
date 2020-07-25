export interface Reminder {
    id: string;
    date: moment.Moment;
    city: string;
    text: string;
    color: string
}

export interface CalendarDay {
    date: number;
    moment: moment.Moment;
    last_month?: boolean;
    next_month?: boolean;
    reminders: Reminder[];
}