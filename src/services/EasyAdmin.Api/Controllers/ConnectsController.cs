﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Code;
using EasyAdmin.Api.Models;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;

namespace EasyAdmin.Api.Controllers
{
    public class ConnectsController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly ITenantManage _TenantManage;
        private readonly IUserManage _UserManage;
        private readonly IDBConnectManage _DBConnectManage;
        public ConnectsController(IProjectManage ProjectManage
            , ITenantManage TenantManage
            , IUserManage UserManage
            , IDBConnectManage DBConnectManage)
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
            _DBConnectManage = DBConnectManage;
            _UserManage = UserManage;
        }

        /// <summary>
        /// 数据库连接列表
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage List(long ProjectID)
        {
            // 判断是否有权限
            var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, ProjectID);
            if (userproject == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            // 获取项目列表
            var list = _DBConnectManage.GetListByProjectID(ProjectID);
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Success, "", list.Where(m => m.IsDelete == 0));
        }

        /// <summary>
        /// 更新数据库连接属性
        /// </summary>
        /// <param name="ID"></param>
        /// <param name="Name"></param>
        /// <param name="ConnectString"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage Update(long ID, string Name, string ConnectString, string Type="mysql")
        {
            var model = _DBConnectManage.GetModel(ID);
            if (model != null)
            {
                // 判断是否有权限
                var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, model.ProjectID);
                if (userproject == null)
                {
                    return new ResponseMessage(MessageResult.Error, "项目不存在");
                }
                model.Name = Name;
                model.ConnectString = ConnectString;
                model.Type = Type;
            }
            if (_DBConnectManage.Update(model))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }

        /// <summary>
        /// 删除数据库连接
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage Delete(long ID)
        {
            var model = _DBConnectManage.GetModel(ID);
            if (model != null)
            {
                // 判断是否有权限
                var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, model.ProjectID);
                if (userproject == null)
                {
                    return new ResponseMessage(MessageResult.Error, "项目不存在");
                }
                model.IsDelete = 1;
            }
            if (_DBConnectManage.Update(model))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }

        /// <summary>
        /// 创建数据库连接
        /// </summary>
        /// <param name="ProjectID"></param>
        /// <param name="Name"></param>
        /// <param name="ConnectString"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage Create(long ProjectID, string Name, string ConnectString, string Type="mysql")
        {
            // 判断是否有权限
            var userproject = _UserManage.GetUserProject(_TenantManage.user.ID, ProjectID);
            if (userproject == null)
            {
                return new ResponseMessage(MessageResult.Error, "项目不存在");
            }
            if (_DBConnectManage.Create(new Dao.Models.DBConnect()
            {
                ProjectID = ProjectID,
                Name = Name,
                ConnectString = ConnectString,
                Type= Type
            }))
            {
                return new ResponseMessage(MessageResult.Success, "");
            }
            return new ResponseMessage(MessageResult.Error, "");
        }

        /// <summary>
        /// 测试数据库连接是否可用
        /// </summary>
        /// <param name="ConnectString"></param>
        /// <returns></returns>
        [HttpPost]
        public ResponseMessage Test(string ConnectString, string Type="mysql")
        {
            switch (Type)
            {
                case "mysql":
                    using (MySqlConnection connection = new MySqlConnection(ConnectString))
                    {
                        try
                        {
                            connection.Open();
                            return new ResponseMessage(MessageResult.Success, "ok");
                        }
                        catch (Exception e)
                        {
                            return new ResponseMessage(MessageResult.Error, e.Message);
                            //throw;
                        }
                        finally
                        {
                            connection.Close();
                        }
                    }
                    break;
                case "sqlserver":
                    using (SqlConnection connection = new SqlConnection(ConnectString))
                    {
                        try
                        {
                            connection.Open();
                            return new ResponseMessage(MessageResult.Success, "ok");
                        }
                        catch (Exception e)
                        {
                            return new ResponseMessage(MessageResult.Error, e.Message);
                            //throw;
                        }
                        finally
                        {
                            connection.Close();
                        }
                    }
                    break;
                default:
                    throw new Exception("类型不存在");
                    break;
            }
            
        }
    }
}
