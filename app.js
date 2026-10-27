const API_KEY = a4c4c596ad0a1c415297a9cee2ece5f8;

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('errorMsg');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastEl = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

async function getWeatherData(city) {
  // Clear previous states
  errorEl.classList.add('hidden');
  currentWeatherEl.classList.add('hidden');
  forecastEl.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  try {
    // 1. Fetch Current Weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!currentRes.ok) {
      throw new Error('City not found. Please check the spelling.');
    }

    const currentData = await currentRes.json();

    // 2. Fetch 5-Day Forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    const forecastData = await forecastRes.json();

    // Hide loader and display data
    loadingEl.classList.add('hidden');
    displayCurrentWeather(currentData);
    displayForecast(forecastData);

  } catch (error) {
    loadingEl.classList.add('hidden');
    errorEl.textContent = error.message || 'Failed to fetch weather data.';
    errorEl.classList.remove('hidden');
  }
}

function displayCurrentWeather(data) {
  currentWeatherEl.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
    <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
  `;
  currentWeatherEl.classList.remove('hidden');
}

function displayForecast(data) {
  // OpenWeather forecast returns 3-hour intervals (40 total items for 5 days).
  // Filter for one reading per day around 12:00 PM.
  const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  forecastEl.innerHTML = '';
  dailyData.forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    forecastEl.innerHTML += `
      <div class="forecast-card">
        <p><strong>${date}</strong></p>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });

  forecastEl.classList.remove('hidden');
}
