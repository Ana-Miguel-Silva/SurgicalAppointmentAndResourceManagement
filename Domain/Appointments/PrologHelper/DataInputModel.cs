using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Appointments.Dto
{
    public class DataInputModel
    {
        public DateTime Date { get; set; }
        public double Prob_CrossOver { get; set; }
        public double Prob_Mutation { get; set; }
        public int N_Generations { get; set; }
        public int Base_Population { get; set; }
    }

}