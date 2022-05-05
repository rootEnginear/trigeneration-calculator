import { derived, writable } from 'svelte/store';
// import type { CompareInputDataType } from 'types/trigenTypes';
import { FUEL_DATA } from 'data/fuelData';

import { T_ph, h_pT, h_ps, s_pT } from 'utils/xsteam';

export const hr_per_day = writable(24);
export const day_per_year = writable(330);
export const electrical_cost = writable(3.7);
export const old_max_steam_volume = writable(20);
export const old_max_steam_pressure = writable(25);
export const old_prod_steam_volume = writable(11);
export const old_prod_steam_pressure = writable(22.5);
export const old_prod_steam_temp = writable(226);
export const old_input_steam_temp = writable(107);
export const old_input_steam_pressure = writable(0.3);
export const old_boiler_efficiency = writable(80.5);
export const old_fuel_type = writable('ไม้สับ');
export const new_max_steam_volume = writable(20);
export const new_max_steam_pressure = writable(25);
export const new_prod_steam_volume = writable(16);
export const new_prod_steam_pressure = writable(22.5);
export const new_prod_steam_temp = writable(226);
export const new_input_steam_temp = writable(107);
export const new_input_steam_pressure = writable(0.3);
export const new_boiler_efficiency = writable(90.74);
export const new_fuel_type = writable('ไม้สับ');
export const isentropic_efficiency = writable(53);
export const generator_efficiency = writable(95);
export const outlet_pressure = writable(12.5);
export const required_steam_flow_rate = writable(5);

export const old_steam_enthalpy = derived(
	[old_prod_steam_pressure, old_prod_steam_temp],
	([$old_prod_steam_pressure, $old_prod_steam_temp]) => {
		return h_pT($old_prod_steam_pressure + 1, $old_prod_steam_temp);
	}
);

export const old_feedwater_enthalpy = derived(
	[old_prod_steam_pressure, old_input_steam_temp],
	([$old_prod_steam_pressure, $old_input_steam_temp]) => {
		return h_pT($old_prod_steam_pressure + 1, $old_input_steam_temp);
	}
);

