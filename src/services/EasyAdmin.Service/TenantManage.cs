using EasyAdmin.Dao.Models;
using EasyAdmin.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service
{
    public class TenantManage : ITenantManage
    {

        public User user { get; set; }

        public void Set(User user)
        {
            this.user = user;
        }
    }
}
