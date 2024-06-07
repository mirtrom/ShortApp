using DAL;
using DAL.Data;
using DAL.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace WebApp.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly Context _dbContext;
        private readonly JwtService _jwtService;
        public AuthenticationService(Context dbContext, JwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }
        public async Task<RegistrationResult> RegisterAsync(string email, string password, string firstName, string lastName, string phoneNumber)
        {
            var dbUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (dbUser != null)
            {
                return new RegistrationResult
                {
                    Status = RegistrationStatus.Fail,
                    Message = "Email already exists"
                };
            }
            var user = new ApplicationUser
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                PhoneNumber = phoneNumber
            };
            user.PasswordHash = HashPassword(password);
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return new RegistrationResult
            {
                Status = RegistrationStatus.Success,
                Message = "User registered successfully"
            };
        }

        public async Task<AuthenticationResult> AuthenticateAsync(string email, string password)
        {
            var dbUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (dbUser != null && VerifyPassword(password, dbUser.PasswordHash!))
            {
                var token = _jwtService.CreateToken(dbUser);
                return new AuthenticationResult
                {
                    Status = AuthenticationStatus.Success,
                    Message = "User authenticated successfully",
                    Token = token
                };
            }
            return new AuthenticationResult
            {
                Status = AuthenticationStatus.Fail,
                Message = "Invalid email or password"
            };
        }

        public AuthenticationResult LogoutAsync()
        {
            return new AuthenticationResult
            {
                Status = AuthenticationStatus.Redirect,
                Message = "User logged out successfully",
                Token = null,
            };
        }

        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return HashPassword(password).ToLower() == hashedPassword.ToLower();
        }
    }
}
