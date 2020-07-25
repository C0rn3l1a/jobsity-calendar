import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    private public_api_key = '5dd56ecf2068c691d94317c8bb8cb935'

    constructor(private http: HttpClient) { }

    get_weather(){
        this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=1&appid=${this.public_api_key}`).subscribe(response => {
            console.log(response)
        })
    }
}
