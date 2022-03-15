<script>
	import Steps from 'components/Steps.svelte';
	import Input from 'components/Input.svelte';
	import FormStep from 'components/FormStep.svelte';

	import { formData } from 'stores/formData';

	let currentStep = 0;
</script>

<div class="box">
	<Steps {currentStep} />
	<hr />
	<div class="content">
		{#if currentStep === 0}
			<h1>ข้อมูลทั่วไป</h1>
			<Input fieldName={'hr_per_day'} />
			<Input fieldName={'day_per_year'} />
			<Input fieldName={'electrical_cost'} />
		{:else if currentStep === 1}
			LOL
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
