document.write('<script src="/frontend/js/map.js"></script>');
var applicationPath = window.applicationPath === "" ? "" : window.applicationPath || "../../";
var fileUploadPanel = null;
var attributeSelectionPanel = null;
var attributeQueryResultPanel = null;
var analyseResultPanel = null;
var fileUploader = null;
var EvaluateTime;
var PJMXLX;

var queryResultTable = null;
var redLineLayer = null;
var analyseResults = [];
var DKXHArry = {};
var buttonObj = null;

$(document).ready(function () {
    $('#loading').hide();
    hideMash();

    //绑定'加载红线'点击事件
    var $loadRedLine = $('#loadRedLine');
    if ($loadRedLine.length > 0) {
        $loadRedLine.click(initFileUploadPanel);
    }

    //绑定'高级查询'点击事件
    var $attributeQuery = $('#attributeQuery');
    if ($attributeQuery.length > 0) {
        $attributeQuery.click(attributeQueryClick);
    }

    //绑定'属性查询'点击事件
    var $mapClickQuery = $('#mapClickQuery');
    if ($mapClickQuery.length > 0) {
        $mapClickQuery.click(function(){
            activeMapClickQuery = true;
            navToolbar.deactivate();
            DrawObj.deactivate();
        });
    }

    //绑定面板关闭事件
    $(document).on('jspanelclosed', function (event, id) {
        if (id == 'fileUploadPanel') {
            fileUploadPanel = null;
            if (fileUploader != null) {
                fileUploader.destroy();
                fileUploader = null;
            }
        } else if (id == 'analyseResultPanel') {
            map.removeLayer(redLineLayer);
            toc.removeNode("name", "临时图层");
            analyseResultPanel = null;
            redLineLayer = null;
        } else if (id == 'attributeSelectionPanel') {
            attributeSelectionPanel = null;
        } else if (id == 'attributeQueryResultPanel') {
            attributeQueryResultPanel = null;
            if (queryResultTable != null) {
                queryResultTable.destroy();
                queryResultTable = null;
            }
            if (selectionLayer != null) {
                map.removeLayer(selectionLayer);
                selectionLayer = null;
            }
            if (queryLayer != null) {
                map.removeLayer(queryLayer);
                queryLayer = null;
            }
            map.graphics.clear();
            toc.removeNode("name", "临时图层");
        } else if (id == 'FreehandAttributeQueryResultPanel') {
            if(redLineLayer!=null){
                map.removeLayer(redLineLayer);
                redLineLayer=null;
            }
            map.graphics.clear();
            DrawObj.deactivate();
            toc.removeNode("name", "临时图层");
        }
    });

    $(window).resize(function () {
        if (isMashShow) {
            showMash(null);
        }
    });

    LoadMapServiceMapIgnoreClickQueryConfig();
    LoadExcelFromServerFile();
    LoadMapServiceConfig();
    LoadMapServiceQueryLayerConfig();
    LoadMapServicePressureAnalysisConfig();
    PJMXLX = $('input[name="PJMXLX"]:checked').val();

});

//加载字典表
function LoadExcelFromServerFile() {
    $.post(afterendLoadExcelFileUrl, null, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, 'error');
        } else {
            AlphabetJson = data.data;
        }
    });
}

//加载地图服务配置信息
function LoadMapServiceConfig() {
    $.post(LoadMapServiceConfigUrl, null, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, 'error');
        } else {
            var json = data.data;
            for (var key in json) {
                if (json[key].isIgnoreFullExtent.trim() == "是") {
                    json[key].isIgnoreFullExtent = true;
                } else {
                    json[key].isIgnoreFullExtent = false;
                }
            }
            mapConfig = json;
            initMap();
        }
    });
}

