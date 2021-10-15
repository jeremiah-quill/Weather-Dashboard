console.log('connected')
const currentTemp = document.querySelector('#current-temp')
const currentWind = document.querySelector('#current-wind')
const currentHumidity = document.querySelector('#current-humidity')
const currentUVI = document.querySelector('#current-uvi')
const forecastConditions = document.querySelector('#forecast-conditions-container')
const searchInput = document.querySelector('#search-input');
const searchSubmit = document.querySelector('#search-submit')
const searchResults = document.querySelector('#search-results')
const cityName = document.querySelector('#city-name')
const currentDate = document.querySelector('#current-date')
const conditions = document.querySelector('#conditions')
const currentIcon = document.querySelector('#current-icon')
const searchHistory = document.querySelector('.search-history')

const apiKey = '6a905d171191dfe149465c7b27c14813'


// Find cities that match searched string and show them in a dropdown list
const getLatLon = (string) => {
    let cityURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${string}.json?access_token=pk.eyJ1IjoiamNxNTAxMCIsImEiOiJja3VuM2JsZDIwNDE4MzJydHR2Nm40cjYxIn0.eToiBw2L4wBjnjyvJqCLUw`

    fetch(cityURL)
    .then(res => {
        return res.json()
    })
    .then(data => {
        let cities = data.features.filter(result => result.place_type[0] == "place")
        cities.forEach(city => {
            let searchResult = document.createElement('li');
            searchResult.className = 'search-result'
            searchResult.textContent = city.place_name
            searchResults.appendChild(searchResult)

            // Click a search result to fire getWeather api call with a specified latitude and longitude
            searchResult.addEventListener('click', () => {
                
                    let lat = city.center[1];
                    let lon = city.center[0];

                    getWeather(lat, lon, city.place_name)

                    let searchObject = {
                        lat: city.center[1],
                        lon: city.center[0],
                        name: city.place_name
                    }
                    if(localStorage.getItem("history") !== null) {
                        let history = JSON.parse(localStorage.getItem("history"))
                        history.push(searchObject)
                        localStorage.setItem("history", JSON.stringify(history))
                    }   else {
                        let history = [searchObject]
                        localStorage.setItem("history", JSON.stringify(history))
                    }
                    
                    renderHistory()

                    


                    searchResults.innerHTML = ''
            })
        })
    })
}

// Gets current weather based on a latitude and longitude
const getWeather = (lat, lon, name) => {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`

    fetch(url, {"Set-Cookie": "none; secure"})
    .then(res => {
        return res.json()
    }) 
    .then(data => {
        // Render current weather
        forecastConditions.innerHTML = ''
        cityName.textContent = name
        conditions.style.visibility = 'visible';
        let date = new Date();
        let formattedDate = date.toLocaleDateString("en-US")  
        currentDate.textContent = formattedDate

        let currentIconImg = document.createElement('img');
        currentIconImg.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
        currentIcon.innerHTML = ""
        currentIcon.appendChild(currentIconImg)

        currentTemp.textContent = data.current.temp;
        currentWind.textContent = data.current.wind_speed;
        currentHumidity.textContent = data.current.humidity
        currentUVI.textContent = data.current.uvi

        // Render 5 day forecast
        const daily = data.daily;
        for(let i=0; i<5; i++) {
            // Get next day's date
            let date = new Date();
            date.setDate(date.getDate() + (i+1))
            let formattedDate = date.toLocaleDateString("en-US")  
        
            // Create daily forecast element and append
            let forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day'
            let forecastDayContent = `
            <h3>${formattedDate}</h3>
            <div><img src=http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png></div>
            <p>Temp:<span id="forecast-temp"> ${daily[i].temp.day}</span></p>
            <p>Wind:<span id="forecast-wind"> ${daily[i].wind_speed}</span></p>
            <p>Humidity:<span id="forecast-humidity"> ${daily[i].humidity}</span></p>`
            forecastDay.innerHTML = forecastDayContent
            forecastConditions.appendChild(forecastDay)
        }
    })
}

const renderHistory = () => {
    if(localStorage.getItem("history") !== null) {
        let history = JSON.parse(localStorage.getItem("history"))
        searchHistory.innerHTML = ''
        history.forEach(item => {
            let el = document.createElement('li');

            el.addEventListener('click', () => {
                console.log(item.lat)
                getWeather(item.lat, item.lon, item.name)
            })

            el.textContent = item.name;
            searchHistory.appendChild(el)
        })
    }
}

searchInput.addEventListener('keyup', () => {
    searchResults.innerHTML = ''
    if(searchInput.value.length > 2) {
        getLatLon(searchInput.value)
    }
})

renderHistory()