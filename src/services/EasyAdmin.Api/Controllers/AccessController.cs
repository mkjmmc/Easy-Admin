using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Code;
using EasyAdmin.Api.Models;

namespace EasyAdmin.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AccessController : Controller
    {
        private readonly IUserManage _UserManage;
        private readonly ITenantManage _TenantManage;
        public AccessController(IUserManage UserManage
            , ITenantManage TenantManage)
        {
            _UserManage = UserManage;
            _TenantManage = TenantManage;
        }
        //// GET api/values
        //[HttpGet]
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET api/values/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/values
        [HttpGet]
        [ServiceFilter(typeof(AuthorizeFilter))]
        public ResponseMessage GetInfo()
        {
            var user = _TenantManage.user;
            return new ResponseMessage(MessageResult.Success, "", new
            {
                user.Email,
                user.LoginKey
            });
        }


        // POST api/values
        [HttpPost]
        public ResponseMessage Signin([FromBody]SigninModel model)
        {
            var user = _UserManage.GetModelByEmail(model.username);
            if (user != null && user.Password == model.password)
            {
                // 登录操作
                user.LoginKey = Guid.NewGuid().ToString("N");
                user.LastLoginTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now);
                _UserManage.Update(user);
                return new ResponseMessage(MessageResult.Success, "登录成功", new
                {
                    user.Email,
                    user.LoginKey
                });
            }
            return new ResponseMessage( MessageResult.Error, "用户名或密码错误");
        }

        [HttpPost]
        public ResponseMessage Signup([FromBody]SignupModel model)
        {
            var user = _UserManage.GetModelByEmail(model.email);
            if (user != null)
            {
                // 邮箱已注册过
                return new ResponseMessage(MessageResult.Error, "您已经注册过账号，请直接登录");
            }
            var result = _UserManage.Create(new Dao.Models.User()
            {
                Email = model.email,
                CreateTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now),
                Password = model.password,
                Nickname = model.name
            });
            if (result)
            {
                return new ResponseMessage(MessageResult.Success, "注册成功");
            }
            return new ResponseMessage(MessageResult.Error, "用户名或密码错误");
        }

        // PUT api/values/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/values/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }

}
