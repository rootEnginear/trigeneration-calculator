import type { FuelType } from 'types/trigenTypes';

type FuelDataType = Record<
	FuelType,
	{
		lhv: number;
		price: number /* baht/ton */;
	}
>;

export const FUEL_DATA: FuelDataType = {
	ไม้สับ: {
		lhv: 8760.0,
		price: 1180.0
	},
	'ไม้ - ไม้สับโรงสับ': {
		lhv: 8943.0,
		price: 800.0
	},
	ใบอ้อย: {
		lhv: 15646.0,
		price: 1110.0
	},
	ไผ่สับ: {
		lhv: 10316.0,
		price: 1050.0
	},
	เปลือกข้าวโพด: {
		lhv: 8860.0,
		price: 830.0
	},
	ถ่านหินแอนทราไซต์: {
		lhv: 30080.0,
		price: 5693.0
	},
	'ถ่านหิน 4500 kcal': {
		lhv: 18840.6,
		price: 4037.0
	},
	'ถ่านหิน 5000 kcal': {
		lhv: 20934.0,
		price: 4704.0
	},
	'ถ่านหิน 5500 kcal': {
		lhv: 23027.4,
		price: 5175.0
	},
	'น้ำมันเตา 600 2%S': {
		lhv: 39248.0,
		price: 25788.06
	},
	'น้ำมันเตา 1500 2%S': {
		lhv: 39106.0,
		price: 24351.44
	}
};
