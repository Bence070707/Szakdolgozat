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
public class OthersController(IOthersRepository othersRepository) : ControllerBase
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

    [HttpPut("{id}")]
    public async Task<ActionResult<Other>> UpdateOther(string id, Other updatedOther)
    {
        if (id != updatedOther.Id)
        {
            return BadRequest("Nem ugyanaz az ID.");
        }

        var other = await othersRepository.FindOtherById(id);
        if (other is null) return BadRequest("Egyeb termek nem talalhato");

        other.Name = updatedOther.Name;
        other.Price = updatedOther.Price;
        other.Quantity = updatedOther.Quantity;
        await othersRepository.UpdateOther(other);
        return Ok(other);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("archive/{id}")]
    public async Task<ActionResult> ArchiveOther(string id)
    {
        var other = await othersRepository.FindOtherById(id);
        if (other is null) return NotFound("Egyeb termek nem talalhato");

        if (other.IsArchived) return Ok();

        var archived = await othersRepository.ArchiveOtherAsync(id);
        if (!archived) return BadRequest("Hiba tortent az egyeb termek archivalsa soran");

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
    [HttpPost("createother")]
    public async Task<ActionResult<string>> CreateOther(CreateOtherDto createOtherDto)
    {
        var result = await othersRepository.CreateOther(createOtherDto);
        if (result is not null) return Ok(new { OtherId = result });
        return BadRequest("Hiba tortent az egyeb termek letrehozasa soran.");
    }
}