export const old_fuel_usage_rate = derived(
	[
		old_prod_steam_volume,
		old_fuel_type,
		old_boiler_efficiency,
		old_steam_enthalpy,
		old_feedwater_enthalpy
	],
	([
		$old_prod_steam_volume,
		$old_fuel_type,
		$old_boiler_efficiency,
		$steam_enthalpy,
		$feedwater_enthalpy
	]) => {
		return (
			($old_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((FUEL_DATA[$old_fuel_type].lhv * $old_boiler_efficiency) / 100)
		);
	}
);

export const old_fuel_cost = derived(
	[old_fuel_type, old_prod_steam_volume, old_fuel_usage_rate],
	([$old_fuel_type, $old_prod_steam_volume, $fuel_usage_rate]) => {
		return Math.ceil(($fuel_usage_rate * FUEL_DATA[$old_fuel_type].price) / $old_prod_steam_volume);
	}
);

export const old_other_cost = derived(old_fuel_cost, ($fuel_cost) => {
	return Math.ceil($fuel_cost * 0.3);
});

export const old_total_cost = derived(
	[old_fuel_cost, old_other_cost],
	([$fuel_cost, $other_cost]) => {
		return $fuel_cost + $other_cost;
	}
);

export const new_steam_enthalpy = derived(
	[new_prod_steam_pressure, new_prod_steam_temp],
	([$new_prod_steam_pressure, $new_prod_steam_temp]) => {
		return h_pT($new_prod_steam_pressure + 1, $new_prod_steam_temp);
	}
);

export const new_feedwater_enthalpy = derived(
	[new_prod_steam_pressure, new_input_steam_temp],
	([$new_prod_steam_pressure, $new_input_steam_temp]) => {
		return h_pT($new_prod_steam_pressure + 1, $new_input_steam_temp);
	}
);

export const new_fuel_usage_rate = derived(
	[
		new_prod_steam_volume,
		new_fuel_type,
		new_boiler_efficiency,
		new_steam_enthalpy,
		new_feedwater_enthalpy
	],
	([
		$new_prod_steam_volume,
		$new_fuel_type,
		$new_boiler_efficiency,
		$steam_enthalpy,
		$feedwater_enthalpy
	]) => {
		return (
			($new_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((FUEL_DATA[$new_fuel_type].lhv * $new_boiler_efficiency) / 100)
		);
	}
);

export const new_fuel_cost = derived(
	[new_fuel_type, new_prod_steam_volume, new_fuel_usage_rate],
	([$new_fuel_type, $new_prod_steam_volume, $fuel_usage_rate]) => {
		return Math.ceil(($fuel_usage_rate * FUEL_DATA[$new_fuel_type].price) / $new_prod_steam_volume);
	}
);

export const new_other_cost = derived(new_fuel_cost, ($fuel_cost) => {
	return Math.ceil($fuel_cost * 0.3);
});

export const new_total_cost = derived(
	[new_fuel_cost, new_other_cost],
	([$fuel_cost, $other_cost]) => {
		return $fuel_cost + $other_cost;
	}
);

const prod_steam_diff = derived(
	[new_prod_steam_volume, old_prod_steam_volume],
	([$new_prod_steam_volume, $old_prod_steam_volume]) => {
		return $new_prod_steam_volume - $old_prod_steam_volume;
	}
);

export const turbine_outlet_enthalpy = derived(
	[
		old_prod_steam_pressure,
		old_prod_steam_temp,
		outlet_pressure,
		isentropic_efficiency,
		new_steam_enthalpy
	],
	([
		$old_prod_steam_pressure,
		$old_prod_steam_temp,
		$outlet_pressure,
		$isentropic_efficiency,
		$steam_enthalpy
	]) => {
		const a = s_pT($old_prod_steam_pressure + 1, $old_prod_steam_temp);
		const b = h_ps($outlet_pressure + 1, a);
		return $steam_enthalpy - ($steam_enthalpy - b) * ($isentropic_efficiency / 100);
	}
);

export const turbine_outlet_temp = derived(
	[outlet_pressure, turbine_outlet_enthalpy],
	([$outlet_pressure, $turbine_outlet_enthalpy]) => {
		return T_ph($outlet_pressure + 1, $turbine_outlet_enthalpy);
	}
);

export const output_energy = derived(
	[new_prod_steam_volume, new_steam_enthalpy, turbine_outlet_enthalpy],
	([$new_prod_steam_volume, $steam_enthalpy, $turbine_outlet_enthalpy]) => {
		return (
			$new_prod_steam_volume * 1000 * (1 / 3600) * ($steam_enthalpy - $turbine_outlet_enthalpy)
		);
	}
);

export const prod_energy = derived(
	[output_energy, generator_efficiency],
	([$output_energy, $generator_efficiency]) => {
		return $output_energy * ($generator_efficiency / 100);
	}
);

export const kw_cooling = derived(
	[required_steam_flow_rate, turbine_outlet_enthalpy],
	([$required_steam_flow_rate, $turbine_outlet_enthalpy]) => {
		return 1.45 * $required_steam_flow_rate * 1000 * (($turbine_outlet_enthalpy - 419.17) / 3600);
	}
);

export const rt_cooling = derived(kw_cooling, ($kw_cooling) => {
	return $kw_cooling / 3.517;
});

export const fc_boiler = derived(new_max_steam_volume, ($new_max_steam_volume) =>
	Math.ceil($new_max_steam_volume * 2000000)
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

export const ac_electricity = derived(
	[new_prod_steam_volume, hr_per_day, day_per_year, electrical_cost],
	([$new_prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost]) =>
		Math.ceil($new_prod_steam_volume * 8 * $hr_per_day * $day_per_year * $electrical_cost)
);
export const ac_additional = derived(
	[new_total_cost, prod_steam_diff, hr_per_day, day_per_year],
	([$new_total_cost, $prod_steam_diff, $hr_per_day, $day_per_year]) => {
		return $new_total_cost * $hr_per_day * $day_per_year * $prod_steam_diff;
	}
);
export const ac_maintenance = derived(ac_electricity, ($ac_electricity) =>
	Math.ceil(0.1 * $ac_electricity)
);
export const ac_total = derived(
	[ac_maintenance, ac_electricity, ac_additional],
	([$ac_maintenance, $ac_electricity, $ac_additional]) => {
		return [$ac_maintenance, $ac_electricity, $ac_additional].reduce((a, c) => a + c, 0);
	}
);

export const sc_steam = derived(
	[prod_energy, hr_per_day, day_per_year, electrical_cost],
	([$prod_energy, $hr_per_day, $day_per_year, $electrical_cost]) => {
		return Math.ceil($prod_energy * $hr_per_day * $day_per_year * $electrical_cost);
	}
);
export const sc_chiller = derived(
	[rt_cooling, hr_per_day, day_per_year, electrical_cost],
	([$rt_cooling, $hr_per_day, $day_per_year, $electrical_cost]) => {
		return Math.ceil((0.75 - 0.114) * $rt_cooling * $hr_per_day * $day_per_year * $electrical_cost);
	}
);
export const sc_fuel = derived(
	[old_prod_steam_volume, hr_per_day, day_per_year, old_total_cost, new_total_cost],
	([$old_prod_steam_volume, $hr_per_day, $day_per_year, $old_total_cost, $new_total_cost]) => {
		return (
			$old_prod_steam_volume * ($old_total_cost - $new_total_cost) * $hr_per_day * $day_per_year
		);
	}
);
export const sc_total = derived(
	[sc_steam, sc_chiller, sc_fuel],
	([$sc_steam, $sc_chiller, $sc_fuel]) => {
		return [$sc_steam, $sc_chiller, $sc_fuel].reduce((a, c) => a + c, 0);
	}
);

export const econ_n = derived(
	[fc_total, ac_total, sc_total],
	([$fc_total, $ac_total, $sc_total]) => {
		return $fc_total / ($sc_total - $ac_total);
	}
);
