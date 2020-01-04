using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using WebGIS.BusinessClass;
using WebGIS.Models;
using WebGIS.ProviderClass;
using WebGIS.ToolClass;

namespace WebGIS.Controllers
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class SystemConfigController : ControllerBase
    {
        WebGISContext DbContext = DbContextProvider.dbContext as WebGISContext;

        [HttpPost]
        /// <summary>
        /// 获取配置数据
        /// </summary>
        /// <param name="PageRowCount">行总数</param>
        /// <param name="PageIndex">页码</param>
        /// <param name="TableName">表名</param>
        /// <returns></returns>
        public IActionResult GetSystemConfigData([FromForm]int PageRowCount, [FromForm]int PageIndex, [FromForm]string TableName)
        {
            try
            {
                IQueryable<object> data = null;
                TableNames tableNames = (TableNames)Enum.Parse(typeof(TableNames), TableName);
                switch (tableNames)
                {
                    case TableNames.Platform_UserInfo:
                        data = DbContext.Platform_UserInfo.Where(s => true);
                        break;
                    case TableNames.MapService_Config:
                        data = DbContext.MapService_Config.Where(s => true).OrderBy(v => v.showseq);
                        break;
                    case TableNames.MapService_QueryLayerConfig:
                        data = DbContext.MapService_QueryLayerConfig.Where(s => true).OrderBy(v => v.showseq);
                        break;
                    case TableNames.MapService_QueryFieldConfig:
                        data = DbContext.MapService_QueryFieldConfig.Where(s => true).OrderBy(v => v.showseq);
                        break;
                    case TableNames.MapService_PressureAnalysisConfig:
                        data = DbContext.MapService_PressureAnalysisConfig.Where(s => true).OrderBy(v => v.showseq);
                        break;
                    case TableNames.MapService_MapIgnoreClickQueryConfig:
                        data = DbContext.MapService_MapIgnoreClickQueryConfig.Where(s => true).OrderBy(v => v.showseq);
                        break;
                }

                var rows = data.ToList().Skip(PageIndex).Take(PageRowCount);
                return new JsonResult(new { total = data.Count(), rows = rows });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 0, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 修改配置数据
        /// </summary>
        /// <returns></returns>
        public IActionResult EditSystemConfigData(
            [FromForm]string TableName,
            [FromForm]int ID,
            [FromForm]Platform_UserInfo platform_UserInfoModel,
            [FromForm]MapService_Config mapService_ConfigModel,
            [FromForm]MapService_QueryLayerConfig mapService_QueryLayerConfigModel,
            [FromForm]MapService_QueryFieldConfig mapService_QueryFieldConfigModel,
            [FromForm]MapService_PressureAnalysisConfig mapService_PressureAnalysisConfigModel,
            [FromForm]MapService_MapIgnoreClickQueryConfig mapService_MapIgnoreClickQueryConfigModel
         )
        {
            try
            {
                TableNames tableNames = (TableNames)Enum.Parse(typeof(TableNames), TableName);

                if (tableNames == TableNames.Platform_UserInfo)
                {
                    string ComfirmPassword = Request.Form["ComfirmPassword"];
                    string UpdatePassword = Request.Form["UpdatePassword"];
                    string ComfirmUpdatePassword = Request.Form["ComfirmUpdatePassword"];

                    if (!string.IsNullOrEmpty(ComfirmPassword) && (string.IsNullOrEmpty(UpdatePassword) || string.IsNullOrEmpty(ComfirmUpdatePassword)))
                    {
                        return new JsonResult(new { code = 1, data = "若要修改密码,确认密码、修改密码、确认修改密码不能为空" });
                    }
                    if (!string.IsNullOrEmpty(UpdatePassword) && (string.IsNullOrEmpty(ComfirmPassword) || string.IsNullOrEmpty(ComfirmUpdatePassword)))
                    {
                        return new JsonResult(new { code = 1, data = "若要修改密码,确认密码、修改密码、确认修改密码不能为空" });
                    }
                    if (!string.IsNullOrEmpty(ComfirmUpdatePassword) && (string.IsNullOrEmpty(UpdatePassword) || string.IsNullOrEmpty(ComfirmPassword)))
                    {
                        return new JsonResult(new { code = 1, data = "若要修改密码,确认密码、修改密码、确认修改密码不能为空" });
                    }



                    if (!string.IsNullOrEmpty(ComfirmPassword) && !string.IsNullOrEmpty(UpdatePassword) && !string.IsNullOrEmpty(ComfirmUpdatePassword))
                    {
                        if (UpdatePassword != ComfirmUpdatePassword)
                        {
                            return new JsonResult(new { code = 1, data = "修改密码和确认修改密码不一致" });
                        }
                        ComfirmPassword = MD5EncryptionCom.MD5Encrypt(ComfirmPassword);
                        var userInfo = DbContext.Platform_UserInfo.Where(s => s.ID == ID && s.Password == ComfirmPassword).FirstOrDefault();
                        if (userInfo == null)
                        {
                            return new JsonResult(new { code = 1, data = "确认密码错误,请重新输入" });
                        }

                        userInfo.UserName = platform_UserInfoModel.UserName;
                        userInfo.Password = MD5EncryptionCom.MD5Encrypt(UpdatePassword);
                        userInfo.IsAdministrator = platform_UserInfoModel.IsAdministrator;
                    }
                    else
                    {
                        var userInfo = DbContext.Platform_UserInfo.Where(s => s.ID == ID).FirstOrDefault();
                        userInfo.UserName = platform_UserInfoModel.UserName;
                        userInfo.IsAdministrator = platform_UserInfoModel.IsAdministrator;
                    }
                }
                else if (tableNames == TableNames.MapService_Config)
                {
                    DbContext.MapService_Config.Update(mapService_ConfigModel);
                }
                else if (tableNames == TableNames.MapService_QueryLayerConfig)
                {
                    DbContext.MapService_QueryLayerConfig.Update(mapService_QueryLayerConfigModel);
                }
                else if (tableNames == TableNames.MapService_QueryFieldConfig)
                {
                    DbContext.MapService_QueryFieldConfig.Update(mapService_QueryFieldConfigModel);
                }
                else if (tableNames == TableNames.MapService_PressureAnalysisConfig)
                {
                    DbContext.MapService_PressureAnalysisConfig.Update(mapService_PressureAnalysisConfigModel);
                }
                else if (tableNames == TableNames.MapService_MapIgnoreClickQueryConfig)
                {
                    DbContext.MapService_MapIgnoreClickQueryConfig.Update(mapService_MapIgnoreClickQueryConfigModel);
                }

                DbContext.SaveChanges();
                return new JsonResult(new { code = 0, data = "修改成功" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 增加配置数据
        /// </summary>
        /// <returns></returns>
        public IActionResult CreateSystemConfigData(
            [FromForm]string TableName,
            [FromForm]int ID,
            [FromForm]Platform_UserInfo platform_UserInfoModel,
            [FromForm]MapService_Config mapService_ConfigModel,
            [FromForm]MapService_QueryLayerConfig mapService_QueryLayerConfigModel,
            [FromForm]MapService_QueryFieldConfig mapService_QueryFieldConfigModel,
            [FromForm]MapService_PressureAnalysisConfig mapService_PressureAnalysisConfigModel,
            [FromForm]MapService_MapIgnoreClickQueryConfig mapService_MapIgnoreClickQueryConfigModel
         )
        {
            try
            {
                TableNames tableNames = (TableNames)Enum.Parse(typeof(TableNames), TableName);
                if (tableNames == TableNames.Platform_UserInfo)
                {
                    string UpdatePassword = Request.Form["UpdatePassword"];
                    string ComfirmUpdatePassword = Request.Form["ComfirmUpdatePassword"];
                    if (string.IsNullOrEmpty(UpdatePassword) || string.IsNullOrEmpty(ComfirmUpdatePassword))
                    {
                        return new JsonResult(new { code = 1, data = "修改密码或确认修改密码为空" });
                    }
                    if (UpdatePassword != ComfirmUpdatePassword)
                    {
                        return new JsonResult(new { code = 1, data = "修改密码和确认修改密码不一致" });
                    }
                    platform_UserInfoModel.Password = MD5EncryptionCom.MD5Encrypt(UpdatePassword);
                    DbContext.Platform_UserInfo.Add(platform_UserInfoModel);
                }
                else if (tableNames == TableNames.MapService_Config)
                {
                    DbContext.MapService_Config.Add(mapService_ConfigModel);
                }
                else if (tableNames == TableNames.MapService_QueryLayerConfig)
                {
                    DbContext.MapService_QueryLayerConfig.Add(mapService_QueryLayerConfigModel);
                }
                else if (tableNames == TableNames.MapService_QueryFieldConfig)
                {
                    DbContext.MapService_QueryFieldConfig.Add(mapService_QueryFieldConfigModel);
                }
                else if (tableNames == TableNames.MapService_PressureAnalysisConfig)
                {
                    DbContext.MapService_PressureAnalysisConfig.Add(mapService_PressureAnalysisConfigModel);
                }
                else if (tableNames == TableNames.MapService_MapIgnoreClickQueryConfig)
                {
                    DbContext.MapService_MapIgnoreClickQueryConfig.Add(mapService_MapIgnoreClickQueryConfigModel);
                }
                DbContext.SaveChanges();

                return new JsonResult(new { code = 0, data = "增加数据成功!" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }

        }

        [HttpPost]
        /// <summary>
        /// 删除配置数据
        /// </summary>
        /// <returns></returns>
        public IActionResult DeleteSystemConfigData([FromForm]string TableName, [FromForm]int ID)
        {
            try
            {
                TableNames tableNames = (TableNames)Enum.Parse(typeof(TableNames), TableName);

                switch (tableNames)
                {
                    case TableNames.Platform_UserInfo:
                        DbContext.Platform_UserInfo.Remove(DbContext.Platform_UserInfo.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                    case TableNames.MapService_Config:
                        DbContext.MapService_Config.Remove(DbContext.MapService_Config.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                    case TableNames.MapService_QueryLayerConfig:
                        DbContext.MapService_QueryLayerConfig.Remove(DbContext.MapService_QueryLayerConfig.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                    case TableNames.MapService_QueryFieldConfig:
                        DbContext.MapService_QueryFieldConfig.Remove(DbContext.MapService_QueryFieldConfig.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                    case TableNames.MapService_PressureAnalysisConfig:
                        DbContext.MapService_PressureAnalysisConfig.Remove(DbContext.MapService_PressureAnalysisConfig.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                    case TableNames.MapService_MapIgnoreClickQueryConfig:
                        DbContext.MapService_MapIgnoreClickQueryConfig.Remove(DbContext.MapService_MapIgnoreClickQueryConfig.Where(s => s.ID == ID).FirstOrDefault());
                        break;
                }
                DbContext.SaveChanges();
                return new JsonResult(new { code = 0, data = "删除成功" });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 获取地图服务配置
        /// </summary>
        /// <returns></returns>
        public IActionResult LoadMapServiceConfig()
        {
            try
            {
                var data = DbContext.MapService_Config.Where(s => true).OrderByDescending(v => v.showseq).ToList();
                return new JsonResult(new { code = 0, data = data });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 获取地图服务属性查询配置
        /// </summary>
        /// <returns></returns>
        public IActionResult LoadMapServiceQueryLayerConfig()
        {
            try
            {
                var MapService_QueryLayerConfig = DbContext.MapService_QueryLayerConfig.Where(s => true).OrderBy(v => v.showseq).ToList();
                var MapService_QueryFieldConfig = DbContext.MapService_QueryFieldConfig.Where(s => true).OrderBy(v => v.showseq).ToList();
                return new JsonResult(new { code = 0, MapService_QueryLayerConfig = MapService_QueryLayerConfig, MapService_QueryFieldConfig = MapService_QueryFieldConfig });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 获取地图服务压占分析配置
        /// </summary>
        /// <returns></returns>
        public IActionResult LoadMapServicePressureAnalysisConfig()
        {
            try
            {
                var data = DbContext.MapService_PressureAnalysisConfig.Where(s => true).OrderBy(v => v.showseq).ToList();
                return new JsonResult(new { code = 0, data = data });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }

        [HttpPost]
        /// <summary>
        /// 加载点击地图忽略查询配置
        /// </summary>
        /// <returns></returns>
        public IActionResult LoadMapServiceMapIgnoreClickQueryConfig()
        {
            try
            {
                var data = DbContext.MapService_MapIgnoreClickQueryConfig.Where(s => true).OrderBy(v => v.showseq).ToList();
                return new JsonResult(new { code = 0, data = data });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }
    }
}