//加载地图服务属性查询配置信息
function LoadMapServiceQueryLayerConfig() {
    $.post(LoadMapServiceQueryLayerConfigUrl, null, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, 'error');
        } else {
            var MapService_QueryLayerConfig = data.MapService_QueryLayerConfig;
            var MapService_QueryFieldConfig = data.MapService_QueryFieldConfig;

            for (var key in MapService_QueryLayerConfig) {
                var arry = MapService_QueryLayerConfig[key].fieldNames.split(',');
                var fieldNames = {};
                for (var item in arry) {
                    var strarry = arry[item].split(':');
                    fieldNames[strarry[0]] = strarry[1];
                }
                MapService_QueryLayerConfig[key].fieldNames = fieldNames;
            }

            for (var key in MapService_QueryFieldConfig) {
                MapService_QueryFieldConfig[key].datatype = MapService_QueryFieldConfig[key].datatype.trim();
                MapService_QueryFieldConfig[key].operation = MapService_QueryFieldConfig[key].operation.toString().trim();

                if (MapService_QueryFieldConfig[key].notNull.trim() == "是") {
                    MapService_QueryFieldConfig[key].notNull = true;
                } else {
                    MapService_QueryFieldConfig[key].notNull = false;
                }

                if (MapService_QueryFieldConfig[key].formType == "select") {
                    var arry = MapService_QueryFieldConfig[key].options.split(',');
                    var options = {};
                    for (var item in arry) {
                        var strarry = arry[item].split(':');
                        options[strarry[0]] = strarry[1];
                    }
                    MapService_QueryFieldConfig[key].options = function () {
                        return options;
                    }
                }
            }
            queryLayerConfig = MapService_QueryLayerConfig;
            queryFieldConfig = MapService_QueryFieldConfig;
        }
    });
}

//加载地图服务压占分析配置信息
function LoadMapServicePressureAnalysisConfig() {
    $.post(LoadMapServicePressureAnalysisConfigUrl, null, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, 'error');
        } else {
            var json = data.data;
            for (var key in json) {
                var arry = json[key].analyzedFieldNames.split(',');
                var fieldNames = {};
                for (var item in arry) {
                    var strarry = arry[item].split(':');
                    fieldNames[strarry[0]] = strarry[1];
                }
                json[key].analyzedFieldNames = fieldNames;
            }
            pressureAnalysisConfig = json;
            //根据配置生成'压占分析'按钮内容，并绑定点击事件
            var $analyseMenu = $('#analyseMenu');
            if ($analyseMenu.length > 0) {
                for (var i = 0; i < pressureAnalysisConfig.length; i++) {
                    $analyseMenu.append('<li><a href="#" onClick="analyseMenuClick(this)" value="' + i + '">' + pressureAnalysisConfig[i].name + '</a></li>');
                }
            }
            var $FreehandAttributeQuery = $('#FreehandAttributeQuery');
            if ($FreehandAttributeQuery.length > 0) {
                for (var i = 0; i < pressureAnalysisConfig.length; i++) {
                    $FreehandAttributeQuery.append('<li><a href="#" onClick="activateTool(' + i + ')" value="' + i + '">' + pressureAnalysisConfig[i].name + '</a></li>');
                }
            }
        }
    });
}

//加载点击地图忽略查询配置
function LoadMapServiceMapIgnoreClickQueryConfig() {
    $.post(LoadMapServiceMapIgnoreClickQueryConfigUrl, null, function (data) {
        if (data.code == 1) {
            ShowMiniNotice(data.data, 'error');
        } else {
            var urlArry = [];
            var json = data.data;
            for (var key in json) {
                urlArry.push(json[key].ignoreMapClickQueryUrl);
            }
            ignoreMapClickQueryUrl = urlArry;
        }
    });
}

