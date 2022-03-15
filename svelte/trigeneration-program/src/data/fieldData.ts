import { TrigenInputDataType } from 'types/trigenTypes'

export type FieldDataKey = keyof TrigenInputDataType

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T
}

export type FieldDataType = PartialRecord<
	FieldDataKey,
	{
		label: string
		placeholder?: string
		addonText: string
		min?: number
		max?: number
	}
>

export const FIELD_DATA: FieldDataType = {
	hr_per_day: {
		label: 'ชั่วโมงการทำงานต่อวัน',
		addonText: 'ชั่วโมง/วัน',
		min: 0,
		max: 24,
	},
	day_per_year: {
		label: 'วันทำงานต่อปี',
		addonText: 'วัน/ปี',
		min: 0,
		max: 366,
	},
	electrical_cost: {
		label: 'ค่าไฟ',
		addonText: 'บาท/ยูนิต',
		min: 0,
	},
	max_steam_volume: {
		label: 'อัตราการผลิตไอน้ำสูงสุด',
		addonText: 'ตัน/ชั่วโมง',
		min: 0,
	},
	max_steam_pressure: {
		label: 'ความดันไอน้ำที่ผลิตสูงสุด',
		addonText: 'Barg',
		min: 0,
		max: 1000,
	},
	prod_steam_volume: {
		label: 'อัตราการผลิตไอน้ำใช้งาน',
		addonText: 'ตัน/ชั่วโมง',
	},
	prod_steam_pressure: {
		label: 'ความดันไอน้ำใช้งาน',
		addonText: 'Barg',
	},
	prod_steam_temp: {
		label: 'อุณหภูมิไอน้ำใช้งาน',
		addonText: '˚C',
		min: 0,
		max: 373.95,
	},
	input_steam_temp: {
		label: 'อุณหภูมิน้ำป้อนหม้อน้ำ',
		addonText: '˚C',
		min: 0,
		max: 373.95,
	},
	input_steam_pressure: {
		label: 'ความดันน้ำป้อนเข้า',
		addonText: 'Barg',
		min: 0,
	},
	boiler_efficiency: {
		label: 'ประสิทธิภาพของหม้อน้ำ',
		addonText: '%',
		min: 50,
		max: 100,
	},
	fuel_type: {
		label: 'เชื้อเพลิงที่ใช้',
		addonText: '',
		min: 0,
		max: 0,
	},
	isentropic_efficiency: {
		label: 'ประสิทธิภาพไอเซนโทรปิก',
		addonText: '%',
		min: 20,
		max: 100,
	},
	generator_efficiency: {
		label: 'ประสิทธิภาพของเครื่องกำเนิดไฟฟ้า',
		addonText: '%',
		min: 50,
		max: 100,
	},
	outlet_pressure: {
		label: 'ความดันไอน้ำใช้งานขาออก',
		addonText: 'Barg',
		min: 0,
		max: 1000,
	},
	required_steam_flow_rate: {
		label: 'อัตราไอน้ำป้อนเข้า',
		addonText: 'ตัน/ชั่วโมง',
		min: 0,
	},
}
