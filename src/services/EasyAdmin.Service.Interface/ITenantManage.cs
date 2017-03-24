using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface ITenantManage
    {
        void Set(User user);

        User user { get; set; }
    }
}
