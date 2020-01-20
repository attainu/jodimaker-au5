$(document).ready(function () {
    $(".connect").click(function () {
        var connectbtn = $(this);
        var data = { id: connectbtn.siblings("input").val() };
        console.log(data);
        $.ajax({
            type: "post",
            url: "/sendrequest",
            data: data,
            success: function (response) {
                location.reload()
            }
        });
    });

});