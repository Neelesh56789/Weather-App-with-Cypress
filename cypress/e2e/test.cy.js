describe('Weather App', () => {
  beforeEach(() => {
      cy.visit('index.html'); // Make sure you're serving the app on this address.
  });

  // Basic Load Test
  it('loads the app', () => {
      cy.get('#name').should('not.contain', 'Weaer App');
      cy.get('#location-input').should('be.visible');
      cy.get('#weather-data').should('exist');
  });

  // Form Interaction Tests
  it('should allow typing in the city input', () => {
      cy.get('#location-input').type('New York').should('have.value', 'New York');
  });

  it('should clear the input when form is submitted', () => {
    // Stub the request to the weather API
    cy.intercept('GET', 'http://api.openweathermap.org/data/2.5/weather*', {
        statusCode: 200,
        body: {
            name: 'New York',
            weather: [{ main: 'Clear' }],
            main: { temp: 20.5 }
        }
    }).as('getWeather');

    cy.get('#location-input').type('New York');
    cy.get('#location-form').submit();

    cy.wait('@getWeather');

    cy.get('#location-input').should('have.value', '');
});


  // API Stubbing Test
  it('displays weather data when a city is provided', () => {
    // Stub the request to the weather API
    cy.intercept('GET', 'http://api.openweathermap.org/data/2.5/weather*', {
        statusCode: 200,
        body: {
            name: 'New York',
            weather: [{ main: 'Clear' }],
            main: { temp: 20.5 }
        }
    }).as('getWeather');

    cy.get('#location-input').type('New York');
    cy.get('#location-form').submit();

    cy.wait('@getWeather');

    // Assertions to ensure the weather data is displayed correctly
    cy.get('#weather-data').should('contain.text', 'New York');
    cy.get('#weather-data').should('contain.text', 'Clear');
    cy.get('#weather-data').should('contain.text', '20.5 °C');
});
it('Should not display data for incorrect city name', () => {
    // Type an incorrect city name into the input field
    cy.get('#location-input').type('invalidcityname');
    
    // Submit the form
    cy.get('#location-form').submit();

    // Verify that the weather-data container is empty (no data displayed)
    cy.get('#weather-data').should('not.contain', '°C');
  });
});

describe('Weather App Error Handling', () => {
    beforeEach(() => {
      cy.visit('/');  // Update this with the relative path to your index.html or the hosted URL.
    });
  
    it('should handle errors for non-existing cities', () => {
      cy.get('#location-input').type('nonexistentcity123');
      cy.get('#location-form').submit();
      
      cy.window().then((win) => {
        cy.stub(win.console, 'error').callsFake((error) => {
          expect(error).to.contain('Error:');
        });
      });
    });
  
    it('should display weather data for a valid city', () => {
      cy.get('#location-input').type('London');
      cy.get('#location-form').submit();
  
      cy.get('#weather-data').should('contain', 'London');
    });
  
    it('displays "Error: City not found" for an incorrect city name', () => {
      const invalidCityName = 'Neymar';
      cy.get('#location-input').type(invalidCityName);
      cy.get('#location-form').submit();
  
      // Assert that the error message is displayed
      cy.get('#weather-data').should('contain', 'Error: City not found');
    });

    it('should clear input field after fetching weather data', () => {
      cy.get('#location-input').type('London');
      cy.get('#location-form').submit();
  
      cy.get('#location-input').should('have.value', '');
    });
  
    it('should handle errors when there is no network', () => {
      cy.intercept('GET', '**/weather?q=London*', { forceNetworkError: true });
  
      cy.get('#location-input').type('London');
      cy.get('#location-form').submit();
  
      cy.window().then((win) => {
        cy.stub(win.console, 'error').callsFake((error) => {
          expect(error).to.contain('Error:');
        });
      });
    });
  
    it('should handle errors with an invalid API key', () => {
      // This is just for demonstration. In real-world scenarios, you'd have mechanisms to toggle/stub different API configurations.
      cy.window().its('getWeather').should('exist').then((getWeather) => {
        const modifiedFunction = getWeather.toString().replace('46f80a02ecae410460d59960ded6e1c6', 'invalidAPIKey');
        eval(modifiedFunction);  // Evaluate modified function
      });
  
      cy.get('#location-input').type('London');
      cy.get('#location-form').submit();
  
      cy.window().then((win) => {
        cy.stub(win.console, 'error').callsFake((error) => {
          expect(error).to.contain('Error:');
        });
      });
    });
  });
  