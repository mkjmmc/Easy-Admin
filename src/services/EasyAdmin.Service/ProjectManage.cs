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

        public bool AddUser(long ProjectID, long UserID)
        {
            var userproject = _CloudDbContext.UserProjects.FirstOrDefault(m => m.UserID == UserID && m.ProjectID == ProjectID);
            if (userproject == null)
            {
                _CloudDbContext.UserProjects.Add(new UserProject()
                {
                    ProjectID = ProjectID,
                    UserID = UserID,
                    Role = 0
                    //CreateTime = DateTimeUtility.
                });
                var _rows = _CloudDbContext.SaveChanges();
                return _rows > 0;
            }
            else
            {
                return true;
            }
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
                Role = 1
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

        public bool Update(Project model)
        {
            return base.Update(model);
        }
    }
}
