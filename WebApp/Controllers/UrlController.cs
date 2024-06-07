using DAL.Data;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp.DTO;
using WebApp.Services;

namespace WebApp.Controllers
{
    public class UrlController : ControllerBase
    {
        private readonly Context _context;

        public UrlController(Context context)
        {
            _context = context;
        }

        [HttpGet("api/url")]
        public async Task<IActionResult> GetUrls()
        {
            var urls = await _context.Urls.ToListAsync();
            return Ok(urls);
        }

        [HttpGet("GetLinkInfo/{id}")]
        public IActionResult GetLinkInfo(int id)
        {
            var linkModel = _context.Urls.FirstOrDefault(l => l.Id == id);

            if (linkModel != null)
            {
                return Ok(new
                {
                    url = linkModel.Url,
                    shortUrl = linkModel.ShortUrl,
                    createdAt = linkModel.CreatedAt,
                });
            }
            else
            {
                return NotFound();
            }
        }
        [HttpPost("Add")]
        public IActionResult AddLink([FromBody] UrlDto linkDto)
        {
            if (linkDto == null || string.IsNullOrEmpty(linkDto.OriginalUrl))
            {
                return BadRequest("Original link cannot be empty");
            }


            string shortenedLink = UrlGenerator.GenerateUrl(linkDto.OriginalUrl);


            var newLink = new UrlModel
            {
                Url = linkDto.OriginalUrl,
                ShortUrl = shortenedLink,
                CreatedAt = DateTime.Now
            };


            _context.Urls.Add(newLink);
            _context.SaveChanges();

            return Ok(newLink);
        }
    }
}
