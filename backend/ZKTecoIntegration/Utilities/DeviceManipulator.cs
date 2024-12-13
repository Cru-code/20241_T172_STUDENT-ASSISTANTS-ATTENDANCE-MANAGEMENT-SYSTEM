using System.Collections.Generic;
using ZKTecoIntegration.Models;

namespace ZKTecoIntegration.Utilities
{
    public class DeviceManipulator
    {
        public ICollection<UserInfo> GetAllUserInfo(ZkemClient objZkeeper, int machineNumber)
        {
            string sdwEnrollNumber = string.Empty, sName = string.Empty, sPassword = string.Empty;
            int iPrivilege = 0;
            bool bEnabled = false;

            ICollection<UserInfo> lstFPTemplates = new List<UserInfo>();

            objZkeeper.ReadAllUserID(machineNumber);
            objZkeeper.ReadAllTemplate(machineNumber);

            while (objZkeeper.SSR_GetAllUserInfo(machineNumber, out sdwEnrollNumber, out sName, out sPassword, out iPrivilege, out bEnabled))
            {
                lstFPTemplates.Add(new UserInfo
                {
                    EnrollNumber = sdwEnrollNumber,
                    Name = sName,
                    Privilege = iPrivilege,
                    Enabled = bEnabled
                });
            }

            return lstFPTemplates;
        }
    }
}
