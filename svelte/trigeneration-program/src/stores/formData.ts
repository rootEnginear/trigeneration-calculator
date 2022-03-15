import { writable } from 'svelte/store';

export const formData = writable({
	hr_per_day: 24,
	day_per_year: 330,
	electrical_cost: 3.7,
	max_steam_volume: 20,
	max_steam_pressure: 25,
	prod_steam_volume: 16,
	prod_steam_pressure: 22.5,
	prod_steam_temp: 226,
	input_steam_temp: 107,
	input_steam_pressure: 0.3,
	boiler_efficiency: 90.74,
	fuel_type: 'ไม้สับ',
	isentropic_efficiency: 53,
	generator_efficiency: 95,
	outlet_pressure: 12.5,
	required_steam_flow_rate: 5,

	steam_enthalpy: 0,
	feedwater_enthalpy: 0,
	fuel_usage_rate: 0,
	fuel_cost: 0,
	other_cost: 0,
	total_cost: 0
});
