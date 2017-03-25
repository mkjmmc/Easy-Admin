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
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace Database
{
    public class JsonToSql
    {

        public static string jsontosql(JObject config, List<MySqlParameter> _parameters)
        {
            switch (config.SelectToken("type").ToObject<string>())
            {
                case "select":
                    {
                        var cfg = config.ToObject<SQLConfigForSelect>() ;
                        if (cfg == null)
                        {
                            return "类型异常";
                        }
                        var condition = conditiontosql(cfg.condition, _parameters);
                        var sort = sorttosql(cfg.sort);
                        var limit = limittosql(cfg.limit);
                        return string.Format(@"
select {0} from `{5}`.`{1}` {2} {3} {4};
select count(*) from `{5}`.`{1}` {2};
", fieldstosql(cfg.fields), cfg.table, condition, sort, limit, cfg.database);
                    }
                    break;
                case "update":
                    {
                        var cfg = config.ToObject<SQLConfigForUpdate>() ;
                        if (cfg == null)
                        {
                            return "类型异常";
                        }
                        return string.Format(@"update `{0}`.`{1}` set {2} {3}", cfg.database, cfg.table, modifiertosql(cfg.modifier, _parameters), conditiontosql(cfg.condition, _parameters));
                    }
                    break;
                case "insert":
                    {
                        // insert into table (a,b,c)values(v1,v2,v3);
                        var cfg = config.ToObject<SQLConfigForInsert>();
                        if (cfg == null)
                        {
                            return "类型异常";
                        }
                        var index = 0;
                        return string.Format(@"insert into `{0}`.`{1}` ({2})values({3})"
                            , cfg.database
                            , cfg.table
                            , string.Join(",", cfg.values.Select(m => "`" + m.name + "`").Distinct().ToArray())
                            , string.Join(",", cfg.values.Select(m =>
                            {
                                index++;
                                _parameters.Add(new MySqlParameter("@i_" + index, MySqlDbType.VarChar) { Value = m.value });
                                return "@i_" + index;
                            }).Distinct().ToArray()));
                    }
                    break;
                default:
                    break;
            }
            return "";
        }

        /// <summary>
        /// 转换条件成sql语句
        /// </summary>
        /// <param name="condition"></param>
        /// <param name="_parameters"></param>
        /// <returns></returns>
        private static string conditiontosql(List<SQLConfigConditionItem> condition, List<MySqlParameter> _parameters)
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
                        return string.Format("`{0}` in ([{1}.{2}])", m.name, m.dataset, m.datasetcolumn);
                    default:
                        m.opt = "=";
                        break;
                }
                _parameters.Add(new MySqlParameter("@c_" + index, MySqlDbType.VarChar) { Value = m.value });
                return string.Format("`{0}` {1} @c_{2}", m.name, m.opt, index);
            }));
            return " where " + sql;
        }

        private static string sorttosql(List<SQLConfigSortItem> sort)
        {
            if (sort == null || sort.Count == 0)
            {
                return string.Empty;
            }
            var sql = string.Join(",", sort.Select(m => string.Format("`{0}` {1}", m.name, m.sort == 1 ? "" : "DESC")));
            return " order by " + sql;
        }

        private static string limittosql(List<int> limit)
        {
            if (limit == null || limit.Count == 0)
            {
                return string.Empty;
            }
            if (limit.Count == 1)
            {
                return " limit " + limit[0];
            }
            if (limit.Count == 2)
            {
                return string.Format(" limit {0},{1}", limit[0], limit[1]);
            }
            return string.Empty;
        }

        private static string fieldstosql(JObject fields)
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
            return string.Join(",", list.Select(m => "`" + m + "`"));
        }

        private static string modifiertosql(List<SQLConfigModifierItem> modifier, List<MySqlParameter> _parameters)
        {
            if (modifier == null || modifier.Count == 0)
            {
                throw new Exception("修改字段内容不能为空");
            }
            var index = 0;
            var sql = string.Join(" , ", modifier.Select(m =>
            {
                index++;
                _parameters.Add(new MySqlParameter("@m_" + index, MySqlDbType.VarChar) { Value = m.value });
                return string.Format("`{0}` = @m_{1}", m.name, index);
            }));
            return sql;
        }

        private string[] getfieldsfromvalues(List<SQLConfigModifierItem> modifier)
        {
            return modifier.Select(m => m.name).Distinct().ToArray();
        }
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