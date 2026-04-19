using Application.Interfaces;
using Application.Services;
using Domain.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CONFIGURACIÓN JWT
builder.Services.Configure<AutenticacionService.AutenticacionServiceOptions>(
    builder.Configuration.GetSection("AutenticacionService")
);

//JWT 
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["AutenticacionService:Issuer"],
            ValidAudience = builder.Configuration["AutenticacionService:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["AutenticacionService:SecretForKey"] ?? string.Empty))
        };
    }
);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

#region Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>(); // ¡Agregado: Vital para el Login!
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IManagerRepository, ManagerRepository>();
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>(); // ¡Agregado para los turnos!
#endregion

#region Services
builder.Services.AddScoped<ICustomAuthenticationService, AutenticacionService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IManagerService, ManagerService>();
builder.Services.AddScoped<IDoctorService, DoctorService>();
#endregion

// Conectar con React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Permitimos que React entre (CORS)
app.UseCors("AllowReact");

// Verificamosel usuario (Authentication)
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();