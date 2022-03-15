<script lang="ts">
	import { FIELD_DATA } from 'data/fieldData';
	import { formData } from 'stores/formData';

	export let fieldName;
	export let min: number | null = FIELD_DATA[fieldName].min;
	export let max: number | null = FIELD_DATA[fieldName].max;

	export let value = $formData[fieldName];

	const checkMinMax = (_) => {
		if (min !== null && value < min)
			return `${FIELD_DATA[fieldName].label}ต้องมากกว่าหรือเท่ากับ ${min} ${FIELD_DATA[fieldName].unit}`;
		if (max !== null && value > max)
			return `${FIELD_DATA[fieldName].label}ต้องน้อยกว่าหรือเท่ากับ ${max} ${FIELD_DATA[fieldName].unit}`;
		return '';
	};

	const updateFormData = (_) => {
		$formData[fieldName] = value;
	};

	const guardValue = (_) => {
		if (value !== 0 && !value) value = min;
	};

	$: guardValue({ value });
	$: error = checkMinMax({ value, min, max });
	$: updateFormData({ value });
</script>

<div class="field">
	<label class="label" for={fieldName}>{FIELD_DATA[fieldName].label}*</label>
	<div class="field has-addons">
		<div class="control is-expanded" class:has-icons-left={error}>
			<input
				id={fieldName}
				class="input"
				class:is-danger={error}
				type="number"
				{min}
				{max}
				bind:value
			/>
			{#if error}
				<span class="icon is-small is-left" class:is-danger={error}>
					<i class="fas fa-exclamation-triangle" />
				</span>
			{/if}
		</div>
		<p class="control">
			<span class="button is-static">{FIELD_DATA[fieldName].unit}</span>
		</p>
	</div>
	<p class="help is-danger">{error}</p>
</div>
