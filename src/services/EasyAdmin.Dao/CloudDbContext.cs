using Microsoft.Extensions.Configuration;
using System.Data.Entity;
using EasyAdmin.Dao.Models;

namespace EasyAdmin.Dao
{
    [DbConfigurationType(typeof(CloudDbConfiguration))]
    public class CloudDbContext : DbContext
    {
        //static CloudDbContext()
        //{
        //    Database.SetInitializer<CloudDbContext>(null);
        //}

        public CloudDbContext(IConfiguration config)
       : base(config.GetConnectionString("CloudConnection"))
        {
            //Configuration.ProxyCreationEnabled = false;
            //Configuration.ProxyCreationEnabled = false;

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }

        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserProject> UserProjects { get; set; }
        public virtual DbSet<Module> Modules { get; set; }
        public virtual DbSet<Page> Pages { get; set; }
        public virtual DbSet<DBConnect> DBConnects { get; set; }

    }

}
