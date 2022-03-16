<script>
	import 'styles/base.scss';

	import { isAboutModalOpen, toggleAboutModal } from 'stores/modalManager';

	const current_year = new Date().getFullYear();
</script>

<div class="container is-max-desktop p-4">
	<slot />
</div>

<div class="modal" class:is-active={$isAboutModalOpen}>
	<div class="modal-background" on:click={toggleAboutModal} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">เกี่ยวกับโปรแกรม</p>
			<button class="delete" aria-label="close" on:click={toggleAboutModal} />
		</header>
		<section class="modal-card-body content">
			<p>
				โปรแกรมนี้เป็นส่วนหนึ่งของรายวิชา MEE461 & 462 Mechanical Engineering Project<br />
				การศึกษาตามหลักสูตรปริญญาวิศวกรรมศาสตร์บัณฑิต ภาควิชาวิศวกรรมเครื่องกล<br />
				คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี ปีการศึกษา 2564<br />
				<strong>หัวข้อการศึกษา: การศึกษาระบบ Trigeneration ในอุตสาหกรรมอาหารกระป๋อง</strong>
			</p>
			<ul>
				จัดทำโดย
				<li>นายอติราช คงเกลี้ยง</li>
				<li>นายกิจภูมิ มาชู</li>
				<li>นายนนทกร ทวีเกตุ</li>
			</ul>
			<hr />
			<footer class="content has-text-centered is-size-7">
				Copyright &copy; {current_year}
			</footer>
		</section>
	</div>
</div>
