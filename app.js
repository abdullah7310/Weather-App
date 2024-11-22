let form = document.getElementById("submitForm");
let mykey = "01cabf7096f9d07c64b82917b3ed9a50";

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let city = document.getElementById('city').value.trim();
    console.log("city", city);
    if (!city) {
        alert("Please enter a city name.");  
        return;
    }

    weatherFunc()
});

async function weatherFunc() {
    // console.log("there is some errror");
    let wholeDataDiv = document.getElementById('wholeDate')
    wholeDataDiv.innerHTML = ""
    // let inputcity = document.getElementById("city").value;
    let inputcity = document.getElementById("city").value.trim();
    // console.log(inputcity);
    try {


        let weatherData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputcity}&appid=${mykey}&units=metric`);
        let originalData = await weatherData.json();
        console.log(originalData);

        if (originalData.cod !== 200) {  
            alert("City not found! Please enter a valid city name.");
            return;
        }

        let date = new Date()
        let currentDate = date.getDate()
        let month = date.getMonth() + 1;
        let year = date.getFullYear()
        // let time = date.getTime()

        let wholeDate = `${currentDate}/${month}/${year}`;
        let lon = originalData.coord.lon
        let lat = originalData.coord.lat

        let currentWeatherImage = "https://openweathermap.org/img/wn/";
        let dateShowing = document.createElement('h3');
        dateShowing.innerHTML = `
        <h3 class="weather-heading">Today's Weather</h3>
        <div id="mainDiv"><div class="date-div"><strong>Date-: ${wholeDate}</strong>
        <strong><p>Your City -: ${inputcity} </p></strong></div>
        <div class="date-div"><div><img class="currentWeatherImage" src="${currentWeatherImage + originalData.weather[0].icon}@2x.png" alt="Weather Icon"></div><strong>Weather -: ${originalData.weather[0].description}<strong>
        <strong><p>Temperature -: ${originalData.main.temp}</p><strong></div>
        <div class="date-div"><strong>Humidity -: ${originalData.main.humidity}<strong>
        <strong><p>WindSpeed -: ${originalData.wind.speed}</p><strong></div></div>
        `
        wholeDataDiv.appendChild(dateShowing);

        let next5day = document.getElementById('next5dayWeather')

        let data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${mykey}&units=metric`);
        let next5days = await data.json()
        console.log(next5days);
        let day5date = new Date();
        let today5date = day5date.toISOString().split("T")[0];
        let dailyHourlyData = {}
        let weekDay = new Date(day5date)
        let week5Day = weekDay.toLocaleString('en-us', { weekday: 'short' });
        // let weatherIcon 

        console.log(week5Day);

        next5days.list.forEach(element => {
            const fiveDayDate = element.dt_txt.split(" ")[0]
            let weatherIcon = element.weather[0].icon
            console.log("weather Icon is > ", weatherIcon);

            if (fiveDayDate !== today5date) {
                if (!dailyHourlyData[fiveDayDate]) {
                    dailyHourlyData[fiveDayDate] = { allTemp: 0, tempCount: 0, weatherArr: [], weatherIcon: [] };
                }
                dailyHourlyData[fiveDayDate].allTemp += element.main.temp;
                dailyHourlyData[fiveDayDate].tempCount += 1;
                dailyHourlyData[fiveDayDate].weatherArr.push(element.weather[0].description);
                dailyHourlyData[fiveDayDate].weatherIcon.push(element.weather[0].icon)
            }

        })
        console.log(dailyHourlyData);
        // let weatherDescription = data.weatherDescription[0];
        let next5DayForecast = []
        for (let date in dailyHourlyData) {
            if (next5DayForecast.length < 5) {
                let data = dailyHourlyData[date];
                let averageTemp = (data.allTemp / data.tempCount).toFixed(2);
                let weatherDescription = data.weatherArr[0];
                let weatherImage = data.weatherIcon[0]

                next5DayForecast.push({ date: date, weekDay: week5Day, averageTemp: averageTemp, weatherDescription: weatherDescription, weatherImage: weatherImage });
            } else {
                break;
            }
        }

        let weatherImageApi = "https://openweathermap.org/img/wn/";
        console.log("next5description", next5DayForecast);
        // console.log("weather description",weatherDescription);
        document.getElementById('card1').innerHTML = `
        <div><p>Date: ${next5DayForecast[0].date}</p></div>
        <div><p>Temp: ${next5DayForecast[0].averageTemp} °C</p></div>
        <div><img class="weatherImage" src="${weatherImageApi + next5DayForecast[0].weatherImage}@2x.png" alt="Weather Icon"></div>
        <div><p>Weather: ${next5DayForecast[0].weatherDescription}</p></div>
    `;
        document.getElementById('card2').innerHTML = `
        <div><p>Date: ${next5DayForecast[1].date}</p></div>
        <div><p>Temp: ${next5DayForecast[1].averageTemp} °C</p></div>
        <div><img class="weatherImage" src="${weatherImageApi + next5DayForecast[1].weatherImage}@2x.png" alt="Weather Icon"></div>
        <div><p>Weather: ${next5DayForecast[1].weatherDescription}</p></div>
    `;
        document.getElementById('card3').innerHTML = `
        <div><p>Date: ${next5DayForecast[2].date}</p></div>
        <div><p>Temp: ${next5DayForecast[2].averageTemp} °C</p></div>
        <div><img class="weatherImage" src="${weatherImageApi + next5DayForecast[2].weatherImage}@2x.png" alt="Weather Icon"></div>
        <div><p>Weather: ${next5DayForecast[2].weatherDescription}</p></div>
    `;
        document.getElementById('card4').innerHTML = `
        <div><p>Date: ${next5DayForecast[3].date}</p></div>
        <div><p>Temp: ${next5DayForecast[3].averageTemp} °C</p></div>
        <div><img class="weatherImage" src="${weatherImageApi + next5DayForecast[3].weatherImage}@2x.png" alt="Weather Icon"></div>
        <div><p>Weather: ${next5DayForecast[3].weatherDescription}</p></div>
    `;
        document.getElementById('card5').innerHTML = `
        <div><p>Date: ${next5DayForecast[4].date}</p></div>
        <div><p>Temp: ${next5DayForecast[4].averageTemp} °C</p></div>
         <div><img class="weatherImage" src="${weatherImageApi + next5DayForecast[4].weatherImage}@2x.png" alt="Weather Icon"></div>
        <div><p>Weather: ${next5DayForecast[4].weatherDescription}</p></div>
    `;
    } catch(err) {
        let wholeDate = document.getElementById('wholeDate')
        let h1 = document.createElement('h1')
        h1.textContent = "No City found!"
        wholeDate.append(h1)
        console.log("no city found");
        console.log(err);
        
        
    }
}
