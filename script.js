const getForecast = document.querySelector("#get-forecast");
const info_display = document.getElementById("get-information"); 
const image = document.getElementById("weather-icon");
const update_city =document.getElementById("weather-main") ;
const humidity =   document.getElementById("humidity");
const wind_speed = document.getElementById("wind");
const wind_gust =  document.getElementById("wind-gust");
const pressure =   document.getElementById("pressure");
const feels_like = document.getElementById("feels-like");
const temperature = document.getElementById("main-temperature");
let debounceTimeout;
const selectCity = document.querySelector("#drop");
const ul = document.querySelector("#suggestionList");

selectCity.addEventListener("input", filterContent)

async function getData(query){
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`)
    if(!response.ok){
      console.log("res not okay!");
    }
    const data = await response.json();
    return data;
  }
  catch(err){
    alert("error in fetching suggestion data");
  }
}

function filterContent() {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const query = selectCity.value.trim();
    if (query==="") {
      ul.innerHTML="";
    }
      const data = await getData(query);
      ul.innerHTML="";

      data.list.forEach((element) => {
        let lat = element.coord.lat;
        let long = element.coord.lon;
        let country = element.sys.country;
        let countryName = element.name;
        const li = document.createElement("li");
        li.className = "suggestion-inside";
        li.textContent = `${countryName} , ${country}`;
        ul.appendChild(li);

        li.addEventListener("click",()=>{
          selectCity.value = li.textContent;
          ul.innerHTML="";
          getForecast.addEventListener("click",()=>{
            showWeather(selectCity.value);
          });
        })
      });
  }, 500);
}


async function showWeather(city){
  try{
    const data = await getWeather(city);

    update_city.innerText = city;
    image.setAttribute("src",`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    temperature.innerText  = (data?.main?.temp === undefined || data?.main?.temp === null) ? "N/A" : `${data.main.temp}°C`;

    feels_like.innerText   = (data?.main?.feels_like === undefined ) ? "N/A" : `Feels like:   ${data.main.feels_like}°C`;
    humidity.innerText     = (data?.main?.humidity === undefined ) ? "N/A" : `${data.main.humidity}%`;
    wind_speed.innerText   = (data?.wind?.speed === undefined ) ? "N/A" : `${data.wind.speed} km/h`;
    wind_gust.innerText    = (data?.wind?.gust === undefined ) ? "N/A" : `${data.wind.gust} km/h`;
    pressure.innerText     = (data?.main?.pressure === undefined ) ? "N/A" : `${data.main.pressure} hPa`;

  }
  catch(err){
    console.log("Error in showWeather function");
  }
}

async function getWeather(city){

  try{
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

  if(!response.ok){
    throw new Error("response not okay!");
  }
  const data = await response.json();
  return data;

  }
  catch(err){
    alert("Oops! Please enter a valid city or country name.");
    console.log(err);
  }
}

// getWeather("ahmedabad")










