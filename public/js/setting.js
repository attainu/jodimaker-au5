


// $("#myTab").hide();
// $("#form").hide();

// $("#setting").on('click', function () {
//     $("#myTab").toggle();
//     $("#home-tab").on('click', function () {
//         $("#form").show();
//     });
// });
$("#save6,#cancel6").hide();

$("#hi").on('click', function () {
  $("#hi").hide();
  $("#save6,#cancel6").show();

  $("#hide-profile").html('<p>Hide my profile for</p><input type="number" name="textbox" "id="textbox" value="" style="width:50px;" >days <p class="text-muted ">Note: When you hide your profile, you will not be visible to any member of JodiMaker.com. You will not be able to send Invitations or Send Messages or chat.</p>');
  $("#cancel6").on('click', function () {
    $("#hi").show();
    $("#save6,#cancel6").hide();
    $("#hide-profile").html('<p>Your profile is currently Visible </p>')
  })

})


$("#save,#cancel").hide();
function displayname() {
  closeOthers()
  $("#edit,#display-name p").hide();
  $("#save,#cancel,#display-name input").show();
  $("#cancel").on('click', function () {
    $("#edit,#display-name p").show();
    $("#save,#cancel,#display-name input").hide();
  })

  $("#save").click(function () { ajax("/setting3", '#cancel') });

}
$("#save1,#cancel1").hide();
function displayphone() {
  closeOthers()
  $("#edit1,#display-phone p").hide();
  $("#save1,#cancel1,#display-phone .radio").show();
  $("#cancel1").on('click', function () {
    $("#edit1,#display-phone p").show();
    $("#save1,#cancel1,#display-phone .radio").hide();

  })
  $("#save1").click(function () { ajax("/setting3", '#cancel1') })
}
$("#save2,#cancel2").hide();
function displayemail() {
  closeOthers()
  $("#edit2,#display-email p").hide();
  $("#save2,#cancel2,#display-email .radio").show();
  $("#cancel2").on('click', function () {
    $("#edit2,#display-email p").show();
    $("#save2,#cancel2,#display-email .radio").hide();
  })
  $("#save2").click(function () { ajax("/setting3", '#cancel2') });
}
$("#save3,#cancel3").hide();
function displayshowdob() {
  closeOthers()
  $("#edit3,#display-showdob p").hide();
  $("#save3,#cancel3,#display-showdob .radio").show();
  $("#cancel3").on('click', function () {
    $("#edit3,#display-showdob p").show();
    $("#save3,#cancel3,#display-showdob .radio").hide();
  })
  $("#save3").click(function () { ajax("/setting3", '#cancel3') });
}

$("#save4,#cancel4").hide();
function displayshowsalary() {
  closeOthers()
  $("#edit4,#display-showsalary p").hide();
  $("#save4,#cancel4,#display-showsalary .radio").show();
  $("#cancel4").on('click', function () {
    $("#edit4, #display-showsalary p").show();
    $("#save4,#cancel4,#display-showsalary .radio").hide();
  })
  $("#save4").click(function () { ajax("/setting3", '#cancel4') });
}
$("#save5,#cancel5").hide();
function showsubscribe() {
  closeOthers()
  $("#edit5,#subscribe p").hide();
  $("#save5,#cancel5,#subscribe .radio").show();
  $("#cancel5").on('click', function () {
    $("#edit5,#subscribe p").show();
    $("#save5,#cancel5,#subscribe .radio").hide();
  })
  $("#save5").click(function () { ajax("/setting3", '#cancel5') });
}

function ajax2(url) {
  $.ajax({
    url: url,
    method: "POST",
    data: $("#set2").serialize(),
    success: function (response) {
      if (response.emailsubscribe) {
        $("[name='emailsubscribe']").eq(parseInt(response.emailsubscribe)).prop("checked", true);
      }
    }
  })
}
function ajax(url, cancel) {

  $.ajax({
    url: url,
    method: "POST",
    data: $("#set3").serialize(),
    success: function (response) {
      console.log(response)
      if (response.showname) {
        $("#display-name p").text(response.showname)
        $("#display-name input").val(response.showname)
      }
      if (response.showemail) {

        $("[name='showemail']").eq(parseInt(response.showemail)).prop("checked", true);
        $("#display-email p").text($("#display-email .radio").eq(response.showemail).text())

      }
      if (response.showphone) {
        $("[name='showphone']").eq(parseInt(response.showphone)).prop("checked", true);
        $("#display-phone p").text($("#display-phone .radio").eq(response.showphone).text())
      }
      if (response.showsalary) {
        $("[name='showsalary']").eq(parseInt(response.showsalary)).prop("checked", true);
        $("#display-showsalary p").text($("#display-showsalary .radio").eq(response.showsalary).text())
      }
      if (response.showdob) {
        $("[name='showdob']").eq(parseInt(response.showdob)).prop("checked", true);
        $("#display-showdob p").text($("#display-showdob .radio").eq(response.showdob).text())
      }
      if (response.subscribe) {
        $("[name='subscribe']").eq(parseInt(response.subscribe)).prop("checked", true);
        $("#subscribe p").text($("#subscribe .radio").eq(response.subscribe).text())
      }

      $(cancel).click();


    }
  })
}
function closeOthers() {
  for (var i = 0; i < 6; i++) {
    if (!i) {
      $("#cancel").click()

    } else {

      $("#cancel" + i).click()
    }
  }
}

$("body").on('click', '.del', function () {
  $("#confirm-delete").show();

  $(".btn-ok").on('click', function () {
    $.ajax({
      type: "delete",
      url: "/delete",
      data: "data",
      success: function (response) {
        if (response == "deleted")
          window.location.href = "/logout"
      }
    })

  })
})







