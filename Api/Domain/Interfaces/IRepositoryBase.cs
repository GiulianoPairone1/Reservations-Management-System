using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IRepositoryBase<T> where T : class
    {
        T GetById(int? id);
        List<T> GetAll();
        T Add(T entity);
        T Update(T entity);
        T Delete(T entity);
    }
}
