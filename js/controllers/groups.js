(function(Groups, $, undefined) {
  var grapBar;
  var refresh_enabled = true;

  Groups.init = function() {
    initializeGroupsTabulator();
    initializePeopleTabulator();
    setupEvents();
  };

  var initializeGroupsTabulator = function() {
    var table = $("#groups-table");

    $("#people-table").addClass("tabulator-load-msg");

    table.tabulator({
      headerFilterPlaceholder: "",
      selectable: 1,
      height: "300px",
      layout: "fitColumns",
      responsiveLayout: true,
      tooltips: true,
      tooltipsHeader: true,
      movableCols: false,
      columns: [
        {
          title: "ID",
          field: "personGroupId",
          sorter: "string",
          headerFilter: false
        },
        {
          title: "Name",
          field: "name",
          sorter: "string",
          headerFilter: false
        },
        {
          title: "User Data",
          field: "userData",
          sorter: "string",
          headerFilter: false
        }
      ],
      rowSelected: function(row) {
        rowSelectedGroup();
      },
      rowDeselected: function(row) {
        rowDeselectedGroup();
      },
      rowClick: function(e, row) {
        var d = row.row.data;

        $.when(getPeople(d.personGroupId)).then(function(data) {
          $("#countPeople").html('<i class="fa fa-user"></i> ' + data.length);
          $("#people-table").tabulator("setData", data);
          $("#actualPersonGroupId").val(d.personGroupId);
        });
      }
    });

    $.when(getGroups()).then(function(data) {
      $("#countGroups").html('<i class="fa fa-users"></i> ' + data.length);
      table.tabulator("setData", data);
      $("#people-table").removeClass("tabulator-loading");
    });
  };

  var initializePeopleTabulator = function() {
    var table = $("#people-table");

    table.tabulator({
      headerFilterPlaceholder: "",
      selectable: 1,
      height: "300px",
      layout: "fitColumns",
      responsiveLayout: true,
      tooltips: true,
      tooltipsHeader: true,
      movableCols: false,
      columns: [
        {
          title: "ID",
          field: "personId",
          sorter: "string",
          headerFilter: false
        },
        {
          title: "Name",
          field: "name",
          sorter: "string",
          headerFilter: false
        },
        {
          title: "User Data",
          field: "userData",
          sorter: "string",
          headerFilter: false
        }
      ],
      rowSelected: function(row) {
        rowSelectedPerson();
      },
      rowDeselected: function(row) {
        rowDeselectedPerson();
      }
    });
  };

  var setupEvents = function() {
    $(window).resize(function() {
      $(".tabulator").tabulator("redraw");
    });

    $("#btnRefreshGroups").click(function() {
      refreshGroupsTable();
    });

    $("#newGroup").click(function() {
      var callBack = function() {
        refreshGroupsTable();
      };

      Groups.showDialogNewGroup(callBack);
    });

    $("#deleteGroup").click(function() {
      var callBack = function() {
        refreshGroupsTable();
      };

      var data = $("#groups-table").tabulator("getSelectedData");
      Groups.showDialogDeleteGroup(data[0], callBack);
    });

    $("#modifyGroup").click(function() {
      var callBack = function() {
        refreshGroupsTable();
      };

      var data = $("#groups-table").tabulator("getSelectedData");
      Groups.showDialogModifyGroup(data[0], callBack);
    });

    $("#trainGroup").click(function() {
      var callBack = function() {
        refreshGroupsTable();
      };

      var data = $("#groups-table").tabulator("getSelectedData");

      $.when(trainGroup(data[0].personGroupId)).then(
        function(d) {
          alert("Entrenando", "Train", 30000, "green", "fa fa-check");
          dialog.close();
          callBackOnSuccess();
        },
        function(xhr) {
          alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
          dialog.close();
        }
      );
    });

    $("#trainingStatus").click(function() {
      var callBack = function() {
        refreshGroupsTable();
      };

      var data = $("#groups-table").tabulator("getSelectedData");

      $.when(trainingStatusGroup(data[0].personGroupId)).then(
        function(d) {
          alert(JSON.stringify(d), "Train", 30000, "green", "fa fa-check");
          dialog.close();
          callBackOnSuccess();
        },
        function(xhr) {
          alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
          dialog.close();
        }
      );
    });

    $("#btnRefreshPeople").click(function() {
      refreshPeopleTable();
    });

    $("#newPerson").click(function() {
      var callBack = function() {
        refreshPeopleTable();
      };

      Groups.showDialogNewPerson(callBack);
    });

    $("#deletePerson").click(function() {
      var callBack = function() {
        refreshPeopleTable();
      };

      var data = $("#people-table").tabulator("getSelectedData");
      Groups.showDialogDeletePerson(data[0], callBack);
    });

    $("#modifyPerson").click(function() {
      var callBack = function() {
        refreshPeopleTable();
      };

      var data = $("#people-table").tabulator("getSelectedData");
      Groups.showDialogModifyPerson(data[0], callBack);
    });

    $("#addFace").click(function() {
      var callBack = function() {
        refreshPeopleTable();
      };

      var data = $("#people-table").tabulator("getSelectedData");
      Groups.showDialogAddFace(data[0], callBack);
    });
  };

  //******************************FUNCIONES******************************

  var refreshGroupsTable = function() {
    var table = $("#groups-table");
    $.when(getGroups()).then(function(data) {
      $("#countGroups").html('<i class="fa fa-user"></i> ' + data.length);
      table.tabulator("setData", data);
    });
  };

  var refreshPeopleTable = function() {
    var table = $("#people-table");
    var personGroupId = $("#actualPersonGroupId").val();
    $.when(getPeople(personGroupId)).then(function(data) {
      $("#countPeople").html('<i class="fa fa-user"></i> ' + data.length);
      $("#people-table").tabulator("setData", data);
    });
  };

  var rowDeselectedGroup = function() {
    $("#modifyGroup").addClass("disabled");
    $("#modifyGroup").prop("disabled", true);
    $("#deleteGroup").addClass("disabled");
    $("#deleteGroup").prop("disabled", true);
    $("#trainGroup").addClass("disabled");
    $("#trainGroup").prop("disabled", true);
    $("#trainingStatus").addClass("disabled");
    $("#trainingStatus").prop("disabled", true);
  };

  var rowSelectedGroup = function() {
    $("#modifyGroup").removeClass("disabled");
    $("#modifyGroup").prop("disabled", false);
    $("#deleteGroup").removeClass("disabled");
    $("#deleteGroup").prop("disabled", false);
    $("#trainGroup").removeClass("disabled");
    $("#trainGroup").prop("disabled", false);
    $("#trainingStatus").removeClass("disabled");
    $("#trainingStatus").prop("disabled", false);
  };

  var rowDeselectedPerson = function() {
    $("#modifyPerson").addClass("disabled");
    $("#modifyPerson").prop("disabled", true);
    $("#deletePerson").addClass("disabled");
    $("#deletePerson").prop("disabled", true);
    $("#addFace").addClass("disabled");
    $("#addFace").prop("disabled", true);
  };

  var rowSelectedPerson = function() {
    $("#modifyPerson").removeClass("disabled");
    $("#modifyPerson").prop("disabled", false);
    $("#deletePerson").removeClass("disabled");
    $("#deletePerson").prop("disabled", false);
    $("#addFace").removeClass("disabled");
    $("#addFace").prop("disabled", false);
  };

  var alert = function(msg, title, timeout, color, icon) {
    $.bigBox({
      title: title,
      content: msg,
      timeout: timeout,
      color: color,
      icon: icon
    });
  };

  //******************************MODALES******************************

  // Agregar Grupo ------------------------------------------------------------
  Groups.showDialogNewGroup = function(callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Nuevo Grupo",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="new_group"></div>').load("html/dlg_modGroups.html"),
      onshown: function(dialog) {},
      onhidden: function(dialog) {},
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var data = {};
            data.name = $("#name").val();
            data.personGroupId = $("#personGroupId").val();
            data.userData = $("#userData").val();
            $.when(createGroup(data)).then(
              function(d) {
                alert("Agregado", "Nuevo Grupo", 30000, "green", "fa fa-check");
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Modificar Grupo ------------------------------------------------------------
  Groups.showDialogModifyGroup = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Modificar Grupo",
      draggable: true,
      type: BootstrapDialog.TYPE_WARNING,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="modify_group"></div>').load(
        "html/dlg_modGroups.html"
      ),
      onshown: function(dialog) {
        $("#personGroupId").addClass("disabled");
        $("#personGroupId").prop("disabled", true);
        $("#personGroupId").val(data.personGroupId);
        $("#name").val(data.name);
        $("#userData").val(data.userData);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var data = {};
            data.name = $("#name").val();
            data.personGroupId = $("#personGroupId").val();
            data.userData = $("#userData").val();
            console.log(data);
            $.when(modifyGroup(data)).then(
              function(d) {
                alert(
                  "Modificado",
                  "Modificar Grupo",
                  30000,
                  "green",
                  "fa fa-check"
                );
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Eliminar Grupo ------------------------------------------------------------
  Groups.showDialogDeleteGroup = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Eliminar Grupo",
      draggable: true,
      type: BootstrapDialog.TYPE_DANGER,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="eliminar_grupo"></div>').load(
        "html/dlg_modGroups.html"
      ),
      onshown: function(dialog) {
        $("#personGroupId").addClass("disabled");
        $("#personGroupId").prop("disabled", true);
        $("#name").addClass("disabled");
        $("#name").prop("disabled", true);
        $("#userData").addClass("disabled");
        $("#userData").prop("disabled", true);
        $("#personGroupId").val(data.personGroupId);
        $("#name").val(data.name);
        $("#userData").val(data.userData);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Eliminar",
          action: function(dialog) {
            var personGroupId = $("#personGroupId").val();
            $.when(deleteGroup(personGroupId)).then(
              function(d) {
                alert(
                  "Eliminación exitosa",
                  "Eliminar Grupo",
                  30000,
                  "green",
                  "fa fa-check"
                );
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Agregar Persona ------------------------------------------------------------
  Groups.showDialogNewPerson = function(callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Nueva Persona",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="new_person"></div>').load("html/dlg_modPeople.html"),
      onshown: function(dialog) {
        $("#personId").val("");
        $("#personId").addClass("disabled");
        $("#personId").prop("disabled", true);
      },
      onhidden: function(dialog) {},
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var data = {};
            data.name = $("#name").val();
            data.userData = $("#userData").val();
            var personGroupId = $("#actualPersonGroupId").val();
            $.when(createPerson(personGroupId, data)).then(
              function(d) {
                alert(
                  "Agregada",
                  "Nueva Persona",
                  30000,
                  "green",
                  "fa fa-check"
                );
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Modificar Persona ------------------------------------------------------------
  Groups.showDialogModifyPerson = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Modificar Persona",
      draggable: true,
      type: BootstrapDialog.TYPE_WARNING,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="modify_person"></div>').load(
        "html/dlg_modPeople.html"
      ),
      onshown: function(dialog) {
        $("#personId").addClass("disabled");
        $("#personId").prop("disabled", true);
        $("#personId").val(data.personId);
        $("#name").val(data.name);
        $("#userData").val(data.userData);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var data = {};
            data.name = $("#name").val();
            data.userData = $("#userData").val();
            var personGroupId = $("#actualPersonGroupId").val();
            var personId = $("#personId").val();
            console.log(data);
            $.when(modifyPerson(personGroupId, personId, data)).then(
              function(d) {
                alert(
                  "Modificado con éxito",
                  "Modificar Persona",
                  30000,
                  "green",
                  "fa fa-check"
                );
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Eliminar Persona ------------------------------------------------------------
  Groups.showDialogDeletePerson = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Eliminar Persona",
      draggable: true,
      type: BootstrapDialog.TYPE_DANGER,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="eliminar_persona"></div>').load(
        "html/dlg_modPeople.html"
      ),
      onshown: function(dialog) {
        $("#personId").addClass("disabled");
        $("#personId").prop("disabled", true);
        $("#name").addClass("disabled");
        $("#name").prop("disabled", true);
        $("#userData").addClass("disabled");
        $("#userData").prop("disabled", true);
        $("#personId").val(data.personId);
        $("#name").val(data.name);
        $("#userData").val(data.userData);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Eliminar",
          action: function(dialog) {
            var data = {};
            data.personGroupId = $("#actualPersonGroupId").val();
            data.personId = $("#personId").val();
            $.when(deletePerson(data)).then(
              function(d) {
                alert(
                  "Eliminación exitosa",
                  "Eliminar Persona",
                  30000,
                  "green",
                  "fa fa-check"
                );
                dialog.close();
                callBackOnSuccess();
              },
              function(xhr) {
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-times");
                dialog.close();
              }
            );
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Agregar Cara ------------------------------------------------------------
  Groups.showDialogAddFace = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Agregar Cara",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="agregar_cara"></div>').load(
        "html/dlg_modAddFace.html"
      ),
      onshown: function(dialog) {},
      onhidden: function(dialog) {},
      buttons: [
        {
          class: "btn btn-success",
          label: "Agregar",
          action: function(dialog) {
            var file = $("#faceUpload")[0].files[0];
            var personGroupId = $("#actualPersonGroupId").val();
            var personId = data.personId;
            if (file) {
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function(e) {
                var imageParsedBinary = parseBinary(e.target.result);
                $.when(
                  addFace(personGroupId, personId, imageParsedBinary)
                ).then(
                  function(d) {
                    alert(
                      "Modificado con éxito",
                      "Modificar Persona",
                      30000,
                      "green",
                      "fa fa-check"
                    );
                    dialog.close();
                    callBackOnSuccess();
                  },
                  function(xhr) {
                    alert(
                      xhr.responseText,
                      "Error!",
                      30000,
                      "red",
                      "fa fa-times"
                    );
                    dialog.close();
                  }
                );
              };
            }
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };

  // Verify Face ------------------------------------------------------------
  Groups.showDialogVerifyFace = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Agregar Cara",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="agregar_cara"></div>').load(
        "html/dlg_modAddFace.html"
      ),
      onshown: function(dialog) {},
      onhidden: function(dialog) {},
      buttons: [
        {
          class: "btn btn-success",
          label: "Agregar",
          action: function(dialog) {
            var file = $("#faceUpload")[0].files[0];
            var personGroupId = $("#actualPersonGroupId").val();
            var personId = data.personId;
            if (file) {
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function(e) {
                var imageParsedBinary = parseBinary(e.target.result);
                $.when(
                  addFace(personGroupId, personId, imageParsedBinary)
                ).then(
                  function(d) {
                    alert(
                      "Modificado con éxito",
                      "Modificar Persona",
                      30000,
                      "green",
                      "fa fa-check"
                    );
                    dialog.close();
                    callBackOnSuccess();
                  },
                  function(xhr) {
                    alert(
                      xhr.responseText,
                      "Error!",
                      30000,
                      "red",
                      "fa fa-times"
                    );
                    dialog.close();
                  }
                );
              };
            }
          }
        },
        {
          class: "btn btn-danger",
          label: "Cancelar",
          action: function(dialog) {
            dialog.close();
          }
        }
      ]
    });
  };
})((window.Groups = window.Groups || {}), jQuery);
