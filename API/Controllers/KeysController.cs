using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Admin,Manager")]
[Route("[controller]")]
[ApiController]
public class KeysController(IKeysRepository keysRepository, IImageService imageService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Key>>> GetKeys([FromQuery] PagingParams pagingParams, [FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var keys = await keysRepository.GetKeysAsync(pagingParams, canIncludeArchived);
        return Ok(keys);
    }

    [HttpGet("getallkeys")]
    public async Task<ActionResult<IReadOnlyList<Key>>> GetAllKeys([FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var keys = await keysRepository.GetAllKeysAsync(canIncludeArchived);
        return Ok(keys);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Key>> GetKeyById(string id)
    {
        var key = await keysRepository.FindKeyByIdAsync(id);
        if (key == null)
        {
            return NotFound();
        }

        return Ok(key);
    }

    [HttpDelete("deleteimage")]
    public async Task<ActionResult> DeleteImage([FromQuery] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest("Hianyzik a publicId.");
        }

        var image = await keysRepository.FindImageByPublicIdAsync(publicId);
        if (image is null)
        {
            return NotFound("A kep nem talalhato az adatbazisban.");
        }

        var result = await imageService.DeleteImageAsync(publicId);
        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }

        var dbDeleted = await keysRepository.DeleteImageByPublicIdAsync(publicId);
        if (!dbDeleted)
        {
            return BadRequest("A kep torlese az adatbazisbol nem sikerult.");
        }

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Key>> UpdateKey(string id, [FromForm] UpdateKeyDto updatedKeyDto)
    {
        if (id != updatedKeyDto.Id)
        {
            return BadRequest("Nem ugyanaz az ID.");
        }

        var baseKey = await keysRepository.FindKeyByIdAsync(id);
        if (baseKey is null) return BadRequest("Kulcs nem talalhato");

        var isAdmin = User.IsInRole("Admin");
        if (updatedKeyDto.Images.Count > 0 && !isAdmin)
        {
            return Forbid();
        }

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return BadRequest("Nem talalhato bejelentkezett felhasznalo.");

        var uploadedImages = new List<KeyImage>();
        foreach (var image in updatedKeyDto.Images)
        {
            var uploadResult = await imageService.UploadImageAsync(image);
            if (uploadResult.Error != null)
            {
                foreach (var uploadedImage in uploadedImages.Where(x => !string.IsNullOrWhiteSpace(x.PublicId)))
                {
                    await imageService.DeleteImageAsync(uploadedImage.PublicId!);
                }

                return BadRequest(uploadResult.Error.Message);
            }

            uploadedImages.Add(new KeyImage
            {
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                KeyId = baseKey.Id
            });
        }

        var updatedKey = new Key
        {
            Id = updatedKeyDto.Id,
            PriceType = (API.Enums.KeyPriceType)updatedKeyDto.PriceType,
            SilcaCode = baseKey.SilcaCode,
            ErrebiCode = baseKey.ErrebiCode,
            JmaCode = baseKey.JmaCode,
            Price = updatedKeyDto.Price,
            Quantity = updatedKeyDto.Quantity,
            IsArchived = baseKey.IsArchived,
            ArchivedAt = baseKey.ArchivedAt
        };

        var result = await keysRepository.UpdateKey(id, updatedKey, uploadedImages, isAdmin, userId);
        if (result)
        {
            var refreshedKey = await keysRepository.FindKeyByIdAsync(id);
            if (refreshedKey is not null)
            {
                return Ok(refreshedKey);
            }

            return Ok();
        }

        foreach (var uploadedImage in uploadedImages.Where(x => !string.IsNullOrWhiteSpace(x.PublicId)))
        {
            await imageService.DeleteImageAsync(uploadedImage.PublicId!);
        }

        return BadRequest("Hiba tortent a frissites soran");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("archive/{id}")]
    public async Task<ActionResult> ArchiveKey(string id)
    {
        var key = await keysRepository.FindKeyByIdAsync(id);
        if (key is null) return NotFound("Kulcs nem talalhato");

        if (key.IsArchived) return Ok();

        var archived = await keysRepository.ArchiveKeyAsync(id);
        if (!archived) return BadRequest("Hiba tortent a kulcs archivalasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("unarchive/{id}")]
    public async Task<ActionResult> UnarchiveKey(string id)
    {
        var key = await keysRepository.FindKeyByIdAsync(id);
        if (key is null) return NotFound("Kulcs nem talalhato");

        if (!key.IsArchived) return Ok();

        var unarchived = await keysRepository.UnarchiveKeyAsync(id);
        if (!unarchived) return BadRequest("Hiba tortent a kulcs visszaallitasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("createkey")]
    public async Task<ActionResult<string>> CreateKey(CreateKeyDto createKeyDto)
    {
        var result = await keysRepository.CreateKey(createKeyDto);
        if (result is not null) return Ok(new { KeyId = result });

        return BadRequest("Hiba tortent a kulcs letrehozasa soran.");
    }
}
