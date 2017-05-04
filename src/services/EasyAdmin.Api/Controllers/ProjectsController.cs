using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Code;
using EasyAdmin.Api.Models;
using System.Net.Mail;
using System.Net;
using EasyAdmin.Dao.Models;

namespace EasyAdmin.Api.Controllers
{
    public class ProjectsController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly IUserManage _UserManage;
        private readonly IUserInvitationManage _UserInvitationManage;
        private readonly ITenantManage _TenantManage;
        public ProjectsController(IProjectManage ProjectManage
            , ITenantManage TenantManage
            , IUserManage UserManage
            , IUserInvitationManage UserInvitationManage
            )
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
            _UserManage = UserManage;
            _UserInvitationManage = UserInvitationManage;
        }
        // GET api/values
        [HttpPost]
        public ResponseMessage List()
        {
            // 获取项目列表
            var list = _ProjectManage.GetListByUserID(_TenantManage.user.ID);
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Success, "", list);
        }

        [HttpPost]
        public ResponseMessage Create([FromBody] ProjectCreateModel model)
        {
            var result = _ProjectManage.Create(new Dao.Models.Project()
            {
                Name = model.Name,
                CreateTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now),
                IsDelete = 0,
                UserID = _TenantManage.user.ID
            });
            if (result)
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "创建项目失败");
        }

        [HttpPost]
        public ResponseMessage Update([FromBody] Project model)
        {
            if (model== null)
            {
                return new ResponseMessage(MessageResult.Error, "更新失败");
            }
            // 判断是否有权限
            var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, model.ID);
            if (userproject == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            if (_ProjectManage.Update(model))
            {
                return new ResponseMessage(MessageResult.Success, "更新成功");

            }
                return new ResponseMessage(MessageResult.Error, "更新失败");
        }

        /// <summary>
        /// 获取项目成员列表
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage Users(long ProjectID)
        {
            // 判断用户权限
            var userlist = _UserManage.GetListByProjectID(ProjectID);
            if (!userlist.Any(m => m.User.ID == _TenantManage.user.ID))
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            return new ResponseMessage(MessageResult.Success, "", userlist.Select(m => new
            {
                m.User.Nickname,
                m.User.ID,
                m.User.Email,
                m.UserProject.Role,
                m.UserProject.CreateTime
            }));
        }

        public ResponseMessage Info(long ProjectID)
        {
            // 判断是否有权限
            var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, ProjectID);
            if (userproject == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            var model = _ProjectManage.GetModel(ProjectID);
            if (model != null)
            {
                return new ResponseMessage(MessageResult.Success, "", model);
            }
            return new ResponseMessage(MessageResult.Error, "项目不存在");
        }

        /// <summary>
        /// 邀请成员加入项目
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <param name="Email"></param>
        /// <returns></returns>
        public ResponseMessage InviteJoin(long ProjectID, string Email)
        {
            // 判断是否有权限
            var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, ProjectID);
            if (userproject == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            // 只有创建者和管理员能进行邀请
            if (userproject.Role == 0)
            {
                return new ResponseMessage(MessageResult.Error, "只有创建者和管理员能进行邀请");
            }
            // 获取项目信息
            var project = _ProjectManage.GetModel(ProjectID);
            if (project == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            // 生成邀请码
            var model = _UserInvitationManage.GetModel(_TenantManage.user.ID, Email, ProjectID);
            var result = false;
            if (model == null)
            {
                model = new Dao.Models.UserInvitation()
                {
                    UserID = _TenantManage.user.ID,
                    Email = Email,
                    ProjectID = ProjectID,
                    Code = Guid.NewGuid().ToString("N"),
                    CreateTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now),
                    ExpirationTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now.AddDays(2)),
                };
                result = _UserInvitationManage.Create(model);
            }
            else
            {
                model.CreateTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now);
                model.ExpirationTime = DateTimeUtility.GetTimeMilliseconds(DateTime.Now.AddDays(2));
                result = _UserInvitationManage.Update(model);
            }
            if (result)
            {
                var acitveurl = string.Format(@"http://localhost:63342/Easy-Admin/src/index.html#/invite?code={0}&email={1}&t={2}", model.Code, model.Email, model.CreateTime); // Url.Action("invite", "Access", new { code = "", email = Email, t = DateTimeUtility.GetTimeMilliseconds(DateTime.Now) });
                var title = string.Format("{0}邀请您加入{1}项目", _TenantManage.user.Nickname, project.Name);
                var content = string.Format(@"<div class=""easyadmin-email"" style=""background: #F2F2F2; font-family: Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif; font-size: 14px; font-weight: normal; margin: 0; padding: 40px 0; text-align: center"">
    <div style=""font-size: 36px; font-weight: bold;margin: 30px auto; "">Easy Admin</div>
    <div class=""content-wrap"">
        <div class=""content"" lang=""zh"" style=""background: white; border: 1px solid #D9D9D9; border-radius: 3px; box-sizing: border-box; margin: 0 auto; max-width: 690px; overflow: hidden; padding: 40px 30px; text-align: center"">
            <div class=""main"">
                <div class=""user"">
                    <h2 class=""user-info"" style=""color: #383838; font-size: 20px; font-weight: normal; margin: 20px auto; margin-top: 20px; word-break: normal"">{0}
                        <span class=""user-email"" style=""color: inherit; display: inline; text-decoration: none; word-break: normal"">(<a href=""mailto:{1}"" target=""_blank"">{1}</a>)</span>
                    </h2>
                </div>
                <h2 class=""message"" style=""color: #808080; display: inline; font-size: 20px; font-weight: normal; margin: 0; word-break: normal"">邀请您加入项目
                    <q class=""organization-name"" style=""display: inline"">{2}</q>
                </h2><a class=""btn"" href=""{3}"" style=""-moz-transition: all 218ms; -o-transition: all 218ms; -webkit-transition: all 218ms; background: #03A9F4; border-radius: 2px; color: white; display: block; font-size: 20px; height: 54px; line-height: 54px; margin: 30px auto; text-decoration: none; transition: all 218ms; width: 200px; color: white!important; border: 0!important; cursor: pointer !important;"" target=""_blank"">进入项目</a>
                <p class=""hint center"" style=""color: #A6A6A6; display: block; font-weight: normal; line-height: 24px; margin: 0 auto; max-width: 600px; word-break: normal"">如果按钮无法点击，请直接访问以下链接：
                    <br><a href=""{3}"" style=""-moz-transition: all 218ms; -o-transition: all 218ms; -webkit-transition: all 218ms; color: #03A9F4; text-decoration: underline; transition: all 218ms; word-break: break-all;"" target=""_blank"">{3}</a> 此链接自发送之时起两天后过期 </p>
            </div>
        </div>
    </div>
    <p class=""small"" style=""color: #BDBDBD; display: block; font-size: 12px; font-weight: normal; line-height: 22px; margin: 0 auto; margin-top: 20px; max-width: 540px; padding: 0 5px; text-align: center; word-break: normal"">邮件来自{4} 的自动提醒，无需回复。
        <br>如果您在使用中有任何的疑问或者建议， 欢迎反馈我们意见至邮件：<a style=""-moz-transition: all 218ms; -o-transition: all 218ms; -webkit-transition: all 218ms; color: #BDBDBD; text-decoration: underline; transition: all 218ms"">4824865@qq.com</a></p>
</div>", _TenantManage.user.Nickname, _TenantManage.user.Email, project.Name, acitveurl, "Easy Admin - 快速后台构建工具");
                if(EmailHelper.SendEmail(Email, title, content))
                {
                    return new ResponseMessage(MessageResult.Success, "邀请邮件发送成功");
                }
                else
                {
                    return new ResponseMessage(MessageResult.Error, "邀请邮件发送失败");
                }
            }
            return new ResponseMessage(MessageResult.Error, "邀请失败");
        }


        //// GET api/values/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/values

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
