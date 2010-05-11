var DynamicTableToggleView = function DynamicTableToggleView(options, controller, parentView) {
  this.currentMode = DynamicTableToggleView.up;
  this.options = {
    collapse : function() {
    },
    expand : function() {
    },
    expanded : false
  };
  jQuery.extend(this.options, options);
  this.controller = controller;
  this.parentView = parentView;
  this.button = null;
  this.initialize();
};

DynamicTableToggleView.prototype = new ViewPart();

DynamicTableToggleView.collapsed = 1;
DynamicTableToggleView.expanded = 2;

DynamicTableToggleView.prototype._getCell = function(cell) {
  if(typeof cell === "number") {
    return this.parentView.getRow().getCell(cell);
  } else {
    return this.parentView.getRow().getCellByName(cell);
  }
};

DynamicTableToggleView.prototype.render = function() {
  if(this.parentView instanceof DynamicTableCell) {
    if(this.options.targetCell) {
      this.targetViews = [this._getCell(this.options.targetCell)];
    } else if(this.options.targetCells) {
      this.targetViews = [];
      for(var i = 0, len = this.options.targetCells.length; i < len; i++) {
        this.targetViews.push(this._getCell(this.options.targetCells[i]));
      }
    }
  }
  if (this.options.expanded) {
    this.expand();
  } else {
    this.collapse();
  }
};

DynamicTableToggleView.prototype.initialize = function() {
  this.button = $("<div />").appendTo(this.parentView.getElement());
  var me = this;
  this.button.click(function(event) {
    if (me.button.hasClass("dynamictable-expand")) {
      me.expand();
    } else {
      me.collapse();
    }
    return false;
  });
  this.element = this.button;
};
DynamicTableToggleView.prototype.showCollapsed = function() {
  this.button.attr("title", "Expand").removeClass("dynamictable-collapse")
      .addClass("dynamictable-expand");
  this.currentMode = DynamicTableToggleView.collapsed;
};
DynamicTableToggleView.prototype.collapse = function() {
  this.showCollapsed();
  if(this.targetViews) {
    for(var i = 0, len = this.targetViews.length; i < len; i++) {
      this.targetViews[i].hide();
    }
  }
  if(this.options.collapse) {
    this.options.collapse.call(this.controller, this);
  }
};
DynamicTableToggleView.prototype.showExpanded = function() {
  this.button.attr("title", "Collapse").addClass("dynamictable-collapse")
      .removeClass("dynamictable-expand");
  this.currentMode = DynamicTableToggleView.expanded;
};
DynamicTableToggleView.prototype.expand = function() {
  this.showExpanded();
  if(this.targetViews) {
    for(var i = 0, len = this.targetViews.length; i < len; i++) {
      this.targetViews[i].render();
      this.targetViews[i].show();
    }
  }
  if(this.options.expand) {
    this.options.expand.call(this.controller, this);
  }
};
