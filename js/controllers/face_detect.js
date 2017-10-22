(function(FaceDetect, $, undefined) {
  var refresh_enabled = true;

  FaceDetect.init = function() {
    setupEvents();
  };

  var setupEvents = function() {
    //Escondo botón de loading
    $("#loadingButton").hide();

    //Cargo la foto en pantalla al seleccionarla
    $("#imgUpload").change(function() {
      var file = $("#imgUpload")[0].files[0];
      var img = $("#img");
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          img.attr("src", e.target.result);
        };
      }
    });

    //Evento de click en botón Detect, se obtienen las imagenes y se envía a la función correspondiente de azure
    $("#detect").click(function() {
      var file = $("#imgUpload")[0].files[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
          $("#loadingButton").show();
          $("#detect").hide();

          var imageParsedBinary = parseBinary(e.target.result);
          $.when(detectFace(imageParsedBinary)).then(function(data) {
            $("#results").val(JSON.stringify(data, null, 2));
            $("#loadingButton").hide();
            $("#detect").show();
          });
        };
      }
    });
  };

  var initializeCriticalProcessesTabulator = function() {
    var activeIcon = function(value, data, cell, row, options) {
      //plain text value
      return "<i class='glyphicon glyphicon-triangle-top' style='color:#449D44; font-size: 20px;'></i>";
    };

    var inactiveIcon = function(value, data, cell, row, options) {
      //plain text value
      return "<i class='glyphicon glyphicon-triangle-bottom' style='color:#C9302C; font-size: 20px;' ></i>";
    };

    var table = $("#critical-processes-table");

    table.tabulator({
      headerFilterPlaceholder: "",
      selectable: 1,
      ajaxURL: "/cgi-bin/smartmonitor.bf/criticalprocesses",
      ajaxResponse: function(url, params, response) {
        $("#countCriticalProcesses").html(
          '<i class="fa fa-cog"></i> ' + response.length
        );

        response.forEach(function(element) {
          if (element.running === false)
            alert(
              "El proceso " + element.name + " se ha caído!",
              "Caída de Critical Process",
              20000,
              "#C46A69",
              "fa fa-warning shake animated"
            );
        }, this);
        return response;
      },
      height: "155px",
      layout: "fitColumns",
      responsiveLayout: true,
      tooltips: true,
      tooltipsHeader: true,
      movableCols: false,
      columns: [
        {
          title: "P. ID",
          field: "idcriticalprocess",
          sorter: "number",
          headerFilter: false
        },
        {
          title: "P. Name",
          field: "name",
          sorter: "number",
          headerFilter: false
        },
        {
          title: "P. Command",
          field: "command",
          sorter: "string",
          headerFilter: false
        },
        {
          title: "Running",
          field: "running",
          sortable: false,
          align: "center",
          formatter: function(cell, formatterParams) {
            const status = cell.getValue();
            switch (status) {
              case false:
                return inactiveIcon;
                break;

              case true:
                return activeIcon;
                break;
            }
          }
        }
      ],
      rowSelected: function(row) {
        rowSelectedCriticalProcess();
      },
      rowDeselected: function(row) {
        rowDeselectedCriticalProcess();
      }
    });
  };

  var initializeEvents = function() {
    $(window).resize(function() {
      $(".tabulator").tabulator("redraw");
    });

    setInterval(function() {
      if (refresh_enabled) {
        refreshAll();
      }
    }, 30000);

    $("#newServer").click(function() {
      var callBack = function() {
        refreshServersTable();
      };

      Dashboard.showDialogNewServer(callBack);
    });

    $("#modifyServer").click(function() {
      var callBack = function() {
        refreshServersTable();
      };
      var data = $("#servers-table").tabulator("getSelectedData");
      Dashboard.showDialogModifyServer(data[0], callBack);
    });

    $("#deleteServer").click(function() {
      var callBack = function() {
        refreshServersTable();
      };
      var data = $("#servers-table").tabulator("getSelectedData");
      Dashboard.showDialogDeleteServer(data[0], callBack);
    });

    $("#btnRefreshServers").click(function() {
      refreshServersTable();
    });

    $("#newDicomServer").click(function() {
      var callBack = function() {
        refreshDicomServersTable();
      };

      Dashboard.showDialogNewDicomServer(callBack);
    });

    $("#modifyDicomServer").click(function() {
      var callBack = function() {
        refreshDicomServersTable();
      };
      var data = $("#dicom-servers-table").tabulator("getSelectedData");
      Dashboard.showDialogModifyDicomServer(data[0], callBack);
    });

    $("#deleteDicomServer").click(function() {
      var callBack = function() {
        refreshDicomServersTable();
      };
      var data = $("#dicom-servers-table").tabulator("getSelectedData");
      Dashboard.showDialogDeleteDicomServer(data[0], callBack);
    });

    $("#btnRefreshDicomServers").click(function() {
      refreshDicomServersTable();
    });

    $("#newCriticalProcess").click(function() {
      var callBack = function() {
        refreshCriticalProcessesTable();
      };

      Dashboard.showDialogNewCriticalProcess(callBack);
    });

    $("#modifyCriticalProcess").click(function() {
      var callBack = function() {
        refreshCriticalProcessesTable();
      };
      var data = $("#critical-processes-table").tabulator("getSelectedData");
      Dashboard.showDialogModifyCriticalProcess(data[0], callBack);
    });

    $("#deleteCriticalProcess").click(function() {
      var callBack = function() {
        refreshCriticalProcessesTable();
      };
      var data = $("#critical-processes-table").tabulator("getSelectedData");
      Dashboard.showDialogDeleteCriticalProcess(data[0], callBack);
    });

    $("#btnRefreshCriticalProcesses").click(function() {
      refreshCriticalProcessesTable();
    });
  };

  //******************************FUNCIONES******************************

  var refreshServersTable = function() {
    $("#servers-table").tabulator("setData");
  };

  var refreshDicomServersTable = function() {
    $("#dicom-servers-table").tabulator("setData");
  };

  var refreshCriticalProcessesTable = function() {
    $("#critical-processes-table").tabulator("setData");
  };

  var refreshAll = function() {
    refreshDicomServersTable();
    refreshServersTable();
    refreshCriticalProcessesTable();
  };

  var rowDeselectedDicomServers = function() {
    $("#modifyDicomServer").addClass("disabled");
    $("#modifyDicomServer").prop("disabled", true);
    $("#deleteDicomServer").addClass("disabled");
    $("#deleteDicomServer").prop("disabled", true);
  };

  var rowSelectedDicomServers = function() {
    $("#modifyDicomServer").removeClass("disabled");
    $("#modifyDicomServer").prop("disabled", false);
    $("#deleteDicomServer").removeClass("disabled");
    $("#deleteDicomServer").prop("disabled", false);
  };

  var rowDeselectedCriticalProcess = function() {
    $("#modifyCriticalProcess").addClass("disabled");
    $("#modifyCriticalProcess").prop("disabled", true);
    $("#deleteCriticalProcess").addClass("disabled");
    $("#deleteCriticalProcess").prop("disabled", true);
  };

  var rowSelectedCriticalProcess = function() {
    $("#modifyCriticalProcess").removeClass("disabled");
    $("#modifyCriticalProcess").prop("disabled", false);
    $("#deleteCriticalProcess").removeClass("disabled");
    $("#deleteCriticalProcess").prop("disabled", false);
  };

  var rowDeselectedServers = function() {
    $("#modifyServer").addClass("disabled");
    $("#modifyServer").prop("disabled", true);
    $("#deleteServer").addClass("disabled");
    $("#deleteServer").prop("disabled", true);
  };

  var rowSelectedServers = function() {
    $("#modifyServer").removeClass("disabled");
    $("#modifyServer").prop("disabled", false);
    $("#deleteServer").removeClass("disabled");
    $("#deleteServer").prop("disabled", false);
  };

  // var alert = function(msg, title, timeout, color, icon) {
  //   $.bigBox({
  //     title: title,
  //     content: msg,
  //     timeout: timeout,
  //     color: color,
  //     icon: icon
  //     // color: "#C46A69",
  //     // icon: "fa fa-warning shake animated",
  //   });
  // };
})((window.FaceDetect = window.FaceDetect || {}), jQuery);
