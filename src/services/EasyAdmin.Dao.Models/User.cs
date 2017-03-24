using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public long ID { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public long CreateTime { get; set; }
        public string LoginKey { get; set; }
        public long LastLoginTime { get; set; }
        public string Nickname { get; set; }
    }
}
