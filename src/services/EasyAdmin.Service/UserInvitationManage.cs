using System;
using System.Linq;
using EasyAdmin.Dao;
using EasyAdmin.Dao.Models;
using EasyAdmin.Service.Interface;
using System.Collections.Generic;


namespace EasyAdmin.Service
{
    public class UserInvitationManage : Repository<UserInvitation>, IUserInvitationManage
    {
        private readonly CloudDbContext _CloudDbContext;
        public UserInvitationManage(CloudDbContext CloudDbContext) : base(CloudDbContext)
        {
            _CloudDbContext = CloudDbContext;
        }

        public bool Create(UserInvitation model)
        {
            return base.Save(model);
        }

        public UserInvitation GetModel(string Code)
        {
            return base.Get(m => m.Code == Code);
        }

        public UserInvitation GetModel(long UserID, string Email, long ProjectID)
        {
            return base.Get(m => m.UserID == UserID && m.Email == Email && m.ProjectID == ProjectID);
        }

        public bool Update(UserInvitation model)
        {
            return base.Update(model);
        }
    }
}
