namespace DDDSample1.Domain.Appointments.Dto
{
    public class PrologDto
    {
        public string Day { get; private set; }
        public double Prob_CrossOver { get; private set; }
        public double Prob_Mutation { get; private set; }
        public int N_Generations { get; private set; }
        public int Base_Population { get; private set; }

        public PrologDto(string day,double prob_CrossOver, double prob_Mutation, int n_Generations , int base_Population)
        {
            Day = day;
            Prob_CrossOver = prob_CrossOver;
            Prob_Mutation = prob_Mutation;
            N_Generations = n_Generations;
            Base_Population = base_Population;
        }
    }
}