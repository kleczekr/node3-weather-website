const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=2ff059514eccb85242bff4cb4582ee98&query=${latitude},${longitude}`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to the weather services", undefined);
    } else if (body.error) {
      callback("Unable to find location. Try another search.", undefined);
    } else {
      const current = body.current;
      callback(
        undefined,
        `${current.weather_descriptions[0]}\nIt is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out. The humidity is ${current.humidity}% and cloud cover equals ${current.cloudcover}%.`
      );
    }
  });
};

module.exports = forecast;
