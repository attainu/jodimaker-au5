$(document).ready(function () {
  var prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("nav-bar").style.top = "0";
    } else {
      document.getElementById("nav-bar").style.top = "-60px";
    }
    prevScrollpos = currentScrollPos;
  };

  $(".form-row").addClass("my-3");
  var countriesStatesCities
  $.ajax({
    type: "get",
    url: "../json/countries+states+cities.json",
    dataType: "json",
    success: function (response) {
      countriesStatesCities = response

      countriesStatesCities.forEach(element => {

        $(".countries").append(`<option value="${element.name}">${element.name}</option>`)
      });
    }
  });

  var statesCities
  $(".countries").change(function () {
    var country = $('select[name="country"]').val();

    var states = Object.keys(countriesStatesCities.filter(el => el.name == country)[0].states)
     statesCities = countriesStatesCities.filter(el => el.name == country)[0].states
    console.log(states)
    $("#cityId").empty();
    $("#cityId").append(`<option value="">Select City</option>`);

    $("#stateId").empty();
    $("#stateId").append(`<option value="">Select State</option>`);


    for (let i = 0; i < states.length; i++) {
      $("#stateId").append(
        `<option value="${states[i]}">${states[i]}</option>`
      );
    }
  });

  $(".states").change(function () {
    var state = $('select[name="state"]').val();
    console.log(statesCities)
    var filterCities = statesCities[state]
    console.log(filterCities)
    $("#cityId").empty();
    $("#cityId").append(`<option value="">Select City</option>`);

    for (let i = 0; i < filterCities.length; i++) {
      $("#cityId").append(
        `<option value="${filterCities[i]}">${filterCities[i]}</option>`
      );
    }
  });
})
