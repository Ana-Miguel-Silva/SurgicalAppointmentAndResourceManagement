using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace DDDSample1
{
    public class Program
    {
        public static string HostID { get; private set; }
        public static string PortID { get; private set; }

        
        public static void Main(string[] args)
        {
            if(args.Length != 0){
                HostID = args[0];
                PortID = args[1];
                 CreateWebHostBuilder2(args).Build().Run();
            }else{
                CreateWebHostBuilder(args).Build().Run();
            }
           
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>();

       public static IWebHostBuilder CreateWebHostBuilder2(string[] args) =>
            WebHost.CreateDefaultBuilder(args)            
                .ConfigureAppConfiguration((context, config) =>
                {
                  
                    var settings = new Dictionary<string, string>
                    {
                        { "HostID", HostID },
                        { "PortID", PortID }
                    };
                  

                    config.AddInMemoryCollection(settings);
                })
                .UseStartup<Startup>();
    
    }
}
