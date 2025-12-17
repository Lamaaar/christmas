const jsSection = document.createElement('div');
jsSection.id = 'jssection';
document.body.appendChild(jsSection);

const table = document.createElement('table');
jsSection.appendChild(table);
jsSection.classList.add('hide');

const thead = document.createElement('thead');
table.appendChild(thead);
const headRow = document.createElement('tr');
thead.appendChild(headRow);
const headers = ['Osztály', 'Manó', 'Műszak'];
headers.forEach((text) => {
	const th = document.createElement('th');
	th.innerText = text;
	headRow.appendChild(th);
});

const data = [
	{ what: 'Logisztika', who1: 'Kovács Máté', shift1: 'Délelöttös', who2: 'Kovács József', shift2: 'Délutános' },
	{ what: 'Könyvelés', who1: 'Szabó Anna', shift1: 'Éjszakai' },
	{ what: 'Játékfejlesztés', who1: 'Varga Péter', shift1: 'Délutános', who2: 'Nagy Eszter', shift2: 'Éjszakai' }
];

initSelect(data);

const tbody = document.createElement('tbody');
tbody.id = 'jstbody';
table.appendChild(tbody);
renderTbody(data);

function renderTbody(arr) {
	const target = document.getElementById('jstbody');
	target.innerHTML = '';

	for (const item of arr) {
		const row = document.createElement('tr');
		target.appendChild(row);

		const classCell = document.createElement('td');
		classCell.innerText = item.what;
		row.appendChild(classCell);

		const elfCell = document.createElement('td');
		elfCell.innerText = item.who1;
		row.appendChild(elfCell);

		const shiftCell = document.createElement('td');
		shiftCell.innerText = item.shift1;
		row.appendChild(shiftCell);

		if (item.who2 && item.shift2) {
			classCell.rowSpan = 2;

			const secondRow = document.createElement('tr');
			target.appendChild(secondRow);

			const elf2Cell = document.createElement('td');
			elf2Cell.innerText = item.who2;
			secondRow.appendChild(elf2Cell);

			const shift2Cell = document.createElement('td');
			shift2Cell.innerText = item.shift2;
			secondRow.appendChild(shift2Cell);
		}
	}
}

const formConfig = [
	{ id: 'osztaly', label: 'Osztály', name: 'osztaly' },
	{ id: 'mano1', label: 'Manó 1', name: 'mano1' },
	{ id: 'muszak1', label: 'Manó 1 műszak', name: 'muszak1', type: 'select', optionList: [
		{ value: '1', label: 'Délelöttös' },
		{ value: '2', label: 'Délutános' },
		{ value: '3', label: 'Éjszakai' }
	] },
	{ id: 'masodikmano', label: 'Két manót veszek fel', name: 'masodikmano', type: 'checkbox' },
	{ id: 'mano2', label: 'Manó 2', name: 'mano2' },
	{ id: 'muszak2', label: 'Manó 2 műszak', name: 'muszak2', type: 'select', optionList: [
		{ value: '1', label: 'Délelöttös' },
		{ value: '2', label: 'Délutános' },
		{ value: '3', label: 'Éjszakai' }
	] }
];

const jsForm = buildForm(formConfig);
jsForm.id = 'jsform';
jsSection.appendChild(jsForm);

function buildForm(configList) {
	const form = document.createElement('form');

	for (const field of configList) {
		createField(field, form);
	}

	const submitBtn = document.createElement('button');
	submitBtn.innerText = 'Hozzaadas';
	form.appendChild(submitBtn);

	return form;
}

function createField(field, form) {
	const wrapper = document.createElement('div');
	form.appendChild(wrapper);

	if (field.type && field.type !== 'select') {
		if (field.type === 'checkbox') {
			const input = document.createElement('input');
			input.id = field.id;
			input.name = field.name;
			input.type = 'checkbox';
			wrapper.appendChild(input);

			const label = document.createElement('label');
			label.innerText = field.label;
			label.htmlFor = field.id;
			wrapper.appendChild(label);
		}
	} else {
		const label = document.createElement('label');
		label.innerText = field.label;
		label.htmlFor = field.id;
		wrapper.appendChild(label);
		wrapper.appendChild(document.createElement('br'));

		if (field.type) {
			if (field.type === 'select') {
				const select = document.createElement('select');
				select.id = field.id;
				wrapper.appendChild(select);

				const defaultOption = document.createElement('option');
				defaultOption.innerText = 'Válassz műszakot!';
				defaultOption.value = '';
				select.appendChild(defaultOption);

				for (const optionCfg of field.optionList) {
					const option = document.createElement('option');
					option.innerText = optionCfg.label;
					option.value = optionCfg.value;
					select.appendChild(option);
				}
			}
		} else {
			const input = document.createElement('input');
			input.id = field.id;
			input.name = field.name;
			wrapper.appendChild(input);
			wrapper.appendChild(document.createElement('br'));
		}
	}

	const errorSpan = document.createElement('span');
	errorSpan.classList.add('error');
	wrapper.appendChild(errorSpan);
}

function validateField(elem) {
	let isValid = true;
	if (elem.value === '') {
		elem.parentElement.querySelector('.error').innerText = 'Kötelező elem!';
		isValid = false;
	}
	return isValid;
}

jsForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const form = event.target;
	const osztaly = form.querySelector('#osztaly');
	const mano1 = form.querySelector('#mano1');
	const muszak1 = form.querySelector('#muszak1');
	const mano2 = form.querySelector('#mano2');
	const muszak2 = form.querySelector('#muszak2');
	const masodikmano = form.querySelector('#masodikmano');

	const what = osztaly.value;
	const who1 = mano1.value;
	const shift1 = muszak1.value;
	const who2 = mano2.value;
	const shift2 = muszak2.value;

	clearErrors(form);

	if (validateField(osztaly) & validateField(mano1) & validateField(muszak1)) {
		const obj = {};
		obj.what = what;
		obj.who1 = who1;
		obj.shift1 = mapMuszak(shift1);

		if (masodikmano.checked) {
			obj.who2 = who2;
			obj.shift2 = mapMuszak(shift2);
		}

		createNewElement(obj, form, data);
	}
});

function clearErrors(form) {
	const errors = form.querySelectorAll('.error');
	for (const err of errors) {
		err.innerText = '';
	}
}

document.getElementById('htmlform').addEventListener('submit', function (event) {
	event.preventDefault();
	const form = event.target;
	const manoChooser = form.querySelector('#manochooser');
	const manoTev1 = form.querySelector('#manotev1');
	const manoTev2 = form.querySelector('#manotev2');

	clearErrors(form);

	if (validateField(manoChooser) & validateField(manoTev1)) {
		const htmlTbody = document.getElementById('htmltbody');
		const row = document.createElement('tr');
		htmlTbody.appendChild(row);

		const nameCell = document.createElement('td');
		nameCell.innerText = manoChooser.value;
		row.appendChild(nameCell);

		const task1Cell = document.createElement('td');
		task1Cell.innerText = manoTev1.value;
		row.appendChild(task1Cell);

		if (manoTev2.value) {
			const task2Cell = document.createElement('td');
			task2Cell.innerText = manoTev2.value;
			row.appendChild(task2Cell);
		} else {
			task1Cell.colSpan = 2;
		}

		form.reset();
	}
});

initCheckbox(document.getElementById('jsform').querySelector('#masodikmano'));