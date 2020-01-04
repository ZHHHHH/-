var TableName = "";
var PageRowCount = "";
var PageIndex = "";
var $table
var rowId = '';
var keyName = '';

var ConfigData;

var QueryDataUrl;
var DeleteDataUrl;
var CreateDataUrl;
var EditDataUrl;

var ModalElementID;
var ModalLabelElementID;
var ModalDivElementID;
var ToolbarElementID;
var TableElementID;

//初始化全局参数
function InitBoostrapTableParameter(_configData, _queryDataUrl,_deleteDataUrl, _createDataUrl, _editDataUrl, _modalElementID, _modalLabelElementID, _modalDivElementID, _tableElement, _toolbarElement) {
    ConfigData = _configData;
    QueryDataUrl = _queryDataUrl;
    DeleteDataUrl = _deleteDataUrl;
    CreateDataUrl = _createDataUrl;
    EditDataUrl = _editDataUrl;
    ModalElementID = _modalElementID;
    ModalLabelElementID = _modalLabelElementID;
    ModalDivElementID = _modalDivElementID
    TableElementID = _tableElement;
    ToolbarElementID = _toolbarElement;
}

//初始化bootstrap-table的内容
function InitMainTable(TableName, Columns) {
    //记录页面bootstrap-table全局变量$table，方便应用
    $table = $('#' + TableElementID).bootstrapTable({
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: QueryDataUrl, //请求后台的URL（*）
        method: 'POST', //请求方式（*）
        toolbar: '#' + ToolbarElementID, //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        cache: true, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        sortable: true, //是否启用排序
        sortOrder: "asc", //排序方式
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页,并记录
        pageSize: 10, //每页的记录行数（*）
        pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
        search: false, //是否显示表格搜索
        strictSearch: true,
        showColumns: true, //是否显示所有的列（选择显示的列）
        showRefresh: true, //是否显示刷新按钮
        minimumCountColumns: 2, //最少允许的列数
        clickToSelect: true, //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID", //每一行的唯一标识，一般为主键列
        showToggle: true, //是否显示详细视图和列表视图的切换按钮
        cardView: false, //是否显示详细视图
        detailView: false, //是否显示父子表
        //得到查询的参数
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                PageRowCount: params.limit, //页面大小
                PageIndex: params.offset, //页码
                TableName: TableName,
                // sortColumn: params.sort,      //排序列名  
                // sortOrder: params.order //排位命令（desc，asc） 
            };
            PageRowCount = params.limit;
            PageIndex = params.offset;
            return temp;
        },
        columns: Columns,
        onLoadSuccess: function () { },
        onLoadError: function () {
            ShowMiniNotice("数据加载失败！", 'error');
        },
        onDblClickRow: function (row, $element) {
            InitModel(row.ID)
        }
    });
};

//删除数据
function DeleteByIds(ID) {
    ShowConfirmMsg("确定要删除此条数据吗？", function ($this, type) {
        if (type == 'no') {
            return;
        }
        $.post(DeleteDataUrl, {
            "TableName": TableName,
            "ID": ID
        }, function (data) {
            ShowMiniNotice(data.data)
            $('#' + ModalElementID).modal('hide');
            refreshTable();
        })
    });
}

//刷新表格
function refreshTable() {
    $table.bootstrapTable('refresh', {
        url: QueryDataUrl,
        slient: true,
        query: {
            "PageRowCount": PageRowCount,
            "PageIndex": PageIndex,
            "TableName": TableName
        }
    })
}

//弹出模态框
function InitModel(rowID) {
    rowId = rowID;
    var value = '';
    var html = '';
    var rowData = $table.bootstrapTable('getRowByUniqueId', rowID); //行的数据
    var columns = ConfigData[keyName].columns;
    for (var key in columns) {
        if (columns[key].formType == null) {
            continue;
        }
        if (rowData != null) {
            $('#' + ModalLabelElementID).text('编辑数据');
            value = rowData[columns[key].field];
            if (value == null) {
                value = '';
            } else {
                value = value.toString().trim();
            }
        } else {
            $('#' + ModalLabelElementID).text('增加数据');
            value = '';
        }
        html += '<p class="text-muted">' + columns[key].title + ':</p>';
        switch (columns[key].formType) {
            case 'input':
                if (columns[key].datatype == 'int') {
                    html += '<input type="text" class="form-control" placeholder="请填写' + columns[key].title + ',只能输入数字"    onblur="onblurEvent(this)" value="' + value + '" id="' + TableName + "_" + columns[key].field + '" />';
                } else if (columns[key].datatype == 'string') {
                    html += '<input type="text" class="form-control" placeholder="请填写' + columns[key].title + '" onKeypress="javascript:if(event.keyCode == 32)event.returnValue = false;"  value="' + value + '" id="' + TableName + "_" + columns[key].field + '"  />';
                }
                break;
            case 'select':
                var options = columns[key].options();
                var htm = "";
                for (var index in options) {
                    var optValue = options[index];
                    if (optValue == value) {
                        htm += '<option selected="selected" value="' + optValue + '">' + optValue + '</option>';
                    } else {
                        htm += '<option value="' + optValue + '">' + optValue + '</option>';
                    }
                }
                html += '<select class="form-control" id="' + TableName + "_" + columns[key].field + '" >' + htm + '</select>';
                break;
        }
    }
    $('#' + ModalDivElementID).html("");
    $('#' + ModalDivElementID).html(html);
    $('#' + ModalElementID).modal('show');
}

//向后台提交修改、新增数据
function ChangeDataToDatabase() {
    var data = {};
    var columns = ConfigData[keyName].columns;
    for (var key in columns) {
        if (columns[key].formType == null) {
            continue;
        }
        var val = $('#' + TableName + "_" + columns[key].field).val();
        if (columns[key].isNotNull == null) {
            columns[key].isNotNull = true;
        }
        if (columns[key].isNotNull && val == '') {
            ShowMiniNotice("数据为空", 'error');
            return;
        }
        data[columns[key].field] = val;
    }

    data["TableName"] = TableName;

    var InterfaceUrl;
    if (rowId == -1) {
        InterfaceUrl = CreateDataUrl;
    } else {
        InterfaceUrl = EditDataUrl;
        data["ID"] = rowId;
    }
    $.post(InterfaceUrl, data, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, "error");
        } else {
            ShowMiniNotice(data.data)
            $('#' + ModalElementID).modal('hide');
            refreshTable();
        }
    })
}