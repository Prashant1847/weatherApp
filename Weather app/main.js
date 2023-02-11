const min_temp = document.querySelector('.min-temp'),
 max_temp = document.querySelector('.max-temp'),
 temperature = document.querySelector('.temp'),
 weather_img = document.querySelector('.weather-img'),
 temp_description = document.querySelector('.temp-description'),
 location_name = document.querySelector('.location'),
 humidity = document.querySelector('.humidity-value'),
 wind = document.querySelector('.wind-value'),
 date_div = document.querySelector('.date'),
 time_div = document.querySelector('.time'),
 bg_img_body = document.querySelector('.bg-img'),
 loading_screen = document.querySelector('.loading-screen');

 const city_input_textBox = document.querySelector('.select-city-txtBox'),
search_icon = document.querySelector('.search-icon');

const apiKey = "apiKey";
let weatherObj = {};

search_icon.addEventListener('click', ()=>{
    if(city_input_textBox.value == "") alert('Please enter a city');
    else requestWeatherApi(city_input_textBox.value);
    city_input_textBox.value = null;
})

city_input_textBox.addEventListener('keydown', (event)=>{
    if(event.key.toLowerCase() == "enter"){
        if(city_input_textBox.value != "") {
            requestWeatherApi(city_input_textBox.value);
            city_input_textBox.value  = null;
        } 
        else alert('Please enter a city');   
    }
})

function showOrHideLoadingScreen(){
    if(loading_screen.classList.contains('showLoadingScreen')) loading_screen.classList.replace('showLoadingScreen', 'hideLoadingScreen');
     else loading_screen.classList.replace('hideLoadingScreen', 'showLoadingScreen');
}

function requestWeatherApi(city){
    showOrHideLoadingScreen();
    let geoCodingApi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    fetch(geoCodingApi)
    .then(response => {
        response.json().then(result => {
            if(result.length == 0) throw "Unable to get weather details" ;
            const {lon, lat} = result[0];
            requestWeatherObj(lon, lat); //getting object on successful fetching of geocodingApi
        })
        .catch(reason => {
            alert(reason)
            showOrHideLoadingScreen();
         });
    })
    .catch(reason => {
        alert(reason)
        showOrHideLoadingScreen(); //closing loading screen on error
    });
}

function requestWeatherObj(longitude, latitude){
    let currentWeatherApi = 
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`

    fetch(currentWeatherApi)
    .then(response => {
        response.json()
        .then(weatherDetailsObj => { 
            weatherObj = weatherDetailsObj
            changeInterface(); //chanding the displayed values
        }).catch((reason)=>{
            console.log(reason);
            showOrHideLoadingScreen();
        })
    }).catch((reason)=>{
        console.log(reason);
        showOrHideLoadingScreen(); //
    })
    showOrHideLoadingScreen(); //closing the loading screen
}

function changeInterface(){
    changeDateAndTime();
    changeTemperatureValue(weatherObj);
    changeWeatherIconAndBodyBg(weatherObj);
    location_name.textContent = weatherObj.name;
    temp_description.textContent = weatherObj.weather[0].description;
    humidity.textContent = weatherObj.main.humidity+"%";
    wind.textContent = weatherObj.wind.speed;
}

function changeWeatherIconAndBodyBg(weatherObj){
    const id = weatherObj.weather[0].id;  //weather id for image change 
    if(id == 800){
        weather_img.src = "images/clearSky.png";
        changebgImage('images/backgroundImages/clear-sky-bg.jpg');

    } else if(id >=801 && id <= 804 ){
        changebgImage('images/backgroundImages/scattered-clouds.jpg')
        weather_img.src = "images/scattered-clouds.png";

    } else if(id >=300 && id <= 321){
        weather_img.src = "images/shower.png";
        changebgImage('images/backgroundImages/shower-rain-bg.jpg')

    } else if(id >=500 && id <= 531){
        weather_img.src = "images/rain.png";
        changebgImage('images/backgroundImages/rain-bg.jpg')

    } else if(id >=200 && id <= 232){
        weather_img.src = "images/thunderStrom.png";
        changebgImage('images/backgroundImages/thunder-strom.jpg');

    } else if(id >=600 && id <= 622){
        weather_img.src = "images/snow.png";
        changebgImage('images/backgroundImages/snow.jpg');

    } else if(id == 701|| id == 721 || id == 741){
        weather_img.src = "images/haze.png";
        changebgImage('images/backgroundImages/mist.jpg');
    }
}

function changebgImage(source){ //this also play and remove animation while changing the source
    bg_img_body.classList.remove('bg-animation');
    bg_img_body.offsetWidth;
    bg_img_body.classList.add('bg-animation');
    bg_img_body.src = source;
}

function changeTemperatureValue(weatherObj){
    const tempObj = weatherObj.main;
    temperature.textContent = tempObj.temp+"°C";
    min_temp.textContent = tempObj.temp_min+"°C";
    max_temp.textContent = tempObj.temp_max+"°C";
}

function changeDateAndTime(){
    const dateObj = new Date();
    date_div.textContent = dateObj.toLocaleDateString();
    time_div.textContent = dateObj.toLocaleTimeString();
}
