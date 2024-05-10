import * as convert from 'xml-js';

export abstract class DrawIOXML {
    xml: string;

    constructor(xml: string) {
        this.xml = xml;
    }

    toJSON() : Record<string, any> {
        return convert.xml2js(this.xml, { 
            compact: false, 
            ignoreComment: true, 
            trim: true, 
            nativeType: true, 
            alwaysChildren: true, 
            ignoreDeclaration: true
         });
    }

    abstract toPrompt(): string;
    abstract process(): void;
}