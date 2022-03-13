import { TrigenInputDataType } from 'types/trigenTypes'

export type FieldDataKey = Exclude<keyof TrigenInputDataType, 'fuel_type'>

export type FieldDataType = Record<
	FieldDataKey,
	{
		label: string
		placeholder?: string
		addonText: string
		min: number
		max: number
	}
>

export const FIELD_DATA: FieldDataType = {
	hr_per_day: {
		label: 'ชั่วโมงการทำงานต่อวัน',
		addonText: 'ชั่วโมง/วัน',
		min: 0,
		max: 0,
	},
	day_per_year: {
		label: 'วันทำงานต่อปี',
		addonText: 'วัน/ปี',
		min: 0,
		max: 0,
	},
	electrical_cost: {
		label: 'ค่าไฟ',
		addonText: 'บาท/ยูนิต',
		min: 0,
		max: 0,
	},
	max_steam_volume: {
		label: 'อัตราการผลิตไอน้ำสูงสุด',
		addonText: 'ตัน/ชั่วโมง',
		min: 0,
		max: 0,
	},
	max_steam_pressure: {
		label: 'ความดันไอน้ำที่ผลิตสูงสุด',
		addonText: 'Barg',
		min: 0,
		max: 0,
	},
	prod_steam_volume: {
		label: 'อัตราการผลิตไอน้ำใช้งาน',
		addonText: 'ตัน/ชั่วโมง',
		min: 0,
		max: 0,
	},
	prod_steam_pressure: {
		label: 'ความดันไอน้ำใช้งาน',
		addonText: 'Barg',
		min: 0,
		max: 0,
	},
	prod_steam_temp: {
		label: 'อุณหภูมิไอน้ำใช้งาน',
		addonText: '˚C',
		min: 0,
		max: 0,
	},
	input_steam_temp: {
		label: 'อุณหภูมิน้ำป้อนหม้อน้ำ',
		addonText: '˚C',
		min: 0,
		max: 0,
	},
	input_steam_pressure: {
		label: 'ความดันน้ำป้อนเข้า',
		addonText: 'Barg',
		min: 0,
		max: 0,
	},
	boiler_efficiency: {
		label: 'ประสิทธิภาพของหม้อน้ำ',
		addonText: '%',
		min: 0,
		max: 0,
	},
	isentropic_efficiency: {
		label: '',
		addonText: '',
		min: 0,
		max: 0,
	},
	generator_efficiency: {
		label: '',
		addonText: '',
		min: 0,
		max: 0,
	},
	outlet_pressure: {
		label: '',
		addonText: '',
		min: 0,
		max: 0,
	},
	required_steam_flow_rate: {
		label: '',
		addonText: '',
		min: 0,
		max: 0,
	},
}
