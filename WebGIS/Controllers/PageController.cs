using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebGIS.Controllers
{
    public class PageController : Controller
    {
        [AllowAnonymous]
        [HttpGet]
        public IActionResult LoginPage(string ReturnUrl = null)
        {
            TempData["ReturnUrl"] = ReturnUrl;
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult OneMap()
        {
            return View();
        }

        [Authorize]
        [HttpGet]
        public IActionResult SystemConfig()
        {
            return View();
        }

    }
}