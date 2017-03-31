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
        private readonly IProjectManage _ProjectManage;
        private readonly IUserInvitationManage _UserInvitationManage;
        private readonly ITenantManage _TenantManage;
        public AccessController(IUserManage UserManage
            , ITenantManage TenantManage
            , IUserInvitationManage UserInvitationManage
            , IProjectManage ProjectManage
            )
        {
            _UserManage = UserManage;
            _TenantManage = TenantManage;
            _UserInvitationManage = UserInvitationManage;
            _ProjectManage = ProjectManage;
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
                var url = string.Format(@"http://localhost:63342/Easy-Admin/src/index.html"); // Url.Action("invite", "Access", new { code = "", email = Email, t = DateTimeUtility.GetTimeMilliseconds(DateTime.Now) });
                var title = string.Format("欢迎你，{0}", model.name);
                var content = string.Format(@"
<div class=""easyadmin-email"" style=""background: #F2F2F2; font-family: Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 40px 0; text-align: center"">
    <div style=""font-size: 36px; font-weight: bold;margin: 30px auto; "">Easy Admin</div>
    <div class=""content-wrap"">
        <div class=""content"" lang=""zh"" style=""background: white; border: 1px solid #D9D9D9; border-radius: 3px; box-sizing: border-box; margin: 0 auto; max-width: 690px; overflow: hidden; padding: 40px 30px; text-align: center"">
            <div class=""main"">
                <p>
                    Hi，{0}，你好， 多谢注册 {1}。
                </p>
                </h2><a class=""btn"" href=""{2}"" style=""-moz-transition: all 218ms; -o-transition: all 218ms; -webkit-transition: all 218ms; background: #03A9F4; border-radius: 2px; color: white; display: block; font-size: 20px; height: 54px; line-height: 54px; margin: 30px auto; text-decoration: none; transition: all 218ms; width: 200px; color: white!important; border: 0!important; cursor: pointer !important;"" target=""_blank"">进入 Easy Admin</a>

            </div>
        </div>
    </div>
    <p class=""small"" style=""color: #BDBDBD; display: block; font-size: 12px; font-weight: normal; line-height: 22px; margin: 0 auto; margin-top: 20px; max-width: 540px; padding: 0 5px; text-align: center; word-break: normal"">邮件来自{1} 的自动提醒，无需回复。
        <br>如果您在使用中有任何的疑问或者建议， 欢迎反馈我们意见至邮件：<a style=""-moz-transition: all 218ms; -o-transition: all 218ms; -webkit-transition: all 218ms; color: #BDBDBD; text-decoration: underline; transition: all 218ms"">4824865@qq.com</a></p>
</div>", model.name, "Easy Admin - 快速后台构建工具", url);
                EmailHelper.SendEmail(model.email, title, content);
                return new ResponseMessage(MessageResult.Success, "注册成功");
            }
            return new ResponseMessage(MessageResult.Error, "用户名或密码错误");
        }

        [HttpPost]
        [ServiceFilter(typeof(AuthorizeFilter))]
        public ResponseMessage Invite(string Code, string Email)
        {
            var model = _UserInvitationManage.GetModel(Code);
            if(model== null || model.Email != Email || model.Email!= _TenantManage.user.Email)
            {
                return new ResponseMessage(MessageResult.Error, "邀请码不存在");
            }
            else
            {
                // 加入到项目中
                if(_ProjectManage.AddUser(model.ProjectID, _TenantManage.user.ID))
                {
                    return new ResponseMessage(MessageResult.Success, "");
                }
                else
                {
                    return new ResponseMessage(MessageResult.Error, "加入项目失败");
                }
            }
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
