using EasyAdmin.Dao.Interface;
using System;

namespace EasyAdmin.Dao
{
    /// <summary>
    /// Describe：工作单元实现类
    /// Author：yuangang
    /// Date：2016/07/16
    /// Blogs:http://www.cnblogs.com/yuangang
    /// </summary>
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        #region 数据上下文

        /// <summary>
        /// 数据上下文
        /// </summary>
        private CloudDbContext _Context;
        public UnitOfWork(CloudDbContext Context)
        {
            _Context = Context;
        }

        #endregion

        public bool Commit()
        {
            return _Context.SaveChanges() > 0;
        }

        public void Dispose()
        {
            if (_Context != null)
            {
                _Context.Dispose();
            }
            GC.SuppressFinalize(this);
        }
    }
}
