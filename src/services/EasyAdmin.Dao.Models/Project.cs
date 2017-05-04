using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("projects")]
    public class Project
    {
        [Key]
        public long ID { get; set; }
        public long UserID { get; set; }
        public string Name { get; set; }
        public long CreateTime { get; set; }
        public int IsDelete { get; set; }
        public string Configs { get; set; }
    }
}
