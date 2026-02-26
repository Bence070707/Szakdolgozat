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
        public async Task<ActionResult> GetUserRoles([FromQuery] bool includeArchived = false)
        {
            var users = await userManager.Users
                .Where(x => includeArchived || !x.IsArchived)
                .ToListAsync();
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
                    user.IsArchived,
                    user.ArchivedAt,
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

        [HttpPost("archiveuser/{id}")]
        public async Task<ActionResult> ArchiveUser(string id)
        {
            var me = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (id == me) return BadRequest("Saját fiók archiválása nem engedélyezett");

            var user = await userManager.FindByIdAsync(id);
            if (user is null) return BadRequest("Nem található felhasználó!");

            if (user.IsArchived) return Ok();

            var updated = await userManager.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setter => setter
                    .SetProperty(x => x.IsArchived, _ => true)
                    .SetProperty(x => x.ArchivedAt, _ => DateTime.UtcNow)
                    .SetProperty(x => x.RefreshToken, _ => null)
                    .SetProperty(x => x.RefreshTokenExpiry, _ => null));

            if (updated == 0) return BadRequest("Hiba történt a felhasználó archiválása során");

            return Ok();
        }

        [HttpPost("unarchiveuser/{id}")]
        public async Task<ActionResult> UnarchiveUser(string id)
        {
            var user = await userManager.FindByIdAsync(id);
            if (user is null) return BadRequest("Nem található felhasználó!");

            if (!user.IsArchived) return Ok();

            var updated = await userManager.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setter => setter
                    .SetProperty(x => x.IsArchived, _ => false)
                    .SetProperty(x => x.ArchivedAt, _ => null));

            if (updated == 0) return BadRequest("Hiba történt a felhasználó visszaállítása során");

            return Ok();
        }
    }
}
