
$(document).ready(function () {

  $('.form-row').addClass('my-3');
  $.ajax({
    url: "../json/states-cities.json",
    method: "GET",
    dataType: "json",
    success: function (response) {
      var statesAndCities = response
      $('.countries').change(function () {
        var country = $('select[name="country"]').val()
        var states = [...new Set(statesAndCities.map(item => { return item.state }))]

        if (country == 'India') {
          for (let i = 0; i < states.length; i++) {
            $('#stateId').append(`<option value="${states[i]}">${states[i]}</option>`)
          }

        }
        $('.states').change(function () {
          var state = $('select[name="state"]').val()
          var filterCities = statesAndCities.filter(item => {
            return state == item.state
          })
          $('#cityId').empty()
          $('#cityId').append(`<option value="">Select City</option>`);
          for (let i = 0; i < filterCities.length; i++) {
                
            $('#cityId').append(`<option value="${filterCities[i].name}">${filterCities[i].name}</option>`);
          }
        
        })
      })

    },
    error: function (err) {
      console.log('Error', err)
    }
  });
});
