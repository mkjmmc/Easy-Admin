using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface IUserManage
    {
        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        bool Create(User model);

        User GetModelByAppKey(string key);
        User GetModelByEmail(string Email);
        bool Update(User model);

    }
}
