using System;
using System.Linq;
using EasyAdmin.Dao;
using EasyAdmin.Dao.Models;
using EasyAdmin.Service.Interface;
using System.Collections.Generic;

namespace EasyAdmin.Service
{
    public class UserManage : Repository<User>, IUserManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public UserManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
            _CloudDbContext = CloudDbContext;
        }

        public bool Create(User model)
        {
            return base.Save(model);
        }

        public User GetModelByAppKey(string key)
        {
            return base.Get(m => m.LoginKey == key);
        }

        public User GetModelByEmail(string Email)
        {
            return base.Get(m => m.Email == Email);
        }

        public bool Update(User model)
        {
            return base.Update(model);
        }


        public List<UserAndRole> GetListByProjectID(long ProjectID)
        {
            var query = from userproject in _CloudDbContext.UserProjects
                        join user in _CloudDbContext.Users
                        on userproject.UserID equals user.ID
                        where userproject.ProjectID == ProjectID
                        select new
                        {
                            User = user,
                            //Project = 
                            UserProject = userproject
                        };
            return query.ToList().Select(m=> new UserAndRole()
            {
                User = m.User,
                UserProject = m.UserProject
            }).ToList();
        }
    }
}
