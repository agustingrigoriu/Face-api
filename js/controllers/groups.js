(function(Groups, $, undefined) {
  var grapBar;
  var refresh_enabled = true;

  Groups.init = function() {
    initializeGroupsTabulator();
    // initializePeopleTabulator();
    setupEvents();
  };

  var initializeGroupsTabulator = function() {
    var table = $("#groups-table");

    table.tabulator({
      headerFilterPlaceholder: "",
      selectable: 1,
      height: "155px",
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
      }
    });

    $.when(getGroups()).then(function(data) {
      $("#countGroups").html('<i class="fa fa-user"></i> ' + data.length);
      table.tabulator("setData", data);
    });
  };

  var setupEvents = function() {
    $(window).resize(function() {
      $(".tabulator").tabulator("redraw");
      refreshImagesGraph();
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
          alert(xhr.responseText, "Error!", 30000, "red", "fa fa-cross");
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
          alert(xhr.responseText, "Error!", 30000, "red", "fa fa-cross");
          dialog.close();
        }
      );
    });
  };

  //******************************FUNCIONES******************************

  var refreshGroupsTable = function() {
    table = $("#groups-table");
    $.when(getGroups()).then(function(data) {
      $("#countGroups").html('<i class="fa fa-user"></i> ' + data.length);
      table.tabulator("setData", data);
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

  var alert = function(msg, title, timeout, color, icon) {
    $.bigBox({
      title: title,
      content: msg,
      timeout: timeout,
      color: color,
      icon: icon
    });
  };

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
            data = {};
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
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-cross");
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
            data = {};
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
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-cross");
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
                alert(xhr.responseText, "Error!", 30000, "red", "fa fa-cross");
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
})((window.Groups = window.Groups || {}), jQuery);
