using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Security.Claims;
using WebGIS.Models;
using WebGIS.ProviderClass;
using WebGIS.ToolClass;

namespace WebGIS.Controllers
{
    [Route("api/[controller]/[action]")]
    public class HomeController : ControllerBase
    {
        WebGISContext DbContext = DbContextProvider.dbContext as WebGISContext;

        [AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromForm]string UserName, [FromForm]string Password, [FromForm]string returnUrl)
        {
            Password = MD5EncryptionCom.MD5Encrypt(Password);

            var UserInfo = DbContext.Platform_UserInfo.Where(v => v.UserName.Equals(UserName) && v.Password.Equals(Password)).FirstOrDefault();
            if (UserInfo == null)
            {
                return new JsonResult(new { code = "1", data = "用户名密码错误" });
            }

            if (string.IsNullOrEmpty(UserInfo.GUID))
            {
                UserInfo.GUID = Guid.NewGuid().ToString();
                DbContext.SaveChanges();
            }

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, UserInfo.GUID));
            identity.AddClaim(new Claim(ClaimTypes.Name, UserInfo.UserName));
            identity.AddClaim(new Claim("IsAdministrator", UserInfo.IsAdministrator.Trim()));
            identity.AddClaim(new Claim(ClaimTypes.Role, UserInfo.IsAdministrator.Trim() == "是" ? "Administrator" : "User"));
            HttpContext.SignInAsync(identity.AuthenticationType, new ClaimsPrincipal(identity));

            returnUrl = returnUrl != null ? returnUrl : "/Page/OneMap";
            return new JsonResult(new { code = "0", data = returnUrl });
        }

        [Authorize]
        [HttpPost]
        public IActionResult LoginOut()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return new JsonResult(new { code = "0", data = "/Page/LoginPage" });
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return RedirectToAction("LoginPage", "Page");
        }
    }
}