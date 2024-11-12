const encryptionTypes = {
	alphabet: 'alphabet',
	sha256: 'sha256',
};

// Encryption functions
const encryptionFunctions = {
	[encryptionTypes.alphabet]: function (text) {
		return text.split('').map(char => {
			if (/[a-zA-Z]/.test(char)) {
				const baseCode = char.toLowerCase().charCodeAt(0) - 96;
				return baseCode.toString();
			}
			return char;
		}).join('');
	},

	[encryptionTypes.sha256]: async function (text) {
		if (text.length === 0) return '';
		const encoder = new TextEncoder();
		const data = encoder.encode(text);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hash =  hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
		return hash.slice(0, 14)
	},
};

// Icons
const copyIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>`;
const copiedIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-copy-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path stroke="none" d="M0 0h24v24H0z" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" /><path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /><path d="M11 14l2 2l4 -4" /></svg>`;

function setCopyIcon (buttonElement) {
	buttonElement.innerHTML = copyIcon;
}

function setCopiedIcon (buttonElement) {
	buttonElement.innerHTML = copiedIcon;
	const timeout = setTimeout(() => {
		setCopyIcon(buttonElement);
		clearTimeout(timeout);
	}, 1000);
}


// Default constants
const defaultEncryptionType = encryptionTypes.alphabet;

const EncryptionTypeStorageName = 'encryptionType';


// Run after the DOM is loaded
document.addEventListener('DOMContentLoaded',  function() {

	// Document Elements
	const inputPassword = document.getElementById('input');
	const outputPassword = document.getElementById('output');
	const encryptionTypesContainer = document.getElementById('encryption-types-container');
	const copyToClipboardButton = document.getElementById('copy-to-clipboard');

	setCopyIcon(copyToClipboardButton);
	copyToClipboardButton.disabled = true;

	let currentEncryptionType = localStorage.getItem(EncryptionTypeStorageName) ?? defaultEncryptionType;

	// Create radio EncryptionType list
	Object.values(encryptionTypes).forEach((encryptionType, index) => {

		const divWrapper = document.createElement('div')
		divWrapper.classList.add('radio-wrapper')

		const radioInput = document.createElement('input')
		radioInput.type = 'radio'
		radioInput.name = 'encryption-type'
		radioInput.value = encryptionType
		radioInput.id = encryptionType
		radioInput.checked = encryptionType === currentEncryptionType || index === 0;
		radioInput.addEventListener('change', async function() {
			currentEncryptionType = encryptionType;
			localStorage.setItem(EncryptionTypeStorageName, currentEncryptionType)
			if (currentEncryptionType in encryptionFunctions)
				outputPassword.value = await encryptionFunctions[currentEncryptionType](inputPassword.value);
		});

		const radioLabel = document.createElement('label');
		radioLabel.htmlFor = encryptionType;
		radioLabel.innerText = encryptionType;

		divWrapper.appendChild(radioInput);
		divWrapper.appendChild(radioLabel);
		encryptionTypesContainer.appendChild(divWrapper);
	})


	// On input password change handler
	inputPassword.addEventListener('input', async function() {
		localStorage.setItem(EncryptionTypeStorageName, currentEncryptionType)
		if (currentEncryptionType in encryptionFunctions)
			outputPassword.value = await encryptionFunctions[currentEncryptionType](inputPassword.value);
		copyToClipboardButton.disabled = !inputPassword.value;
	});

	// Copy to clipboard handler
	copyToClipboardButton.addEventListener('click', async function() {
		await navigator.clipboard.writeText(outputPassword.value);
		setCopiedIcon(copyToClipboardButton);
	});

});
