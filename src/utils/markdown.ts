import md from "markdown-it";
import hljs from "highlight.js";

const markdown = md({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
        // eslint-disable-next-line no-empty
      } catch (_) {}
    }
    return "";
  },
});

export default markdown;
