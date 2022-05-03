import { derived, writable } from 'svelte/store';
// import type { TrigenInputDataType } from 'types/trigenTypes';
import { FUEL_DATA } from 'data/fuelData';

import { T_ph, h_pT, h_ps, s_pT } from 'utils/xsteam';

export const hr_per_day = writable(24);
export const day_per_year = writable(330);
export const electrical_cost = writable(3.7);
export const max_steam_volume = writable(20);
export const max_steam_pressure = writable(25);
export const prod_steam_volume = writable(16);
export const prod_steam_pressure = writable(22.5);
export const prod_steam_temp = writable(226);
export const input_steam_temp = writable(107);
export const input_steam_pressure = writable(0.3);
export const boiler_efficiency = writable(90.74);
export const fuel_type = writable('ไม้สับ');
export const fuel_lhv = writable(8000);
export const fuel_price = writable(1000);
export const isentropic_efficiency = writable(53);
export const generator_efficiency = writable(95);
export const outlet_pressure = writable(12.5);
export const required_steam_flow_rate = writable(5);
export const user_custom_other_cost = writable(false);
export const custom_other_cost = writable(100);

export const steam_enthalpy = derived([prod_steam_pressure, prod_steam_temp], ([a, b]) => {
	return h_pT(a + 1, b);
});

export const feedwater_enthalpy = derived([prod_steam_pressure, input_steam_temp], ([a, b]) => {
	return h_pT(a + 1, b);
});

export const fuel_usage_rate = derived(
	[fuel_type, fuel_lhv, prod_steam_volume, boiler_efficiency, steam_enthalpy, feedwater_enthalpy],
	([
		$fuel_type,
		$fuel_lhv,
		$prod_steam_volume,
		$boiler_efficiency,
		$steam_enthalpy,
		$feedwater_enthalpy
	]) => {
		const lhv = FUEL_DATA[$fuel_type] ? FUEL_DATA[$fuel_type].lhv : $fuel_lhv;
		return (
			($prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((lhv * $boiler_efficiency) / 100)
		);
	}
);

export const fuel_cost = derived(
	[fuel_type, fuel_price, prod_steam_volume, fuel_usage_rate],
	([$fuel_type, $fuel_price, $prod_steam_volume, $fuel_usage_rate]) => {
		const price = FUEL_DATA[$fuel_type] ? FUEL_DATA[$fuel_type].price : $fuel_price;
		return Math.ceil(($fuel_usage_rate * price) / $prod_steam_volume);
	}
);

export const other_cost = derived(
	[user_custom_other_cost, custom_other_cost, fuel_cost],
	([$user_custom_other_cost, $custom_other_cost, $fuel_cost]) => {
		if ($user_custom_other_cost) return $custom_other_cost;
		return Math.ceil($fuel_cost * 0.3);
	}
);

export const total_cost = derived([fuel_cost, other_cost], ([$fuel_cost, $other_cost]) => {
	return $fuel_cost + $other_cost;
});

export const turbine_outlet_enthalpy = derived(
	[prod_steam_pressure, prod_steam_temp, outlet_pressure, isentropic_efficiency, steam_enthalpy],
	([
		$prod_steam_pressure,
		$prod_steam_temp,
		$outlet_pressure,
		$isentropic_efficiency,
		$steam_enthalpy
	]) => {
		const a = s_pT($prod_steam_pressure + 1, $prod_steam_temp);
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
	[prod_steam_volume, steam_enthalpy, turbine_outlet_enthalpy],
	([$prod_steam_volume, $steam_enthalpy, $turbine_outlet_enthalpy]) => {
		return $prod_steam_volume * 1000 * (1 / 3600) * ($steam_enthalpy - $turbine_outlet_enthalpy);
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

export const fc_boiler = derived(max_steam_volume, ($max_steam_volume) =>
	Math.ceil($max_steam_volume * 2000000)
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
	[prod_steam_volume, hr_per_day, day_per_year, electrical_cost],
	([$prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost]) =>
		Math.ceil($prod_steam_volume * 8 * $hr_per_day * $day_per_year * $electrical_cost)
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
export const sc_total = derived([sc_steam, sc_chiller], ([$sc_steam, $sc_chiller]) => {
	return [$sc_steam, $sc_chiller].reduce((a, c) => a + c, 0);
});

export const econ_n = derived(
	[fc_total, ac_total, sc_total],
	([$fc_total, $ac_total, $sc_total]) => {
		return $fc_total / ($sc_total - $ac_total);
	}
);
