using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebGIS.ProviderClass;
using WebGIS.ToolClass;

namespace WebGIS.Controllers.WebAPI
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class FileController : ControllerBase
    {
        [HttpPost]
        /// <summary>
        /// 读取字母表excel文件
        /// </summary>
        /// <returns></returns>
        public IActionResult LoadExcelFile()
        {
            try
            {
                string excelPath = HostEnvironmentProvider.ContentPath + "/常用业务词汇拼音首字母字典.xls";
                DataFromExcel dataFromExcel = new DataFromExcel(excelPath);
                DataTable dataTable = dataFromExcel.GetSheetData("Sheet1");
                return new JsonResult(new { code = 0, data = dataTable });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { code = 1, data = ex.Message });
            }
        }
    }
}