var itemList = [];
$(document).on('focus', '.code', function() {
    $(this).autocomplete({
        source: function(request, response) {
            $.ajax({
                url: 'http://localhost:8080/api/v1/stock',
                method: 'GET',
                dataType: 'json',
                data: {
                    code: request.term
                },
                success: function(data) {
                    // Manipulate data to extract only item codes
                    var itemCodes = $.map(data, function(item) {
                        return {
                            label: item.code,
                            value: item.code,
                            item: item
                        };
                    });
                    response(itemCodes);
                }
            });
        },
        minLength: 2,
        select: function(event, ui) {
            var $inputElement = $(this); // Get the current input element
            var inputId = $inputElement.attr('id'); // Get the id attribute
            var inputName = $inputElement.attr('name'); // Get the name attribute
            var startIndex = inputId.indexOf('[') + 1;
            var endIndex = inputId.indexOf(']');
            var index = inputId.substring(startIndex, endIndex);

            console.log('Index:', index);

            // Use the id or name as needed
            console.log('Input ID:', inputId);
            console.log('Input Name:', inputName);
            $('#saleItemList\\[' + index + '\\]\\.stockId').val(ui.item.item.id);
            $('#saleItemList\\[' + index + '\\]\\.code').val(ui.item.item.code);
            $('#saleItemList\\[' + index + '\\]\\.name').val(ui.item.item.name);
            $('#saleItemList\\[' + index + '\\]\\.weight').val(ui.item.item.weight != null ? parseFloat(ui.item.item.weight).toFixed(3) : parseFloat(0).toFixed(3));
            $('#saleItemList\\[' + index + '\\]\\.vaWeight').val(ui.item.item.vaWeight != null ? parseFloat(ui.item.item.vaWeight).toFixed(3) : parseFloat(0).toFixed(3));
            $('#saleItemList\\[' + index + '\\]\\.stnWeight').val(ui.item.item.stnWeight != null ? parseFloat(ui.item.item.stnWeight).toFixed(3) : parseFloat(0).toFixed(3));
             $('#saleItemList\\[' + index + '\\]\\.netWeight').val(calcNetWeight(ui.item.item));
            $('#saleItemList\\[' + index + '\\]\\.makingCharge').val(ui.item.item.saleMC != null ? parseFloat(ui.item.item.saleMC).toFixed(2) : parseFloat(0).toFixed(3));
//
//            $('#saleItemList\\[' + index + '\\]\\.stnType').val(ui.item.item.stnType);
//            $('#saleItemList\\[' + index + '\\]\\.stnCostPerCt').val(ui.item.item.stnCostPerCt);

//            $('#saleItemList\\[' + index + '\\]\\.rate').val(ui.item.item.rate);

        }
    });
});

$(document).on('input', '.saleItemCls', function() {
    var $inputElement = $(this); // Get the current input element
    var inputId = $inputElement.attr('id'); // Get the id attribute
    var inputName = $inputElement.attr('name'); // Get the name attribute
    var startIndex = inputId.indexOf('[') + 1;
    var endIndex = inputId.indexOf(']');
    var index = inputId.substring(startIndex, endIndex);
    calcItemTotal(index);
});

$(document).on('input', '.exchangeItemCls', function() {
    var $inputElement = $(this); // Get the current input element
    var inputId = $inputElement.attr('id'); // Get the id attribute
    var inputName = $inputElement.attr('name'); // Get the name attribute
    var startIndex = inputId.indexOf('[') + 1;
    var endIndex = inputId.indexOf(']');
    var index = inputId.substring(startIndex, endIndex);
    calcExchangeItemTotal(index);
});



