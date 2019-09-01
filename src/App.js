import React, {Component, Fragment} from 'react';
// import logo from './logo.svg';
import './App.css';
import Header from "./Header";
import Weather from "./Weather";
import Form from "./Form";
// import { async } from 'q';
import "weather-icons/css/weather-icons.min.css";



//api.openweathermap.org/data/2.5/weather?q=London
const api_key = "7644d0b649975c44771989a2c6652b75";

class App extends Component{
  constructor(){
    super();
    this.state = {

      city: undefined,
      country: undefined,
      current_date: undefined,
      humidity: undefined,
      pressure: undefined, 
      max_temp: undefined, 
      min_temp: undefined,
      sunrise_timestamp: undefined,
      sunset_timestamp: undefined,
      wind: undefined,
      temperature: undefined,
      weather: undefined,
      icon: undefined,
      main: undefined,
      error: false
    };

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    };
  }

  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon: icons.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeather = async (e) => {

    e.preventDefault();

    const city = e.target.elements.city.value;

    if(city)
    {
      const apiCall = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);
      const response = await apiCall.json();

      var ms_date = response.dt*1000;
      var date = new Date(ms_date);
      date = date.toString();
      date = date.slice(0, 15);

      var ms_sunrise = response.sys.sunrise*1000;
      var sunrise = new Date(ms_sunrise);
      sunrise = sunrise.toString();
      sunrise = sunrise.slice(16, 24);

      var ms_sunset = response.sys.sunset*1000;
      var sunset = new Date(ms_sunset);
      sunset = sunset.toString();
      sunset = sunset.slice(16, 24);
      
    
      console.log(response);
      this.setState({

          city: response.name,
          country: response.sys.country,
          current_date: date,
          temperature: this.calCelsius(response.main.temp),
          pressure: response.main.pressure,
          humidity: response.main.humidity,
          wind: response.wind.speed,
          min_temp: this.calCelsius(response.main.temp_min),
          max_temp: this.calCelsius(response.main.temp_max),
          sunrise_timestamp: sunrise,
          sunset_timestamp: sunset,
          weather: response.weather[0].main,
          error: false
        });
      
      this.get_WeatherIcon(this.weatherIcon, response.weather[0].id);
    }
    else {
      this.setState({
        error: true
      });
    }
  }
  render(){
    return(
      <Fragment>
        <Header />
        <br />
        <Form loadWeather={this.getWeather} error={this.state.error}/>
        <Weather city={this.state.city} 
                 country={this.state.country} 
                 date={this.state.current_date}
                 temperature={this.state.temperature} 
                 pressure={this.state.pressure} 
                 humidity={this.state.humidity}
                 wind={this.state.wind} 
                 min_temp={this.state.min_temp} 
                 max_temp={this.state.max_temp}
                 sunrise={this.state.sunrise_timestamp} 
                 sunset={this.state.sunset_timestamp} 
                 weather={this.state.weather}
                 weatherIcon={this.state.icon}
          />
      </Fragment>
  )}
}


export default App;
