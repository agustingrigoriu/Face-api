var subscriptionKey = "3e1606fa44d54913ac984e2351938e10";
var urlBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/";

var detectFace = function(img) {
  var params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes:
      "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
  };
  $.ajax({
    url: urlBase + "detect?" + $.param(params),
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    contentType: false,
    processData: false,
    type: "POST",
    data: img
  })
    .done(function(data) {
      return JSON.stringify(data);
    })
    .fail(function(xhr, status, error) {
      console.log(xhr.responseText);
    });
};

//Funciones extra
var parseBinary = function (dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], { type: mimeString });
    return blob;
}