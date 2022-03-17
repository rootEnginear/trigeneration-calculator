<script lang="ts">
	export let value: number;
</script>

{#if value || value === 0}
	<span>{value.toLocaleString('en-GB')}</span>
{:else}
	<span class="has-text-danger">จำนวนไม่ถูกต้อง/ไม่สามารถคำนวณได้</span>
{/if}
