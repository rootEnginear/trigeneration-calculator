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
export const old_fuel_lhv = writable(8000);
export const old_fuel_price = writable(1000);
export const new_max_steam_volume = writable(20);
export const new_max_steam_pressure = writable(25);
export const new_prod_steam_volume = writable(16);
export const new_prod_steam_pressure = writable(22.5);
export const new_prod_steam_temp = writable(226);
export const new_input_steam_temp = writable(107);
export const new_input_steam_pressure = writable(0.3);
export const new_boiler_efficiency = writable(90.74);
export const new_fuel_type = writable('ไม้สับ');
export const new_fuel_lhv = writable(8000);
export const new_fuel_price = writable(1000);
export const isentropic_efficiency = writable(53);
export const generator_efficiency = writable(95);
export const outlet_pressure = writable(12.5);
export const required_steam_flow_rate = writable(5);

export const new_boiler_type = writable(0);
export const cop = writable(1.45);

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

const update_old_lhv_and_price = derived(old_fuel_type, (a) => {
	if (a !== 'อื่นๆ') {
		old_fuel_lhv.set(FUEL_DATA[a].lhv);
		old_fuel_price.set(FUEL_DATA[a].price);
	}
	return a;
});
update_old_lhv_and_price.subscribe(() => 0);

const update_new_lhv_and_price = derived(new_fuel_type, (a) => {
	if (a !== 'อื่นๆ') {
		new_fuel_lhv.set(FUEL_DATA[a].lhv);
		new_fuel_price.set(FUEL_DATA[a].price);
	}
	return a;
});
update_new_lhv_and_price.subscribe(() => 0);

export const old_fuel_usage_rate = derived(
	[
		old_prod_steam_volume,
		old_fuel_lhv,
		old_boiler_efficiency,
		old_steam_enthalpy,
		old_feedwater_enthalpy
	],
	([
		$old_prod_steam_volume,
		$old_fuel_lhv,
		$old_boiler_efficiency,
		$steam_enthalpy,
		$feedwater_enthalpy
	]) => {
		return (
			($old_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			(($old_fuel_lhv * $old_boiler_efficiency) / 100)
		);
	}
);

export const old_fuel_cost = derived(
	[old_fuel_price, old_prod_steam_volume, old_fuel_usage_rate],
	([$old_fuel_price, $old_prod_steam_volume, $fuel_usage_rate]) => {
		return Math.ceil(($fuel_usage_rate * $old_fuel_price) / $old_prod_steam_volume);
	}
);

export const custom_old_other_cost = writable(false);
export const old_other_cost = writable(0);
const update_old_other_cost = derived([custom_old_other_cost, old_fuel_cost], ([a, b]) => {
	old_other_cost.set(Math.ceil(b * 0.3));
	return [a, b];
});
update_old_other_cost.subscribe(() => 0);

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
		new_fuel_lhv,
		new_boiler_efficiency,
		new_steam_enthalpy,
		new_feedwater_enthalpy
	],
	([
		$new_prod_steam_volume,
		$new_fuel_lhv,
		$new_boiler_efficiency,
		$steam_enthalpy,
		$feedwater_enthalpy
	]) => {
		return (
			($new_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			(($new_fuel_lhv * $new_boiler_efficiency) / 100)
		);
	}
);

export const new_fuel_cost = derived(
	[new_fuel_price, new_prod_steam_volume, new_fuel_usage_rate],
	([$new_fuel_price, $new_prod_steam_volume, $fuel_usage_rate]) => {
		return Math.ceil(($fuel_usage_rate * $new_fuel_price) / $new_prod_steam_volume);
	}
);

export const custom_new_other_cost = writable(false);
export const new_other_cost = writable(0);
const update_new_other_cost = derived([custom_new_other_cost, new_fuel_cost], ([a, b]) => {
	new_other_cost.set(Math.ceil(b * 0.3));
	return [a, b];
});
update_new_other_cost.subscribe(() => 0);

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
		new_prod_steam_pressure,
		new_prod_steam_temp,
		outlet_pressure,
		isentropic_efficiency,
		new_steam_enthalpy
	],
	([
		$new_prod_steam_pressure,
		$new_prod_steam_temp,
		$outlet_pressure,
		$isentropic_efficiency,
		$steam_enthalpy
	]) => {
		const a = s_pT($new_prod_steam_pressure + 1, $new_prod_steam_temp);
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

export const custom_waste_enthalpy = writable(false);
export const waste_enthalpy = writable(0);
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
const update_fc_boiler = derived([custom_fc_boiler, new_max_steam_volume], ([a, b]) => {
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

export const fc_repair = writable(0);

export const fc_total = derived(
	[fc_boiler, fc_steam, fc_chiller, fc_other, fc_user_1, fc_user_2, new_boiler_type, fc_repair],
	([
		$fc_boiler,
		$fc_steam,
		$fc_chiller,
		$fc_other,
		$fc_user_1,
		$fc_user_2,
		$new_boiler_type,
		$fc_repair
	]) => {
		const sum_list =
			$new_boiler_type === 0
				? [$fc_boiler, $fc_steam, $fc_chiller, $fc_other, $fc_user_1, $fc_user_2]
				: [$fc_repair, $fc_steam, $fc_chiller, $fc_other, $fc_user_1, $fc_user_2];
		return sum_list.reduce((a, c) => a + c, 0);
	}
);

export const custom_ac_electricity = writable(false);
export const ac_electricity = writable(4160103);
const update_ac_electricity = derived(
	[custom_ac_electricity, new_prod_steam_volume, hr_per_day, day_per_year, electrical_cost],
	([a, $prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost]) => {
		ac_electricity.set(
			Math.ceil($prod_steam_volume * 8 * $hr_per_day * $day_per_year * $electrical_cost)
		);
		return [a, $prod_steam_volume, $hr_per_day, $day_per_year, $electrical_cost];
	}
);
update_ac_electricity.subscribe(() => 0);

export const ac_additional = derived(
	[new_total_cost, prod_steam_diff, hr_per_day, day_per_year],
	([$new_total_cost, $prod_steam_diff, $hr_per_day, $day_per_year]) => {
		return $new_total_cost * $hr_per_day * $day_per_year * $prod_steam_diff;
	}
);

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
	[ac_maintenance, ac_electricity, ac_additional, ac_user_1, ac_user_2],
	([$ac_maintenance, $ac_electricity, $ac_additional, $ac_user_1, $ac_user_2]) => {
		return [$ac_maintenance, $ac_electricity, $ac_additional, $ac_user_1, $ac_user_2].reduce(
			(a, c) => a + c,
			0
		);
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

export const sc_user_1 = writable(0);
export const sc_user_2 = writable(0);

export const sc_total = derived(
	[sc_steam, sc_chiller, sc_fuel, sc_user_1, sc_user_2],
	([$sc_steam, $sc_chiller, $sc_fuel, $sc_user_1, $sc_user_2]) => {
		return [$sc_steam, $sc_chiller, $sc_fuel, $sc_user_1, $sc_user_2].reduce((a, c) => a + c, 0);
	}
);

export const econ_n = derived(
	[fc_total, ac_total, sc_total],
	([$fc_total, $ac_total, $sc_total]) => {
		return $fc_total / ($sc_total - $ac_total);
	}
);

export const econ_steam_cost_per_year = derived(
	[new_prod_steam_volume, hr_per_day, day_per_year, new_total_cost],
	([$prod_steam_volume, $hr_per_day, $day_per_year, $total_cost]) => {
		return [$prod_steam_volume, $hr_per_day, $day_per_year, $total_cost].reduce((a, c) => a * c);
	}
);
