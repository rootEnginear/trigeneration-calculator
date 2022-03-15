<script lang="ts">
	import Steps from 'components/Steps.svelte';
	import Input from 'components/Input.svelte';
	import InlineInput from 'components/InlineInput.svelte';
	import FormStep from 'components/FormStep.svelte';
	import NumberFormatter from 'components/NumberFormatter.svelte';
	import MoneyFormatter from 'components/MoneyFormatter.svelte';

	import { FIELD_DATA } from 'data/fieldData';
	import { FUEL_DATA } from 'data/fuelData';
	import {
		formData,
		steam_enthalpy,
		feedwater_enthalpy,
		fuel_usage_rate,
		fuel_cost,
		other_cost,
		total_cost,
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
		econ_n
	} from 'stores/trigenFormData';

	let currentStep = 0;
</script>

<svelte:head>
	<title>คำนวณ Trigeneration System — Trigeneration Calculator</title>
</svelte:head>

<div class="box">
	<a href="/" class="button mb-4">
		<span class="icon is-small">
			<i class="fa fa-home" />
		</span>
		<span>กลับหน้าหลัก</span>
	</a>
	<Steps {currentStep} />
	<hr />
	<div class="content">
		{#if currentStep === 0}
			<h1>1 — ข้อมูลทั่วไป</h1>
			<div class="box is-shadowless">
				<Input fieldName="hr_per_day" />
				<Input fieldName="day_per_year" />
				<Input fieldName="electrical_cost" />
			</div>
		{:else if currentStep === 1}
			<h1>2 — Boiler</h1>
			<div class="box is-shadowless">
				<h2>ข้อมูล Boiler</h2>
				<div class="columns">
					<div class="column"><Input fieldName="max_steam_volume" /></div>
					<div class="column"><Input fieldName="max_steam_pressure" /></div>
				</div>
				<div class="columns">
					<div class="column">
						<Input fieldName="prod_steam_volume" max={$formData.max_steam_volume} />
					</div>
					<div class="column">
						<Input fieldName="prod_steam_pressure" max={$formData.max_steam_pressure} />
					</div>
				</div>
				<div class="columns">
					<div class="column"><Input fieldName="prod_steam_temp" /></div>
					<div class="column"><Input fieldName="input_steam_temp" /></div>
				</div>
				<div class="columns">
					<div class="column"><Input fieldName="input_steam_pressure" /></div>
					<div class="column"><Input fieldName="boiler_efficiency" /></div>
				</div>
			</div>
			<div class="box is-shadowless">
				<h2>Steam Outlet</h2>
				<div class="table-container">
					<table class="table">
						<tbody>
							<tr>
								<th>{FIELD_DATA['prod_steam_pressure'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_pressure}</td>
								<td>{FIELD_DATA['prod_steam_pressure'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_temp'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_temp}</td>
								<td>{FIELD_DATA['prod_steam_temp'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_volume'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_volume}</td>
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
										<select bind:value={$formData.fuel_type}>
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
								<td class="has-text-right">{FUEL_DATA[$formData.fuel_type].lhv}</td>
								<td>kJ/kg</td>
							</tr>
							<tr>
								<td>ค่าเชื้อเพลิง</td>
								<td class="has-text-right">
									<MoneyFormatter value={FUEL_DATA[$formData.fuel_type].price} />
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
									<MoneyFormatter value={$fuel_cost} />
								</td>
								<td>บาท/ตัน</td>
							</tr>
							<tr>
								<td>อื่นๆ 30%</td>
								<td class="has-text-right">
									<MoneyFormatter value={$other_cost} />
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
		{:else if currentStep === 2}
			<h1>3 — Turbine</h1>
			<div class="box is-shadowless">
				<h2>Inlet Steam</h2>
				<div class="table-container">
					<table class="table">
						<tbody>
							<tr>
								<th>{FIELD_DATA['prod_steam_pressure'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_pressure}</td>
								<td>{FIELD_DATA['prod_steam_pressure'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_temp'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_temp}</td>
								<td>{FIELD_DATA['prod_steam_temp'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['prod_steam_volume'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_volume}</td>
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
									<InlineInput fieldName="isentropic_efficiency" />
								</td>
								<td>{FIELD_DATA['isentropic_efficiency'].unit}</td>
							</tr>
							<tr>
								<th>{FIELD_DATA['generator_efficiency'].label}</th>
								<td>
									<InlineInput fieldName="generator_efficiency" />
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
								<td><InlineInput fieldName="outlet_pressure" /></td>
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
								<th>{FIELD_DATA['prod_steam_volume'].label}</th>
								<td class="has-text-right">{$formData.prod_steam_volume}</td>
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
		{:else if currentStep === 3}
			<h1>4 — Double Effect Absorption Chiller</h1>
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
								<td><InlineInput fieldName="required_steam_flow_rate" /></td>
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
		{:else if currentStep === 4}
			<h1>5 — Economical Analysis</h1>
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
								<td>ค่าก่อสร้างและติดตั้ง Boiler </td>
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
								<td>ค่าติดตั้ง Absorption Chiller Chiller</td>
								<td class="has-text-right">
									<MoneyFormatter value={$fc_chiller} />
								</td>
								<td>บาท</td>
							</tr>
							<tr>
								<td>อื่นๆ (ค่าระบบน้ำตรวจวัดประสิทธิภาพ)</td>
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
								<td>ค่าไฟฟ้าสำหรับเดินระบบ Trigeneration (เฉพาะส่วนของ Boiler Turbine)</td>
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
	<hr />
	<FormStep bind:currentStep />
</div>
