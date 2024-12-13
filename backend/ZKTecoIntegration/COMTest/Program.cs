using System;

namespace COMTest
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
#pragma warning disable CA1416 // Platform compatibility
                Type zkemType = Type.GetTypeFromProgID("zkemkeeper.ZKEM.1");
                dynamic zkem = Activator.CreateInstance(zkemType);
#pragma warning restore CA1416

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
