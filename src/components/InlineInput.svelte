<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let FIELD_DATA;
	export let store: Writable<any>;

	export let fieldName;
	export let min: number | null = FIELD_DATA[fieldName].min;
	export let max: number | null = FIELD_DATA[fieldName].max;
	export let step: number | null = FIELD_DATA[fieldName].step;

	export let value = $store;

	const checkMinMax = (_) => {
		if (min !== null && value < min)
			return `${FIELD_DATA[fieldName].label}ต้องมากกว่าหรือเท่ากับ ${min} ${FIELD_DATA[fieldName].unit}`;
		if (max !== null && value > max)
			return `${FIELD_DATA[fieldName].label}ต้องน้อยกว่าหรือเท่ากับ ${max} ${FIELD_DATA[fieldName].unit}`;
		return '';
	};

	const updateFormData = (_) => {
		$store = value;
	};

	const guardValue = (_) => {
		if (value !== 0 && !value) value = min;
	};

	$: guardValue({ value });
	$: error = checkMinMax({ value, min, max });
	$: updateFormData({ value });
</script>

<div class="field">
	<div class="control is-expanded" class:has-icons-left={error}>
		<input
			class="input"
			class:is-danger={error}
			type="number"
			{min}
			{max}
			{step}
			bind:value
			style="min-width:100px"
		/>
		{#if error}
			<span class="icon is-small is-left">
				<i class="fas fa-exclamation-triangle" />
			</span>
		{/if}
	</div>
	<p class="help is-danger">{error}</p>
</div>
