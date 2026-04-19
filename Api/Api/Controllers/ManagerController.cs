using Application.Interfaces;
using Application.Models.Dtos;
using Application.Models.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;
        public ManagerController(IManagerService managerService)
        {
            _managerService = managerService;
        }

        [HttpGet("GetProfile/{userId}")]
        public IActionResult GetProfile(int userId)
        {
            try
            {
                var manager = _managerService.GetByUserId(userId);
                return Ok(manager);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult Add([FromBody] ManagerDTO managertDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var addedManager = _managerService.Create(managertDto);
                return Ok(addedManager);
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

        [HttpPut("UpdateProfile/{managerId}")] 
        public IActionResult UpdateProfile(int managerId, [FromBody] ManagerDTO managerDto)
        {
            try
            {
                var updatedManager = _managerService.UpdateProfile(managerId, managerDto);
                return Ok(updatedManager);    
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
