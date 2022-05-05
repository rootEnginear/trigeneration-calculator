import type { CompareInputDataType } from 'types/trigenTypes';

export type CompareFieldDataKey = keyof CompareInputDataType;

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

export type CompareFieldDataType = PartialRecord<
	CompareFieldDataKey,
	{
		label: string;
		placeholder?: string;
		unit: string;
		min?: number;
		max?: number;
	}
>;

export const FIELD_DATA: CompareFieldDataType = {
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
	// OLD
	old_max_steam_volume: {
		label: 'อัตราการผลิตไอน้ำสูงสุด',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	old_max_steam_pressure: {
		label: 'ความดันไอน้ำที่ผลิตสูงสุด',
		unit: 'Barg',
		min: 0,
		max: 1000
	},
	old_prod_steam_volume: {
		label: 'อัตราการผลิตไอน้ำใช้งาน',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	old_prod_steam_pressure: {
		label: 'ความดันไอน้ำใช้งาน',
		unit: 'Barg',
		min: 0
	},
	old_prod_steam_temp: {
		label: 'อุณหภูมิไอน้ำใช้งาน',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	old_input_steam_temp: {
		label: 'อุณหภูมิน้ำป้อนหม้อน้ำ',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	old_input_steam_pressure: {
		label: 'ความดันน้ำป้อนเข้า',
		unit: 'Barg',
		min: 0
	},
	old_boiler_efficiency: {
		label: 'ประสิทธิภาพของหม้อน้ำ',
		unit: '%',
		min: 50,
		max: 100
	},
	old_fuel_type: {
		label: 'เชื้อเพลิงที่ใช้',
		unit: '',
		min: 0,
		max: 0
	},
	// NEW
	new_max_steam_volume: {
		label: 'อัตราการผลิตไอน้ำสูงสุด',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	new_max_steam_pressure: {
		label: 'ความดันไอน้ำที่ผลิตสูงสุด',
		unit: 'Barg',
		min: 0,
		max: 1000
	},
	new_prod_steam_volume: {
		label: 'อัตราการผลิตไอน้ำใช้งาน',
		unit: 'ตัน/ชั่วโมง',
		min: 0
	},
	new_prod_steam_pressure: {
		label: 'ความดันไอน้ำใช้งาน',
		unit: 'Barg',
		min: 0
	},
	new_prod_steam_temp: {
		label: 'อุณหภูมิไอน้ำใช้งาน',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	new_input_steam_temp: {
		label: 'อุณหภูมิน้ำป้อนหม้อน้ำ',
		unit: '˚C',
		min: 0,
		max: 373.95
	},
	new_input_steam_pressure: {
		label: 'ความดันน้ำป้อนเข้า',
		unit: 'Barg',
		min: 0
	},
	new_boiler_efficiency: {
		label: 'ประสิทธิภาพของหม้อน้ำ',
		unit: '%',
		min: 50,
		max: 100
	},
	new_fuel_type: {
		label: 'เชื้อเพลิงที่ใช้',
		unit: '',
		min: 0,
		max: 0
	},
	// TURBINE
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
	},
	old_fuel_lhv: {
		label: '',
		unit: '',
		min: 0
	},
	old_fuel_price: {
		label: '',
		unit: '',
		min: 0
	},
	new_fuel_lhv: {
		label: '',
		unit: '',
		min: 0
	},
	new_fuel_price: {
		label: '',
		unit: '',
		min: 0
	},
	old_other_cost: {
		label: '',
		unit: '',
		min: 0
	},
	new_other_cost: {
		label: '',
		unit: '',
		min: 0
	},
	cop: {
		label: '',
		unit: '',
		min: 0
	},
	waste_enthalpy: {
		label: '',
		unit: '',
		min: 0
	},
	fc_user_1: {
		label: '',
		unit: '',
		min: 0
	},
	fc_user_2: {
		label: '',
		unit: '',
		min: 0
	},
	ac_user_1: {
		label: '',
		unit: '',
		min: 0
	},
	ac_user_2: {
		label: '',
		unit: '',
		min: 0
	},
	sc_user_1: {
		label: '',
		unit: '',
		min: 0
	},
	sc_user_2: {
		label: '',
		unit: '',
		min: 0
	},
	fc_boiler: {
		label: '',
		unit: '',
		min: 0
	},
	fc_steam: {
		label: '',
		unit: '',
		min: 0
	},
	fc_chiller: {
		label: '',
		unit: '',
		min: 0
	},
	fc_other: {
		label: '',
		unit: '',
		min: 0
	},
	ac_maintenance: {
		label: '',
		unit: '',
		min: 0
	},
	ac_electricity: {
		label: '',
		unit: '',
		min: 0
	},
	fc_repair: {
		label: '',
		unit: '',
		min: 0
	}
};
