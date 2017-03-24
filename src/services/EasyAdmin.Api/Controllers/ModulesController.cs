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
    public class ModulesController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly IModuleManage _ModuleManage;
        private readonly ITenantManage _TenantManage;
        public ModulesController(
            IProjectManage ProjectManage
            , ITenantManage TenantManage
            , IModuleManage ModuleManage
            )
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
            _ModuleManage = ModuleManage;
        }

        [HttpPost]
        public ResponseMessage List(long ProjectID)
        {
            // 获取项目列表
            var list = _ModuleManage.GetListByProjectID(ProjectID);
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Success, "", list);
        }

        [HttpPost]
        public ResponseMessage Create([FromBody] ModuleCreateModel model)
        {
            var result = _ModuleManage.Create(new Dao.Models.Module()
            {
                Name = model.Name,
                ProjectID = model.ProjectID
            });
            if (result)
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "创建模块失败");
        }

    }
}
