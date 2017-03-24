using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Api.Code;
using Microsoft.AspNetCore.Cors;
using System.Globalization;

namespace EasyAdmin.Api.Controllers
{
    [Exception]
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]/[action]")]
    [ServiceFilter(typeof(AuthorizeFilter))]
    public class BaseController : Controller
    {
        #region 当前时间

        private readonly DateTime now = DateTime.Now;
        /// <summary>
        /// 当前时间
        /// </summary>
        public DateTime Now { get { return now; } }
        #endregion

        #region 客户端语言

        /// <summary>
        /// 客户端语言
        /// </summary>
        public string Language
        {
            get
            {
                return CultureInfo.CurrentCulture.ToString();
            }
        }

        #endregion

    }
}
