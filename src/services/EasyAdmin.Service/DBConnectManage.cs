using EasyAdmin.Dao;
using EasyAdmin.Dao.Models;
using EasyAdmin.Service.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace EasyAdmin.Service
{
    public class DBConnectManage : Repository<DBConnect>, IDBConnectManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public DBConnectManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
            _CloudDbContext = CloudDbContext;
        }

        public bool Create(DBConnect model)
        {
            return base.Save(model);
            //_CloudDbContext.Projects.Add(model);
            //_CloudDbContext.SaveChanges();
            //_CloudDbContext.UserProjects.Add(new UserProject()
            //{
            //    ProjectID = model.ID,
            //    CreateTime = model.CreateTime,
            //    UserID = model.UserID,
            //    Role = 1
            //});
            //return _CloudDbContext.SaveChanges() > 0;
        }

        public List<DBConnect> GetListByProjectID(long ProjectID)
        {
            return base.LoadListAll(m => m.ProjectID == ProjectID);
        }

        public DBConnect GetModel(long ID)
        {
            return base.Get(m => m.ID == ID);
        }
    }
}