$(document).ready(function(){

$('.enableGst').change(function() {
    // Check if "NO" option is selected
    if ($(this).val() === 'NO') {
        // Hide the div element
        $('#gstBlock').addClass('d-none'); // Replace '.div-to-hide' with the appropriate selector for your div
    } else {
        // Show the div element
        $('#gstBlock').removeClass('d-none'); // Replace '.div-to-hide' with the appropriate selector for your div
    }
});

     // Add row function
     $("#addSaleItem").click(function() {
         var rowCount = $('#saleItemsTable tbody tr').length;

         var newRow = '<tr>'+
                           '<td>'+
                               '<input type="text" name="code" id="saleItemList['+rowCount+'].code" class="form-control code table-input">'+
                               '<input type="hidden" name="id" id="saleItemList['+rowCount+'].id" class="form-control">'+
                               '<input type="hidden" name="stockId" id="saleItemList['+rowCount+'].stockId">'+
                           '</td>'+
                           '<td><input type="text" name="name" id="saleItemList['+rowCount+'].name" class="form-control table-input"></td>'+
                           '<td><input type="text" name="weight" id="saleItemList['+rowCount+'].weight" class="form-control saleItemCls table-input"></td>'+
                           '<td><input type="text" name="vaWeight" id="saleItemList['+rowCount+'].vaWeight" class="form-control saleItemCls table-input"></td>'+
                           '<td><input type="text" name="stnWeight" id="saleItemList['+rowCount+'].stnWeight" class="form-control table-input"></td>'+
                           '<td><input type="text" name="netWeight" id="saleItemList['+rowCount+'].netWeight" class="form-control table-input"></td>'+
                           '<td><input type="text" name="makingCharge" id="saleItemList['+rowCount+'].makingCharge" class="form-control saleItemCls table-input"></td>'+
                           '<td><input type="text" name="rate" id="saleItemList['+rowCount+'].rate" class="form-control saleItemCls table-input"></td>'+
                           '<td><input type="text" name="itemTotal" id="saleItemList['+rowCount+'].itemTotal" class="form-control table-input"></td>'+
                           '<td><button type="button" class="btn btn-danger removeRow"><i class="fas fa-trash"></i></button></td>'+
                       '</tr>';
         $("#saleItemsTable tbody").append(newRow);
     });

     // Remove row
     $("#saleItemsTable").on("click", ".removeRow", function() {
        var rowCount = $('#saleItemsTable tbody tr').length;
        if(rowCount > 1) {
            $(this).closest("tr").remove();
            calcMainTotals();
        } else {
            alert("At least 1 Item to be added to do a sale.")
        }
     });

     $("#addExchangeItem").click(function() {
        var rowCount = $('#exchangeItemsTable tbody tr').length;
        var newRow = '<tr>' +
                          '<td><input type="text" name="itemDesc" id="exchangedItems[' + rowCount + '].itemDesc" class="form-control table-input"></td>' +
                          '<td>'+
                              '<input type="text" name="weight" id="exchangedItems[' + rowCount + '].weight" class="form-control exchangeItemCls table-input">' +
                              '<input type="hidden" name="id" id="exchangedItems[' + rowCount + '].id" class="form-control table-input">' +
                          '</td>' +
                          '<td><input type="text" name="meltPercentage" id="exchangedItems[' + rowCount + '].meltPercentage" class="form-control exchangeItemCls table-input"></td>' +
                          '<td><input type="text" name="wastageInGms" id="exchangedItems[' + rowCount + '].wastageInGms" class="form-control table-input"></td>' +
                          '<td><input type="text" name="netWeight" id="exchangedItems[' + rowCount + '].netWeight" class="form-control table-input"></td>' +
                          '<td><input type="text" name="rate" id="exchangedItems[' + rowCount + '].rate" class="form-control exchangeItemCls table-input"></td>' +
                          '<td><input type="text" name="exchangeValue" id="exchangedItems[' + rowCount + '].exchangeValue" class="form-control table-input"></td>' +
                          '<td><button type="button" class="btn btn-danger removeExchangeRow"><i class="fas fa-trash"></i></button></td>' +
                      '</tr>';
        $("#exchangeItemsTable tbody").append(newRow);
     });
     $("#exchangeItemsTable").on("click", ".removeExchangeRow", function() {
        var rowCount = $('#exchangeItemsTable tbody tr').length;
        if(rowCount > 1) {
            $(this).closest("tr").remove();
            calcMainTotals();
        } else {
            alert("At least 1 Item to be added to do a sale.")
        }
    });
    $('#discount').on('input', function() {
        calcMainTotals();
    });

    $('#paidAmount').on('input', function() {
        calcMainTotals();
    });



$('#saleDate').val(getCurrentDate()).attr('disabled', true);
});

