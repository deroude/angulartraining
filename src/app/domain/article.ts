import { User } from "./user";

export class Article{
    id?:number;
    author?:User;
    publishDate?:Date;
    articleType?:string;
    title?:string;
    text?:string;
}