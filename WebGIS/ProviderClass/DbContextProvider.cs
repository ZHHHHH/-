using Microsoft.EntityFrameworkCore;
using WebGIS.Models;

namespace WebGIS.ProviderClass
{
    /// <summary>
    /// 数据库对象提供类
    /// </summary>
    public static class DbContextProvider
    {
        /// <summary>
        /// 数据库操作对象
        /// </summary>
        public static DbContext dbContext
        {
            get
            {
                return MyServiceProvider.GetDbContextService<WebGISContext>();
            }
        }
    }
}