function calcNetWeight(item) {
    var weight = item.weight != null ? parseFloat(item.weight) : 0.000;
    var vaWeight = item.vaWeight != null ? parseFloat(item.vaWeight) : 0.000;
    var stnWeight = item.stnWeight != null ? parseFloat(item.stnWeight) : 0.000;
    var grossWeight = weight + vaWeight - stnWeight;
    return grossWeight.toFixed(3);
}


function calcItemTotal(index) {

    var weight = parseFloat($('#saleItemList\\[' + index + '\\]\\.weight').val());
    var vaWeight = parseFloat($('#saleItemList\\[' + index + '\\]\\.vaWeight').val());
    var stnWeight = parseFloat($('#saleItemList\\[' + index + '\\]\\.stnWeight').val());
    var makingCharge = parseFloat($('#saleItemList\\[' + index + '\\]\\.makingCharge').val());
    var rate = parseFloat($('#saleItemList\\[' + index + '\\]\\.rate').val());
    console.log('index:'+index+', weight: '+weight+', vaWeight:'+vaWeight+', makingCharge:'+makingCharge+', rate:'+rate);
    // Calculate gross weight
    var grossWeight = weight + vaWeight;
    var itemTotal = (grossWeight * rate) + makingCharge;
    $('#saleItemList\\[' + index + '\\]\\.itemTotal').val(itemTotal.toFixed(2));
    calcMainTotals();
}

function calcExchangeItemTotal(index) {
    var weight = parseFloat($('#exchangedItems\\[' + index + '\\]\\.weight').val());
    var meltPercentage = parseFloat($('#exchangedItems\\[' + index + '\\]\\.meltPercentage').val());
    var wastageInGms = parseFloat($('#exchangedItems\\[' + index + '\\]\\.wastageInGms').val());
    var netWeight = parseFloat($('#exchangedItems\\[' + index + '\\]\\.netWeight').val());
    var rate = parseFloat($('#exchangedItems\\[' + index + '\\]\\.rate').val());
    var exchangeValue = parseFloat($('#exchangedItems\\[' + index + '\\]\\.exchangeValue').val());

    if (weight != '') {
        if (meltPercentage != '') {
            wastageInGms = weight - (weight * (meltPercentage / 100));
            netWeight = weight - wastageInGms;
            $('#exchangedItems\\[' + index + '\\]\\.wastageInGms').val(wastageInGms.toFixed(3));
            $('#exchangedItems\\[' + index + '\\]\\.netWeight').val(netWeight.toFixed(3));
            if (rate != null) {
                exchangeValue = netWeight * rate;
                $('#exchangedItems\\[' + index + '\\]\\.exchangeValue').val(exchangeValue.toFixed(2));
                calcMainTotals();
            } else {
                $('#exchangedItems\\[' + index + '\\]\\.exchangeValue').val(0.00);
            }
        }
    }

}

function calcMainTotals() {
    calcItemTotalAmount();
    calcTotalExchangeAmount();
    calcBalAmount();
}

function calcTotalExchangeAmount() {
    var totalExchangeValue = 0;
    // Iterate over each row in the table body
    $("#exchangeItemsTable tbody tr").each(function() {
        // Get the exchange value from the current row and add it to the total
        $(this).find("input[name*='exchangedItems'][name$='.exchangeValue']").each(function() {
            var exchangeValue = parseFloat($(this).val());
            if (!isNaN(exchangeValue)) {
                totalExchangeValue += exchangeValue;
            }
        });
    });
    $("#totalExchangeAmount").val(totalExchangeValue.toFixed(2));
    $("#totalExchangeAmountLbl").text(totalExchangeValue.toFixed(2));
    calcTotals();
}

