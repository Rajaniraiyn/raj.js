/* 
  Raj.js
  © 2021 Rajaniraiyn
  A modern alternative to jQuery.
*/

((_) => {
  "use strict";

  /**
   * to handle jQuery "Sizzle" selector https://github.com/jquery/sizzle
   */
  function raj(selector: keyof HTMLElementTagNameMap = undefined): Raj {
    switch (selector) {
      case undefined:
        return;

      default:
        // @ts-ignore
        selector = selector.trim();

        function isSpecialSelector(selector: string): boolean {
          switch (selector.includes("#") && selector.includes(".")) {
            case true:
              return true;

            default:
              break;
          }
          //if (selector.includes("#") && selector.includes(".")) return true;

          var specialChars = [
            "~",
            "!",
            "+",
            ":",
            ">",
            ",",
            "-",
            "(",
            ")",
            "[",
            "]",
            "*",
          ];

          for (var i = 0, len = specialChars.length; i < len; i++) {
            switch (selector.includes(specialChars[i])) {
              case true:
                return true;

              default:
                break;
            }
            //if (selector.includes(specialChars[i])) return true;
          }

          return false;
        }
        switch (isSpecialSelector(selector)) {
          case true:
            return new Raj(document.querySelectorAll(selector), selector);

          default:
            switch (selector.startsWith("#")) {
              case true:
                return new Raj(
                  document.getElementById(selector.replace("#", "")),
                  selector
                );

              default:
                switch (selector.startsWith(".")) {
                  case true:
                    return new Raj(
                      document.getElementsByClassName(
                        selector.replace(".", "")
                      ),
                      selector
                    );

                  default:
                    return new Raj(
                      document.getElementsByTagName(selector),
                      selector
                    );
                }
            }
        }
    }
    /*
      if (selector === undefined) return;
  
      // @ts-ignore
      selector = selector.trim();
  
      function isSpecialSelector(selector: string): boolean {
        if (selector.includes("#") && selector.includes(".")) return true;
  
        var specialChars = [
          "~",
          "!",
          "+",
          ":",
          ">",
          ",",
          "-",
          "(",
          ")",
          "[",
          "]",
          "*",
        ];
  
        for (var i = 0, len = specialChars.length; i < len; i++) {
          if (selector.includes(specialChars[i])) return true;
        }
  
        return false;
      }
      if (isSpecialSelector(selector)) {
        return new Raj(document.querySelectorAll(selector), selector);
      } else if (selector.startsWith("#")) {
        return new Raj(
          document.getElementById(selector.replace("#", "")),
          selector
        );
      } else if (selector.startsWith(".")) {
        return new Raj(
          document.getElementsByClassName(selector.replace(".", "")),
          selector
        );
      } else return new Raj(document.getElementsByTagName(selector), selector);
      */
  }

  raj["version"] = "1.0.0";

  /**
   * performance focused forEach loop
   * using "reversed for loop"
   */
  function forEach(array: any[], callback: Function): void {
    for (var i = 0, len = array.length; i < len; i++) {
      callback(array[i], i);
    }
  }

  class Raj extends Array {
    selector: keyof HTMLElementTagNameMap;
    /**
     * to handle jQuery "Sizzle" selector https://github.com/jquery/sizzle
     */
    constructor(
      elements: any = undefined,
      selector: keyof HTMLElementTagNameMap
    ) {
      switch (elements.length) {
        case undefined:
          elements = [elements];
          break;

        default:
          elements = [...elements];
          break;
      }
      //elements = elements.length === undefined ? [elements] : [...elements];
      super(...elements);
      this["context"] = window.document;
      this.selector = selector;
      return this;
    }

    /**
     * hides the selected elements
     *
     */
    hide(): Raj {
      forEach(this, (element: HTMLElement) => {
        element[raj.expando] = { display: element.style.display };
        element.style.setProperty("display", "none");
      });
      return this;
    }

    /**
     * makes hidden selected elements visible
     *
     */
    show(): Raj {
      forEach(this, (element: HTMLElement) => {
        element.style.setProperty("display", element[raj.expando]["display"]);
      });
      return this;
    }

    eq(index: number): Raj {
      return new Raj(
        this[((index % this.length) + this.length) % this.length],
        this.selector
      );
    }

    /**
     * selects first element among selected element
     *
     */
    first(): Raj {
      return this.eq(0);
    }

    /**
     * selects last element among selected element
     *
     */
    last(): Raj {
      return this.eq(-1);
    }

    even(): Raj {
      // @ts-ignore
      return this.filter((_: HTMLElement, i: number) => {
        return i % 2 !== 0;
      });
    }

    odd(): Raj {
      // @ts-ignore
      return this.filter((_: HTMLElement, i: number) => {
        return i % 2 === 0;
      });
    }

    not(selector: keyof HTMLElementTagNameMap = undefined): Raj {
      var not = raj(selector);
      // @ts-ignore
      return this.filter((element: HTMLElement) => {
        return !not.includes(element);
      });
    }

    /**
     * Adds class name to all selected elements
     *
     */
    addClass(className: string): Raj {
      forEach(this, (element: Element) => {
        element.classList.add(className);
      });

      return this;
    }

    /**
     * Removes a class if it presents in selected elements
     *
     */
    removeClass(className: string): Raj {
      forEach(this, (element: Element) => {
        element.classList.remove(className);
      });

      return this;
    }

    /**
     * Toggles a class in all selected elements
     *
     */
    toggleClass(className: string): Raj {
      forEach(this, (element: Element) => {
        element.classList.toggle(className);
      });

      return this;
    }

    /**
     * Adds a event listener to all selected elements
     *
     */
    on(
      event: keyof HTMLElementEventMap,
      callback: any,
      options?: boolean | AddEventListenerOptions
    ) {
      forEach(this, (element: HTMLElement) => {
        element.addEventListener(event, callback, options);
      });
    }

    off(event: keyof HTMLElementEventMap, selector: string, handler?: any) {
      if (handler === undefined) {
        forEach(this, (element: HTMLElement) => {
          // remove all events
        });
      }
    }

    click(handler?: Function, ...args: boolean[] | AddEventListenerOptions[]) {
      if (handler === undefined) {
        forEach(this, (element: HTMLElement) => {
          element.click();
        });
      }

      this.on("click", handler, ...args);
    }

    /**
     * Adds a HTML string after all selected elements
     *
     */
    after(...args: string[]): Raj {
      var elementText: string = [...args].reverse().join("");
      forEach(this, (element: HTMLElement) => {
        element.insertAdjacentHTML("afterend", elementText);
      });
      return this;
    }

    /**
     * Adds HTML string within all selected elements as a last child
     *
     */
    append(...args: string[]): Raj {
      var elementText: string = [...args].join("");
      forEach(this, (element: HTMLElement) => {
        element.insertAdjacentHTML("beforeend", elementText);
      });
      return this;
    }

    /**
     * Adds HTML string within all selected elements as a first child
     *
     */
    prepend(...args: string[]): Raj {
      var elementText: string = [...args].reverse().join("");
      forEach(this, (element: HTMLElement) => {
        element.insertAdjacentHTML("afterbegin", elementText);
      });
      return this;
    }

    /**
     * Adds HTML string before all selected elements
     *
     */
    before(...args: string[]): Raj {
      var elementText: string = [...args].join("");
      forEach(this, (element: HTMLElement) => {
        element.insertAdjacentHTML("beforebegin", elementText);
      });
      return this;
    }

    /**
     * Handles the attributes of a DOM element i.e. first among the selected elements
     *
     * Acts as both getter and setter & can also take multiple attributes at once
     * as a key value Object
     *
     */
    attr(attribute: string | object, value?: string | Function): string {
      switch (value) {
        case undefined:
          switch (typeof attribute) {
            case "object":
              var values: string[] = Object.values(attribute);
              forEach(Object.keys(attribute), (key: string, i: number) => {
                this[0].setAttribute(key, values[i]);
              });
              break;

            default:
              return this[0].getAttribute(attribute);
          }

        default:
          switch (typeof value) {
            case "function":
              forEach(this, (element: HTMLElement, i: number) => {
                // @ts-ignore
                value(i, element.getAttribute(attribute));
              });
              break;

            default:
              return this[0].setAttribute(attribute, value);
          }
      }
      /*
        if (value === undefined) {
          if (typeof attribute === "object") {
            var values: string[] = Object.values(attribute);
            forEach(Object.keys(attribute), (key: string, i: number) => {
              this[0].setAttribute(key, values[i]);
            });
          }
          return this[0].getAttribute(attribute);
        } else if (typeof value === "function") {
          forEach(this, (element: HTMLElement, i: number) => {
            // @ts-ignore
            value(i, element.getAttribute(attribute));
          });
        }
  
        return this[0].setAttribute(attribute, value);
        */
    }

    /**
     * Handles the styles of a DOM element i.e. first among the selected elements
     *
     * Acts as both getter and setter & can also take multiple attributes at once
     * as a key value Object
     *
     */
    css(property: string | object, value?: string | Function): string {
      switch (value) {
        case undefined:
          switch (typeof property) {
            case "object":
              var values: string[] = Object.values(property);
              forEach(Object.keys(property), (key: string, i: number) => {
                this[0].style.setProperty(key, values[i]);
              });
              break;

            default:
              return getComputedStyle(this[0])[property];
          }

        default:
          switch (typeof value) {
            case "function":
              forEach(this, (element: HTMLElement, i: number) => {
                // @ts-ignore
                value(i, getComputedStyle(element)[property]);
              });
              break;

            default:
              return this[0].style.setProperty(property, value);
          }
      }
      /*
        if (value === undefined) {
          if (typeof property === "object") {
            var values: string[] = Object.values(property);
            forEach(Object.keys(property), (key: string, i: number) => {
              this[0].style.setProperty(key, values[i]);
            });
          }
          //@ts-ignore
          return getComputedStyle(this[0])[property];
        } else if (typeof value === "function") {
          forEach(this, (element: HTMLElement, i: number) => {
            // @ts-ignore
            value(i, getComputedStyle(element)[property]);
          });
        }
  
        return this[0].style.setProperty(property, value);
        */
    }

    /**
     * Cleans everything inside all selected elements i.e. excluding the element itself
     *
     */
    empty(): Raj {
      forEach(this, (element: HTMLElement, i: number) => {
        element.innerHTML = null;
      });
      return this;
    }

    /**
     * Checks wether a class is present in the first element of selected
     *
     */
    hasClass(className: string): boolean {
      return this[0].classList.contains(className);
    }

    /**
     * Returns the height of the first element of selected
     *
     */
    height(): number {
      return parseFloat(getComputedStyle(this[0])["height"]);
    }

    outerHeight(includeMargin?: boolean): number {
      if (includeMargin) {
        return (
          this.height() +
          parseInt(this.css("margin-top")) +
          parseInt(this.css("margin-bottom"))
        );
      }
      return this[0].offsetHeight;
    }

    /**
     * Returns the width of the first element of selected
     *
     */
    width(): number {
      return parseFloat(getComputedStyle(this[0])["width"]);
    }

    outerWidth(includeMargin?: boolean): number {
      if (includeMargin) {
        return (
          this.width() +
          parseInt(this.css("margin-left")) +
          parseInt(this.css("margin-right"))
        );
      }
      return this[0].offsetWidth;
    }

    /**
     * Stores some data for the first element of selected
     *
     */
    data(name: string | object, value?: string): string | void {
      return raj.data(this[0], name, value);
    }

    each(callback: Function): void {
      raj.each(this, callback);
    }
  }

  raj.expando = "raj" + Date.now();

  document[raj.expando] = {};

  raj.extend = (target: object, ...args: object[]) => {
    switch ([...args][0]) {
      case undefined:
        return Object.assign(raj, target);

      default:
        return Object.assign(target, ...args);
    }
    /*
      if ([...args][0] === undefined) {
        return Object.assign(raj, target);
      }
  
      return Object.assign(target, ...args);
      */
  };

  raj.noConflict = (removeAll?: boolean) => {
    switch (removeAll) {
      case true:
        window["$"] = window["jQuery"] = window["raj"] = undefined;
        break;

      case false:
        window["$"] = undefined;
    }
    //if (removeAll) window["raj"] = window["jQuery"] = window["$"] = undefined;
    //else window["$"] = undefined;

    return raj;
  };

  raj.data = (
    element: HTMLElement,
    name: string | object,
    value?: string
  ): string => {
    switch (value) {
      case undefined:
        switch (raj.cache[element[raj.expando]]) {
          case undefined:
            raj.cache[element[raj.expando]] = {};
            break;
        }
        switch (typeof name) {
          case "string":
            return raj.cache[element[raj.expando]][name];

          case "object":
            console.log(raj.cache[element[raj.expando]]);
            element[raj.expando] = ++raj.cache.latest;
            if (Object.keys(raj.cache[element[raj.expando]]).length === 0)
              //@ts-ignore
              return (raj.cache[element[raj.expando]] = name);
            return Object.assign(raj.cache[element[raj.expando]], name);

          /* 
            var values = Object.values(name);
              forEach(Object.keys(name), (key: string, i: number) => {
                raj.cache[element[raj.expando]][key] = values[i];
              });
               */

          default:
            break;
        }
        break;

      default:
        element[raj.expando] = ++raj.cache.latest;
        switch (raj.cache[element[raj.expando]]) {
          case undefined:
            raj.cache[element[raj.expando]] = {};
            break;
        }
        return (raj.cache[element[raj.expando]][name] = value);
    }
    /* 
      if (value !== undefined) {
        element[raj.expando] = ++raj.cache.latest;
        if (raj.cache[element[raj.expando]] === undefined)
          raj.cache[element[raj.expando]] = {};
        return (raj.cache[element[raj.expando]][name] = value);
      }
  
      if (typeof name === "string") {
        if (raj.cache[element[raj.expando]] === undefined)
          raj.cache[element[raj.expando]] = {};
        return raj.cache[element[raj.expando]][name];
      } else if (typeof name === "object") {
        element[raj.expando] = ++raj.cache.latest;
        if (raj.cache[element[raj.expando]] === undefined)
          raj.cache[element[raj.expando]] = {};
        var values = Object.values(name);
        forEach(Object.keys(name), (key: string, i: number) => {
          raj.cache[element[raj.expando]][key] = values[i];
        });
      }
      */
  };

  raj.removeData = (element: HTMLElement, name: string | object) => {
    switch (name) {
      case undefined:
        raj.cache[element[raj.expando]] = undefined;
        break;
    }
    /*
      if (name === undefined) {
        raj.cache[element[raj.expando]] = undefined;
      }
      */
    raj.cache[element[raj.expando]][name] = undefined;
  };

  raj.when = async (...deferreds: any[]) => {
    // @ts-ignore
    return Object.assign(...deferreds);
  };

  raj.cache = { latest: 0 };

  raj.now = Date.now;

  raj.parseJSON = JSON.parse;

  raj.inArray = (item: any, array: any[]): number => {
    return array.indexOf(item);
  };

  raj.isArray = (arr: any[]): boolean => {
    return Array.isArray(arr);
  };

  raj.isFunction = (fun: Function): boolean => {
    return typeof fun === "function";
  };

  raj.each = (array: any[], callback: Function): void => {
    forEach(array, (element: HTMLElement, index: number) => {
      callback(index, element);
    });
  };

  window["raj"] = window["jQuery"] = window["$"] = raj;
})();
