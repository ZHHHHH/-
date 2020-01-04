using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class MapService_Config
    {
        public long ID { get; set; }
        public string url { get; set; }
        public string type { get; set; }
        public string isIgnoreFullExtent { get; set; }
        public string servername { get; set; }
        public string layername { get; set; }
        public string visible { get; set; }
        public string layerIdentifier { get; set; }
        public string tileMatrixSetIdentifier { get; set; }
        public string format { get; set; }
        public string serviceMode { get; set; }
        public string style { get; set; }
        public long? showseq { get; set; }
    }
}
