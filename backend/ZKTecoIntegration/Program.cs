using System;

namespace ZKTecoIntegration
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                Type zkemType = Type.GetTypeFromProgID("zkemkeeper.ZKEM.1");
                if (zkemType == null)
                {
                    Console.WriteLine("zkemkeeper.ZKEM.1 not registered!");
                    return;
                }

                dynamic zkem = Activator.CreateInstance(zkemType);
                Console.WriteLine("zkemkeeper COM object created successfully.");

                bool isConnected = zkem.Connect_Net("192.168.1.201", 4370);
                Console.WriteLine(isConnected ? "Connected successfully!" : "Failed to connect.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }
}
