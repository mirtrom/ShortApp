using DAL.Models;

namespace WebApp.Services
{
    public interface IAuthenticationService
    {
        Task<AuthenticationResult> AuthenticateAsync(string email, string password);
        AuthenticationResult LogoutAsync();
        Task<RegistrationResult> RegisterAsync(string email, string password, string firstName, string lastName, string phoneNumber);
    }
}