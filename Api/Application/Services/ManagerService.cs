using Application.Interfaces;
using Application.Models.Dtos;
using Application.Models.DTOs;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class ManagerService:IManagerService
    {
        private readonly IManagerRepository _managerRepository;
        public ManagerService(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }


        public ManagerDTO GetByUserId(int userId)
        {
            var manager = _managerRepository.GetByUserId(userId)
                ?? throw new KeyNotFoundException("Perfil de manager no encontrado");

            return ManagerDTO.FromManager(manager);
        }
        public ManagerDTO Create(ManagerDTO managerDto)
        {
            managerDto.Password = BCrypt.Net.BCrypt.HashPassword(managerDto.Password);
            var manager = managerDto.ToManager();
            _managerRepository.Add(manager);
            return ManagerDTO.FromManager(manager);
        }
        public ManagerDTO UpdateProfile(int managerId, ManagerDTO managerDto)
        {
            var manager = _managerRepository.GetByIdWithUser(managerId)
                        ?? throw new KeyNotFoundException("Gerente no encontrado");
            managerDto.UpdateManager(manager);
            _managerRepository.Update(manager);
            return ManagerDTO.FromManager(manager);
        }

    }
}
