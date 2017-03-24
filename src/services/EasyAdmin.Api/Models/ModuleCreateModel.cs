using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyAdmin.Api.Models
{
    public class ModuleCreateModel
    {
        public long ProjectID { get; set; }
        public string Name { get; set; }
    }
}