//显示文件上传面板
function initFileUploadPanel() {
    if (fileUploadPanel != null) {
        return;
    }
    //初始化面板
    fileUploadPanel = $.jsPanel({
        id: 'fileUploadPanel',
        position: 'center-top 0 100',
        footerToolbar: '<span style="flex:1 1 auto"></span>',
        contentSize: {
            width: 300,
            height: 0
        },
        headerTitle: '上传范围线文件',
        //theme: 'none',
        headerToolbar: "<div id='picker' style='margin:0 auto;'>选择范围线文件</div>",
        content: "<div id='thelist' style='margin:0 auto; width:100%;text-align: center;'></div>" +
            "<div id='uploadbtnDiv' style='margin:0 auto; width:100%;text-align: center;'></div>"
    });
    //初始化WebUploader
    var fileUploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: false,
        // swf文件路径
        swf: applicationPath + 'lib/webuploader/Uploader.swf',

        // 文件接收服务端。
        server: afterendUploadMultiFilesUrl,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: '#picker',
            multiple: true
        },

        chunked: true, //开始分片上传
        chunkSize: 2048000, //每一片的大小

        accept: {
            title: '红线压缩文件',
            extensions: '*',
            mimeTypes: '红线文件/*'
        },
        // accept: {
        //     title: '红线压缩文件',
        //     extensions: 'zip',
        //     mimeTypes: '红线压缩文件/*.zip'
        // },

        // 不压缩image
        resize: false
    });

    /**
     * 验证文件格式以及文件大小
     */
    fileUploader.on("error", function (type) {
        if (type == "Q_TYPE_DENIED") {
            ShowMiniNotice("请选择ZIP格式文件", 'warning');
        }
    });

    var isRetryUpload = false;

    var $list = $('#thelist');
    // 当有文件被添加进队列的时候
    fileUploader.on('fileQueued', function (file) {
        fileUploadPanel.resize(300, fileUploadPanel.height() + 60);
        $list.append('<div id="' + file.id + '" class="item">' +
            '<h4>' + file.name + '</h4>' +
            '<p class="state">等待上传...</p>' +
            '<div class="progress progress-bar"></div>' +
            '</div>');
        var $uploadbtn = $('#uploadbtnDiv').find('#uploadbtn');
        if (!$uploadbtn.length) {
            fileUploadPanel.resize(300, fileUploadPanel.height() + 50);
            $uploadbtn = $('#uploadbtnDiv').html('<button type="button" id="uploadbtn" class="btn btn-default">上传文件</button>').find('#uploadbtn');
            $uploadbtn.click(function () {
                if (isRetryUpload) {
                    fileUploader.retry();
                    isRetryUpload = false;
                    $list.find('p.state').each(function (i, p) {
                        if ($(p).text() == '上传出错') {
                            $(p).text('等待上传...');
                        }
                    });
                    return;
                }

                var localdate = new Date();
                EvaluateTime = localdate.toLocaleDateString() + "/" + localdate.getHours() + "/" + localdate.getMinutes() + "/" + localdate.getSeconds();
                EvaluateTime = EvaluateTime.replace(/\//g, '-');

                fileUploader.options.formData = {
                    PJMXLX: PJMXLX,
                    EvaluateTime: EvaluateTime
                }
                fileUploader.upload();
            });
        }
    });
    // 文件上传过程中创建进度条实时显示。
    fileUploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('上传中');

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    fileUploader.on('uploadSuccess', function (file, response) {
        $('#' + file.id).find('p.state').text('完成上传');
    });

    // 文件上传失败，显示上传出错。
    fileUploader.on('uploadError', function (file) {
        $('#' + file.id).find('p.state').text('上传出错');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    fileUploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress').fadeOut();
    });

    //所有文件上传完毕
    fileUploader.on("uploadFinished", function () {
        var stats = fileUploader.getStats();
        if (stats.uploadFailNum > 0) {
            console.log('存在' + stats.uploadFailNum + '个上传失败的文件，请重新上传');
            isRetryUpload = true;
            $.post(afterendDeleteUploadUrl, {
                PJMXLX: PJMXLX,
                EvaluateTime: EvaluateTime
            }, function (data) {
                if (data.error != 0) {
                    ShowMiniNotice('服务器删除已上传文件失败！', 'error');
                }
            });
        } else {
            var state = $('#uploadbtnDiv').append('<p class="state">正在加载图层</p>');
            $.post(afterendGetGeometriesUrl, {
                PJMXLX: PJMXLX,
                EvaluateTime: EvaluateTime
            }, function (data) {
                if (data.code == '1') {
                    ShowMiniNotice(data.data, 'error');
                    state.text(data.data);
                } else {
                    loadUploadLayer($.parseJSON(data));
                    state.fadeOut();
                    fileUploader.reset();
                    fileUploadPanel.close();
                    ShowMiniNotice("导入坐标成功!");
                    if (buttonObj != null) {
                        analyseMenuClick(buttonObj);
                    } else {
                        ClearTableInfo();
                    }
                }
            });
        }
    });
}

