﻿import $ = require("jquery")

class Nav {
    private selector: string
    private views = {}
    private currentView: Element
    private callbacks = {}

    constructor(selector: string) {
        // @selector the selector for all divs which represent a separate view

        this.selector = selector
        // add each div to dictionary
        var hash = location.hash != "" && location.hash != undefined ? location.hash.match(/#[\w]+/)[0] : ""
        $(this.selector).each((i, e) => {
            var id = "#" + e.getAttribute("id")
            this.views[id] = e
            // initialize the callback array for each view
            this.callbacks[id] = []
            // if there is a hash in the url
            //location.hash shouldn't be null but just to be safe keep it in condidtional
            if (hash != "" && hash != null) {
                if (id == hash) {
                    this.currentView = e
                    $(e).show()
                } else {
                    $(e).hide()
                }
                // if there isn't a hash
            } else {
                if (i != 0) {
                    // hide all but the first view
                    $(e).hide()
                }
                if (i == 0) {
                    this.currentView = e
                    $(e).show()
                }
            }
        })


        // on hashchange, navigate to corresponding view
        $(window).on("hashchange", (e) => {
            
            var hash = e.target['location'].hash
            console.log(hash, this.callbacks, this.views)
            // hide old view
            $(this.currentView).hide()
            // set new view and show
            this.currentView = this.views[hash]
            $(this.currentView).show()
            // run all the callbacks for this location
            if (this.callbacks[hash]) {
                this.callbacks[hash].forEach((fn) => {
                    fn()
                })
            }

        })
    }
    /**
    *@hashLoc the hash location to navigate to
    */
    navigateTo(hashLoc: string): void {
        if (this.views[hashLoc]) {
            var base = document.URL.split("#")[0]
            location.assign(base + hashLoc)
            console.log("navigating to: ", hashLoc)
        } else {
            return;
        }
    }
    addCallback(location: string, cb: Function) {
        this.callbacks[location].push(cb)
    }
}

export = Nav 