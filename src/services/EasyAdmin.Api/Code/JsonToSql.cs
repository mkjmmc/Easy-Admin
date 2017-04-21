/*
 {
	"connectid":1,
	"Configs":[{
		"type":"update",
		"database":"aaaa",
		"table":"aaaa",
		"condition":[{
			"name":"id",
			"opt":"=",
			"value":"1"
		}],
		"modifier":[{
			"name":"aaa",
			"value":"safasfasf"
		}]
	},{
		"type":"insert",
		"database":"aaaa",
		"table":"aaaa",
		"condition":[{
			"name":"id",
			"opt":"=",
			"value":"1"
		}],
		"values":[{
			"name":"aaa",
			"value":"safasfasf"
		}]
	}]

}
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace Database
{
    public class JsonToSql
    {
        public string Type { get; set; }
        public JsonToSql(string type)
        {
            this.Type = type;
        }

        public SqlObject jsontosql(JObject config)
        {
            var obj = new SqlObject();
            switch (config.SelectToken("type").ToObject<string>())
            {
                case "select":
                    {
                        var cfg = config.ToObject<SQLConfigForSelect>();
                        if (cfg == null)
                        {
                            throw new Exception("类型异常");
                        }
                        var condition = conditiontosql(cfg.condition, obj.Parameters);
                        var sort = sorttosql(cfg.sort);
                        var limit = limittosql(cfg.limit);
                        obj.Sql = string.Format(@"
select {0} from {1} {2} {3} {4};
select count(*) from {1} {2};
", fieldstosql(cfg.fields), formattablename(cfg.database, cfg.table), condition, sort, limit);
                    }
                    break;
                case "update":
                    {
                        var cfg = config.ToObject<SQLConfigForUpdate>();
                        if (cfg == null)
                        {
                            throw new Exception("类型异常");
                        }
                        obj.Sql = string.Format(@"update {0} set {1} {2}", formattablename(cfg.database, cfg.table), modifiertosql(cfg.modifier, obj.Parameters), conditiontosql(cfg.condition, obj.Parameters));
                    }
                    break;
                case "insert":
                    {
                        // insert into table (a,b,c)values(v1,v2,v3);
                        var cfg = config.ToObject<SQLConfigForInsert>();
                        if (cfg == null)
                        {
                            throw new Exception("类型异常");
                        }
                        var index = 0;
                        obj.Sql = string.Format(@"insert into {0} ({1})values({2})"
                            , formattablename(cfg.database, cfg.table)
                            , string.Join(",", cfg.values.Select(m => formatname(m.name)).Distinct().ToArray())
                            , string.Join(",", cfg.values.Select(m =>
                            {
                                index++;
                                obj.Parameters.Add(new Parameter("@i_" + index, m.value));
                                return "@i_" + index;
                            }).Distinct().ToArray()));
                    }
                    break;
                default:
                    break;
            }
            return obj;
        }

        /// <summary>
        /// 转换条件成sql语句
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="_parameters"></param>
        /// <returns></returns>
        private string conditiontosql(List<SQLConfigConditionItem> condition, List<Parameter> _parameters)
        {
            // 转换成数组
            if (condition == null || condition.Count == 0)
            {
                return string.Empty;
            }
            var index = 0;
            var sql = string.Join(" and ", condition.Select(m =>
            {
                index++;
                //  对操作进行转换
                switch (m.opt)
                {
                    case "=":
                    case "<>":
                    case "<":
                    case "<=":
                    case ">":
                    case ">=":
                        break;
                    case "like":
                        m.value = "%" + m.value + "%";
                        break;
                    case "not like":
                        m.value = "%" + m.value + "%";
                        break;
                    case "begin with":
                        m.value = m.value + "%";
                        break;
                    case "end with":
                        m.value = "%" + m.value;
                        break;
                    case "is null":
                        m.opt = "=";
                        m.value = "";
                        break;
                    case "is not null":
                        m.opt = "<>";
                        m.value = "";
                        break;
                    case "in dataset":
                        m.opt = "in";
                        m.value = "";
                        return string.Format("{0} in ([{1}.{2}])", formatname(m.name), m.dataset, m.datasetcolumn);
                    default:
                        m.opt = "=";
                        break;
                }
                _parameters.Add(new Parameter("@c_" + index, m.value));
                return string.Format("{0} {1} @c_{2}", formatname(m.name), m.opt, index);
            }));
            return " where " + sql;
        }

        private string sorttosql(List<SQLConfigSortItem> sort)
        {
            if (sort == null || sort.Count == 0)
            {
                return string.Empty;
            }
            var sql = string.Join(",", sort.Select(m => string.Format("{0} {1}", formatname(m.name), m.sort == 1 ? "" : "DESC")));
            return " order by " + sql;
        }

        private string limittosql(List<int> limit)
        {
            if (limit == null || limit.Count == 0)
            {
                return string.Empty;
            }
            switch (Type)
            {
                case "sqlserver":
                    {
                        if (limit.Count == 1)
                        {
                            return string.Format(" OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY ",0, limit[0]);
                        }
                        if (limit.Count == 2)
                        {
                            return string.Format(" OFFSET {0} ROWS FETCH NEXT {1} ROWS ONLY ", limit[0], limit[1]);
                        }
                    }
                    break;
                case "mysql":
                default:
                    {
                        if (limit.Count == 1)
                        {
                            return " limit " + limit[0];
                        }
                        if (limit.Count == 2)
                        {
                            return string.Format(" limit {0},{1}", limit[0], limit[1]);
                        }
                    }
                    break;
            }
            
            return string.Empty;
        }

        private string fieldstosql(JObject fields)
        {
            var list = new List<string>();
            foreach (var _property in fields.Properties())
            {
                if (_property.Value.ToObject<bool>())
                {
                    list.Add(_property.Name.ToString());
                }
            }
            if (list.Count == 0)
            {
                return " * ";
            }
            return string.Join(",", list.Select(m => formatname(m)));
        }

        private string modifiertosql(List<SQLConfigModifierItem> modifier, List<Parameter> _parameters)
        {
            if (modifier == null || modifier.Count == 0)
            {
                throw new Exception("修改字段内容不能为空");
            }
            var index = 0;
            var sql = string.Join(" , ", modifier.Select(m =>
            {
                index++;
                _parameters.Add(new Parameter("@m_" + index, m.value));
                return string.Format("{0} = @m_{1}", formatname(m.name), index);
            }));
            return sql;
        }

        private string[] getfieldsfromvalues(List<SQLConfigModifierItem> modifier)
        {
            return modifier.Select(m => m.name).Distinct().ToArray();
        }

        private string formatname(string name)
        {
            switch (Type)
            {
                case "mysql":
                    return string.Format("`{0}`", name);
                case "sqlserver":
                    return string.Format("[{0}]", name);
                default:
                    return string.Format("`{0}`", name);
            }
        }

        private string formattablename(string database, string tablename)
        {
            switch (Type)
            {
                case "mysql":
                    return string.Format("{0}.{1}", formatname(database), formatname(tablename));
                case "sqlserver":
                    return string.Format("{0}.dbo.{1}", formatname(database), formatname(tablename));
                default:
                    return string.Format("{0}.{1}", formatname(database), formatname(tablename));
            }
        }
    }

    public class SqlObject
    {
        public SqlObject()
        {
            this.Parameters = new List<Parameter>();
        }
        public string Sql { get; set; }
        public List<Parameter> Parameters { get; set; }
    }

    public class Parameter
    {
        public Parameter(string name, object value)
        {
            this.Name = name;
            this.Value = value;
        }
        public string Name { get; set; }
        public object Value { get; set; }
    }

    public class SQLConfig
    {
        /// <summary>
        /// sql语句类型,insert,update,delete,select
        /// </summary>
        public string type { get; set; }
        /// <summary>
        /// 数据库
        /// </summary>
        public string database { get; set; }
    }

    public class SQLConfigForSelect : SQLConfig
    {
        /// <summary>
        /// 表
        /// </summary>
        public string table { get; set; }
        /// <summary>
        /// 字段fields: ['a','b'],
        /// </summary>
        public JObject fields { get; set; }

        /// <summary>
        /// 条件condition: {a: {$gt: 1}, b: {$lt: 10}}
        /// </summary>
        public List<SQLConfigConditionItem> condition { get; set; }

        /// <summary>
        /// 排序字段sort: {fieldName1: 1,fieldName2: -1}
        /// </summary>
        public List<SQLConfigSortItem> sort { get; set; }

        /// <summary>
        /// 获取数量
        /// </summary>
        public List<int> limit { get; set; }
    }

    public class SQLConfigForUpdate : SQLConfig
    {
        /// <summary>
        /// 表
        /// </summary>
        public string table { get; set; }
        /// <summary>
        /// 条件condition: [{a: {$gt: 1}},{b: {$lt: 10}}]
        /// </summary>
        public List<SQLConfigConditionItem> condition { get; set; }
        /// <summary>
        /// 修改字段modifier: {fieldName1: 1,fieldName2: -1}
        /// </summary>
        public List<SQLConfigModifierItem> modifier { get; set; }
    }
    public class SQLConfigForInsert : SQLConfig
    {
        /// <summary>
        /// 表
        /// </summary>
        public string table { get; set; }
        /// <summary>
        /// 修改字段modifier: {fieldName1: 1,fieldName2: -1}
        /// </summary>
        public List<SQLConfigModifierItem> values { get; set; }
    }
    public class SQLConfigConditionItem
    {
        public string name { get; set; }
        public string opt { get; set; }
        public string value { get; set; }
        public string dataset { get; set; }
        public string datasetcolumn { get; set; }
    }

    public class SQLConfigModifierItem
    {
        public string name { get; set; }
        public string value { get; set; }
    }

    public class SQLConfigSortItem
    {
        public string name { get; set; }
        public int sort { get; set; }
    }
}