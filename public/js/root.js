$(document).ready(function () {


    $('#newRegister').click(function () {
        $(".modal").modal("hide")

        $("#login").toggle();
        // $( '.modal-backdrop' ).remove();

    });

    $('#newLogin').click(function () {
        $(".modal").modal("hide")

        $("#register").toggle();
        // $( '.modal-backdrop' ).remove();

    });

    $('#cfpassword').on('keyup', function () {
        var password = $('#password').val()
        var confirm = $('#cfpassword').val()
        if (confirm.length >= 1) {
            if (confirm != password) {
                $('#pwd').text("Password doesn't match.")
                $('#submit').attr('disabled', 'true');
            } else {
                $('#pwd').text("Password matched")
                $('#submit').removeAttr('disabled');
            }
        } else {
            $('#pwd').text(" ")
            $('#submit').attr('disabled', 'true');
        }
    })

    $("#submit").click(function () {
        if ($('#signupform')[0].checkValidity()) {

            $.ajax({
                type: "post",
                url: "/generateotp",
                data: { email: $("#email").val() },
                success: function (response) {
                    if (response != "user exists") {
                        $("#email").removeClass("is-invalid").addClass("is-valid")
                        $("#myModal").modal("show")
                    }
                    else {
                        $("#email").addClass("is-invalid")
                    }
                    $("#submitwithotp").off("click").click(function () {
                        $.ajax({
                            type: "post",
                            url: "/signup",
                            data: $("#signupform,#otpform").serialize(),
                            success: function (response) {
                                console.log(response)
                                if (response == "false") {
                                    $("#otp").addClass("is-invalid")
                                }
                                else {
                                    $(".modal ,.modal-backdrop").hide()
                                   $("#login").modal("show")
                                }
                            }
                        });
                    })
                }
            });
        }
        else {
            $("#signupform")[0].reportValidity()
        }
    })

});