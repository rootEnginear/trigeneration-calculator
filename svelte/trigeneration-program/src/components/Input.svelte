<script lang="ts">
	export let fieldName;
	export let unit;
	export let min: number | null = null;
	export let max: number | null = null;

	export let value = 0;

	const checkMinMax = (_) => {
		if (min !== null && value < min) return `${fieldName} must be greater than ${min}`;
		if (max !== null && value > max) return `${fieldName} must be less than ${max}`;
		return '';
	};

	const updateMin = (_) => {
		if (min !== null && value < min) value = min;
	};

	const updateMax = (_) => {
		if (min !== null && value < min) value = min;
	};

	// $: updateMax({ value, max });
	// $: updateMin({ value, min });
	$: error = checkMinMax({ value, min, max });
</script>

<div class="field">
	<label class="label" for={fieldName}>{fieldName}</label>
	<div class="field has-addons">
		<div class="control is-expanded" class:has-icons-right={error}>
			<input
				id={fieldName}
				class="input "
				class:is-danger={error}
				type="number"
				{min}
				{max}
				bind:value
			/>
			{#if error}
				<span class="icon is-small is-right">
					<i class="fas fa-exclamation-triangle" />
				</span>
			{/if}
		</div>
		<p class="control">
			<span class="button is-static">{unit}</span>
		</p>
	</div>
	<p class="help is-danger">{error}&nbsp;</p>
</div>
