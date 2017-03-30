using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface IUserInvitationManage
    {
        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        bool Create(UserInvitation model);
        UserInvitation GetModel(long UserID, string Email);
        UserInvitation GetModel(string  Code);
        bool Update(UserInvitation model);
    }
}
