using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class SlotDTO
    {
        public List<DateDTO> Slots { get; set; }

        public SlotDTO(List<DateDTO> slots)
        {
            this.Slots = slots;
        }

    }
}