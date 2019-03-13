export class CustomError extends Error {
	constructor(message, data) {
		super(message);
		this.name = this.constructor.name;
		
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor, data);
		} else { 
			this.stack = (new Error(message)).stack; 
		}
	}
}    
