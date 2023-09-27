document.getElementById('location-form').addEventListener('submit', getWeather);

function getWeather(e) {
  e.preventDefault();

  const locationInput = document.getElementById('location-input');
  const location = locationInput.value;
  const apiKey = '46f80a02ecae410460d59960ded6e1c6'; 
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      // Check if the response is okay before proceeding
      if(!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('weather-data').innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].main}</p>
        <p>${data.main.temp} °C</p>
      `;

      // Clear the input after successfully fetching the weather data
      locationInput.value = '';
    })
    .catch(error => console.error('Error:', error));
}

