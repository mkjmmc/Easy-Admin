using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyAdmin.Api.Models
{

    public class SignupModel
    {
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
    }
}
