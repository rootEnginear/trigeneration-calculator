<script lang="ts">
	export let value: number;
	export let digits = 4;
	export let roundingFunction = Math.ceil;

	const formatDigits = (value: number, decimal = 4, roundingFunction = Math.ceil): string => {
		return (roundingFunction(value * Math.pow(10, decimal)) / Math.pow(10, decimal)).toFixed(
			decimal
		);
	};
</script>

{#if value || value === 0}
	<span>{formatDigits(value, digits, roundingFunction)}</span>
{:else}
	<span class="has-text-danger">จำนวนไม่ถูกต้อง/ไม่สามารถคำนวณได้</span>
{/if}
