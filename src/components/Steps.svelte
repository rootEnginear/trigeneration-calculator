<script>
	export let currentStep = 0;
</script>

<ul class="steps is-narrow is-medium is-centered has-content-centered">
	<li class="steps-segment" class:is-active={currentStep <= 0}>
		<span class="steps-marker">
			<span class="icon">
				<i class="fa fa-clipboard-list" />
			</span>
		</span>
		<div class="steps-content">
			<p class="is-size-5">ข้อมูลทั่วไป</p>
		</div>
	</li>
	<li class="steps-segment" class:is-active={currentStep === 1}>
		<span class="steps-marker">
			<span class="icon">
				<i class="fa fa-fire" />
			</span>
		</span>
		<div class="steps-content">
			<p class="is-size-5">Boiler</p>
		</div>
	</li>
	<li class="steps-segment" class:is-active={currentStep === 2}>
		<span class="steps-marker">
			<span class="icon">
				<i class="fa fa-wind" />
			</span>
		</span>
		<div class="steps-content">
			<p class="is-size-5">Turbine</p>
		</div>
	</li>
	<li class="steps-segment" class:is-active={currentStep === 3}>
		<span class="steps-marker">
			<span class="icon">
				<i class="fa fa-snowflake" />
			</span>
		</span>
		<div class="steps-content">
			<p class="is-size-5">Absorption Chiller</p>
		</div>
	</li>
	<li class="steps-segment" class:is-active={currentStep >= 4}>
		<span class="steps-marker ">
			<span class="icon">
				<i class="fa fa-chart-line" />
			</span>
		</span>
		<div class="steps-content">
			<p class="is-size-5">Economical Analysis</p>
		</div>
	</li>
</ul>
