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

// Extensión de Category para soportar jerarquía de 3 niveles
export interface CategoryNode extends Category {
    subcategories?: CategoryNode[];  // Categorías nietas (hijas de esta categoría)
    hasChildren?: boolean;            // Flag para saber si tiene sub-categorías
}

export interface Like {
    id:    number;
    value: boolean;
}
