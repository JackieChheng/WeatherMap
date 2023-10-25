document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector(".search-btn");
    const cityInput = document.querySelector(".city-input");
    const apiKey = '96c9264a940f91bc89a76d3fcd83e67c'; 
    const cnt = 5; 

    const updateWeatherData = (cityName, lat, lon) => {
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${apiKey}`;

        fetch(weatherAPI)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                data.list.filter(forecast => {})
            })
            .catch(() => {
                alert('An error has occurred getting weather forecast');
            });
    }

    const fetchWeatherData = () => {
        const cityName = cityInput.value.trim();
        if (!cityName) return;

        const geoAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

        fetch(geoAPI)
            .then((res) => res.json())
            .then((data) => {
                if (!data.name) {
                    return alert(`Coordinates could not be found for ${cityName}`);
                }
                const { name, coord } = data;
                const { lat, lon } = coord;
                updateWeatherData(name, lat, lon);
            })
            .catch(() => {
                alert('An error has occurred getting coordinates');
            });
    }

    searchButton.addEventListener("click", fetchWeatherData);
});
