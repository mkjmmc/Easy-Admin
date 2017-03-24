using System;
using EasyAdmin.Dao;
using EasyAdmin.Dao.Models;
using EasyAdmin.Service.Interface;

namespace EasyAdmin.Service
{
    public class UserManage : Repository<User>, IUserManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public UserManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
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
    }
}
