import { derived, writable } from 'svelte/store';
import type { CompareInputDataType } from 'types/trigenTypes';
import { FUEL_DATA } from 'data/fuelData';

import { T_ph, h_pT, h_ps, s_pT } from 'utils/xsteam';

export const formData = writable<CompareInputDataType>({
	hr_per_day: 24,
	day_per_year: 330,
	electrical_cost: 3.7,
	old_max_steam_volume: 20,
	old_max_steam_pressure: 25,
	old_prod_steam_volume: 11,
	old_prod_steam_pressure: 22.5,
	old_prod_steam_temp: 226,
	old_input_steam_temp: 107,
	old_input_steam_pressure: 0.3,
	old_boiler_efficiency: 80.5,
	old_fuel_type: 'ไม้สับ',
	new_max_steam_volume: 20,
	new_max_steam_pressure: 25,
	new_prod_steam_volume: 16,
	new_prod_steam_pressure: 22.5,
	new_prod_steam_temp: 226,
	new_input_steam_temp: 107,
	new_input_steam_pressure: 0.3,
	new_boiler_efficiency: 90.74,
	new_fuel_type: 'ไม้สับ',
	isentropic_efficiency: 53,
	generator_efficiency: 95,
	outlet_pressure: 12.5,
	required_steam_flow_rate: 5
});

export const old_steam_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.old_prod_steam_pressure + 1, $formData.old_prod_steam_temp);
});

export const old_feedwater_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.old_prod_steam_pressure + 1, $formData.old_input_steam_temp);
});

export const old_fuel_usage_rate = derived(
	[formData, old_steam_enthalpy, old_feedwater_enthalpy],
	([$formData, $steam_enthalpy, $feedwater_enthalpy]) => {
		return (
			($formData.old_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((FUEL_DATA[$formData.old_fuel_type].lhv * $formData.old_boiler_efficiency) / 100)
		);
	}
);

export const old_fuel_cost = derived(
	[formData, old_fuel_usage_rate],
	([$formData, $fuel_usage_rate]) => {
		return Math.ceil(
			($fuel_usage_rate * FUEL_DATA[$formData.old_fuel_type].price) /
				$formData.old_prod_steam_volume
		);
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

export const new_steam_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.new_prod_steam_pressure + 1, $formData.new_prod_steam_temp);
});

export const new_feedwater_enthalpy = derived(formData, ($formData) => {
	return h_pT($formData.new_prod_steam_pressure + 1, $formData.new_input_steam_temp);
});

export const new_fuel_usage_rate = derived(
	[formData, new_steam_enthalpy, new_feedwater_enthalpy],
	([$formData, $steam_enthalpy, $feedwater_enthalpy]) => {
		return (
			($formData.new_prod_steam_volume * ($steam_enthalpy - $feedwater_enthalpy)) /
			((FUEL_DATA[$formData.new_fuel_type].lhv * $formData.new_boiler_efficiency) / 100)
		);
	}
);

export const new_fuel_cost = derived(
	[formData, new_fuel_usage_rate],
	([$formData, $fuel_usage_rate]) => {
		return Math.ceil(
			($fuel_usage_rate * FUEL_DATA[$formData.new_fuel_type].price) /
				$formData.new_prod_steam_volume
		);
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

const prod_steam_diff = derived(formData, ($formData) => {
	return $formData.new_prod_steam_volume - $formData.old_prod_steam_volume;
});

export const turbine_outlet_enthalpy = derived(
	[formData, new_steam_enthalpy],
	([$formData, $steam_enthalpy]) => {
		const a = s_pT($formData.old_prod_steam_pressure + 1, $formData.old_prod_steam_temp);
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
	[formData, new_steam_enthalpy, turbine_outlet_enthalpy],
	([$formData, $steam_enthalpy, $turbine_outlet_enthalpy]) => {
		return (
			$formData.new_prod_steam_volume *
			1000 *
			(1 / 3600) *
			($steam_enthalpy - $turbine_outlet_enthalpy)
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

// export const fc_boiler = derived(formData, ($formData) =>
// 	Math.ceil($formData.old_max_steam_volume * 2000000)
// );
// export const fc_steam = derived(prod_energy, ($prod_energy) => Math.ceil($prod_energy * 80000));
// export const fc_chiller = derived(rt_cooling, ($rt_cooling) => Math.ceil($rt_cooling * 20000));
// export const fc_other = derived(
// 	[fc_boiler, fc_steam, fc_chiller],
// 	([$fc_boiler, $fc_steam, $fc_chiller]) =>
// 		Math.ceil(0.1 * [$fc_boiler, $fc_steam, $fc_chiller].reduce((a, b) => a + b, 0))
// );
// export const fc_total = derived(
// 	[fc_boiler, fc_steam, fc_chiller, fc_other],
// 	([$fc_boiler, $fc_steam, $fc_chiller, $fc_other]) => {
// 		return [$fc_boiler, $fc_steam, $fc_chiller, $fc_other].reduce((a, c) => a + c, 0);
// 	}
// );

// export const ac_electricity = derived(formData, ($formData) =>
// 	Math.ceil(
// 		$formData.old_prod_steam_volume *
// 			8 *
// 			$formData.hr_per_day *
// 			$formData.day_per_year *
// 			$formData.electrical_cost
// 	)
// );
// export const ac_maintenance = derived(ac_electricity, ($ac_electricity) =>
// 	Math.ceil(0.1 * $ac_electricity)
// );
// export const ac_total = derived(
// 	[ac_maintenance, ac_electricity],
// 	([$ac_maintenance, $ac_electricity]) => {
// 		return [$ac_maintenance, $ac_electricity].reduce((a, c) => a + c, 0);
// 	}
// );

// export const sc_steam = derived([prod_energy, formData], ([$prod_energy, $formData]) => {
// 	return Math.ceil(
// 		$prod_energy * $formData.hr_per_day * $formData.day_per_year * $formData.electrical_cost
// 	);
// });
// export const sc_chiller = derived([rt_cooling, formData], ([$rt_cooling, $formData]) => {
// 	return Math.ceil(
// 		(0.75 - 0.114) *
// 			$rt_cooling *
// 			$formData.hr_per_day *
// 			$formData.day_per_year *
// 			$formData.electrical_cost
// 	);
// });
// export const sc_total = derived([sc_steam, sc_chiller], ([$sc_steam, $sc_chiller]) => {
// 	return [$sc_steam, $sc_chiller].reduce((a, c) => a + c, 0);
// });

// export const econ_n = derived(
// 	[fc_total, ac_total, sc_total],
// 	([$fc_total, $ac_total, $sc_total]) => {
// 		return $fc_total / ($sc_total - $ac_total);
// 	}
// );
