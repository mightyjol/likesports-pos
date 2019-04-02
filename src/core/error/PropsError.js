import { CustomError } from './CustomError.js'

//common
export class RefError extends CustomError{}
export class NameError extends CustomError{}

//tags
export class PriorityError extends CustomError{}
export class SetError extends CustomError{}

export class ParameterError extends CustomError{}