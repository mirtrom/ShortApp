using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public enum RegistrationStatus
    {
        Success,
        Fail
    }
    public enum AuthenticationStatus
    {
        Success,
        Redirect,
        Fail
    }
}
