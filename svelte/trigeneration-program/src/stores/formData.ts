import { derived, writable } from 'svelte/store';
import type { TrigenInputDataType } from 'types/trigenTypes';
import { FUEL_DATA } from 'data/fuelData';

import { T_ph, h_pT, h_ps, s_pT } from 'utils/xsteam';

export const formData = writable<TrigenInputDataType>({
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
	required_steam_flow_rate: 5
});

export const steam_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.prod_steam_pressure + 1, $formData.prod_steam_temp);
});

export const feedwater_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.prod_steam_pressure + 1, $formData.input_steam_temp);
});

export const fuel_usage_rate = derived(
	[formData, steam_enthalpy, feedwater_enthalpy],
	([$formData, $steam_enthalpy, $feedwater_enthalpy]) => {
		return (
			($formData.prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((FUEL_DATA[$formData.fuel_type].lhv * $formData.boiler_efficiency) / 100)
		);
	}
);

export const fuel_cost = derived([formData, fuel_usage_rate], ([$formData, $fuel_usage_rate]) => {
	return Math.ceil(
		($fuel_usage_rate * FUEL_DATA[$formData.fuel_type].price) / $formData.prod_steam_volume
	);
});

export const other_cost = derived(fuel_cost, ($fuel_cost) => {
	return Math.ceil($fuel_cost * 0.3);
});

export const total_cost = derived([fuel_cost, other_cost], ([$fuel_cost, $other_cost]) => {
	return $fuel_cost + $other_cost;
});