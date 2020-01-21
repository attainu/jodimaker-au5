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

    $('.slideImg').on({
        click: function(){
          var imgUrl = $(this).attr('src')
          $('#imagePreview').css('background-image',"url("+imgUrl+")")
        } 
      });

});