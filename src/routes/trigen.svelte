<script lang="ts">
	import { afterUpdate } from 'svelte';

	import Steps from 'components/Steps.svelte';
	import Input from 'components/Input.svelte';
	import InlineInput from 'components/InlineInput.svelte';
	import FormStep from 'components/FormStep.svelte';
	import NumberFormatter from 'components/NumberFormatter.svelte';
	import MoneyFormatter from 'components/MoneyFormatter.svelte';

	import { FIELD_DATA } from 'data/trigenFieldData';
	import { FUEL_DATA } from 'data/fuelData';
	import {
		// PG1
		hr_per_day,
		day_per_year,
		electrical_cost,
		// PG2
		max_steam_volume,
		max_steam_pressure,
		prod_steam_volume,
		prod_steam_pressure,
		prod_steam_temp,
		input_steam_temp,
		input_steam_pressure,
		boiler_efficiency,
		//
		fuel_type,
		fuel_lhv,
		fuel_price,
		//
		custom_other_cost,
		other_cost,
		// PG3
		isentropic_efficiency,
		generator_efficiency,
		outlet_pressure,
		// PG4
		cop,
		required_steam_flow_rate,
		custom_waste_enthalpy,
		waste_enthalpy,
		// PG5
		fc_boiler,
		fc_steam,
		fc_chiller,
		fc_other,
		custom_fc_boiler,
		custom_fc_steam,
		custom_fc_chiller,
		custom_fc_other,
		fc_user_1,
		fc_user_2,
		fc_total,
		//
		ac_maintenance,
		ac_electricity,
		custom_ac_maintenance,
		custom_ac_electricity,
		ac_user_1,
		ac_user_2,
		ac_total,
		//
		sc_steam,
		sc_chiller,
		sc_user,
		sc_total,
		//
		econ_n,
		econ_steam_cost_per_year,
		// COMPUTED
		steam_enthalpy,
		feedwater_enthalpy,
		fuel_usage_rate,
		fuel_cost,
		total_cost,
		turbine_outlet_enthalpy,
		turbine_outlet_temp,
		output_energy,
		prod_energy,
		kw_cooling,
		rt_cooling
	} from 'stores/trigenFormData';

	let currentStep = 0;
	let isPrinting = false;

	function print() {
		isPrinting = true;
	}

	afterUpdate(() => {
		if (isPrinting) {
			window.print();
			isPrinting = false;
		}
	});
</script>

<svelte:head>
	<title>ติดตั้งระบบ Trigeneration ใหม่ — คำนวณความคุ้มค่าในการติดตั้งระบบ Trigeneration</title>
</svelte:head>

