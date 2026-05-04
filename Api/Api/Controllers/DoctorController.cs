using Application.Interfaces;
using Application.Models.Dtos;
using Application.Models.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase 
    {
        private readonly IDoctorService _doctorservice;
        private readonly IAppointmentService _appointmentservice;
        public DoctorController(IDoctorService doctorservice,IAppointmentService appointmentService)
        {
            _doctorservice = doctorservice;
            _appointmentservice = appointmentService;
        }

        [Authorize(Roles = "Manager,Patient")]
        [HttpGet]
        public IActionResult GetAllDoctors()
        {
            try
            {
                var doctors = _doctorservice.GetAllDoctors();

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("GetProfile/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            try
            {
                var doctor = _doctorservice.GetByUserId(userId);
                return Ok(doctor);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("GetDoctorByMatricula/{matricula}")]
        public IActionResult GetByMatricula(string matricula)
        {
            try
            { 
                var doctor = _doctorservice.GetDoctorByMatricula(matricula);
                if (doctor == null)
                {
                    return NotFound($"No se encontró un doctor con matrícula {matricula}.");
                }
                return Ok(doctor);
            }
            catch (KeyNotFoundException KnfEx)
            {
                return NotFound(KnfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

        [Authorize(Roles = "Manager")]
        [HttpPost]
        public IActionResult Add([FromBody] DoctorDTO doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var addedDoctor = _doctorservice.Create(doctorDto);
                return Ok(addedDoctor);
            }
            catch (InvalidOperationException invOpEx)
            {
                return BadRequest(invOpEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

        [Authorize(Roles = "Manager,Doctor")]
        [HttpPut("UpdateProfile/{doctorId}")] 
        public IActionResult UpdateProfile(int doctorId, [FromBody] DoctorDTO doctorDto)
        {
            try
            {
                var updatedDoctor = _doctorservice.UpdateProfile(doctorId, doctorDto);
                return Ok(updatedDoctor);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }

        [Authorize(Roles = "Manager,Doctor,Patient")]
        [HttpGet("{doctorId}/appointments")]
        public IActionResult GetDoctorAppointments(int doctorId)
        {
            try
            {
                var appointments = _appointmentservice.GetByDoctorId(doctorId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado: {ex.Message}");
            }
        }
    }
}
