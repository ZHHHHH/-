using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebGIS.BusinessClass
{
    enum TableNames
    {
        /// <summary>
        /// 用户信息表
        /// </summary>
        Platform_UserInfo,

        /// <summary>
        /// 地图服务配置表
        /// </summary>
        MapService_Config,

        /// <summary>
        /// 地图服务属性查询配置表
        /// </summary>
        MapService_QueryLayerConfig,

        /// <summary>
        /// 地图服务属性查询字段配置表
        /// </summary>
        MapService_QueryFieldConfig,

        /// <summary>
        /// 地图服务压占分析配置表
        /// </summary>
        MapService_PressureAnalysisConfig,

        /// <summary>
        /// 地图服务忽略点击查询配置表
        /// </summary>
        MapService_MapIgnoreClickQueryConfig
    }
}
