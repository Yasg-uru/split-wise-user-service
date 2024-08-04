import { Request } from "express";
export interface Reqwithuser extends Request{
user?:any;

}