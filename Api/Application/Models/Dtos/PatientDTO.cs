using Domain.Entities;
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.DTOs
{
    public class PatientDTO
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

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public string ObraSocial { get; set; } = string.Empty;

        public Patient ToPatient()
        {
            return new Patient
            {
                DNI = this.DNI,
                Address = this.Address,
                ObraSocial = this.ObraSocial,

                User = new User
                {
                    Name = this.Name,
                    Surname = this.Surname,
                    Email = this.Email,
                    Password = this.Password,
                    PhoneNumber = this.PhoneNumber,
                    MainRole = Roles.Patient
                }
            };
        }

        public void UpdatePatient(Patient patient)
        {
            patient.DNI = this.DNI;
            if (patient.User != null)
            {
                patient.User.Name = this.Name;
                patient.User.Surname = this.Surname;
                patient.User.Email = this.Email;
                patient.User.PhoneNumber = this.PhoneNumber;
                if (!string.IsNullOrWhiteSpace(this.Password))
                {
                    patient.User.Password = BCrypt.Net.BCrypt.HashPassword(this.Password);
                }
            }
            patient.Address = this.Address;
            patient.ObraSocial = this.ObraSocial;
        }

        public static PatientDTO FromPatient(Patient patient)
        {
            return new PatientDTO
            {
                Id = patient.Id,
                DNI = patient.DNI,
                Name = patient.User?.Name ?? "",
                Surname = patient.User?.Surname ?? "",
                Email = patient.User?.Email ?? "",
                PhoneNumber = patient.User?.PhoneNumber ?? "",
                Address = patient.Address ?? "",
                ObraSocial = patient.ObraSocial ?? ""
            };
        }
    }
}