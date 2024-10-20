// I forgot who it is from, sorry

export default function implicitFiguresPlugin(md, options = {}) {
  function implicitFigures(state) {
    let tabIndex = 1;

    for (let i = 1, l = state.tokens.length; i < (l - 1); ++i) {
      const token = state.tokens[i];

      if (token.type !== 'inline') continue;
      if (!token.children || (token.children.length !== 1 && token.children.length !== 3)) continue;
      if (token.children.length === 1 && token.children[0].type !== 'image') continue;
      if (token.children.length === 3 &&
          (token.children[0].type !== 'link_open' ||
           token.children[1].type !== 'image' ||
           token.children[2].type !== 'link_close')) {
        continue;
      }
      if (i !== 0 && state.tokens[i - 1].type !== 'paragraph_open') continue;
      if (i !== (l - 1) && state.tokens[i + 1].type !== 'paragraph_close') continue;

      const figure = state.tokens[i - 1];
      figure.type = 'figure_open';
      figure.tag = 'figure';
      state.tokens[i + 1].type = 'figure_close';
      state.tokens[i + 1].tag = 'figure';

      if (options.dataType === true) {
        state.tokens[i - 1].attrPush(['data-type', 'image']);
      }

      let image;

      if (options.link === true && token.children.length === 1) {
        image = token.children[0];
        token.children.unshift(new state.Token('link_open', 'a', 1));
        token.children[0].attrPush(['href', image.attrGet('src')]);
        token.children.push(new state.Token('link_close', 'a', -1));
      }

      image = token.children.length === 1 ? token.children[0] : token.children[1];

      if (options.figcaption) {
        const captionOptionString = String(options.figcaption).toLowerCase().trim();

        if (captionOptionString === 'title') {
          let figCaption;
          const captionObj = image.attrs.find(([k]) => k === 'title');

          if (Array.isArray(captionObj)) {
            figCaption = captionObj[1];
          }

          if (figCaption) {
            const captionArray = md.parseInline(figCaption);
            let captionContent = { children: [] };

            if (Array.isArray(captionArray) && captionArray.length) {
              captionContent = captionArray[0];
            }

            token.children.push(new state.Token('figcaption_open', 'figcaption', 1));
            token.children.push(...captionContent.children);
            token.children.push(new state.Token('figcaption_close', 'figcaption', -1));

            if (image.attrs) {
              image.attrs = image.attrs.filter(([k]) => k !== 'title');
            }
          }
        } else if (options.figcaption === true || captionOptionString === 'alt') {
          if (image.children && image.children.length) {
            token.children.push(new state.Token('figcaption_open', 'figcaption', 1));
            token.children.push(...image.children);
            token.children.push(new state.Token('figcaption_close', 'figcaption', -1));
            if (!options.keepAlt) image.children.length = 0;
          }
        }
      }

      if (options.copyAttrs && image.attrs) {
        const f = options.copyAttrs === true ? '' : options.copyAttrs;
        figure.attrs = image.attrs.filter(([k]) => k.match(f));
      }

      // Copy classes from image to figure
      if (image.attrs) {
        const classAttr = image.attrs.find(attr => attr[0] === 'class');
        if (classAttr) {
          figure.attrPush(['class', classAttr[1]]);
        }
      }

      if (options.tabindex === true) {
        state.tokens[i - 1].attrPush(['tabindex', tabIndex]);
        tabIndex++;
      }

      if (options.lazyLoading === true) {
        image.attrPush(['loading', 'lazy']);
      }
    }
  }

  md.core.ruler.before('linkify', 'implicit_figures', implicitFigures);
}
