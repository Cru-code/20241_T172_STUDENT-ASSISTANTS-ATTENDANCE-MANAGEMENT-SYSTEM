using System;

namespace ZKTecoIntegration.Services
{
    public class ZKTecoService : IZKTecoService
    {
        private dynamic _zkem;

        public ZKTecoService()
        {
            Type zkemType = Type.GetTypeFromProgID("zkemkeeper.ZKEM.1");
            _zkem = Activator.CreateInstance(zkemType);
        }

        public bool Connect(string ipAddress, int port)
        {
            return _zkem.Connect_Net(ipAddress, port);
        }
    }
}
