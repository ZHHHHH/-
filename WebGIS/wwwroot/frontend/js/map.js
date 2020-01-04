var map;
var mapExtent = null;
var currentMapClickQueryConfig = null;
var toc = null;
var AlphabetJson = null;//字段字母表
var DrawObj = null;
var FreehandAttributeQueryResultPanel = null;
var FreehandQueryResultTable = null;
var selectionLayer = null;
var queryLayer = null;
var _jumpUrl = null;
var activeMapClickQuery = false;
var navToolbar=null;

var isUseProxy = false; //用于判断是否使用了代理
var isMashShow = false; //遮罩是否正在显示
var isTocMinimize = false; //Toc是否处于最小化状态
var beforeMinimizeSize; //右侧地图最小化前的宽度

function initMap() {
    require([
        "esri/map",
        "esri/toolbars/draw",
        "esri/dijit/Scalebar",
        "ext/AIMapToc",
        "ext/TDTLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "esri/layers/WFSLayer",
        "esri/layers/WMTSLayer",
        "esri/layers/WMTSLayerInfo",
        "esri/config",
        "esri/geometry/Point",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/toolbars/navigation",
        "esri/geometry/Extent",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/dijit/Legend",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/domReady!"
    ],
        function (Map, Draw, Scalebar, AIMapToc, TDTLayer, FeatureLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, WFSLayer, WMTSLayer, WMTSLayerInfo, esriConfig, Point, SimpleFillSymbol, SimpleLineSymbol, Color, Navigation, Extent, InfoTemplate, Popup, IdentifyTask, IdentifyParameters, Legend, arrayUtils, on, dom, domConstruct) {
            // esriConfig.defaults.io.proxyUrl = proxyUrl;
            // esriConfig.defaults.io.alwaysUseProxy = true;
            // esriConfig.defaults.io.timeout = 6000000;
            // esriConfig.defaults.io.corsDetectionTimeout = 600000;

            var popup = new Popup({
                fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
            }, domConstruct.create("div"));

            if (typeof (mapLods) != 'undefined') {
                map = new Map("mapDiv", {
                    logo: false,
                    scale: 50000,
                    infoWindow: popup,
                    lods: mapLods
                });
            } else {
                map = new Map("mapDiv", {
                    logo: false,
                    scale: 50000,
                    infoWindow: popup,
                });
            }

            var scalebar = new Scalebar({
                map: map,
                attachTo: 'bottom-left',
                scalebarStyle: 'ruler',
                scalebarUnit: 'metric'
            });

            //添加图例
            // var legendDijit = new Legend({
            //     map: map
            // }, "legendDiv");
            // legendDijit.startup();

            if ($('#toc').length > 0) {
                toc = new AIMapToc(map);
                $('#tocMinimize').click(minimizeToc);
                $('#tocMaximize').click(maximizeToc);
                $('#HideLayers').click(HideLayers)
                $('#ShowLayers').click(ShowLayers)
            }

            var identifyTask, identifyParams;
            on(map, "layer-add-result", function (layer) {
                if (toc != null)
                    toc.createTree("toc");
                var extentChanged = false;
                for (var i = 0; i < map.layerIds.length; i++) {
                    var layer = map.getLayer(map.layerIds[i]);
                    if (typeof (layer.isIgnoreFullExtent) != 'undefined' && layer.isIgnoreFullExtent)
                        continue;
                    if (typeof (layer.fullExtent) != 'undefined' && layer.fullExtent != null) {
                        var fullExtent = layer.fullExtent;
                        if (mapExtent == null) {
                            mapExtent = fullExtent;
                            extentChanged = true;
                        } else {
                            if (fullExtent.xmin < mapExtent.xmin) {
                                mapExtent.xmin = fullExtent.xmin;
                                extentChanged = true;
                            }
                            if (fullExtent.xmax > mapExtent.xmax) {
                                mapExtent.xmax = fullExtent.xmax;
                                extentChanged = true;
                            }
                            if (fullExtent.ymin < mapExtent.ymin) {
                                mapExtent.ymin = fullExtent.ymin;
                                extentChanged = true;
                            }
                            if (fullExtent.ymax > mapExtent.ymax) {
                                mapExtent.ymax = fullExtent.ymax;
                                extentChanged = true;
                            }
                        }
                    }
                }
                if (mapExtent != null && extentChanged) {
                    mapExtent = new Extent(mapExtent.xmin, mapExtent.ymin, mapExtent.xmax, mapExtent.ymax, map.spatialReference);
                    map.setExtent(mapExtent);
                }
            });
            on(map, 'load', function (loadedMap) {
                DrawObj = new Draw(map);
                DrawObj.on("draw-end", addToMap);

                on(map, 'mouse-move', function (mouseEvent) {
                    var mapPoint = mouseEvent.mapPoint;
                    $('#mapPos').text(mapPoint.x.toFixed(4) + ', ' + mapPoint.y.toFixed(4));
                });

                if (typeof (mapClickQueryConfigs) == 'undefined') {
                    return;
                }

                on(map, 'click', function (mouseEvent) {
                    if (!activeMapClickQuery) {
                        return;
                    }
                    identifyParams.geometry = mouseEvent.mapPoint;
                    identifyParams.mapExtent = map.extent;

                    var callbackTimes = 0,
                        currentQueryLayerId = -1;
                    var canQueryLayerIds = [];
                    //寻找map中最上层的可见的地图的地址
                    var mapClickQueryUrl = null;
                    var deferred = null;
                    for (var i = map.layerIds.length - 1; i >= 0; i--) {
                        var layerId = map.layerIds[i];
                        var findLayer = map.getLayer(layerId);
                        if ($.inArray(findLayer.url, ignoreMapClickQueryUrl) < 0 && findLayer.visible && typeof (findLayer.visibleLayers) != 'undefined' && findLayer.visibleLayers.length > 0) {
                            canQueryLayerIds.push(layerId);
                        }
                    }

                    if (canQueryLayerIds.length == 0)
                        return;

                    for (var index in canQueryLayerIds) {
                        if (deferred == null) {
                            currentQueryLayerId = canQueryLayerIds[0];
                            deferred = ExecuteIdentifyTask(canQueryLayerIds[0]);
                        } else {
                            deferred = deferred.addCallback(function (response) {
                                callbackTimes++;
                                if (response.length == 0) {
                                    currentQueryLayerId = canQueryLayerIds[callbackTimes];
                                    return ExecuteIdentifyTask(canQueryLayerIds[callbackTimes]);
                                } else {
                                    return response;
                                }
                            });
                        }
                    }
                    deferred = deferred.addCallback(function (response) {
                        var querylayer = map.getLayer(currentQueryLayerId);
                        var queryMapServerName = typeof (querylayer.servername) == 'undefined' ? querylayer.layername : querylayer.servername;
                        return arrayUtils.map(response, function (result) {
                            var feature = result.feature;
                            var layerName = result.layerName;

                            feature.attributes.layerName = layerName;
                            var content = '';

                            for (var name in feature.attributes) {
                                if (name == 'OBJECTID' || name == 'Shape' || name == 'layerName')
                                    continue;
                                var fieldName = name;
                                for (var index in AlphabetJson) {
                                    if (name == AlphabetJson[index].拼音简写.trim()) {
                                        fieldName = AlphabetJson[index].中文名;
                                        break;
                                    }
                                }
                                if (currentMapClickQueryConfig == null || $.inArray(name, currentMapClickQueryConfig.fieldNames) < 0)
                                    content += '<b>' + fieldName + '：</b>${' + name + '}<br/>';
                                else
                                    content += '<b>' + fieldName + '：</b><a href="#" value="' + feature.attributes[currentMapClickQueryConfig.jumpIdFieldName] + '" title="' + feature.attributes[currentMapClickQueryConfig.jumpTitleFieldName] + '" onClick="mapClickQueryJumpMis(this)">${' + name + '}</a><br/>';
                            }
                            feature.setInfoTemplate(new InfoTemplate(queryMapServerName + " " + layerName, content));
                            return feature;
                        });
                    });

                    function ExecuteIdentifyTask(layerId) {
                        var layer = map.getLayer(layerId);
                        if (findLayer instanceof ArcGISDynamicMapServiceLayer) {
                            identifyParams.layerIds = [];
                            for (var index in findLayer.visibleLayers)
                                identifyParams.layerIds.push(findLayer.visibleLayers[index]);
                        } else if (findLayer instanceof ArcGISTiledMapServiceLayer) {
                            identifyParams.layerIds = [0];
                        }
                        for (var index in mapClickQueryConfigs) {
                            if (mapClickQueryConfigs[index].url == layer.url)
                                currentMapClickQueryConfig = mapClickQueryConfigs[index];
                        }
                        return (new IdentifyTask(layer.url)).execute(identifyParams);
                    }

                    // InfoWindow expects an array of features from each deferred
                    // object that you pass. If the response from the task execution
                    // above is not an array of features, then you need to add a callback
                    // like the one above to post-process the response and return an
                    // array of features.
                    map.infoWindow.setFeatures([deferred]);
                    map.infoWindow.show(mouseEvent.mapPoint);
                });

                identifyParams = new IdentifyParameters();
                identifyParams.tolerance = 3;
                identifyParams.returnGeometry = true;
                identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL; //查询已定义所有服务图层号中的属性
                identifyParams.width = map.width;
                identifyParams.height = map.height;
            });
            on(map, 'zoom-end', function () {
                $('#mapScale').text('1：' + map.getScale().toFixed(0));
            });

            //根据配置加载地图
            for (var index in mapConfig) {
                var mapParameter = mapConfig[index];
                var isIgnoreFullExtent = typeof (mapParameter.isIgnoreFullExtent) == 'undefined' ? false : mapParameter.isIgnoreFullExtent;
                if (typeof (mapParameter.url) == 'undefined' || mapParameter.url.length == 0)
                    continue;
                if (mapParameter.type == 'ArcGISDynamicMapServiceLayer') {
                    var layer = new ArcGISDynamicMapServiceLayer(mapParameter.url);
                    // if(typeof(mapParameter.visible) != 'undefined'){
                    //     layer.visible = mapParameter.visible;
                    // }
                    layer.servername = mapParameter.servername;
                    layer.isIgnoreFullExtent = isIgnoreFullExtent;
                    map.addLayer(layer);
                } else if (mapParameter.type == 'WFSLayer') {
                    var opts = {
                        "url": mapParameter.url,
                        "version": '1.1.0',
                        "name": mapParameter.layerName,
                        "maxFeatures": 100
                    };
                    isUseProxy = true;
                    var wfsLayer = new WFSLayer();
                    wfsLayer.fromJson(opts);
                    var layerUrlSplits = mapParameter.url.split('/');
                    wfsLayer.servername = layerUrlSplits[layerUrlSplits.length - 3];
                    wfsLayer.layername = mapParameter.layerName;
                    map.addLayer(wfsLayer);

                    map.centerAndZoom(new Point(114.83, 24.48, {
                        "wkid": 4326
                    }), 11);
                } else if (mapParameter.type == 'ArcGISTiledMapServiceLayer') {
                    var tiledLayer = new ArcGISTiledMapServiceLayer(mapParameter.url);
                    tiledLayer.layername = mapParameter.layername;
                    tiledLayer.isIgnoreFullExtent = isIgnoreFullExtent;
                    if (typeof (mapParameter.visible) != 'undefined')
                        tiledLayer.setVisibility(mapParameter.visible);
                    map.addLayer(tiledLayer);
                } else if (mapParameter.type == 'WMTSLayer') {
                    isUseProxy = true;
                    var layerInfo = new WMTSLayerInfo({
                        identifier: mapParameter.layerIdentifier,
                        tileMatrixSet: mapParameter.tileMatrixSetIdentifier,
                        format: mapParameter.format,
                    });
                    var options = {
                        serviceMode: mapParameter.serviceMode,
                        layerInfo: layerInfo
                    };
                    var wmtsLayer = new WMTSLayer(mapParameter.url, options);
                    wmtsLayer.layername = mapParameter.layername;
                    wmtsLayer.isIgnoreFullExtent = mapParameter.isIgnoreFullExtent;
                    map.addLayer(wmtsLayer);
                    // map.centerAndZoom(new Point(114.83, 24.48, {
                    //     "wkid": 4490
                    // }), 7);
                } else if (mapParameter.type == 'TDTLayer') {
                    var tdtLayer = new TDTLayer(mapParameter.url, mapParameter.layerIdentifier, mapParameter.style, mapParameter.tileMatrixSetIdentifier, mapParameter.format);
                    tdtLayer.layername = mapParameter.layername;
                    tdtLayer.isIgnoreFullExtent = mapParameter.isIgnoreFullExtent;
                    map.addLayer(tdtLayer);
                }
            }
            //创建地图操作对象并绑定地图操作按钮点击事件
            navToolbar = new Navigation(map);
            on(dom.byId('zoomin'), 'click', function () {
                map.setMapCursor('url(icons/ZoomInTool16.png,auto)');
                navToolbar.activate(Navigation.ZOOM_IN);
                DrawObj.deactivate();
                activeMapClickQuery = false;
            });
            on(dom.byId('zoomout'), 'click', function () {
                navToolbar.activate(Navigation.ZOOM_OUT);
                DrawObj.deactivate();
                activeMapClickQuery = false;
            });
            on(dom.byId('pan'), 'click', function () {
                navToolbar.activate(Navigation.PAN);
                DrawObj.deactivate();
                activeMapClickQuery = false;
            });
            on(dom.byId('zoomfull'), 'click', function () {
                map.setExtent(mapExtent);
                DrawObj.deactivate();
                navToolbar.deactivate();
            });
            on(dom.byId('lastextent'), 'click', function () {
                navToolbar.zoomToPrevExtent();
                DrawObj.deactivate();
                navToolbar.deactivate();
            });
            on(dom.byId('nextextent'), 'click', function () {
                navToolbar.zoomToNextExtent();
                DrawObj.deactivate();
                navToolbar.deactivate();
            });

            $(window).resize(function () {
                if (isTocMinimize) {
                    minimizeToc();
                }
            });
        }
    );
}

