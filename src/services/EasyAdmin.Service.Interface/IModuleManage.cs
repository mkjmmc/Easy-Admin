using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface IModuleManage
    {
        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        bool Create(Module model);

        List<Module> GetListByProjectID(long ProjectID);
    }
}
