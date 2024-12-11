using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using DDDSample1.Infrastructure;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Infrastructure.Staff;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Logging;
using DDDSample1.Domain.PendingActions;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.OperationTypes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Infrastructure.Logging;
using DDDSample1.Infrastructure.PendingActions;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using DDDSample1.ApplicationService.Users;
using DDDSample1.ApplicationService.Staff;
using DDDSample1.ApplicationService.Patients;
using DDDSample1.ApplicationService.OperationRequests;
using DDDSample1.ApplicationService.OperationTypes;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.PendingActions;
using DDDSample1.ApplicationService.Shared;
using DDDSample1.ApplicationService.Appointments;
using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure.Appointments;
using DDDSample1.ApplicationService.Specializations;
using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Specializations;
using DDDSample1.ApplicationService.SurgeryRooms;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.SurgeryRooms;
using System.Security.Claims;


namespace DDDSample1
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseInMemoryDatabase("DDDSample1DB")
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

            ConfigureMyServices(services);*/

            services.AddDbContext<DDDSample1DbContext>(options =>
                options.UseMySql(Configuration.GetConnectionString("MySql5Connection"),
                    new MySqlServerVersion(new Version(8, 0, 0))
                ).ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());


            services.AddCors(options =>
            {
                options.AddPolicy("AllowLocalhost4200",
                    builder => builder.WithOrigins(//"http://"+Configuration.GetConnectionString("HostID") +":" + Configuration.GetConnectionString("PortID")
                    "http://localhost:4200","http://20.82.142.194:4200")
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());
            });

            services.AddControllers().AddNewtonsoftJson();


            services.Configure<JwtSettings>(Configuration.GetSection("Jwt"));

            services.AddAuthentication(options =>
            {

                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer("Bearer", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Secret"])),
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Audience"]
                    };

                    options.TokenValidationParameters.RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine("Erro de autenticação: " + context.Exception.Message);
                            return Task.CompletedTask;
                        }
                    };

                     options.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = context =>
                        {
                            var identity = context.Principal.Identity as ClaimsIdentity;
                            if (identity != null)
                            {
                                var roleClaim = identity.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
                                if (roleClaim != null)
                                {
                                    identity.AddClaim(new Claim(ClaimTypes.Role, roleClaim.Value));
                                }
                            }
                            return Task.CompletedTask;
                        }
                    };
              


                });

            services.AddAuthorization();

            

            ConfigureMyServices(services);



            /*var secretKey = Configuration["Jwt:Secret"];
            services.AddScoped<UserService>(provider => new UserService(
                provider.GetRequiredService<IUnitOfWork>(),
                provider.GetRequiredService<IUserRepository>(),
                provider.GetRequiredService<IMailService>(),
                secretKey
            ));*/
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowLocalhost4200");

            app.UseRouting();

            app.UseAuthorization();
            app.UseAuthentication();


            app.UseEndpoints(endpoints =>
            {

                endpoints.MapPost("/gmail", async (SendEmailRequest sendEmailRequest, IMailService mailService) =>
                {
                    await mailService.SendEmailAsync(sendEmailRequest);
                    return Results.Ok("Email sent successfully");
                });

                endpoints.MapControllers();
            });

            

            SeedAdminUser(app.ApplicationServices);
            SeedPatientUser(app.ApplicationServices);
            SeedDoctorUser(app.ApplicationServices);
            SeedPatient(app.ApplicationServices);
        }

        public void ConfigureMyServices(IServiceCollection services)
        {

                services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
            .AddCookie()
            .AddGoogle(options =>
            {
                options.ClientId = "557762914279-7d87s63jvf102v51i6gtn7pqe5qh5tl5.apps.googleusercontent.com";
                options.ClientSecret = "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";
                options.CallbackPath = "/signin-google";
            });


            services.AddTransient<IUnitOfWork, UnitOfWork>();

            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<UserService>();
            services.AddTransient<AuthorizationService>();


            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<StaffService>();

            services.AddTransient<IPatientRepository, PatientRepository>();
            services.AddTransient<PatientService>();

            services.AddTransient<IStaffRepository, StaffRepository>();
            services.AddTransient<StaffService>();

            services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
            services.AddTransient<OperationRequestService>();

            services.AddTransient<ISpecializationRepository, SpecializationRepository>();
            services.AddTransient<SpecializationService>();

            services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
            services.AddTransient<OperationTypeService>();

            services.AddTransient<ILogRepository, LogRepository>();
            services.AddTransient<LogService>();

            services.AddTransient<IAppointmentRepository, AppointmentRepository>();
            services.AddTransient<AppointmentService>();

            services.AddTransient<ISurgeryRoomRepository, SurgeryRoomRepository>();
            services.AddTransient<SurgeryRoomService>();

             services.AddTransient<IPendingActionsRepository, PendingActionsRepository>();
            services.AddTransient<PendingActionsService>();


            services.Configure<GmailOptions>(Configuration.GetSection("GmailOptions"));
            services.AddScoped<IMailService, GmailService>();
        }

        public async Task SeedAdminUser(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();

                var adminUsername = "admin";
                var adminEmail = new Email("1221137@isep.ipp.pt");
                var adminRole = "Admin";

                User existingAdmin = await userService.GetByUsernameAsync(adminUsername);

                if (existingAdmin == null)
                {
                    var adminDto = new CreatingUserDto(adminUsername, adminEmail.FullEmail, adminRole);

                    await userService.AddAsync(adminDto);
                }

            }
        }

         public async Task SeedDoctorUser(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();

                var doctorUsername = "doctor";
                var doctorEmail = new Email("1221003@isep.ipp.pt");
                var doctorRole = "Doctor";

                User existingDoctor = await userService.GetByUsernameAsync(doctorUsername);

                if (existingDoctor == null)
                {
                    var adminDto = new CreatingUserDto(doctorUsername, doctorEmail.FullEmail, doctorRole);

                    await userService.AddAsync(adminDto);
                }

            }
        }

        public async Task SeedPatientUser(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var userService = scope.ServiceProvider.GetRequiredService<UserService>();

                var adminUsername = "patient";
                var adminEmail = new Email("avlismana@gmail.com");
                var adminRole = "Patient";

                User existingAdmin = await userService.GetByUsernameAsync(adminUsername);

                if (existingAdmin == null)
                {
                    var adminDto = new CreatingUserDto(adminUsername, adminEmail.FullEmail, adminRole);

                    await userService.AddAsync(adminDto);
                }

            }
        }

        public async Task SeedPatient(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var patientService = scope.ServiceProvider.GetRequiredService<PatientService>();

                var patientUsername = "patient";
                
                var patientEmail = "avlismana@gmail.com";
                var patientRole = "Patient";
                DateTime dateOfBirth = DateTime.Now.AddYears(-30);
                var phoneNumberObject = "966783435";
                var patientGender = "Female";
                
  

                Patient existingPatientByUserEmail = await patientService.GetPatientByEmailAsync(patientEmail);
                Patient existingPatientByEmail = await patientService.GetPatientByEmailAsync(patientEmail);

                if (existingPatientByEmail == null && existingPatientByUserEmail == null)
                {
                    var patientDto = new CreatingPatientDto(patientUsername, dateOfBirth, phoneNumberObject,  patientEmail,patientEmail, patientGender);

                    await patientService.AddAsync(patientDto, patientRole);
                }

            }
        }

    }
}
