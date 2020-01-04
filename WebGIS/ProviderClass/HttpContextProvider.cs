using Microsoft.AspNetCore.Http;

namespace WebGIS.ProviderClass
{
    /// <summary>
    /// HttpContext提供对象
    /// </summary>
    public static class HttpContextProvider
    {
        /// <summary>
        /// HttpContextAccessor
        /// </summary>
        public static IHttpContextAccessor httpContextAccessor { get; set; }

        /// <summary>
        /// 获取HttpContext上下文对象
        /// </summary>
        public static HttpContext HttpContext
        {
            get
            {
                return httpContextAccessor.HttpContext;
            }
        }
    }
}
