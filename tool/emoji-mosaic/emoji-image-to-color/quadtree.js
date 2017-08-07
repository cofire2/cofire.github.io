/**
 * Create a quadtree.
 *
 * @constructor
 */
quadtree = function(data) {
	var x = function(d) { return d[0] }, y = function(d) { return d[1] };
	/**
	 * Bind data to the quadtree.
	 *
	 * @param  {Array} data An array of points.
	 */
	function quadtree(data) {
		var d,
		    /**
		     * An incrementer for looping over data.
		     */
		    i,
		    /**
		     * Length of data array.
		     */
		    n,
		    /**
		     * Low x-bound for the tree.
		     */
		    x1_,
		    /**
		     * Low y-bound for the tree.
		     */
		    y1_,
		    /**
		     * High x-bound for the tree.
		     */
		    x2_,
		    /**
		     * High y-bound for the tree.
		     */
		    y2_;
		x2_ = y2_ = -(x1_ = y1_ = Infinity);
		n = data.length;
		// Loop through all data,
		// pushing the bounds of the quadtree
		for (i = 0; i < n; ++i) {
			var x_ = x(d = data[i]), y_ = y(d);
			if (x_ < x1_) x1_ = x_;
			if (y_ < y1_) y1_ = y_;
			if (x_ > x2_) x2_ = x_;
			if (y_ > y2_) y2_ = y_;
		}
		var dx = x2_ - x1_, dy = y2_ - y1_;
		// The quadtree bounds must be a perfect square for slicing up into subsquares.
		if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
		/**
		 * Insert a point into a node.
		 *
		 * @protected
		 *
		 * @param  {[type]} n  Node.
		 * @param  {Array} d   The x,y coordinates of the point.
		 * @param  {[type]} x  [description]
		 * @param  {[type]} y  [description]
		 * @param  {[type]} x1 Left x bound of the node.
		 * @param  {[type]} y1 [description]
		 * @param  {[type]} x2 [description]
		 * @param  {[type]} y2 [description]
		 * @return {[type]}    [description]
		 */
		function insert(n, d, x, y, x1, y1, x2, y2) {
			if (isNaN(x) || isNaN(y)) return;
			if (n.leaf) {
				var nx = n.x, ny = n.y;
				// If the leaf node already has a point in it.
				if (nx != null) {
					// If the points are exactly the same, create another node with the
					// same point one level deep.
					if (Math.abs(nx - x) + Math.abs(ny - y) < .01) {
						insertChild(n, d, x, y, x1, y1, x2, y2);
					} else {
						// Separate the two points into two child nodes.
						var nPoint = n.point;
						n.x = n.y = n.point = null;
						insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
						insertChild(n, d, x, y, x1, y1, x2, y2);
					}
				} else {
					// If the node doesn't have a point yet, set the point.
					n.x = x, n.y = y, n.point = d;
				}
			} else {
				insertChild(n, d, x, y, x1, y1, x2, y2);
			}
		}
		/**
		 * Insert a point as a child of a node, creating child nodes as necessary.
		 *
		 * @param  {[type]} n  [description]
		 * @param  {[type]} d  [description]
		 * @param  {[type]} x  [description]
		 * @param  {[type]} y  [description]
		 * @param  {[type]} x1 [description]
		 * @param  {[type]} y1 [description]
		 * @param  {[type]} x2 [description]
		 * @param  {[type]} y2 [description]
		 * @return {[type]}    [description]
		 */
		function insertChild(n, d, x, y, x1, y1, x2, y2) {
			// Decide which child node the point falls in.
			var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
			n.leaf = false;
			n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
			if (right) x1 = xm; else x2 = xm;
			if (below) y1 = ym; else y2 = ym;
			insert(n, d, x, y, x1, y1, x2, y2);
		}
		// The quadtree.
		var root = d3_geom_quadtreeNode();
		/**
		 * Add a point to the quadtree.
		 *
		 * @param {[type]} d [description]
		 */
		root.add = function(d) {
			// Increment points tally.
			i++;
			insert(root, d, d[0], d[1], x1_, y1_, x2_, y2_);
		};
		/**
		 * Visit each node in the quadtree invoking a function in every context.
		 *
		 * @param  {[type]} f [description]
		 * @return {[type]}   [description]
		 */
		root.visit = function(f) {
			d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
		};
		/**
		 * Find the closest point in the tree to another point.
		 *
		 * @param  {Array} point x,y coordinates to search against.
		 * @return {Array}       The closest point.
		 */
		root.find = function(point) {
			return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
		};
		i = -1;
		// Loop through the supplied nodes and insert them into the Quadtree.
		while (++i < n) {
			insert(root, data[i], data[i][0], data[i][1], x1_, y1_, x2_, y2_);
		}
		data = d = null;
		return root;
	}
	quadtree.x = function(_) {
		return arguments.length ? (x = _, quadtree) : x;
	};
	quadtree.y = function(_) {
		return arguments.length ? (y = _, quadtree) : y;
	};
	return quadtree(data);
};
/**
 * Create a quadtree node.
 *
 * @return {[type]} [description]
 */
