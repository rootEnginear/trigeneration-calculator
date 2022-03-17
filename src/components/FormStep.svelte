<script>
	export let currentStep;

	$: canPrev = currentStep > 0;
	$: canNext = currentStep < 4;

	const goTop = () => {
		window.scrollTo(0, 0);
	};
</script>

<div class="columns is-mobile">
	{#if canPrev}
		<div class="column is-narrow">
			<button
				class="button"
				on:click={() => {
					currentStep--;
					goTop();
				}}
			>
				<span class="icon is-small">
					<i class="fa fa-arrow-left" />
				</span>
				<span>ย้อนกลับ</span>
			</button>
		</div>
	{/if}
	<div class="column" />
	{#if canNext}
		<div class="column is-narrow">
			<button
				class="button"
				on:click={() => {
					currentStep++;
					goTop();
				}}
			>
				<span>ถัดไป</span>
				<span class="icon is-small">
					<i class="fa fa-arrow-right" />
				</span>
			</button>
		</div>
	{/if}
</div>
