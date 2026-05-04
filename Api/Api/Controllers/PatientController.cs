using Application.Interfaces;
using Application.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    { 
        private readonly IPatientService _patientService;
        private readonly IAppointmentService _appointmentService;
        public PatientController(IPatientService patientService, IAppointmentService appointmentService)
        {
            _patientService = patientService;
            _appointmentService = appointmentService;
        }


        [Authorize]
        [HttpGet("GetProfile/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            try
            {
                var patient = _patientService.GetByUserId(userId);
                return Ok(patient);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }



        [Authorize]
        [HttpGet("GetByDni/{dni}")]
        public IActionResult GetByDni(int dni)
        {
            try
            {
                var patient = _patientService.GetByDni(dni);
                if (patient == null)
                {
                    return NotFound($"No se encontró un paciente con DNI {dni}.");
                }
                return Ok(patient);
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



        [HttpPost]
        public IActionResult Add([FromBody] PatientDTO patientDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var addedPatient = _patientService.Create(patientDto);
                return Ok(addedPatient);
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



        [Authorize(Roles = "Manager,Patient")]
        [HttpPut("UpdateProfile/{patientId}")] 
        public IActionResult UpdateProfile(int patientId, [FromBody] PatientDTO patientDto)
        {
            try
            {
                var updatedPatient = _patientService.UpdateProfile(patientId, patientDto);
                return Ok(updatedPatient);
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



        [Authorize(Roles = "Manager,Patient")]
        [HttpGet("{patientId}/appointments")]
        public IActionResult GetPatientAppointments(int patientId)
        {
            try
            {
                var appointments = _appointmentService.GetByPatientId(patientId);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado al cargar las reservas: {ex.Message}");
            }
        }



        [Authorize(Roles = "Manager,Patient,Doctor")]
        [HttpGet("{patientId}/history")]
        public IActionResult GetPatientHistory(int patientId)
        {
            try
            {
                var history = _appointmentService.GetPatientHistory(patientId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener el historial clínico: {ex.Message}");
            }
        }
    }
}
