using Application.Interfaces;
using Application.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [Authorize(Roles = "Manager,Doctor,Patient")]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var appointment = _appointmentService.GetById(id);
                return Ok(appointment); 
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize(Roles = "Manager,Doctor")]
        [HttpPost]
        public IActionResult Create([FromBody] CreateAppointmentDTO dto)
        {
            try
            {
                var createdAppointment = _appointmentService.Create(dto);
                return CreatedAtAction(nameof(GetById), new { id = createdAppointment.Id }, createdAppointment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Reprogramar un turno
        [Authorize(Roles = "Manager")]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] CreateAppointmentDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("El ID de la ruta no coincide con el ID enviado en los datos.");
            }

            try
            {
                var updatedAppointment = _appointmentService.UpdateAppointment(dto);
                return Ok(updatedAppointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Para actualizar estado y observaciones 
        [Authorize(Roles = "Manager,Doctor")]
        [HttpPatch("{id}/notes")]
        public IActionResult UpdateNotesAndStatus(int id, [FromBody] UpdateAppointmentNotesDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("El ID de la ruta no coincide con el ID enviado en los datos.");
            }

            try
            {
                var updatedAppointment = _appointmentService.UpdateNotesAndStatus(dto);
                return Ok(updatedAppointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("book")]
        public IActionResult BookAppointment([FromBody] BookAppointmentDTO dto)
        {
            try
            {
                var bookedAppointment = _appointmentService.BookAppointment(dto);
                return Ok(bookedAppointment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Patient")] 
        [HttpPut("cancel/{id}")]
        public IActionResult CancelAppointmentByPatient(int id)
        {
            try
            {
                _appointmentService.CancelAppointmentByPatient(id);
                return Ok(new { message = "Turno cancelado y liberado con éxito." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error inesperado al cancelar: {ex.Message}");
            }
        }
    }
}