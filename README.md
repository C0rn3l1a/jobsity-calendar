# jobsity-calendar

# Ignacio Borello
## Coding Challenge

**Assignment :** The goal of this exercise is to create a demo calendar application using React, Vue or **Angular**.
**My Approach :** [moment.js](https://momentjs.com/) was my library of choise for Date managing and no UI library was used to manage the precise behaviour of each component. 
Forecast is only available for reminders no loger than 5 days apart from the current because of FREE user limitation for [OpenWeather](https://openweathermap.org/").
Reminders are stored on the browser local storage in separate lists by month.
**Bonus tasks completed :**

- [x] Expand the calendar to support more than the current month.            
- [x] Properly handle overflow when multiple reminders appear on the same date
- [x] Functionality to delete one or ALL the reminders for a specific day.

**Instructions :** To run the project clone the repo or download the code and have Node.js installed, then on the directory with the code run the command `npm install` and wait until it finshes, finally run the command `ng serve` and check [localhost:4200](http://localhost:4200/)
