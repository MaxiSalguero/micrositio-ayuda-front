import { Post } from "./related.model";

export interface IPost {
    id:       number;
    title:    string;
    content:  string;
    status:   string;
    slug:     string;
    views:    number;
    created:  Date;
    updated:  Date;
    likes:    Like[];
    category: Category[];
}

export interface Category {
    id:      number;
    title:   string;
    info:    null;
    content: null;
    slug:    string;
    post:    Post[];
}

export interface Like {
    id:    number;
    value: boolean;
}
