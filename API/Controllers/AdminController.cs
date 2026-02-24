using System.Security.Claims;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("[controller]")]
    [ApiController]
    public class AdminController(UserManager<AppUser> userManager) : ControllerBase
    {
        [HttpGet("userroles")]
        public async Task<ActionResult> GetUserRoles()
        {
            var users = await userManager.Users.ToListAsync();
            if (users == null) return NotFound("No users found");
            var userList = new List<object>();
            foreach (var user in users)
            {
                if(user.Id == User.FindFirstValue(ClaimTypes.NameIdentifier)) continue;
                var roles = await userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    user.Id,
                    user.Email,
                    Roles = roles
                });
            }
            return Ok(userList);
        }

        [HttpPost("edituserrole/{id}")]
        public async Task<ActionResult<IList<string>>> EditUserRoles(string id, [FromQuery] string roles)
        {
            if (string.IsNullOrEmpty(roles)) return BadRequest("Kötelező a változtatni kívánt szerepkör megadása");

            var newRoles = roles.Split(',').ToList();

            var user = await userManager.FindByIdAsync(id);

            if (user is null) return BadRequest("Nem található felhasználó!");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, newRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Hiba történt a szerepkör módosítása során!");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(newRoles));

            if (!result.Succeeded) return BadRequest("Hiba történt a szerepkör módosítása során!");

            return Ok(await userManager.GetRolesAsync(user));
        }

        [HttpGet("me")]
        public IActionResult GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(userId);
        }
    }
}
