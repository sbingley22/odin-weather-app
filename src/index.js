const elm = {
  inputLocation: document.querySelector("#location"),
  submitButton: document.querySelector("#submit-button"),
  toggleButton: document.querySelector("#deg-cel-button"),
  wLocation: document.querySelector("#w-location"),
  wCloud: document.querySelector("#w-cloud"),
  wTempLabel: document.querySelector("#w-temp-label"),
  wTemp: document.querySelector("#w-temp"),
  wFeelsLabel: document.querySelector("#w-feels-like-label"),
  wFeels: document.querySelector("#w-feels-like"),
  wWind: document.querySelector("#w-wind"),
  wHumidity: document.querySelector("#w-humidity"),
  timeTaken: document.querySelector("#time-taken"),
};
let degrees = "c";

elm.toggleButton.addEventListener("click", () => {
  if (degrees == "c") degrees = "f";
  else degrees = "c";
  updateDegrees();
});

elm.submitButton.addEventListener("click", getWeatherData);

function displayTimeTaken(t1, t2) {
  const time = t2.getTime() - t1.getTime();
  elm.timeTaken.textContent = "Time taken to get date: " + time + "ms";
}

async function getWeatherData(e) {
  e.preventDefault();
  const location = elm.inputLocation.value;
  try {
    const startTime = new Date();

    const apiData = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=0cf9d4e479044f7a871142421232710&q=${location}`,
      { mode: "cors" }
    );

    const jsonData = await apiData.json();

    const endTime = new Date();
    displayTimeTaken(startTime, endTime);

    sortWeatherData(jsonData);
  } catch (err) {
    console.log(err);
  }
}

function sortWeatherData(data) {
  const country = data.location.country;
  const region = data.location.region;
  const cloud = data.current.condition.text;
  const feelslike_c = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const temp_c = data.current.temp_c;
  const wind_mph = data.current.wind_mph;

  elm.wLocation.textContent = country + ", " + region;
  elm.wCloud.textContent = cloud;
  elm.wTempLabel.textContent = "Temperature: ";
  elm.wTemp.textContent = temp_c + "c";
  elm.wFeelsLabel.textContent = "feels like ";
  elm.wFeels.textContent = feelslike_c + "c";
  elm.wHumidity.textContent = "Humidity: " + humidity;
  elm.wWind.textContent = "Wind: " + wind_mph + " mph";

  updateDegrees();
}

function updateDegrees() {
  const currentD = elm.wTemp.textContent.charAt(
    elm.wTemp.textContent.length - 1
  );

  if (currentD == degrees) return;

  const tempStr = elm.wTemp.textContent.slice(0, -1).trim();
  const tempNum = parseFloat(tempStr);
  const temp = convertToF(degrees, tempNum).toFixed(1);
  elm.wTempLabel.textContent = "Temperature: ";
  elm.wTemp.textContent = temp + degrees;

  const feelsStr = elm.wFeels.textContent.slice(0, -1).trim();
  const feelsNum = parseFloat(feelsStr);
  const feels = convertToF(degrees, feelsNum).toFixed(1);
  elm.wFeelsLabel.textContent = "feels like: ";
  elm.wFeels.textContent = feels + degrees;
}

function convertToF(degrees, tempNum) {
  let temp = tempNum;
  if (degrees == "f") {
    temp = (temp * 9) / 5 + 32;
  } else {
    temp = ((temp - 32) * 5) / 9;
  }
  return temp;
}
