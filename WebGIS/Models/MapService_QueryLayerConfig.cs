using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class MapService_QueryLayerConfig
    {
        public long ID { get; set; }
        public string chineseName { get; set; }
        public string layerUrl { get; set; }
        public string fieldNames { get; set; }
        public string jumpIdFieldName { get; set; }
        public string jumpTitleFieldName { get; set; }
        public string jumpUrl { get; set; }
        public long? showseq { get; set; }
    }
}
