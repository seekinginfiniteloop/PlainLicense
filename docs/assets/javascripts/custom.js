"use strict";
(() => {
  var go = Object.create;
  var Ar = Object.defineProperty;
  var wo = Object.getOwnPropertyDescriptor;
  var So = Object.getOwnPropertyNames,
    et = Object.getOwnPropertySymbols,
    Eo = Object.getPrototypeOf,
    tt = Object.prototype.hasOwnProperty,
    Oo = Object.prototype.propertyIsEnumerable;
  var rt = (e, r, t) =>
      r in e
        ? Ar(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t })
        : (e[r] = t),
    Je = (e, r) => {
      for (var t in r || (r = {})) tt.call(r, t) && rt(e, t, r[t]);
      if (et) for (var t of et(r)) Oo.call(r, t) && rt(e, t, r[t]);
      return e;
    };
  var Me = (e, r) => () => (
    r || e((r = { exports: {} }).exports, r), r.exports
  );
  var To = (e, r, t, o) => {
    if ((r && typeof r == "object") || typeof r == "function")
      for (let n of So(r))
        !tt.call(e, n) &&
          n !== t &&
          Ar(e, n, {
            get: () => r[n],
            enumerable: !(o = wo(r, n)) || o.enumerable,
          });
    return e;
  };
  var ot = (e, r, t) => (
    (t = e != null ? go(Eo(e)) : {}),
    To(
      r || !e || !e.__esModule
        ? Ar(t, "default", { value: e, enumerable: !0 })
        : t,
      e
    )
  );
  var De = Me((Z) => {
    (function () {
      var e, r, t, o, n, i, u, s, f, a, c, p, l, v, h, m, x, w, E, H;
      (H = 150),
        (a = 20),
        (E = 150),
        (f = 0.75),
        (Z.score = function (d, b, S) {
          var T, y, g, _;
          return (
            (y = S.preparedQuery),
            (T = S.allowErrors),
            T || n(d, y.core_lw, y.core_up)
              ? ((_ = d.toLowerCase()), (g = r(d, _, y)), Math.ceil(g))
              : 0
          );
        }),
        (Z.isMatch = n =
          function (d, b, S) {
            var T, y, g, _, W, z, C;
            if (((g = d.length), (_ = b.length), !g || _ > g)) return !1;
            for (T = -1, y = -1; ++y < _; ) {
              for (
                W = b.charCodeAt(y), z = S.charCodeAt(y);
                ++T < g && ((C = d.charCodeAt(T)), !(C === W || C === z));

              );
              if (T === g) return !1;
            }
            return !0;
          }),
        (Z.computeScore = r =
          function (d, b, S) {
            var T,
              y,
              g,
              _,
              W,
              z,
              C,
              U,
              M,
              N,
              V,
              re,
              Q,
              ue,
              de,
              te,
              ye,
              fe,
              Er,
              Ae,
              Ke,
              Or,
              Tr,
              _r;
            if (
              ((de = S.query),
              (te = S.query_lw),
              (N = d.length),
              (Q = de.length),
              (T = c(d, b, de, te)),
              (y = T.score),
              T.count === Q)
            )
              return v(Q, N, y, T.pos);
            if (((ue = b.indexOf(te)), ue > -1))
              return h(d, b, de, te, ue, Q, N);
            for (
              Ae = new Array(Q),
                W = new Array(Q),
                _r = w(Q, N),
                V = Math.ceil(f * Q) + 5,
                re = V,
                C = !0,
                M = -1;
              ++M < Q;

            )
              (Ae[M] = 0), (W[M] = 0);
            for (U = -1; ++U < N; ) {
              if (((Or = b[U]), !Or.charCodeAt(0) in S.charCodes)) {
                if (C) {
                  for (M = -1; ++M < Q; ) W[M] = 0;
                  C = !1;
                }
                continue;
              }
              for (fe = 0, Er = 0, _ = 0, ye = !0, C = !0, M = -1; ++M < Q; ) {
                if (((Ke = Ae[M]), Ke > fe && (fe = Ke), (z = 0), te[M] === Or))
                  if (
                    ((Tr = s(U, d, b)),
                    (z = _ > 0 ? _ : l(d, b, de, te, U, M, Tr)),
                    (g = Er + p(U, M, Tr, y, z)),
                    g > fe)
                  )
                    (fe = g), (re = V);
                  else {
                    if (ye && --re <= 0) return Math.max(fe, Ae[Q - 1]) * _r;
                    ye = !1;
                  }
                (Er = Ke), (_ = W[M]), (W[M] = z), (Ae[M] = fe);
              }
            }
            return (fe = Ae[Q - 1]), fe * _r;
          }),
        (Z.isWordStart = s =
          function (d, b, S) {
            var T, y;
            return d === 0
              ? !0
              : ((T = b[d]),
                (y = b[d - 1]),
                i(y) || (T !== S[d] && y === S[d - 1]));
          }),
        (Z.isWordEnd = u =
          function (d, b, S, T) {
            var y, g;
            return d === T - 1
              ? !0
              : ((y = b[d]),
                (g = b[d + 1]),
                i(g) || (y === S[d] && g !== S[d + 1]));
          }),
        (i = function (d) {
          return (
            d === " " ||
            d === "." ||
            d === "-" ||
            d === "_" ||
            d === "/" ||
            d === "\\"
          );
        }),
        (x = function (d) {
          var b;
          return d < a ? ((b = a - d), 100 + b * b) : Math.max(100 + a - d, 0);
        }),
        (Z.scoreSize = w =
          function (d, b) {
            return E / (E + Math.abs(b - d));
          }),
        (v = function (d, b, S, T) {
          return 2 * d * (H * S + x(T)) * w(d, b);
        }),
        (Z.scorePattern = m =
          function (d, b, S, T, y) {
            var g, _;
            return (
              (_ = d),
              (g = 6),
              S === d && (g += 2),
              T && (g += 3),
              y && (g += 1),
              d === b && (T && (S === b ? (_ += 2) : (_ += 1)), y && (g += 1)),
              S + _ * (_ + g)
            );
          }),
        (Z.scoreCharacter = p =
          function (d, b, S, T, y) {
            var g;
            return (g = x(d)), S ? g + H * ((T > y ? T : y) + 10) : g + H * y;
          }),
        (Z.scoreConsecutives = l =
          function (d, b, S, T, y, g, _) {
            var W, z, C, U, M, N, V;
            for (
              z = d.length,
                U = S.length,
                C = z - y,
                M = U - g,
                W = C < M ? C : M,
                N = 0,
                V = 0,
                S[g] === d[y] && N++;
              ++V < W && T[++g] === b[++y];

            )
              S[g] === d[y] && N++;
            return (
              V < W && y--, V === 1 ? 1 + 2 * N : m(V, U, N, _, u(y, d, b, z))
            );
          }),
        (Z.scoreExactMatch = h =
          function (d, b, S, T, y, g, _) {
            var W, z, C, U, M;
            for (
              M = s(y, d, b),
                M ||
                  ((C = b.indexOf(T, y + 1)),
                  C > -1 && ((M = s(C, d, b)), M && (y = C))),
                z = -1,
                U = 0;
              ++z < g;

            )
              S[y + z] === d[z] && U++;
            return (W = u(y + g - 1, d, b, _)), v(g, _, m(g, g, U, M, W), y);
          }),
        (e = (function () {
          function d(b, S, T) {
            (this.score = b), (this.pos = S), (this.count = T);
          }
          return d;
        })()),
        (t = new e(0, 0.1, 0)),
        (Z.scoreAcronyms = c =
          function (d, b, S, T) {
            var y, g, _, W, z, C, U, M, N, V, re;
            if (((z = d.length), (C = S.length), !(z > 1 && C > 1))) return t;
            for (y = 0, V = 0, re = 0, M = 0, _ = -1, W = -1; ++W < C; ) {
              if (((U = T[W]), i(U)))
                if (((_ = b.indexOf(U, _ + 1)), _ > -1)) {
                  V++;
                  continue;
                } else break;
              for (; ++_ < z; )
                if (U === b[_] && s(_, d, b)) {
                  S[W] === d[_] && M++, (re += _), y++;
                  break;
                }
              if (_ === z) break;
            }
            return y < 2
              ? t
              : ((g = y === C ? o(d, b, S, y) : !1),
                (N = m(y, C, M, !0, g)),
                new e(N, re / y, y + V));
          }),
        (o = function (d, b, S, T) {
          var y, g, _, W;
          if (((_ = d.length), (W = S.length), (y = 0), _ > 12 * W)) return !1;
          for (g = -1; ++g < _; ) if (s(g, d, b) && ++y > T) return !1;
          return !0;
        });
    }).call(Z);
  });
  var wr = Me((Qe) => {
    (function () {
      var e, r, t, o, n, i, u, s, f, a;
      (a = De()),
        (i = a.isMatch),
        (e = a.computeScore),
        (s = a.scoreSize),
        (f = 20),
        (t = 2.5),
        (Qe.score = function (c, p, l) {
          var v, h, m, x;
          return (
            (h = l.preparedQuery),
            (v = l.allowErrors),
            v || i(c, h.core_lw, h.core_up)
              ? ((x = c.toLowerCase()),
                (m = e(c, x, h)),
                (m = u(c, x, m, l)),
                Math.ceil(m))
              : 0
          );
        }),
        (u = function (c, p, l, v) {
          var h, m, x, w, E, H, d, b, S, T;
          if (l === 0) return 0;
          for (
            S = v.preparedQuery,
              T = v.useExtensionBonus,
              b = v.pathSeparator,
              E = c.length - 1;
            c[E] === b;

          )
            E--;
          if (
            ((x = c.lastIndexOf(b, E)),
            (d = E - x),
            (H = 1),
            T && ((H += n(p, S.ext, x, E, 2)), (l *= H)),
            x === -1)
          )
            return l;
          for (w = S.depth; x > -1 && w-- > 0; ) x = c.lastIndexOf(b, x - 1);
          return (
            (m =
              x === -1
                ? l
                : H * e(c.slice(x + 1, E + 1), p.slice(x + 1, E + 1), S)),
            (h = (0.5 * f) / (f + r(c, E + 1, b))),
            h * m + (1 - h) * l * s(0, t * d)
          );
        }),
        (Qe.countDir = r =
          function (c, p, l) {
            var v, h;
            if (p < 1) return 0;
            for (v = 0, h = -1; ++h < p && c[h] === l; );
            for (; ++h < p; )
              if (c[h] === l) for (v++; ++h < p && c[h] === l; );
            return v;
          }),
        (Qe.getExtension = o =
          function (c) {
            var p;
            return (p = c.lastIndexOf(".")), p < 0 ? "" : c.substr(p + 1);
          }),
        (n = function (c, p, l, v, h) {
          var m, x, w, E;
          if (!p.length || ((E = c.lastIndexOf(".", v)), !(E > l))) return 0;
          for (
            w = p.length,
              m = v - E,
              m < w && ((w = m), (m = p.length)),
              E++,
              x = -1;
            ++x < w && c[E + x] === p[x];

          );
          return x === 0 && h > 0 ? 0.9 * n(c, p, l, E - 2, h - 1) : x / m;
        });
    }).call(Qe);
  });
  var Gr = Me((to, oo) => {
    (function () {
      var e, r, t, o, n, i, u, s;
      (s = wr()),
        (t = s.countDir),
        (n = s.getExtension),
        (oo.exports = e =
          (function () {
            function f(a, c) {
              var p, l, v;
              if (
                ((v = c != null ? c : {}),
                (p = v.optCharRegEx),
                (l = v.pathSeparator),
                !(a && a.length))
              )
                return null;
              (this.query = a),
                (this.query_lw = a.toLowerCase()),
                (this.core = r(a, p)),
                (this.core_lw = this.core.toLowerCase()),
                (this.core_up = u(this.core)),
                (this.depth = t(a, a.length, l)),
                (this.ext = n(this.query_lw)),
                (this.charCodes = o(this.query_lw));
            }
            return f;
          })()),
        (i = /[ _\-:\/\\]/g),
        (r = function (f, a) {
          return a == null && (a = i), f.replace(a, "");
        }),
        (u = function (f) {
          var a, c, p, l;
          for (c = "", p = 0, l = f.length; p < l; p++)
            (a = f[p]), (c += a.toUpperCase()[0]);
          return c;
        }),
        (o = function (f) {
          var a, c, p;
          for (p = f.length, c = -1, a = []; ++c < p; ) a[f.charCodeAt(c)] = !0;
          return a;
        });
    }).call(to);
  });
  var ao = Me((no, io) => {
    (function () {
      var e, r, t, o, n;
      (o = De()),
        (r = wr()),
        (e = Gr()),
        (t = function (i) {
          return i.candidate;
        }),
        (n = function (i, u) {
          return u.score - i.score;
        }),
        (io.exports = function (i, u, s) {
          var f, a, c, p, l, v, h, m, x, w, E, H, d;
          for (
            m = [],
              c = s.key,
              l = s.maxResults,
              p = s.maxInners,
              E = s.usePathScoring,
              x = p != null && p > 0 ? p : i.length + 1,
              f = c != null,
              h = E ? r : o,
              H = 0,
              d = i.length;
            H < d &&
            ((a = i[H]),
            (w = f ? a[c] : a),
            !(
              !!w &&
              ((v = h.score(w, u, s)),
              v > 0 && (m.push({ candidate: a, score: v }), !--x))
            ));
            H++
          );
          return m.sort(n), (i = m.map(t)), l != null && (i = i.slice(0, l)), i;
        });
    }).call(no);
  });
  var uo = Me((Sr) => {
    (function () {
      var e, r, t, o, n, i, u, s, f, a;
      (a = De()),
        (t = a.isMatch),
        (o = a.isWordStart),
        (f = a.scoreConsecutives),
        (s = a.scoreCharacter),
        (u = a.scoreAcronyms),
        (Sr.match = n =
          function (c, p, l) {
            var v, h, m, x, w, E;
            return (
              (v = l.allowErrors),
              (w = l.preparedQuery),
              (x = l.pathSeparator),
              v || t(c, w.core_lw, w.core_up)
                ? ((E = c.toLowerCase()),
                  (m = r(c, E, w)),
                  m.length === 0 ||
                    (c.indexOf(x) > -1 && ((h = e(c, E, w, x)), (m = i(m, h)))),
                  m)
                : []
            );
          }),
        (Sr.wrap = function (c, p, l) {
          var v, h, m, x, w, E, H, d, b;
          if (
            (l.wrap != null &&
              ((b = l.wrap),
              (E = b.tagClass),
              (d = b.tagOpen),
              (H = b.tagClose)),
            E == null && (E = "highlight"),
            d == null && (d = '<strong class="' + E + '">'),
            H == null && (H = "</strong>"),
            c === p)
          )
            return d + c + H;
          if (((m = n(c, p, l)), m.length === 0)) return c;
          for (x = "", v = -1, w = 0; ++v < m.length; ) {
            for (
              h = m[v], h > w && ((x += c.substring(w, h)), (w = h));
              ++v < m.length;

            )
              if (m[v] === h + 1) h++;
              else {
                v--;
                break;
              }
            h++,
              h > w && ((x += d), (x += c.substring(w, h)), (x += H), (w = h));
          }
          return w <= c.length - 1 && (x += c.substring(w)), x;
        }),
        (e = function (c, p, l, v) {
          var h, m, x;
          for (x = c.length - 1; c[x] === v; ) x--;
          if (((h = c.lastIndexOf(v, x)), h === -1)) return [];
          for (m = l.depth; m-- > 0; )
            if (((h = c.lastIndexOf(v, h - 1)), h === -1)) return [];
          return h++, x++, r(c.slice(h, x), p.slice(h, x), l, h);
        }),
        (i = function (c, p) {
          var l, v, h, m, x, w, E;
          if (((x = c.length), (w = p.length), w === 0)) return c.slice();
          if (x === 0) return p.slice();
          for (h = -1, m = 0, v = p[m], E = []; ++h < x; ) {
            for (l = c[h]; v <= l && ++m < w; ) v < l && E.push(v), (v = p[m]);
            E.push(l);
          }
          for (; m < w; ) E.push(p[m++]);
          return E;
        }),
        (r = function (c, p, l, v) {
          var h,
            m,
            x,
            w,
            E,
            H,
            d,
            b,
            S,
            T,
            y,
            g,
            _,
            W,
            z,
            C,
            U,
            M,
            N,
            V,
            re,
            Q,
            ue,
            de,
            te,
            ye;
          for (
            v == null && (v = 0),
              M = l.query,
              N = l.query_lw,
              _ = c.length,
              C = M.length,
              E = u(c, p, M, N).score,
              Q = new Array(C),
              S = new Array(C),
              x = 0,
              w = 1,
              m = 2,
              h = 3,
              ye = new Array(_ * C),
              U = -1,
              g = -1;
            ++g < C;

          )
            (Q[g] = 0), (S[g] = 0);
          for (y = -1; ++y < _; )
            for (V = 0, ue = 0, b = 0, de = p[y], g = -1; ++g < C; )
              (T = 0),
                (H = 0),
                (re = ue),
                N[g] === de &&
                  ((te = o(y, c, p)),
                  (T = b > 0 ? b : f(c, p, M, N, y, g, te)),
                  (H = re + s(y, g, te, E, T))),
                (ue = Q[g]),
                (b = S[g]),
                V > ue ? (z = m) : ((V = ue), (z = w)),
                H > V ? ((V = H), (z = h)) : (T = 0),
                (Q[g] = V),
                (S[g] = T),
                (ye[++U] = V > 0 ? z : x);
          for (
            y = _ - 1, g = C - 1, U = y * C + g, d = !0, W = [];
            d && y >= 0 && g >= 0;

          )
            switch (ye[U]) {
              case w:
                y--, (U -= C);
                break;
              case m:
                g--, U--;
                break;
              case h:
                W.push(y + v), g--, y--, (U -= C + 1);
                break;
              default:
                d = !1;
            }
          return W.reverse(), W;
        });
    }).call(Sr);
  });
  var Br = Me((fo, co) => {
    (function () {
      var e, r, t, o, n, i, u, s;
      (t = ao()),
        (o = uo()),
        (s = De()),
        (i = wr()),
        (e = Gr()),
        (u = null),
        (r =
          (typeof process != "undefined" && process !== null
            ? process.platform
            : void 0) === "win32"
            ? "\\"
            : "/"),
        (co.exports = {
          filter: function (f, a, c) {
            return (
              c == null && (c = {}),
              a != null && a.length && f != null && f.length
                ? ((c = n(c, a)), t(f, a, c))
                : []
            );
          },
          score: function (f, a, c) {
            return (
              c == null && (c = {}),
              f != null && f.length && a != null && a.length
                ? ((c = n(c, a)),
                  c.usePathScoring ? i.score(f, a, c) : s.score(f, a, c))
                : 0
            );
          },
          match: function (f, a, c) {
            var p, l, v;
            return (
              c == null && (c = {}),
              f
                ? a
                  ? f === a
                    ? function () {
                        v = [];
                        for (
                          var h = 0, m = f.length;
                          0 <= m ? h < m : h > m;
                          0 <= m ? h++ : h--
                        )
                          v.push(h);
                        return v;
                      }.apply(this)
                    : ((c = n(c, a)), o.match(f, a, c))
                  : []
                : []
            );
          },
          wrap: function (f, a, c) {
            return (
              c == null && (c = {}),
              f ? (a ? ((c = n(c, a)), o.wrap(f, a, c)) : []) : []
            );
          },
          prepareQuery: function (f, a) {
            return a == null && (a = {}), (a = n(a, f)), a.preparedQuery;
          },
        }),
        (n = function (f, a) {
          return (
            f.allowErrors == null && (f.allowErrors = !1),
            f.usePathScoring == null && (f.usePathScoring = !0),
            f.useExtensionBonus == null && (f.useExtensionBonus = !1),
            f.pathSeparator == null && (f.pathSeparator = r),
            f.optCharRegEx == null && (f.optCharRegEx = null),
            f.wrap == null && (f.wrap = null),
            f.preparedQuery == null &&
              (f.preparedQuery = u && u.query === a ? u : (u = new e(a, f))),
            f
          );
        });
    }).call(fo);
  });
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var Mr =
    function (e, r) {
      return (
        (Mr =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (t, o) {
              t.__proto__ = o;
            }) ||
          function (t, o) {
            for (var n in o)
              Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n]);
          }),
        Mr(e, r)
      );
    };
  function j(e, r) {
    if (typeof r != "function" && r !== null)
      throw new TypeError(
        "Class extends value " + String(r) + " is not a constructor or null"
      );
    Mr(e, r);
    function t() {
      this.constructor = e;
    }
    e.prototype =
      r === null ? Object.create(r) : ((t.prototype = r.prototype), new t());
  }
  function nt(e, r, t, o) {
    function n(i) {
      return i instanceof t
        ? i
        : new t(function (u) {
            u(i);
          });
    }
    return new (t || (t = Promise))(function (i, u) {
      function s(c) {
        try {
          a(o.next(c));
        } catch (p) {
          u(p);
        }
      }
      function f(c) {
        try {
          a(o.throw(c));
        } catch (p) {
          u(p);
        }
      }
      function a(c) {
        c.done ? i(c.value) : n(c.value).then(s, f);
      }
      a((o = o.apply(e, r || [])).next());
    });
  }
  function Ye(e, r) {
    var t = {
        label: 0,
        sent: function () {
          if (i[0] & 1) throw i[1];
          return i[1];
        },
        trys: [],
        ops: [],
      },
      o,
      n,
      i,
      u;
    return (
      (u = { next: s(0), throw: s(1), return: s(2) }),
      typeof Symbol == "function" &&
        (u[Symbol.iterator] = function () {
          return this;
        }),
      u
    );
    function s(a) {
      return function (c) {
        return f([a, c]);
      };
    }
    function f(a) {
      if (o) throw new TypeError("Generator is already executing.");
      for (; t; )
        try {
          if (
            ((o = 1),
            n &&
              (i =
                a[0] & 2
                  ? n.return
                  : a[0]
                  ? n.throw || ((i = n.return) && i.call(n), 0)
                  : n.next) &&
              !(i = i.call(n, a[1])).done)
          )
            return i;
          switch (((n = 0), i && (a = [a[0] & 2, i.value]), a[0])) {
            case 0:
            case 1:
              i = a;
              break;
            case 4:
              return t.label++, { value: a[1], done: !1 };
            case 5:
              t.label++, (n = a[1]), (a = [0]);
              continue;
            case 7:
              (a = t.ops.pop()), t.trys.pop();
              continue;
            default:
              if (
                ((i = t.trys),
                !(i = i.length > 0 && i[i.length - 1]) &&
                  (a[0] === 6 || a[0] === 2))
              ) {
                t = 0;
                continue;
              }
              if (a[0] === 3 && (!i || (a[1] > i[0] && a[1] < i[3]))) {
                t.label = a[1];
                break;
              }
              if (a[0] === 6 && t.label < i[1]) {
                (t.label = i[1]), (i = a);
                break;
              }
              if (i && t.label < i[2]) {
                (t.label = i[2]), t.ops.push(a);
                break;
              }
              i[2] && t.ops.pop(), t.trys.pop();
              continue;
          }
          a = r.call(e, t);
        } catch (c) {
          (a = [6, c]), (n = 0);
        } finally {
          o = i = 0;
        }
      if (a[0] & 5) throw a[1];
      return { value: a[0] ? a[1] : void 0, done: !0 };
    }
  }
  function X(e) {
    var r = typeof Symbol == "function" && Symbol.iterator,
      t = r && e[r],
      o = 0;
    if (t) return t.call(e);
    if (e && typeof e.length == "number")
      return {
        next: function () {
          return (
            e && o >= e.length && (e = void 0), { value: e && e[o++], done: !e }
          );
        },
      };
    throw new TypeError(
      r ? "Object is not iterable." : "Symbol.iterator is not defined."
    );
  }
  function R(e, r) {
    var t = typeof Symbol == "function" && e[Symbol.iterator];
    if (!t) return e;
    var o = t.call(e),
      n,
      i = [],
      u;
    try {
      for (; (r === void 0 || r-- > 0) && !(n = o.next()).done; )
        i.push(n.value);
    } catch (s) {
      u = { error: s };
    } finally {
      try {
        n && !n.done && (t = o.return) && t.call(o);
      } finally {
        if (u) throw u.error;
      }
    }
    return i;
  }
  function k(e, r, t) {
    if (t || arguments.length === 2)
      for (var o = 0, n = r.length, i; o < n; o++)
        (i || !(o in r)) &&
          (i || (i = Array.prototype.slice.call(r, 0, o)), (i[o] = r[o]));
    return e.concat(i || Array.prototype.slice.call(r));
  }
  function ge(e) {
    return this instanceof ge ? ((this.v = e), this) : new ge(e);
  }
  function it(e, r, t) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var o = t.apply(e, r || []),
      n,
      i = [];
    return (
      (n = {}),
      u("next"),
      u("throw"),
      u("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n
    );
    function u(l) {
      o[l] &&
        (n[l] = function (v) {
          return new Promise(function (h, m) {
            i.push([l, v, h, m]) > 1 || s(l, v);
          });
        });
    }
    function s(l, v) {
      try {
        f(o[l](v));
      } catch (h) {
        p(i[0][3], h);
      }
    }
    function f(l) {
      l.value instanceof ge
        ? Promise.resolve(l.value.v).then(a, c)
        : p(i[0][2], l);
    }
    function a(l) {
      s("next", l);
    }
    function c(l) {
      s("throw", l);
    }
    function p(l, v) {
      l(v), i.shift(), i.length && s(i[0][0], i[0][1]);
    }
  }
  function at(e) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = e[Symbol.asyncIterator],
      t;
    return r
      ? r.call(e)
      : ((e = typeof X == "function" ? X(e) : e[Symbol.iterator]()),
        (t = {}),
        o("next"),
        o("throw"),
        o("return"),
        (t[Symbol.asyncIterator] = function () {
          return this;
        }),
        t);
    function o(i) {
      t[i] =
        e[i] &&
        function (u) {
          return new Promise(function (s, f) {
            (u = e[i](u)), n(s, f, u.done, u.value);
          });
        };
    }
    function n(i, u, s, f) {
      Promise.resolve(f).then(function (a) {
        i({ value: a, done: s });
      }, u);
    }
  }
  function O(e) {
    return typeof e == "function";
  }
  function Xe(e) {
    var r = function (o) {
        Error.call(o), (o.stack = new Error().stack);
      },
      t = e(r);
    return (
      (t.prototype = Object.create(Error.prototype)),
      (t.prototype.constructor = t),
      t
    );
  }
  var Ge = Xe(function (e) {
    return function (t) {
      e(this),
        (this.message = t
          ? t.length +
            ` errors occurred during unsubscription:
` +
            t.map(function (o, n) {
              return n + 1 + ") " + o.toString();
            }).join(`
  `)
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = t);
    };
  });
  function ce(e, r) {
    if (e) {
      var t = e.indexOf(r);
      0 <= t && e.splice(t, 1);
    }
  }
  var oe = (function () {
    function e(r) {
      (this.initialTeardown = r),
        (this.closed = !1),
        (this._parentage = null),
        (this._finalizers = null);
    }
    return (
      (e.prototype.unsubscribe = function () {
        var r, t, o, n, i;
        if (!this.closed) {
          this.closed = !0;
          var u = this._parentage;
          if (u)
            if (((this._parentage = null), Array.isArray(u)))
              try {
                for (var s = X(u), f = s.next(); !f.done; f = s.next()) {
                  var a = f.value;
                  a.remove(this);
                }
              } catch (m) {
                r = { error: m };
              } finally {
                try {
                  f && !f.done && (t = s.return) && t.call(s);
                } finally {
                  if (r) throw r.error;
                }
              }
            else u.remove(this);
          var c = this.initialTeardown;
          if (O(c))
            try {
              c();
            } catch (m) {
              i = m instanceof Ge ? m.errors : [m];
            }
          var p = this._finalizers;
          if (p) {
            this._finalizers = null;
            try {
              for (var l = X(p), v = l.next(); !v.done; v = l.next()) {
                var h = v.value;
                try {
                  ut(h);
                } catch (m) {
                  (i = i != null ? i : []),
                    m instanceof Ge
                      ? (i = k(k([], R(i)), R(m.errors)))
                      : i.push(m);
                }
              }
            } catch (m) {
              o = { error: m };
            } finally {
              try {
                v && !v.done && (n = l.return) && n.call(l);
              } finally {
                if (o) throw o.error;
              }
            }
          }
          if (i) throw new Ge(i);
        }
      }),
      (e.prototype.add = function (r) {
        var t;
        if (r && r !== this)
          if (this.closed) ut(r);
          else {
            if (r instanceof e) {
              if (r.closed || r._hasParent(this)) return;
              r._addParent(this);
            }
            (this._finalizers =
              (t = this._finalizers) !== null && t !== void 0 ? t : []).push(r);
          }
      }),
      (e.prototype._hasParent = function (r) {
        var t = this._parentage;
        return t === r || (Array.isArray(t) && t.includes(r));
      }),
      (e.prototype._addParent = function (r) {
        var t = this._parentage;
        this._parentage = Array.isArray(t) ? (t.push(r), t) : t ? [t, r] : r;
      }),
      (e.prototype._removeParent = function (r) {
        var t = this._parentage;
        t === r ? (this._parentage = null) : Array.isArray(t) && ce(t, r);
      }),
      (e.prototype.remove = function (r) {
        var t = this._finalizers;
        t && ce(t, r), r instanceof e && r._removeParent(this);
      }),
      (e.EMPTY = (function () {
        var r = new e();
        return (r.closed = !0), r;
      })()),
      e
    );
  })();
  var Ir = oe.EMPTY;
  function Be(e) {
    return (
      e instanceof oe ||
      (e && "closed" in e && O(e.remove) && O(e.add) && O(e.unsubscribe))
    );
  }
  function ut(e) {
    O(e) ? e() : e.unsubscribe();
  }
  var ee = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: !1,
    useDeprecatedNextContext: !1,
  };
  var Ie = {
    setTimeout: function (e, r) {
      for (var t = [], o = 2; o < arguments.length; o++)
        t[o - 2] = arguments[o];
      var n = Ie.delegate;
      return n != null && n.setTimeout
        ? n.setTimeout.apply(n, k([e, r], R(t)))
        : setTimeout.apply(void 0, k([e, r], R(t)));
    },
    clearTimeout: function (e) {
      var r = Ie.delegate;
      return ((r == null ? void 0 : r.clearTimeout) || clearTimeout)(e);
    },
    delegate: void 0,
  };
  function Ze(e) {
    Ie.setTimeout(function () {
      var r = ee.onUnhandledError;
      if (r) r(e);
      else throw e;
    });
  }
  function se() {}
  var ft = (function () {
    return Lr("C", void 0, void 0);
  })();
  function ct(e) {
    return Lr("E", void 0, e);
  }
  function st(e) {
    return Lr("N", e, void 0);
  }
  function Lr(e, r, t) {
    return { kind: e, value: r, error: t };
  }
  var we = null;
  function Le(e) {
    if (ee.useDeprecatedSynchronousErrorHandling) {
      var r = !we;
      if ((r && (we = { errorThrown: !1, error: null }), e(), r)) {
        var t = we,
          o = t.errorThrown,
          n = t.error;
        if (((we = null), o)) throw n;
      }
    } else e();
  }
  function pt(e) {
    ee.useDeprecatedSynchronousErrorHandling &&
      we &&
      ((we.errorThrown = !0), (we.error = e));
  }
  var ze = (function (e) {
    j(r, e);
    function r(t) {
      var o = e.call(this) || this;
      return (
        (o.isStopped = !1),
        t ? ((o.destination = t), Be(t) && t.add(o)) : (o.destination = Io),
        o
      );
    }
    return (
      (r.create = function (t, o, n) {
        return new Se(t, o, n);
      }),
      (r.prototype.next = function (t) {
        this.isStopped ? Pr(st(t), this) : this._next(t);
      }),
      (r.prototype.error = function (t) {
        this.isStopped
          ? Pr(ct(t), this)
          : ((this.isStopped = !0), this._error(t));
      }),
      (r.prototype.complete = function () {
        this.isStopped
          ? Pr(ft, this)
          : ((this.isStopped = !0), this._complete());
      }),
      (r.prototype.unsubscribe = function () {
        this.closed ||
          ((this.isStopped = !0),
          e.prototype.unsubscribe.call(this),
          (this.destination = null));
      }),
      (r.prototype._next = function (t) {
        this.destination.next(t);
      }),
      (r.prototype._error = function (t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }),
      (r.prototype._complete = function () {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }),
      r
    );
  })(oe);
  var _o = Function.prototype.bind;
  function Cr(e, r) {
    return _o.call(e, r);
  }
  var Ao = (function () {
      function e(r) {
        this.partialObserver = r;
      }
      return (
        (e.prototype.next = function (r) {
          var t = this.partialObserver;
          if (t.next)
            try {
              t.next(r);
            } catch (o) {
              er(o);
            }
        }),
        (e.prototype.error = function (r) {
          var t = this.partialObserver;
          if (t.error)
            try {
              t.error(r);
            } catch (o) {
              er(o);
            }
          else er(r);
        }),
        (e.prototype.complete = function () {
          var r = this.partialObserver;
          if (r.complete)
            try {
              r.complete();
            } catch (t) {
              er(t);
            }
        }),
        e
      );
    })(),
    Se = (function (e) {
      j(r, e);
      function r(t, o, n) {
        var i = e.call(this) || this,
          u;
        if (O(t) || !t)
          u = {
            next: t != null ? t : void 0,
            error: o != null ? o : void 0,
            complete: n != null ? n : void 0,
          };
        else {
          var s;
          i && ee.useDeprecatedNextContext
            ? ((s = Object.create(t)),
              (s.unsubscribe = function () {
                return i.unsubscribe();
              }),
              (u = {
                next: t.next && Cr(t.next, s),
                error: t.error && Cr(t.error, s),
                complete: t.complete && Cr(t.complete, s),
              }))
            : (u = t);
        }
        return (i.destination = new Ao(u)), i;
      }
      return r;
    })(ze);
  function er(e) {
    ee.useDeprecatedSynchronousErrorHandling ? pt(e) : Ze(e);
  }
  function Mo(e) {
    throw e;
  }
  function Pr(e, r) {
    var t = ee.onStoppedNotification;
    t &&
      Ie.setTimeout(function () {
        return t(e, r);
      });
  }
  var Io = { closed: !0, next: se, error: Mo, complete: se };
  var Ce = (function () {
    return (typeof Symbol == "function" && Symbol.observable) || "@@observable";
  })();
  function G(e) {
    return e;
  }
  function lt() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return Rr(e);
  }
  function Rr(e) {
    return e.length === 0
      ? G
      : e.length === 1
      ? e[0]
      : function (t) {
          return e.reduce(function (o, n) {
            return n(o);
          }, t);
        };
  }
  var I = (function () {
    function e(r) {
      r && (this._subscribe = r);
    }
    return (
      (e.prototype.lift = function (r) {
        var t = new e();
        return (t.source = this), (t.operator = r), t;
      }),
      (e.prototype.subscribe = function (r, t, o) {
        var n = this,
          i = Co(r) ? r : new Se(r, t, o);
        return (
          Le(function () {
            var u = n,
              s = u.operator,
              f = u.source;
            i.add(s ? s.call(i, f) : f ? n._subscribe(i) : n._trySubscribe(i));
          }),
          i
        );
      }),
      (e.prototype._trySubscribe = function (r) {
        try {
          return this._subscribe(r);
        } catch (t) {
          r.error(t);
        }
      }),
      (e.prototype.forEach = function (r, t) {
        var o = this;
        return (
          (t = mt(t)),
          new t(function (n, i) {
            var u = new Se({
              next: function (s) {
                try {
                  r(s);
                } catch (f) {
                  i(f), u.unsubscribe();
                }
              },
              error: i,
              complete: n,
            });
            o.subscribe(u);
          })
        );
      }),
      (e.prototype._subscribe = function (r) {
        var t;
        return (t = this.source) === null || t === void 0
          ? void 0
          : t.subscribe(r);
      }),
      (e.prototype[Ce] = function () {
        return this;
      }),
      (e.prototype.pipe = function () {
        for (var r = [], t = 0; t < arguments.length; t++) r[t] = arguments[t];
        return Rr(r)(this);
      }),
      (e.prototype.toPromise = function (r) {
        var t = this;
        return (
          (r = mt(r)),
          new r(function (o, n) {
            var i;
            t.subscribe(
              function (u) {
                return (i = u);
              },
              function (u) {
                return n(u);
              },
              function () {
                return o(i);
              }
            );
          })
        );
      }),
      (e.create = function (r) {
        return new e(r);
      }),
      e
    );
  })();
  function mt(e) {
    var r;
    return (r = e != null ? e : ee.Promise) !== null && r !== void 0
      ? r
      : Promise;
  }
  function Lo(e) {
    return e && O(e.next) && O(e.error) && O(e.complete);
  }
  function Co(e) {
    return (e && e instanceof ze) || (Lo(e) && Be(e));
  }
  function Po(e) {
    return O(e == null ? void 0 : e.lift);
  }
  function A(e) {
    return function (r) {
      if (Po(r))
        return r.lift(function (t) {
          try {
            return e(t, this);
          } catch (o) {
            this.error(o);
          }
        });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  function P(e, r, t, o, n) {
    return new Ro(e, r, t, o, n);
  }
  var Ro = (function (e) {
    j(r, e);
    function r(t, o, n, i, u, s) {
      var f = e.call(this, t) || this;
      return (
        (f.onFinalize = u),
        (f.shouldUnsubscribe = s),
        (f._next = o
          ? function (a) {
              try {
                o(a);
              } catch (c) {
                t.error(c);
              }
            }
          : e.prototype._next),
        (f._error = i
          ? function (a) {
              try {
                i(a);
              } catch (c) {
                t.error(c);
              } finally {
                this.unsubscribe();
              }
            }
          : e.prototype._error),
        (f._complete = n
          ? function () {
              try {
                n();
              } catch (a) {
                t.error(a);
              } finally {
                this.unsubscribe();
              }
            }
          : e.prototype._complete),
        f
      );
    }
    return (
      (r.prototype.unsubscribe = function () {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          var o = this.closed;
          e.prototype.unsubscribe.call(this),
            !o &&
              ((t = this.onFinalize) === null || t === void 0 || t.call(this));
        }
      }),
      r
    );
  })(ze);
  var Pe = {
    schedule: function (e) {
      var r = requestAnimationFrame,
        t = cancelAnimationFrame,
        o = Pe.delegate;
      o && ((r = o.requestAnimationFrame), (t = o.cancelAnimationFrame));
      var n = r(function (i) {
        (t = void 0), e(i);
      });
      return new oe(function () {
        return t == null ? void 0 : t(n);
      });
    },
    requestAnimationFrame: function () {
      for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
      var t = Pe.delegate;
      return (
        (t == null ? void 0 : t.requestAnimationFrame) || requestAnimationFrame
      ).apply(void 0, k([], R(e)));
    },
    cancelAnimationFrame: function () {
      for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
      var t = Pe.delegate;
      return (
        (t == null ? void 0 : t.cancelAnimationFrame) || cancelAnimationFrame
      ).apply(void 0, k([], R(e)));
    },
    delegate: void 0,
  };
  var ht = Xe(function (e) {
    return function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    };
  });
  var K = (function (e) {
    j(r, e);
    function r() {
      var t = e.call(this) || this;
      return (
        (t.closed = !1),
        (t.currentObservers = null),
        (t.observers = []),
        (t.isStopped = !1),
        (t.hasError = !1),
        (t.thrownError = null),
        t
      );
    }
    return (
      (r.prototype.lift = function (t) {
        var o = new dt(this, this);
        return (o.operator = t), o;
      }),
      (r.prototype._throwIfClosed = function () {
        if (this.closed) throw new ht();
      }),
      (r.prototype.next = function (t) {
        var o = this;
        Le(function () {
          var n, i;
          if ((o._throwIfClosed(), !o.isStopped)) {
            o.currentObservers ||
              (o.currentObservers = Array.from(o.observers));
            try {
              for (
                var u = X(o.currentObservers), s = u.next();
                !s.done;
                s = u.next()
              ) {
                var f = s.value;
                f.next(t);
              }
            } catch (a) {
              n = { error: a };
            } finally {
              try {
                s && !s.done && (i = u.return) && i.call(u);
              } finally {
                if (n) throw n.error;
              }
            }
          }
        });
      }),
      (r.prototype.error = function (t) {
        var o = this;
        Le(function () {
          if ((o._throwIfClosed(), !o.isStopped)) {
            (o.hasError = o.isStopped = !0), (o.thrownError = t);
            for (var n = o.observers; n.length; ) n.shift().error(t);
          }
        });
      }),
      (r.prototype.complete = function () {
        var t = this;
        Le(function () {
          if ((t._throwIfClosed(), !t.isStopped)) {
            t.isStopped = !0;
            for (var o = t.observers; o.length; ) o.shift().complete();
          }
        });
      }),
      (r.prototype.unsubscribe = function () {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }),
      Object.defineProperty(r.prototype, "observed", {
        get: function () {
          var t;
          return (
            ((t = this.observers) === null || t === void 0
              ? void 0
              : t.length) > 0
          );
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype._trySubscribe = function (t) {
        return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t);
      }),
      (r.prototype._subscribe = function (t) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(t),
          this._innerSubscribe(t)
        );
      }),
      (r.prototype._innerSubscribe = function (t) {
        var o = this,
          n = this,
          i = n.hasError,
          u = n.isStopped,
          s = n.observers;
        return i || u
          ? Ir
          : ((this.currentObservers = null),
            s.push(t),
            new oe(function () {
              (o.currentObservers = null), ce(s, t);
            }));
      }),
      (r.prototype._checkFinalizedStatuses = function (t) {
        var o = this,
          n = o.hasError,
          i = o.thrownError,
          u = o.isStopped;
        n ? t.error(i) : u && t.complete();
      }),
      (r.prototype.asObservable = function () {
        var t = new I();
        return (t.source = this), t;
      }),
      (r.create = function (t, o) {
        return new dt(t, o);
      }),
      r
    );
  })(I);
  var dt = (function (e) {
    j(r, e);
    function r(t, o) {
      var n = e.call(this) || this;
      return (n.destination = t), (n.source = o), n;
    }
    return (
      (r.prototype.next = function (t) {
        var o, n;
        (n =
          (o = this.destination) === null || o === void 0 ? void 0 : o.next) ===
          null ||
          n === void 0 ||
          n.call(o, t);
      }),
      (r.prototype.error = function (t) {
        var o, n;
        (n =
          (o = this.destination) === null || o === void 0
            ? void 0
            : o.error) === null ||
          n === void 0 ||
          n.call(o, t);
      }),
      (r.prototype.complete = function () {
        var t, o;
        (o =
          (t = this.destination) === null || t === void 0
            ? void 0
            : t.complete) === null ||
          o === void 0 ||
          o.call(t);
      }),
      (r.prototype._subscribe = function (t) {
        var o, n;
        return (n =
          (o = this.source) === null || o === void 0
            ? void 0
            : o.subscribe(t)) !== null && n !== void 0
          ? n
          : Ir;
      }),
      r
    );
  })(K);
  var Hr = (function (e) {
    j(r, e);
    function r(t) {
      var o = e.call(this) || this;
      return (o._value = t), o;
    }
    return (
      Object.defineProperty(r.prototype, "value", {
        get: function () {
          return this.getValue();
        },
        enumerable: !1,
        configurable: !0,
      }),
      (r.prototype._subscribe = function (t) {
        var o = e.prototype._subscribe.call(this, t);
        return !o.closed && t.next(this._value), o;
      }),
      (r.prototype.getValue = function () {
        var t = this,
          o = t.hasError,
          n = t.thrownError,
          i = t._value;
        if (o) throw n;
        return this._throwIfClosed(), i;
      }),
      (r.prototype.next = function (t) {
        e.prototype.next.call(this, (this._value = t));
      }),
      r
    );
  })(K);
  var je = {
    now: function () {
      return (je.delegate || Date).now();
    },
    delegate: void 0,
  };
  var vt = (function (e) {
    j(r, e);
    function r(t, o, n) {
      t === void 0 && (t = 1 / 0),
        o === void 0 && (o = 1 / 0),
        n === void 0 && (n = je);
      var i = e.call(this) || this;
      return (
        (i._bufferSize = t),
        (i._windowTime = o),
        (i._timestampProvider = n),
        (i._buffer = []),
        (i._infiniteTimeWindow = !0),
        (i._infiniteTimeWindow = o === 1 / 0),
        (i._bufferSize = Math.max(1, t)),
        (i._windowTime = Math.max(1, o)),
        i
      );
    }
    return (
      (r.prototype.next = function (t) {
        var o = this,
          n = o.isStopped,
          i = o._buffer,
          u = o._infiniteTimeWindow,
          s = o._timestampProvider,
          f = o._windowTime;
        n || (i.push(t), !u && i.push(s.now() + f)),
          this._trimBuffer(),
          e.prototype.next.call(this, t);
      }),
      (r.prototype._subscribe = function (t) {
        this._throwIfClosed(), this._trimBuffer();
        for (
          var o = this._innerSubscribe(t),
            n = this,
            i = n._infiniteTimeWindow,
            u = n._buffer,
            s = u.slice(),
            f = 0;
          f < s.length && !t.closed;
          f += i ? 1 : 2
        )
          t.next(s[f]);
        return this._checkFinalizedStatuses(t), o;
      }),
      (r.prototype._trimBuffer = function () {
        var t = this,
          o = t._bufferSize,
          n = t._timestampProvider,
          i = t._buffer,
          u = t._infiniteTimeWindow,
          s = (u ? 1 : 2) * o;
        if ((o < 1 / 0 && s < i.length && i.splice(0, i.length - s), !u)) {
          for (var f = n.now(), a = 0, c = 1; c < i.length && i[c] <= f; c += 2)
            a = c;
          a && i.splice(0, a + 1);
        }
      }),
      r
    );
  })(K);
  var xt = (function (e) {
    j(r, e);
    function r(t, o) {
      return e.call(this) || this;
    }
    return (
      (r.prototype.schedule = function (t, o) {
        return o === void 0 && (o = 0), this;
      }),
      r
    );
  })(oe);
  var Ve = {
    setInterval: function (e, r) {
      for (var t = [], o = 2; o < arguments.length; o++)
        t[o - 2] = arguments[o];
      var n = Ve.delegate;
      return n != null && n.setInterval
        ? n.setInterval.apply(n, k([e, r], R(t)))
        : setInterval.apply(void 0, k([e, r], R(t)));
    },
    clearInterval: function (e) {
      var r = Ve.delegate;
      return ((r == null ? void 0 : r.clearInterval) || clearInterval)(e);
    },
    delegate: void 0,
  };
  var rr = (function (e) {
    j(r, e);
    function r(t, o) {
      var n = e.call(this, t, o) || this;
      return (n.scheduler = t), (n.work = o), (n.pending = !1), n;
    }
    return (
      (r.prototype.schedule = function (t, o) {
        var n;
        if ((o === void 0 && (o = 0), this.closed)) return this;
        this.state = t;
        var i = this.id,
          u = this.scheduler;
        return (
          i != null && (this.id = this.recycleAsyncId(u, i, o)),
          (this.pending = !0),
          (this.delay = o),
          (this.id =
            (n = this.id) !== null && n !== void 0
              ? n
              : this.requestAsyncId(u, this.id, o)),
          this
        );
      }),
      (r.prototype.requestAsyncId = function (t, o, n) {
        return (
          n === void 0 && (n = 0), Ve.setInterval(t.flush.bind(t, this), n)
        );
      }),
      (r.prototype.recycleAsyncId = function (t, o, n) {
        if (
          (n === void 0 && (n = 0),
          n != null && this.delay === n && this.pending === !1)
        )
          return o;
        o != null && Ve.clearInterval(o);
      }),
      (r.prototype.execute = function (t, o) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = !1;
        var n = this._execute(t, o);
        if (n) return n;
        this.pending === !1 &&
          this.id != null &&
          (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
      }),
      (r.prototype._execute = function (t, o) {
        var n = !1,
          i;
        try {
          this.work(t);
        } catch (u) {
          (n = !0), (i = u || new Error("Scheduled action threw falsy error"));
        }
        if (n) return this.unsubscribe(), i;
      }),
      (r.prototype.unsubscribe = function () {
        if (!this.closed) {
          var t = this,
            o = t.id,
            n = t.scheduler,
            i = n.actions;
          (this.work = this.state = this.scheduler = null),
            (this.pending = !1),
            ce(i, this),
            o != null && (this.id = this.recycleAsyncId(n, o, null)),
            (this.delay = null),
            e.prototype.unsubscribe.call(this);
        }
      }),
      r
    );
  })(xt);
  var kr = (function () {
    function e(r, t) {
      t === void 0 && (t = e.now),
        (this.schedulerActionCtor = r),
        (this.now = t);
    }
    return (
      (e.prototype.schedule = function (r, t, o) {
        return (
          t === void 0 && (t = 0),
          new this.schedulerActionCtor(this, r).schedule(o, t)
        );
      }),
      (e.now = je.now),
      e
    );
  })();
  var tr = (function (e) {
    j(r, e);
    function r(t, o) {
      o === void 0 && (o = kr.now);
      var n = e.call(this, t, o) || this;
      return (n.actions = []), (n._active = !1), n;
    }
    return (
      (r.prototype.flush = function (t) {
        var o = this.actions;
        if (this._active) {
          o.push(t);
          return;
        }
        var n;
        this._active = !0;
        do if ((n = t.execute(t.state, t.delay))) break;
        while ((t = o.shift()));
        if (((this._active = !1), n)) {
          for (; (t = o.shift()); ) t.unsubscribe();
          throw n;
        }
      }),
      r
    );
  })(kr);
  var Ee = new tr(rr),
    bt = Ee;
  var yt = (function (e) {
    j(r, e);
    function r(t, o) {
      var n = e.call(this, t, o) || this;
      return (n.scheduler = t), (n.work = o), n;
    }
    return (
      (r.prototype.requestAsyncId = function (t, o, n) {
        return (
          n === void 0 && (n = 0),
          n !== null && n > 0
            ? e.prototype.requestAsyncId.call(this, t, o, n)
            : (t.actions.push(this),
              t._scheduled ||
                (t._scheduled = Pe.requestAnimationFrame(function () {
                  return t.flush(void 0);
                })))
        );
      }),
      (r.prototype.recycleAsyncId = function (t, o, n) {
        var i;
        if ((n === void 0 && (n = 0), n != null ? n > 0 : this.delay > 0))
          return e.prototype.recycleAsyncId.call(this, t, o, n);
        var u = t.actions;
        o != null &&
          ((i = u[u.length - 1]) === null || i === void 0 ? void 0 : i.id) !==
            o &&
          (Pe.cancelAnimationFrame(o), (t._scheduled = void 0));
      }),
      r
    );
  })(rr);
  var gt = (function (e) {
    j(r, e);
    function r() {
      return (e !== null && e.apply(this, arguments)) || this;
    }
    return (
      (r.prototype.flush = function (t) {
        this._active = !0;
        var o = this._scheduled;
        this._scheduled = void 0;
        var n = this.actions,
          i;
        t = t || n.shift();
        do if ((i = t.execute(t.state, t.delay))) break;
        while ((t = n[0]) && t.id === o && n.shift());
        if (((this._active = !1), i)) {
          for (; (t = n[0]) && t.id === o && n.shift(); ) t.unsubscribe();
          throw i;
        }
      }),
      r
    );
  })(tr);
  var Fr = new gt(yt);
  var Re = new I(function (e) {
    return e.complete();
  });
  function or(e) {
    return e && O(e.schedule);
  }
  function Wr(e) {
    return e[e.length - 1];
  }
  function ve(e) {
    return O(Wr(e)) ? e.pop() : void 0;
  }
  function ne(e) {
    return or(Wr(e)) ? e.pop() : void 0;
  }
  function wt(e, r) {
    return typeof Wr(e) == "number" ? e.pop() : r;
  }
  var He = function (e) {
    return e && typeof e.length == "number" && typeof e != "function";
  };
  function nr(e) {
    return O(e == null ? void 0 : e.then);
  }
  function ir(e) {
    return O(e[Ce]);
  }
  function ar(e) {
    return (
      Symbol.asyncIterator && O(e == null ? void 0 : e[Symbol.asyncIterator])
    );
  }
  function ur(e) {
    return new TypeError(
      "You provided " +
        (e !== null && typeof e == "object"
          ? "an invalid object"
          : "'" + e + "'") +
        " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable."
    );
  }
  function Ho() {
    return typeof Symbol != "function" || !Symbol.iterator
      ? "@@iterator"
      : Symbol.iterator;
  }
  var fr = Ho();
  function cr(e) {
    return O(e == null ? void 0 : e[fr]);
  }
  function sr(e) {
    return it(this, arguments, function () {
      var t, o, n, i;
      return Ye(this, function (u) {
        switch (u.label) {
          case 0:
            (t = e.getReader()), (u.label = 1);
          case 1:
            u.trys.push([1, , 9, 10]), (u.label = 2);
          case 2:
            return [4, ge(t.read())];
          case 3:
            return (
              (o = u.sent()),
              (n = o.value),
              (i = o.done),
              i ? [4, ge(void 0)] : [3, 5]
            );
          case 4:
            return [2, u.sent()];
          case 5:
            return [4, ge(n)];
          case 6:
            return [4, u.sent()];
          case 7:
            return u.sent(), [3, 2];
          case 8:
            return [3, 10];
          case 9:
            return t.releaseLock(), [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function pr(e) {
    return O(e == null ? void 0 : e.getReader);
  }
  function F(e) {
    if (e instanceof I) return e;
    if (e != null) {
      if (ir(e)) return ko(e);
      if (He(e)) return Fo(e);
      if (nr(e)) return Wo(e);
      if (ar(e)) return St(e);
      if (cr(e)) return Uo(e);
      if (pr(e)) return zo(e);
    }
    throw ur(e);
  }
  function ko(e) {
    return new I(function (r) {
      var t = e[Ce]();
      if (O(t.subscribe)) return t.subscribe(r);
      throw new TypeError(
        "Provided object does not correctly implement Symbol.observable"
      );
    });
  }
  function Fo(e) {
    return new I(function (r) {
      for (var t = 0; t < e.length && !r.closed; t++) r.next(e[t]);
      r.complete();
    });
  }
  function Wo(e) {
    return new I(function (r) {
      e.then(
        function (t) {
          r.closed || (r.next(t), r.complete());
        },
        function (t) {
          return r.error(t);
        }
      ).then(null, Ze);
    });
  }
  function Uo(e) {
    return new I(function (r) {
      var t, o;
      try {
        for (var n = X(e), i = n.next(); !i.done; i = n.next()) {
          var u = i.value;
          if ((r.next(u), r.closed)) return;
        }
      } catch (s) {
        t = { error: s };
      } finally {
        try {
          i && !i.done && (o = n.return) && o.call(n);
        } finally {
          if (t) throw t.error;
        }
      }
      r.complete();
    });
  }
  function St(e) {
    return new I(function (r) {
      jo(e, r).catch(function (t) {
        return r.error(t);
      });
    });
  }
  function zo(e) {
    return St(sr(e));
  }
  function jo(e, r) {
    var t, o, n, i;
    return nt(this, void 0, void 0, function () {
      var u, s;
      return Ye(this, function (f) {
        switch (f.label) {
          case 0:
            f.trys.push([0, 5, 6, 11]), (t = at(e)), (f.label = 1);
          case 1:
            return [4, t.next()];
          case 2:
            if (((o = f.sent()), !!o.done)) return [3, 4];
            if (((u = o.value), r.next(u), r.closed)) return [2];
            f.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            return (s = f.sent()), (n = { error: s }), [3, 11];
          case 6:
            return (
              f.trys.push([6, , 9, 10]),
              o && !o.done && (i = t.return) ? [4, i.call(t)] : [3, 8]
            );
          case 7:
            f.sent(), (f.label = 8);
          case 8:
            return [3, 10];
          case 9:
            if (n) throw n.error;
            return [7];
          case 10:
            return [7];
          case 11:
            return r.complete(), [2];
        }
      });
    });
  }
  function J(e, r, t, o, n) {
    o === void 0 && (o = 0), n === void 0 && (n = !1);
    var i = r.schedule(function () {
      t(), n ? e.add(this.schedule(null, o)) : this.unsubscribe();
    }, o);
    if ((e.add(i), !n)) return i;
  }
  function lr(e, r) {
    return (
      r === void 0 && (r = 0),
      A(function (t, o) {
        t.subscribe(
          P(
            o,
            function (n) {
              return J(
                o,
                e,
                function () {
                  return o.next(n);
                },
                r
              );
            },
            function () {
              return J(
                o,
                e,
                function () {
                  return o.complete();
                },
                r
              );
            },
            function (n) {
              return J(
                o,
                e,
                function () {
                  return o.error(n);
                },
                r
              );
            }
          )
        );
      })
    );
  }
  function mr(e, r) {
    return (
      r === void 0 && (r = 0),
      A(function (t, o) {
        o.add(
          e.schedule(function () {
            return t.subscribe(o);
          }, r)
        );
      })
    );
  }
  function Et(e, r) {
    return F(e).pipe(mr(r), lr(r));
  }
  function Ot(e, r) {
    return F(e).pipe(mr(r), lr(r));
  }
  function Tt(e, r) {
    return new I(function (t) {
      var o = 0;
      return r.schedule(function () {
        o === e.length
          ? t.complete()
          : (t.next(e[o++]), t.closed || this.schedule());
      });
    });
  }
  function _t(e, r) {
    return new I(function (t) {
      var o;
      return (
        J(t, r, function () {
          (o = e[fr]()),
            J(
              t,
              r,
              function () {
                var n, i, u;
                try {
                  (n = o.next()), (i = n.value), (u = n.done);
                } catch (s) {
                  t.error(s);
                  return;
                }
                u ? t.complete() : t.next(i);
              },
              0,
              !0
            );
        }),
        function () {
          return O(o == null ? void 0 : o.return) && o.return();
        }
      );
    });
  }
  function hr(e, r) {
    if (!e) throw new Error("Iterable cannot be null");
    return new I(function (t) {
      J(t, r, function () {
        var o = e[Symbol.asyncIterator]();
        J(
          t,
          r,
          function () {
            o.next().then(function (n) {
              n.done ? t.complete() : t.next(n.value);
            });
          },
          0,
          !0
        );
      });
    });
  }
  function At(e, r) {
    return hr(sr(e), r);
  }
  function Mt(e, r) {
    if (e != null) {
      if (ir(e)) return Et(e, r);
      if (He(e)) return Tt(e, r);
      if (nr(e)) return Ot(e, r);
      if (ar(e)) return hr(e, r);
      if (cr(e)) return _t(e, r);
      if (pr(e)) return At(e, r);
    }
    throw ur(e);
  }
  function B(e, r) {
    return r ? Mt(e, r) : F(e);
  }
  function ie() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ne(e);
    return B(e, t);
  }
  function Ur(e, r) {
    var t = O(e)
        ? e
        : function () {
            return e;
          },
      o = function (n) {
        return n.error(t());
      };
    return new I(
      r
        ? function (n) {
            return r.schedule(o, 0, n);
          }
        : o
    );
  }
  function It(e) {
    return e instanceof Date && !isNaN(e);
  }
  function L(e, r) {
    return A(function (t, o) {
      var n = 0;
      t.subscribe(
        P(o, function (i) {
          o.next(e.call(r, i, n++));
        })
      );
    });
  }
  var Vo = Array.isArray;
  function $o(e, r) {
    return Vo(r) ? e.apply(void 0, k([], R(r))) : e(r);
  }
  function ke(e) {
    return L(function (r) {
      return $o(e, r);
    });
  }
  var No = Array.isArray,
    qo = Object.getPrototypeOf,
    Do = Object.prototype,
    Qo = Object.keys;
  function Lt(e) {
    if (e.length === 1) {
      var r = e[0];
      if (No(r)) return { args: r, keys: null };
      if (Ko(r)) {
        var t = Qo(r);
        return {
          args: t.map(function (o) {
            return r[o];
          }),
          keys: t,
        };
      }
    }
    return { args: e, keys: null };
  }
  function Ko(e) {
    return e && typeof e == "object" && qo(e) === Do;
  }
  function Ct(e, r) {
    return e.reduce(function (t, o, n) {
      return (t[o] = r[n]), t;
    }, {});
  }
  function Fe() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ne(e),
      o = ve(e),
      n = Lt(e),
      i = n.args,
      u = n.keys;
    if (i.length === 0) return B([], t);
    var s = new I(
      zr(
        i,
        t,
        u
          ? function (f) {
              return Ct(u, f);
            }
          : G
      )
    );
    return o ? s.pipe(ke(o)) : s;
  }
  function zr(e, r, t) {
    return (
      t === void 0 && (t = G),
      function (o) {
        Pt(
          r,
          function () {
            for (
              var n = e.length,
                i = new Array(n),
                u = n,
                s = n,
                f = function (c) {
                  Pt(
                    r,
                    function () {
                      var p = B(e[c], r),
                        l = !1;
                      p.subscribe(
                        P(
                          o,
                          function (v) {
                            (i[c] = v),
                              l || ((l = !0), s--),
                              s || o.next(t(i.slice()));
                          },
                          function () {
                            --u || o.complete();
                          }
                        )
                      );
                    },
                    o
                  );
                },
                a = 0;
              a < n;
              a++
            )
              f(a);
          },
          o
        );
      }
    );
  }
  function Pt(e, r, t) {
    e ? J(t, e, r) : r();
  }
  function Rt(e, r, t, o, n, i, u, s) {
    var f = [],
      a = 0,
      c = 0,
      p = !1,
      l = function () {
        p && !f.length && !a && r.complete();
      },
      v = function (m) {
        return a < o ? h(m) : f.push(m);
      },
      h = function (m) {
        i && r.next(m), a++;
        var x = !1;
        F(t(m, c++)).subscribe(
          P(
            r,
            function (w) {
              n == null || n(w), i ? v(w) : r.next(w);
            },
            function () {
              x = !0;
            },
            void 0,
            function () {
              if (x)
                try {
                  a--;
                  for (
                    var w = function () {
                      var E = f.shift();
                      u
                        ? J(r, u, function () {
                            return h(E);
                          })
                        : h(E);
                    };
                    f.length && a < o;

                  )
                    w();
                  l();
                } catch (E) {
                  r.error(E);
                }
            }
          )
        );
      };
    return (
      e.subscribe(
        P(r, v, function () {
          (p = !0), l();
        })
      ),
      function () {
        s == null || s();
      }
    );
  }
  function Oe(e, r, t) {
    return (
      t === void 0 && (t = 1 / 0),
      O(r)
        ? Oe(function (o, n) {
            return L(function (i, u) {
              return r(o, i, n, u);
            })(F(e(o, n)));
          }, t)
        : (typeof r == "number" && (t = r),
          A(function (o, n) {
            return Rt(o, n, e, t);
          }))
    );
  }
  function dr(e) {
    return e === void 0 && (e = 1 / 0), Oe(G, e);
  }
  function Ht() {
    return dr(1);
  }
  function $e() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return Ht()(B(e, ne(e)));
  }
  function Te(e) {
    return new I(function (r) {
      F(e()).subscribe(r);
    });
  }
  var Jo = ["addListener", "removeListener"],
    Yo = ["addEventListener", "removeEventListener"],
    Xo = ["on", "off"];
  function $(e, r, t, o) {
    if ((O(t) && ((o = t), (t = void 0)), o)) return $(e, r, t).pipe(ke(o));
    var n = R(
        Zo(e)
          ? Yo.map(function (s) {
              return function (f) {
                return e[s](r, f, t);
              };
            })
          : Go(e)
          ? Jo.map(kt(e, r))
          : Bo(e)
          ? Xo.map(kt(e, r))
          : [],
        2
      ),
      i = n[0],
      u = n[1];
    if (!i && He(e))
      return Oe(function (s) {
        return $(s, r, t);
      })(F(e));
    if (!i) throw new TypeError("Invalid event target");
    return new I(function (s) {
      var f = function () {
        for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
        return s.next(1 < a.length ? a : a[0]);
      };
      return (
        i(f),
        function () {
          return u(f);
        }
      );
    });
  }
  function kt(e, r) {
    return function (t) {
      return function (o) {
        return e[t](r, o);
      };
    };
  }
  function Go(e) {
    return O(e.addListener) && O(e.removeListener);
  }
  function Bo(e) {
    return O(e.on) && O(e.off);
  }
  function Zo(e) {
    return O(e.addEventListener) && O(e.removeEventListener);
  }
  function vr(e, r, t) {
    e === void 0 && (e = 0), t === void 0 && (t = bt);
    var o = -1;
    return (
      r != null && (or(r) ? (t = r) : (o = r)),
      new I(function (n) {
        var i = It(e) ? +e - t.now() : e;
        i < 0 && (i = 0);
        var u = 0;
        return t.schedule(function () {
          n.closed ||
            (n.next(u++), 0 <= o ? this.schedule(void 0, o) : n.complete());
        }, i);
      })
    );
  }
  function q() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ne(e),
      o = wt(e, 1 / 0),
      n = e;
    return n.length ? (n.length === 1 ? F(n[0]) : dr(o)(B(n, t))) : Re;
  }
  var Ne = new I(se);
  var en = Array.isArray;
  function xr(e) {
    return e.length === 1 && en(e[0]) ? e[0] : e;
  }
  function _e(e, r) {
    return A(function (t, o) {
      var n = 0;
      t.subscribe(
        P(o, function (i) {
          return e.call(r, i, n++) && o.next(i);
        })
      );
    });
  }
  function Ft() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ve(e),
      o = xr(e);
    return o.length
      ? new I(function (n) {
          var i = o.map(function () {
              return [];
            }),
            u = o.map(function () {
              return !1;
            });
          n.add(function () {
            i = u = null;
          });
          for (
            var s = function (a) {
                F(o[a]).subscribe(
                  P(
                    n,
                    function (c) {
                      if (
                        (i[a].push(c),
                        i.every(function (l) {
                          return l.length;
                        }))
                      ) {
                        var p = i.map(function (l) {
                          return l.shift();
                        });
                        n.next(t ? t.apply(void 0, k([], R(p))) : p),
                          i.some(function (l, v) {
                            return !l.length && u[v];
                          }) && n.complete();
                      }
                    },
                    function () {
                      (u[a] = !0), !i[a].length && n.complete();
                    }
                  )
                );
              },
              f = 0;
            !n.closed && f < o.length;
            f++
          )
            s(f);
          return function () {
            i = u = null;
          };
        })
      : Re;
  }
  function Wt(e) {
    return A(function (r, t) {
      var o = !1,
        n = null,
        i = null,
        u = !1,
        s = function () {
          if ((i == null || i.unsubscribe(), (i = null), o)) {
            o = !1;
            var a = n;
            (n = null), t.next(a);
          }
          u && t.complete();
        },
        f = function () {
          (i = null), u && t.complete();
        };
      r.subscribe(
        P(
          t,
          function (a) {
            (o = !0), (n = a), i || F(e(a)).subscribe((i = P(t, s, f)));
          },
          function () {
            (u = !0), (!o || !i || i.closed) && t.complete();
          }
        )
      );
    });
  }
  function jr(e, r) {
    return (
      r === void 0 && (r = Ee),
      Wt(function () {
        return vr(e, r);
      })
    );
  }
  function Vr(e, r) {
    return (
      r === void 0 && (r = null),
      (r = r != null ? r : e),
      A(function (t, o) {
        var n = [],
          i = 0;
        t.subscribe(
          P(
            o,
            function (u) {
              var s,
                f,
                a,
                c,
                p = null;
              i++ % r === 0 && n.push([]);
              try {
                for (var l = X(n), v = l.next(); !v.done; v = l.next()) {
                  var h = v.value;
                  h.push(u),
                    e <= h.length && ((p = p != null ? p : []), p.push(h));
                }
              } catch (w) {
                s = { error: w };
              } finally {
                try {
                  v && !v.done && (f = l.return) && f.call(l);
                } finally {
                  if (s) throw s.error;
                }
              }
              if (p)
                try {
                  for (var m = X(p), x = m.next(); !x.done; x = m.next()) {
                    var h = x.value;
                    ce(n, h), o.next(h);
                  }
                } catch (w) {
                  a = { error: w };
                } finally {
                  try {
                    x && !x.done && (c = m.return) && c.call(m);
                  } finally {
                    if (a) throw a.error;
                  }
                }
            },
            function () {
              var u, s;
              try {
                for (var f = X(n), a = f.next(); !a.done; a = f.next()) {
                  var c = a.value;
                  o.next(c);
                }
              } catch (p) {
                u = { error: p };
              } finally {
                try {
                  a && !a.done && (s = f.return) && s.call(f);
                } finally {
                  if (u) throw u.error;
                }
              }
              o.complete();
            },
            void 0,
            function () {
              n = null;
            }
          )
        );
      })
    );
  }
  function $r() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ve(e);
    return t
      ? lt($r.apply(void 0, k([], R(e))), ke(t))
      : A(function (o, n) {
          zr(k([o], R(xr(e))))(n);
        });
  }
  function Nr() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return $r.apply(void 0, k([], R(e)));
  }
  function qr(e, r) {
    return (
      r === void 0 && (r = Ee),
      A(function (t, o) {
        var n = null,
          i = null,
          u = null,
          s = function () {
            if (n) {
              n.unsubscribe(), (n = null);
              var a = i;
              (i = null), o.next(a);
            }
          };
        function f() {
          var a = u + e,
            c = r.now();
          if (c < a) {
            (n = this.schedule(void 0, a - c)), o.add(n);
            return;
          }
          s();
        }
        t.subscribe(
          P(
            o,
            function (a) {
              (i = a), (u = r.now()), n || ((n = r.schedule(f, e)), o.add(n));
            },
            function () {
              s(), o.complete();
            },
            void 0,
            function () {
              i = n = null;
            }
          )
        );
      })
    );
  }
  function We(e) {
    return e <= 0
      ? function () {
          return Re;
        }
      : A(function (r, t) {
          var o = 0;
          r.subscribe(
            P(t, function (n) {
              ++o <= e && (t.next(n), e <= o && t.complete());
            })
          );
        });
  }
  function Ut() {
    return A(function (e, r) {
      e.subscribe(P(r, se));
    });
  }
  function zt(e) {
    return L(function () {
      return e;
    });
  }
  function Dr(e, r) {
    return r
      ? function (t) {
          return $e(r.pipe(We(1), Ut()), t.pipe(Dr(e)));
        }
      : Oe(function (t, o) {
          return F(e(t, o)).pipe(We(1), zt(t));
        });
  }
  function Qr(e, r) {
    r === void 0 && (r = Ee);
    var t = vr(e, r);
    return Dr(function () {
      return t;
    });
  }
  function pe(e, r) {
    return (
      r === void 0 && (r = G),
      (e = e != null ? e : rn),
      A(function (t, o) {
        var n,
          i = !0;
        t.subscribe(
          P(o, function (u) {
            var s = r(u);
            (i || !e(n, s)) && ((i = !1), (n = s), o.next(u));
          })
        );
      })
    );
  }
  function rn(e, r) {
    return e === r;
  }
  function br(e, r) {
    return pe(function (t, o) {
      return r ? r(t[e], o[e]) : t[e] === o[e];
    });
  }
  function le(e) {
    return A(function (r, t) {
      try {
        r.subscribe(t);
      } finally {
        t.add(e);
      }
    });
  }
  function jt(e) {
    e === void 0 && (e = {});
    var r = e.connector,
      t =
        r === void 0
          ? function () {
              return new K();
            }
          : r,
      o = e.resetOnError,
      n = o === void 0 ? !0 : o,
      i = e.resetOnComplete,
      u = i === void 0 ? !0 : i,
      s = e.resetOnRefCountZero,
      f = s === void 0 ? !0 : s;
    return function (a) {
      var c,
        p,
        l,
        v = 0,
        h = !1,
        m = !1,
        x = function () {
          p == null || p.unsubscribe(), (p = void 0);
        },
        w = function () {
          x(), (c = l = void 0), (h = m = !1);
        },
        E = function () {
          var H = c;
          w(), H == null || H.unsubscribe();
        };
      return A(function (H, d) {
        v++, !m && !h && x();
        var b = (l = l != null ? l : t());
        d.add(function () {
          v--, v === 0 && !m && !h && (p = Kr(E, f));
        }),
          b.subscribe(d),
          !c &&
            v > 0 &&
            ((c = new Se({
              next: function (S) {
                return b.next(S);
              },
              error: function (S) {
                (m = !0), x(), (p = Kr(w, n, S)), b.error(S);
              },
              complete: function () {
                (h = !0), x(), (p = Kr(w, u)), b.complete();
              },
            })),
            F(H).subscribe(c));
      })(a);
    };
  }
  function Kr(e, r) {
    for (var t = [], o = 2; o < arguments.length; o++) t[o - 2] = arguments[o];
    if (r === !0) {
      e();
      return;
    }
    if (r !== !1) {
      var n = new Se({
        next: function () {
          n.unsubscribe(), e();
        },
      });
      return F(r.apply(void 0, k([], R(t)))).subscribe(n);
    }
  }
  function me(e, r, t) {
    var o,
      n,
      i,
      u,
      s = !1;
    return (
      e && typeof e == "object"
        ? ((o = e.bufferSize),
          (u = o === void 0 ? 1 / 0 : o),
          (n = e.windowTime),
          (r = n === void 0 ? 1 / 0 : n),
          (i = e.refCount),
          (s = i === void 0 ? !1 : i),
          (t = e.scheduler))
        : (u = e != null ? e : 1 / 0),
      jt({
        connector: function () {
          return new vt(u, r, t);
        },
        resetOnError: !0,
        resetOnComplete: !1,
        resetOnRefCountZero: s,
      })
    );
  }
  function xe() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ne(e);
    return A(function (o, n) {
      (t ? $e(e, o, t) : $e(e, o)).subscribe(n);
    });
  }
  function D(e, r) {
    return A(function (t, o) {
      var n = null,
        i = 0,
        u = !1,
        s = function () {
          return u && !n && o.complete();
        };
      t.subscribe(
        P(
          o,
          function (f) {
            n == null || n.unsubscribe();
            var a = 0,
              c = i++;
            F(e(f, c)).subscribe(
              (n = P(
                o,
                function (p) {
                  return o.next(r ? r(f, p, c, a++) : p);
                },
                function () {
                  (n = null), s();
                }
              ))
            );
          },
          function () {
            (u = !0), s();
          }
        )
      );
    });
  }
  function he(e, r, t) {
    var o = O(e) || r || t ? { next: e, error: r, complete: t } : e;
    return o
      ? A(function (n, i) {
          var u;
          (u = o.subscribe) === null || u === void 0 || u.call(o);
          var s = !0;
          n.subscribe(
            P(
              i,
              function (f) {
                var a;
                (a = o.next) === null || a === void 0 || a.call(o, f),
                  i.next(f);
              },
              function () {
                var f;
                (s = !1),
                  (f = o.complete) === null || f === void 0 || f.call(o),
                  i.complete();
              },
              function (f) {
                var a;
                (s = !1),
                  (a = o.error) === null || a === void 0 || a.call(o, f),
                  i.error(f);
              },
              function () {
                var f, a;
                s &&
                  ((f = o.unsubscribe) === null || f === void 0 || f.call(o)),
                  (a = o.finalize) === null || a === void 0 || a.call(o);
              }
            )
          );
        })
      : G;
  }
  function Ue() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    var t = ve(e);
    return A(function (o, n) {
      for (
        var i = e.length,
          u = new Array(i),
          s = e.map(function () {
            return !1;
          }),
          f = !1,
          a = function (p) {
            F(e[p]).subscribe(
              P(
                n,
                function (l) {
                  (u[p] = l),
                    !f &&
                      !s[p] &&
                      ((s[p] = !0), (f = s.every(G)) && (s = null));
                },
                se
              )
            );
          },
          c = 0;
        c < i;
        c++
      )
        a(c);
      o.subscribe(
        P(n, function (p) {
          if (f) {
            var l = k([p], R(u));
            n.next(t ? t.apply(void 0, k([], R(l))) : l);
          }
        })
      );
    });
  }
  function Vt() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return A(function (t, o) {
      Ft.apply(void 0, k([t], R(e))).subscribe(o);
    });
  }
  function Jr() {
    for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
    return Vt.apply(void 0, k([], R(e)));
  }
  function $t(e, r = document) {
    return Array.from(r.querySelectorAll(e));
  }
  function ae(e, r = document) {
    let t = yr(e, r);
    if (typeof t == "undefined")
      throw new ReferenceError(
        `Missing element: expected "${e}" to be present`
      );
    return t;
  }
  function yr(e, r = document) {
    return r.querySelector(e) || void 0;
  }
  function Yr() {
    var e, r, t, o;
    return (o =
      (t =
        (r = (e = document.activeElement) == null ? void 0 : e.shadowRoot) ==
        null
          ? void 0
          : r.activeElement) != null
        ? t
        : document.activeElement) != null
      ? o
      : void 0;
  }
  var tn = q($(document.body, "focusin"), $(document.body, "focusout")).pipe(
    qr(1),
    xe(void 0),
    L(() => Yr() || document.body),
    me(1)
  );
  function Nt(e) {
    return tn.pipe(
      L((r) => e.contains(r)),
      pe()
    );
  }
  function qt(e, r) {
    if (typeof r == "string" || typeof r == "number")
      e.innerHTML += r.toString();
    else if (r instanceof Node) e.appendChild(r);
    else if (Array.isArray(r)) for (let t of r) qt(e, t);
  }
  function Y(e, r, ...t) {
    let o = document.createElement(e);
    if (r)
      for (let n of Object.keys(r))
        typeof r[n] != "undefined" &&
          (typeof r[n] != "boolean"
            ? o.setAttribute(n, r[n])
            : o.setAttribute(n, ""));
    for (let n of t) qt(o, n);
    return o;
  }
  function Dt(e) {
    if (e > 999) {
      let r = +((e - 950) % 1e3 > 99);
      return `${((e + 1e-6) / 1e3).toFixed(r)}k`;
    } else return e.toString();
  }
  function Qt(e) {
    let r = Y("script", { src: e });
    return Te(
      () => (
        document.head.appendChild(r),
        q(
          $(r, "load"),
          $(r, "error").pipe(
            D(() => Ur(() => new ReferenceError(`Invalid script: ${e}`)))
          )
        ).pipe(
          L(() => {}),
          le(() => document.head.removeChild(r)),
          We(1)
        )
      )
    );
  }
  var on = new K(),
    Up = Te(() =>
      typeof ResizeObserver == "undefined"
        ? Qt("https://unpkg.com/resize-observer-polyfill")
        : ie(void 0)
    ).pipe(
      L(() => new ResizeObserver((e) => e.forEach((r) => on.next(r)))),
      D((e) => q(Ne, ie(e)).pipe(le(() => e.disconnect()))),
      me(1)
    );
  function Kt(e) {
    return { width: e.offsetWidth, height: e.offsetHeight };
  }
  function Jt(e) {
    return { width: e.scrollWidth, height: e.scrollHeight };
  }
  function Yt(e) {
    return { x: e.scrollLeft, y: e.scrollTop };
  }
  function Xt(e) {
    return q($(e, "scroll"), $(window, "scroll"), $(window, "resize")).pipe(
      jr(0, Fr),
      L(() => Yt(e)),
      xe(Yt(e))
    );
  }
  var nn = new K(),
    tl = Te(() =>
      ie(
        new IntersectionObserver(
          (e) => {
            for (let r of e) nn.next(r);
          },
          { threshold: 0 }
        )
      )
    ).pipe(
      D((e) => q(Ne, ie(e)).pipe(le(() => e.disconnect()))),
      me(1)
    );
  function Gt(e, r = 16) {
    return Xt(e).pipe(
      L(({ y: t }) => {
        let o = Kt(e),
          n = Jt(e);
        return t >= n.height - o.height - r;
      }),
      pe()
    );
  }
  var ll = {
    drawer: ae("[data-md-toggle=drawer]"),
    search: ae("[data-md-toggle=search]"),
  };
  var an = ae("#__config"),
    qe = JSON.parse(an.textContent);
  qe.base = `${new URL(qe.base, eo())}`;
  function Bt() {
    return qe;
  }
  function Zt(e, r) {
    return typeof r != "undefined"
      ? qe.translations[e].replace("#", r.toString())
      : qe.translations[e];
  }
  function eo() {
    return new URL(location.href);
  }
  function un(e, r) {
    return new I((t) => {
      let o = new XMLHttpRequest();
      return (
        o.open("GET", `${e}`),
        (o.responseType = "blob"),
        o.addEventListener("load", () => {
          o.status >= 200 && o.status < 300
            ? (t.next(o.response), t.complete())
            : t.error(new Error(o.statusText));
        }),
        o.addEventListener("error", () => {
          t.error(new Error("Network error"));
        }),
        o.addEventListener("abort", () => {
          t.complete();
        }),
        typeof (r == null ? void 0 : r.progress$) != "undefined" &&
          (o.addEventListener("progress", (n) => {
            var i;
            if (n.lengthComputable)
              r.progress$.next((n.loaded / n.total) * 100);
            else {
              let u =
                (i = o.getResponseHeader("Content-Length")) != null ? i : 0;
              r.progress$.next((n.loaded / +u) * 100);
            }
          }),
          r.progress$.next(5)),
        o.send(),
        () => o.abort()
      );
    });
  }
  function gr(e, r) {
    return un(e, r).pipe(
      D((t) => t.text()),
      L((t) => JSON.parse(t)),
      me(1)
    );
  }
  function Xr(e, r = document) {
    return ae(`[data-mdx-component=${e}]`, r);
  }
  function be(e, r = document) {
    return $t(`[data-mdx-component=${e}]`, r);
  }
  function ro(e) {
    let r = Nt(e),
      t = q($(e, "keyup"), $(e, "focus").pipe(Qr(1))).pipe(
        L(() => e.value),
        xe(e.value),
        pe()
      );
    return (
      r
        .pipe(
          _e((o) => !o),
          Ue(t)
        )
        .subscribe(([, o]) => {
          let n = document.location.pathname;
          typeof ga == "function" &&
            o.length &&
            ga("send", "pageview", `${n}?q=[icon]+${o}`);
        }),
      Fe([t, r]).pipe(L(([o, n]) => ({ ref: e, value: o, focus: n })))
    );
  }
  var Zr = ot(Br());
  var po = ot(Br());
  function so(e, r) {
    return (0, po.wrap)(e.shortcode, r, {
      wrap: { tagOpen: "<b>", tagClose: "</b>" },
    });
  }
  function lo(e, r, t) {
    return Y(
      "li",
      { class: "mdx-iconsearch-result__item" },
      Y("span", { class: "twemoji" }, Y("img", { src: e.url })),
      Y(
        "button",
        {
          class: "md-clipboard--inline",
          title: Zt("clipboard.copy"),
          "data-clipboard-text": t ? e.shortcode : `:${e.shortcode}:`,
        },
        Y("code", null, t ? so(e, r) : `:${so(e, r)}:`)
      )
    );
  }
  function mo(e) {
    let r = `@${e.name}`;
    return Y(
      "a",
      { href: e.url, title: r, class: "mdx-sponsorship__item" },
      Y("img", { src: e.image })
    );
  }
  function ho(e) {
    return Y(
      "a",
      {
        href: "https://github.com/sponsors/squidfunk?metadata_origin=docs",
        class: "mdx-sponsorship__item mdx-sponsorship__item--private",
      },
      "+",
      e
    );
  }
  function fn(e, { index$: r, query$: t, mode$: o }) {
    switch (e.getAttribute("data-mdx-mode")) {
      case "file":
        return Fe([
          t.pipe(br("value")),
          r.pipe(
            L(({ icons: n }) =>
              Object.values(n.data).map((i) => i.replace(/\.svg$/, ""))
            )
          ),
        ]).pipe(
          L(([{ value: n }, i]) => (0, Zr.filter)(i, n)),
          D((n) =>
            r.pipe(
              L(({ icons: i }) => ({
                data: n.map((u) => ({
                  shortcode: u,
                  url: [i.base, u, ".svg"].join(""),
                })),
              }))
            )
          )
        );
      default:
        return Fe([
          t.pipe(br("value")),
          r.pipe(
            Nr(o),
            L(([{ icons: n, emojis: i }, u]) => [
              ...(["all", "icons"].includes(u) ? Object.keys(n.data) : []),
              ...(["all", "emojis"].includes(u) ? Object.keys(i.data) : []),
            ])
          ),
        ]).pipe(
          L(([{ value: n }, i]) => (0, Zr.filter)(i, n)),
          D((n) =>
            r.pipe(
              L(({ icons: i, emojis: u }) => ({
                data: n.map((s) => {
                  let f = s in i.data ? i : u;
                  return { shortcode: s, url: [f.base, f.data[s]].join("") };
                }),
              }))
            )
          )
        );
    }
  }
  function vo(e, { index$: r, query$: t, mode$: o }) {
    let n = new K(),
      i = Gt(e).pipe(_e(Boolean)),
      u = ae(".mdx-iconsearch-result__meta", e);
    n.pipe(Ue(t)).subscribe(([{ data: a }, { value: c }]) => {
      if (c)
        switch (a.length) {
          case 0:
            u.textContent = "No matches";
            break;
          case 1:
            u.textContent = "1 match";
            break;
          default:
            u.textContent = `${Dt(a.length)} matches`;
        }
      else u.textContent = "Type to start searching";
    });
    let s = e.getAttribute("data-mdx-mode") === "file",
      f = ae(":scope > :last-child", e);
    return (
      n
        .pipe(
          he(() => (f.innerHTML = "")),
          D(({ data: a }) =>
            q(
              ie(...a.slice(0, 10)),
              ie(...a.slice(10)).pipe(
                Vr(10),
                Jr(i),
                D(([c]) => c)
              )
            )
          ),
          Ue(t)
        )
        .subscribe(([a, { value: c }]) => f.appendChild(lo(a, c, s))),
      fn(e, { query$: t, index$: r, mode$: o }).pipe(
        he((a) => n.next(a)),
        le(() => n.complete()),
        L((a) => Je({ ref: e }, a))
      )
    );
  }
  function xo(e) {
    let r = Bt(),
      t = gr(new URL("assets/javascripts/iconsearch_index.json", r.base)),
      o = Xr("iconsearch-query", e),
      n = Xr("iconsearch-result", e),
      i = new Hr("all"),
      u = be("iconsearch-select", e);
    for (let a of u)
      $(a, "change")
        .pipe(L((c) => c.target.value))
        .subscribe(i);
    let s = ro(o),
      f = vo(n, { index$: t, query$: s, mode$: i });
    return q(s, f);
  }
  function bo(e) {
    let r = gr("https://3if8u9o552.execute-api.us-east-1.amazonaws.com/_/"),
      t = be("sponsorship-count"),
      o = be("sponsorship-total");
    r
      .pipe(
        D((i) => B(t).pipe(he((u) => (u.innerText = `${i.sponsors.length}`))))
      )
      .subscribe(() => e.removeAttribute("hidden")),
      r
        .pipe(
          D((i) =>
            B(o).pipe(
              he(
                (u) =>
                  (u.innerText = `$ ${i.total
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} a month`)
              )
            )
          )
        )
        .subscribe();
    let n = yr(":scope > .mdx-sponsorship__list", e);
    return (
      n &&
        t.length &&
        r.subscribe((i) => {
          for (let u of i.sponsors)
            u.type === "public" && n.appendChild(mo(u.user));
          n.appendChild(
            ho(i.sponsors.filter(({ type: u }) => u === "private").length)
          );
        }),
      r.pipe(L((i) => Je({ ref: e }, i)))
    );
  }
  function yo() {
    let { origin: e } = new URL(location.href);
    $(document.body, "click").subscribe((r) => {
      if (r.target instanceof HTMLElement) {
        let t = r.target.closest("a");
        t && t.origin !== e && ga("send", "event", "outbound", "click", t.href);
      }
    });
  }
  yo();
  var cn = document$.pipe(
    D(() =>
      q(
        ...be("iconsearch").map((e) => xo(e)),
        ...be("sponsorship").map((e) => bo(e))
      )
    )
  );
  cn.subscribe();
})();