function calcItemTotalAmount() {
    var itemTotalValue = 0;
    // Iterate over each row in the table body
    $("#saleItemsTable tbody tr").each(function() {
        // Get the exchange value from the current row and add it to the total
        $(this).find("input[name*='saleItemList'][name$='.itemTotal']").each(function() {
            var itemValue = parseFloat($(this).val());
            if (!isNaN(itemValue)) {
                itemTotalValue += itemValue;
            }
        });
    });
    // Display the total exchange value
    $("#totalSaleAmountLbl").text(itemTotalValue.toFixed(2));
    $("#totalSaleAmount").val(itemTotalValue.toFixed(2));
    calcTotals();
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function calcTotals() {
    var totalSaleAmount = $('#totalSaleAmount').val() != '' ? parseFloat($('#totalSaleAmount').val()) : 0.00;
    var totalExchangeAmount = $('#totalExchangeAmount').val() != '' ? parseFloat($('#totalExchangeAmount').val()) : 0.00;
    var discount = $('#discount').val() != '' ? parseFloat($('#discount').val()) : 0.00;
    var cGstAmount = $('#cGstAmount').val() != '' ? parseFloat($('#cGstAmount').val()) : 0.00;
    var sGstAmount = $('#sGstAmount').val() != '' ? parseFloat($('#sGstAmount').val()) : 0.00;

    var grandTotalSaleAmountLbl = ((totalSaleAmount - totalExchangeAmount) - discount) + (cGstAmount + sGstAmount);
    if(grandTotalSaleAmountLbl > 0) {
        $('#grandTotalSaleAmount').val(grandTotalSaleAmountLbl.toFixed(2));
        $('#grandTotalSaleAmountLbl').text(grandTotalSaleAmountLbl.toFixed(2));
    }
}

function calcBalAmount() {
    var grandTotalSaleAmount = $('#grandTotalSaleAmount').val();
    var balAmount = $('#balAmount').val();
    var paidAmount = $('#paidAmount').val();
    var balAmount = grandTotalSaleAmount - paidAmount;
    $('#balAmount').val(balAmount.toFixed(2));
    $('#balAmountLbl').text(balAmount.toFixed(2));
}


















//
//// Function to add item to the itemList
//function addItemToList() {
//    // Get input values from modal
//    var newItem = {
//        code: $('#code').val(),
//        metalType: $('input[name="metalType"]:checked').val(),
//        name: $('#name').val(),
//        purity: $('#purity').val(),
//        weight: $('#weight').val(),
//        stnWeight: $('#stnWeight').val(),
//        vaWeight: $('#vaWeight').val(),
//        netWeight: $('#netWeight').val(),
//        makingCharge: $('#makingCharge').val(),
//        stnType: $('#stnType').val(),
//        stnCostPerCt: $('#stnCostPerCt').val(),
//        pcs: $('#pcs').val(),
//        huid: $('#huid').val(),
//        rate: $('#rate').val(),
//        itemTotal: $('#itemTotal').val()
//    };
//
//    // Add new item to the itemList
//    itemList.push(newItem);
//
//    // Clear modal inputs
//    $('#itemModal input').val('');
//
//    // Add item to table
//    addItemToTable(newItem);
//}
//
//// Function to add item to the table
//function addItemToTable(item) {
//    var tableRow = '<tr>';
//    tableRow += '<td>' + item.code + '</td>';
//    tableRow += '<td>' + item.metalType + '</td>';
//    tableRow += '<td>' + item.name + '</td>';
//    tableRow += '<td>' + item.weight + '</td>';
//    tableRow += '<td>' + item.vaWeight + '</td>';
//    tableRow += '<td>' + item.netWeight + '</td>';
//    tableRow += '<td>' + item.makingCharge + '</td>';
//    tableRow += '<td>' + item.rate + '</td>';
//    tableRow += '<td>' + item.itemTotal + '</td>';
//    tableRow += '</tr>';
//
//    $('#itemTable tbody').append(tableRow);
//}
//
//// Event listener for "Add Item" button click
//$('#itemModal').on('click', '.addItem', function() {
//    addItemToList();
//});