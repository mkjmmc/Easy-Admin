﻿using EasyAdmin.Dao;
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
    public class PageManage : Repository<Page>, IPageManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public PageManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
            _CloudDbContext = CloudDbContext;
        }

        public bool Create(Page model)
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

        public List<Page> GetListByProjectID(long ProjectID)
        {
            return base.LoadAll(m => m.ProjectID == ProjectID && m.IsDelete == 0).OrderBy(m=>m.OrderBy).ToList();
        }

        public Page GetModel(long ID)
        {
            return base.Get(m => m.ID == ID);
        }

        public bool Update(Page model)
        {
            return base.Update(model);
        }
    }
}
