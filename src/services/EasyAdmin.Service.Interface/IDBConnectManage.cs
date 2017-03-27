using EasyAdmin.Dao.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Service.Interface
{
    public interface IDBConnectManage
    {
        /// <summary>
        /// 创建
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        bool Create(DBConnect model);

        List<DBConnect> GetListByProjectID(long ProjectID);

        DBConnect GetModel(long ID);
        bool Update(DBConnect model);
    }
}