//显示红线压占图层
function loadUploadLayer(layerdata) {
    require([
        "ext/geojsonUtil",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/geometry/Polygon",
        "esri/geometry/geometryEngine",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!"
    ],
        function (GeoJsonUtil, GraphicsLayer, Graphic, SimpleFillSymbol,
            SimpleLineSymbol, Color, Polygon, geometryEngine, on, dom) {
            var geoJsonUtil = new GeoJsonUtil();
            var sr = map.spatialReference;
            sr.wkid = redLineWkid;
            sr.latestWkid = redLineWkid;
            layerdata = geoJsonUtil.geojsonToArcGIS(layerdata, sr);

            if (redLineLayer == null) {
                redLineLayer = new GraphicsLayer();
                redLineLayer.layername = "范围线图层";
                redLineLayer.isIgnoreFullExtent = true;
                map.addLayer(redLineLayer);
            }

            redLineLayer.clear();
            var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 1);
            var fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                lineSymbol, new Color([136, 136, 136, 0.25]));

            var polygons = [];
            DKXHArry = {};
            for (var i = 0; i < layerdata.length; i++) {
                var geo = new Polygon();
                var feature = layerdata[i];
                geo.rings = feature.geometry.rings;
                geo.spatialReference.wkid = feature.geometry.spatialReference.wkid;
                var graphic = new Graphic(geo, fill, null);
                redLineLayer.add(graphic);
                polygons.push(geo);
                DKXHArry[feature.attributes.DKXH] = graphic
            }
            redLineLayer.redraw();

            var zoomExtent = geometryEngine.union(polygons).getExtent();
            map.setExtent(zoomExtent);

            //重置压占分析结果
            analyseResults = [];
        }
    );
}

