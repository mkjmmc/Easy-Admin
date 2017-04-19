// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DbHelperMySql.cs" company="德清女娲网络科技有限公司">
//   Copyright (c) 德清女娲网络科技有限公司 版权所有
// </copyright>
// <summary>
//   C#操作MYSQL数据库基类
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Database
{
    /// <summary>
    /// C#操作SqlServer数据库基类
    /// </summary>
    public class DbHelperSqlServer
    {
        /// <summary>
        /// 本地数据库连接字符串(web.config来配置)
        /// </summary>
        private readonly string connectionString = string.Empty;

        public DbHelperSqlServer(string connectionString)
        {
            this.connectionString = connectionString;
        }

        #region  执行简单SQL语句

        /// <summary>
        /// 执行SQL语句，返回影响的记录数
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <returns>影响的记录数</returns>
        public int ExecuteSql(string sqlString)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sqlString, _connection))
                {
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        int _rows = _cmd.ExecuteNonQuery();
                        return _rows;
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行查询条数
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public int ExecuteScalarSql(String sql)
        {
            int num = 0;
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sql, _connection))
                {
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        num = (int)_cmd.ExecuteScalar();
                    }
                    catch (Exception e)
                    {
                        throw new Exception(e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
            return num;
        }

        /// <summary>
        /// 执行SQL语句，设置命令的执行等待时间
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <param name="times">超时时间</param>
        /// <returns>影响的记录数</returns>
        public int ExecuteSqlByTime(string sqlString, int times)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sqlString, _connection))
                {
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = times;
                        int _rows = _cmd.ExecuteNonQuery();
                        return _rows;
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行多条SQL语句，实现数据库事务。
        /// </summary>
        /// <param name="sqlStringList">多条SQL语句</param>  
        public void ExecuteSqlTran(List<string> sqlStringList)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                _connection.Open();
                SqlCommand _cmd = new SqlCommand();
                _cmd.Connection = _connection;
                _cmd.CommandTimeout = 2147483;
                SqlTransaction _tx = _connection.BeginTransaction();
                _cmd.Transaction = _tx;
                try
                {
                    for (int _n = 0; _n < sqlStringList.Count; _n++)
                    {
                        string _strsql = sqlStringList[_n];
                        if (_strsql.Trim().Length > 1)
                        {
                            _cmd.CommandText = _strsql;
                            _cmd.ExecuteNonQuery();
                        }
                    }
                    _tx.Commit();
                }
                catch (SqlException _e)
                {
                    _tx.Rollback();
                    throw new Exception(_e.Message);
                }
                finally
                {
                    _cmd.Dispose();
                    _connection.Close();
                }
            }
        }

        /// <summary>
        /// 执行带一个存储过程参数的的SQL语句。
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <param name="content">参数内容,比如一个字段是格式复杂的文章，有特殊符号，可以通过这个方式添加</param>
        /// <returns>影响的记录数</returns>
        public int ExecuteSql(string sqlString, string content)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sqlString, _connection))
                {
                    SqlParameter _myParameter = new SqlParameter("@content", SqlDbType.Text);
                    _myParameter.Value = content;
                    _cmd.Parameters.Add(_myParameter);
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        int _rows = _cmd.ExecuteNonQuery();
                        return _rows;
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行带一个存储过程参数的的SQL语句。
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <param name="content">参数内容,比如一个字段是格式复杂的文章，有特殊符号，可以通过这个方式添加</param>
        /// <returns>影响的记录数</returns>
        public object ExecuteSqlGet(string sqlString, string content)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sqlString, _connection))
                {
                    SqlParameter _myParameter = new SqlParameter("@content", SqlDbType.Text);
                    _myParameter.Value = content;
                    _cmd.Parameters.Add(_myParameter);
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        object obj = _cmd.ExecuteScalar();
                        if (object.Equals(obj, null) || object.Equals(obj, System.DBNull.Value))
                        {
                            return null;
                        }
                        else
                        {
                            return obj;
                        }
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 向数据库里插入图像格式的字段(和上面情况类似的另一种实例)
        /// </summary>
        /// <param name="strSQL">SQL语句</param>
        /// <param name="fs">图像字节,数据库的字段类型为image的情况</param>
        /// <returns>影响的记录数</returns>
        public int ExecuteSqlInsertImg(string strSQL, byte[] fs)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(strSQL, _connection))
                {
                    SqlParameter _myParameter = new SqlParameter("@fs", SqlDbType.Binary);
                    _myParameter.Value = fs;
                    _cmd.Parameters.Add(_myParameter);
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        int _rows = _cmd.ExecuteNonQuery();
                        return _rows;
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行一条计算查询结果语句，返回查询结果（object）。
        /// </summary>
        /// <param name="sqlString">计算查询结果语句</param>
        /// <returns>查询结果（object）</returns>
        public object GetSingle(string sqlString)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand(sqlString, _connection))
                {
                    try
                    {
                        _connection.Open();
                        _cmd.CommandTimeout = 2147483;
                        object _obj = _cmd.ExecuteScalar();
                        if (object.Equals(_obj, null) || object.Equals(_obj, System.DBNull.Value))
                        {
                            return null;
                        }
                        else
                        {
                            return _obj;
                        }
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行查询语句，返回SqlDataReader(使用该方法切记要手工关闭SqlDataReader和连接)
        /// </summary>
        /// <param name="strSQL">查询语句</param>
        /// <returns>SqlDataReader</returns>
        public SqlDataReader ExecuteReader(string strSQL)
        {
            SqlConnection _connection = new SqlConnection(connectionString);
            SqlCommand _cmd = new SqlCommand(strSQL, _connection);
            try
            {
                _connection.Open();
                _cmd.CommandTimeout = 2147483;
                SqlDataReader _myReader = _cmd.ExecuteReader();
                return _myReader;
            }
            catch (SqlException _e)
            {
                throw new Exception(_e.Message);
            }
            ////finally //不能在此关闭，否则，返回的对象将无法使用
            ////{
            //// cmd.Dispose();
            //// connection.Close();
            ////} 
        }
       
        /// <summary>
        /// 执行查询语句，返回int
        /// </summary>
        /// <param name="strSQL">查询语句</param>
        /// <returns>int</returns>
        public int ExecuteReaderCount(string strSQL)
        {
            int RecordCount = 0;
            SqlConnection connection = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand(strSQL, connection);
            try
            {
                connection.Open();
                cmd.CommandTimeout = 2147483;
                SqlDataReader myReader = cmd.ExecuteReader();
                if (myReader.Read())
                    RecordCount = int.Parse(myReader[0].ToString());
                myReader.Close();
                cmd.Dispose();
                connection.Close();
                return RecordCount;
            }
            catch (SqlException e)
            {
                throw new Exception(e.Message);
            }
        }


        /// <summary>
        /// 执行查询语句，返回DataSet
        /// </summary>
        /// <param name="sqlString">查询语句</param>
        /// <returns>DataSet</returns>
        public DataSet Query(string sqlString)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataSet ds = new DataSet();
                try
                {
                    connection.Open();
                    SqlDataAdapter da = new SqlDataAdapter(sqlString, connection);
                    da.MissingSchemaAction = MissingSchemaAction.AddWithKey;
                    da.Fill(ds);
                }
                catch (SqlException ex)
                {
                    connection.Close();
                    throw new Exception(ex.Message);
                }
                finally
                {
                    connection.Close();
                }
                return ds;
            }
        }

        /// <summary>
        /// 执行查询语句，返回DataSet,设置命令的执行等待时间
        /// </summary>
        /// <param name="sqlString">查询语句</param>
        /// <param name="times">超时时间</param>
        /// <returns>结果集</returns>
        public DataSet Query(string sqlString, int times)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                DataSet ds = new DataSet();
                try
                {
                    _connection.Open();
                    SqlDataAdapter _command = new SqlDataAdapter(sqlString, _connection);
                    _command.MissingSchemaAction = MissingSchemaAction.AddWithKey;
                    _command.SelectCommand.CommandTimeout = times;
                    _command.Fill(ds, "ds");
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    _connection.Close();
                }
                return ds;
            }
        }

        /// <summary>
        /// 获取SQL查询记录条数
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <returns>记录条数</returns>
        public int GetRowsNum(string sqlString)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                DataSet ds = new DataSet();
                try
                {
                    _connection.Open();
                    SqlDataAdapter _command = new SqlDataAdapter(sqlString, _connection);
                    _command.Fill(ds, "ds");
                    return ds.Tables[0].Rows.Count;
                }
                catch (SqlException _ex)
                {
                    throw new Exception(_ex.Message);
                }
                finally
                {
                    _connection.Close();
                }
            }
        }

        #endregion

        #region 执行带参数的SQL语句

        /// <summary>
        /// 执行SQL语句，返回影响的记录数
        /// </summary>
        /// <param name="sqlString">SQL语句</param>
        /// <param name="cmdParms">参数</param>
        /// <returns>影响的记录数</returns>
        public int ExecuteSql(string sqlString, params object[] cmdParms)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                using (SqlCommand _cmd = new SqlCommand())
                {
                    try
                    {
                        PrepareCommand(_cmd, _connection, null, sqlString, cmdParms);
                        int rows = _cmd.ExecuteNonQuery();
                        _cmd.Parameters.Clear();
                        return rows;
                    }
                    catch (SqlException _e)
                    {
                        throw new Exception(_e.Message);
                    }
                    finally
                    {
                        _cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行多条SQL语句，实现数据库事务。
        /// </summary>
        /// <param name="sqlStringList">SQL语句的哈希表（key为sql语句，value是该语句的 Object[]）</param>
        public void ExecuteSqlTran(Hashtable sqlStringList)
        {
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                _connection.Open();
                using (SqlTransaction trans = _connection.BeginTransaction())
                {
                    SqlCommand cmd = new SqlCommand();
                    try
                    {
                        // 循环
                        foreach (DictionaryEntry myDE in sqlStringList)
                        {
                            string cmdText = myDE.Key.ToString();
                            object[] cmdParms = (Object[])myDE.Value;
                            PrepareCommand(cmd, _connection, trans, cmdText, cmdParms);
                            int val = cmd.ExecuteNonQuery();
                            cmd.Parameters.Clear();

                            trans.Commit();
                        }
                    }
                    catch
                    {
                        trans.Rollback();
                        throw;
                    }
                    finally
                    {
                        cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行多条SQL语句，实现数据库事务。
        /// </summary>
        /// <param name="al">SQL语句的哈希表（key为sql语句，value是该语句的 Object[]）</param>
        public int ExecuteSqlTran2(List<SqlItem<SqlParameter>> al)
        {
            int i = 0;
            using (SqlConnection _connection = new SqlConnection(connectionString))
            {
                _connection.Open();
                using (SqlTransaction trans = _connection.BeginTransaction())
                {
                    SqlCommand cmd = new SqlCommand();
                    try
                    {
                        // 循环
                        foreach (SqlItem<SqlParameter> _item in al)
                        {
                            PrepareCommand(cmd, _connection, trans, _item.sql, _item.cmdParms);
                            int val = cmd.ExecuteNonQuery();
                            cmd.Parameters.Clear();
                        }
                        trans.Commit();
                        i = 1;
                    }
                    catch
                    {
                        i = 0;
                        trans.Rollback();
                    }
                    finally
                    {
                        cmd.Dispose();
                        _connection.Close();
                    }
                }
            }
            return i;
        }

        /// <summary>
        /// 执行一条计算查询结果语句，返回查询结果（object）。
        /// </summary>
        /// <param name="sqlString">计算查询结果语句</param>
        /// <returns>查询结果（object）</returns>
        public object GetSingle(string sqlString, params object[] cmdParms)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    try
                    {
                        PrepareCommand(cmd, connection, null, sqlString, cmdParms);
                        object obj = cmd.ExecuteScalar();
                        cmd.Parameters.Clear();
                        if ((object.Equals(obj, null)) || (object.Equals(obj, System.DBNull.Value)))
                        {
                            return null;
                        }
                        else
                        {
                            return obj;
                        }
                    }
                    catch (SqlException e)
                    {
                        throw new Exception(e.Message);
                    }
                    finally
                    {
                        cmd.Dispose();
                        connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行一条计算查询结果语句，返回查询结果（object）。
        /// </summary>
        /// <param name="sqlString">计算查询结果语句</param>
        /// <returns>查询结果（object）</returns>
        public object GetSingle(string sqlString, params SqlParameter[] cmdParms)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand())
                {
                    try
                    {
                        PrepareCommand(cmd, connection, null, sqlString, cmdParms);
                        object obj = cmd.ExecuteScalar();
                        cmd.Parameters.Clear();
                        if ((object.Equals(obj, null)) || (object.Equals(obj, System.DBNull.Value)))
                        {
                            return null;
                        }
                        else
                        {
                            return obj;
                        }
                    }
                    catch (SqlException e)
                    {
                        throw new Exception(e.Message);
                    }
                    finally
                    {
                        cmd.Dispose();
                        connection.Close();
                    }
                }
            }
        }

        /// <summary>
        /// 执行查询语句，返回SqlDataReader (使用该方法切记要手工关闭SqlDataReader和连接)
        /// </summary>
        /// <param name="strSQL">查询语句</param>
        /// <returns>SqlDataReader</returns>
        public SqlDataReader ExecuteReader(string SQLString, params object[] cmdParms)
        {
            SqlConnection connection = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand();
            try
            {
                PrepareCommand(cmd, connection, null, SQLString, cmdParms);
                SqlDataReader myReader = cmd.ExecuteReader();
                cmd.Parameters.Clear();
                return myReader;
            }
            catch (SqlException e)
            {
                throw new Exception(e.Message);
            }
            //finally //不能在此关闭，否则，返回的对象将无法使用
            //{
            // cmd.Dispose();
            // connection.Close();
            //} 

        }
      
        /// <summary>
        /// 执行查询语句，返回DataSet
        /// </summary>
        /// <param name="sqlString">查询语句</param>
        /// <returns>DataSet</returns>
        public DataSet Query(string sqlString, params object[] cmdParms)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand();
                PrepareCommand(cmd, connection, null, sqlString, cmdParms);
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    da.MissingSchemaAction = MissingSchemaAction.AddWithKey;
                    DataSet ds = new DataSet();
                    try
                    {
                        da.Fill(ds, "ds");
                        cmd.Parameters.Clear();
                    }
                    catch (SqlException ex)
                    {
                        throw new Exception(ex.Message);
                    }
                    finally
                    {
                        cmd.Dispose();
                        connection.Close();
                    }
                    return ds;
                }
            }
        }

        private static void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, string cmdText, object[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.Connection = conn;
            cmd.CommandTimeout = 2147483;
            cmd.CommandText = cmdText;
            if (trans != null)
                cmd.Transaction = trans;
            cmd.CommandType = CommandType.Text; //cmdType;
            if (cmdParms != null)
            {


                foreach (SqlParameter parameter in cmdParms)
                {
                    if ((parameter.Direction == ParameterDirection.InputOutput || parameter.Direction == ParameterDirection.Input) &&
                        (parameter.Value == null))
                    {
                        parameter.Value = DBNull.Value;
                    }
                    cmd.Parameters.Add(parameter);
                }
            }
        }
        private static void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, string cmdText, SqlParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.Connection = conn;
            cmd.CommandTimeout = 2147483;
            cmd.CommandText = cmdText;
            if (trans != null)
                cmd.Transaction = trans;
            cmd.CommandType = CommandType.Text; //cmdType;
            if (cmdParms != null)
            {


                foreach (SqlParameter parameter in cmdParms)
                {
                    if ((parameter.Direction == ParameterDirection.InputOutput || parameter.Direction == ParameterDirection.Input) &&
                        (parameter.Value == null))
                    {
                        parameter.Value = DBNull.Value;
                    }
                    cmd.Parameters.Add(parameter);
                }
            }
        }
        #endregion

        #region 存储过程操作

        /// <summary>
        /// 执行存储过程  (使用该方法切记要手工关闭SqlDataReader和连接)
        /// 手动关闭不了，所以少用，MySql.Data组组件还没解决该问题
        /// </summary>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>SqlDataReader</returns>
        public SqlDataReader RunProcedure(string storedProcName, object[] parameters)
        {
            SqlConnection connection = new SqlConnection(connectionString);
            SqlDataReader returnReader;
            connection.Open();
            SqlCommand command = BuildQueryCommand(connection, storedProcName, parameters);
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 2147483;
            returnReader = command.ExecuteReader();
            //Connection.Close(); 不能在此关闭，否则，返回的对象将无法使用            
            return returnReader;

        }

        /// <summary>
        /// 执行存储过程
        /// </summary>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <param name="tableName">DataSet结果中的表名</param>
        /// <returns>DataSet</returns>
        public DataSet RunProcedure(string storedProcName, object[] parameters, string tableName)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataSet dataSet = new DataSet();
                connection.Open();
                SqlDataAdapter sqlDA = new SqlDataAdapter();
                sqlDA.SelectCommand = BuildQueryCommand(connection, storedProcName, parameters);
                sqlDA.Fill(dataSet, tableName);
                connection.Close();
                return dataSet;
            }
        }

        public DataSet RunProcedure(string storedProcName, object[] parameters, string tableName, int Times)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataSet dataSet = new DataSet();
                connection.Open();
                SqlDataAdapter sqlDA = new SqlDataAdapter();
                sqlDA.SelectCommand = BuildQueryCommand(connection, storedProcName, parameters);
                sqlDA.SelectCommand.CommandTimeout = Times;
                sqlDA.Fill(dataSet, tableName);
                connection.Close();
                return dataSet;
            }
        }

        /// <summary>
        /// 执行存储过程 
        /// </summary>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns></returns>
        public void RunProcedureNull(string storedProcName, object[] parameters)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {

                connection.Open();
                SqlCommand command = BuildIntCommand(connection, storedProcName, parameters);
                command.CommandTimeout = 2147483;
                command.ExecuteNonQuery();
                connection.Close();
            }
        }

        /// <summary>
        /// 执行
        /// </summary>
        /// <param name="CommandText">T-SQL语句；例如："pr_shell 'dir *.exe'"或"select * from sysobjects where xtype=@xtype"</param>
        /// <param name="parameters">SQL参数</param>
        /// <returns>返回第一行第一列</returns>
        public object ExecuteScaler(string storedProcName, object[] parameters)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                object returnObjectValue;
                connection.Open();
                SqlCommand command = BuildQueryCommand(connection, storedProcName, parameters);
                command.CommandTimeout = 2147483;
                returnObjectValue = command.ExecuteScalar();
                connection.Close();
                return returnObjectValue;
            }
        }

        /// <summary>
        /// 构建 SqlCommand 对象(用来返回一个结果集，而不是一个整数值)
        /// </summary>
        /// <param name="connection">数据库连接</param>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>SqlCommand</returns>
        private static SqlCommand BuildQueryCommand(SqlConnection connection, string storedProcName, object[] parameters)
        {
            SqlCommand command = new SqlCommand(storedProcName, connection);
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 2147483;
            foreach (SqlParameter parameter in parameters)
            {
                if (parameter != null)
                {
                    // 检查未分配值的输出参数,将其分配以DBNull.Value.
                    if ((parameter.Direction == ParameterDirection.InputOutput || parameter.Direction == ParameterDirection.Input) &&
                        (parameter.Value == null))
                    {
                        parameter.Value = DBNull.Value;
                    }
                    command.Parameters.Add(parameter);
                }
            }

            return command;
        }

        /// <summary>
        /// 创建 SqlCommand 对象实例(用来返回一个整数值) 
        /// </summary>
        /// <param name="storedProcName">存储过程名</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>SqlCommand 对象实例</returns>
        private static SqlCommand BuildIntCommand(SqlConnection connection, string storedProcName, object[] parameters)
        {
            SqlCommand command = BuildQueryCommand(connection, storedProcName, parameters);
            command.CommandTimeout = 2147483;
            command.Parameters.Add(new SqlParameter("ReturnValue",
                                                      SqlDbType.Int, 4, ParameterDirection.ReturnValue,
                                                      false, 0, 0, string.Empty, DataRowVersion.Default, null));
            return command;
        }

        #endregion

        /// <summary>
        /// SqlDataReader转换成DataTable
        /// </summary>
        /// <param name="dataReader"></param>
        /// <returns></returns>
        public static DataTable GetNewDataTable(SqlDataReader dataReader)
        {
            DataTable datatable = new DataTable();
            DataTable schemaTable = dataReader.GetSchemaTable();

            //动态添加列
            try
            {
                foreach (DataRow myRow in schemaTable.Rows)
                {
                    DataColumn myDataColumn = new DataColumn();
                    myDataColumn.DataType = myRow.GetType();
                    myDataColumn.ColumnName = myRow[0].ToString();
                    datatable.Columns.Add(myDataColumn);
                }
                //添加数据
                while (dataReader.Read())
                {
                    DataRow myDataRow = datatable.NewRow();
                    for (int i = 0; i < schemaTable.Rows.Count; i++)
                    {
                        myDataRow[i] = dataReader[i].ToString();
                    }
                    datatable.Rows.Add(myDataRow);
                    myDataRow = null;
                }
                schemaTable = null;
                dataReader.Close();
                return datatable;
            }
            catch (Exception ex)
            {
                throw new Exception("转换出错出错!", ex);
            }
        }
    }

    public class SqlItem<T>
    {
        /// <summary>
        /// SQL语句
        /// </summary>
        public string sql { get; set; }

        /// <summary>
        /// 参数列表
        /// </summary>
        public T[] cmdParms { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SqlItem"/> class. 
        /// 构造
        /// </summary>
        /// <param name="sql">
        /// SQL语句
        /// </param>
        /// <param name="cmdParms">
        /// 参数列表
        /// </param>
        public SqlItem(string sql, T[] cmdParms)
        {
            this.sql = sql;
            this.cmdParms = cmdParms;
        }
        public SqlItem()
        {
        }
    }
}