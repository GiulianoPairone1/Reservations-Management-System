using Application.Interfaces;
using Application.Models.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ICustomAuthenticationService _authenticationService;

        public AuthenticationController(ICustomAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("authenticate")]
        public ActionResult<AuthenticationResponse> Autenticar([FromBody] AuthenticationRequest authenticationRequest)
        {
            try
            {
                // Ahora el servicio devuelve el Token y el Rol encapsulados
                AuthenticationResponse response = _authenticationService.Autenticar(authenticationRequest);

                // Devuelve un JSON: { "token": "...", "role": "..." }
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos." });
            }
        }
    }
}
