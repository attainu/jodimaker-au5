$(document).ready(function () {
  $(".card")
    .addClass("shadow-lg p-3 mb-5 bg-white rounded ")
    .attr("min-width", "80px");
  $(".avatar").addClass("shadow-sm p-3 mb-5 bg-white rounded");

  $(".connect").click(function () {
    var connectbtn = $(this)
    var data ={id:connectbtn.siblings(".userid").val()}
    console.log(data)
    $.ajax({
      type: "post",
      url: "/sendrequest",
      data: data,
        success: function (response) {
          console.log(response)
          connectbtn.off("click").removeClass("bg-wine").addClass("bg-success").text("Sent")
        }
      });
  })

});

