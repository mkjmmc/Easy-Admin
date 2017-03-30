using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using EasyAdmin.Dao;
using EasyAdmin.Api.Code;
using EasyAdmin.Service.Interface;
using EasyAdmin.Service;

namespace EasyAdmin.Api
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CloudDbConfiguration>(Configuration.GetSection("ConnectionStrings"));
            // 多语言支持
            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.AddApplicationInsightsTelemetry(Configuration);
            // Add framework services.
            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder => builder
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                );
            });
            services.AddScoped<AuthorizeFilter>();

            services.AddSingleton<IConfiguration>(Configuration);
            services.AddSingleton(_ => Configuration);
            services.AddScoped<CloudDbContext>();


            // 多租户服务
            services.AddScoped<ITenantManage, TenantManage>();
            // 多租户服务
            services.AddTransient<IUserManage, UserManage>();
            services.AddTransient<IProjectManage, ProjectManage>();
            services.AddTransient<IModuleManage, ModuleManage>();
            services.AddTransient<IPageManage, PageManage>();
            services.AddTransient<IDBConnectManage, DBConnectManage>();
            services.AddTransient<IUserInvitationManage, UserInvitationManage>();

            //services.AddScoped<ISSODeveloperManage, SSODeveloperManage>();
            //services.AddTransient<IRecordingManage, RecordingManage>();
            //services.AddTransient<IBalanceRecordManage, BalanceRecordManage>();
            //services.AddTransient<IEventManage, EventManage>();
            //services.AddTransient<IWebhookManage, WebhookManage>();

            //services.AddTransient<IOSSManage, AliyunOSSManage>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            var supportedCultures = new[]
            {
                  new CultureInfo("en"),
                  new CultureInfo("zh"),
            };

            app.UseRequestLocalization(new RequestLocalizationOptions
            {
                DefaultRequestCulture = new RequestCulture("zh"),
                // Formatting numbers, dates, etc.
                SupportedCultures = supportedCultures,
                // UI strings that we have localized.
                SupportedUICultures = supportedCultures
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            app.UseCors("AllowAllOrigins");

            app.UseMvc();
        }
    }
}
