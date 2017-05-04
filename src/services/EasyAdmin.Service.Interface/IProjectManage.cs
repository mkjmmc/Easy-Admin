using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface IProjectManage
    {
        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        bool Create(Project model);

        List<Project> GetListByUserID(long UserID);
        Project GetModel(long ProjectID);
        bool AddUser(long ProjectID, long UserID);
        bool Update(Project model);
    }
}
