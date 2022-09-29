//API key
var API_KEY = '2d6a004b9873e7e195e89bd1de4c9df4';

//Variables
//empty array until given an event
var cityList = [];
var count = 0;

var currentWeather = function (city) {
    console.log('city')
    $('#currentWeather').empty();

    var cityAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`

    fetch(cityAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                $('#currentWeather').addClass("border");

                //City Name
                var name = $('<h3></h3>').text(data[0].name);
                $('#currentWeather').append(name);

                //Checks Latitude and Longitude API
                var apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,&units=metric&appid=${API_KEY}`

                fetch(apiURL).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {

                            var date = new Date(data.current.dt * 1000).toLocaleDateString("en-US");
                            $(name).append(" " + date);
                        })
                    }
                })
            })
        }
    })
}
$("#searchButton").on("click", function (event) {
    event.preventDefault();

    var city = $('#cityName').val();
    if (!cityList.includes(city)) {
        cityList.push(city);
        var cities = $('<li class="list-group-item list-group-item-info"></li>').text(city);
        $('#searchHistory').append(cities);

    }
    localStorage.setItem("City".JSON.stringify(cityList));
    currentWeather(city);
})