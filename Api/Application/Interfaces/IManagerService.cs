using Application.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IManagerService
    {
        ManagerDTO GetByUserId(int userId);
        ManagerDTO Create(ManagerDTO managerDto);
        ManagerDTO UpdateProfile(int managerId, ManagerDTO managerDto);
    }
}
