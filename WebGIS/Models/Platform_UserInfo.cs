using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class Platform_UserInfo
    {
        public long ID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string GUID { get; set; }
        public string IsAdministrator { get; set; }
    }
}
