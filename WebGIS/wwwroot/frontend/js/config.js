//GIS代理接口配置
var proxyUrl = 'DotNet/proxy.ashx';
var gisUrl='localhost:6080';

//坐标接口配置
var afterendFileUrl ='/File/';
var afterendUploadMultiFilesUrl = afterendFileUrl + 'UploadMultiFiles';     //坐标上传接口
var afterendGetGeometriesUrl = afterendFileUrl + 'GetGeometries';       //坐标读取返回json格式接口
var afterendDeleteUploadUrl = afterendFileUrl + 'DeleteUpload';     //删除坐标接口
var afterendLoadExcelFileUrl = afterendFileUrl + 'LoadExcelFile';     //读取字母表excel文件接口


//系统设置接口配置
var SystemConfigUrl ='/SystemConfig/';
var GetSystemConfigDataUrl = SystemConfigUrl + 'GetSystemConfigData';     //获取字典数据接口
var DeleteSystemConfigDataUrl = SystemConfigUrl + 'DeleteSystemConfigData';       //删除字典数据接口
var EditSystemConfigDataUrl = SystemConfigUrl + 'EditSystemConfigData';       //修改字典数据接口
var CreateSystemConfigDataUrl = SystemConfigUrl + 'CreateSystemConfigData';       //增加字典数据接口
var LoadMapServiceConfigUrl = SystemConfigUrl + 'LoadMapServiceConfig';       //加载地图服务配置接口
var LoadMapServiceQueryLayerConfigUrl = SystemConfigUrl + 'LoadMapServiceQueryLayerConfig';   //加载地图服务属性查询配置接口
var LoadMapServicePressureAnalysisConfigUrl = SystemConfigUrl + 'LoadMapServicePressureAnalysisConfig';   //加载地图压占分析配置接口
var LoadMapServiceMapIgnoreClickQueryConfigUrl = SystemConfigUrl + 'LoadMapServiceMapIgnoreClickQueryConfig';   //加载点击地图忽略查询配置

//用户接口配置
var HomeUrl ='/Home/';
var LoginUrl = HomeUrl + 'Login';       //登录接口
var LoginOutUrl = HomeUrl + 'LoginOut';     //登出接口


//地图比例尺设置
// var mapLods = [
//     {"level" : 0, "resolution" : 0.023794610058302804, "scale" : 10000000},
//     {"level" : 1, "resolution" : 0.01903568804664224, "scale" : 8000000},
//     {"level" : 2, "resolution" : 0.011897305029151402, "scale" : 5000000},
//     {"level" : 3, "resolution" : 0.00475892201166056, "scale" : 2000000},
//     {"level" : 4, "resolution" : 0.00237946100583028, "scale" : 1000000},
//     {"level" : 5, "resolution" : 0.0019035688046642242, "scale" : 800000},
//     {"level" : 6, "resolution" : 0.00118973050291514, "scale" : 500000},
//     {"level" : 7, "resolution" : 4.7589220116605604E-4, "scale" : 200000},
//     {"level" : 8, "resolution" : 2.3794610058302802E-4, "scale" : 100000},
//     {"level" : 9, "resolution" : 1.1897305029151401E-4, "scale" : 50000},
//     {"level" : 10, "resolution" : 4.758922011660561E-5, "scale" : 20000},
//     {"level" : 11, "resolution" : 2.3794610058302804E-5, "scale" : 10000},
//     {"level" : 12, "resolution" : 1.1897305029151402E-5, "scale" : 5000},
//     {"level" : 13, "resolution" : 4.75892201166056E-6, "scale" : 2000}
// ];

//加载地图配置
var mapConfig = {
    // '天地图': {
    //     //url: 'http://t0.tianditu.gov.cn/vec_c/wmts',
    //     type: 'TDTLayer',
    //     layerIdentifier: 'vec',
    //     style: 'default',
    //     tileMatrixSetIdentifier: 'c',
    //     format: 'tiles',
    //     layername: '天地图',
    //     isIgnoreFullExtent: 'true'
    // },
    // "2017年年度更新评价": {
    //     url: 'http://'+gisUrl+'/arcgis/rest/services/WebGIS/新泰市2017年年度更新评价/MapServer',
    //     servername: '2017年年度更新评价',
    //     layername: '2017年年度更新评价',
    //     type: 'ArcGISDynamicMapServiceLayer',
    //     isIgnoreFullExtent: 'true'
    // },
    // "2018年年度更新评价": {
    //     url: 'http://'+gisUrl+'/arcgis/rest/services/WebGIS/新泰市2018年年度更新评价/MapServer',
    //     servername: '2018年年度更新评价',
    //     layername: '2018年年度更新评价',
    //     type: 'ArcGISDynamicMapServiceLayer',
    //     isIgnoreFullExtent: 'true'
    // },
    // '耕地质量自然资源赋值分等图': {
    //     url: 'http://'+gisUrl+'/arcgis/rest/services/WebGIS/耕地质量自然资源赋值分等图/MapServer',
    //     servername: '耕地质量自然资源赋值分等图',
    //     layername: '耕地质量自然资源赋值分等图',
    //     type: 'ArcGISDynamicMapServiceLayer'
    // }
}