function minimizeToc() {
    $('#leftContentPane').css('left', '-300px');
    $('#rightContentPane').css('left', '30px');
    beforeMinimizeSize = $('#rightContentPane').outerWidth(true);
    $('.rightPane').css('width', '100%');
    $('.rightPane').css('width', $('#rightContentPane').width() - 30);
    isTocMinimize = true;
    $('#tocMaximize').show();
}

function maximizeToc() {
    $('#rightContentPane').css('left', '260px');
    $('#leftContentPane').css('left', '5px');
    $('.rightPane').css('width', beforeMinimizeSize);
    isTocMinimize = false;
    $('#tocMaximize').hide();
}

function HideLayers() {
    $('#centerContentPane').css('display', 'none');
    $('#rightContentPane').css('left', '38.7%');
    $('.rightPane').css('width', '85%');
    $('#ShowLayers').css('display', 'block');
}

function ShowLayers() {
    $('#ShowLayers').css('display', 'none');
    $('#centerContentPane').css('display', 'block');
    $('#centerContentPane').css('left', '38.7%');
    $('#rightContentPane').css('left', '54%');
    $('.rightPane').css('width', '77.5%');
}

function Dragging(validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
    var draggingObj = null; //dragging Dialog
    var diffX = 0;
    var diffY = 0;

    function mouseHandler(e) {
        switch (e.type) {
            case 'mousedown':
                draggingObj = validateHandler(e); //验证是否为可点击移动区域
                if (draggingObj != null) {
                    diffX = e.clientX - draggingObj.offsetLeft;
                    diffY = e.clientY - draggingObj.offsetTop;
                }
                break;

            case 'mousemove':
                if (draggingObj) {
                    draggingObj.style.left = (e.clientX - diffX) + 'px';
                    draggingObj.style.top = (e.clientY - diffY) + 'px';
                }
                break;

            case 'mouseup':
                draggingObj = null;
                diffX = 0;
                diffY = 0;
                break;
        }
    };

    return {
        enable: function () {
            document.addEventListener('mousedown', mouseHandler);
            document.addEventListener('mousemove', mouseHandler);
            document.addEventListener('mouseup', mouseHandler);
        },
        disable: function () {
            document.removeEventListener('mousedown', mouseHandler);
            document.removeEventListener('mousemove', mouseHandler);
            document.removeEventListener('mouseup', mouseHandler);
        }
    }
}

