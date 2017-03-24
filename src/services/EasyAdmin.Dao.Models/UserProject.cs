using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("user_project")]
    public class UserProject
    {
        [Key, Column(Order =1)]
        public long UserID { get; set; }
        [Key, Column(Order =2)]
        public long ProjectID { get; set; }
        public long CreateTime { get; set; }

        /// <summary>
        /// 角色 0普通用户 1创建者 2管理员
        /// </summary>
        public int Role { get; set; }
    }
}
