
Array.prototype.gt = function(inx) {
  const it = inx % this.length;
  if(it >= 0 ) return this[it];
  return this[this.length + it]
};

const convert = (points, close = false, radio = 0.88) => {
  if(points.length < 3) throw new Error('more than 2');
  const mid = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });

  const dis = (p1, p2) => Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));

  const inc = (p, vector, head, radio) => {
    // console.log(radio);
    let { x, y } = p;
    const { arc, div, len } = vector;
    if(head) {
      const ll = len * div * radio;
      x -= ll;
      y -= (ll * arc);
    } else {
      const ll = len * (1 - div) * radio;
      x += ll;
      y += (ll * arc);
    }
    return { x, y };
  };

  const midpoints = [];
  for(let i = 1; i <= points.length; i += 1) {
    midpoints.push(mid(points.gt(i - 1), points.gt(i)));
  }
  console.log(midpoints.length);
  console.log(midpoints);
  const vectors = [];
  for(let i = 0; i < midpoints.length; i += 1) {
    const arc = (midpoints.gt(i + 1).y - midpoints.gt(i).y) / (midpoints.gt(i + 1).x - midpoints.gt(i).x);
    // const dp1 = dis(points[i - 1], points[i]);
    // const dp2 = dis(points[i + 1], points[i]);
    // const div = dp1 / (dp2 + dp1);
    const div = 0.5;
    const len = (midpoints.gt(i + 1).x - midpoints.gt(i).x);
    vectors.push({ arc, len, div });
  }

  const params = [];
  const plen = close ? points.length : points.length - 1;
  for(let i = 0; i < plen; i += 1) {
    const c = points.gt(i);
    const n = points.gt(i + 1);
    if(close) {
      const v1 = vectors.gt(i - 1);
      const v2 = vectors.gt(i);
      const h1 = inc(c, v1, false, radio);
      const h2 = inc(n, v2, true, radio);
      params.push([c.x, c.y, h1.x, h1.y, h2.x, h2.y, n.x, n.y]);
    } else {
      if(i === 0) {
        const v = vectors[0];
        const h = inc(n, v, true, radio);
        params.push([c.x, c.y, c.x, c.y, h.x, h.y, n.x, n.y]);
      } else if(i === plen - 1) {
        const v = vectors.gt(i - 1);
        const h = inc(c, v, false, radio);
        params.push([c.x, c.y, h.x, h.y, n.x, n.y, n.x, n.y]);
      } else {
        const v1 = vectors.gt(i - 1);
        const v2 = vectors.gt(i);
        const h1 = inc(c, v1, false, radio);
        const h2 = inc(n, v2, true, radio);
        params.push([c.x, c.y, h1.x, h1.y, h2.x, h2.y, n.x, n.y]);
      }
    }
  }
  // return { midpoints, points: params };
  return params;
};

(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.bezeir_inter = factory;
  }
}(this, convert));
