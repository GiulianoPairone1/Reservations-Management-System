using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class EfRepository<T> : RepositoryBase<T> where T : class
    {
        public readonly ApplicationDbContext _context;
        public EfRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
    }
}
