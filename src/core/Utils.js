export default class Utils{
	static slugify(string) {
		const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;'
		const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------'
		const p = new RegExp(a.split('').join('|'), 'g')
		return string.toString().toLowerCase()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
			.replace(/&/g, '-and-') // Replace & with ‘and’
			.replace(/[^\w\-]+/g, '') // Remove all non-word characters
			.replace(/\-\-+/g, '-') // Replace multiple - with single -
			.replace(/^-+/, '') // Trim - from start of text
			.replace(/-+$/, '') // Trim - from end of text
	}
	
	static removeObjectPropertyDeep(obj, toRemove){ 
		for(let prop in obj) {
			if (prop === toRemove) delete obj[prop];
			else if (typeof obj[prop] === 'object')
				this.removeObjectPropertyDeep(obj[prop], toRemove);
		}

		return obj;
	}

	static capitalize(str) {
		return str.charAt(0).toUpperCase() + str.substr(1)
	}

	static arrayRemoveByValue(array, value){
		let index = array.indexOf(value);
		if (index !== -1) array.splice(index, 1);
	}
}