function getDraggingDialog(e) {
    var target = e.target;
    while (target && Object.prototype.toString.call(target.className) === "[object String]" && target.className.indexOf('esriPopupWrapper') == -1) {
        target = target.offsetParent;
    }
    if (target != null) {
        return target.offsetParent;
    } else {
        return null;
    }
}

Dragging(getDraggingDialog).enable();


//获取Url中对应参数的值
function getUrlParaValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var configIndex;
//启用地图绘制多边形模式
function activateTool(index) {
    configIndex = index;
    require(["esri/toolbars/draw"], function (Draw) {
        map.graphics.clear();
        navToolbar.deactivate();
        DrawObj.activate(Draw['POLYGON']);
        map.hideZoomSlider();
        activeMapClickQuery = false;
    });
}
//将绘制的多边形添加到地图并查询出绘制区域的耕地等别数据
function addToMap(evt) {
    require([
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "esri/graphic",
        "esri/geometry/Extent",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/tasks/query",
        "esri/tasks/QueryTask"
    ], function (
        Color, GraphicsLayer, Graphic, Extent, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Query, QueryTask
    ) {
        var symbol;
        map.graphics.clear();
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
            case "multipoint":
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol(SimpleLineSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                    new Color([255, 0, 0]), 2), new Color([255, 0, 0, 0.35]));
                break;
        }
        var graphic = new Graphic(evt.geometry, symbol);
        map.graphics.add(graphic);

        var queryTask = new QueryTask(pressureAnalysisConfig[configIndex].analyzedLayerUrl);
        var query = new Query();
        query.geometry = graphic.geometry;
        var outFields = [];
        for (var field in pressureAnalysisConfig[configIndex].analyzedFieldNames) {
            outFields.push(field);
        }
        outFields.push("Shape");
        query.outFields = outFields;
        showMash("正在统计耕地等别数据中......", function () {
            $.when(
                queryTask.execute(query, showResults, function (error) {
                    hideMash();
                    ShowMsg(error, "error");
                })).done(function () {
                    hideMash();
                })
        });
    });
}

