/* ------------------------------------------------------------------------------------------------------------------------------ 
 * Simple Tab - SimTab
 * Simple jQuery plugin to create quick and easy content tabs - Light weight and easy to modify.
 * Copyright (c) 219 - SikTec, Inc. All Rights Reserved.
 * Author : Shlomo Hassid, Shlomohassid@gmail.com
 * Created : Feb, 2020.
 * Version : 1.0.1
 * ------------------------------------------------------------------------------------------------------------------------------
 * Example Usage:
 * <div id="simTab1" class="st_main">
 * <ul class="st_tabs">
 *   <li data-link="1" class="st_show">Tab 1</li>
 *   <li data-link="2">Tab 2</li>
 *   <li data-link="3">Tab 3</li>
 *   <li data-link="4">Tab 4</li>
 * </ul>
 * <ul class="st_content">
 *   <li data-link="1">111 Phasellus eget leo auctor</li>
 *   <li data-link="2">222 Phasellus ultrices euismod.</li>
 *   <li data-link="3">333 Phasellus ultrices augue.</li>
 *   <li data-link="4">444 Phasellus ultrices augue nunc.</li>
 * </ul>
 * <div class="clearfix"></div>
 * </div>
   *
 * $("#simTab1").simTab({ 
 *     width : 600, 
 *     height : 550, 
 *     mainContentPadding : 15,
 *     animDuration : { content : 250, tab : 150 },
 *     tabSizing : { paddingLeft : 30, paddingRight : 30, paddingTop : 30, paddingBottom : 30 },
 *     tabDesign : {
 *       background : ["#ffd7a0","#dca9ff","#ffd7a0","#dca9ff"],
 *       color  		 : ["black"],
 *       fontSize   : [14],
 *       padding		 : [5],
 *       fontWeight : ["bold"],
 *       border     : ["1px solid black"],
 *     },
 *     contentDesign : {
 *         background : "white",
 *         border     : "1px solid black"
 *       }
 * });
 */

// simgal Obj:
;(function($, window, document, undefined) {
  var pluginName = 'simTab',
    defaults = {
      width : 600, 
      height : 550, 
      mainContentPadding : 10,
      animDuration : { content : 250, tab : 150 },
      tabSizing : { paddingLeft : 30, paddingRight : 30, paddingTop : 30, paddingBottom : 30 },
      tabDesign : {
        background : [""],
        color  		 : [""],
        padding    : [""],
        fontSize   : [""],
        fontWeight : [""],
        border     : ["1px solid black"],
      },
      contentDesign : {
        background : "",
        border     : "1px solid black"
      }
    },
    struct = {
      ele_main: null,
      ele_tabs_container: null,
      ele_tabs: null,
      ele_content_container: null,
      ele_content: null
    };
  // The plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._struct = struct;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.init = function() {
    let mainThis = this;
    //Create struct:
    this._struct.ele_main = this.$element;
    this._struct.ele_tabs_container = this.$element.find(".st_tabs");
    this._struct.ele_tabs = this._struct.ele_tabs_container.find("li");
    this._struct.ele_content_container = this.$element.find(".st_content");
    this._struct.ele_content = this._struct.ele_content_container.find("li");
    //Set content area:
    this._struct.ele_content_container.css(this.options.contentDesign);
    //Set content width:
    this._struct.ele_main.css({ width : this.options.width });
    this._struct.ele_content.css({
    	width: this._struct.ele_content_container.width() - this.options.mainContentPadding*2
    });
    //Calc Size of main content:
    let tallestContent = 0;
    this._struct.ele_content.each(function(i,ele){
    	if (ele.scrollHeight > tallestContent) tallestContent = ele.scrollHeight;
    });
    //Set sizes claculated:
    this._struct.ele_content_container.css({
      height: tallestContent,
      padding: this.options.mainContentPadding
    });
    //Expose only selected:
    let selected = this._struct.ele_tabs_container.find("li.st_show");
    if (selected.length == 0) {
    	selected = this._struct.ele_tabs.eq(0).addClass("st_show").data("link");
    } else {
    	selected = selected.eq(0).data("link");
    }
    this._struct.ele_content.not("[data-link="+selected+"]").each(function(){
    	$(this).hide();
    });
    //Set Tabs:
    this._struct.ele_tabs.each(function(i, tab){
    	let attributes = ["background","color","padding","fontSize","fontWeight","border"];
      let design = {};
      $.each(attributes, function(j, attr) {
      	design[attr] = (mainThis.options.tabDesign[attr].length > i)
                        ? mainThis.options.tabDesign[attr][i]
                        : mainThis.options.tabDesign[attr][mainThis.options.tabDesign[attr].length-1];
      });
      $(this).css(design);
    });
		
    
    //Attach click to switch images
    this._struct.ele_tabs.on("click", function(e) {
      e.preventDefault();
      if ($(this).hasClass("st_show")) return;
      //Remove all fadeInClass:
      mainThis._struct.ele_tabs.removeClass("st_show");
      $(this).addClass("st_show");
      //Get target:
      let link = $(this).data("link");
      //Hide all content and expose the target one:
      mainThis._struct.ele_content.fadeOut(mainThis.options.animDuration.content);
      mainThis._struct.ele_content_container.find("li[data-link=" + link + "]").fadeIn(mainThis.options.animDuration.content);
    });

  };
  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
          new Plugin(this, options));
      }
    });
  }

})(jQuery, window, document);