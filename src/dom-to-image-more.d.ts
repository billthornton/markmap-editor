declare module 'dom-to-image-more' {
    import domToImage = require('dom-to-image');
    export = domToImage;

    export interface Options {
        filter?: ((node: Node) => boolean) | undefined;
        bgcolor?: string | undefined;
        width?: number | undefined;
        height?: number | undefined;
        style?: {} | undefined;
        quality?: number | undefined;
        imagePlaceholder?: string | undefined;
        cacheBust?: boolean | undefined;
        scale?: number | undefined;
    }

    export type ConvertFunction = (node: Node, options?: Options) => Promise<string>;
}
