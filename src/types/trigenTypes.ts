export type FuelType =
	| 'ไม้สับ'
	| 'ไม้ - ไม้สับโรงสับ'
	| 'ใบอ้อย'
	| 'ไผ่สับ'
	| 'เปลือกข้าวโพด'
	| 'ถ่านหินแอนทราไซต์'
	| 'ถ่านหิน 4500 kcal'
	| 'ถ่านหิน 5000 kcal'
	| 'ถ่านหิน 5500 kcal'
	| 'น้ำมันเตา 600 2%S'
	| 'น้ำมันเตา 1500 2%S'
	| 'อื่นๆ';

export interface TrigenInputDataType {
	// PG1
	hr_per_day: number;
	day_per_year: number;
	electrical_cost: number;

	// PG2
	max_steam_volume: number;
	max_steam_pressure: number;
	prod_steam_volume: number;
	prod_steam_pressure: number;
	prod_steam_temp: number;
	input_steam_temp: number;
	input_steam_pressure: number;
	boiler_efficiency: number;

	fuel_type: FuelType;
	fuel_lhv: number;
	fuel_price: number;

	other_cost: number;

	// PG3
	isentropic_efficiency: number;
	generator_efficiency: number;
	outlet_pressure: number;

	// PG4
	cop: number;
	required_steam_flow_rate: number;
	waste_enthalpy: number;

	// PG5
	fc_boiler: 0;
	fc_steam: 0;
	fc_chiller: 0;
	fc_other: 0;
	fc_user_1: 0;
	fc_user_2: 0;
	ac_maintenance: 0;
	ac_electricity: 0;
	ac_user_1: 0;
	ac_user_2: 0;
	sc_user: 0;
}

export interface CompareInputDataType {
	hr_per_day: number;
	day_per_year: number;
	electrical_cost: number;

	old_max_steam_volume: number;
	old_max_steam_pressure: number;
	old_prod_steam_volume: number;
	old_prod_steam_pressure: number;
	old_prod_steam_temp: number;
	old_input_steam_temp: number;
	old_input_steam_pressure: number;
	old_boiler_efficiency: number;
	old_fuel_type: FuelType;

	new_max_steam_volume: number;
	new_max_steam_pressure: number;
	new_prod_steam_volume: number;
	new_prod_steam_pressure: number;
	new_prod_steam_temp: number;
	new_input_steam_temp: number;
	new_input_steam_pressure: number;
	new_boiler_efficiency: number;
	new_fuel_type: FuelType;

	isentropic_efficiency: number;
	generator_efficiency: number;

	outlet_pressure: number;

	required_steam_flow_rate: number;
}
