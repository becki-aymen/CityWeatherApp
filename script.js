let weather = {
    "apikey": "235667df0a88ad42bcbf0aabbc03e66b",
    
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid=" 
            + this.apikey
        )
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data))
        .catch((error) => {
            console.error("Error fetching weather:", error);
            this.showError(error.message);
        });
    },
    
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity, pressure, temp_max, temp_min } = data.main;
        const { speed } = data.wind;
        
        // Update current date
        this.updateDate();
        
        // Update main weather info
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = 
            "https://openweathermap.org/img/wn/"+ icon +"@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = Math.round(temp);
        document.querySelector(".high").innerText = "H:" + Math.round(temp_max) + "°";
        document.querySelector(".low").innerText = "L:" + Math.round(temp_min) + "°";
        
        // Update weather details
        document.querySelector(".humidity").innerText = humidity + "%";
        document.querySelector(".wind").innerText = Math.round(speed) + " km/h";
        document.querySelector(".pressure").innerText = pressure + " hPa";
        
        // Show weather card
        document.querySelector(".weather").classList.remove("loading");
        
        // Fetch forecast after current weather is loaded
        this.fetchForecast(name);
    },
    
    fetchForecast: function(city) {
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apikey}`
        )
        .then(response => response.json())
        .then(data => this.displayForecast(data))
        .catch(error => console.error("Error fetching forecast:", error));
    },
    
    displayForecast: function(data) {
        const forecastContainer = document.querySelector(".weather-forecast");
        forecastContainer.innerHTML = "";
        
        // Get daily forecasts (every 24 hours)
        for (let i = 0; i < 4; i++) {
            const forecast = data.list[i * 8]; // Get every 8th item (24h interval)
            
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en', { weekday: 'short' });
            const icon = forecast.weather[0].icon;
            const temp = Math.round(forecast.main.temp);
            
            const forecastItem = document.createElement("div");
            forecastItem.className = "forecast-item";
            forecastItem.innerHTML = `
                <div class="day">${day}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].description}">
                <div class="forecast-temp">${temp}°</div>
            `;
            
            forecastContainer.appendChild(forecastItem);
        }
    },
    
    updateDate: function() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        document.querySelector(".date").innerText = today.toLocaleDateString('en-US', options);
    },
    
    showError: function(message) {
        const weatherElement = document.querySelector(".weather");
        weatherElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}. Please try another city.</p>
            </div>
        `;
        weatherElement.classList.remove("loading");
    },
    
    search: function() {
        const city = document.querySelector(".search-bar").value.trim();
        if (city) {
            document.querySelector(".weather").classList.add("loading");
            this.fetchWeather(city);
        }
    }
};

// Event listeners
document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search();
    }
});

// Initialize with default city
weather.fetchWeather("Kolkata");