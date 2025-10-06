const apiKey = "b1122ec5871b8915791ca0070108b396";
const city = "tooele"; 

document.getElementById("getWeather").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name!");
  }
});


const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

fetch(weatherURL)
  .then((response) => response.json())
  .then((jsObject) => {
    console.log(jsObject);
    displayWeather(jsObject);
  })
  .catch((error) => console.error("Error fetching weather data:", error));

function displayWeather(jsObject) {
  const stats = document.querySelector("#stats");
  const summary = document.querySelector("#summary");
  const desc = document.querySelector("#current-desc");
  const temp = document.querySelector("#current-temp");
  const humid = document.querySelector("#current-humid");
  const windSpeed = document.querySelector("#current-windSpeed");
  const windChill = document.querySelector("#current-windChill");

  summary.textContent = `Current weather in ${jsObject.name}`;
  desc.textContent = jsObject.weather[0].description;
  temp.textContent = `${Math.round(jsObject.main.temp)}°F`;
  humid.textContent = `Humidity: ${jsObject.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${jsObject.wind.speed} mph`;

  const chill = calculateWindChill(jsObject.main.temp, jsObject.wind.speed);
  windChill.textContent = chill ? `Wind Chill: ${chill}°F` : "Wind Chill: N/A";

  stats.innerHTML = `
    <h2>Current Weather in ${jsObject.name}</h2>
    <p>${jsObject.weather[0].description}</p>
    <p>Temperature: ${Math.round(jsObject.main.temp)}°F</p>
    <p>Humidity: ${jsObject.main.humidity}%</p>
    <p>Wind Speed: ${jsObject.wind.speed} mph</p>
    <p>${chill ? `Wind Chill: ${chill}°F` : "Wind Chill: N/A"}</p>
  `;
}

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

const newsApiKey = "60993872ddb349b49c4c31e96f0825d9";
const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;

async function fetchNews() {
  try {
    const response = await fetch(newsUrl);
    const data = await response.json();
    if (data.articles) {
      displayNews(data.articles);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function displayNews(articles) {
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = ""; //

  articles.slice(0, 5).forEach((article) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");
    newsItem.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    newsContainer.appendChild(newsItem);
  });
}

// Dynamic Footer Year
const year = new Date().getFullYear();
document.querySelector("#footer p").innerHTML = `&copy; ${year} Weather & News App`;

