const convert = (points, close = false, radio = 0.88) => {
  if(points.length < 3) throw new Error('more than 2');
  const mid = (p1, p2) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });

  const dis = (p1, p2) => Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2));

  const inc = (p, vector, head, radio) => {
    console.log(radio);
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

  const as = [];
  for(let i = 1; i < points.length; i += 1) {
    as.push(mid(points[i - 1], points[i]));
  }
  const vectors = [];
  for(let i = 1; i < as.length; i += 1) {
    const arc = (as[i].y - as[i - 1].y) / (as[i].x - as[i - 1].x);
    const dp1 = dis(points[i - 1], points[i]);
    const dp2 = dis(points[i + 1], points[i]);
    const div = dp1 / (dp2 + dp1);
    const len = (as[i].x - as[i - 1].x);
    vectors.push({ arc, len, div });
  }
  const params = [];
  for(let i = 0; i < points.length - 1; i += 1) {
    const c = points[i];
    const n = points[i + 1];
    if(i === 0) {
      const v = vectors[0];
      const h = inc(n, v, true, radio);
      params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
    } else if(i === points.length - 2) {
      const v = vectors[i - 1];
      const h = inc(c, v, false, radio);
      params.push([c.x, c.y, h.x, h.y, h.x, h.y, n.x, n.y]);
    } else {
      const v1 = vectors[i - 1];
      const v2 = vectors[i];
      const h1 = inc(c, v1, false, radio);
      const h2 = inc(n, v2, true, radio);
      params.push([c.x, c.y, h1.x, h1.y, h2.x, h2.y, n.x, n.y]);
    }
  }
  return params;
};

(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.bezeir_inter = factory;
  }
}(this, convert));
