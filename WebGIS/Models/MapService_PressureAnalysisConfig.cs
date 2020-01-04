using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class MapService_PressureAnalysisConfig
    {
        public long ID { get; set; }
        public string name { get; set; }
        public string analyzedLayerUrl { get; set; }
        public string analyzedFieldNames { get; set; }
        public string isSingle { get; set; }
        public string mainField { get; set; }
        public string firstColumnName { get; set; }
        public string realAreaFieldName { get; set; }
        public string serverType { get; set; }
        public long? showseq { get; set; }
    }
}
