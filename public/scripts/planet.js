function requestUpgrade(uid) {
  alert(uid);
}

function requestBuild(typeId, planetId) {
  //alert(uid);

  var request = {
    type: "build"
  };

  $.ajax({
    type: 'POST',
    url: '/planet/' + planetId + '/build/' + typeId,
    data: request,
    dataType: 'json',
    success: function(data){
      console.log(data);
      $('#id-' + typeId).text('Upgrade');
    }
  });
  //
  // $.ajax({
  //   type: "POST",
  //   url: '/planet/' + planetId + '/build/' + typeId,
  //   data: JSON.stringify(request),
  //   contentType: "application/json; charset=utf-8",
  //   dataType: "json",
  //   success: function(data) {
  //
  //   },
  //   failure: function(error) {
  //
  //   }
  // })
}
