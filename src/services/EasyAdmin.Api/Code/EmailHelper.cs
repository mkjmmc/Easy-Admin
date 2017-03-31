using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace EasyAdmin.Api.Code
{
    public class EmailHelper
    {

        public static bool SendEmail(string email, string subject, string body)
        {
            // 发送加入项目的邮件
            MailMessage mailObj = new MailMessage();
            mailObj.From = new MailAddress("4824865@qq.com", "Easy Admin"); //发送人邮箱地址
            mailObj.IsBodyHtml = true;
            mailObj.To.Add(email);   //收件人邮箱地址
            mailObj.Subject = subject;    //主题
            mailObj.Body = body;    //正文
            mailObj.BodyEncoding = System.Text.Encoding.UTF8;
            mailObj.HeadersEncoding = System.Text.Encoding.UTF8;
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.qq.com";         //smtp服务器名称
            smtp.Port = 587;
            smtp.UseDefaultCredentials = true;
            smtp.EnableSsl = true;
            smtp.Credentials = new NetworkCredential("4824865@qq.com", "eypluivdelwebidc");  //发送人的登录名和密码
            try
            {
                smtp.Send(mailObj);
                //context.Response.Write(SerializeUtility.JavaScriptSerialize(new { Result = 0, Message = "发送成功" }));
                return true;
            }
            catch (Exception ex)
            {
                //context.Response.Write(SerializeUtility.JavaScriptSerialize(new { Result = 1, Message = ex.Message.ToString() }));
                return false;
            }
        }
    }
}
