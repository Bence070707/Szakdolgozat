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
public class HeelsController(IHeelsRepository heelsRepository, IImageService imageService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Heel>>> GetHeels([FromQuery] PagingParams pagingParams, [FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var heels = await heelsRepository.GetHeels(pagingParams, canIncludeArchived);
        return Ok(heels);
    }

    [HttpGet("getallheels")]
    public async Task<ActionResult<IReadOnlyList<Heel>>> GetAllHeels([FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var heels = await heelsRepository.GetAllHeelsAsync(canIncludeArchived);
        return Ok(heels);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Heel>> GetHeelById(string id)
    {
        var heel = await heelsRepository.FindHeelById(id);
        if (heel == null)
        {
            return NotFound();
        }

        return Ok(heel);
    }

    [HttpDelete("deleteimage")]
    public async Task<ActionResult> DeleteImage([FromQuery] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest("Hianyzik a publicId.");
        }

        var image = await heelsRepository.FindImageByPublicIdAsync(publicId);
        if (image is null)
        {
            return NotFound("A kep nem talalhato az adatbazisban.");
        }

        var result = await imageService.DeleteImageAsync(publicId);
        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }

        var dbDeleted = await heelsRepository.DeleteImageByPublicIdAsync(publicId);
        if (!dbDeleted)
        {
            return BadRequest("A kep torlese az adatbazisbol nem sikerult.");
        }

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Heel>> UpdateHeel(string id, [FromForm] UpdateHeelDto updatedHeelDto)
    {
        if (id != updatedHeelDto.Id)
        {
            return BadRequest("Nem ugyanaz az ID.");
        }

        var heel = await heelsRepository.FindHeelById(id);
        if (heel is null) return BadRequest("Sarok nem talalhato");

        var isAdmin = User.IsInRole("Admin");
        if (updatedHeelDto.Images.Count > 0 && !isAdmin)
        {
            return Forbid();
        }

        var uploadedImages = new List<HeelImage>();
        foreach (var image in updatedHeelDto.Images)
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

            uploadedImages.Add(new HeelImage
            {
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                HeelId = heel.Id
            });
        }

        var updatedHeel = new Heel
        {
            Id = updatedHeelDto.Id,
            Code = heel.Code,
            Price = updatedHeelDto.Price,
            Quantity = updatedHeelDto.Quantity,
            IsArchived = heel.IsArchived,
            ArchivedAt = heel.ArchivedAt
        };

        var result = await heelsRepository.UpdateHeel(id, updatedHeel, uploadedImages);
        if (result)
        {
            var refreshedHeel = await heelsRepository.FindHeelById(id);
            if (refreshedHeel is not null)
            {
                return Ok(refreshedHeel);
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
    public async Task<ActionResult> ArchiveHeel(string id)
    {
        var heel = await heelsRepository.FindHeelById(id);
        if (heel is null) return NotFound("Sarok nem talalhato");

        if (heel.IsArchived) return Ok();

        var archived = await heelsRepository.ArchiveHeelAsync(id);
        if (!archived) return BadRequest("Hiba tortent a sarok archivalasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("unarchive/{id}")]
    public async Task<ActionResult> UnarchiveHeel(string id)
    {
        var heel = await heelsRepository.FindHeelById(id);
        if (heel is null) return NotFound("Sarok nem talalhato");

        if (!heel.IsArchived) return Ok();

        var unarchived = await heelsRepository.UnarchiveHeelAsync(id);
        if (!unarchived) return BadRequest("Hiba tortent a sarok visszaallitasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("set-main-photo")]
    public async Task<ActionResult> SetMainPhoto(string heelId, string publicId)
    {
        var result = await heelsRepository.SetMainPhoto(heelId, publicId);
        if (!result) return BadRequest("Valami hiba tortent");
        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("createheel")]
    public async Task<ActionResult<string>> CreateHeel(CreateHeelDto createHeelDto)
    {
        var result = await heelsRepository.CreateHeel(createHeelDto);
        if (result is not null) return Ok(new { HeelId = result });
        return BadRequest("Hiba tortent a sarok letrehozasa soran.");
    }
}
