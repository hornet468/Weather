const button = document.getElementById("btn");
const text = document.getElementById("text");
const wind = document.getElementById("wind");
const temp = document.getElementById("temp");
const input = document.getElementById("input");

const APIkey = "b401ee9b6d10b67dc53fcf82d6e0d7cc";

button.addEventListener("click", async (event) => {
  event.preventDefault();
  const city = input.value.trim();
  if (!city) {
    text.textContent = "введіть правильне місто";
  }
  button.disabled = true;
  await getCoordinates(city);
  button.disabled = false;
});

async function getCoordinates(city) {
  try {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`;
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error("Response error");
    }
    const data = await response.json();
    const { lat, lon } = data[0];
    await getWeather(lat, lon, city);
  } catch (error) {
    console.log(`Error ${error}`);
  }
}

async function getWeather(lat, lon, city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${APIkey}`
    );
    if (!response.ok) {
      throw new Error("Error response");
    }
    const data = await response.json();
    if (!data.weather || !data.wind || !data.main) {
      throw new Error("Data error");
    }
    updateDom(data, city);
  } catch (error) {
    console.log(`Error ${error}`);
  }
}

function updateDom(data, city) {
  const weatherDescription = data.weather[0].description;
  const windDescription = data.wind.speed;
  const temperature = data.main.temp;

  text.textContent = `Weather ${weatherDescription} in ${city}`;
  wind.textContent = `Wind ${windDescription}`;
  temp.textContent = `Temperature ${temperature} C`;
}
