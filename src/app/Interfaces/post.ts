export interface PostsInterface {
    id: number;
    date: string;
    guid: Object;
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: object;
    excerpt: object;
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    template: string;
    format: string;
    meta: Array<string>;
    categories: Array<number>;
    tags: Array<number>;
    _links: object;
    includes: any;
    _embedded: {};
}

