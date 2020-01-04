using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class MapService_MapIgnoreClickQueryConfig
    {
        public long ID { get; set; }
        public string ignoreMapClickQueryUrl { get; set; }
        public long? showseq { get; set; }
    }
}
