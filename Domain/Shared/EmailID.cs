using System;
using Newtonsoft.Json;

namespace DDDSample1.Domain.Shared
{
    public class EmailID : EntityId
    {
        [JsonConstructor]
        public EmailID(Guid value) : base(value)
        {
        }

        public EmailID(String value) : base(value)
        {
        }

        override
        protected  Object createFromString(String text){
            return new Guid(text);
        }

        override
        public String AsString(){
            Guid obj = (Guid) base.ObjValue;
            return obj.ToString();
        }
        
       
        public Guid AsGuid(){
            return (Guid) base.ObjValue;
        }
    }
}