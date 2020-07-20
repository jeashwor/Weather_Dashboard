// Set Global Variables
var citySearchEl = $("#cityToSearch");
var previousCityEl = $("#search");

var previousCitiesSearched = [];
var cityToSearch = "";
var lat = 0;
var lon = 0;


var secondQueryUrl = ""

// Get stored cities if they exist in local storage
var storedCities = JSON.parse(localStorage.getItem("cities"));

// Check Storage and re-write current cities list if present. 
if (storedCities !== null) {
    previousCitiesSearched = storedCities;
} else {
    previousCitiesSearched = [];
};

function getDate () {
    var milliseconds = (response.dt * 1000)
}

function submitWithCoord () {
    console.log(secondQueryUrl);
    $.ajax({
        url: secondQueryUrl,
        method: "Get"
    }).then (function (response) {
        console.log(response);
        var tempEl = $("<div>");
        tempEl.addClass("card-text");
        tempEl.html("Temperature: " + Math.floor(response.current.temp) + "&#8457;");
        var humidityEL = $("<div>");
        humidityEL.addClass("card-text");
        humidityEL.html("Humidity: " + response.current.humidity + "%")
        var windEl = $("<div>");
        windEl.addClass("card-text");
        windEl.html("Wind Speed: " + response.current.wind_speed.toFixed(1) + " MPH")
        var uvEl = $("<div>");
        uvEl.addClass("card-text");
        uvEl.attr("id", "UV");
        uvEl.html("UV Index: " + response.current.uvi);
        $(".card-body").append(tempEl, humidityEL, windEl, uvEl);
})
}

function citySubmit() {
    cityToSearch = citySearchEl.val();
    $("#currentCityWeather").empty();
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=b2cb9091c77c412d1dede93b0ba6839c";
    console.log(cityToSearch);
    $.ajax({
        url: queryUrl,
        method: "Get"
    }).then(function (response) {
        console.log(response);
        var cityWeatherBody = $("<div>");
        cityWeatherBody.addClass("card-body");
        var cityName = $("<h3>");
        cityName.addClass("card-title").text(cityToSearch);
        cityWeatherBody.append(cityName);
        $("#currentCityWeather").append(cityWeatherBody);

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        secondQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=b2cb9091c77c412d1dede93b0ba6839c"
        submitWithCoord();


    })
}


$(".saveBtn").on("click", function (event) {
    event.preventDefault();
    citySubmit();
})

$(document).keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        citySubmit();
    }
})



// api.openweathermap.org/data/2.5/weather?q={city name}&appid={b2cb9091c77c412d1dede93b0ba6839c}