<div class="box">
	<div class="columns is-mobile mb-4" class:is-hidden={isPrinting}>
		<div class="column is-narrow">
			<a href="/" class="button">
				<span class="icon is-small">
					<i class="fa fa-home" />
				</span>
				<span>กลับหน้าหลัก</span>
			</a>
		</div>
		<div class="column" />
		{#if currentStep === 4}
			<div class="column is-narrow">
				<div class="button" on:click={print}>
					<span>พิมพ์</span>
					<span class="icon is-small">
						<i class="fa fa-print" />
					</span>
				</div>
			</div>
		{/if}
	</div>
	<div class:is-hidden={isPrinting}>
		<Steps {currentStep} />
	</div>
	<hr class:is-hidden={isPrinting} />
	<div class="content">
		{#if currentStep === 0 || isPrinting}
			<h1>1 — ข้อมูลทั่วไป</h1>
			<div class="box is-shadowless">
				<Input fieldName="hr_per_day" store={hr_per_day} {FIELD_DATA} />
				<Input fieldName="day_per_year" store={day_per_year} {FIELD_DATA} />
				<Input fieldName="electrical_cost" store={electrical_cost} {FIELD_DATA} />
			</div>
		{/if}
		{#if currentStep === 1 || isPrinting}
			<h1>2 — Boiler</h1>
			<figure class="image">
				<img src="img/boiler.jpg" alt="" decoding="async" loading="lazy" width="500" height="300" />
			</figure>
			<div class="box is-shadowless">
				<h2>ข้อมูล Boiler</h2>
				<div class="columns">
					<div class="column">
						<Input fieldName="max_steam_volume" store={max_steam_volume} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="max_steam_pressure" store={max_steam_pressure} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input
							fieldName="prod_steam_volume"
							store={prod_steam_volume}
							max={$max_steam_volume}
							{FIELD_DATA}
						/>
					</div>
					<div class="column">
						<Input
							fieldName="prod_steam_pressure"
							store={prod_steam_pressure}
							max={$max_steam_pressure}
							{FIELD_DATA}
						/>
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="prod_steam_temp" store={prod_steam_temp} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="input_steam_temp" store={input_steam_temp} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="input_steam_pressure" store={input_steam_pressure} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="boiler_efficiency" store={boiler_efficiency} {FIELD_DATA} />
					</div>
				</div>
			</div>
			<div class="box is-shadowless">
				<h2>ข้อมูลเชื้อเพลิง</h2>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th colspan="2">ข้อมูลเชื้อเพลิง</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>เชื้อเพลิงที่ใช้</td>
								<td>
									<div class="select is-fullwidth" style="width:200px">
										<select bind:value={$fuel_type}>
											{#each Object.keys(FUEL_DATA) as fuel_name}
												<option value={fuel_name}>{fuel_name}</option>
											{/each}
											<option value="อื่นๆ">อื่นๆ</option>
										</select>
									</div>
								</td>
								<td />
							</tr>
							<tr>
								<td>ค่า LHV</td>
								<td class="has-text-right">
									{#if $fuel_type === 'อื่นๆ'}
										<InlineInput fieldName="fuel_lhv" store={fuel_lhv} {FIELD_DATA} />
									{:else}
										<span>{$fuel_lhv}</span>
									{/if}
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<td>ค่าเชื้อเพลิง</td>
								<td class="has-text-right">
									{#if $fuel_type === 'อื่นๆ'}
										<InlineInput fieldName="fuel_price" store={fuel_price} {FIELD_DATA} />
									{:else}
										<MoneyFormatter value={$fuel_price} />
									{/if}
								</td>
								<td>บาท/ตัน</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>อัตราการใช้เชื้อเพลิง</th>
								<th class="has-text-right">
									<NumberFormatter value={$fuel_usage_rate} />
								</th>
								<th>ตัน/ชั่วโมง</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div class="columns print-linear">
				<div class="column">
					<div class="box is-shadowless">
						<h2>Steam Outlet</h2>
						<div class="table-container">
							<table class="table">
								<tbody>
									<tr>
										<th>{FIELD_DATA['prod_steam_pressure'].label}</th>
										<td class="has-text-right">{$prod_steam_pressure}</td>
										<td>{FIELD_DATA['prod_steam_pressure'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['prod_steam_temp'].label}</th>
										<td class="has-text-right">{$prod_steam_temp}</td>
										<td>{FIELD_DATA['prod_steam_temp'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['prod_steam_volume'].label}</th>
										<td class="has-text-right">{$prod_steam_volume}</td>
										<td>{FIELD_DATA['prod_steam_volume'].unit}</td>
									</tr>
									<tr>
										<th>เอลทาลปีไอน้ำ</th>
										<td class="has-text-right">
											<NumberFormatter value={$steam_enthalpy} />
										</td>
										<td>kJ/kg</td>
									</tr>
									<tr>
										<th>เอลทาลปีน้ำป้อนเข้า</th>
										<td class="has-text-right">
											<NumberFormatter value={$feedwater_enthalpy} />
										</td>
										<td>kJ/kg</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="column">
					<div class="box is-shadowless">
						<h2>รายละเอียดต้นทุน Steam</h2>
						<div class="table-container">
							<table class="table">
								<thead>
									<tr>
										<th>รายการ</th>
										<th class="has-text-right" style="width: 100%">เป็นเงิน</th>
										<th>หน่วย</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>ค่าเชื้อเพลิง</td>
										<td class="has-text-right">
											<MoneyFormatter value={$fuel_cost} />
										</td>
										<td>บาท/ตัน</td>
									</tr>
									<tr>
										<td>
											<span>อื่นๆ 30%&emsp;</span>
											<input
												bind:checked={$custom_other_cost}
												type="checkbox"
												id="custom-other-cost"
												class="switch"
											/>
											<label for="custom-other-cost">&nbsp;</label>
										</td>
										<td class="has-text-right">
											{#if $custom_other_cost}
												<InlineInput fieldName="other_cost" store={other_cost} {FIELD_DATA} />
											{:else}
												<MoneyFormatter value={$other_cost} />
											{/if}
										</td>
										<td>บาท/ตัน</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<th>รวมต้นทุนทั้งหมด</th>
										<th class="has-text-right">
											<MoneyFormatter value={$total_cost} />
										</th>
										<th>บาท/ตัน</th>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if currentStep === 2 || isPrinting}
			<h1>3 — Turbine</h1>
			<figure class="image">
				<img
					src="img/turbine.jpg"
					alt=""
					decoding="async"
					loading="lazy"
					width="500"
					height="300"
				/>
			</figure>
			<div class="box is-shadowless">
				<h2>Inlet Steam</h2>
				<div class="table-container">
					<table class="table">
						<tbody>
							<tr>
								<th>{FIELD_DATA['prod_steam_pressure'].label}</th>
								<td class="has-text-right">{$prod_steam_pressure}</td>
								<td>{FIELD_DATA['prod_steam_pressure'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_temp'].label}</th>
								<td class="has-text-right">{$prod_steam_temp}</td>
								<td>{FIELD_DATA['prod_steam_temp'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_volume'].label.replace('การผลิต', '')}</th>
								<td class="has-text-right">{$prod_steam_volume}</td>
								<td>{FIELD_DATA['prod_steam_volume'].unit}</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำขาเข้า</th>
								<td class="has-text-right">
									<NumberFormatter value={$steam_enthalpy} />
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['isentropic_efficiency'].label}</th>
								<td>
									<InlineInput
										fieldName="isentropic_efficiency"
										store={isentropic_efficiency}
										{FIELD_DATA}
									/>
								</td>
								<td>{FIELD_DATA['isentropic_efficiency'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['generator_efficiency'].label}</th>
								<td>
									<InlineInput
										fieldName="generator_efficiency"
										store={generator_efficiency}
										{FIELD_DATA}
									/>
								</td>
								<td>{FIELD_DATA['generator_efficiency'].unit}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="box is-shadowless">
				<h2>Outlet Steam</h2>
				<div class="table-container">
					<table class="table">
						<tbody>
							<tr>
								<th>{FIELD_DATA['outlet_pressure'].label}</th>
								<td
									><InlineInput
										fieldName="outlet_pressure"
										store={outlet_pressure}
										{FIELD_DATA}
									/></td
								>
								<td>{FIELD_DATA['outlet_pressure'].unit}</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำขาออก</th>
								<td class="has-text-right">
									<NumberFormatter value={$turbine_outlet_enthalpy} />
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>อุณหภูมิใช้งานขาออก</th>
								<td class="has-text-right">
									<NumberFormatter value={$turbine_outlet_temp} />
								</td>
								<td>˚C</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_volume'].label.replace('การผลิต', '')}</th>
								<td class="has-text-right">{$prod_steam_volume}</td>
								<td>{FIELD_DATA['prod_steam_volume'].unit}</td>
							</tr>
							<tr>
								<th>พลังงานขาออก</th>
								<td class="has-text-right">
									<NumberFormatter value={$output_energy} />
								</td>
								<td>kW</td>
							</tr>
							<tr>
								<th>พลังงานไฟฟ้าที่ผลิตได้</th>
								<td class="has-text-right">
									<NumberFormatter value={$prod_energy} />
								</td>
								<td>kW</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		{/if}
		{#if currentStep === 3 || isPrinting}
			<h1>4 — Absorption Chiller</h1>
			<figure class="image">
				<img
					src="img/chiller.jpg"
					alt=""
					decoding="async"
					loading="lazy"
					width="500"
					height="300"
				/>
			</figure>
			<div class="box is-shadowless">
				<div class="table-container">
					<table class="table">
						<tbody>
							<tr>
								<th>COP</th>
								<th>&nbsp;</th>
								<td class="has-text-right">
									<InlineInput fieldName="cop" store={cop} {FIELD_DATA} />
								</td>
								<td />
							</tr>
							<tr>
								<th>{FIELD_DATA['required_steam_flow_rate'].label}</th>
								<td>&nbsp;</td>
								<td
									><InlineInput
										fieldName="required_steam_flow_rate"
										store={required_steam_flow_rate}
										max={$prod_steam_volume}
										{FIELD_DATA}
									/></td
								>
								<td>{FIELD_DATA['required_steam_flow_rate'].unit}</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำขาเข้า</th>
								<td>&nbsp;</td>
								<td class="has-text-right">
									<NumberFormatter value={$turbine_outlet_enthalpy} />
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำทิ้ง</th>
								<td>
									<input
										bind:checked={$custom_waste_enthalpy}
										type="checkbox"
										id="custom-waste-enthalpy"
										class="switch"
									/>
									<label for="custom-waste-enthalpy">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_waste_enthalpy}
										<InlineInput
											fieldName="waste_enthalpy"
											store={waste_enthalpy}
											{FIELD_DATA}
											max={$turbine_outlet_enthalpy}
										/>
									{:else}
										<span>{$waste_enthalpy}</span>
									{/if}
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>ความเย็นที่ผลิตได้ (kW)</th>
								<td>&nbsp;</td>
								<td class="has-text-right">
									<NumberFormatter value={$kw_cooling} />
								</td>
								<td>kW</td>
							</tr>
							<tr>
								<th>ความเย็นที่ผลิตได้ (RT)</th>
								<td>&nbsp;</td>
								<td class="has-text-right">
									<NumberFormatter value={$rt_cooling} />
								</td>
								<td>RT</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		{/if}
		{#if currentStep === 4 || isPrinting}
			<h1>5 — Economical Analysis</h1>
			<figure class="image">
				<img src="img/econ.png" alt="" decoding="async" loading="lazy" width="500" height="300" />
			</figure>
			<div class="box is-shadowless">
				<h2>Payback Period</h2>
				<div class="table-container m-0">
					<table class="table">
						<tbody>
							<tr class="">
								<th
									><a href="#fixedCost" class="button is-fullwidth is-danger is-light">Fixed Cost</a
									></th
								>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_total} />
								</td>
								<td>บาท</td>
							</tr>
							<tr class="">
								<th
									><a href="#annualCost" class="button is-fullwidth is-warning is-light"
										>Annual Cost</a
									></th
								>
								<td class="has-text-right">
									<MoneyFormatter value={$ac_total} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr class="">
								<th
									><a href="#saveCost" class="button is-fullwidth is-success is-light">Save Cost</a
									></th
								>
								<td class="has-text-right">
									<MoneyFormatter value={$sc_total} />
								</td>
								<td>บาท/ปี</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>n</th>
								<th class="has-text-right">
									<NumberFormatter value={$econ_n} digits={2} />
								</th>
								<th>ปี</th>
							</tr>
						</tfoot>
					</table>
				</div>
				<p style="text-align:right;margin:0">
					<small>
						ต้นทุนผลิตไอน้ำใช้งานต่อปี: <MoneyFormatter value={$econ_steam_cost_per_year} /> บาท/ปี
					</small>
				</p>
			</div>
			<div class="box is-shadowless">
				<h2 id="fixedCost">Fixed Cost</h2>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>รายการปรับปรุง</th>
								<th>&nbsp;</th>
								<th class="has-text-right" style="min-width:144px">ราคา</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ค่าก่อสร้างและติดตั้ง Boiler</td>
								<td>
									<input
										bind:checked={$custom_fc_boiler}
										type="checkbox"
										id="custom-fc-boiler"
										class="switch"
									/>
									<label for="custom-fc-boiler">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_fc_boiler}
										<InlineInput fieldName="fc_boiler" store={fc_boiler} {FIELD_DATA} width={120} />
									{:else}
										<MoneyFormatter value={$fc_boiler} />
									{/if}
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>ค่าก่อสร้างและติดตั้ง Steam Expander</td>
								<td>
									<input
										bind:checked={$custom_fc_steam}
										type="checkbox"
										id="custom-fc-steam"
										class="switch"
									/>
									<label for="custom-fc-steam">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_fc_steam}
										<InlineInput fieldName="fc_steam" store={fc_steam} {FIELD_DATA} width={120} />
									{:else}
										<MoneyFormatter value={$fc_steam} />
									{/if}
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>ค่าติดตั้ง Absorption Chiller</td>
								<td>
									<input
										bind:checked={$custom_fc_chiller}
										type="checkbox"
										id="custom-fc-chiller"
										class="switch"
									/>
									<label for="custom-fc-chiller">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_fc_chiller}
										<InlineInput
											fieldName="fc_chiller"
											store={fc_chiller}
											{FIELD_DATA}
											width={120}
										/>
									{:else}
										<MoneyFormatter value={$fc_chiller} />
									{/if}
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>อื่นๆ (ค่าระบบน้ำ, ตรวจวัดประสิทธิภาพ)</td>
								<td>
									<input
										bind:checked={$custom_fc_other}
										type="checkbox"
										id="custom-fc-other"
										class="switch"
									/>
									<label for="custom-fc-other">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_fc_other}
										<InlineInput fieldName="fc_other" store={fc_other} {FIELD_DATA} width={120} />
									{:else}
										<MoneyFormatter value={$fc_other} />
									{/if}
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td colspan="2">
									<div style="display:flex;gap:8px;align-items:center">
										<span style="white-space:nowrap">อื่นๆ (1)</span>
										<input
											type="text"
											class="input is-fullwidth"
											placeholder="ใส่รายละเอียดรายการอื่นๆ"
										/>
									</div>
								</td>
								<td class="has-text-right">
									<InlineInput fieldName="fc_user_1" store={fc_user_1} {FIELD_DATA} width={120} />
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td colspan="2">
									<div style="display:flex;gap:8px;align-items:center">
										<span style="white-space:nowrap">อื่นๆ (2)</span>
										<input
											type="text"
											class="input is-fullwidth"
											placeholder="ใส่รายละเอียดรายการอื่นๆ"
										/>
									</div>
								</td>
								<td class="has-text-right">
									<InlineInput fieldName="fc_user_2" store={fc_user_2} {FIELD_DATA} width={120} />
								</td>
								<td>บาท</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>รวมค่าลงทุนทั้งหมด</th>
								<th>&nbsp;</th>
								<th class="has-text-right">
									<MoneyFormatter value={$fc_total} />
								</th>
								<th>บาท</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div class="box is-shadowless">
				<h2 id="annualCost">Annual Cost</h2>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>ค่าใช้จ่ายที่เพิ่ม</th>
								<th>&nbsp;</th>
								<th class="has-text-right">เป็นเงิน</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ค่าบำรุงรักษา</td>
								<td>
									<input
										bind:checked={$custom_ac_maintenance}
										type="checkbox"
										id="custom-ac-maintenance"
										class="switch"
									/>
									<label for="custom-ac-maintenance">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_ac_maintenance}
										<InlineInput
											fieldName="ac_maintenance"
											store={ac_maintenance}
											{FIELD_DATA}
											width={120}
										/>
									{:else}
										<MoneyFormatter value={$ac_maintenance} />
									{/if}
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td>ค่าไฟฟ้าสำหรับเดินระบบ Trigeneration (เฉพาะส่วนของ Boiler Turbine)</td>
								<td>
									<input
										bind:checked={$custom_ac_electricity}
										type="checkbox"
										id="custom-ac-electricity"
										class="switch"
									/>
									<label for="custom-ac-electricity">&nbsp;</label>
								</td>
								<td class="has-text-right">
									{#if $custom_ac_electricity}
										<InlineInput
											fieldName="ac_electricity"
											store={ac_electricity}
											{FIELD_DATA}
											width={120}
										/>
									{:else}
										<MoneyFormatter value={$ac_electricity} />
									{/if}
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td colspan="2">
									<div style="display:flex;gap:8px;align-items:center">
										<span style="white-space:nowrap">อื่นๆ (1)</span>
										<input
											type="text"
											class="input is-fullwidth"
											placeholder="ใส่รายละเอียดรายการอื่นๆ"
										/>
									</div>
								</td>
								<td class="has-text-right">
									<InlineInput fieldName="ac_user_1" store={ac_user_1} {FIELD_DATA} width={120} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td colspan="2">
									<div style="display:flex;gap:8px;align-items:center">
										<span style="white-space:nowrap">อื่นๆ (2)</span>
										<input
											type="text"
											class="input is-fullwidth"
											placeholder="ใส่รายละเอียดรายการอื่นๆ"
										/>
									</div>
								</td>
								<td class="has-text-right">
									<InlineInput fieldName="ac_user_2" store={ac_user_2} {FIELD_DATA} width={120} />
								</td>
								<td>บาท/ปี</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>รวมค่าใช้จ่ายที่เพิ่มขึ้นเมื่อติดตั้งระบบ Trigeneration</th>
								<th class="has-text-right">
									<MoneyFormatter value={$ac_total} />
								</th>
								<th>บาท/ปี</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div class="box is-shadowless">
				<h2 id="saveCost">Save Cost</h2>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>รายการประหยัด</th>
								<th class="has-text-right">เป็นเงิน</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ค่าไฟที่ประหยัดได้จากการผลิตไฟของ Steam Expander</td>
								<td class="has-text-right">
									<MoneyFormatter value={$sc_steam} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td>ค่าไฟฟ้าที่ประหยัดจากการติดตั้ง Absorption Chiller</td>
								<td class="has-text-right">
									<MoneyFormatter value={$sc_chiller} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td>
									<div style="display:flex;gap:8px;align-items:center">
										<span style="white-space:nowrap">อื่นๆ</span>
										<input
											type="text"
											class="input is-fullwidth"
											placeholder="ใส่รายละเอียดรายการอื่นๆ"
										/>
									</div>
								</td>
								<td class="has-text-right">
									<InlineInput fieldName="sc_user" store={sc_user} {FIELD_DATA} width={120} />
								</td>
								<td>บาท/ปี</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>รวมผลประหยัดทั้งหมด</th>
								<th class="has-text-right">
									<MoneyFormatter value={$sc_total} />
								</th>
								<th>บาท/ปี</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		{/if}
	</div>
	<hr class:is-hidden={isPrinting} />
	<div class:is-hidden={isPrinting}>
		<FormStep bind:currentStep />
	</div>
</div>
