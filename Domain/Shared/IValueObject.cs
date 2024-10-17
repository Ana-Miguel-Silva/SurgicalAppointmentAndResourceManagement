namespace DDDSample1.Domain.Shared
{
    public interface IValueObject
    {

        protected abstract IEnumerable<object> GetEqualityComponents();
        
    }
}