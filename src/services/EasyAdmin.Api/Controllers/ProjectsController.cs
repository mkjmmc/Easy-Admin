﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Code;
using EasyAdmin.Api.Models;

namespace EasyAdmin.Api.Controllers
{
    public class ProjectsController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly ITenantManage _TenantManage;
        public ProjectsController(IProjectManage ProjectManage
            , ITenantManage TenantManage)
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
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
