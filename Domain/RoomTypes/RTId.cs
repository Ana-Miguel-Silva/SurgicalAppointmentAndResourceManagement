using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.RoomTypess
{
    public class RTId : EntityId
    {
        [JsonConstructor]
        public RTId(Guid value) : base(value)
        {
        }

        public RTId(String value) : base(value)
        {
        }

        override
        protected Object createFromString(String text)
        {
            return new Guid(text);
        }

        override
        public String AsString()
        {
            Guid obj = (Guid)base.ObjValue;
            return obj.ToString();
        }


        public Guid AsGuid()
        {
            return (Guid)base.ObjValue;
        }

        public static implicit operator RTId(Guid v)
        {
            throw new NotImplementedException();
        }
    }
}