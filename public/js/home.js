$(document).ready(function () {
  $(".fa").on("click", function () { });
  $(".toast").toast("show")  
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
});
