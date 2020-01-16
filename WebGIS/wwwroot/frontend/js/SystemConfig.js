$(function () {
    InitBoostrapTableParameter(systemConfig, GetSystemConfigDataUrl, DeleteSystemConfigDataUrl, CreateSystemConfigDataUrl, EditSystemConfigDataUrl);
    InitParameterList();
});

function SelectChange(tableName, key) {
    $table.bootstrapTable('destroy');
    keyName = key;
    TableName = tableName;
    InitMainTable(tableName, systemConfig[key].columns);
}

//初始化参数配置表
function InitParameterList() {
    var html = "";
    var FristRow = true;
    for (var Name in systemConfig) {
        var iconHtml = "<span class='badge badge-success'><span class='" + systemConfig[Name].icon + "'></span></span> "
        if (FristRow) {
            html += '<a href="#" class="list-group-item list-group-item-action active" role="tab" data-toggle="list" onclick="SelectChange(\'' + systemConfig[Name].tableName + '\',\'' + Name + '\')">' + iconHtml + Name + '</a>'
            FristRow = false;
            TableName = systemConfig[Name].tableName;
            keyName = Name;
            InitMainTable(systemConfig[Name].tableName, systemConfig[Name].columns);
            continue;
        }
        html += '<a href="#" class="list-group-item list-group-item-action" role="tab" data-toggle="list" onclick="SelectChange(\'' + systemConfig[Name].tableName + '\',\'' + Name + '\')">' + iconHtml + Name + '</a>'
    }
    $('#listgroup').html(html);
}