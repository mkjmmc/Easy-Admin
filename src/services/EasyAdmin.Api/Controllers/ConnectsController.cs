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
    public class ConnectsController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly ITenantManage _TenantManage;
        private readonly IDBConnectManage _DBConnectManage;
        public ConnectsController(IProjectManage ProjectManage
            , ITenantManage TenantManage
            , IDBConnectManage DBConnectManage)
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
            _DBConnectManage = DBConnectManage;
        }

        [HttpPost]
        public ResponseMessage List(long ProjectID)
        {
            // 获取项目列表
            var list = _DBConnectManage.GetListByProjectID(ProjectID);
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Success, "", list.Where(m=>m.IsDelete == 0));
        }

        [HttpPost]
        public ResponseMessage Update(long ID, string Name, string ConnectString)
        {
            var model = _DBConnectManage.GetModel(ID);
            if (model != null)
            {
                model.Name = Name;
                model.ConnectString = ConnectString;
            }
            if (_DBConnectManage.Update(model))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }

        [HttpPost]
        public ResponseMessage Delete(long ID)
        {
            var model = _DBConnectManage.GetModel(ID);
            if (model != null)
            {
                model.IsDelete = 1;
            }
            if (_DBConnectManage.Update(model))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }

        [HttpPost]
        public ResponseMessage Create(long ProjectID, string Name, string ConnectString)
        {
            if (_DBConnectManage.Create(new Dao.Models.DBConnect()
            {
                ProjectID = ProjectID,
                Name = Name,
                ConnectString = ConnectString
            }))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }
    }
}
