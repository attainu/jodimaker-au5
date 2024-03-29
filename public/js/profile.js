$(document).ready(function() {
  $(".disabled").attr("disabled", true);
  $(".edit").click(function() {
    $(this).hide();
    $(".disabled").addClass("shadow p-2  mb-5 bg-white rounded");
    $(this).after(
      "<button type='button' class='btn btn-wine float-right mr-2 cancel'>Cancel</button>&nbsp;<button type='button' data-toggle='modal' data-target='#confirm-update' class=' btn btn-wine float-right mr-4 save'>Save</button>&nbsp;"
    );
    $(".disabled")
      .attr("disabled", false)
      .css("border", "1px solid black");

    $(".cancel").on("click", function() {
      $(".edit").show();
      $(".save,.cancel").hide();
      $(".disabled")
        .attr("disabled", true)
        .css("border", "none");
      $(".disabled").removeClass("shadow");
    });
  });
  $("input").keydown(function(e) {
    if (e.keyCode == 13) e.preventDefault();
    //   return false;
  });
  $(".disabled").addClass("text-capitalize");
  $(".btn-ok").click(function() {
    $("#update").submit();
  });

  $('.slideImg').on({
    click: function(){
      var imgUrl = $(this).attr('src')
      $('#mainimg').attr('src',imgUrl)
    } 
  });

  var prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("nav-bar").style.top = "0";
    } else {
      document.getElementById("nav-bar").style.top = "-60px";
    }
    prevScrollpos = currentScrollPos;
  };
});
