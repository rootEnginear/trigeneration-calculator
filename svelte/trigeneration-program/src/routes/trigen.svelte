<script lang="ts">
	import Steps from 'components/Steps.svelte';
	import Input from 'components/Input.svelte';
	import InlineInput from 'components/InlineInput.svelte';
	import FormStep from 'components/FormStep.svelte';
	import NumberFormatter from 'components/NumberFormatter.svelte';

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
		turbine_outlet_temp
	} from 'stores/formData';

	let currentStep = 2;
</script>

<div class="box">
	<Steps {currentStep} />
	<hr />
	<div class="content">
		{#if currentStep === 0}
			<h1>1 — ข้อมูลทั่วไป</h1>
			<Input fieldName="hr_per_day" />
			<Input fieldName="day_per_year" />
			<Input fieldName="electrical_cost" />
		{:else if currentStep === 1}
			<h1>2 — Boiler</h1>
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
								<div class="select is-fullwidth">
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
							<td class="has-text-right">{FUEL_DATA[$formData.fuel_type].price}</td>
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
							<td class="has-text-right">{$fuel_cost}</td>
							<td>บาท/ตัน</td>
						</tr>
						<tr>
							<td>อื่นๆ 30%</td>
							<td class="has-text-right">{$other_cost}</td>
							<td>บาท/ตัน</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th>รวมต้นทุนทั้งหมด</th>
							<th class="has-text-right">{$total_cost}</th>
							<th>บาท/ตัน</th>
						</tr>
					</tfoot>
				</table>
			</div>
		{:else if currentStep === 2}
			<h1>3 — Turbine</h1>
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
							<th>ประสิทธิภาพไอเซนโทรปิก</th>
							<td>
								<InlineInput fieldName="isentropic_efficiency" />
							</td>
							<td>%</td>
						</tr>
						<tr>
							<th>ประสิทธิภาพของเครื่องกำเนิดไฟฟ้า</th>
							<td>
								<InlineInput fieldName="generator_efficiency" />
							</td>
							<td>%</td>
						</tr>
					</tbody>
				</table>
			</div>
			<h2>Outlet Steam</h2>
			<div class="table-container">
				<table class="table">
					<tbody>
						<tr>
							<td>ความดันไอน้ำใช้งานขาออก</td>
							<td><InlineInput fieldName="outlet_pressure" /></td>
							<td>Barg</td>
						</tr>
						<tr>
							<td>เอลทาลปีไอน้ำขาออก</td>
							<td class="has-text-right">
								<NumberFormatter value={$turbine_outlet_enthalpy} />
							</td>
							<td>kJ/kg</td>
						</tr>
						<tr>
							<td>อุณหภูมิใช้งานขาออก</td>
							<td class="has-text-right">
								<NumberFormatter value={$turbine_outlet_temp} />
							</td>
							<td>˚C</td>
						</tr>
						<tr>
							<td>{FIELD_DATA['prod_steam_volume'].label}</td>
							<td class="has-text-right">{$formData.prod_steam_volume}</td>
							<td>{FIELD_DATA['prod_steam_volume'].unit}</td>
						</tr>
						<tr>
							<td>พลังงานขาออก</td>
							<td class="has-text-right">A</td>
							<td>kW</td>
						</tr>
						<tr>
							<td>พลังงานไฟฟ้าที่ผลิตได้</td>
							<td class="has-text-right">A</td>
							<td>kW</td>
						</tr>
					</tbody>
				</table>
			</div>
		{/if}
	</div>
	<hr />
	<FormStep bind:currentStep />
</div>
<!-- <div class="content">
	<Input fieldName="start_time" bind:value={start_time} min={0} max={24} unit="hr" />
	<Input fieldName="stop_time" bind:value={stop_time} min={start_time} max={24} unit="hr" />
	<hr />
	<p>
		{start_time} - {stop_time}
	</p>
</div> -->
