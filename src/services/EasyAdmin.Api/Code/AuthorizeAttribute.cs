using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Localization;
using EasyAdmin.Api.Resources;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Models;

namespace EasyAdmin.Api.Code
{
    public class AuthorizeFilter : ActionFilterAttribute
    {
        private readonly IStringLocalizer<SharedResource> _localizer;
        private readonly IUserManage _UserManage;
        private readonly ITenantManage _TenantManage;

        public AuthorizeFilter(
            IStringLocalizer<SharedResource> localizer
            , IUserManage UserManage
            , ITenantManage TenantManage
            )
        {
            _localizer = localizer;
            _UserManage = UserManage;
            _TenantManage = TenantManage;
        }
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // 验证数据
            var userkey = filterContext.HttpContext.Request.Headers["Authorization"].ToString();

            // 获取用户信息
            var user = _UserManage.GetModelByAppKey(userkey);
            if (user == null)
            {
                filterContext.Result = new JsonResult(new ResponseMessage(MessageResult.SignatureError, _localizer["用户未登录"], null));
                return;
            }

            // 保存用户信息
            _TenantManage.Set(user);
            base.OnActionExecuting(filterContext);
            return;
        }
    }
}
