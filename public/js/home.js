$(document).ready(function () {
  $(".fa").on("click", function () { });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageUpload").change(function () {
    readURL(this);
  });

  $(".panel-close").click(function () {
    var data = { index: $(this).index(".panel-close") }
    $.ajax({
      type: "post",
      url: "/deletenotification",
      data: data,
      success: function (response) {
        console.log(response)
      }
    });
  })




});
