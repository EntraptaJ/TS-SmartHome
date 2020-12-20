// src/Modules/WyzeDevices/WyzeDeviceService.ts
import { Service } from 'typedi';
import WyzeAPI from 'wyze-node';
import type { Device } from 'wyze-node';
import { config } from '../../Library/Config';

@Service()
export class WyzeDeviceService {
  public wyzeAPI = new WyzeAPI(config.wyze);

  public getAllDevices(): Promise<Device[]> {
    return this.wyzeAPI.getDeviceList();
  }

  public getWyzeDeviceByName(deviceName: string): Promise<Device> {
    return this.wyzeAPI.getDeviceByName(deviceName);
  }

  /**
   * Power on a Wyze device by name
   * @param deviceName Name of the Wyze Device
   *
   * @returns Boolean result of sucessful action
   */
  public async powerOnDeviceByName(deviceName: string): Promise<boolean> {
    const wyzeDevice = await this.wyzeAPI.getDeviceByName(deviceName);

    try {
      await this.wyzeAPI.turnOn(wyzeDevice);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Power off a Wyze device by name
   * @param deviceName Name of the Wyze Device
   *
   * @returns Boolean result of sucessful action
   */
  public async powerOffDeviceByName(deviceName: string): Promise<boolean> {
    const wyzeDevice = await this.wyzeAPI.getDeviceByName(deviceName);

    try {
      await this.wyzeAPI.turnOff(wyzeDevice);
      return true;
    } catch {
      return false;
    }
  }
}
