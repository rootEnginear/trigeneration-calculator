import type { TrigenInputDataType } from 'types/trigenTypes';

export type TrigenFieldDataKey = keyof TrigenInputDataType;

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

export type TrigenFieldDataType = PartialRecord<
	TrigenFieldDataKey,
	{
		label: string;
		placeholder?: string;
		unit: string;
		min?: number;
		max?: number;
		step?: number;
	}
>;

export const FIELD_DATA: TrigenFieldDataType = {
	// PG1
	hr_per_day: {
		label: 'ชั่วโมงการทำงานต่อวัน',
		unit: 'ชั่วโมง/วัน',
		min: 0,
		max: 24
	},
	day_per_year: {
		label: 'วันทำงานต่อปี',
		unit: 'วัน/ปี',
		min: 0,
		max: 366
	},
	electrical_cost: {
		label: 'ค่าไฟ',
		unit: 'บาท/ยูนิต',
		min: 2,
		max: 13
	},
	// PG2
	max_steam_volume: {
		label: 'อัตราการผลิตไอน้ำสูงสุด',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	max_steam_pressure: {
		label: 'ความดันไอน้ำที่ผลิตสูงสุด',
		unit: 'Barg',
		min: 0,
		max: 1000
	},
	prod_steam_volume: {
		label: 'อัตราการผลิตไอน้ำใช้งาน',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	prod_steam_pressure: {
		label: 'ความดันไอน้ำใช้งาน',
		unit: 'Barg',
		min: 0
	},
	prod_steam_temp: {
		label: 'อุณหภูมิไอน้ำใช้งาน',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	input_steam_temp: {
		label: 'อุณหภูมิน้ำป้อนหม้อน้ำ',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	input_steam_pressure: {
		label: 'ความดันน้ำป้อนเข้า',
		unit: 'Barg',
		min: 0
	},
	boiler_efficiency: {
		label: 'ประสิทธิภาพของหม้อน้ำ',
		unit: '%',
		min: 50,
		max: 100
	},
	fuel_type: {
		label: 'เชื้อเพลิงที่ใช้',
		unit: ''
	},
	fuel_lhv: {
		label: 'ค่า LHV',
		unit: 'kJ/kg',
		min: 0
	},
	fuel_price: {
		label: 'ค่าเชื้อเพลิง',
		unit: 'บาท/ตัน',
		min: 0
	},
	other_cost: {
		label: 'อื่นๆ 30%',
		unit: 'บาท/ตัน',
		min: 0
	},
	// PG3
	isentropic_efficiency: {
		label: 'ประสิทธิภาพไอเซนโทรปิก',
		unit: '%',
		min: 20,
		max: 100
	},
	generator_efficiency: {
		label: 'ประสิทธิภาพของเครื่องกำเนิดไฟฟ้า',
		unit: '%',
		min: 50,
		max: 100
	},
	outlet_pressure: {
		label: 'ความดันไอน้ำใช้งานขาออก',
		unit: 'Barg',
		min: 0,
		max: 1000
	},
	// PG4
	cop: {
		label: 'COP',
		unit: '',
		min: 1,
		max: 1.6,
		step: 0.05
	},
	required_steam_flow_rate: {
		label: 'อัตราไอน้ำป้อนเข้า',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	waste_enthalpy: {
		label: 'เอลทาลปีไอน้ำทิ้ง',
		unit: 'kJ/kg',
		min: 0
	},
	// PG5
	fc_boiler: {
		label: 'ค่าก่อสร้างและติดตั้ง Boiler',
		unit: 'บาท',
		min: 0
	},
	fc_steam: {
		label: 'ค่าก่อสร้างและติดตั้ง Steam Expander',
		unit: 'บาท',
		min: 0
	},
	fc_chiller: {
		label: 'ค่าติดตั้ง Absorption Chiller',
		unit: 'บาท',
		min: 0
	},
	fc_other: {
		label: 'อื่นๆ (ค่าระบบน้ำ, ตรวจวัดประสิทธิภาพ)',
		unit: 'บาท',
		min: 0
	},
	fc_user_1: {
		label: 'อื่นๆ (1)',
		unit: 'บาท',
		min: 0
	},
	fc_user_2: {
		label: 'อื่นๆ (2)',
		unit: 'บาท',
		min: 0
	},
	ac_maintenance: {
		label: 'ค่าบำรุงรักษา',
		unit: 'บาท/ปี',
		min: 0
	},
	ac_electricity: {
		label: 'ค่าไฟฟ้าสำหรับเดินระบบ Trigeneration (เฉพาะส่วนของ Boiler Turbine)',
		unit: 'บาท/ปี',
		min: 0
	},
	ac_user_1: {
		label: 'อื่นๆ (1)',
		unit: 'บาท/ปี',
		min: 0
	},
	ac_user_2: {
		label: 'อื่นๆ (2)',
		unit: 'บาท/ปี',
		min: 0
	},
	sc_user: {
		label: 'อื่นๆ',
		unit: 'บาท/ปี',
		min: 0
	}
};
