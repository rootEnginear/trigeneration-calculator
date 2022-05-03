import { derived, writable } from 'svelte/store';
// import type { TrigenInputDataType } from 'types/trigenTypes';
import { FUEL_DATA } from 'data/fuelData';

import { T_ph, h_pT, h_ps, s_pT } from 'utils/xsteam';

// Page 1
export const hr_per_day = writable(24);
export const day_per_year = writable(330);
export const electrical_cost = writable(3.7);

// Page 2
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

export const custom_other_cost = writable(false);
export const other_cost = writable(0);

// Page 3
export const isentropic_efficiency = writable(53);
export const generator_efficiency = writable(95);
export const outlet_pressure = writable(12.5);

// Page 4
export const cop = writable(1.45);
export const required_steam_flow_rate = writable(5);
export const custom_waste_enthalpy = writable(false);
export const waste_enthalpy = writable(419.17);

export const steam_enthalpy = derived([prod_steam_pressure, prod_steam_temp], ([a, b]) => {
	return h_pT(a + 1, b);
});

export const feedwater_enthalpy = derived([prod_steam_pressure, input_steam_temp], ([a, b]) => {
	return h_pT(a + 1, b);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const update_lhv_and_price = derived(fuel_type, (a) => {
	if (a !== 'อื่นๆ') {
		fuel_lhv.set(FUEL_DATA[a].lhv);
		fuel_price.set(FUEL_DATA[a].price);
	}
	return a;
});
update_lhv_and_price.subscribe(() => 0);

export const fuel_usage_rate = derived(
	[fuel_lhv, prod_steam_volume, boiler_efficiency, steam_enthalpy, feedwater_enthalpy],
	([$fuel_lhv, $prod_steam_volume, $boiler_efficiency, $steam_enthalpy, $feedwater_enthalpy]) => {
		return (
			($prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			(($fuel_lhv * $boiler_efficiency) / 100)
		);
	}
);

export const fuel_cost = derived(
	[fuel_price, prod_steam_volume, fuel_usage_rate],
	([$fuel_price, $prod_steam_volume, $fuel_usage_rate]) => {
		return Math.ceil(($fuel_usage_rate * $fuel_price) / $prod_steam_volume);
	}
);

const update_fuel_cost = derived([custom_other_cost, fuel_cost], ([a, b]) => {
	other_cost.set(Math.ceil(b * 0.3));
	return [a, b];
});
update_fuel_cost.subscribe(() => 0);

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

const update_waste_enthalpy = derived(custom_waste_enthalpy, (a) => {
	waste_enthalpy.set(419.17);
	return a;
});
update_waste_enthalpy.subscribe(() => 0);

export const kw_cooling = derived(
	[cop, required_steam_flow_rate, turbine_outlet_enthalpy, waste_enthalpy],
	([$cop, $required_steam_flow_rate, $turbine_outlet_enthalpy, $waste_enthalpy]) => {
		return (
			$cop *
			$required_steam_flow_rate *
			1000 *
			(($turbine_outlet_enthalpy - $waste_enthalpy) / 3600)
		);
	}
);

export const rt_cooling = derived(kw_cooling, ($kw_cooling) => {
	return $kw_cooling / 3.517;
});

export const custom_fc_boiler = writable(false);
export const fc_boiler = writable(4000000);
const update_fc_boiler = derived([custom_fc_boiler, max_steam_volume], ([a, b]) => {
	fc_boiler.set(Math.ceil(b * 2000000));
	return [a, b];
});
update_fc_boiler.subscribe(() => 0);

export const custom_fc_steam = writable(false);
export const fc_steam = writable(19395160);
const update_fc_steam = derived([custom_fc_steam, prod_energy], ([a, b]) => {
	fc_steam.set(Math.ceil(b * 80000));
	return [a, b];
});
update_fc_steam.subscribe(() => 0);

export const custom_fc_chiller = writable(false);
export const fc_chiller = writable(26819294);
const update_fc_chiller = derived([custom_fc_chiller, rt_cooling], ([a, b]) => {
	fc_chiller.set(Math.ceil(b * 20000));
	return [a, b];
});
update_fc_chiller.subscribe(() => 0);

export const custom_fc_other = writable(false);
export const fc_other = writable(8621446);
const update_fc_other = derived(
	[custom_fc_other, fc_boiler, fc_steam, fc_chiller],
	([a, b, c, d]) => {
		fc_other.set(Math.ceil(0.1 * [b, c, d].reduce((aa, ab) => aa + ab, 0)));
		return [a, b, c, d];
	}
);
update_fc_other.subscribe(() => 0);

export const fc_user_1 = writable(0);
export const fc_user_2 = writable(0);

export const fc_total = derived(
	[fc_boiler, fc_steam, fc_chiller, fc_other, fc_user_1, fc_user_2],
	([$fc_boiler, $fc_steam, $fc_chiller, $fc_other, $fc_user_1, $fc_user_2]) => {
		return [$fc_boiler, $fc_steam, $fc_chiller, $fc_other, $fc_user_1, $fc_user_2].reduce(
			(a, c) => a + c,
			0
		);
	}
);

export const custom_ac_electricity = writable(false);
export const ac_electricity = writable(4160103);
const update_ac_electricity = derived(
	[custom_ac_electricity, prod_steam_volume, hr_per_day, day_per_year, electrical_cost],
	([a, $prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost]) => {
		ac_electricity.set(
			Math.ceil($prod_steam_volume * 8 * $hr_per_day * $day_per_year * $electrical_cost)
		);
		return [a, $prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost];
	}
);
update_ac_electricity.subscribe(() => 0);

export const custom_ac_maintenance = writable(false);
export const ac_maintenance = writable(41601024);
const update_ac_maintenance = derived(
	[custom_ac_maintenance, ac_electricity],
	([a, $ac_electricity]) => {
		ac_maintenance.set(Math.ceil(0.1 * $ac_electricity));
		return [a, $ac_electricity];
	}
);
update_ac_maintenance.subscribe(() => 0);

export const ac_user_1 = writable(0);
export const ac_user_2 = writable(0);

export const ac_total = derived(
	[ac_maintenance, ac_electricity, ac_user_1, ac_user_2],
	([$ac_maintenance, $ac_electricity, $ac_user_1, $ac_user_2]) => {
		return [$ac_maintenance, $ac_electricity, $ac_user_1, $ac_user_2].reduce((a, c) => a + c, 0);
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
export const sc_user = writable(0);
export const sc_total = derived(
	[sc_steam, sc_chiller, sc_user],
	([$sc_steam, $sc_chiller, $sc_user]) => {
		return [$sc_steam, $sc_chiller, $sc_user].reduce((a, c) => a + c, 0);
	}
);

export const econ_n = derived(
	[fc_total, ac_total, sc_total],
	([$fc_total, $ac_total, $sc_total]) => {
		return $fc_total / ($sc_total - $ac_total);
	}
);

export const econ_steam_cost_per_year = derived(
	[prod_steam_volume, hr_per_day, day_per_year, total_cost],
	([$prod_steam_volume, $hr_per_day, $day_per_year, $total_cost]) => {
		return [$prod_steam_volume, $hr_per_day, $day_per_year, $total_cost].reduce((a, c) => a * c);
	}
);
