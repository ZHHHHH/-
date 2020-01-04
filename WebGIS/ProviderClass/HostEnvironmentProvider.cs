namespace WebGIS.ProviderClass
{
    public static class HostEnvironmentProvider
    {
        /// <summary>
        /// 获取服务器根目录
        /// </summary>
        public static string ContentRootPath { get; set; }

        /// <summary>
        /// 获取服务器静态资源根目录
        /// </summary>
        public static string WebRootPath { get; set; }

        /// <summary>
        /// 获取SQL Server数据库连接字符串
        /// </summary>
        public static string ConnectionStringForSQLServer { get; set; }

        /// <summary>
        /// 获取SQLite数据库连接字符串
        /// </summary>
        public static string ConnectionStringForSQLite => "Data Source=" + WebRootPath + "/WebGIS.db";

        /// <summary>
        /// 获取评价记录存储根路径
        /// </summary>
        public static string EvaluateLogPath => ContentRootPath + "/EvaluateLog";

        /// <summary>
        /// 获取文件内容的存储根路径
        /// </summary>
        public static string ContentPath => WebRootPath + "/Content";
    }
}
