using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Interface
{
    /// <summary>
    /// Describe：工作单元接口
    /// Author：yuangang
    /// Date：2016/07/16
    /// Blogs:http://www.cnblogs.com/yuangang
    /// </summary>
    public interface IUnitOfWork
    {
        bool Commit();
    }
}
