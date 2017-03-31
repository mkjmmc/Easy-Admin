using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("user_invitations")]
    public class UserInvitation
    {
        [Key]
        public long ID { get; set; }
        public string Code { get; set; }
        public long UserID { get; set; }
        public string Email { get; set; }
        public long ProjectID { get; set; }
        public long CreateTime { get; set; }
        public long ExpirationTime { get; set; }
    }
}
