// ====== WEATHER & NEWS APP ======

// 🌤️ API KEYS
const weatherApiKey = "b1122ec5871b8915791ca0070108b396";
const newsApiKey = "60993872ddb349b49c4c31e96f0825d9";

// ====== EVENT LISTENER ======
document.getElementById("getWeather").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
    getForecast(city);
  } else {
    alert("Please enter a city name!");
  }
});

// ====== FETCH CURRENT WEATHER ======
async function getWeather(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherApiKey}`;
  const stats = document.getElementById("stats");
  stats.innerHTML = "<p>Loading current weather...</p>";

  try {
    const response = await fetch(weatherURL);
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
    } else {
      stats.innerHTML = `<p>City not found. Please try again.</p>`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    stats.innerHTML = `<p>Failed to load weather data.</p>`;
  }
}

// ====== DISPLAY CURRENT WEATHER ======
function displayWeather(data) {
  const chill = calculateWindChill(data.main.temp, data.wind.speed);

  document.getElementById("stats").innerHTML = `
    <h2>Current Weather in ${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${Math.round(data.main.temp)}°F</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} mph</p>
    <p>${chill ? `Wind Chill: ${chill}°F` : "Wind Chill: N/A"}</p>
  `;
}

// ====== WIND CHILL CALCULATION ======
function calculateWindChill(temp, windSpeed) {
  if (temp <= 50 && windSpeed > 3) {
    const chill =
      35.74 +
      0.6215 * temp -
      35.75 * windSpeed ** 0.16 +
      0.4275 * temp * windSpeed ** 0.16;
    return Math.round(chill);
  } else {
    return null;
  }
}

// ====== FETCH 5-DAY FORECAST ======
async function getForecast(city) {
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${weatherApiKey}`;
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "<p>Loading forecast...</p>";

  try {
    const response = await fetch(forecastURL);
    const data = await response.json();

    if (data.cod === "200") {
      displayForecast(data);
    } else {
      forecastContainer.innerHTML = `<p>Forecast not available.</p>`;
    }
  } catch (error) {
    console.error("Error fetching forecast:", error);
    forecastContainer.innerHTML = `<p>Failed to load forecast.</p>`;
  }
}

// ====== DISPLAY FORECAST ======
function displayForecast(data) {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.innerHTML = "";

  // Filter one forecast per day (midday)
  const daily = data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));

  daily.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    const forecastDay = document.createElement("div");
    forecastDay.classList.add("forecast-day");
    forecastDay.innerHTML = `
      <h4>${dayName}</h4>
      <img src="${icon}" alt="${day.weather[0].description}">
      <p>${Math.round(day.main.temp)}°F</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastContainer.appendChild(forecastDay);
  });
}

// ====== FETCH NEWS ======
async function fetchNews() {
  const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${newsApiKey}`;
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "<p>Loading news...</p>";

  try {
    const response = await fetch(newsUrl);
    const data = await response.json();

    if (data.articles) {
      displayNews(data.articles);
    } else {
      newsContainer.innerHTML = "<p>No news available.</p>";
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

// ====== DISPLAY NEWS ======
function displayNews(articles) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "";

  articles.slice(0, 5).forEach((article) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    newsItem.innerHTML = `
      ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}">` : ""}
      <div>
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      </div>
    `;

    newsContainer.appendChild(newsItem);
  });
}

// ====== FOOTER YEAR ======
const year = new Date().getFullYear();
document.querySelector("#footer p").innerHTML = `&copy; ${year} Weather & News App`;

// ====== INITIAL LOAD ======
getWeather("Tooele");
getForecast("Tooele");
fetchNews();
