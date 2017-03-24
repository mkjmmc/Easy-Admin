using System.Configuration;
using System.Data;
using System.Data.Entity;
using MySql.Data.Entity;
using MySql.Data.MySqlClient;

namespace EasyAdmin.Dao
{
    public class CloudDbConfiguration : DbConfiguration
    {
        public CloudDbConfiguration()
        {
            // Attempt to register ADO.NET provider 
            try
            {
                var dataSet = (DataSet)ConfigurationManager.GetSection("system.data");
                dataSet.Tables[0].Rows.Add(
                    "MySQL Data Provider",
                    ".Net Framework Data Provider for MySQL",
                    "MySql.Data.MySqlClient",
                    typeof(MySqlClientFactory).AssemblyQualifiedName
                );
            }
            catch (ConstraintException)
            {
                // MySQL provider is already installed, just ignore the exception 
            }
            //var dataSet = (DataSet)ConfigurationManager.GetSection("system.data");
            //dataSet.Tables[0].Rows.Add(
            //    "MySQL Data Provider",
            //    ".Net Framework Data Provider for MySQL",
            //    "MySql.Data.MySqlClient",
            //    typeof(MySqlClientFactory).AssemblyQualifiedName
            //);
            //EntityFramework.Locator.Current.Register<EntityFramework.Batch.IBatchRunner>(() => new MySqlBatchRunner());
            //SetProviderServices("MySql.Data.MySqlClient", new MySqlProviderServices());
            //SetDefaultConnectionFactory(new MySqlConnectionFactory());
            SetExecutionStrategy(MySqlProviderInvariantName.ProviderName, () => new MySqlExecutionStrategy());
            AddDependencyResolver(new MySqlDependencyResolver());
        }
    }
}
