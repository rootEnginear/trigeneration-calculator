<script lang="ts">
	import { afterUpdate } from 'svelte';

	import Steps from 'components/Steps.svelte';
	import Input from 'components/LegacyInput.svelte';
	import InlineInput from 'components/LegacyInlineInput.svelte';
	import FormStep from 'components/FormStep.svelte';
	import NumberFormatter from 'components/NumberFormatter.svelte';
	import MoneyFormatter from 'components/MoneyFormatter.svelte';

	import { FIELD_DATA } from 'data/compareFieldData.old';
	import { FUEL_DATA } from 'data/fuelData';
	import {
		formData,
		old_steam_enthalpy,
		old_feedwater_enthalpy,
		old_fuel_usage_rate,
		old_fuel_cost,
		old_other_cost,
		old_total_cost,
		new_fuel_usage_rate,
		new_steam_enthalpy,
		new_feedwater_enthalpy,
		new_fuel_cost,
		new_other_cost,
		new_total_cost,
		turbine_outlet_enthalpy,
		turbine_outlet_temp,
		output_energy,
		prod_energy,
		kw_cooling,
		rt_cooling,
		fc_boiler,
		fc_steam,
		fc_chiller,
		fc_other,
		fc_total,
		ac_maintenance,
		ac_electricity,
		ac_total,
		sc_steam,
		sc_chiller,
		sc_total,
		econ_n,
		ac_additional,
		sc_fuel
	} from 'stores/compareFormData.old';

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
	<title
		>เปรียบเทียบ Boiler เก่า-ใหม่ พร้อมติดตั้งระบบ Trigeneration — คำนวณความคุ้มค่าในการติดตั้งระบบ
		Trigeneration</title
	>
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
				<Input fieldName="hr_per_day" {formData} {FIELD_DATA} />
				<Input fieldName="day_per_year" {formData} {FIELD_DATA} />
				<Input fieldName="electrical_cost" {formData} {FIELD_DATA} />
			</div>
		{/if}
		{#if currentStep === 1 || isPrinting}
			<h1>2 — Boiler</h1>
			<figure class="image">
				<img src="img/boiler.jpg" alt="" decoding="async" loading="lazy" width="500" height="300" />
			</figure>
			<div class="box is-shadowless">
				<h2>ข้อมูล Boiler เก่า</h2>
				<div class="columns">
					<div class="column">
						<Input fieldName="old_max_steam_volume" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="old_max_steam_pressure" {formData} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input
							fieldName="old_prod_steam_volume"
							max={$formData.old_max_steam_volume}
							{formData}
							{FIELD_DATA}
						/>
					</div>
					<div class="column">
						<Input
							fieldName="old_prod_steam_pressure"
							max={$formData.old_max_steam_pressure}
							{formData}
							{FIELD_DATA}
						/>
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="old_prod_steam_temp" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="old_input_steam_temp" {formData} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="old_input_steam_pressure" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="old_boiler_efficiency" {formData} {FIELD_DATA} />
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
										<select bind:value={$formData.old_fuel_type}>
											{#each Object.keys(FUEL_DATA) as fuel_name}
												<option value={fuel_name}>{fuel_name}</option>
											{/each}
										</select>
									</div>
								</td>
								<td />
							</tr>
							<tr>
								<td>ค่า LHV</td>
								<td class="has-text-right">{FUEL_DATA[$formData.old_fuel_type].lhv}</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<td>ค่าเชื้อเพลิง</td>
								<td class="has-text-right">
									<MoneyFormatter value={FUEL_DATA[$formData.old_fuel_type].price} />
								</td>
								<td>บาท/ตัน</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>อัตราการใช้เชื้อเพลิง</th>
								<th class="has-text-right">
									<NumberFormatter value={$old_fuel_usage_rate} />
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
										<th>{FIELD_DATA['old_prod_steam_pressure'].label}</th>
										<td class="has-text-right">{$formData.old_prod_steam_pressure}</td>
										<td>{FIELD_DATA['old_prod_steam_pressure'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['old_prod_steam_temp'].label}</th>
										<td class="has-text-right">{$formData.old_prod_steam_temp}</td>
										<td>{FIELD_DATA['old_prod_steam_temp'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['old_prod_steam_volume'].label}</th>
										<td class="has-text-right">{$formData.old_prod_steam_volume}</td>
										<td>{FIELD_DATA['old_prod_steam_volume'].unit}</td>
									</tr>
									<tr>
										<th>เอลทาลปีไอน้ำ</th>
										<td class="has-text-right">
											<NumberFormatter value={$old_steam_enthalpy} />
										</td>
										<td>kJ/kg</td>
									</tr>
									<tr>
										<th>เอลทาลปีน้ำป้อนเข้า</th>
										<td class="has-text-right">
											<NumberFormatter value={$old_feedwater_enthalpy} />
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
										<th class="has-text-right">เป็นเงิน</th>
										<th>หน่วย</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>ค่าเชื้อเพลิง</td>
										<td class="has-text-right">
											<MoneyFormatter value={$old_fuel_cost} />
										</td>
										<td>บาท/ตัน</td>
									</tr>
									<tr>
										<td>อื่นๆ 30%</td>
										<td class="has-text-right">
											<MoneyFormatter value={$old_other_cost} />
										</td>
										<td>บาท/ตัน</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<th>รวมต้นทุนทั้งหมด</th>
										<th class="has-text-right">
											<MoneyFormatter value={$old_total_cost} />
										</th>
										<th>บาท/ตัน</th>
									</tr>
								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<div class="box is-shadowless">
				<h2>ข้อมูล Boiler ใหม่</h2>
				<div class="columns">
					<div class="column">
						<Input fieldName="new_max_steam_volume" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="new_max_steam_pressure" {formData} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input
							fieldName="new_prod_steam_volume"
							max={$formData.new_max_steam_volume}
							{formData}
							{FIELD_DATA}
						/>
					</div>
					<div class="column">
						<Input
							fieldName="new_prod_steam_pressure"
							max={$formData.new_max_steam_pressure}
							{formData}
							{FIELD_DATA}
						/>
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="new_prod_steam_temp" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="new_input_steam_temp" {formData} {FIELD_DATA} />
					</div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="new_input_steam_pressure" {formData} {FIELD_DATA} />
					</div>
					<div class="column">
						<Input fieldName="new_boiler_efficiency" {formData} {FIELD_DATA} />
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
										<select bind:value={$formData.new_fuel_type}>
											{#each Object.keys(FUEL_DATA) as fuel_name}
												<option value={fuel_name}>{fuel_name}</option>
											{/each}
										</select>
									</div>
								</td>
								<td />
							</tr>
							<tr>
								<td>ค่า LHV</td>
								<td class="has-text-right">{FUEL_DATA[$formData.new_fuel_type].lhv}</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<td>ค่าเชื้อเพลิง</td>
								<td class="has-text-right">
									<MoneyFormatter value={FUEL_DATA[$formData.new_fuel_type].price} />
								</td>
								<td>บาท/ตัน</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>อัตราการใช้เชื้อเพลิง</th>
								<th class="has-text-right">
									<NumberFormatter value={$new_fuel_usage_rate} />
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
										<th>{FIELD_DATA['new_prod_steam_pressure'].label}</th>
										<td class="has-text-right">{$formData.new_prod_steam_pressure}</td>
										<td>{FIELD_DATA['new_prod_steam_pressure'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['new_prod_steam_temp'].label}</th>
										<td class="has-text-right">{$formData.new_prod_steam_temp}</td>
										<td>{FIELD_DATA['new_prod_steam_temp'].unit}</td>
									</tr>
									<tr>
										<th>{FIELD_DATA['new_prod_steam_volume'].label}</th>
										<td class="has-text-right">{$formData.new_prod_steam_volume}</td>
										<td>{FIELD_DATA['new_prod_steam_volume'].unit}</td>
									</tr>
									<tr>
										<th>เอลทาลปีไอน้ำ</th>
										<td class="has-text-right">
											<NumberFormatter value={$new_steam_enthalpy} />
										</td>
										<td>kJ/kg</td>
									</tr>
									<tr>
										<th>เอลทาลปีน้ำป้อนเข้า</th>
										<td class="has-text-right">
											<NumberFormatter value={$new_feedwater_enthalpy} />
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
										<th class="has-text-right">เป็นเงิน</th>
										<th>หน่วย</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>ค่าเชื้อเพลิง</td>
										<td class="has-text-right">
											<MoneyFormatter value={$new_fuel_cost} />
										</td>
										<td>บาท/ตัน</td>
									</tr>
									<tr>
										<td>อื่นๆ 30%</td>
										<td class="has-text-right">
											<MoneyFormatter value={$new_other_cost} />
										</td>
										<td>บาท/ตัน</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<th>รวมต้นทุนทั้งหมด</th>
										<th class="has-text-right">
											<MoneyFormatter value={$new_total_cost} />
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
								<th>{FIELD_DATA['new_prod_steam_pressure'].label}</th>
								<td class="has-text-right">{$formData.new_prod_steam_pressure}</td>
								<td>{FIELD_DATA['new_prod_steam_pressure'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['new_prod_steam_temp'].label}</th>
								<td class="has-text-right">{$formData.new_prod_steam_temp}</td>
								<td>{FIELD_DATA['new_prod_steam_temp'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['new_prod_steam_volume'].label.replace('การผลิต', '')}</th>
								<td class="has-text-right">{$formData.new_prod_steam_volume}</td>
								<td>{FIELD_DATA['new_prod_steam_volume'].unit}</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำขาเข้า</th>
								<td class="has-text-right">
									<NumberFormatter value={$new_steam_enthalpy} />
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['isentropic_efficiency'].label}</th>
								<td>
									<InlineInput fieldName="isentropic_efficiency" {formData} {FIELD_DATA} />
								</td>
								<td>{FIELD_DATA['isentropic_efficiency'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['generator_efficiency'].label}</th>
								<td>
									<InlineInput fieldName="generator_efficiency" {formData} {FIELD_DATA} />
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
								<td><InlineInput fieldName="outlet_pressure" {formData} {FIELD_DATA} /></td>
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
								<th>{FIELD_DATA['new_prod_steam_volume'].label.replace('การผลิต', '')}</th>
								<td class="has-text-right">{$formData.new_prod_steam_volume}</td>
								<td>{FIELD_DATA['new_prod_steam_volume'].unit}</td>
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
			<h1>4 — Double Effect Absorption Chiller</h1>
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
								<td class="has-text-right">1.45</td>
								<td />
							</tr>
							<tr>
								<th>{FIELD_DATA['required_steam_flow_rate'].label}</th>
								<td
									><InlineInput
										fieldName="required_steam_flow_rate"
										max={$formData.new_prod_steam_volume}
										{formData}
										{FIELD_DATA}
									/></td
								>
								<td>{FIELD_DATA['required_steam_flow_rate'].unit}</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำขาเข้า</th>
								<td class="has-text-right">
									<NumberFormatter value={$turbine_outlet_enthalpy} />
								</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>เอลทาลปีไอน้ำทิ้ง</th>
								<td class="has-text-right">419.17</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<th>ความเย็นที่ผลิตได้ (kW)</th>
								<td class="has-text-right">
									<NumberFormatter value={$kw_cooling} />
								</td>
								<td>kW</td>
							</tr>
							<tr>
								<th>ความเย็นที่ผลิตได้ (RT)</th>
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
				<div class="table-container">
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
			</div>
			<div class="box is-shadowless">
				<h2 id="fixedCost">Fixed Cost</h2>
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<th>รายการปรับปรุง</th>
								<th class="has-text-right">ราคา</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ค่าก่อสร้างและติดตั้ง Boiler ตัวใหม่</td>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_boiler} />
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>ค่าก่อสร้างและติดตั้ง Steam Expander</td>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_steam} />
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>ค่าติดตั้ง Absorption Chiller</td>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_chiller} />
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>อื่นๆ (ค่าระบบน้ำ, ตรวจวัดประสิทธิภาพ)</td>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_other} />
								</td>
								<td>บาท</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th>รวมค่าลงทุนทั้งหมด</th>
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
								<th class="has-text-right">เป็นเงิน</th>
								<th>หน่วย</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>ค่าบำรุงรักษา</td>
								<td class="has-text-right">
									<MoneyFormatter value={$ac_maintenance} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td>ค่าใช้จ่ายค่า Steam ที่เพิ่มขึ้น เป็นเวลา 1 ปี</td>
								<td class="has-text-right">
									<MoneyFormatter value={$ac_additional} />
								</td>
								<td>บาท/ปี</td>
							</tr>
							<tr>
								<td>ค่าไฟฟ้าสำหรับระบบ Trigeneration</td>
								<td class="has-text-right">
									<MoneyFormatter value={$ac_electricity} />
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
								<td>ผลประหยัดค่าเชื้อเพลิง boiler (เทียบกับเครื่องเดิม)</td>
								<td class="has-text-right">
									<MoneyFormatter value={$sc_fuel} />
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
