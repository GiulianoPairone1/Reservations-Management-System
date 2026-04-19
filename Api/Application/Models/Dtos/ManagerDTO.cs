using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Dtos
{
    public class ManagerDTO
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string? Password { get; set; }
        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required]
        public int DNI { get; set; }



        public Manager ToManager()
        {
            return new Manager
            {
                DNI = this.DNI,
                User = new User
                {
                    Name = this.Name,
                    Surname = this.Surname,
                    Email = this.Email,
                    Password = this.Password,
                    PhoneNumber = this.PhoneNumber,
                    MainRole= Roles.Manager
                }
            };
        }

        public void UpdateManager(Manager manager)
        {
            manager.User.Name = this.Name;
            manager.User.Surname = this.Surname;
            manager.User.Email = this.Email;
            manager.User.PhoneNumber = this.PhoneNumber;
            manager.DNI = this.DNI;
            if (!string.IsNullOrWhiteSpace(this.Password))
            {
                manager.User.Password = BCrypt.Net.BCrypt.HashPassword(this.Password);
            }
        }


        public static ManagerDTO FromManager(Manager manager)
        {
            return new ManagerDTO
            {
                Id = manager.Id,
                Name = manager.User?.Name,
                Surname = manager.User?.Surname,
                Email = manager.User?.Email,
                PhoneNumber = manager.User?.PhoneNumber,
                DNI = manager.DNI,
            };
        }
    }
}
