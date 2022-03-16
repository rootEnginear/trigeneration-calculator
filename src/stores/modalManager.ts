import { writable } from 'svelte/store';

export const isAboutModalOpen = writable(false);

export const toggleAboutModal = () => isAboutModalOpen.update((v) => !v);
