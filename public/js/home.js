const socket = io()
socket.on("message", data => {
  console.log("hello")
  if ($(".chatwindow").attr("id")) {
    loadchat()
  }
  else console.log("not here")
})

$(document).ready(function () {

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      console.log(reader)
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
  $("#imageUpload").change(function (e) {
    readURL(this);
    var formData = new FormData();
    formData.append('imageFile', $('#imageUpload')[0].files[0]);

    $.ajax({
      type: "patch",
      url: "/changeprofilepic",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response)
      }
    });
  });

  $(".panel-close").click(function () {
    var data = { index: $(this).index(".panel-close") }
    $.ajax({
      type: "post",
      url: "/deletenotification",
      data: data,
      success: function (response) {
        console.log(response)
        $("#notifs").text(response)
      }
    });
  })

  $(".deletesent").click(function () {
    var deletebtn = $(this)
    var data = { id: deletebtn.siblings("input").val() }
    $.ajax({
      type: "post",
      url: "/deletesent",
      data: data,
      success: function (response) {
        console.log(deletebtn.parents(".no-gutters").remove())
        $("#sentreqs").text(response)
      }
    });

  })

  $(".deletereceived").click(function () {
    var deletebtn = $(this)
    var data = { id: deletebtn.siblings("input").val() }
    $.ajax({
      type: "post",
      url: "/deletereceived",
      data: data,
      success: function (response) {
        console.log(deletebtn.parents(".no-gutters").remove())
        $("#received").text(response)
      }
    });


  })

  $(".acceptreq").click(function () {
    console.log("clicked")
    var acceptbtn = $(this)
    var data = { id: acceptbtn.siblings("input").val() }
    console.log("data")

    $.ajax({
      type: "post",
      url: "/acceptrequest",
      data: data,
      success: function (response) {
        console.log(response)
        acceptbtn.parents(".no-gutters").remove()
        $("#received").text(response.receivedrequests)
        $("#accepted").text(response.acceptedrequests)
        $("#acceptedReqs").append(` <div class="row no-gutters align-items-center">
        <div class="col-md-2">
            <img src="${response.acceptedmatch.Profile.Profile1.photo}"
                class="card-img-top matches-photo rounded-circle p-3" alt="Profile Page">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h6 class="card-title">${response.acceptedmatch.Profile.Profile1.name.firstname}
                    ${response.acceptedmatch.Profile.Profile1.name.lastname}</h6>
                <p class="card-text">${response.acceptedmatch.Profile.Profile2.age},
                    ${response.acceptedmatch.Profile.Profile2.height},${response.acceptedmatch.Profile.Profile2.mothertongue},
                    ${response.acceptedmatch.Profile.Profile1.location.city}
                </p>
                <p class="card-text">
                    <small class="text-muted">Last online 3 mins ago</small>
                </p>
            </div>
        </div>
        <div class="col-md-2">
            <a class="btn btn-outline-secondary">Message</a>
        </div>

    </div>`)
      }
    });

  });
  $(".fa-check").click(function () {
    var connectbtn = $(this);
    var data = { id: connectbtn.siblings("input").val() };
    console.log("clicked")
    $.ajax({
      type: "post",
      url: "/sendrequest",
      data: data,
      success: function (response) {
        console.log(response)
        connectbtn.parents(".no-gutters").remove()
      }
    });
  })
  $(".fa-times").click(function () {
    $(this).parents(".no-gutters").remove()
  })

  // chat


  $(".openchat").click(function () {
    var friend = $(this).text()
    var listItem = $(this)
    $(".chatwindow").remove()
    $("body").append("<div id = '" + $(this).children("input").val() + "' class ='chatwindow '>")
    $(".chatwindow:last").append("<div class ='ml-2' style ='position:relative;top:0'><i class = 'text-success fa fa-circle'></i> " + friend + "</div>")
    $(".chatwindow div:first").append("<span id='close' style='cursor:pointer' class ='float-right mr-2 mb-2'>x</span>")
    $("#close").click(function () {
      $(".chatwindow").remove()
    })
    $.ajax({
      type: "post",
      url: "/chat/" + $(".chatwindow:last").attr("id"),
      success: function (response) {
        console.log(response)
        $(".chatwindow").append("<div class='msgarea text-break w-100' style='height:82%'> ")
        if (response.messages) {
          response.messages.forEach(element => {
            if (element.from == "You") {

              $(".msgarea:last").append("<p class ='m-1 mt-2 chatmsg bg-white p-2 rounded shadow d-block float-right'>" + element.message + "</p> <br><br>")
            } else {
              $(".msgarea:last").append("<p class ='m-1 mt-2 chatmsg p-2 bg-warning rounded shadow float-left'>" + element.message + "</p><br><br>")

            }
          });
        }
        $(".msgarea:last").scrollTop($(".msgarea:last").prop("scrollHeight"))
        $(".chatwindow").append("<form id='msgdata' style ='position:relative;bottom:0px'>")
        $(".chatwindow form").append("<input type='text' name='message' id ='message' placeholder ='Send message'> ")
        $(".chatwindow form ").append("<button type='button' id='send' class='btn btn-primary'><i class ='fa fa-paper-plane'><i></button>")
        $("#send").click(function () {

          var data = {
            "message": $("#message").val(),
            "friend_id": response.friend_id,
            "friend": friend
          }
          $.ajax({
            type: "post",
            url: "/messages",
            data: data,
            success: function (response2) {
              console.log(response)
              listItem.click()
            }
          });
        })
      }
    });

  })



});
function loadchat() {
  $.ajax({
    type: "post",
    url: "/chat/" + $(".chatwindow:last").attr("id"),
    success: function (response) {
      console.log(response)
      $(".msgarea").remove()
      $(".chatwindow form").before("<div class='msgarea text-break w-100' style='height:82%'> ")
      response.messages.forEach(element => {
        if (element.from == "You") {

          $(".msgarea:last").append("<p class ='m-1 mt-2 chatmsg bg-white p-2 rounded shadow d-block float-right'>" + element.message + "</p> <br><br>")
        } else {
          $(".msgarea:last").append("<p class ='m-1 mt-2 chatmsg p-2 bg-warning rounded shadow float-left'>" + element.message + "</p><br><br>")

        }
      });
      $(".msgarea:last").scrollTop($(".msgarea:last").prop("scrollHeight"))

    }
  })
}