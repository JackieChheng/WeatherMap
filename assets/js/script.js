document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const savedLocationsDiv = document.querySelector(".saved-locations");
    const currentWeatherDiv = document.querySelector(".current-weather");
    const weatherCardsDiv = document.querySelector(".weather-cards");

    const API_KEY = '96c9264a940f91bc89a76d3fcd83e67c';

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) {
            return `<div class="details">
                <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h6>Temperature: ${weatherItem.main.temp}°F</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
        } else {
            return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>Temp: ${weatherItem.main.temp}°F</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
        }
    }


    const displayWeatherData = (cityName, latitude, longitude) => {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

        fetch(WEATHER_API_URL)
            .then(response => response.json())
            .then(data => {
                const uniqueForecastDays = [];
                const fiveDaysForecast = data.list.filter(forecast => {
                    const forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        return uniqueForecastDays.push(forecastDate);
                    }
                });

                cityInput.value = "";
                currentWeatherDiv.innerHTML = "";
                weatherCardsDiv.innerHTML = "";

                fiveDaysForecast.forEach((weatherItem, index) => {
                const temperatureFahrenheit = ((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2);
                weatherItem.main.temp = temperatureFahrenheit;

                    const html = createWeatherCard(cityName, weatherItem, index);
                    if (index === 0) {
                        currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                    } else {
                        weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                    }
                });

            console.log("Unique Forecast Days:", uniqueForecastDays);
            console.log("Five Days Forecast:", fiveDaysForecast);

                const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
                savedLocations.unshift(cityName); // Add to the beginning of the array
                localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
            })
            .catch(() => {
                alert('An error occurred while fetching the weather forecast');
            });
    }

    const getCityCoordinates = (cityName) => {
        if (!cityName) return;

        const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(GEO_API_URL)
            .then(response => response.json())
            .then(data => {
                if (!data.length) {
                    alert(`No coordinates found for ${cityName}`);
                } else {
                    const { lat, lon, name } = data[0];
                    displayWeatherData(name, lat, lon);
                }
            })
            .catch(() => {
                alert('An error occurred while fetching the coordinates');
            });
    }

    const getUserCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

                fetch(GEO_API_URL)
                    .then(response => response.json())
                    .then(data => {
                        const { name } = data[0];
                        displayWeatherData(name, latitude, longitude);
                    })
                    .catch(() => {
                        alert('An error occurred while fetching the city name');
                    });
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert('Geolocation request denied. Please reset location permission to grant access again.');
                } else {
                    alert('Geolocation request error. Please reset location permission.');
                }
            }
        );
    }

   
    searchButton.addEventListener('click', () => {
        const cityName = cityInput.value.trim();
        getCityCoordinates(cityName);
    });

    cityInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const cityName = cityInput.value.trim();
            getCityCoordinates(cityName);
        }
    });

    const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
    savedLocations.forEach(cityName => {
        const locationButton = document.createElement("button");
        locationButton.textContent = cityName;
        locationButton.classList.add("saved-location");
        locationButton.addEventListener("click", () => {
            getCityCoordinates(cityName);
        });

        savedLocationsDiv.appendChild(locationButton);
    });
});
