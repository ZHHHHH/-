using System.Data;
using System.Data.SQLite;
using WebGIS.ProviderClass;

namespace WebGIS.ToolClass
{
    public static class SQLiteHelper
    {
        /// <summary>
        /// 查询数据
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static DataTable GetDataTable(string sql)
        {
            using SQLiteConnection sqlcon = new SQLiteConnection(HostEnvironmentProvider.ConnectionStringForSQLite);
            SQLiteDataAdapter adapter = new SQLiteDataAdapter(sql, sqlcon);
            DataTable dataTable = new DataTable();
            adapter.Fill(dataTable);
            return dataTable;
        }

        /// <summary>
        /// 返回第一行第一列
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public static object ExecuteScalar(string sql)
        {
            using SQLiteConnection sqlcon = new SQLiteConnection(HostEnvironmentProvider.ConnectionStringForSQLite);
            sqlcon.Open();
            SQLiteCommand sqlcommand = new SQLiteCommand(sql, sqlcon);
            return sqlcommand.ExecuteScalar();
        }

    }
}
