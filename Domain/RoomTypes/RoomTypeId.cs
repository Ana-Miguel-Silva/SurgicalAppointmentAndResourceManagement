using System;
using DDDSample1.Domain.Shared;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace DDDSample1.Domain.RoomTypess
{
    
    public class RoomTypeId 
    {
        public string Value { get; private set; }

        [JsonConstructor]


        public RoomTypeId(string value)
        {
            if (!IsValidRoomTypeId(value))
            {
                throw new ArgumentException("RoomTypeId must be exactly 8 characters long, without spaces, and only contain letters, numbers, or '-'.");
            }

            this.Value = value;
        }

        private static bool IsValidRoomTypeId(string id)
        {
            // Validação: 8 caracteres, sem espaços, apenas letras, números e '-'
            return !string.IsNullOrWhiteSpace(id) &&
                   Regex.IsMatch(id, @"^[a-zA-Z0-9-]{8}$");
        }

        public override string ToString() => Value;

        public override bool Equals(object obj) => obj is RoomTypeId other && Value == other.Value;


        public override int GetHashCode() => Value.GetHashCode();

      
    }
}