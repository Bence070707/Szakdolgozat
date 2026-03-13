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
public class OthersController(IOthersRepository othersRepository, IImageService imageService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Other>>> GetOthers([FromQuery] PagingParams pagingParams, [FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var others = await othersRepository.GetOthers(pagingParams, canIncludeArchived);
        return Ok(others);
    }

    [HttpGet("getallothers")]
    public async Task<ActionResult<IReadOnlyList<Other>>> GetAllOthers([FromQuery] bool includeArchived = false)
    {
        var canIncludeArchived = includeArchived && User.IsInRole("Admin");
        var others = await othersRepository.GetAllOthersAsync(canIncludeArchived);
        return Ok(others);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Other>> GetOtherById(string id)
    {
        var other = await othersRepository.FindOtherById(id);
        if (other == null)
        {
            return NotFound();
        }

        return Ok(other);
    }

    [HttpDelete("deleteimage")]
    public async Task<ActionResult> DeleteImage([FromQuery] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest("Hianyzik a publicId.");
        }

        var image = await othersRepository.FindImageByPublicIdAsync(publicId);
        if (image is null)
        {
            return NotFound("A kep nem talalhato az adatbazisban.");
        }

        var result = await imageService.DeleteImageAsync(publicId);
        if (result.Error != null)
        {
            return BadRequest(result.Error.Message);
        }

        var dbDeleted = await othersRepository.DeleteImageByPublicIdAsync(publicId);
        if (!dbDeleted)
        {
            return BadRequest("A kep torlese az adatbazisbol nem sikerult.");
        }

        return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Other>> UpdateOther(string id, [FromForm] UpdateOtherDto updatedOtherDto)
    {
        if (id != updatedOtherDto.Id)
        {
            return BadRequest("Nem ugyanaz az ID.");
        }

        var other = await othersRepository.FindOtherById(id);
        if (other is null) return BadRequest("Egyeb termek nem talalhato");

        var isAdmin = User.IsInRole("Admin");
        if (updatedOtherDto.Images.Count > 0 && !isAdmin)
        {
            return Forbid();
        }

        var uploadedImages = new List<OtherImage>();
        foreach (var image in updatedOtherDto.Images)
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

            uploadedImages.Add(new OtherImage
            {
                Url = uploadResult.SecureUrl.AbsoluteUri,
                PublicId = uploadResult.PublicId,
                OtherId = other.Id
            });
        }

        var updatedOther = new Other
        {
            Id = updatedOtherDto.Id,
            Name = updatedOtherDto.Name,
            Price = updatedOtherDto.Price,
            Quantity = updatedOtherDto.Quantity,
            IsArchived = other.IsArchived,
            ArchivedAt = other.ArchivedAt
        };

        var result = await othersRepository.UpdateOther(id, updatedOther, uploadedImages);
        if (result)
        {
            var refreshedOther = await othersRepository.FindOtherById(id);
            if (refreshedOther is not null)
            {
                return Ok(refreshedOther);
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
    public async Task<ActionResult> ArchiveOther(string id)
    {
        var other = await othersRepository.FindOtherById(id);
        if (other is null) return NotFound("Egyeb termek nem talalhato");

        if (other.IsArchived) return Ok();

        var archived = await othersRepository.ArchiveOtherAsync(id);
        if (!archived) return BadRequest("Hiba tortent az egyeb termek archivalasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("unarchive/{id}")]
    public async Task<ActionResult> UnarchiveOther(string id)
    {
        var other = await othersRepository.FindOtherById(id);
        if (other is null) return NotFound("Egyeb termek nem talalhato");

        if (!other.IsArchived) return Ok();

        var unarchived = await othersRepository.UnarchiveOtherAsync(id);
        if (!unarchived) return BadRequest("Hiba tortent az egyeb termek visszaallitasa soran");

        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("set-main-photo")]
    public async Task<ActionResult> SetMainPhoto(string otherId, string publicId)
    {
        var result = await othersRepository.SetMainPhoto(otherId, publicId);
        if (!result) return BadRequest("Valami hiba tortent");
        return Ok();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("createother")]
    public async Task<ActionResult<string>> CreateOther(CreateOtherDto createOtherDto)
    {
        var result = await othersRepository.CreateOther(createOtherDto);
        if (result is not null) return Ok(new { OtherId = result });
        return BadRequest("Hiba tortent az egyeb termek letrehozasa soran.");
    }
}
