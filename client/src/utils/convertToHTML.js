import { convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

export default function (content) {
  const html = convertToHTML(convertFromRaw(JSON.parse(content)));
  return {
    __html: DOMPurify.sanitize(html),
  };
}
