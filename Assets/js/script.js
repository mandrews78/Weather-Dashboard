// API Key
var apiKey = "2d6a004b9873e7e195e89bd1de4c9df4";

//Variables
//empty array until given an event
var cityList = [];
var count = 0;

// Displays the Current Weather
var currentWeather = function (city) {
    $('#currentWeather').empty();

    var cityAPI = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;
    // Fetch for City API
    fetch(cityAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data[0].lat;
                var long = data[0].lon;
                $("#currentWeather").addClass("border");
                // City's Name
                var name = $('<h3></h3>').text(data[0].name);
                $('#currentWeather').append(name);

                // Checks Latitude & Longitude API
                var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + apiKey;
                fetch(apiURL).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            // Displays the Date
                            var todaysDate = new Date(data.current.dt * 1000).toLocaleDateString("en-US");
                            $(name).append(" " + todaysDate);
                            // Displays Weather Icons
                            var icon = data.current.weather[0].icon;
                            var image = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                            var weatherIcons = $('<img></img>').attr("src", image);
                            $(name).append(weatherIcons);
                            // Displays the Temperature
                            var temp = $('<p></p>').text("Temp: " + data.current.temp + "°F");
                            $('#currentWeather').append(temp);
                            // Displays the Wind
                            var wind = $('<p></p>').text("Wind: " + data.current.wind_speed + " MPH");
                            $('#currentWeather').append(wind);
                            // Displays the Humidity
                            var humidity = $('<p></p>').text("Humidity: " + data.current.humidity + "%");
                            $('#currentWeather').append(humidity);
                            // Displays the UV Index
                            var uvi = $('<p id="uvIndex"></p>').text("UV Index: " + data.current.uvi);
                            $('#currentWeather').append(uvi);

                            if (data.current.uvi >= 0 && data.current.uvi <= 2) {
                                $("#uvIndex").css("background-color", "green").css("color", "white");
                            } else if (data.current.uvi >= 3 && data.current.uvi <= 5) {
                                $("#uvIndex").css("background-color", "yellow").css("color", "black");
                            } else if (data.current.uvi >= 6 && data.current.uvi <= 7) {
                                $("#uvIndex").css("background-color", "orange").css("color", "white");
                            } else if (data.current.uvi >= 8 && data.current.uvi <= 10) {
                                $("#uvIndex").css("background-color", "red").css("color", "white");
                            } else {
                                $("#uvIndex").css("background-color", "white").css("color", "white");
                            }
                        });
                    }
                }).catch(function (error) {
                    alert("Unable to connect to Open Weather");
                });
            });
        }
    }).catch(function (error) {
        alert("Unable to connect to Open Weather");
    });
    futureWeather(city);
};

var futureWeather = function (city) {
    $('#forecastWeather').empty();
    var cityAPI = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey;

    // Fetch for City API
    fetch(cityAPI).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data[0].lat;
                var long = data[0].lon;
                // Checks Latitude & Longitude API for future forecast
                var forecastWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + apiKey;
                fetch(forecastWeather).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            // Displays 5 Day Forecast
                            for (var i = 1; i < 6; i++) {
                                var col = $('<div class="col-2 card"></div>')
                                $('#forecastWeather').append(col);
                                // Displays the Date
                                var nextDates = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
                                var displayDates = $('<h4></h4>').text(nextDates);
                                col.append(displayDates);
                                // Displays the weather Icons
                                var icon = data.daily[i].weather[0].icon;
                                var image = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
                                var weatherIcons = $('<img></img>').attr("src", image);
                                col.append(weatherIcons);
                                // Displays the Temperature
                                var temperature = $('<p></p>').text("Temp: " + data.daily[i].temp.day + "°F");
                                col.append(temperature);
                                // Displays the Wind
                                var wind = $('<p></p>').text("Wind: " + data.daily[i].wind_speed + "MPH");
                                col.append(wind);
                                // Displays the Humidity
                                var displayHumidity = $('<p></p>').text("Humidity: " + data.daily[i].humidity + "%");
                                col.append(displayHumidity);
                            }
                        });
                    }
                }).catch(function (error) {
                    alert("Unable to connect to Open Weather");
                });
            });
        }
    }).catch(function (error) {
        alert("Unable to connect to Open Weather");
    });
};

// Event Listener
$("#searchButton").on("click", function (event) {
    event.preventDefault();

    var city = $("#cityName").val();
    if (!cityList.includes(city)) {
        cityList.push(city);
        var cities = $('<li class="list-group-item list-group-item-info"></li>').text(city);
        $('#historyList').append(cities);
    }
    localStorage.setItem("City", JSON.stringify(cityList));
    currentWeather(city);
});

// History Search List Event Listener
$("#historyList").on("click", ".list-group-item", function () {
    var city = JSON.parse(localStorage.getItem("City"));
    var searchHistory = $(this).text();
    for (var i = 0; i < city.length; i++) {
        if (city[i] === searchHistory) {
            currentWeather(city[i]);
        }
    }
});