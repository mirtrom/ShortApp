using DAL;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp.Services;

namespace WebApp.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await _authService.AuthenticateAsync(model.Email, model.Password);

            if (result.Status == AuthenticationStatus.Success)
            {

                return Ok(new AuthenticationResult
                {
                    Token = result.Token,
                    Status = result.Status,
                    State = result.State as ApplicationUser,
                    Message = result.Message
                });

            }
            else if (result.Status == AuthenticationStatus.Fail)
            {

                return BadRequest(new { Message = result.Message });
            }
            else
            {

                return StatusCode(500, new { Message = "An unexpected error occurred during login." });
            }
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            // Логіка реєстрації
            var registrationResult = await _authService.RegisterAsync(model.Email, model.Password, model.FirstName, model.LastName, model.PhoneNumber);

            if (registrationResult.Status == RegistrationStatus.Success)
            {
                // Успішна реєстрація
                return Ok(new RegistrationResult
                {
                    Status = registrationResult.Status,
                    Message = "Registration successful. You can now login."
                });
            }
            else
            {
                // Невдалий реєстрація - повертаємо відповідне повідомлення
                return BadRequest(new { Message = registrationResult.Message });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            _authService.LogoutAsync();
            return Ok(new { Message = "Logout successful." });
        }
    }
}
