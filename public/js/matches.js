$(document).ready(function () {
  $(".card")
    .addClass("shadow-lg p-3 mb-5 bg-white rounded ")
    .attr("min-width", "80px");
  $(".avatar").addClass("shadow-sm p-3 mb-5 bg-white rounded");

  $(".connect").click(function () {
    var connectbtn = $(this);
    var data = { id: connectbtn.siblings(".userid").val() };
    console.log(data);
    $.ajax({
      type: "post",
      url: "/sendrequest",
      data: data,
      success: function (response) {
        console.log(response);
        connectbtn
          .off("click")
          .removeClass("bg-wine")
          .addClass("bg-success")
          .text("Sent");
      }
    });
  });

  //Slider
  /* age slider */
  var minage =$("#age").val().split("-")[0]
  var maxage =$("#age").val().split("-")[1]
  $(function () {
    $("#slider-range").slider({
      range: true,
      min: 18,
      max: 50,
      values: [minage, maxage],
      slide: function (event, ui) {
        $("#age").val(ui.values[0] + " - " + ui.values[1]);
      }
    });
    $("#age").val(
      $("#slider-range").slider("values", 0) +
      " - " +
      $("#slider-range").slider("values", 1)
    );
  });
  /* height slider */
  $(function () {
    $("#height-range").slider({
      range: true,
      min: 122,
      max: 221,
      values: [130, 200],
      slide: function (event, ui) {
        $("#height").val(toFeet(ui.values[0]) + " - " + toFeet(ui.values[1]));
      }
    });
    $("#height").val(
      toFeet($("#height-range").slider("values", 0)) +
      " - " +
      toFeet($("#height-range").slider("values", 1))
    );
  });
  /* salary slider */

  $(function () {
    $("#salary-range").slider({
      range: true,
      min: 0,
      max: 50,
      values: [4, 40],
      slide: function (event, ui) {
        $("#salary").val(
          ui.values[0] +
          " lakhs" + " - " + ui.values[1] +
          " lakhs"
        );
      }
    });
    $("#salary").val(
      $("#salary-range").slider("values", 0) +
      " lakhs" +
      " - " +
      $("#salary-range").slider("values", 1) +
      " lakhs"
    );
  });

  var radioState;

  $('#customRadioInline1').on('click', function () {
    if (radioState === this) {
      this.checked = false;
      radioState = null;
    } else {
      radioState = this;
    }
  });
  function toFeet(n) {
    var realFeet = ((n * 0.393700) / 12);
    var feet = Math.floor(realFeet);
    var inches = Math.round((realFeet - feet) * 12);
    return feet + "'" + inches + "ft"
  }

});
