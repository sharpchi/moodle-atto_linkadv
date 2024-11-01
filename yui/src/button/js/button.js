// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_linkadv
 * @author     Mark Sharp <mark.sharp@solent.ac.uk>
 * @copyright  2024 Southampton Solent University {@link www.solent.ac.uk}
 * @copyright  2017 University of Chichester {@link www.chi.ac.uk}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

 /**
  * @module moodle-atto_linkadv-button
  */

 /**
  * Atto text editor linkadv plugin.
  *
  * @namespace M.atto_linkadv
  * @class button
  * @extends M.editor_atto.EditorPlugin
  */

var COMPONENTNAME = 'atto_linkadv',
    TABS = {
        LINK: 'LINK',
        ADVANCED: 'ADVANCED'
    },
    // eslint-disable-next-line no-redeclare
    CSS = {
        NEWWINDOW: 'atto_linkadv_openinnewwindow',
        URLINPUT: 'atto_linkadv_urlentry',
        URLTEXT: 'atto_link_urltext',
        IDINPUT: 'atto_linkadv_identry',
        CLASSINPUT: 'atto_linkadv_classentry',
        LINK: TABS.LINK.toLowerCase(),
        ADVANCED: TABS.ADVANCED.toLowerCase(),
        LINKBROWSER: 'openlinkbrowser'
    },
    SELECTORS = {
        NEWWINDOW: '.' + CSS.NEWWINDOW,
        URLINPUT: '.' + CSS.URLINPUT,
        URLTEXT: '.' + CSS.URLTEXT,
        SUBMIT: '.submit',
        LINKBROWSER: '.' + CSS.LINKBROWSER,
        IDINPUT: '.' + CSS.IDINPUT,
        CLASSINPUT: '.' + CSS.CLASSINPUT
    },
    TEMPLATE = '' +
    '<form class="atto_form">' +
        '<ul class="root nav nav-tabs" role="tablist">' +
            '<li data-type="{{CSS.LINK}}" class="nav-item">' +
                '<a class="nav-link active" href="#{{elementid}}_{{CSS.LINK}}" role="tab" data-toggle="tab">' +
                    '{{get_string "link" component}}' +
                '</a>' +
            '</li>' +
            '<li data-type="{{CSS.ADVANCED}}" class="nav-item">' +
                '<a class="nav-link" href="#{{elementid}}_{{CSS.ADVANCED}}" role="tab" data-toggle="tab">' +
                    '{{get_string "advanced" component}}' +
                '</a>' +
            '</li>' +
        '</ul>' +
        '<div class="root tab-content">' +
            '<div data-type="{{CSS.LINK}}" class="tab-pane active" id="{{elementid}}_{{CSS.LINK}}">' +
                '<div class="mb-1">' +
                    '<label for="{{elementid}}_atto_linkadv_urltext">{{get_string "texttodisplay" component}}</label>' +
                    '<input class="form-control fullwidth {{CSS.URLTEXT}}" type="text" ' +
                    'id="{{elementid}}_atto_linkadv_urltext" size="32"/>' +
                '</div>' +
                '{{#if showFilepicker}}' +
                    '<label for="{{elementid}}_atto_linkadv_urlentry">{{get_string "enterurl" component}}</label>' +
                    '<div class="input-group input-append w-100 mb-1">' +
                        '<input class="form-control url {{CSS.URLINPUT}}" type="url" ' +
                        'id="{{elementid}}_atto_linkadv_urlentry"/>' +
                        '<span class="input-group-append">' +
                            '<button class="btn btn-secondary {{CSS.LINKBROWSER}}" type="button">' +
                            '{{get_string "browserepositories" component}}</button>' +
                        '</span>' +
                    '</div>' +
                '{{else}}' +
                    '<div class="mb-1">' +
                        '<label for="{{elementid}}_atto_linkadv_urlentry">{{get_string "enterurl" component}}</label>' +
                        '<input class="form-control fullwidth url {{CSS.URLINPUT}}" type="url" ' +
                        'id="{{elementid}}_atto_linkadv_urlentry" size="32"/>' +
                    '</div>' +
                '{{/if}}' +
                '<div class="form-check">' +
                    '<input type="checkbox" class="form-check-input {{CSS.NEWWINDOW}}" ' +
                        'id="{{elementid}}_{{CSS.NEWWINDOW}}"/>' +
                    '<label class="form-check-label" for="{{elementid}}_{{CSS.NEWWINDOW}}">' +
                    '{{get_string "openinnewwindow" component}}' +
                    '</label>' +
                '</div>' +
            '</div>' +
            '<div data-type="{{CSS.ADVANCED}}" class="tab-pane" id="{{elementid}}_{{CSS.ADVANCED}}">' +
                '<label for="{{elementid}}_{{CSS.IDINPUT}}">{{get_string "enterid" component}}</label>' +
                '<input class="form-control fullwidth {{CSS.IDINPUT}}" type="text" id="{{elementid}}_{{CSS.IDINPUT}}" />' +
                '<label for="{{elementid}}_{{CSS.CLASSINPUT}}">{{get_string "enterclass" component}}</label>' +
                '<input class="form-control fullwidth {{CSS.CLASSINPUT}}" ' +
                    'type="text" id="{{elementid}}_{{CSS.CLASSINPUT}}" />' +
            '</div>' +
        '</div>' +
        '<div class="mdl-align">' +
            '<br/>' +
            '<button class="btn btn-secondary submit" type="submit">{{get_string "createlink" component}}</button>' +
        '</div>' +
    '</form>';