//统计统计、时空分析年份配置
var YearConfig = ['2017', '2018']

//时空对比分析配置
var DKDBFXConfig = {
    自然等面积分地类变化趋势分析: {
        value: "GJZRD_DLMC"
    },
    利用等面积分地类变化趋势分析: {
        value: "GJLYD_DLMC"
    },
    经济等面积分地类变化趋势分析: {
        value: "GJJJD_DLMC"
    },
    自然等面积分乡镇变化趋势分析: {
        value: "GJZRD_ZLDWMC_ZLDWDM"
    },
    利用等面积分乡镇变化趋势分析: {
        value: "GJLYD_ZLDWMC_ZLDWDM"
    },
    经济等面积分乡镇变化趋势分析: {
        value: "GJJJD_ZLDWMC_ZLDWDM"
    },
    全市耕地质量自然等分地类平均面积趋势分析: {
        value: "GJZRD_DLMC",
        Avg: true
    },
    全市耕地质量利用等分地类平均面积趋势分析: {
        value: "GJLYD_DLMC",
        Avg: true
    },
    全市耕地质量经济等分地类平均面积趋势分析: {
        value: "GJJJD_DLMC",
        Avg: true
    },
    全市耕地质量自然等分乡镇平均面积趋势分析: {
        value: "GJZRD_ZLDWMC_ZLDWDM",
        Avg: true
    },
    全市耕地质量利用等分乡镇平均面积趋势分析: {
        value: "GJLYD_ZLDWMC_ZLDWDM",
        Avg: true
    },
    全市耕地质量经济等分乡镇平均面积趋势分析: {
        value: "GJJJD_ZLDWMC_ZLDWDM",
        Avg: true
    }
}

//统计分析配置
var TJFXConfig = {
    耕地产能统计: {
        value: "耕地产能统计"
    },
    自然等面积分地类统计表: {
        value: "GJZRD_DLMC"
    },
    利用等面积分地类统计表: {
        value: "GJLYD_DLMC"
    },
    经济等面积分地类统计表: {
        value: "GJJJD_DLMC"
    },
    自然等面积分乡镇统计表: {
        value: "GJZRD_ZLDWMC_ZLDWDM"
    },
    利用等面积分乡镇统计表: {
        value: "GJLYD_ZLDWMC_ZLDWDM"
    },
    经济等面积分乡镇统计表: {
        value: "GJJJD_ZLDWMC_ZLDWDM"
    }
}

