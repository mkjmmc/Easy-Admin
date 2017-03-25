using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using EasyAdmin.Service.Interface;
using EasyAdmin.Api.Code;
using EasyAdmin.Api.Models;
using System.IO;
using Newtonsoft.Json;
using MySql.Data.MySqlClient;
using Database;
using Newtonsoft.Json.Linq;
using System.Data;
using EasyAdmin.Dao.Models;

namespace EasyAdmin.Api.Controllers
{
    public class PagesController : BaseController
    {
        private readonly IProjectManage _ProjectManage;
        private readonly IModuleManage _ModuleManage;
        private readonly IPageManage _PageManage;
        private readonly IDBConnectManage _DBConnectManage;
        private readonly ITenantManage _TenantManage;
        public PagesController(
            IProjectManage ProjectManage
            , ITenantManage TenantManage
            , IModuleManage ModuleManage
            , IPageManage PageManage
            , IDBConnectManage DBConnectManage
            )
        {
            _ProjectManage = ProjectManage;
            _TenantManage = TenantManage;
            _ModuleManage = ModuleManage;
            _PageManage = PageManage;
            _DBConnectManage = DBConnectManage;
        }

        [HttpPost]
        public ResponseMessage List(long ProjectID)
        {
            // 获取项目列表
            var list = _PageManage.GetListByProjectID(ProjectID);
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Success, "", list);
        }
        // 获取配置信息
        [HttpPost]
        public ResponseMessage Detail(long PageID)
        {
            // 获取项目列表
            var model = _PageManage.GetModel(PageID);
            if (model != null)
            {
                return new ResponseMessage(MessageResult.Success, "", model);
            }
            //return new string[] { "value1", "value2" };
            return new ResponseMessage(MessageResult.Error, "");
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

        /// <summary>
        /// 获取连接列表
        /// </summary>
        /// <returns></returns>
        public List<DBConnect> GetConnectList(long ProjectID)
        {
            var list = _DBConnectManage.GetListByProjectID(ProjectID);
            return list;
        }

        /// <summary>
        /// 获取数据库列表
        /// </summary>
        /// <param name="connectid"></param>
        /// <returns></returns>
        public ResponseMessage Connects(long ProjectID)
        {
            var connect = GetConnectList(ProjectID);
            return new ResponseMessage(MessageResult.Success, "成功");
        }

        /// <summary>
        /// 获取数据库列表
        /// </summary>
        /// <param name="connectid"></param>
        /// <returns></returns>
        public ResponseMessage Databases(long ProjectID,int connectid)
        {
            var connect = GetConnectList(ProjectID).FirstOrDefault(m => m.ID == connectid);
            if (connect == null)
            {
                return new ResponseMessage(MessageResult.Error, "连接不存在");
            }
            DbHelperMySql dbHelperMySql = new DbHelperMySql(connect.ConnectString);
            var sql = "show databases;";
            var ds = dbHelperMySql.Query(sql);
            var list = new List<string>();
            foreach (DataRow _row in ds.Tables[0].Rows)
            {
                list.Add(_row[0].ToString());
            }
            return new ResponseMessage(MessageResult.Success, "成功", list);
        }


        /// <summary>
        /// 获取数据库表列表
        /// </summary>
        /// <returns></returns>
        public ResponseMessage Tables(long ProjectID,int connectid, string databasename)
        {
            var connect = GetConnectList(ProjectID).FirstOrDefault(m => m.ID == connectid);
            if (connect == null)
            {
                return new ResponseMessage(MessageResult.Error, "连接不存在");
                //return Content(Result(1, "连接不存在", null).ToString());
            }
            var sql = string.Format(
                "select table_name from information_schema.tables where table_schema='{0}' and table_type='base table';", databasename);
            DbHelperMySql dbHelperMySql = new DbHelperMySql(connect.ConnectString);
            var ds = dbHelperMySql.Query(sql);
            var list = new List<string>();
            foreach (DataRow _row in ds.Tables[0].Rows)
            {
                list.Add(_row["table_name"].ToString());
            }
            return new ResponseMessage(MessageResult.Success, "成功", list);
            //return Content(JsonConvert.SerializeObject(list));
            // return Json(list, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 获取字段列表
        /// </summary>
        /// <param name="connectid"></param>
        /// <param name="databasename"></param>
        /// <param name="tablename"></param>
        /// <returns></returns>
        public ResponseMessage Columns(long ProjectID,int connectid, string databasename, string tablename)
        {
            var connect = GetConnectList(ProjectID).FirstOrDefault(m => m.ID == connectid);
            if (connect == null)
            {
                return new ResponseMessage(MessageResult.Error, "连接不存在");
            }
            var sql =
                string.Format("select * from information_schema.columns where table_schema='{1}' and table_name='{0}';", tablename, databasename);
            DbHelperMySql dbHelperMySql = new DbHelperMySql(connect.ConnectString);
            var ds = dbHelperMySql.Query(sql);
            var list = new List<object>();
            foreach (DataRow _row in ds.Tables[0].Rows)
            {
                list.Add(new
                {
                    column_name = _row["column_name"].ToString(),
                    data_type = _row["data_type"].ToString(),
                    display = true
                });
            }
            return new ResponseMessage(MessageResult.Error, "成功", list);
            // return Json(list, JsonRequestBehavior.AllowGet);
        }



        [HttpPost]
        public ResponseMessage ExecuteDataSource(long ProjectID,[FromBody]ExcuteConfig config)
        {
            // update tablename set column=value where id=id

            //Stream req = Request.Body;
            //req.Seek(0, System.IO.SeekOrigin.Begin);
            //string json = new StreamReader(req).ReadToEnd();
            //var config = JsonConvert.DeserializeObject<ExcuteConfig>(json);

            // 解析配置
            if (config == null)
            {
                return new ResponseMessage(MessageResult.Error, "配置错误");
            }
            var connect = GetConnectList(ProjectID).FirstOrDefault(m => m.ID == config.connectid);
            if (connect == null)
            {
                return new ResponseMessage(MessageResult.Error, "连接不存在");
            }
            // 初始化连接
            DbHelperMySql dbHelperMySql = new DbHelperMySql(connect.ConnectString);

            // 解析json为sql语句;


            var querylist = new List<SelectConfig>();
            var sqllist = new List<SqlItem>();
            foreach (var _sqlConfig in config.Configs)
            {
                var _parameters = new List<MySqlParameter>();
                var sql = JsonToSql.jsontosql(_sqlConfig, _parameters);
                // 查询单独处理
                if (_sqlConfig.SelectToken("type").ToObject<string>() == "select")
                {
                    var obj = new SelectConfig()
                    {
                        name = _sqlConfig.SelectToken("name").ToObject<string>(),
                        database = _sqlConfig.SelectToken("database").ToObject<string>(),
                        table = _sqlConfig.SelectToken("table").ToObject<string>(),
                        sql = sql,
                        parameters = _parameters
                    };
                    querylist.Add(obj);
                }
                else
                {
                    sqllist.Add(new SqlItem(sql, _parameters.ToArray()));
                }
            }
            var rows = dbHelperMySql.ExecuteSqlTran2(sqllist);

            var jobject = new JObject();
            // 执行查询操作
            foreach (var obj in querylist)
            {
                var name = obj.name; // obj.SelectToken("name").ToObject<string>();
                var sql = obj.sql;// obj.SelectToken("sql").ToObject<string>();
                // 条件中的记录集处理
                {
                    foreach (var jobj in jobject)
                    {
                        var columns = jobj.Value.SelectToken("columns").ToObject<JArray>();
                        foreach (var _column in columns)
                        {
                            var key = string.Format("[{0}.{1}]", jobj.Key, _column.SelectToken("name"));
                            if (sql.Contains(key))
                            {
                                // 如果sql中包含了特殊字符，则进行数据组装
                                var dd = jobj.Value.SelectToken("data")
                                    .Select(m => "'" + m.SelectToken(_column.SelectToken("name").ToObject<string>()).ToObject<string>() + "'");
                                var result = string.Join(",", dd);
                                if(string.IsNullOrEmpty(result))
                                {
                                    result = "''";
                                }
                                sql = sql.Replace(key, result);
                            }
                        }
                    }
                }

                var ds = dbHelperMySql.Query(sql, obj.parameters.ToArray());
                //ds1.Tables[0].TableName = name;
                // 返回数据
                var jarray = new JArray();
                foreach (DataRow _row in ds.Tables[0].Rows)
                {
                    var jobj = new JObject();
                    foreach (DataColumn _column in ds.Tables[0].Columns)
                    {
                        jobj.Add(_column.ColumnName, JToken.FromObject(_row[_column.ColumnName]));
                        //jobj.Add(_column.ColumnName, _column.DataType.ToString());
                    }
                    jarray.Add(jobj);
                }
                var columnarray = new JArray();
                foreach (DataColumn _column in ds.Tables[0].Columns)
                {
                    var jobj = new JObject();
                    jobj.Add("name", _column.ColumnName);
                    jobj.Add("type", _column.DataType.ToString());
                    jobj.Add("key", _column.Table.PrimaryKey.Contains(_column));
                    columnarray.Add(jobj);
                }
                jobject.Add(name, new JObject()
                {
                    {"database", obj.database},
                    {"table", obj.table},
                    {"columns", columnarray},
                    {"data", jarray},
                    {"totalItems", long.Parse(ds.Tables[1].Rows[0][0].ToString())},
                    {"beginindex", 0},
                    {"takecount", 20},
                });
            }
            return new ResponseMessage(MessageResult.Success, "成功", new
            {
                connectid = config.connectid,
                rows = rows,
                data = jobject
            });
            //return Json(new
            //{
            //    rows= rows,
            //    data = jobject
            //});
            ////return Content(sql + "=============" + rows);
            //return null;
        }
    }

    /// <summary>
    /// 事务执行sql语句
    /// </summary>
    public class ExcuteConfig
    {
        public long connectid { get; set; }
        public JObject[] Configs { get; set; }
    }

    public class SelectConfig
    {
        public string name { get; set; }
        public string database { get; set; }
        public string table { get; set; }
        public string sql { get; set; }
        public List<MySqlParameter> parameters { get; set; }
    }

    public class ConnectModel
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string ConnectString { get; set; }
    }
}
