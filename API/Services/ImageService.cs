using System;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class ImageService : IImageService
{
    private readonly Cloudinary _cloudinary;

    public ImageService(IOptions<CloudinaryInfo> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret);

        _cloudinary = new Cloudinary(account);
    }
    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var deletePrms = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deletePrms);
    }

    public async Task<ImageUploadResult> UploadImageAsync(IFormFile formFile)
    {
        var uploadRes = new ImageUploadResult();

        if (formFile.Length > 0)
        {
            await using var stream = formFile.OpenReadStream();
            var uploadPrms = new ImageUploadParams
            {
                File = new FileDescription(formFile.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("auto:subject"),
                Folder = "Szakdolgozat"
            };

            uploadRes = await _cloudinary.UploadAsync(uploadPrms);
        }
        return uploadRes;
    }
}
