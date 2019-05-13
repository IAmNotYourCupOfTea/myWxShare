require = function s(i, a, c) {
function l(e, t) {
if (!a[e]) {
if (!i[e]) {
var r = "function" == typeof require && require;
if (!t && r) return r(e, !0);
if (h) return h(e, !0);
var o = new Error("Cannot find module '" + e + "'");
throw o.code = "MODULE_NOT_FOUND", o;
}
var n = a[e] = {
exports: {}
};
i[e][0].call(n.exports, function(t) {
return l(i[e][1][t] || t);
}, n, n.exports, s, i, a, c);
}
return a[e].exports;
}
for (var h = "function" == typeof require && require, t = 0; t < c.length; t++) l(c[t]);
return l;
}({
MagicQRCode: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "69af4WwjVFLdLtHv2eg8twD", "MagicQRCode");
function o(t) {
this.mode = n.MODE_8BIT_BYTE;
this.data = t;
}
o.prototype = {
getLength: function(t) {
return this.data.length;
},
write: function(t) {
for (var e = 0; e < this.data.length; e++) t.put(this.data.charCodeAt(e), 8);
}
};
var h = function(t, e) {
this.typeNumber = t;
this.errorCorrectLevel = e;
this.modules = null;
this.moduleCount = 0;
this.dataCache = null;
this.dataList = new Array();
};
h.prototype = {
addData: function(t) {
var e = new o(t);
this.dataList.push(e);
this.dataCache = null;
},
isDark: function(t, e) {
if (t < 0 || this.moduleCount <= t || e < 0 || this.moduleCount <= e) throw new Error(t + "," + e);
return this.modules[t][e];
},
getModuleCount: function() {
return this.moduleCount;
},
make: function() {
if (this.typeNumber < 1) {
var t = 1;
for (t = 1; t < 40; t++) {
for (var e = L.getRSBlocks(t, this.errorCorrectLevel), r = new E(), o = 0, n = 0; n < e.length; n++) o += e[n].dataCount;
for (var s = 0; s < this.dataList.length; s++) {
var i = this.dataList[s];
r.put(i.mode, 4);
r.put(i.getLength(), w.getLengthInBits(i.mode, t));
i.write(r);
}
if (r.getLengthInBits() <= 8 * o) break;
}
this.typeNumber = t;
}
this.makeImpl(!1, this.getBestMaskPattern());
},
makeImpl: function(t, e) {
this.moduleCount = 4 * this.typeNumber + 17;
this.modules = new Array(this.moduleCount);
for (var r = 0; r < this.moduleCount; r++) {
this.modules[r] = new Array(this.moduleCount);
for (var o = 0; o < this.moduleCount; o++) this.modules[r][o] = null;
}
this.setupPositionProbePattern(0, 0);
this.setupPositionProbePattern(this.moduleCount - 7, 0);
this.setupPositionProbePattern(0, this.moduleCount - 7);
this.setupPositionAdjustPattern();
this.setupTimingPattern();
this.setupTypeInfo(t, e);
7 <= this.typeNumber && this.setupTypeNumber(t);
null == this.dataCache && (this.dataCache = h.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
this.mapData(this.dataCache, e);
},
setupPositionProbePattern: function(t, e) {
for (var r = -1; r <= 7; r++) if (!(t + r <= -1 || this.moduleCount <= t + r)) for (var o = -1; o <= 7; o++) e + o <= -1 || this.moduleCount <= e + o || (this.modules[t + r][e + o] = 0 <= r && r <= 6 && (0 == o || 6 == o) || 0 <= o && o <= 6 && (0 == r || 6 == r) || 2 <= r && r <= 4 && 2 <= o && o <= 4);
},
getBestMaskPattern: function() {
for (var t = 0, e = 0, r = 0; r < 8; r++) {
this.makeImpl(!0, r);
var o = w.getLostPoint(this);
if (0 == r || o < t) {
t = o;
e = r;
}
}
return e;
},
createMovieClip: function(t, e, r) {
var o = t.createEmptyMovieClip(e, r);
this.make();
for (var n = 0; n < this.modules.length; n++) for (var s = 1 * n, i = 0; i < this.modules[n].length; i++) {
var a = 1 * i;
if (this.modules[n][i]) {
o.beginFill(0, 100);
o.moveTo(a, s);
o.lineTo(a + 1, s);
o.lineTo(a + 1, s + 1);
o.lineTo(a, s + 1);
o.endFill();
}
}
return o;
},
setupTimingPattern: function() {
for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = t % 2 == 0);
for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[6][e] && (this.modules[6][e] = e % 2 == 0);
},
setupPositionAdjustPattern: function() {
for (var t = w.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++) for (var r = 0; r < t.length; r++) {
var o = t[e], n = t[r];
if (null == this.modules[o][n]) for (var s = -2; s <= 2; s++) for (var i = -2; i <= 2; i++) this.modules[o + s][n + i] = -2 == s || 2 == s || -2 == i || 2 == i || 0 == s && 0 == i;
}
},
setupTypeNumber: function(t) {
for (var e = w.getBCHTypeNumber(this.typeNumber), r = 0; r < 18; r++) {
var o = !t && 1 == (e >> r & 1);
this.modules[Math.floor(r / 3)][r % 3 + this.moduleCount - 8 - 3] = o;
}
for (var n = 0; n < 18; n++) {
var s = !t && 1 == (e >> n & 1);
this.modules[n % 3 + this.moduleCount - 8 - 3][Math.floor(n / 3)] = s;
}
},
setupTypeInfo: function(t, e) {
for (var r = this.errorCorrectLevel << 3 | e, o = w.getBCHTypeInfo(r), n = 0; n < 15; n++) {
var s = !t && 1 == (o >> n & 1);
n < 6 ? this.modules[n][8] = s : n < 8 ? this.modules[n + 1][8] = s : this.modules[this.moduleCount - 15 + n][8] = s;
}
for (var i = 0; i < 15; i++) {
var a = !t && 1 == (o >> i & 1);
i < 8 ? this.modules[8][this.moduleCount - i - 1] = a : i < 9 ? this.modules[8][15 - i - 1 + 1] = a : this.modules[8][15 - i - 1] = a;
}
this.modules[this.moduleCount - 8][8] = !t;
},
mapData: function(t, e) {
for (var r = -1, o = this.moduleCount - 1, n = 7, s = 0, i = this.moduleCount - 1; 0 < i; i -= 2) {
6 == i && i--;
for (;;) {
for (var a = 0; a < 2; a++) if (null == this.modules[o][i - a]) {
var c = !1;
s < t.length && (c = 1 == (t[s] >>> n & 1));
w.getMask(e, o, i - a) && (c = !c);
this.modules[o][i - a] = c;
if (-1 == --n) {
s++;
n = 7;
}
}
if ((o += r) < 0 || this.moduleCount <= o) {
o -= r;
r = -r;
break;
}
}
}
}
};
h.PAD0 = 236;
h.PAD1 = 17;
h.createData = function(t, e, r) {
for (var o = L.getRSBlocks(t, e), n = new E(), s = 0; s < r.length; s++) {
var i = r[s];
n.put(i.mode, 4);
n.put(i.getLength(), w.getLengthInBits(i.mode, t));
i.write(n);
}
for (var a = 0, c = 0; c < o.length; c++) a += o[c].dataCount;
if (n.getLengthInBits() > 8 * a) throw new Error("code length overflow. (" + n.getLengthInBits() + ">" + 8 * a + ")");
n.getLengthInBits() + 4 <= 8 * a && n.put(0, 4);
for (;n.getLengthInBits() % 8 != 0; ) n.putBit(!1);
for (;!(n.getLengthInBits() >= 8 * a); ) {
n.put(h.PAD0, 8);
if (n.getLengthInBits() >= 8 * a) break;
n.put(h.PAD1, 8);
}
return h.createBytes(n, o);
};
h.createBytes = function(t, e) {
for (var r = 0, o = 0, n = 0, s = new Array(e.length), i = new Array(e.length), a = 0; a < e.length; a++) {
var c = e[a].dataCount, l = e[a].totalCount - c;
o = Math.max(o, c);
n = Math.max(n, l);
s[a] = new Array(c);
for (var h = 0; h < s[a].length; h++) s[a][h] = 255 & t.buffer[h + r];
r += c;
var u = w.getErrorCorrectPolynomial(l), f = new _(s[a], u.getLength() - 1).mod(u);
i[a] = new Array(u.getLength() - 1);
for (var g = 0; g < i[a].length; g++) {
var d = g + f.getLength() - i[a].length;
i[a][g] = 0 <= d ? f.get(d) : 0;
}
}
for (var m = 0, v = 0; v < e.length; v++) m += e[v].totalCount;
for (var p = new Array(m), y = 0, B = 0; B < o; B++) for (var S = 0; S < e.length; S++) B < s[S].length && (p[y++] = s[S][B]);
for (var C = 0; C < n; C++) for (var L = 0; L < e.length; L++) C < i[L].length && (p[y++] = i[L][C]);
return p;
};
for (var n = {
MODE_NUMBER: 1,
MODE_ALPHA_NUM: 2,
MODE_8BIT_BYTE: 4,
MODE_KANJI: 8
}, s = 1, i = 0, a = 3, c = 2, l = 0, u = 1, f = 2, g = 3, d = 4, m = 5, v = 6, p = 7, w = {
PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
G15: 1335,
G18: 7973,
G15_MASK: 21522,
getBCHTypeInfo: function(t) {
for (var e = t << 10; 0 <= w.getBCHDigit(e) - w.getBCHDigit(w.G15); ) e ^= w.G15 << w.getBCHDigit(e) - w.getBCHDigit(w.G15);
return (t << 10 | e) ^ w.G15_MASK;
},
getBCHTypeNumber: function(t) {
for (var e = t << 12; 0 <= w.getBCHDigit(e) - w.getBCHDigit(w.G18); ) e ^= w.G18 << w.getBCHDigit(e) - w.getBCHDigit(w.G18);
return t << 12 | e;
},
getBCHDigit: function(t) {
for (var e = 0; 0 != t; ) {
e++;
t >>>= 1;
}
return e;
},
getPatternPosition: function(t) {
return w.PATTERN_POSITION_TABLE[t - 1];
},
getMask: function(t, e, r) {
switch (t) {
case l:
return (e + r) % 2 == 0;

case u:
return e % 2 == 0;

case f:
return r % 3 == 0;

case g:
return (e + r) % 3 == 0;

case d:
return (Math.floor(e / 2) + Math.floor(r / 3)) % 2 == 0;

case m:
return e * r % 2 + e * r % 3 == 0;

case v:
return (e * r % 2 + e * r % 3) % 2 == 0;

case p:
return (e * r % 3 + (e + r) % 2) % 2 == 0;

default:
throw new Error("bad maskPattern:" + t);
}
},
getErrorCorrectPolynomial: function(t) {
for (var e = new _([ 1 ], 0), r = 0; r < t; r++) e = e.multiply(new _([ 1, y.gexp(r) ], 0));
return e;
},
getLengthInBits: function(t, e) {
if (1 <= e && e < 10) switch (t) {
case n.MODE_NUMBER:
return 10;

case n.MODE_ALPHA_NUM:
return 9;

case n.MODE_8BIT_BYTE:
case n.MODE_KANJI:
return 8;

default:
throw new Error("mode:" + t);
} else if (e < 27) switch (t) {
case n.MODE_NUMBER:
return 12;

case n.MODE_ALPHA_NUM:
return 11;

case n.MODE_8BIT_BYTE:
return 16;

case n.MODE_KANJI:
return 10;

default:
throw new Error("mode:" + t);
} else {
if (!(e < 41)) throw new Error("type:" + e);
switch (t) {
case n.MODE_NUMBER:
return 14;

case n.MODE_ALPHA_NUM:
return 13;

case n.MODE_8BIT_BYTE:
return 16;

case n.MODE_KANJI:
return 12;

default:
throw new Error("mode:" + t);
}
}
},
getLostPoint: function(t) {
for (var e = t.getModuleCount(), r = 0, o = 0; o < e; o++) for (var n = 0; n < e; n++) {
for (var s = 0, i = t.isDark(o, n), a = -1; a <= 1; a++) if (!(o + a < 0 || e <= o + a)) for (var c = -1; c <= 1; c++) n + c < 0 || e <= n + c || 0 == a && 0 == c || i == t.isDark(o + a, n + c) && s++;
5 < s && (r += 3 + s - 5);
}
for (var l = 0; l < e - 1; l++) for (var h = 0; h < e - 1; h++) {
var u = 0;
t.isDark(l, h) && u++;
t.isDark(l + 1, h) && u++;
t.isDark(l, h + 1) && u++;
t.isDark(l + 1, h + 1) && u++;
0 != u && 4 != u || (r += 3);
}
for (var f = 0; f < e; f++) for (var g = 0; g < e - 6; g++) t.isDark(f, g) && !t.isDark(f, g + 1) && t.isDark(f, g + 2) && t.isDark(f, g + 3) && t.isDark(f, g + 4) && !t.isDark(f, g + 5) && t.isDark(f, g + 6) && (r += 40);
for (var d = 0; d < e; d++) for (var m = 0; m < e - 6; m++) t.isDark(m, d) && !t.isDark(m + 1, d) && t.isDark(m + 2, d) && t.isDark(m + 3, d) && t.isDark(m + 4, d) && !t.isDark(m + 5, d) && t.isDark(m + 6, d) && (r += 40);
for (var v = 0, p = 0; p < e; p++) for (var y = 0; y < e; y++) t.isDark(y, p) && v++;
return r += 10 * (Math.abs(100 * v / e / e - 50) / 5);
}
}, y = {
glog: function(t) {
if (t < 1) throw new Error("glog(" + t + ")");
return y.LOG_TABLE[t];
},
gexp: function(t) {
for (;t < 0; ) t += 255;
for (;256 <= t; ) t -= 255;
return y.EXP_TABLE[t];
},
EXP_TABLE: new Array(256),
LOG_TABLE: new Array(256)
}, B = 0; B < 8; B++) y.EXP_TABLE[B] = 1 << B;
for (var S = 8; S < 256; S++) y.EXP_TABLE[S] = y.EXP_TABLE[S - 4] ^ y.EXP_TABLE[S - 5] ^ y.EXP_TABLE[S - 6] ^ y.EXP_TABLE[S - 8];
for (var C = 0; C < 255; C++) y.LOG_TABLE[y.EXP_TABLE[C]] = C;
function _(t, e) {
if (null == t.length) throw new Error(t.length + "/" + e);
for (var r = 0; r < t.length && 0 == t[r]; ) r++;
this.num = new Array(t.length - r + e);
for (var o = 0; o < t.length - r; o++) this.num[o] = t[o + r];
}
_.prototype = {
get: function(t) {
return this.num[t];
},
getLength: function() {
return this.num.length;
},
multiply: function(t) {
for (var e = new Array(this.getLength() + t.getLength() - 1), r = 0; r < this.getLength(); r++) for (var o = 0; o < t.getLength(); o++) e[r + o] ^= y.gexp(y.glog(this.get(r)) + y.glog(t.get(o)));
return new _(e, 0);
},
mod: function(t) {
if (this.getLength() - t.getLength() < 0) return this;
for (var e = y.glog(this.get(0)) - y.glog(t.get(0)), r = new Array(this.getLength()), o = 0; o < this.getLength(); o++) r[o] = this.get(o);
for (var n = 0; n < t.getLength(); n++) r[n] ^= y.gexp(y.glog(t.get(n)) + e);
return new _(r, 0).mod(t);
}
};
function L(t, e) {
this.totalCount = t;
this.dataCount = e;
}
L.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ];
L.getRSBlocks = function(t, e) {
var r = L.getRsBlockTable(t, e);
if (null == r) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + e);
for (var o = r.length / 3, n = new Array(), s = 0; s < o; s++) for (var i = r[3 * s + 0], a = r[3 * s + 1], c = r[3 * s + 2], l = 0; l < i; l++) n.push(new L(a, c));
return n;
};
L.getRsBlockTable = function(t, e) {
switch (e) {
case s:
return L.RS_BLOCK_TABLE[4 * (t - 1) + 0];

case i:
return L.RS_BLOCK_TABLE[4 * (t - 1) + 1];

case a:
return L.RS_BLOCK_TABLE[4 * (t - 1) + 2];

case c:
return L.RS_BLOCK_TABLE[4 * (t - 1) + 3];

default:
return;
}
};
function E() {
this.buffer = new Array();
this.length = 0;
}
E.prototype = {
get: function(t) {
var e = Math.floor(t / 8);
return 1 == (this.buffer[e] >>> 7 - t % 8 & 1);
},
put: function(t, e) {
for (var r = 0; r < e; r++) this.putBit(1 == (t >>> e - r - 1 & 1));
},
getLengthInBits: function() {
return this.length;
},
putBit: function(t) {
var e = Math.floor(this.length / 8);
this.buffer.length <= e && this.buffer.push(0);
t && (this.buffer[e] |= 128 >>> this.length % 8);
this.length++;
}
};
var P = cc.Class({
extends: cc.Graphics,
properties: {
string: {
default: "Hello World!",
notify: function(t) {
this.string !== t && this.setContent();
}
},
backColor: {
type: cc.Color,
default: cc.Color.WHITE,
notify: function() {
this.setContent();
}
},
foreColor: {
type: cc.Color,
default: cc.Color.BLACK,
notify: function(t) {
this.node.color = this.fillColor;
this.setContent();
}
},
margin: {
type: cc.Float,
default: 10,
notify: function(t) {
t !== this.margin && this.setContent();
}
},
_size: 200,
size: {
type: cc.Float,
get: function() {
return this._size;
},
set: function(t) {
if (this._size !== t) {
this.node.setContentSize(t, t);
this.setContent();
this._size = t;
}
}
}
},
onLoad: function() {
this.node.setContentSize(200, 200);
this.setContent();
},
setContent: function() {
this.clear();
this._sgNode.fillColor = this.backColor;
var t = this.node.width;
this.rect(0, 0, t, t);
this.fill();
this.close();
var e = new h(-1, 2);
e.addData(this.string);
e.make();
this._sgNode.fillColor = this.foreColor;
for (var r = t - 2 * this.margin, o = e.getModuleCount(), n = r / o, s = r / o, i = Math.ceil(n), a = Math.ceil(s), c = 0; c < o; c++) for (var l = 0; l < o; l++) if (e.isDark(c, l)) {
this.rect(this.margin + l * n, r - s - Math.round(c * s) + this.margin, i, a);
this.fill();
}
}
});
cc.Class.Attr.setClassAttr(P, "lineWidth", "visible", !1);
cc.Class.Attr.setClassAttr(P, "lineJoin", "visible", !1);
cc.Class.Attr.setClassAttr(P, "lineCap", "visible", !1);
cc.Class.Attr.setClassAttr(P, "strokeColor", "visible", !1);
cc.Class.Attr.setClassAttr(P, "miterLimit", "visible", !1);
cc.Class.Attr.setClassAttr(P, "fillColor", "visible", !1);
e.exports = P;
cc._RF.pop();
}, {} ],
testCom: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "8ff84rl/HZHK4LjyLx4vvpn", "testCom");
Object.defineProperty(r, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, s = o.property;
window.wechatShareByUrlCallBack = function(t) {
h.getInstance().wechatShareByUrlCallBack(t);
};
window.savePictureByUrlCallBack = function(t) {
h.getInstance().savePictureByUrlCallBack(t);
};
window.savePictureByShotSceneCallBack = function(t) {
h.getInstance().savePictureByShotSceneCallBack(t);
};
window.wechatShareByShotSceneCallBack = function(t) {
h.getInstance().wechatShareByShotSceneCallBack(t);
};
var i, a, c, l, h = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.msgInfo = null;
t.saveNode = null;
t.savePictureBySSBtn = null;
t.savePictureByURLBtn = null;
t.shareFriendBySSBtn = null;
t.shareFriendByURLBtn = null;
t.shareTimeLineBySSBtn = null;
t.shareTimeLineByURLBtn = null;
t.samallSaveNode = null;
t.shareFriendImgUrl = "https://www.baidu.com/img/xinshouye_7c5789a51e2bfd441c7fe165691b31a1.png";
t.shareTimeLineImgUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557205472551&di=4fc47ed42f862555da0868fa393e9935&imgtype=0&src=http%3A%2F%2Fossweb-img.qq.com%2Fupload%2Fwebplat%2Finfo%2Ft7%2F20150416%2F1429151246442663.png";
t.savePicUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1557205472551&di=4fc47ed42f862555da0868fa393e9935&imgtype=0&src=http%3A%2F%2Fossweb-img.qq.com%2Fupload%2Fwebplat%2Finfo%2Ft7%2F20150416%2F1429151246442663.png";
return t;
}
(r = t).getInstance = function() {
return r._instance;
};
t.prototype.onLoad = function() {
var t = this;
r._instance = this;
cc.sys.platform == cc.sys.ANDROID ? this.msgInfo.string = "安卓系统" : cc.sys.platform == cc.sys.IPHONE && (this.msgInfo.string = "IOS系统");
this.savePictureBySSBtn.node.on("click", function() {
t.onShotSceneSavePhoto();
}, this);
this.savePictureByURLBtn.node.on("click", function() {
t.onSavePictureByUrl(t.savePicUrl);
}, this);
this.shareFriendBySSBtn.node.on("click", function() {
t.onShotSceneShareFriend();
}, this);
this.shareFriendByURLBtn.node.on("click", function() {
t.onShareFriendByUrl(t.shareFriendImgUrl);
}, this);
this.shareTimeLineBySSBtn.node.on("click", function() {
t.onShotSceneShareTimeLine();
}, this);
this.shareTimeLineByURLBtn.node.on("click", function() {
t.onShareTimeLineByUrl(t.shareTimeLineImgUrl);
}, this);
var e = cc.director.getScene().getChildByName("Canvas");
console.log(e);
};
t.prototype.getRomNameByDate = function(t) {
var e = Math.floor(cc.sys.now()), r = new Date(e);
return "rom-" + (r.getFullYear() + "-") + ((r.getMonth() + 1 < 10 ? "0" + (r.getMonth() + 1) : r.getMonth() + 1) + "-") + (r.getDate() + "-") + (r.getHours() + "-") + ((r.getMinutes() < 10 ? "0" + r.getMinutes() : r.getMinutes()) + "-") + (r.getSeconds() < 10 ? "0" + r.getSeconds() : r.getSeconds()) + t;
};
t.prototype.shotScenePlus = function(t, r) {
var o = this;
t.getComponent(cc.Mask) && console.warn("截屏节点中不能包含mask");
if (cc.sys.isNative) {
cc.p(t.position.x, t.position.y);
var n = t.getContentSize(), s = cc.RenderTexture.create(n.width, n.height), e = cc.director.getScene().getChildByName("Canvas");
console.log(e);
var i = cc.p(0, 0), a = e.convertToWorldSpaceAR(i), c = t.parent.convertToNodeSpaceAR(a);
console.log("屏幕中心点相对于shotSceneNode的父节点的位置", c);
var l = new cc.Node();
l.addComponent(cc.Mask);
l.setContentSize(0, 0);
l.parent = t.parent;
l.zIndex = 9999;
l.position = c;
console.log("创建mask 完成");
var h = cc.instantiate(t);
h.parent = l;
console.log("创建替身截屏节点 完成");
setTimeout(function() {
s.begin();
h.position = cc.p(n.width / 2, n.height / 2);
h._sgNode.visit();
s.end();
var e = o.getRomNameByDate(".png");
s.saveToFile(e, cc.ImageFormat.PNG, !0, function() {
h.destroy();
l.destroy();
var t = jsb.fileUtils.getWritablePath() + e;
if (jsb.fileUtils.isFileExist(t)) {
console.log("创建截屏图片成功");
setTimeout(function() {
r(null, t);
});
} else r("save error", t);
});
});
} else console.warn("仅支持原生平台截图");
};
t.prototype.onShotSceneSavePhoto = function() {
this.shotScenePlus(this.samallSaveNode, function(t, e) {
if (t) console.error("截屏失败!"); else if (cc.sys.os == cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shotSceneSavePhoto", "(Ljava/lang/String;)V", e);
} else cc.sys.os == cc.sys.OS_IOS && jsb.reflection.callStaticMethod("RootViewController", "shotSceneSavePhotoAndPath:", e);
});
};
t.prototype.onShotSceneShareFriend = function() {
this.shotScenePlus(this.saveNode, function(t, e) {
if (t) console.error("截屏失败!"); else if (cc.sys.os == cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareFriendByShotScence", "(Ljava/lang/String;)V", e);
} else cc.sys.os, cc.sys.OS_IOS;
});
};
t.prototype.onShotSceneShareTimeLine = function() {
this.shotScenePlus(this.samallSaveNode, function(t, e) {
if (t) console.error("截屏失败!"); else if (cc.sys.os == cc.sys.OS_ANDROID) {
jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareTimeLineByShotScence", "(Ljava/lang/String;)V", e);
} else cc.sys.os, cc.sys.OS_IOS;
});
};
t.prototype.onShareFriendByUrl = function(t) {
this.msgInfo.string = "onShareFriend";
cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareFriendByUrl", "(Ljava/lang/String;)V", t) : (cc.sys.platform, 
cc.sys.IPHONE);
};
t.prototype.onShareTimeLineByUrl = function(t) {
this.msgInfo.string = "onShareTimeLine";
cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "shareTimeLineByUrl", "(Ljava/lang/String;)V", t) : (cc.sys.platform, 
cc.sys.IPHONE);
};
t.prototype.onSavePictureByUrl = function(t) {
this.msgInfo.string = "onSavePic";
cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/mxr/wwx/WxShare", "savePictureByUrl", "(Ljava/lang/String;)V", t) : (cc.sys.platform, 
cc.sys.IPHONE);
};
t.prototype.wechatShareByUrlCallBack = function(t) {
var e = "";
switch (t) {
case i.success:
e = "微信分享成功";
break;

case i.notInstallWX:
e = "用户没有安装微信";
break;

case i.getImageError:
e = "获取网络图片失败";
break;

default:
e = "未知错误";
}
this.msgInfo.string = e;
};
t.prototype.savePictureByUrlCallBack = function(t) {
var e = "";
switch (t) {
case a.success:
e = "保存相册成功";
break;

case a.noPermisson:
e = "没有访问相册权限,图片保存失败";
break;

case a.getImageError:
e = "获取网络图片失败";
break;

case a.notInstallWX:
e = "没有安装微信";
break;

case a.saveShotSceneError:
e = "截屏保存本地失败";
break;

default:
e = "未知错误";
}
this.msgInfo.string = e;
};
t.prototype.savePictureByShotSceneCallBack = function(t) {
var e = "";
switch (t) {
case l.success:
e = "截屏图片保存相册成功";
break;

case l.shotSceneSaveError:
e = "截屏图片保存失败";
break;

default:
e = "未知错误";
}
this.msgInfo.string = e;
};
t.prototype.wechatShareByShotSceneCallBack = function(t) {
var e = "";
switch (t) {
case c.success:
e = "截屏分享成功";
break;

case c.notInstallWX:
e = "没有安装微信";
break;

case c.shotSceneSaveError:
e = "截屏图片保存失败";
break;

default:
e = "未知错误";
}
this.msgInfo.string = e;
};
var r;
t._instance = null;
__decorate([ s(cc.Label) ], t.prototype, "msgInfo", void 0);
__decorate([ s(cc.Node) ], t.prototype, "saveNode", void 0);
__decorate([ s(cc.Button) ], t.prototype, "savePictureBySSBtn", void 0);
__decorate([ s(cc.Button) ], t.prototype, "savePictureByURLBtn", void 0);
__decorate([ s(cc.Button) ], t.prototype, "shareFriendBySSBtn", void 0);
__decorate([ s(cc.Button) ], t.prototype, "shareFriendByURLBtn", void 0);
__decorate([ s(cc.Button) ], t.prototype, "shareTimeLineBySSBtn", void 0);
__decorate([ s(cc.Button) ], t.prototype, "shareTimeLineByURLBtn", void 0);
__decorate([ s(cc.Node) ], t.prototype, "samallSaveNode", void 0);
return t = r = __decorate([ n ], t);
}(cc.Component);
r.default = h;
(function(t) {
t[t.success = 0] = "success";
t[t.notInstallWX = 1] = "notInstallWX";
t[t.getImageError = 2] = "getImageError";
})(i || (i = {}));
(function(t) {
t[t.success = 0] = "success";
t[t.notInstallWX = 1] = "notInstallWX";
t[t.getImageError = 2] = "getImageError";
t[t.noPermisson = 3] = "noPermisson";
t[t.saveShotSceneError = 4] = "saveShotSceneError";
})(a || (a = {}));
(function(t) {
t[t.success = 0] = "success";
t[t.notInstallWX = 1] = "notInstallWX";
t[t.shotSceneSaveError = 2] = "shotSceneSaveError";
})(c || (c = {}));
(function(t) {
t[t.success = 0] = "success";
t[t.shotSceneSaveError = 1] = "shotSceneSaveError";
})(l || (l = {}));
cc._RF.pop();
}, {} ]
}, {}, [ "MagicQRCode", "testCom" ]);