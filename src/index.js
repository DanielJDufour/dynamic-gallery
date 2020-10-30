/* global customElements */
/* global HTMLElement */

(function () {
  class DynamicGallery extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();
      this.state = {
        page: 0
      };
    }

    static get observedAttributes() {
      return ["color", "data-sources", "height", "width"];
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      this.render();
    }

    get debug() {
      return this.getAttribute("debug") === "true";
    }

    get color() {
      return this.getAttribute("color") || "chartreuse";
    }

    get count() {
      return this.querySelectorAll("li").length;
    }

    add(source) {
      try {
        // update data-sources in DOM
        const sources = JSON.parse(this.getAttribute("data-sources"));
        sources.push(source);
        this.setAttribute("data-sources", JSON.stringify(sources));

        // adding image
        const img = document.createElement("img");
        img.src = source;
        img.style.width = "100%";
        img.style.display = "none";
        this.querySelector(".carousel").append(img);

        // update pagination
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.style.display = "inline-block";
        li.style.margin = "10px";
        li.style.padding = "10px";
        li.style.background = "darkgray";
        li.style.boxShadow = "5px 5px";
        li.style.userSelect = "none";

        const i = this.count;

        li.textContent = i + 1;

        li.addEventListener("click", () => {
          // don't do anything if clicking currently selected
          if (this.state.page === i) return;

          const imgs = this.querySelectorAll("img");

          // display new image
          imgs[i].style.display = null;

          // hide old image
          imgs[this.state.page].style.display = "none";

          // change pagination
          li.style.background = this.color;
          this.querySelectorAll("li")[this.state.page].style.background =
            "darkgray";

          // update page
          this.state.page = i;
        });

        this.querySelector("ul").appendChild(li);
      } catch (error) {
        console.error("dynamic-gallery failed to add");
        console.error(error);
        throw error;
      }
    }

    render() {
      try {
        const sources = JSON.parse(this.getAttribute("data-sources"));

        const inner = document.createElement("div");
        inner.style.margin = "0 auto";
        inner.style.width = this.getAttribute("width") || "300px";

        const carouselWrapper = document.createElement("div");
        carouselWrapper.className = "carousel-wrapper";
        carouselWrapper.style.height = this.getAttribute("height") || "400px";
        carouselWrapper.style.overflowY = "auto";
        carouselWrapper.style.width = "100%";
        const carousel = document.createElement("div");
        carousel.style.width = "100%";
        carousel.className = "carousel";
        sources.map((source, i) => {
          const img = document.createElement("img");
          img.src = source;
          img.style.width = "100%";
          if (i !== this.state.page) img.style.display = "none";
          carousel.append(img);
        });
        carouselWrapper.appendChild(carousel);

        const pagination = document.createElement("ul");
        pagination.style.padding = 0;
        sources.forEach((source, i) => {
          const li = document.createElement("li");
          li.style.cursor = "pointer";
          li.style.display = "inline-block";
          li.style.margin = "10px";
          li.style.padding = "10px";
          li.style.background = i === this.state.page ? this.color : "darkgray";
          li.style.boxShadow = "5px 5px";
          li.style.userSelect = "none";
          li.textContent = i + 1;
          li.addEventListener("click", () => {
            // don't do anything if clicking currently selected
            if (this.state.page === i) return;

            const imgs = this.querySelectorAll("img");

            // display new image
            imgs[i].style.display = null;

            // hide old image
            imgs[this.state.page].style.display = "none";

            // change pagination
            li.style.background = this.color;
            this.querySelectorAll("li")[this.state.page].style.background =
              "darkgray";

            // update page
            this.state.page = i;
          });
          pagination.appendChild(li);
        });

        inner.appendChild(carouselWrapper);
        inner.appendChild(pagination);

        this.appendChild(inner);
      } catch (error) {
        console.error("dynamic-gallery failed to render");
        console.error(error);
        throw error;
      }
    }
  }
  customElements.define("dynamic-gallery", DynamicGallery);
})();
