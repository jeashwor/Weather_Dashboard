// Set Global Variables
var citySearchEl = $("#cityToSearch");
var previousCityEl = $("#search");

var previousCitiesSearched = [];
var cityToSearch = "";
var lat = 0;
var lon = 0;

// var queryUrl = "api.openweathermap.org/data/2.5/weather?q={" + cityToSearch + "}&appid={b2cb9091c77c412d1dede93b0ba6839c}";
var secondQueryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat={" + lat + "}&lon={" + lon + "}&exclude={part}&appid={b2cb9091c77c412d1dede93b0ba6839c}"

// Get stored cities if they exist in local storage
var storedCities = JSON.parse(localStorage.getItem("cities"));

// Check Storage and re-write current cities list if present. 
if (storedCities !== null) {
    previousCitiesSearched = storedCities;
} else {
    previousCitiesSearched = [];
};



function citySubmit() {
    cityToSearch = citySearchEl.val();
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=b2cb9091c77c412d1dede93b0ba6839c";
    console.log(cityToSearch);
    console.log(queryUrl)
    $.ajax({
        url: queryUrl,
        method: "Get"
    }).then(function (response) {
        console.log(response);

    })
}


$(".saveBtn").on("click", function (event) {
    event.preventDefault();
    citySubmit();
})

$(document).keypress(function (event) {
    if(event.keyCode == 13){
        event.preventDefault();
        citySubmit();
       }
})



// api.openweathermap.org/data/2.5/weather?q={city name}&appid={b2cb9091c77c412d1dede93b0ba6839c}