import { writable } from 'svelte/store'
import { get } from 'svelte/store'
import { store as sizes} from './sizes'

export let store =  writable([]);

export function getSizeSet(tags = []){
	let sizeSets = get(sizes)
	
	for(let set of sizeSets){
		let triggers = set.triggers
		for(let tag of tags){
			if(triggers.indexOf(tag) !== -1) return set.labels
		}
	}

	return []
}