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
	fuel_lhv: 8000,
	fuel_cost: 1000,
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
		const lhv = FUEL_DATA[$formData.fuel_type]
			? FUEL_DATA[$formData.fuel_type].lhv
			: $formData.fuel_lhv;
		return (
			($formData.prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((lhv * $formData.boiler_efficiency) / 100)
		);
	}
);

export const fuel_cost = derived([formData, fuel_usage_rate], ([$formData, $fuel_usage_rate]) => {
	const price = FUEL_DATA[$formData.fuel_type]
		? FUEL_DATA[$formData.fuel_type].price
		: $formData.fuel_cost;
	return Math.ceil(($fuel_usage_rate * price) / $formData.prod_steam_volume);
});

export const other_cost = derived(fuel_cost, ($fuel_cost) => {
	return Math.ceil($fuel_cost * 0.3);
});

export const total_cost = derived([fuel_cost, other_cost], ([$fuel_cost, $other_cost]) => {
	return $fuel_cost + $other_cost;
});

export const turbine_outlet_enthalpy = derived(
	[formData, steam_enthalpy],
	([$formData, $steam_enthalpy]) => {
		const a = s_pT($formData.prod_steam_pressure + 1, $formData.prod_steam_temp);
		const b = h_ps($formData.outlet_pressure + 1, a);
		return $steam_enthalpy - ($steam_enthalpy - b) * ($formData.isentropic_efficiency / 100);
	}
);

export const turbine_outlet_temp = derived(
	[formData, turbine_outlet_enthalpy],
	([$formData, $turbine_outlet_enthalpy]) => {
		return T_ph($formData.outlet_pressure + 1, $turbine_outlet_enthalpy);
	}
);

export const output_energy = derived(
	[formData, steam_enthalpy, turbine_outlet_enthalpy],
	([$formData, $steam_enthalpy, $turbine_outlet_enthalpy]) => {
		return (
			$formData.prod_steam_volume * 1000 * (1 / 3600) * ($steam_enthalpy - $turbine_outlet_enthalpy)
		);
	}
);

export const prod_energy = derived([output_energy, formData], ([$output_energy, $formData]) => {
	return $output_energy * ($formData.generator_efficiency / 100);
});

export const kw_cooling = derived(
	[formData, turbine_outlet_enthalpy],
	([$formData, $turbine_outlet_enthalpy]) => {
		return (
			1.45 *
			$formData.required_steam_flow_rate *
			1000 *
			(($turbine_outlet_enthalpy - 419.17) / 3600)
		);
	}
);

export const rt_cooling = derived(kw_cooling, ($kw_cooling) => {
	return $kw_cooling / 3.517;
});

export const fc_boiler = derived(formData, ($formData) =>
	Math.ceil($formData.max_steam_volume * 2000000)
);
export const fc_steam = derived(prod_energy, ($prod_energy) => Math.ceil($prod_energy * 80000));
export const fc_chiller = derived(rt_cooling, ($rt_cooling) => Math.ceil($rt_cooling * 20000));
export const fc_other = derived(
	[fc_boiler, fc_steam, fc_chiller],
	([$fc_boiler, $fc_steam, $fc_chiller]) =>
		Math.ceil(0.1 * [$fc_boiler, $fc_steam, $fc_chiller].reduce((a, b) => a + b, 0))
);
export const fc_total = derived(
	[fc_boiler, fc_steam, fc_chiller, fc_other],
	([$fc_boiler, $fc_steam, $fc_chiller, $fc_other]) => {
		return [$fc_boiler, $fc_steam, $fc_chiller, $fc_other].reduce((a, c) => a + c, 0);
	}
);

export const ac_electricity = derived(formData, ($formData) =>
	Math.ceil(
		$formData.prod_steam_volume *
			8 *
			$formData.hr_per_day *
			$formData.day_per_year *
			$formData.electrical_cost
	)
);
export const ac_maintenance = derived(ac_electricity, ($ac_electricity) =>
	Math.ceil(0.1 * $ac_electricity)
);
export const ac_total = derived(
	[ac_maintenance, ac_electricity],
	([$ac_maintenance, $ac_electricity]) => {
		return [$ac_maintenance, $ac_electricity].reduce((a, c) => a + c, 0);
	}
);

export const sc_steam = derived([prod_energy, formData], ([$prod_energy, $formData]) => {
	return Math.ceil(
		$prod_energy * $formData.hr_per_day * $formData.day_per_year * $formData.electrical_cost
	);
});
export const sc_chiller = derived([rt_cooling, formData], ([$rt_cooling, $formData]) => {
	return Math.ceil(
		(0.75 - 0.114) *
			$rt_cooling *
			$formData.hr_per_day *
			$formData.day_per_year *
			$formData.electrical_cost
	);
});
export const sc_total = derived([sc_steam, sc_chiller], ([$sc_steam, $sc_chiller]) => {
	return [$sc_steam, $sc_chiller].reduce((a, c) => a + c, 0);
});

export const econ_n = derived(
	[fc_total, ac_total, sc_total],
	([$fc_total, $ac_total, $sc_total]) => {
		return $fc_total / ($sc_total - $ac_total);
	}
);
