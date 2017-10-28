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
        // rowSelectedDicomServers();
      },
      rowDeselected: function(row) {
        // rowDeselectedDicomServers();
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

    $("#btnRefreshResendTable").click(function() {
      refreshResendTable();
    });

    $("#btnRefreshImgGraph").click(function() {
      refreshImagesGraph();
    });

    $("#btnRefreshType").click(function() {
      refreshImagesTypeTable();
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

    $("#btnRefreshDicomServers").click(function() {
      refreshDicomServersTable();
    });

    $("#btnRefreshCriticalProcesses").click(function() {
      refreshCriticalProcessesTable();
    });

    $("#reintentos").change(function() {
      refreshImagesGraph();
    });

    $("#openType").click(function() {
      var data = $("#images-type-table").tabulator("getSelectedData")[0];
      Dashboard.showDialogIngresosPorTipo(data);
    });

    $("#newSend").click(function() {
      Dashboard.showDialogNewSend(function() {
        refreshResendTable();
      });
    });
  };

  //******************************FUNCIONES******************************

  // var generateEasyPieDisks = function () {

  //   var data_percent = 78.9;
  //   var data_pie_size = 50;
  //   var title = "Disk Space Pacsito";

  //   var html = `<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
  //     <div class="easy-pie-chart txt-color-greenLight" data-percent="${data_percent}" data-pie-size="${data_pie_size}">
  //       <span class="percent percent-sign">${data_percent} </span>
  //     </div>
  //     <span class="easy-pie-title"> ${title} <i class="fa fa-caret-down icon-color-good"></i></span>
  //   </div>`

  //   console.log(html);
  //   $('#disks_information').append(html);
  // };

  var refreshGroupsTable = function() {
    table = $("#groups-table");
    $.when(getGroups()).then(function(data) {
      $("#countGroups").html('<i class="fa fa-user"></i> ' + data.length);
      table.tabulator("setData", data);
    });
  };

  var refreshImagesGraph = function() {
    //Limpio gráfico antes de redibujarlo

    var filtro = "";
    if ($("#reintentos").is(":checked")) filtro = "?reintentos=True";
    else filtro = "?reintentos=False";

    $.ajax({
      type: "GET",
      url: "/cgi-bin/smartmonitor.bf/pendingimages" + filtro,
      success: function(response) {
        graph.setData(response);
      }
    });
  };

  var refreshDicomServersTable = function() {
    $("#dicom-servers-table").tabulator("setData");
  };

  var refreshResendTable = function() {
    table = $("#resend-table");
    table.tabulator("setData");
    var data = table.tabulator("getData");
    $("#reenviando").html('<i class="fa fa-send"></i> ' + data.length);
  };

  var refreshImagesTypeTable = function() {
    $("#images-type-table").tabulator("setData");
  };

  var refreshCriticalProcessesTable = function() {
    $("#critical-processes-table").tabulator("setData");
  };

  var refreshAll = function() {
    refreshDicomServersTable();
    refreshServersTable();
    refreshImagesGraph();
    refreshResendTable();
    refreshImagesTypeTable();
    refreshCriticalProcessesTable();
  };

  var rowDeselectedImagesType = function() {
    $("#openType").addClass("disabled");
    $("#openType").prop("disabled", true);
  };

  var rowSelectedImagesType = function() {
    $("#openType").removeClass("disabled");
    $("#openType").prop("disabled", false);
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

  var alert = function(msg, title, timeout, color, icon) {
    $.bigBox({
      title: title,
      content: msg,
      timeout: timeout,
      color: color,
      icon: icon
      // color: "#C46A69",
      // icon: "fa fa-warning shake animated",
    });
  };

  // Agregar Dicom Server ------------------------------------------------------------
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

  // Modificar Dicom Server ------------------------------------------------------------
  Dashboard.showDialogModifyDicomServer = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Modificar Dicom Server",
      draggable: true,
      type: BootstrapDialog.TYPE_WARNING,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="modificar_dicom_server"></div>').load(
        "html/dlg_modServidoresDicom.html"
      ),
      onshown: function(dialog) {
        $("#dicomservername").val(data.name);
        $("#dicomservercommand").val(data.command);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var mdata = {};
            mdata.name = $("#dicomservername").val();
            mdata.command = $("#dicomservercommand").val();
            mdata.iddicomserver = data.iddicomserver;

            $.ajax({
              type: "PUT",
              url: "/cgi-bin/smartmonitor.bf/dicomserver",
              data: JSON.stringify(mdata),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedDicomServers();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Eliminar Dicom Server ------------------------------------------------------------
  Dashboard.showDialogDeleteDicomServer = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Eliminar Dicom Server",
      draggable: true,
      type: BootstrapDialog.TYPE_DANGER,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="eliminar_dicom_server"></div>').load(
        "html/dlg_modServidoresDicom.html"
      ),
      onshown: function(dialog) {
        $("#dicomservername").addClass("disabled");
        $("#dicomservername").prop("disabled", true);
        $("#dicomservercommand").addClass("disabled");
        $("#dicomservercommand").prop("disabled", true);
        $("#dicomservername").val(data.name);
        $("#dicomservercommand").val(data.command);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Eliminar",
          action: function(dialog) {
            $.ajax({
              type: "DELETE",
              url: "/cgi-bin/smartmonitor.bf/dicomserver",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedDicomServers();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Agregar Proceso Crítico ------------------------------------------------------------
  Dashboard.showDialogNewCriticalProcess = function(callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Nuevo Proceso Crítico",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="agregar_proceso"></div>').load(
        "html/dlg_modProcesosCriticos.html"
      ),
      onshown: function(dialog) {},
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            data = {};
            data.name = $("#processname").val();
            data.command = $("#processcommand").val();
            $.ajax({
              type: "POST",
              url: "/cgi-bin/smartmonitor.bf/criticalprocess",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Modificar Proceso Crítico ------------------------------------------------------------
  Dashboard.showDialogModifyCriticalProcess = function(
    data,
    callBackOnSuccess
  ) {
    BootstrapDialog.show({
      title: "Modificar Proceso Crítico",
      draggable: true,
      type: BootstrapDialog.TYPE_WARNING,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="modificar_proceso"></div>').load(
        "html/dlg_modProcesosCriticos.html"
      ),
      onshown: function(dialog) {
        $("#processname").val(data.name);
        $("#processcommand").val(data.command);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var mdata = {};
            mdata.name = $("#processname").val();
            mdata.command = $("#processcommand").val();
            mdata.idcriticalprocess = data.idcriticalprocess;

            $.ajax({
              type: "PUT",
              url: "/cgi-bin/smartmonitor.bf/criticalprocess",
              data: JSON.stringify(mdata),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedCriticalProcess();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Eliminar Proceso Crítico ------------------------------------------------------------
  Dashboard.showDialogDeleteCriticalProcess = function(
    data,
    callBackOnSuccess
  ) {
    BootstrapDialog.show({
      title: "Eliminar Proceso Crítico",
      draggable: true,
      type: BootstrapDialog.TYPE_DANGER,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="eliminar_proceso"></div>').load(
        "html/dlg_modProcesosCriticos.html"
      ),
      onshown: function(dialog) {
        $("#processname").addClass("disabled");
        $("#processname").prop("disabled", true);
        $("#processcommand").addClass("disabled");
        $("#processcommand").prop("disabled", true);
        $("#processname").val(data.name);
        $("#processcommand").val(data.command);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Eliminar",
          action: function(dialog) {
            $.ajax({
              type: "DELETE",
              url: "/cgi-bin/smartmonitor.bf/criticalprocess",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedCriticalProcess();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Agregar Server ------------------------------------------------------------
  Dashboard.showDialogNewServer = function(callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Nuevo Servidor",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="agregar_servidor"></div>').load(
        "html/dlg_modServidores.html"
      ),
      onshown: function(dialog) {},
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            data = {};
            data.name = $("#servername").val();
            data.ip = $("#ip").val();
            $.ajax({
              type: "POST",
              url: "/cgi-bin/smartmonitor.bf/server",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Modificar Server ------------------------------------------------------------
  Dashboard.showDialogModifyServer = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Modificar Servidor",
      draggable: true,
      type: BootstrapDialog.TYPE_WARNING,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="modificar_servidor"></div>').load(
        "html/dlg_modServidores.html"
      ),
      onshown: function(dialog) {
        $("#servername").val(data.name);
        $("#ip").val(data.ip);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Aceptar",
          action: function(dialog) {
            var mdata = {};
            mdata.name = $("#servername").val();
            mdata.ip = $("#ip").val();
            mdata.idserver = data.idserver;

            $.ajax({
              type: "PUT",
              url: "/cgi-bin/smartmonitor.bf/server",
              data: JSON.stringify(mdata),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedServers();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Eliminar Server ------------------------------------------------------------
  Dashboard.showDialogDeleteServer = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Eliminar Servidor",
      draggable: true,
      type: BootstrapDialog.TYPE_DANGER,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="eliminar_servidor"></div>').load(
        "html/dlg_modServidores.html"
      ),
      onshown: function(dialog) {
        $("#servername").addClass("disabled");
        $("#servername").prop("disabled", true);
        $("#ip").addClass("disabled");
        $("#ip").prop("disabled", true);
        $("#servername").val(data.name);
        $("#ip").val(data.ip);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
        {
          class: "btn btn-success",
          label: "Eliminar",
          action: function(dialog) {
            $.ajax({
              type: "DELETE",
              url: "/cgi-bin/smartmonitor.bf/server",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
                rowDeselectedServers();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });
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

  // Ingresos ------------------------------------------------------------
  Dashboard.showDialogIngresos = function(data, callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Detalle de Imágenes: " + data.fechahora,
      draggable: true,
      size: BootstrapDialog.SIZE_WIDE,
      message: $('<div id="ingresos"></div>').load(
        "html/dlg_modIngresosPorDia.html"
      ),
      onshown: function(dialog) {
        data.reintentos = $("#reintentos").is(":checked");
        console.log(data);
        ModStudies.init(data);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
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

  // Ingresos por Tipo ------------------------------------------------------------
  Dashboard.showDialogIngresosPorTipo = function(data) {
    BootstrapDialog.show({
      title: "Detalle de imágenes publicadas: Servicio " + data.servicio,
      draggable: true,
      size: BootstrapDialog.SIZE_WIDE,
      message: $('<div id="ingresos_servicio"></div>').load(
        "html/dlg_modIngresosPorTipo.html"
      ),
      onshown: function(dialog) {
        ModStudiesService.init(data);
      },
      onhidden: function(dialog) {
        //
      },
      buttons: [
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

  // Nuevo envío ------------------------------------------------------------
  Dashboard.showDialogNewSend = function(callBackOnSuccess) {
    BootstrapDialog.show({
      title: "Envío ",
      draggable: true,
      size: BootstrapDialog.SIZE_NORMAL,
      message: $('<div id="nuevo_envio"></div>').load(
        "html/dlg_modNuevoEnvio.html"
      ),
      onshown: function(dialog) {},
      onhidden: function(dialog) {},
      buttons: [
        {
          class: "btn btn-danger",
          label: "Aceptar",
          action: function(dialog) {
            const ingreso = $("#nroIngreso").val();
            var data = {};
            data.ingreso = ingreso.trim();

            $.ajax({
              type: "POST",
              url: "/cgi-bin/smartmonitor.bf/enreenvio",
              data: JSON.stringify(data),
              success: function(response) {
                callBackOnSuccess();
                dialog.close();
              },
              error: function(xhr) {
                BootstrapDialog.show({
                  type: BootstrapDialog.TYPE_DANGER,
                  title: "Error",
                  draggable: true,
                  message: xhr.responseText
                });
              }
            });

            dialog.close();
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
