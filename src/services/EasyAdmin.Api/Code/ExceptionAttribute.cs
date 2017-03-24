using EasyAdmin.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EasyAdmin.Api.Code
{
    /// <summary>
    /// 异常处理
    /// </summary>
    public class ExceptionAttribute : ActionFilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            //var absoluteUri = string.Concat(
            //            filterContext.HttpContext.Request.Scheme,
            //            "://",
            //            filterContext.HttpContext.Request.Host.ToUriComponent(),
            //            filterContext.HttpContext.Request.PathBase.ToUriComponent(),
            //            filterContext.HttpContext.Request.Path.ToUriComponent(),
            //            filterContext.HttpContext.Request.QueryString.ToUriComponent());
            //ExceptionClient.Error(absoluteUri == null ? "" : absoluteUri,
            //    filterContext.Exception.Message,
            //    (filterContext.HttpContext.Request.Form.Count > 0
            //        ? JsonConvert.SerializeObject(filterContext.HttpContext.Request.Form) : "")
            //        + "\r\n" + filterContext.Exception.ToString()
            //    );
            ////ExceptionHelper.Add(new ExceptionModel
            //                        {
            //                            Url = filterContext.HttpContext.Request.Url == null ? "" : filterContext.HttpContext.Request.Url.AbsoluteUri,
            //                            Params = filterContext.HttpContext.Request.Form.Count > 0 ? SerializeUtility.JavaScriptSerialize(SerializeUtility.ToDictionary(filterContext.HttpContext.Request.Form)) : "",
            //                            Exception = filterContext.Exception.ToString(),
            //                            Message = filterContext.Exception.Message,
            //                            Time = DateTimeUtility.GetTimeMilliseconds(DateTime.Now)
            //                        });
            filterContext.ExceptionHandled = true;
            filterContext.Result = new JsonResult(new ResponseMessage(MessageResult.Error, filterContext.Exception.Message));
        }
    }
}
