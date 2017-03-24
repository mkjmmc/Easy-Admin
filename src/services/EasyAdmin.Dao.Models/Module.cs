using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("p_modules")]
    public class Module
    {
        [Key]
        public long ID { get; set; }
        public string Name { get; set; }
        public long ProjectID { get; set; }
    }
}
