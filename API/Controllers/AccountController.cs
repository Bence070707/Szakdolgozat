using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AccountController(UserManager<AppUser> userManager,
    ITokenService tokenService,
    IEmailService emailService,
    IConfiguration configuration) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                IsArchived = true
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("identity", error.Description);
                }

                return ValidationProblem();
            }

            await userManager.AddToRoleAsync(user, "Manager");

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null || user.IsArchived) return Unauthorized("Nem megfelelő email vagy a fiók archiválva van!");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized();

            await GenerateRefreshToken(user);

            return Ok(await user.ToDto(tokenService));
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken == null) return NoContent();

            var user = await userManager.Users
                .FirstOrDefaultAsync(x => x.RefreshToken == refreshToken
                    && x.RefreshTokenExpiry > DateTime.UtcNow
                    && !x.IsArchived);

            if (user == null) return Unauthorized();

            await GenerateRefreshToken(user);

            return await user.ToDto(tokenService);
        }

        private async Task GenerateRefreshToken(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(1);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(1)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await userManager.Users.Where(x => x.Id == User.FindFirstValue(ClaimTypes.NameIdentifier)).ExecuteUpdateAsync(setter => setter.SetProperty(x => x.RefreshToken, _ => null)
            .SetProperty(x => x.RefreshTokenExpiry, _ => null));

            Response.Cookies.Delete("refreshToken");
            return Ok();
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await userManager.FindByEmailAsync(forgotPasswordDto.Email);

            if (user == null)
                return Ok();

            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var frontendUrl = configuration["FrontendUrl"];

            if (string.IsNullOrEmpty(frontendUrl)) throw new InvalidOperationException("FrontendUrl is not configured in appsettings.");

            var resetLink = $"{frontendUrl}reset-password?email={forgotPasswordDto.Email}&token={encodedToken}";

            await emailService.SendEmailAsync(forgotPasswordDto.Email, "Jelszó helyreállítás", resetLink);

            return Ok();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await userManager.FindByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("Nem található fiók a megadott email címmel.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));

            var result = await userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest("Valami hiba történt.");

            return Ok();
        }
    }
}
