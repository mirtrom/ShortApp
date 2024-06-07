using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class AuthenticationResult
    {
        public AuthenticationStatus Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public object State { get; set; }
        public string? Token { get; set; }
    }
}
