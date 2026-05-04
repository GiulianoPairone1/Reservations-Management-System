using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IAppointmentRepository:IRepositoryBase<Appointment>
    {
        bool CheckOverlap(int doctorId, DateTime timeWindowStart, DateTime timeWindowEnd);
        List<Appointment> GetHistoryWithDetailsByPatientId(int patientId);
    }
}
