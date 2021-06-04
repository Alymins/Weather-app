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
    
    $(".row:last").append("<div class='col-md-3 col-sm-6'/>");
    $(".row:last div.col-sm-6.col-md-3:last").append("<div class='card card-espace'/>");
    $("div.card:last").append("<div class='card-body'/>");
    $("div.card-body:last").append(`<div class="card-title"><p class="city-name">${name} <span><sup>${sys.country}</sup></span></p></div>`);
    
    $("div.card-body:last").append(`<div class="card-img temp-icon"><i class="wi ${icon}"></i></div>`);
    $("div.card-body:last").append(`<div class="card-text city-temp">${Math.round(main.temp)}<span><sup>°C</sup></span></div>`);
    
    $("div.card-body:last").append(`<div class="card-text temp-description">${weather[0].description}</div>`);

 }
var cities = new Array();

$(function () {
    $("button#send").click(function (e) { 
        e.preventDefault();
        const city = $("#city").val();
        
        // Clear 
        $("#city").val("")
        $("#error").text("");

        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6fdf265efb2206615819bdbb49de9dbc&units=metric`).then(
            response => {
                return response.json();
            }).then(data => {   
                if (data.cod == 200 && data.cod < 400){
                    if (cities.indexOf(data.name) < 0){
                        createCard(data);
                        cities.push(data.name);
                    }
                    else{
                        $("#error").text(`You already know the weather for ${data.name}.`);
                    };
                }
                else{
                    $("#error").text("Please search for a valid city.");
                };

            }).catch(err => {
                console.log(err)
            })
    });
});