Y.namespace('M.atto_linkadv').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,

    /**
     * Text to display has value or not.
     * @property _hasTextToDisplay
     * @type Boolean
     * @private
     */
    _hasTextToDisplay: false,

    /**
     * User has selected plain text or not.
     * @property _hasPlainTextSelected
     * @type Boolean
     * @private
     */
    _hasPlainTextSelected: false,

    initializer: function() {
        // Add the link button first.
        this.addButton({
            icon: 'e/insert_edit_link',
            keys: '75',
            callback: this._displayDialogue,
            tags: 'a',
            tagMatchRequiresAll: false
        });

        // And then the unlink button.
        this.addButton({
            buttonName: 'unlink',
            callback: this._unlink,
            icon: 'e/remove_link',
            title: 'unlink',

            // Watch the following tags and add/remove highlighting as appropriate:
            tags: 'a',
            tagMatchRequiresAll: false
        });
    },
    /**
     * Display the link editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
        if (this._currentSelection === false) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('createlink', COMPONENTNAME),
            focusAfterHide: true,
            width: 360,
            focusOnShowSelector: SELECTORS.URLINPUT
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent());

        // Resolve anchors in the selected text.
        this._resolveAnchors();
        dialogue.show();
    },
    /**
     * If there is selected text and it is part of an anchor link,
     * extract the url (and target) from the link (and set them in the form).
     *
     * @method _resolveAnchors
     * @private
     */
    _resolveAnchors: function() {
        // Find the first anchor tag in the selection.
        var selectednode = this.get('host').getSelectionParentNode(),
            anchornodes,
            anchornode,
            url,
            target,
            id,
            aclass,
            textToDisplay,
            title;

        // Note this is a document fragment and YUI doesn't like them.
        if (!selectednode) {
            return;
        }

        anchornodes = this._findSelectedAnchors(Y.one(selectednode));
        if (anchornodes.length > 0) {
            anchornode = anchornodes[0];
            this._currentSelection = this.get('host').getSelectionFromNode(anchornode);
            url = anchornode.getAttribute('href');
            target = anchornode.getAttribute('target');
            textToDisplay = anchornode.get('innerText');
            title = anchornode.getAttribute('title');
            id = anchornode.getAttribute('id');
            aclass = anchornode.getAttribute('class');
            if (url !== '') {
                this._content.one(SELECTORS.URLINPUT).setAttribute('value', url);
            }
            if (textToDisplay !== '') {
                this._content.one(SELECTORS.URLTEXT).set('value', textToDisplay);
            } else if (title !== '') {
                this._content.one(SELECTORS.URLTEXT).set('value', title);
            }
            if (target === '_blank') {
                this._content.one(SELECTORS.NEWWINDOW).setAttribute('checked', 'checked');
            } else {
                this._content.one(SELECTORS.NEWWINDOW).removeAttribute('checked');
            }
            if (id !== '') {
                if (id.startsWith('yui_')) {
                    id = '';
                }
                this._content.one(SELECTORS.IDINPUT).setAttribute('value', id);
            }
            if (aclass !== '') {
                this._content.one(SELECTORS.CLASSINPUT).setAttribute('value', aclass);
            }
        } else {
            // User is selecting some text before clicking on the Link button.
            textToDisplay = this._getTextSelection();
            if (textToDisplay !== '') {
                this._hasTextToDisplay = true;
                this._hasPlainTextSelected = true;
                this._content.one(SELECTORS.URLTEXT).set('value', textToDisplay);
            }
        }
    },

    /**
     * Update the dialogue after a link was selected in the File Picker.
     *
     * @method _filepickerCallback
     * @param {object} params The parameters provided by the filepicker
     * containing information about the link.
     * @private
     */
    _filepickerCallback: function(params) {
        this.getDialogue()
                .set('focusAfterHide', null)
                .hide();

        if (params.url !== '') {
            // Add the link.
            this._setLinkOnSelection(params.url, '', '');

            // And mark the text area as updated.
            this.markUpdated();
        }
    },

    /**
     * The link was inserted, so make changes to the editor source.
     *
     * @method _setLink
     * @param {EventFacade} e
     * @private
     */
    _setLink: function(e) {
        var input,
            value,
            id,
            idvalue,
            aclass,
            aclassvalue;

        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        input = this._content.one(SELECTORS.URLINPUT);
        value = input.get('value');

        id = this._content.one(SELECTORS.IDINPUT);
        idvalue = id.get('value');

        aclass = this._content.one(SELECTORS.CLASSINPUT);
        aclassvalue = aclass.get('value');
        if (idvalue.startsWith('yui_')) {
            idvalue = '';
        }
        if (idvalue !== '') {
            // The id value should not have any spaces.
            idvalue = idvalue.trim();
            idvalue = idvalue.replace(/ /g, '-');
            if (value === '') {
                value = '#' + idvalue;
            }
        }

        if (aclassvalue !== '' && value === '') {
            value = '#'; // Add a dummy value for now.
        }

        if (value !== '') {

            // We add a prefix if it is not already prefixed.
            value = value.trim();
            var expr = new RegExp(/^[a-zA-Z]*\.*\/|^#|^[a-zA-Z]*:/);
            if (!expr.test(value)) {
                value = 'http://' + value;
            }

            // Add the link.
            this._setLinkOnSelection(value, idvalue, aclassvalue);

            this.markUpdated();
        }
    },

    /**
     * Final step setting the anchor on the selection.
     *
     * @private
     * @method _setLinkOnSelection
     * @param  {String} url URL the link will point to.
     * @param  {String} id ID of the link
     * @param  {String} aclass Anchor class(es)
     * @return {Node} The added Node.
     */
    _setLinkOnSelection: function(url, id, aclass) {
        var host = this.get('host'),
            link,
            selectednode,
            target,
            anchornodes,
            isUpdating,
            urlText,
            textToDisplay;

        this.editor.focus();
        host.setSelection(this._currentSelection);
        isUpdating = !this._currentSelection[0].collapsed;
        urlText = this._content.one(SELECTORS.URLTEXT);
        textToDisplay = urlText.get('value').replace(/(<([^>]+)>)/gi, "").trim();
        if (textToDisplay === '') {
            textToDisplay = url;
        }

        if (!isUpdating) {
            // Firefox cannot add links when the selection is empty so we will add it manually.
            link = Y.Node.create('<a>' + textToDisplay + '</a>');
            link.setAttribute('href', url);
            link.setAttribute('id', id);
            link.setAttribute('class', aclass);
            // Add the node and select it to replicate the behaviour of execCommand.
            selectednode = host.insertContentAtFocusPoint(link.get('outerHTML'));
            host.setSelection(host.getSelectionFromNode(selectednode));
        } else {
            if (Y.UA.gecko > 0) {
                // For Firefox / Gecko we need to wrap the selection in a span so we can surround it with an anchor.
                // This relates to https://bugzilla.mozilla.org/show_bug.cgi?id=1906559.
                var originalSelection = document.getSelection();
                var wrapper = document.createElement('span');
                wrapper.setAttribute('data-wrapper', '');
                wrapper.style.display = 'inline';

                var i;
                for (i = 0; i < originalSelection.rangeCount; i++) {
                    originalSelection.getRangeAt(i).surroundContents(wrapper);
                }
                host.setSelection(host.getSelectionFromNode(Y.one(wrapper)));

                document.execCommand('unlink', false, null);
                document.execCommand('createLink', false, url);

                var anchorNode = wrapper.parentNode;
                wrapper.children.forEach(function(child) {
                    anchorNode.appendChild(child);
                });
                wrapper.remove();

            } else {
                document.execCommand('unlink', false, null);
                document.execCommand('createLink', false, url);
            }

            // Now set the target.
            selectednode = host.getSelectionParentNode();
        }

        // Note this is a document fragment and YUI doesn't like them.
        if (!selectednode) {
            return;
        }

        anchornodes = this._findSelectedAnchors(Y.one(selectednode));
        // Add new window attributes if requested.
        Y.Array.each(anchornodes, function(anchornode) {
            target = this._content.one(SELECTORS.NEWWINDOW);
            if (target.get('checked')) {
                anchornode.setAttribute('target', '_blank');
            } else {
                anchornode.removeAttribute('target');
            }
            if (isUpdating && textToDisplay) {
                // The 'createLink' command do not allow to set the custom text to display. So we need to do it here.
                if (this._hasPlainTextSelected) {
                    // Only replace the innerText if the user has not selected any element or just the plain text.
                    anchornode.set('innerText', textToDisplay);
                } else {
                    // The user has selected another element to add the hyperlink, like an image.
                    // We should add the title attribute instead of replacing the innerText of the hyperlink.
                    anchornode.setAttribute('title', textToDisplay);
                }
            }

            if (id !== '') {
                anchornode.setAttribute('id', id);
            } else {
                anchornode.removeAttribute('id');
            }

            if (aclass !== '') {
                anchornode.setAttribute('class', aclass);
            } else {
                anchornode.removeAttribute('class');
            }
        }, this);
    },

    /**
     * Look up and down for the nearest anchor tags that are least partly contained in the selection.
     *
     * @method _findSelectedAnchors
     * @param {Node} node The node to search under for the selected anchor.
     * @return {Node|Boolean} The Node, or false if not found.
     * @private
     */
    _findSelectedAnchors: function(node) {
        var tagname = node.get('tagName'),
            hit, hits;

        // Direct hit.
        if (tagname && tagname.toLowerCase() === 'a') {
            return [node];
        }

        // Search down but check that each node is part of the selection.
        hits = [];
        node.all('a').each(function(n) {
            if (!hit && this.get('host').selectionContainsNode(n)) {
                hits.push(n);
            }
        }, this);
        if (hits.length > 0) {
            return hits;
        }
        // Search up.
        hit = node.ancestor('a');
        if (hit) {
            return [hit];
        }
        return [];
    },

    /**
     * Generates the content of the dialogue.
     *
     * @method _getDialogueContent
     * @return {Node} Node containing the dialogue content
     * @private
     */
    _getDialogueContent: function() {
        var canShowFilepicker = this.get('host').canShowFilepicker('link'),
            template = Y.Handlebars.compile(TEMPLATE);

        this._content = Y.Node.create(template({
            showFilepicker: canShowFilepicker,
            component: COMPONENTNAME,
            CSS: CSS
        }));

        this._content.one(SELECTORS.URLINPUT).on('keyup', this._updateTextToDisplay, this);
        this._content.one(SELECTORS.URLINPUT).on('change', this._updateTextToDisplay, this);
        this._content.one(SELECTORS.URLTEXT).on('keyup', this._setTextToDisplayState, this);
        this._content.one(SELECTORS.SUBMIT).on('click', this._setLink, this);
        if (canShowFilepicker) {
            this._content.one(SELECTORS.LINKBROWSER).on('click', function(e) {
                e.preventDefault();
                this.get('host').showFilepicker('link', this._filepickerCallback, this);
            }, this);
        }

        return this._content;
    },

    /**
     * Gets the root context for all templates, with extra supplied context.
     *
     * @method _getContext
     * @param  {Object} extra The extra context to add
     * @return {Object}
     * @private
     */
    _getContext: function(extra) {
        var canShowFilepicker = this.get('host').canShowFilepicker('link');
        return Y.merge({
            elementid: this.get('host').get('elementid'),
            component: COMPONENTNAME,
            showFilepicker: canShowFilepicker,
            CSS: CSS
        }, extra);
    },
    /**
     * Unlinks the current selection.
     * If the selection is empty (e.g. the cursor is placed within a link),
     * then the whole link is unlinked.
     *
     * @method _unlink
     * @private
     */
    _unlink: function() {
        var host = this.get('host'),
            range = host.getSelection();

        if (range && range.length) {
            if (range[0].startOffset === range[0].endOffset) {
                // The cursor was placed in the editor but there was no selection - select the whole parent.
                var nodes = host.getSelectedNodes();
                if (nodes) {
                    // We need to unlink each anchor individually - we cannot select a range because it may only consist of a
                    // fragment of an anchor. Selecting the parent would be dangerous because it may contain other links which
                    // would then be unlinked too.
                    nodes.each(function(node) {
                        // We need to select the whole anchor node for this to work in some browsers.
                        // We only need to search up because getSelectedNodes returns all Nodes in the selection.
                        var anchor = node.ancestor('a', true);
                        if (anchor) {
                            // Set the selection to the whole of the first anchor.
                            host.setSelection(host.getSelectionFromNode(anchor));

                            // Call the browser unlink.
                            document.execCommand('unlink', false, null);
                        }
                    }, this);

                    // And mark the text area as updated.
                    this.markUpdated();
                }
            } else {
                // Call the browser unlink.
                document.execCommand('unlink', false, null);

                // And mark the text area as updated.
                this.markUpdated();
            }
        }
    },
     /**
     * Set the current text to display state.
     *
     * @method _setTextToDisplayState
     * @private
     */
     _setTextToDisplayState: function() {
        var urlText,
            urlTextVal;
        urlText = this._content.one(SELECTORS.URLTEXT);
        urlTextVal = urlText.get('value');
        if (urlTextVal !== '') {
            this._hasTextToDisplay = true;
        } else {
            this._hasTextToDisplay = false;
        }
    },
    /**
     * Update the text to display if the user does not provide the custom text.
     *
     * @method _updateTextToDisplay
     * @private
     */
    _updateTextToDisplay: function() {
        var urlEntry,
            urlText,
            urlEntryVal;
        urlEntry = this._content.one(SELECTORS.URLINPUT);
        urlText = this._content.one(SELECTORS.URLTEXT);
        urlEntryVal = urlEntry.get('value');
        if (!this._hasTextToDisplay) {
            urlText.set('value', urlEntryVal);
        }
    },

    /**
     * Get only the selected text.
     * In some cases, window.getSelection() is not run as expected. We should only get the text value
     * For ex: <img src="" alt="XYZ">Some text here
     *          window.getSelection() will return XYZSome text here
     *
     * @returns {string} Selected text
     * @private
     */
    _getTextSelection: function() {
        var selText = '';
        var sel = window.getSelection();
        var rangeCount = sel.rangeCount;
        if (rangeCount) {
            var rangeTexts = [];
            for (var i = 0; i < rangeCount; ++i) {
                rangeTexts.push('' + sel.getRangeAt(i));
            }
            selText = rangeTexts.join('');
        }
        return selText;
    }
});
