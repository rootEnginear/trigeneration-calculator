<script lang="ts">
	import Steps from 'components/Steps.svelte';
	import Input from 'components/Input.svelte';
	import FormStep from 'components/FormStep.svelte';

	let currentStep = 0;
</script>

<svelte:head>
	<title
		>เปรียบเทียบข้อมูลโรงงาน หากติดตั้งระบบ Trigeneration — คำนวณความคุ้มค่าในการติดตั้งระบบ
		Trigeneration</title
	>
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
		{/if}
	</div>
	<hr />
	<FormStep bind:currentStep />
</div>