function d3_geom_quadtreeNode() {
	return {
		leaf: true,
		nodes: [],
		point: null,
		x: null,
		y: null
	};
}
/**
 * Visit a node with a callback function, recursing through
 * child nodes as long as the callback doesn't return true.
 *
 * @param  {[type]} f    [description]
 * @param  {[type]} node [description]
 * @param  {[type]} x1   [description]
 * @param  {[type]} y1   [description]
 * @param  {[type]} x2   [description]
 * @param  {[type]} y2   [description]
 * @return {[type]}      [description]
 */
function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
	if (!f(node, x1, y1, x2, y2)) {
		var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
		if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
		if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
		if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
		if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
	}
}
/**
 * Given an x,y coordinate, find the closest point in the quadtree.
 *
 * @param  {[type]} root [description]
 * @param  {[type]} x    [description]
 * @param  {[type]} y    [description]
 * @param  {[type]} x0   [description]
 * @param  {[type]} y0   [description]
 * @param  {[type]} x3   [description]
 * @param  {[type]} y3   [description]
 * @return {[type]}      [description]
 */
function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
	/**
	 * The minimum distance found to the coordinates.
	 * @type {Number}
	 */
	var minDistance2 = Infinity,
	/**
	 * The closest point found to the coordinates.
	 */
	closestPoint;
	/**
	 * Given a node
	 *
	 * @param  {[type]} node [description]
	 * @param  {Ingeger} x1   Lower x bound to search within.
	 * @param  {Ingeger} y1   Lower y bound to search within.
	 * @param  {Ingeger} x2   Upper x bound to search within.
	 * @param  {Ingeger} y2   Upper y bound to search within.
	 * @return {Array}      [description]
	 */
	(function find(node, x1, y1, x2, y2) {
		if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
		// If the node has a point associated with it.
		if (point = node.point) {
			// Calculate the distance between the node and the coordinates.
			var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
			// If the disance between the two is less than already found,
			// track that.
			if (distance2 < minDistance2) {
				var distance = Math.sqrt(minDistance2 = distance2);
				x0 = x - distance, y0 = y - distance;
				x3 = x + distance, y3 = y + distance;
				closestPoint = point;
			}
		}
		// Figure out what child node the coordinates fall in.
		var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
		// Recurse through child nodes.
		// Initialize i at the closest child node to the coordinates.
		for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
			if (node = children[i & 3]) switch (i & 3) {
			 case 0:
				find(node, x1, y1, xm, ym);
				break;

			 case 1:
				find(node, xm, y1, x2, ym);
				break;

			 case 2:
				find(node, x1, ym, xm, y2);
				break;

			 case 3:
				find(node, xm, ym, x2, y2);
				break;
			}
		}
	})(root, x0, y0, x3, y3);
	return closestPoint;
}