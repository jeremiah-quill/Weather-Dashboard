console.log('connected')
const currentTemp = document.querySelector('#current-temp')
const currentWind = document.querySelector('#current-wind')
const currentHumidity = document.querySelector('#current-humidity')
const currentUVI = document.querySelector('#current-uvi')
const forecastConditions = document.querySelector('#forecast-conditions-container')


const apiKey = '6a905d171191dfe149465c7b27c14813'
const url = `https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,minutely,alerts&units=imperial&appid=${apiKey}`;

const getWeather = () => {
    fetch(url)
    .then(res => {
        return res.json()
    }) 
    .then(data => {
        // Render current weather
        currentTemp.textContent = data.current.temp;
        currentWind.textContent = data.current.wind_speed;
        currentHumidity.textContent = data.current.humidity
        currentUVI.textContent = data.current.uvi
        console.log(data)



        // var date = new Date();
        // // add a day
        // date.setDate(date.getDate() + 1);

        // Render 5 day forecast
        const daily = data.daily;
        console.log(daily)
        for(let i=0; i<5; i++) {

            let date = new Date();
            date.setDate(date.getDate() + (i+1))
            let formattedDate = date.toLocaleDateString("en-US")         

            let forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day'
            let forecastDayContent = `
            <h3>${formattedDate}</h3>
            <div>img goes here</div>
            <p>Temp:<span id="forecast-temp">${daily[i].temp.day}</span></p>
            <p>Wind:<span id="forecast-wind">${daily[i].wind_speed}</span></p>
            <p>Humidity:<span id="forecast-humidity">${daily[i].humidity}</span></p>
            `
            forecastDay.innerHTML = forecastDayContent
            forecastConditions.appendChild(forecastDay)
        }
    })
}

getWeather()

                // <div class="forecast-day">
                //     <h3>10/12/21</h3>
                //     <div>img goes here</div>
                //     <p>Temp:<span id="forecast-temp-container"></span></p>
                //     <p>Wind:<span id="forecast-wind-container"></span></p>
                //     <p>Humidity:<span id="forecast-humidity-container"></span></p>
                // </div>


{/* <p>Temp:<span id="current-temp-container"></span></p>
<p>Wind:<span id="current-wind-container"></span></p>
<p>Humidity:<span id="current-humidity-container"></span></p>
<p>UV Index:<span id="current-uv-container"></span></p> */}