function showResults(results) {
    FreehandAttributeQueryResultPanel = $.jsPanel({
        id: 'FreehandAttributeQueryResultPanel',
        footerToolbar: '<span style="flex:1 1 auto"></span>',
        position: {
            my: 'left-bottom',
            at: 'left-bottom'
        },
        contentSize: {
            width: function () {
                return $(window).width() - 800
            },
            height: function () {
                return $(window).height()-350
            },
        },
        headerTitle: '耕地等别统计结果',
        content: '<div style="width:100%; height:100%; overflow:auto; font-size:15px; padding:10px 10px 10px 10px"><table width="100%" class="display" id="FreehandQueryResultTable" cellspacing="0"></table><div style="height:50%;width:50%;margin-left:20%" id="GradeChart"></div></div>'
    });

    var datas = [];
    var columns = [];
    for (var field in results.fieldAliases) {
        columns.push({
            title: pressureAnalysisConfig[configIndex].analyzedFieldNames[field],
            visible: true
        });
    }
    columns.push({
        title: '地块数量',
        visible: true
    });
    var column=columns[1];
    columns[1]=columns[2];
    columns[2]=column;

    var GradeCount = {};
    var TBMJCount={};
    for (var i = 0; i < results.features.length; i++) {
        var featureAttributes = results.features[i].attributes;
        var  DbIndex;
        for (var attribute in featureAttributes) {
            if (attribute == "TBMJ") {
                var TBMJ=featureAttributes[attribute];
                if(TBMJCount[DbIndex]==null){
                    TBMJCount[DbIndex]=TBMJ;
                }else{
                    TBMJCount[DbIndex]+=TBMJ;
                }
            }else {
                DbIndex=featureAttributes[attribute];
                if (GradeCount[featureAttributes[attribute]] == null) {
                    GradeCount[featureAttributes[attribute]] = 1;
                } else {
                    var count = GradeCount[featureAttributes[attribute]];
                    GradeCount[featureAttributes[attribute]] =++count;
                }
            }
        }
    }

    var brower = [];
    var names = [];
    for (var key in GradeCount) {
        var row = [];
        row.push(key);
        row.push(GradeCount[key]);
        row.push(TBMJCount[key].toFixed(2));
        datas.push(row);

        names.push(key+"等");
        brower.push({
            name: key+"等",
            value: TBMJCount[key].toFixed(2)
        });
    }

    if (FreehandQueryResultTable != null)
        FreehandQueryResultTable.destroy();

    FreehandQueryResultTable = $('#FreehandQueryResultTable').DataTable({
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

    echartStr('耕地等别地块面积统计结果', names, brower, 'GradeChart');
}
