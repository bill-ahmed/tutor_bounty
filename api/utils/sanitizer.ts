const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/** A collection of helpful utilities. */
export namespace Utils {
  /** Sanitize various types of input. */
  export class Sanitizer {
    
    /** Given some dirty HTML, sanitize it. */
    public static sanitizeHTML(raw: string): string {
      return DOMPurify.sanitize(raw);
    }
  }
}