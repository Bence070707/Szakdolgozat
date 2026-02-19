using System;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    public required string DisplayName { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
}

public static class AppUserExtensions
{
    extension(AppUser appUser) {
        public async Task<UserDto> ToDto(ITokenService tokenService)
        {
            return new UserDto
            {
                DisplayName = appUser.DisplayName,
                Email = appUser.Email!,
                UserName = appUser.UserName!,
                Token = await tokenService.CreateToken(appUser)
            };
        }
    }
}
