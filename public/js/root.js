$(document).ready(function () {

  $("#newRegister").click(function () {
    $(".modal").modal("hide");

    $("#login").toggle();
  });

  $("#newLogin").click(function () {
    $(".modal").modal("hide");
    $("#register").toggle();
  });
  $(".modal").on("hidden.bs.modal", function () {
    if (!$("#myModal").hasClass("show")) {
      $("input").val("");
      $("form").removeClass("was-validated");
      $("#emailsignupfeed").text("");
      $("input").removeClass("is-valid is-invalid");
      $(".error-msg").addClass("d-none")
    
    }
  });

  $("#password").keyup(function () {
    $("#cfpassword").attr("pattern", $("#password").val());
  });
  $("#cfpassword").on("keyup", function () {
    var password = $("#password").val();
    var confirm = $("#cfpassword").val();

    if (confirm.length >= 1) {
      if (confirm != password) {
        $("#submit").attr("disabled", "true");
        $("#cfpassword")
          .removeClass("is-valid")
          .addClass("is-invalid");
      } else {
        $("#submit").removeAttr("disabled");
        $("#cfpassword").removeClass("is-invalid");
      }
    } else {
      $("#submit").attr("disabled", "true");
    }
  });

  $("#submit")
    .off("click")
    .click(function () {
      if ($("#signupform")[0].checkValidity()) {

        $.ajax({
          type: "post",
          url: "/generateotp",
          data: { email: $("#email").val() },
          success: function (response) {
            if (response != "user exists") {
              $("#email")
                .removeClass("is-invalid")
                .addClass("is-valid");
              $(".modal").modal("hide");
              $("#myModal").modal("show");
            } else {
              $("#emailsignupfeed").text("Already registered");
            }
            $("#submitwithotp")
              .off("click")
              .click(function () {
                $.ajax({
                  type: "post",
                  url: "/signup",
                  data: $("#signupform,#otpform").serialize(),
                  success: function (response) {
                    console.log(response);
                    if (response == "false") {
                      $("#otp").addClass("is-invalid");
                    } else {
                      $(".modal ,.modal-backdrop").hide();
                      $("#login").modal("show");
                      $(".toast:first").toast("show")
                    }
                  }
                });
              });
          }
        });
      } else {
        $("#signupform").addClass("was-validated");
      }
    });
  $(".close").click(function () {
    $("#register").modal("show");
  });

  $("#resendotp").click(function () {
    $.ajax({
      type: "post",
      url: "/generateotp",
      data: { email: $("#email").val() },
      success: function (response) { }
    });
  });
  $("#loginbtn").click(function () {
    if ($(".needs-validation:last")[0].checkValidity()) {
      $(".needs-validation:last").submit();
    } else {
      $(".needs-validation:last").addClass("was-validated");
    }
  });

  $("#passwordshow").click(showHidePassword)

  function showHidePassword() {
    var x = document.getElementById("passwordlogin");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    $("#passwordshow").toggleClass("fa-eye-slash fa-eye")
  }


});
