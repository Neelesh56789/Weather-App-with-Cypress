document.getElementById('location-form').addEventListener('submit', getWeather);

function getWeather(e) {
  e.preventDefault();

  const locationInput = document.getElementById('location-input');
  const location = locationInput.value.trim(); // Trim leading/trailing whitespace
  const apiKey = '46f80a02ecae410460d59960ded6e1c6'; 
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  // Clear previous weather data and any previous error messages
  document.getElementById('weather-data').innerHTML = '';

  if (!location) {
    // Display an alert if the location input is empty
    alert("Please enter a city name.");
    return; // Exit the function
  }

  fetch(url)
    .then(response => {
      if (response.status === 404) {
        
        throw new Error('City not found'); // Throw an error to skip parsing JSON
      }

      // Check if the response is okay before proceeding with JSON parsing
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      return response.json();
    })
    .then(data => {
      // Display weather data
      document.getElementById('weather-data').innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.weather[0].main}</p>
        <p>${data.main.temp} °C</p>
      `;

      // Clear the input after successfully fetching the weather data
      locationInput.value = '';
    })
    .catch(error => {
      // Display an error message
      document.getElementById('weather-data').innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
