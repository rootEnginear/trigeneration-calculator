<script>
	import { toggleAboutModal } from 'stores/modalManager';
</script>

<svelte:head>
	<title>คำนวณความคุ้มค่าในการติดตั้งระบบ Trigeneration</title>
</svelte:head>

<div style="display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 2rem)">
	<div class="box content">
		<h1>คำนวณความคุ้มค่าในการติดตั้งระบบ Trigeneration</h1>
		<hr />
		<figure class="image">
			<img src="img/trigen_sys.jpg" alt="" />
		</figure>
		<div class="columns">
			<div class="column">
				<a href="/trigen" class="button menu-button is-fullwidth is-large">
					<span class="icon is-small">
						<i class="fa-solid fa-industry" />
					</span>
					<span>ติดตั้งระบบ Trigeneration ใหม่</span>
				</a>
			</div>
			<div class="column">
				<a href="/compare" class="button menu-button is-fullwidth is-large">
					<span class="icon is-small">
						<i class="fa-solid fa-scale-unbalanced" />
					</span>
					<span>เปรียบเทียบ Boiler เก่า-ใหม่ พร้อมติดตั้งระบบ Trigeneration</span>
				</a>
			</div>
		</div>
		<hr />
		<footer class="content has-text-centered is-size-7">
			<button class="button is-ghost" on:click={toggleAboutModal}>เกี่ยวกับโปรแกรม</button>
		</footer>
	</div>
</div>
