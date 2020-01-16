$(document).ready(function() {
  $(".card")
    .addClass("shadow-lg p-3 mb-5 bg-white rounded ")
    .attr("min-width", "80px");
  $(".avatar").addClass("shadow-sm p-3 mb-5 bg-white rounded");

  $(".connect").click(function() {
    var connectbtn = $(this);
    var data = { id: connectbtn.siblings(".userid").val() };
    console.log(data);
    $.ajax({
      type: "post",
      url: "/sendrequest",
      data: data,
      success: function(response) {
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
  $(function() {
    $("#slider-range").slider({
      range: true,
      min: 16,
      max: 50,
      values: [18, 50],
      slide: function(event, ui) {
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
  $(function() {
    $("#height-range").slider({
      range: true,
      min: 122,
      max: 221,
      values: [122, 140],
      slide: function(event, ui) {
        $("#height").val(ui.values[0] + "cms" + " - " + ui.values[1] + "cms");
      }
    });
    $("#height").val(
      $("#height-range").slider("values", 0) +
        "cms" +
        " - " +
        $("#height-range").slider("values", 1) +
        "cms"
    );
  });
  /* salary slider */
  $(function() {
    $("#salary-range").slider({
      range: true,
      min: 0,
      max: 50,
      values: [1, 10],
      slide: function(event, ui) {
        $("#salary").val(
          ui.values[0] + "lakhs" + " - " + ui.values[1] + "lakhs"
        );
      }
    });
    $("#salary").val(
      $("#salary-range").slider("values", 0) +
        "lakhs" +
        " - " +
        $("#salary-range").slider("values", 1) +
        "lakhs"
    );
  });
});
