using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyAdmin.Dao.Models
{
    [Table("p_pages")]
    public class Page
    {
        [Key]
        public long ID { get; set; }
        public long ProjectID { get; set; }
        public string Title { get; set; }
        public string Config { get; set; }
        public int IsPublic { get; set; }
    }
}
