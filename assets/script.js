// Set Global Variables
var citySearchEl = $("#cityToSearch");
var previousCityEl = $("#search");

var previousCitiesSearched = [];
var cityToSearch = "";
var lat = 0;
var lon = 0;

// Get stored cities if they exist in local storage
var storedCities = JSON.parse(localStorage.getItem("cities"));

// Check Storage and re-write current cities list if present. 
if (storedCities !== null) {
    previousCitiesSearched = storedCities;
    $("#currentCityWeather").empty();
    cityToSearch = previousCitiesSearched[0];
    createCityButtons();
    mainWeatherHeader();
} else {
    previousCitiesSearched = [];
};

// function to create 5 individual weather cards based on daily weather response
function createFiveCards(response) {
    $("#fiveDayForecastHeader").empty();
    $("#fiveDayForecastElements").empty();
    var fiveDayForecastHeaderEl = $("<h3>");
    fiveDayForecastHeaderEl.addClass("col-sm-12 fiveDay");
    fiveDayForecastHeaderEl.text("5-Day Forecast:");
    $("#fiveDayForecastHeader").append(fiveDayForecastHeaderEl);
    for (var i = 1; i <= 5; i++) {
        var forecastCard = $("<div>");
        forecastCard.addClass("col-sm-2 forecastCard");
        var cardDate = $("<h3>");
        cardDate.addClass("dayHeader");
        var cardDateVal = new Date(response.daily[i].dt * 1000)
        cardDateVal = cardDateVal.toLocaleDateString();
        cardDate.text(cardDateVal);
        var cardImg = $("<img>");
        cardImg.addClass("cardImg");
        cardImg.attr("src", "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png");
        var cardTemp = $("<div>");
        cardTemp.addClass("dayTemp");
        cardTemp.html("Temp: " + Math.floor(response.daily[i].temp.max) + " &#8457;");
        var cardHum = $("<div>");
        cardHum.addClass("dayHum");
        cardHum.text("Humidity: " + response.daily[i].humidity + "%");
        forecastCard.append(cardDate, cardImg, cardTemp, cardHum);
        $("#fiveDayForecastElements").append(forecastCard);
    };
};

// Creates buttons from previousCitiesSearched variable. 
function createCityButtons() {
    $(".prevCities").empty();
    for (var i = 0; i < previousCitiesSearched.length; i++) {
        var prevCityBtn = $("<button class='btn btn-outline-secondary cityButton pointer' id='" + previousCitiesSearched[i] + "' type='button'>" + previousCitiesSearched[i] + "</button>");
        $(".prevCities").append(prevCityBtn);
    }
};

// function to check uv index value and apply background color to span according to given ranges
function assignUVColor(uvi) {
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

// function to set city value to that of text input and then store that item in both global variable and add to local storage
function citySubmit() {
    if (citySearchEl.val() == "") {
        return;
    } else {
        cityToSearch = citySearchEl.val();
        citySearchEl.val("");
        previousCitiesSearched.unshift(cityToSearch);
        localStorage.setItem("cities", JSON.stringify(previousCitiesSearched));
        $("#currentCityWeather").empty();
        createCityButtons();
        mainWeatherHeader();
    };
};

// Function to submit chosen city to begin building current weather info to be displayed.
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
        // pull latitude and longitude info from city chosen to use in next ajax request
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        secondQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=b2cb9091c77c412d1dede93b0ba6839c"
        submitWithCoord();
    })
};

// Function to submit ajax request with latitude and longitude coordinates of city chosen
function submitWithCoord() {
    $.ajax({
        url: secondQueryUrl,
        method: "Get"
    }).then(function (response) {
        // Begin building remaining current day weather data
        var tempEl = $("<div>");
        tempEl.addClass("card-text");
        tempEl.html("Temperature: " + Math.floor(response.current.temp) + " &#8457;");
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
        createFiveCards(response);
    })
};

// Click Event added to save button on text field
$(".saveBtn").on("click", function (event) {
    event.preventDefault();
    $("#weather").removeClass("d-none");
    citySubmit();
});

// keypress event added to enter key within text input
$(document).keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        $("#weather").removeClass("d-none");
        citySubmit();
    }
});

// Click event added to previously searched buttons
$(document).on("click", function (event) {
    console.log(event.currentTarget.activeElement.classList[2]);
    if (event.currentTarget.activeElement.classList[2] == "cityButton") {
        event.preventDefault();
        cityToSearch = event.currentTarget.activeElement.id;
        previousCitiesSearched.unshift(cityToSearch);
        localStorage.setItem("cities", JSON.stringify(previousCitiesSearched));
        $("#currentCityWeather").empty();
        mainWeatherHeader();
    }
});

// Added click event for clear cities button
$(".clearBtn").on("click", function (event) {
    event.preventDefault();
    $(".prevCities").empty();
    previousCitiesSearched = [];
    localStorage.setItem("cities", JSON.stringify(previousCitiesSearched));
})