//属性查询，显示属性查询筛选选择面板
function attributeQueryClick() {
    activeMapClickQuery = false;
    navToolbar.deactivate();
    DrawObj.deactivate();
    if (attributeSelectionPanel != null) {
        return;
    }
    $('.bs-chinese-region').remove();

    var panelContent = '';
    //初始化 图层 下拉框
    var layerContentHeight = 87 + 35;
    var chineseregionId = null;
    var layerContent =
        '<div class="form-group">' +
        '<label for="query_layer">图层：</label>' +
        '<select id="query_layer" class="form-control">';
    for (var layer in queryLayerConfig) {
        layerContent += '<option value="' + layer + '">' + queryLayerConfig[layer].chineseName + '</option>';
    }
    layerContent += '</select></div>';
    panelContent += layerContent;
    for (var queryField in queryFieldConfig) {
        var queryFieldParameter = queryFieldConfig[queryField];
        var id = 'query_' + queryField;
        var fieldContent = '';
        switch (queryFieldParameter.formType) {
            case 'chineseRegion':
                chineseregionId = id;
                fieldContent =
                    '<div class="form-group">' +
                    '<label for="' + id + '" id="' + id + 'label" style="margin-bottom:5px">' + queryFieldParameter.tipName + '：</label>' +
                    '<div class="bs-chinese-region flat dropdown" data-min-level="1" data-max-level="3" data-def-val="[name=' + id + ']">' +
                    '<input type="text" class="form-control" id="' + id + '" placeholder="选择' + queryFieldParameter.tipName + '" data-toggle="dropdown" readonly="" />' +
                    '<input type="hidden" class="form-control" name="' + id + '" value="' + xianCode + '" />' +
                    '<div class="dropdown-menu" role="menu" aria-labelledby="dLabel">' +
                    '<div>' +
                    '<ul class="nav nav-tabs" role="tablist">' +
                    '<li role="presentation" class="active"><a href="#province" data-next="city" role="tab" data-toggle="tab">省份</a></li>' +
                    '<li role="presentation"><a href="#city" data-next="district" role="tab" data-toggle="tab">城市</a></li>' +
                    '<li role="presentation"><a href="#district" data-next="town" role="tab" data-toggle="tab">县区</a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                    '<div role="tabpanel" class="tab-pane active" id="province">--</div>' +
                    '<div role="tabpanel" class="tab-pane" id="city">--</div>' +
                    '<div role="tabpanel" class="tab-pane" id="district">--</div>' +
                    '</div>' + //对应<div class="tab-content">
                    '</div>' + //对应<div>
                    '</div>' + //对应<div class="dropdown-menu" role="menu" aria-labelledby="dLabel">
                    '</div>' + //对应<div class="bs-chinese-region flat dropdown" data-min-level="1" data-max-level="4" data-def-val="[name=address]">
                    '</div>'; //对应<div class="form-group">
                break;
            case 'select':
                var selectOptions = '';
                var options = queryFieldParameter.options();
                if (options instanceof Array) {
                    for (var index in options) {
                        var optValue = options[index];
                        selectOptions += '<option value="' + optValue + '">' + optValue + '</option>';
                    }
                } else {
                    for (var optKey in options) {
                        var optValue = options[optKey];
                        selectOptions += '<option value="' + optKey + '">' + optValue + '</option>';
                    }
                }
                fieldContent =
                    '<div class="form-group">' +
                    '<label for="' + id + '">' + queryFieldParameter.tipName + '：</label>' +
                    '<select id="' + id + '" class="form-control">' +
                    selectOptions +
                    '</select>' +
                    '</div>';
                break;
            case 'input':
                var placeholderValue = queryFieldParameter.notNull ? '' : '可选填';
                fieldContent =
                    '<div class="form-group">' +
                    '<label for="' + id + '">' + queryFieldParameter.tipName + '：</label>' +
                    '<input class="form-control" id="' + id + '" placeholder="' + placeholderValue + '" />' +
                    '</div>';
                break;
        }
        panelContent += fieldContent;
        layerContentHeight += 80;
    }

    attributeSelectionPanel = $.jsPanel({
        id: 'attributeSelectionPanel',
        footerToolbar: '<span style="flex:1 1 auto"></span>',
        position: {
            my: 'right-top',
            at: 'right-top',
            offsetX: -100,
            offsetY: 70
        },
        contentSize: {
            width: 440,
            height: layerContentHeight
        },
        headerTitle: '高级查询',
        content: '<div style="width:100%; height:100%; overflow:auto; font-size:17px;">' +
            '<form role="form">' +
            panelContent +
            '</form>' +
            "<button type='button' id='query_attribute' class='btn btn-default' style='margin-top:10px; margin-left:20px; width:100px; height='35px;'>查询</button>" +
            "<div id='loading' style='margin-top:12px; display:none;'>" +
            "<div id='loading-center'>" +
            "<div id='loading-center-absolute'>" +
            "<div class='object' id='object_one'></div>" +
            "<div class='object' id='object_two'></div>" +
            "<div class='object' id='object_three'></div>" +
            "<div class='object' id='object_four'></div>" +
            "<div class='object' id='object_five'></div>" +
            "<div class='object' id='object_six'></div>" +
            "<div class='object' id='object_seven'></div>" +
            "<div class='object' id='object_eight'></div>" +
            "</div></div></div>" +
            '</div>'
    });

    //点击查询
    var $loading = $('#loading');
    var $queryBtn = $('#query_attribute');
    $queryBtn.click(function () {
        // $loading.css('display', 'inline');
        // $queryBtn.attr('disabled', 'disabled');

        var whereClauseAnd = "";
        var whereClauseOr = "";
        for (var queryField in queryFieldConfig) {
            var form;
            var queryFieldParameter = queryFieldConfig[queryField];
            var id = 'query_' + queryField;
            switch (queryFieldParameter.formType) {
                case 'chineseRegion':
                    form = $('[name=' + id + ']');
                    break;
                case 'select':
                    form = $('#' + id);
                    break;
                case 'input':
                    form = $('#' + id);
                    break;
            }
            var value = form.val();
            if (queryFieldParameter.notNull && value == '') {
                ShowMiniNotice(queryFieldParameter.tipName + "不允许为空", "error")
                return;
            }
            if (value == '全部') {
                value = '';
            }

            var operation = queryFieldParameter.operation;
            if (queryFieldParameter.datatype == 'string') {
                if (operation == 'like') {
                    value = "'%" + value + "%'";
                } else if (operation == 'like%') {
                    value = "'" + value + "%'";
                    operation = 'like';
                } else {
                    value = "'" + value + "'";
                }
            }

            var expression = queryFieldParameter.fieldName + " " + operation + " " + value;
            if (queryFieldParameter.notNull) {
                whereClauseAnd += (whereClauseAnd.length == 0 ? "" : " and ") + expression;
            } else {
                whereClauseOr += (whereClauseOr.length == 0 ? "" : " or ") + expression;
            }
        }
        var whereClause = whereClauseAnd + (whereClauseOr.length == 0 ? whereClauseOr : " and (" + whereClauseOr + ")");
        console.log(whereClause);

        var selectedLayerIndex = $('#query_layer').val();
        var selectedQueryLayerConfig = queryLayerConfig[selectedLayerIndex];
        var queryUrl = selectedQueryLayerConfig.layerUrl;
        //console.log(queryUrl);
        var queryFieldNames = [];
        for (var fieldName in selectedQueryLayerConfig.fieldNames) {
            queryFieldNames.push(fieldName);
        }
        console.log(queryFieldNames);

        require([
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "dojo/on",
            "dojo/dom",
            "dojo/domReady!"
        ],
            function (Query, QueryTask, on, dom) {
                var query = new Query();
                query.outFields = queryFieldNames;
                query.returnGeometry = true;
                if (whereClause.length > 0)
                    query.where = whereClause;
                else
                    query.where = '1 = 1';
                var queryTask = new QueryTask(queryUrl);
                showMash("正在查询中......", function () {
                    queryTask.execute(query, function (queryResult) {
                        showAttributeQueryResultPanel(queryResult, selectedQueryLayerConfig.fieldNames, selectedQueryLayerConfig.jumpIdFieldName, selectedQueryLayerConfig.jumpTitleFieldName, selectedQueryLayerConfig.jumpUrl);
                        hideMash();
                    });
                })

            }
        );
    });
}

