$(".disabled").attr("disabled",true)
$(".edit").click(function(){
    $(this).hide();
    $(".disabled").addClass("shadow p-2  mb-5 bg-white rounded")
    $(this).after("<button type='button' class='float-right cancel'>Cancel</button>&nbsp;<button type='button' data-toggle='modal' data-target='#confirm-update' class='float-right mr-3 save'>Save</button>&nbsp;")
    $(".disabled").attr("disabled",false).css("border","1px solid black")
    

    $(".cancel").on('click',function(){
        $(".edit").show();
        $(".save,.cancel").hide();
        $(".disabled").attr("disabled",true).css("border","none")
    })
})
$('input').keydown(function(e){
    if(e.keyCode==13)
      e.preventDefault();
    //   return false;
})
$(".disabled").addClass("text-capitalize")
$(".btn-ok").click(function(){
  $("form").submit();
})