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
            HostID = args[1];
            PortID = args[2];
            CreateWebHostBuilder(args).Build().Run();
        }

       public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    // Adiciona as configurações de HostID e PortID no Configuration
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
