import { FuelType } from 'types/trigenTypes'

interface fuelPriceDataType {
	fuel_type: FuelType
	lhv: number
	price: number /* baht/ton */
}

export const FUEL_PRICE_DATA: fuelPriceDataType[] = [
	{
		fuel_type: 'ไม้สับ',
		lhv: 8760.0,
		price: 1180.0,
	},
	{
		fuel_type: 'ไม้ - ไม้สับโรงสับ',
		lhv: 8943.0,
		price: 800.0,
	},
	{
		fuel_type: 'ใบอ้อย',
		lhv: 15646.0,
		price: 1110.0,
	},
	{
		fuel_type: 'ไผ่สับ',
		lhv: 10316.0,
		price: 1050.0,
	},
	{
		fuel_type: 'เปลือกข้าวโพด',
		lhv: 8860.0,
		price: 830.0,
	},
	{
		fuel_type: 'Anthracite coal',
		lhv: 30080.0,
		price: 5693.0,
	},
	{
		fuel_type: 'Coal 4500 kcal',
		lhv: 18840.6,
		price: 4037.0,
	},
	{
		fuel_type: 'Coal 5000 kcal',
		lhv: 20934.0,
		price: 4704.0,
	},
	{
		fuel_type: 'Coal 5500 kcal',
		lhv: 23027.4,
		price: 5175.0,
	},
	{
		fuel_type: 'น้ำมันเตา 600 2%S',
		lhv: 39248.0,
		price: 25788.06,
	},
	{
		fuel_type: 'น้ำมันเตา 1500 2%S',
		lhv: 39106.0,
		price: 24351.44,
	},
]
