using System;
using System.Collections.Generic;

namespace WebGIS.Models
{
    public partial class MapService_QueryFieldConfig
    {
        public long ID { get; set; }
        public string fieldName { get; set; }
        public string formType { get; set; }
        public string options { get; set; }
        public string tipName { get; set; }
        public string notNull { get; set; }
        public string datatype { get; set; }
        public string operation { get; set; }
        public long? showseq { get; set; }
    }
}
