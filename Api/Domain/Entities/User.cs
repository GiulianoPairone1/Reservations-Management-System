using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Enums;


namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public Roles MainRole { get; set; }
        [Required]      
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        [Phone]
        public string PhoneNumber { get; set; }
    }
}
