using zkemkeeper; // Ensure this namespace is included

namespace ZKTecoIntegration.Utilities
{
    public class ZkemClient
    {
        private readonly CZKEM _zkemClient;

        public ZkemClient()
        {
            _zkemClient = new CZKEM(); // Initialize the COM object
        }

        public bool Connect_Net(string ipAddress, int port)
        {
            return _zkemClient.Connect_Net(ipAddress, port);
        }

        public bool ReadAllUserID(int machineNumber)
        {
            return _zkemClient.ReadAllUserID(machineNumber);
        }

        public bool SSR_GetAllUserInfo(
            int machineNumber,
            out string enrollNumber,
            out string name,
            out string password,
            out int privilege,
            out bool enabled)
        {
            return _zkemClient.SSR_GetAllUserInfo(
                machineNumber,
                out enrollNumber,
                out name,
                out password,
                out privilege,
                out enabled);
        }
    }
}