//字典配置-参数配置表配置
//field:对于数据库的字段名称
//title:字段别名
//formType：提供用户输入内容的表单类型，现支持：select，input；若不定义，则表示不在新增或编辑界面上显示该字段
//options：对于类型为select提供值选择，返回值为数组类型;
//datatype：字段类型，支持：string（字符型）,int(数字型)
//formatter：格式显示规则
//visible:表示是否显示列 值：true、false 若不定义，默认为true
//isNotNull:表示新增或编辑界面中需要填写的是否允许为空，值：true、false,若不定义，默认为true
var parameterConfig = {
    耕地质量等别划分表: {
        tableName: "CNPJ_GDZLDBHF",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'Bottom',
                    title: '下限',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'Top',
                    title: '上限',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'DB',
                    title: '等别',
                    formType:'select',
                    options: function () {
                        return ["优","良","中","低"];
                    },
                    datatype:'string'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    耕地质量产能等别划分表: {
        tableName: "CNPJ_GDCNDBHF",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'Bottom',
                    title: '下限',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'Top',
                    title: '上限',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'DB',
                    title: '等别',
                    formType:'select',
                    options:function(){
                        var arry=[];
                        for (var i = 1; i <= 15; i++) {
                            arry.push(i);
                        }
                        return arry;
                    },
                    datatype:'string'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    因素分值表: {
        tableName: "CNPJ_YSFZ",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'ZBMC',
                    title: '指标名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'ZBDM',
                    title: '指标代码',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'Bottom',
                    title: '下限',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'Top',
                    title: '上限',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'YSJ',
                    title: '因素级',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'YSFZ',
                    title: '因素分值',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'Describe',
                    title: '描述',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    因素分值权重表: {
        tableName: "CNPJ_YSFZQZ",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'MXNC',
                    title: '模型名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'YJZB',
                    title: '一级指标名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'EJZBMC',
                    title: '二级指标名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'ZDDM',
                    title: '指标代码',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'EJZBSX',
                    title: '二级指标属性',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'QZ',
                    title: '权重',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    自然资源资产类型表: {
        tableName: "ResourcesEval_sources",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'thename',
                    title: '自然资源资产类型名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'src',
                    title: '表名',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'sourcetype',
                    title: '当前应用方案ID',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'layername',
                    title: '图层路径',
                    formType:'input',
                    datatype:'string',
                    formatter: ValueSubstring
                },
                {
                    field: 'resultField',
                    title: '赋值结果字段',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'showseq',
                    title: '优先级',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    }
}

var systemConfig = {
    用户信息配置表: {
        tableName: "Platform_UserInfo",
        icon:"fa fa-user",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'UserName',
                    title: '用户名',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'ComfirmPassword',
                    title: '旧密码(若为新增用户,此处忽略填写)',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false,
                    visible:false
                },
                {
                    field: 'UpdatePassword',
                    title: '新密码',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false,
                    visible:false
                },
                {
                    field: 'ComfirmUpdatePassword',
                    title: '确认密码',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false,
                    visible:false
                },
                {
                    field: 'IsAdministrator',
                    title: '是否为管理员',
                    formType:'select',
                    options: function () {
                        return ["是","否"];
                    },
                    datatype:'string'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    地图服务配置表: {
        tableName: "MapService_Config",
        icon: "fa fa-map",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'url',
                    title: '地图服务地址',
                    formType:'input',
                    datatype:'string',
                    formatter: ValueSubstring
                },
                {
                    field: 'type',
                    title: '地图服务类型',
                    formType:'select',
                    options: function () {
                        return ["ArcGISDynamicMapServiceLayer","ArcGISTiledMapServiceLayer","WMTSLayer","TDTLayer"];
                    }
                },
                {
                    field: 'isIgnoreFullExtent',
                    title: '图层忽略初始定位',
                    formType:'select',
                    options: function () {
                        return ["是","否"];
                    }
                },
                {
                    field: 'servername',
                    title: '地图服务名称',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'layername',
                    title: '图层名称',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'visible',
                    title: '是否可见',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'layerIdentifier',
                    title: '加载图层ID',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'tileMatrixSetIdentifier',
                    title: 'tileMatrixSetIdentifier',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'format',
                    title: '切片图片格式',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'serviceMode',
                    title: 'WMTS地图服务',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'style',
                    title: '样式ID',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'showseq',
                    title: '图层显示优先级(值越小优先级越高)',
                    formType:'select',
                    options: function () {
                        var showseq=[];
                        for(var i=1;i<=20;i++){
                            showseq.push(i);
                        }
                        return showseq;
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    地图服务属性查询图层配置表: {
        tableName: "MapService_QueryLayerConfig",
        icon: "fa fa-map-signs",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'chineseName',
                    title: '地图服务名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'layerUrl',
                    title: '地图服务地址',
                    formType:'input',
                    datatype:'string',
                    formatter: ValueSubstring
                },
                {
                    field: 'fieldNames',
                    title: '显示列名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'jumpIdFieldName',
                    title: '列名称',
                    visible:false
                },
                {
                    field: 'jumpTitleFieldName',
                    title: '列名称',
                    visible:false
                },
                {
                    field: 'jumpUrl',
                    title: '跳转地址',
                    visible:false
                },
                {
                    field: 'showseq',
                    title: '下拉框显示顺序(值越小显示越靠前)',
                    formType:'select',
                    options: function () {
                        var showseq=[];
                        for(var i=1;i<=10;i++){
                            showseq.push(i);
                        }
                        return showseq;
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    地图服务属性查询字段配置表: {
        tableName: "MapService_QueryFieldConfig",
        icon: "fa fa-columns",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'tipName',
                    title: '字段名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'fieldName',
                    title: '查询字段',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'formType',
                    title: '表单类型(若为input,下拉框内容忽略填写)',
                    formType:'select',
                    options: function () {
                        return ["input","select"];
                    }
                },
                {
                    field: 'options',
                    title: '下拉框内容',
                    formType:'input',
                    datatype:'string',
                    isNotNull:false
                },
                {
                    field: 'notNull',
                    title: '值不允许为空',
                    formType:'select',
                    options: function () {
                        return ["是","否"];
                    }
                },
                {
                    field: 'datatype',
                    title: '字段类型',
                    formType:'select',
                    options: function () {
                        return ["string","numberic"];
                    }
                },
                {
                    field: 'operation',
                    title: '条件匹配符',
                    formType:'select',
                    options: function () {
                        return ["like","="];
                    }
                },
                {
                    field: 'showseq',
                    title: '显示顺序(值越小显示越靠前)',
                    formType:'select',
                    options: function () {
                        var showseq=[];
                        for(var i=1;i<=10;i++){
                            showseq.push(i);
                        }
                        return showseq;
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    地图服务查询耕地等别配置表: {
        tableName: "MapService_PressureAnalysisConfig",
        icon: "fa fa-map-pin",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'name',
                    title: '服务名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'analyzedLayerUrl',
                    title: '地图服务地址',
                    formType:'input',
                    datatype:'string',
                    formatter: ValueSubstring
                },
                {
                    field: 'analyzedFieldNames',
                    title: '显示结果字段',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'isSingle',
                    title: '字段分析类型(若为是填写主要字段,否填写首行列字段名)',
                    visible:false
                    // formType:'select',
                    // options: function () {
                    //     return ["是","否"];
                    // }
                },
                {
                    field: 'mainField',
                    title: '主要字段',
                    visible:false
                    // formType:'input',
                    // datatype:'string',
                    // isNotNull:false
                },
                {
                    field: 'firstColumnName',
                    title: '首行列字段名',
                    visible:false
                    // formType:'input',
                    // datatype:'string',
                    // isNotNull:false
                },
                {
                    field: 'realAreaFieldName',
                    title: '面积字段名称',
                    visible:false
                    // formType:'input',
                    // datatype:'string'
                },
                {
                    field: 'serverType',
                    title: '地图服务类型',
                    formType:'select',
                    options: function () {
                        return ["mapserver"];
                    }
                },
                {
                    field: 'showseq',
                    title: '显示顺序(值越小显示越靠前)',
                    formType:'select',
                    options: function () {
                        var showseq=[];
                        for(var i=1;i<=10;i++){
                            showseq.push(i);
                        }
                        return showseq;
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    },
    地图服务忽略点击查询配置表: {
        tableName: "MapService_MapIgnoreClickQueryConfig",
        icon: "fa fa-map-marker",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'ignoreMapClickQueryUrl',
                    title: '忽略查询地图服务地址',
                    formType:'input',
                    datatype:'string',
                    formatter: ValueSubstring
                },
                {
                    field: 'showseq',
                    title: '表格显示顺序(值越小显示越靠前)',
                    formType:'select',
                    options: function () {
                        var showseq=[];
                        for(var i=1;i<=10;i++){
                            showseq.push(i);
                        }
                        return showseq;
                    }
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    }
}


var ZRZYFZConfig = {
    自然资源赋值规则表: {
        tableName: "ResourcesEval_rules",
        columns:
            [
                {
                    field: 'ID',
                    title: '序号',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },
                {
                    field: 'thename',
                    title: '规则名称',
                    formType:'input',
                    datatype:'string'
                },
                {
                    field: 'filter',
                    title: '规则条件',
                    formType:'jspanel'
                },
                {
                    field: 'resultValue',
                    title: '赋值',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'showseq',
                    title: '优先级',
                    formType:'input',
                    datatype:'int'
                },
                {
                    field: 'operate',
                    title: '操作',
                    formatter: actionFormatter //自定义方法，添加操作按钮
                }
            ]
    }
}

//红线wkid配置
var redLineWkid = '4490';


//地图点击查询配置
 var ignoreMapClickQueryUrl = [];
var mapClickQueryConfigs = {
    // GBNT:{
    //     url: mapConfig['2017年年度更新评价'].url,
    //     fieldNames:["YSDM", "项目名称", "项目ID"],
    //     jumpIdFieldName: '项目ID',
    // 	jumpTitleFieldName: '项目名称',
    //     jumpUrl: misUrl + '/Mis/Web/WebForms/AdmFineUI/NewGBNT/main.aspx?GBNT_id='
    // }
};


//属性查询配置
var xianCode = '';//目前没用到该值
var linkFieldNames = []; //查询结果显示时需要以超链接方式显示的字段名称
var queryFieldConfig = {
    //查询窗体字段筛选条件配置：
    //fieldName，查询图层中对应字段的名称；
    //formType：提供用户输入内容的表单类型，现支持：chineseRegion，select，input；
    //options：对于类型为select提供值选择;
    //tipName：表单标题
    //notNull：是否不能为空（是否必填）
    //datatype：字段在图层中的类型，先支持：stirng（字符型）,numberic(数字型)

    // ZLDWMC: {
    //     fieldName: 'ZLDWMC',
    //     formType: 'input',
    //     tipName: '座落行政区名称',
    //     notNull: true,
    //     datatype: 'string',
    //     operation: 'like'
    // },
    // DLMC: {
    //     fieldName: 'DLMC',
    //     formType: 'select',
    //     tipName: '地类名称',
    //     options: function () {
    //         return { '': '全部', 旱地: '旱地', 水浇地: '水浇地' };
    //     },
    //     notNull: true,
    //     datatype: 'string',
    //     operation: 'like'
    // }
};
//查询图层配置
var queryLayerConfig = {
    // "2017年年度更新评价": {
    //     chineseName: '2017年年度更新评价',
    //     layerUrl: 'http://localhost:6080/arcgis/rest/services/WebGIS/新泰市2017年年度更新评价/MapServer/0',
    //     fieldNames: {
    //         YSDM: '要素代码',
    //         DLMC: '地类名称',
    //         ZLDWMC: '座落单位名称',
    //         BZGZZD: '标准耕作制度'
    //     },
    //     jumpIdFieldName: '',
    //     jumpTitleFieldName: '',
    //     jumpUrl: ''
    // },
    // "2018年年度更新评价": {
    //     chineseName: '2018年年度更新评价',
    //     //layerUrl: mapConfig['2018年年度更新评价'].url + '/0',
    //     fieldNames: {
    //         YSDM: '要素代码',
    //         DLMC: '地类名称',
    //         ZLDWMC: '座落单位名称',
    //         BZGZZD: '标准耕作制度'
    //     },
    //     jumpIdFieldName: '',
    //     jumpTitleFieldName: '',
    //     jumpUrl: ''
    // }
};

//压占分析配置
var pressureAnalysisConfig = [
    // {
    //     name: '2017年年度更新评价',
    //     //analyzedLayerUrl: mapConfig['2017年年度更新评价'].url + '/0',
    //     analyzedFieldNames: {
    //         YSDM: '要素代码',
    //         DLMC: '地类名称',
    //         ZLDWMC: '座落单位名称',
    //         GJLYD: '国家利用等',
    //         TBMJ: "图斑面积"
    //     },
    //     analyzedType: { //表示分析字段类型
    //         isSingle: true, //true为单字段类型，压占结果为一个字段+压占面积，其他字段跟随这个字段显示，不参与压占分析，false则相反
    //         mainField: 'DLMC'
    //     },
    //     realAreaFieldName: 'TBMJ',
    //     serverType: 'mapserver'
    // },
    // {
    //     name: '2018年年度更新评价',
    //     //analyzedLayerUrl: mapConfig['2018年年度更新评价'].url + '/0',
    //     analyzedFieldNames: {
    //         YSDM: '要素代码',
    //         DLMC: '地类名称',
    //         ZLDWMC: '座落单位名称',
    //         GJLYD: '国家利用等',
    //         TBMJ: "图斑面积"
    //     },
    //     analyzedType: { //表示分析字段类型
    //         isSingle: true, //true为单字段类型，压占结果为一个字段+压占面积，其他字段跟随这个字段显示，不参与压占分析，false则相反
    //         mainField: 'DLMC',
    //     },
    //     realAreaFieldName: 'TBMJ',
    //     serverType: 'mapserver'
    // }
];

//添加操作列的内容
function actionFormatter(value, row, index) {
    var result = "";
    result += "<a href='javascript:;' class='btn btn-primary' onclick=\"InitModel(" + row.ID + ")\" title='编辑'><span class='fa fa-edit'></span></a> ";
    result += "<a href='javascript:;' class='btn btn-danger' onclick=\"DeleteByIds('" + row.ID + "')\" title='删除'><span class='fa fa-trash'></span></a>";
    return result;
}

//表单元格字符串长度截取限制显示
function ValueSubstring(value, row, index) {
    // if (value != null) {
    //     if (value.length > 15) {
    //         return value.substring(0, 15) + ".....";
    //     }
    // }
    return value;
}


//限定input-text只能输入数字
function onblurEvent(obj){
    if (!/^\d+(\.\d+)?$/.test(obj.value)&&obj.value!=""){
        obj.value="";
    }
}





