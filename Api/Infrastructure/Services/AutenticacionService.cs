using Application.Interfaces;
using Application.Models.Dtos;
using Domain.Entities;
using Domain.Interfaces;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class AutenticacionService: ICustomAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly AutenticacionServiceOptions _options;

        public AutenticacionService(IUserRepository userRepository, IOptions<AutenticacionServiceOptions> options)
        {
            _userRepository = userRepository;
            _options = options.Value;
        }

        private User? ValidateUser(AuthenticationRequest authenticationRequest)
        {
            if (string.IsNullOrEmpty(authenticationRequest.Email) || string.IsNullOrEmpty(authenticationRequest.Password))
                return null;

            var user = _userRepository.GetUserByEmail(authenticationRequest.Email);

            if (user == null) return null;

            // Validación segura con BCrypt
            if (BCrypt.Net.BCrypt.Verify(authenticationRequest.Password, user.Password))
                return user;

            return null;
        }

        public AuthenticationResponse Autenticar(AuthenticationRequest authenticationRequest)
        {
            var user = ValidateUser(authenticationRequest);

            if (user == null)
            {
                throw new UnauthorizedAccessException("User authentication failed");
            }

            var securityPassword = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_options.SecretForKey));
            var credentials = new SigningCredentials(securityPassword, SecurityAlgorithms.HmacSha256);

            // Obtenemos el rol como texto
            string userRole = user.MainRole.ToString();

            var claimsForToken = new List<Claim>
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("given_name", user.Name),
                new Claim("role", userRole)
            };

            var jwtSecurityToken = new JwtSecurityToken(
                _options.Issuer,
                _options.Audience,
                claimsForToken,
                DateTime.UtcNow,
                DateTime.UtcNow.AddHours(1),
                credentials);

            string tokenGenerado = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            // Aquí está el cambio clave: devolvemos Token y Rol al Controller
            return new AuthenticationResponse
            {
                Token = tokenGenerado,
                Role = userRole.ToLower(), 
                UserId = user.Id
            };
        }

        public class AutenticacionServiceOptions
        {
            public const string AutenticacionService = "AutenticacionService";
            public string Issuer { get; set; } = string.Empty;
            public string Audience { get; set; } = string.Empty;
            public string SecretForKey { get; set; } = string.Empty;
        }
    }
}