//显示查询结果面板
function showAttributeQueryResultPanel(queryResult, queryFieldNames, jumpIdFieldName, jumpTitleFieldName, jumpUrl) {
    if (attributeQueryResultPanel == null) {
        attributeQueryResultPanel = $.jsPanel({
            id: 'attributeQueryResultPanel',
            footerToolbar: '<span style="flex:1 1 auto"></span>',
            position: {
                my: 'center-bottom',
                at: 'center-bottom',
                offsetX: -5,
                offsetY: -25
            },
            contentSize: {
                width: function () {
                    return $(window).width() - 25
                },
                height: function () {
                    return $(window).height() / 2
                },
            },
            headerTitle: '查询结果',
            content: '<div style="width:100%; height:100%; overflow:auto; font-size:15px; padding:10px 10px 10px 10px"><table width="100%" class="display" id="queryResultTable" cellspacing="0"></table></div>'
        });
    }
    if (queryResultTable != null)
        queryResultTable.destroy();

    var columns = [];
    console.log(queryResult);
    for (var index in queryResult.fields) {
        columns.push({
            title: queryFieldNames[queryResult.fields[index].name],
            visible: true
        });
    }
    columns.push({
        title: 'geometry',
        visible: false
    });

    var datas = [];
    for (var featureIndex in queryResult.features) {
        var feature = queryResult.features[featureIndex];
        var row = [];
        for (var index in queryResult.fields) {
            var fieldName = queryResult.fields[index].name;
            var value = feature.attributes[fieldName];
            var jumpIdValue = feature.attributes[jumpIdFieldName];
            var jumpTitleValue = feature.attributes[jumpTitleFieldName];
            if ($.inArray(fieldName, linkFieldNames) >= 0) {
                row.push('<a href="#" value="' + jumpIdValue + '" title="' + jumpTitleValue + '" class="aJump" onclick="aJumpToMis(this)">' + value + '</a>');
            } else {
                row.push(value);
            }
        }
        row.push(feature.geometry);
        datas.push(row);
    }

    queryResultTable = $('#queryResultTable').DataTable({
        language: {
            search: '搜索',
            lengthMenu: '显示 _MENU_ 条记录',
            zeroRecords: '搜索不到相关数据！',
            emptyTable: '无表格数据',
            info: '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录',
            infoEmpty: '没有记录可以显示',
            paginate: {
                first: '第一页',
                last: '最后一页',
                next: '下一页',
                previous: '上一页',
            }
        },
        columns: columns,
        data: datas
    });

    _jumpUrl = jumpUrl;


    require([
        "esri/renderers/SimpleRenderer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "esri/geometry/Extent"
    ],
        function (SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, Color, GraphicsLayer, Graphic, Extent) {
            //跳转到点击要素
            $('#queryResultTable tbody').on('dblclick', 'tr', function () {
                var data = queryResultTable.row(this).data();
                var selectedGeometry = data[data.length - 1];
                //设置选择图斑高亮
                if (queryLayer == null) {
                    queryLayer = new GraphicsLayer();
                    queryLayer.layername = "查询选中要素图层";
                    queryLayer.isIgnoreFullExtent = true;
                    map.addLayer(queryLayer);
                }
                queryLayer.clear();

                var outline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 1);
                var polygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, outline, new Color([0, 255, 0, 1]));
                var graphic = new Graphic(selectedGeometry, polygonSymbol);
                queryLayer.add(graphic);

                queryLayer.redraw();
                var selectedExtent = selectedGeometry.getExtent();
                var extent = new Extent(selectedExtent.xmin, selectedExtent.ymin, selectedExtent.xmax, selectedExtent.ymax, map.spatialReference);
                map.setExtent(extent);
            });

            //显示选中要素
            var selectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0, 0.35]), 1), new Color([255, 0, 0, 0.35]));

            if (selectionLayer == null) {
                selectionLayer = new GraphicsLayer();
                selectionLayer.layername = "要素定位图层";
                selectionLayer.isIgnoreFullExtent = true;
                map.addLayer(selectionLayer);
            }
            selectionLayer.clear();
            for (var index in queryResult.features) {
                var graphic = new Graphic(queryResult.features[index].geometry, selectionSymbol);
                selectionLayer.add(graphic);
            }
            selectionLayer.redraw();
        });
}

