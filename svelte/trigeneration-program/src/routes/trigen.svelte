<script>
	import Input from 'components/Input.svelte';

	let start_time = 0;
	let stop_time = 0;
</script>

<div class="content">
	<h1>Trigen</h1>
	<Input fieldName="start_time" bind:value={start_time} min={0} max={24} unit="hr" />
	<Input fieldName="stop_time" bind:value={stop_time} min={start_time} max={24} unit="hr" />
	<hr />
	<p>
		{start_time} - {stop_time}
	</p>
</div>
