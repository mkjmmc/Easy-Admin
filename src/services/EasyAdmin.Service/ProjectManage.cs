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
    public class ProjectManage : Repository<Project>, IProjectManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public ProjectManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
            _CloudDbContext = CloudDbContext;
        }

        public bool Create(Project model)
        {
            _CloudDbContext.Projects.Add(model);
            _CloudDbContext.SaveChanges();
            _CloudDbContext.UserProjects.Add(new UserProject()
            {
                ProjectID = model.ID,
                CreateTime = model.CreateTime,
                UserID = model.UserID,
                Role =1
            });
            return _CloudDbContext.SaveChanges() > 0;
        }

        public List<Project> GetListByUserID(long UserID)
        {
            var query = from userproject in _CloudDbContext.UserProjects
                        join project in _CloudDbContext.Projects
                        on userproject.ProjectID equals project.ID
                        where userproject.UserID == UserID
                        select project;
            return query.ToList();
        }

        public Project GetModel(long ProjectID)
        {
            return base.Get(m => m.ID == ProjectID);
        }
    }
}
