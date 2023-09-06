using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Photo
    {
        [Key]
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
    }
}