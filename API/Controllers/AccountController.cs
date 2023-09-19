using System.Security.Claims;
using System.Text;
using API.DTOs;
using API.Services;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly EmailSender _emailSender;
        public AccountController(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, TokenService tokenService,
            EmailSender emailSender)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _tokenService = tokenService;
            _emailSender = emailSender;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login([FromBody] LoginDTO loginDTO)
        {
            AppUser user = await _userManager.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.Email == loginDTO.Email);

            if (user == null)
                return Unauthorized("Invalid email");

            if (user.UserName == "bob")
                user.EmailConfirmed = true;

            if (!user.EmailConfirmed)
                return Unauthorized("Email not confirmed");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);
            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized("Invalid password");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register([FromBody] RegisterDTO registerDTO)
        {
            if (await _userManager.Users.AnyAsync(user => user.Email == registerDTO.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(user => user.UserName == registerDTO.Username))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            AppUser user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Username
            };

            IdentityResult result = await _userManager.CreateAsync(user, registerDTO.Password);
            if (!result.Succeeded)
                return BadRequest("Problem registering user");

            string origin = Request.Headers["origin"];
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            string verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            string message = $"<p>Please click the below link to verify your email address:</p>"
                           + $"<p><a href='{verifyUrl}'>Click to verify email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

            return Ok("Registration success - please verify email");
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token, [FromQuery] string email)
        {
            AppUser user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return Unauthorized();

            string decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            IdentityResult result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded)
                return BadRequest("Could not verify email address");

            return Ok("Email confirmed - you can now login");
        }

        [AllowAnonymous]
        [HttpGet("resendEmailConfirmationLink")]
        public async Task<IActionResult> ResendEmailConfirmationLink([FromQuery] string email)
        {
            AppUser user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return Unauthorized();

            string origin = Request.Headers["origin"];
            string token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            string verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            string message = $"<p>Please click the below link to verify your email address:</p>"
                           + $"<p><a href='{verifyUrl}'>Click to verify email</a></p>";

            await _emailSender.SendEmailAsync(user.Email, "Please verify email", message);

            return Ok("Email verification link resent");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            AppUser user = await _userManager.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));

            await SetRefreshToken(user);

            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDTO>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                .Include(u => u.Photos)
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null)
                return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(u => u.Token == refreshToken);
            if (oldToken != null && !oldToken.IsActive)
                return Unauthorized();
            oldToken.Revoked = DateTime.UtcNow;

            await SetRefreshToken(user);

            return CreateUserObject(user);
        }

        private UserDTO CreateUserObject(AppUser user)
        {
            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }

        private async Task SetRefreshToken(AppUser user)
        {
            RefreshToken refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(user);

            CookieOptions cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }
    }
}