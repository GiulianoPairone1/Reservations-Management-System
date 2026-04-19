using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class ManagerRepository:EfRepository<Manager>, IManagerRepository
    {
        private readonly ApplicationDbContext _context;

        public ManagerRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        } 

        public Manager? GetByUserId(int userId)
        {
            return _context.Managers
                .Include(m => m.User)
                .FirstOrDefault(m => m.UserId == userId);
        }

        public Manager? GetByIdWithUser(int id)
        {
            return _context.Managers
                .Include(p => p.User) 
                .FirstOrDefault(p => p.Id == id);
        }
    }
}