//压占分析点击按钮
function analyseMenuClick(e) {
    activeMapClickQuery = false;
    navToolbar.deactivate();
    DrawObj.deactivate();
    buttonObj = e;

    if (redLineLayer == null) {
        initFileUploadPanel();
        return;
    }

    configIndex = e.getAttribute("value");
    var parameter = pressureAnalysisConfig[configIndex];

    var analyseResultTable = analyseResults[configIndex];
    if (analyseResultTable != null && typeof (analyseResultTable) != 'undefined') {
        showAnalyseResult(parameter.name + '结果', analyseResultTable);
        return;
    }

    var fieldNames = [];
    for (var fieldName in parameter.analyzedFieldNames) {
        fieldNames.push(fieldName);
    }

    require([
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/geometry/geometryEngine",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!"
    ],
        function (Query, QueryTask, GeometryEngine, on, dom) {
            if (redLineLayer.graphics.length > 0) {
                showMash("正在统计耕地等别数据中......", function () {
                    var geometryAry = [];
                    for (var i = 0; i < redLineLayer.graphics.length; i++) {
                        geometryAry.push(redLineLayer.graphics[i].geometry);
                    }
                    $.when(overlayAnalyse(GeometryEngine.union(geometryAry))).done(function () {
                        hideMash();
                    })
                });
            } else {
                ShowMsg("未检测到上传坐标文件的数据，请检查数据的正确性", "error");
                return;
            }
            //叠加分析
            function overlayAnalyse(inputGeometry) {
                var query = new Query();
                query.outFields = fieldNames;
                query.geometry = GeometryEngine.simplify(inputGeometry);
                query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                query.outSpatialReference = map.spatialReference;
                query.where = parameter.where;
                query.returnGeometry = true;
                var queryTask = new QueryTask(parameter.analyzedLayerUrl);
                queryTask.execute(query, showResults, function (error) {
                    hideMash();
                    alert('查询出错：' + error);
                });
            }
        }
    );
}