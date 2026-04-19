using Application.Interfaces;
using Application.Models.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;
        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

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


    }
}
