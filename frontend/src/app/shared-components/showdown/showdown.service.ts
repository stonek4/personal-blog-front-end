import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import * as showdown from 'showdown';


@Injectable({
    providedIn: 'root'
})
/**
 * A simple service to provide the showdown converter.
 * Instead of creating a new converter every time one is
 * needed we can just re-use this one.
 * @class
 */
export class ShowdownService {

    private converter = new showdown.Converter();

    constructor(private logger: NGXLogger) { }

    /**
     * Converts markdown to HTML... haven't found
     * the need to go the other way yet but I believe
     * that is possible.
     * @param markdown the markdown string to convert
     */
    public makeHtml(markdown: string) {
        return this.converter.makeHtml(markdown);
    }
}
