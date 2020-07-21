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

function createFiveCards() {

};

function createCityButtons() {
    $(".prevCities").empty();
    for (var i = 0; i < previousCitiesSearched.length; i++) {
        var prevCityBtn = $("<button class='btn btn-outline-secondary cityButton' id='" + previousCitiesSearched[i] + "' type='button'>" + previousCitiesSearched[i] + "</button>");
        $(".prevCities").append(prevCityBtn);
    }
};

function assignUVColor (uvi) {
    if (uvi < 3) {
        document.getElementById("uvi").style.backgroundColor = "green";
    } else if (uvi < 6 && uvi >= 3) {
        document.getElementById("uvi").style.backgroundColor = "yellow";
    } else if (uvi < 8 && uvi >= 6) {
        document.getElementById("uvi").style.backgroundColor = "orange";
    } else if (uvi < 11 && uvi >= 8) {
        document.getElementById("uvi").style.backgroundColor = "red";
    } else {
        document.getElementById("uvi").style.backgroundColor = "magenta";
    }
};

function submitWithCoord() {
    $.ajax({
        url: secondQueryUrl,
        method: "Get"
    }).then(function (response) {
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
        uvEl.html("UV Index: <span id='uvi'>" + response.current.uvi + "</span>");
        $(".card-body").append(tempEl, humidityEL, windEl, uvEl);
        assignUVColor(response.current.uvi);
    })
};

function mainWeatherHeader() {
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=b2cb9091c77c412d1dede93b0ba6839c";
    $.ajax({
        url: queryUrl,
        method: "Get"
    }).then(function (response) {
        console.log(response);
        var cityWeatherBody = $("<div>");
        cityWeatherBody.addClass("card-body");
        var date = new Date(response.dt * 1000)
        date = date.toLocaleDateString();
        var cityName = $("<h3>");
        cityName.addClass("card-title");
        cityName.html(cityToSearch + " (" + date + ") " + "<img src=http://openweathermap.org/img/w/" + response.weather[0].icon + ".png></img>");
        cityWeatherBody.append(cityName);
        $("#currentCityWeather").append(cityWeatherBody);
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        secondQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=b2cb9091c77c412d1dede93b0ba6839c"
        submitWithCoord();
    })
};

function citySubmit() {
    cityToSearch = citySearchEl.val();
    previousCitiesSearched.push(cityToSearch);
    localStorage.setItem("cities", JSON.stringify(previousCitiesSearched));
    $("#currentCityWeather").empty();
    createCityButtons();
    mainWeatherHeader();
};


$(".saveBtn").on("click", function (event) {
    event.preventDefault();
    citySubmit();
});

$(document).keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        citySubmit();
    }
});

$(document).on("click", function (event) {
    console.log(event);
    console.log(event.currentTarget.activeElement.classList[2]);
    if (event.currentTarget.activeElement.classList[2] == "cityButton") {
        event.preventDefault();
        console.log(event.currentTarget.activeElement.id);
        cityToSearch = event.currentTarget.activeElement.id;
        console.log(cityToSearch);
        $("#currentCityWeather").empty();
        mainWeatherHeader();
    }
});



