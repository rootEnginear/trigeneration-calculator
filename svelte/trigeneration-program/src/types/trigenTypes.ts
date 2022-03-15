export type FuelType =
	| 'ไม้สับ'
	| 'ไม้ - ไม้สับโรงสับ'
	| 'ใบอ้อย'
	| 'ไผ่สับ'
	| 'เปลือกข้าวโพด'
	| 'Anthracite coal'
	| 'Coal 4500 kcal'
	| 'Coal 5000 kcal'
	| 'Coal 5500 kcal'
	| 'น้ำมันเตา 600 2%S'
	| 'น้ำมันเตา 1500 2%S';

export interface TrigenInputDataType {
	hr_per_day: number;
	day_per_year: number;
	electrical_cost: number;

	max_steam_volume: number;
	max_steam_pressure: number;

	prod_steam_volume: number;
	prod_steam_pressure: number;
	prod_steam_temp: number;

	input_steam_temp: number;
	input_steam_pressure: number;

	boiler_efficiency: number;

	fuel_type: FuelType;

	isentropic_efficiency: number;
	generator_efficiency: number;

	outlet_pressure: number;

	required_steam_flow_rate: number;
}
