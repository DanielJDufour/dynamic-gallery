/* global customElements */
/* global HTMLElement */

(function() {
  class DynamicGallery extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();
      this.state = {
        page: 0
      };
    }

    static get observedAttributes() {
      return ['color', 'height', 'sources'];
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      this.render();
    }

    render() {
      try {
        const color = this.getAttribute("color") || "chartreuse";

        const sources = this.getAttribute("sources").split(",");

        const inner = document.createElement("div");

        const carousel = document.createElement("carousel");
        sources.map((source, i) => {
          const img = document.createElement("img");
          img.src = source;
          img.height = this.getAttribute("height");
          if (i !== this.state.page ) img.style.display = "none";
          carousel.append(img);
        });

        const pagination = document.createElement("ul");
        pagination.style.padding = 0;
        sources.forEach((source, i) => {
          const li = document.createElement("li");
          li.style.cursor = "pointer";
          li.style.display = "inline-block";
          li.style.margin = "10px";
          li.style.padding = "10px";
          li.style.background = i === this.state.page ? color : "darkgray";
          li.style.boxShadow = "5px 5px";
          li.style.userSelect = "none";
          li.textContent = i + 1;
          li.addEventListener("click", () => {
            const imgs = this.querySelectorAll('img');

            // display new image
            imgs[i].style.display = null;

            // hide old image
            imgs[this.state.page].style.display = "none";

            // change pagination
            li.style.background = color;
            this.querySelectorAll('li')[this.state.page].style.background = "darkgray";

            // update page
            this.state.page = i;
          });
          pagination.appendChild(li);
        });

        inner.appendChild(carousel);
        inner.appendChild(pagination);

        this.appendChild(inner);

      } catch (error) {
        console.error("dynamic-gallery failed to render");
      }
    }
  }
  customElements.define('dynamic-gallery', DynamicGallery);
})();
