/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {RED} from './red.js';

function loadNodeList() {
    $.ajax({
        headers: { "Accept":"application/json" },
        cache: false,
        url: 'http://localhost:1880/nodes',
        success: function(data) {
            // This will lead to nodes being appended to DOM via jQuery.
            // Apart from the DOM update,
            // TODO: this makes me sad
            RED.nodes.setNodeList(data);
            var nsCount = 0;
            for (var i=0;i<data.length;i++) {
                var ns = data[i];
                if (ns.module != "node-red") {
                    nsCount++;
                    // Issues asynch calls to retrieve specialized node localization files
                    RED.i18n.loadCatalog(ns.id, function() {
                        // should become a new action on its own
                        nsCount--;
                        if (nsCount === 0) {
                            loadNodes();
                        }
                    });
                }
            }
            if (nsCount === 0) {
                loadNodes();
            }
        }
    });
}

function loadNodes() {
    $.ajax({
        headers: { "Accept":"text/html" },
        cache: false,
        url: 'http://localhost:1880/nodes',
        success: function(data) {
            // dangerouslySetInnerHTML
            // https://facebook.github.io/react/docs/dom-elements.html#dangerouslysetinnerhtml
            $("body").append(data);

            // Update all placeholder elements with their localized content.
            // This is needed not only for the elements that are explicitly defined in the dom,
            // but more importantly, several of the nodes are defined in terms of i18n placeholders.
            // This actually uses http://i18next.com/ under the hood
            // Seems like this should be on the dangerous component componentDidMount() method
            $("body").i18n();

            // this can be safely done by react
            // $("#palette > .palette-spinner").hide();
            // $(".palette-scroll").removeClass("hide");
            // $("#palette-search").removeClass("hide");

            // becomes actioon trigger
            loadFlows();
        }
    });
}

function loadFlows() {
    $.ajax({
        headers: { "Accept":"application/json" },
        cache: false,
        url: 'flows/flow/7471fed2-f409-4f50-9634-d7fdf3581957',
        // url: 'http://localhost:1880/flows',
        success: function(nodes) {
            let data = JSON.parse(nodes);
            // console.log('got nodes', data, data.flow);
            nodes = data.flow;
            RED.nodes.version(null);
            RED.nodes.import(nodes);
            RED.nodes.dirty(false);
            RED.view.redraw(true);

            var currentHash = RED.__currentFlow;
            if (currentHash === RED.__currentFlow) {
              RED.workspaces.show(currentHash);
            }
        }
    });
}

function loadEditor()  {

    RED.palette.init();
    // RED.sidebar.init();
    RED.workspaces.init();
    // RED.clipboard.init();
    RED.view.init();
    RED.keyboard.init();

    // also requires tray to work
    RED.editor.init();

    $("#main-container").attr("style", "display: block !important");
    $(".header-toolbar").attr("style", "display: block !important");

    loadNodeList();
}

module.exports = {loadNodeList, loadNodes, loadFlows, loadEditor};
