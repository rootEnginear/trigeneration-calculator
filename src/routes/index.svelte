<script>
	const current_year = new Date().getFullYear();
</script>

<div style="display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 2rem)">
	<div class="box content">
		<h1>Trigeneration Calculator</h1>
		<hr />
		<div class="columns">
			<div class="column">
				<a href="/trigen" class="button menu-button is-fullwidth">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width={2}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						/>
					</svg>
					<h2 class="is-wrap">คำนวณ Trigeneration System</h2>
				</a>
			</div>
			<div class="column">
				<a href="/compare" class="button menu-button is-fullwidth">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width={2}
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
						/>
					</svg>
					<h2 class="is-wrap">เปรียบเทียบ Boiler</h2>
				</a>
			</div>
		</div>
		<hr />
		<footer class="content has-text-centered is-size-7">Copyright &copy; {current_year}</footer>
	</div>
</div>

<style>
	.menu-button {
		height: 100%;
		justify-content: flex-start;
		flex-direction: column;
	}
</style>
