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
	}
>;

export const FIELD_DATA: TrigenFieldDataType = {
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
		min: 0
	},
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
		unit: '',
		min: 0,
		max: 0
	},
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
	required_steam_flow_rate: {
		label: 'อัตราไอน้ำป้อนเข้า',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	}
};
