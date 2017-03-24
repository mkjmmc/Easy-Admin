using System;
using System.ComponentModel;
using System.Reflection;

namespace EasyAdmin.Api.Models
{
    /// <summary>
    /// 返回消息实体
    /// </summary>
    public class ResponseMessage
    {
        public ResponseMessage(MessageResult result)
            : this(result, GetEnumDesc(result))
        {
        }

        public ResponseMessage(MessageResult result, string message)
            : this(result, message, null)
        {
        }

        public ResponseMessage(MessageResult result, string message, object data)
        {
            Result = result;
            Message = message;
            Data = data;
            //T = DateTimeUtility.GetTimeMilliseconds(DateTime.Now);
        }



        /// <summary>
        /// 返回结果状态
        /// </summary>
        public MessageResult Result { get; private set; }

        /// <summary>
        /// 消息说明
        /// </summary>
        public string Message { get; private set; }

        /// <summary>
        /// 服务器时间
        /// </summary>
        public long T { get; set; }

        /// <summary>
        /// 数据
        /// </summary>
        public object Data { get; private set; }

        public static String GetEnumDesc(MessageResult e)
        {
            FieldInfo _enumInfo = e.GetType().GetField(e.ToString());
            var _enumAttributes = (DescriptionAttribute[])_enumInfo.
                GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (_enumAttributes.Length > 0)
            {
                return _enumAttributes[0].Description;
            }
            return e.ToString();
        }
    }

    /// <summary>
    /// 返回码
    /// </summary>
    public enum MessageResult
    {
        /// <summary>
        /// 操作成功 
        /// </summary>
        [Description("操作成功")]
        Success = 0,

        /// <summary>
        /// 操作失败 
        /// </summary>
        [Description("操作失败")]
        Error = -1,

        /// <summary>
        /// 签名错误
        /// </summary>
        [Description("签名错误")]
        SignatureError = -99,

    }
}
