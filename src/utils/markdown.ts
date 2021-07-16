/* eslint-disable no-empty */
import md  from "markdown-it";
import hljs from "highlight.js";

const markdown = md({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre class="hljs"><code>' + md().utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

export default markdown;
