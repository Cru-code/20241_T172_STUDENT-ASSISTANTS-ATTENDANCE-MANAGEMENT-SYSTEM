using Microsoft.AspNetCore.Mvc;

namespace ZKTecoIntegration.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ZKTecoController : ControllerBase
    {
        [HttpGet("connect")]
        public IActionResult ConnectToDevice()
        {
            try
            {
                Type zkemType = Type.GetTypeFromProgID("zkemkeeper.ZKEM.1");
                dynamic zkem = Activator.CreateInstance(zkemType);

                bool isConnected = zkem.Connect_Net("192.168.1.201", 4370);
                return Ok(isConnected ? "Connected successfully!" : "Failed to connect.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
