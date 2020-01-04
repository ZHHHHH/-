using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;

namespace WebGIS.ProviderClass
{
    public static class MyServiceProvider
    {
        public static IServiceProvider ServiceProvider { get; set; }

        public static T GetService<T>() => ServiceProvider.GetService<T>();

        public static T GetDbContextService<T>() => ServiceProvider.CreateScope().ServiceProvider.GetService<T>();

        public static IEnumerable<T> GetServices<T>() => ServiceProvider.GetServices<T>();


    }
}
