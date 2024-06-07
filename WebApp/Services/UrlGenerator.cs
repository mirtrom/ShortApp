using System.Security.Cryptography;
using System.Text;

namespace WebApp.Services
{
    public static class UrlGenerator
    {
        public static string GenerateUrl(string url)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(url));
                string hash = BitConverter.ToString(hashBytes).Replace("-", "").Substring(0, 6);
                return hash;
            }
        }
    }
}
