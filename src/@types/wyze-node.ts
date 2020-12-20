declare module 'wyze-node' {
  interface Auth {
    username: string;

    password: string;
  }

  interface CameraThumbnail {
    thumbnails_url: string;

    thumbnails_ts: number;
  }

  interface DeviceStatus {
    p2p_id: string;

    p2p_type: number;

    ssid: string;

    ip: string;

    power_switch: number;

    temperature: string;

    humidity: string;

    temp_humi_room_type: number;

    comfort_standard_level: number;

    is_temperature_humidity: number;

    records_event_switch: number;

    motion_alarm_switch: number;

    audio_alarm_switch: number;

    smoke_alarm_switch: number;

    co_alarm_switch: number;

    electricity: string;

    battery_charging_status: string;

    is_link_toy_car: number;

    power_saving_mode_switch: number;

    camera_thumbnails: CameraThumbnail;
  }

  interface Device {
    mac: string;

    first_activation_ts: number;

    first_binding_ts: number;

    enr: string;

    nickname: string;

    timezone_name: string;

    product_model: string;

    product_model_logo_url: string;

    product_type: string;

    hardware_ver: string;

    firmware_ver: string;

    user_role: number;

    binding_user_nickname: string;

    conn_state: number;

    conn_state_ts: number;

    push_switch: number;

    device_params: DeviceStatus;

    is_in_auto: number;

    event_master_switch: number;

    parent_device_mac: string;

    parent_device_enr: string;

    binding_ts: number;

    timezone_gmt_offset: number;
  }

  type DeviceState = 'on' | 'off';

  export default class WyzeNode {
    public constructor(auth: Auth);

    public getDeviceList(): Promise<Device[]>;

    public getDeviceByName(deviceName: string): Promise<Device>;

    public turnOn(device: Device): Promise<void>;

    public getDeviceStatus(device: Device): Promise<DeviceStatus>;

    public getDeviceState(device: Device): Promise<DeviceState>;

    public turnOff(device: Device): Promise<void>;
  }
}
