namespace DDDSample1.Domain.Appointments
{
    public class ScheduleInputData
    {
        public DateTime Date { get; set; }
        public double Prob_CrossOver { get; set; }
        public double Prob_Mutation { get; set; }
        public int N_Generations { get; set; }
        public int Base_Population { get; set; }
    }

}