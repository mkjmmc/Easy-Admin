using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("p_db_connect")]
    public class DBConnect
    {
        [Key]
        public long ID { get; set; }
        public long ProjectID { get; set; }
        public string Name { get; set; }
        public string ConnectString { get; set; }
        public int IsDelete { get; set; }
    }
}
