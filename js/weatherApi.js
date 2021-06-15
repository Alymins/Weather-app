var cities = new Array();
var citiesStorage = window.localStorage;

function createCard(data) {
    if ($("#response .container .row:last div.card").length >= 4){
        $("#response .container").append("<div class='row row-sizing'/>");
    };
    const { main, name, sys, weather} = data;
    var timeDay = weather[0].icon[2];

    if (timeDay == "n"){
    timeDay = "night";
     }else {
    timeDay = "day";
    };

    const icon = `wi-owm-${timeDay}-${weather[0].id}`
    
    $(".row:last").append(`<div id="${name.replace(" ", "")}" class='col-md-3 col-sm-6'/>`);
    $(".row:last div.col-sm-6.col-md-3:last").append("<div class='card card-espace'/>");
    $("div.card:last").append("<div class='card-body'/>");
    $("div.card-body:last").append(`<div class="card-title"><button onclick="closeCard('${name}')" class="close">x</button><p class="city-name">${name} <span><sup>${sys.country}</sup></span></p></div>`);
    
    $("div.card-body:last").append(`<div class="card-img temp-icon"><i class="wi ${icon}"></i></div>`);
    $("div.card-body:last").append(`<div class="card-text city-temp">${Math.round(main.temp)}<span><sup>°C</sup></span></div>`);
    
    $("div.card-body:last").append(`<div class="card-text temp-description">${weather[0].description}</div>`);

};

function requestWeatherApi(cityName) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=6fdf265efb2206615819bdbb49de9dbc&units=metric`
    fetch(url).then(
        response => {
            return response.json();
        }).then(
            data => {
                if (data.cod == 200 && data.cod < 400){
                    if (cities.indexOf(data.name) < 0){
                        createCard(data);
                        cities.push(data.name);
                        citiesStorage.setItem("cities",cities)
                    }
                    else{
                        $("#error").text(`You already know the weather for ${data.name}.`);
                    };
                }
                else{
                    $("#error").text("Please search for a valid city.");
                };

            }
        ).catch(
            err =>{
                console.log(err)
            }
        );
};

function closeCard(cityName){
    if (cities.indexOf(cityName) >= 0){
        const idCity = "#" + cityName.replace(" ","");
        $(idCity).remove();
        delete cities[cities.indexOf(cityName)];
        citiesStorage.setItem("cities",cities)
    };
};

$(function () {
    var cityInStorage = citiesStorage.getItem("cities");
    citiesStorage.removeItem("cities");
    
    if (cityInStorage != null){
        cityInStorage.split(",").forEach(function (city) {
            requestWeatherApi(city);
        })
    };

    $("button#send").click(function (e) { 
        e.preventDefault();
        const city = $("#city").val();
        
        // Clear 
        $("#city").val("")
        $("#error").text("");

        requestWeatherApi(city);
    });
});
