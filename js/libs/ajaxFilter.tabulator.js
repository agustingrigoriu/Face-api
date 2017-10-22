Tabulator.extendExtension("edit", "editors", {
  ajaxEditor: function (cell, onRendered, success, cancel, editorParams) {
    //create and style input
    var editor = $("<input type='text'/>");
    editor.css({
      "padding-left": "2px",
      "padding-right": "2px",
      "font-weight": "normal",
      width: "100%",
      "box-sizing": "border-box",
      border: "1px solid gray",
      "border-radius": "1px"
    });
    editor.val(cell.getValue());
    onRendered(function () {
      editor.focus();
    });

    // var searchValue = function (nameKey, myArray) {
    //   for (var i = 0; i < myArray.length; i++) {
    //     if (myArray[i].field === nameKey) {
    //       return myArray[i];
    //     }
    //   }
    // };

    // var popObject = function (nameKey, myArray) {
    //   for (var i = 0; i < myArray.length; i++) {
    //     if (myArray[i].field === nameKey) {
    //       return myArray.pop(myArray[i]);
    //     }
    //   }
    // };

    //block existing filter event bindings
    // var table = this.table;
    // var options = this.table.options;
    // filterList = this.table.extensions.filter.filterList;
    // headerFilters = this.table.extensions.filter.headerFilters;

    // editor.on("keydown", function(e) {
    //   options.allowAjax = false;
    // });

    // editor.keyup(function(e) {
    //   options.allowAjax = false;

    //   //Controlo que ingrese Enter
    //   if (e.keyCode == 13) {
    //     console.log(headerFilters);
    //     //Vacío filterList de la tabla
    //     for (var i = filterList.length; i > 0; i--) {
    //       filterList.pop();
    //     }
    //     console.log(filterList.length);
    //     //Recorro cada field de headerFilters (pares field-value)
    //     for (var field in headerFilters) {
    //       //Busco si ese field ya se encontraba cargado en el array anterior
    //       var resultObj = searchValue(field, filterList);
    //       if (resultObj !== undefined) {
    //         //Si estaba cargado o bien actualizo el valor o bien lo elimino de la lista
    //         resultObj.value.length > 0
    //           ? (resultObj.value = headerFilters[field].value)
    //           : popObject(field, filterList);
    //       } else {
    //         var newObj = {
    //           field: field,
    //           value: headerFilters[field].value
    //         };
    //         filterList.push(newObj);
    //       }
    //     }
    //     console.log(filterList);
    //     options.allowAjax = true;
    //   }
    // });

    return editor;
  }
});
