var subscriptionKey = "3e1606fa44d54913ac984e2351938e10";
var urlBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/";

function detectFace(img) {
  var params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes:
      "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise"
  };
  return $.ajax({
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
  });
}

function getGroups() {
  return $.ajax({
    url: urlBase + "persongroups",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "GET"
  });
}

function createGroup(data) {
  return $.ajax({
    url: urlBase + "persongroups/" + data.personGroupId,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "PUT",
    data: JSON.stringify(data)
  });
}

function modifyGroup(data) {
  return $.ajax({
    url: urlBase + "persongroups/" + data.personGroupId,
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "PATCH",
    data: JSON.stringify(data)
  });
}

function deleteGroup(personGroupId) {
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId,
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "DELETE"
  });
}

function trainGroup(personGroupId) {
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId + "/train",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "POST"
  });
}

function trainingStatusGroup(personGroupId) {
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId + "/training",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "GET"
  });
}

function createPerson(personGroupId, data) {
  console.log(data);
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId + "/persons",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "POST",
    data: JSON.stringify(data)
  });
}

function deletePerson(data) {
  return $.ajax({
    url:
      urlBase +
      "persongroups/" +
      data.personGroupId +
      "/persons/" +
      data.personId,
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "DELETE"
  });
}

function modifyPerson(personGroupId, personId, data) {
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId + "/persons/" + personId,
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "PATCH",
    data: JSON.stringify(data)
  });
}

function getPeople(personGroupId) {
  return $.ajax({
    url: urlBase + "persongroups/" + personGroupId + "/persons",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "GET"
  });
}

function addFace(personGroupId, personId, img) {
  return $.ajax({
    url:
      urlBase +
      "persongroups/" +
      personGroupId +
      "/persons/" +
      personId +
      "/persistedFaces",
    beforeSend: function(xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    contentType: false,
    processData: false,
    type: "POST",
    data: img
  });
}

function identifyFace(data) {
  return $.ajax({
    url: urlBase + "identify",
    beforeSend: function(xhrObj) {
      // Request headers
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "POST",
    data: JSON.stringify(data)
  });
}
//Funciones extra
var parseBinary = function(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ia], { type: mimeString });
  return blob;
};
