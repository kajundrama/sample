(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/rollypolly:sparkline/lib/jquery.sparkline.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
*                                                                                                                      // 2
* jquery.sparkline.js                                                                                                  // 3
*                                                                                                                      // 4
* v2.1.3                                                                                                               // 5
* (c) Splunk, Inc                                                                                                      // 6
* Contact: Gareth Watts (gareth@splunk.com)                                                                            // 7
* http://omnipotent.net/jquery.sparkline/                                                                              // 8
*                                                                                                                      // 9
* Generates inline sparkline charts from data supplied either to the method                                            // 10
* or inline in HTML                                                                                                    // 11
*                                                                                                                      // 12
* Compatible with Internet Explorer 6.0+ and modern browsers equipped with the canvas tag                              // 13
* (Firefox 2.0+, Safari, Opera, etc)                                                                                   // 14
*                                                                                                                      // 15
* License: New BSD License                                                                                             // 16
*                                                                                                                      // 17
* Copyright (c) 2012, Splunk Inc.                                                                                      // 18
* All rights reserved.                                                                                                 // 19
*                                                                                                                      // 20
* Redistribution and use in source and binary forms, with or without modification,                                     // 21
* are permitted provided that the following conditions are met:                                                        // 22
*                                                                                                                      // 23
*     * Redistributions of source code must retain the above copyright notice,                                         // 24
*       this list of conditions and the following disclaimer.                                                          // 25
*     * Redistributions in binary form must reproduce the above copyright notice,                                      // 26
*       this list of conditions and the following disclaimer in the documentation                                      // 27
*       and/or other materials provided with the distribution.                                                         // 28
*     * Neither the name of Splunk Inc nor the names of its contributors may                                           // 29
*       be used to endorse or promote products derived from this software without                                      // 30
*       specific prior written permission.                                                                             // 31
*                                                                                                                      // 32
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY                                  // 33
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES                                 // 34
* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT                                  // 35
* SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,                            // 36
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT                             // 37
* OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)                            // 38
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,                                // 39
* OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS                                // 40
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                                                         // 41
*                                                                                                                      // 42
*                                                                                                                      // 43
* Usage:                                                                                                               // 44
*  $(selector).sparkline(values, options)                                                                              // 45
*                                                                                                                      // 46
* If values is undefined or set to 'html' then the data values are read from the specified tag:                        // 47
*   <p>Sparkline: <span class="sparkline">1,4,6,6,8,5,3,5</span></p>                                                   // 48
*   $('.sparkline').sparkline();                                                                                       // 49
* There must be no spaces in the enclosed data set                                                                     // 50
*                                                                                                                      // 51
* Otherwise values must be an array of numbers or null values                                                          // 52
*    <p>Sparkline: <span id="sparkline1">This text replaced if the browser is compatible</span></p>                    // 53
*    $('#sparkline1').sparkline([1,4,6,6,8,5,3,5])                                                                     // 54
*    $('#sparkline2').sparkline([1,4,6,null,null,5,3,5])                                                               // 55
*                                                                                                                      // 56
* Values can also be specified in an HTML comment, or as a values attribute:                                           // 57
*    <p>Sparkline: <span class="sparkline"><!--1,4,6,6,8,5,3,5 --></span></p>                                          // 58
*    <p>Sparkline: <span class="sparkline" values="1,4,6,6,8,5,3,5"></span></p>                                        // 59
*    $('.sparkline').sparkline();                                                                                      // 60
*                                                                                                                      // 61
* For line charts, x values can also be specified:                                                                     // 62
*   <p>Sparkline: <span class="sparkline">1:1,2.7:4,3.4:6,5:6,6:8,8.7:5,9:3,10:5</span></p>                            // 63
*    $('#sparkline1').sparkline([ [1,1], [2.7,4], [3.4,6], [5,6], [6,8], [8.7,5], [9,3], [10,5] ])                     // 64
*                                                                                                                      // 65
* By default, options should be passed in as the second argument to the sparkline function:                            // 66
*   $('.sparkline').sparkline([1,2,3,4], {type: 'bar'})                                                                // 67
*                                                                                                                      // 68
* Options can also be set by passing them on the tag itself.  This feature is disabled by default though               // 69
* as there's a slight performance overhead:                                                                            // 70
*   $('.sparkline').sparkline([1,2,3,4], {enableTagOptions: true})                                                     // 71
*   <p>Sparkline: <span class="sparkline" sparkType="bar" sparkBarColor="red">loading</span></p>                       // 72
* Prefix all options supplied as tag attribute with "spark" (configurable by setting tagOptionsPrefix)                 // 73
*                                                                                                                      // 74
* Supported options:                                                                                                   // 75
*   lineColor - Color of the line used for the chart                                                                   // 76
*   fillColor - Color used to fill in the chart - Set to '' or false for a transparent chart                           // 77
*   width - Width of the chart - Defaults to 3 times the number of values in pixels                                    // 78
*   height - Height of the chart - Defaults to the height of the containing element                                    // 79
*   chartRangeMin - Specify the minimum value to use for the Y range of the chart - Defaults to the minimum value supplied
*   chartRangeMax - Specify the maximum value to use for the Y range of the chart - Defaults to the maximum value supplied
*   chartRangeClip - Clip out of range values to the max/min specified by chartRangeMin and chartRangeMax              // 82
*   chartRangeMinX - Specify the minimum value to use for the X range of the chart - Defaults to the minimum value supplied
*   chartRangeMaxX - Specify the maximum value to use for the X range of the chart - Defaults to the maximum value supplied
*   composite - If true then don't erase any existing chart attached to the tag, but draw                              // 85
*           another chart over the top - Note that width and height are ignored if an                                  // 86
*           existing chart is detected.                                                                                // 87
*   tagValuesAttribute - Name of tag attribute to check for data values - Defaults to 'values'                         // 88
*   enableTagOptions - Whether to check tags for sparkline options                                                     // 89
*   tagOptionsPrefix - Prefix used for options supplied as tag attributes - Defaults to 'spark'                        // 90
*   disableHiddenCheck - If set to true, then the plugin will assume that charts will never be drawn into a            // 91
*           hidden dom element, avoding a browser reflow                                                               // 92
*   disableInteraction - If set to true then all mouseover/click interaction behaviour will be disabled,               // 93
*       making the plugin perform much like it did in 1.x                                                              // 94
*   disableTooltips - If set to true then tooltips will be disabled - Defaults to false (tooltips enabled)             // 95
*   disableHighlight - If set to true then highlighting of selected chart elements on mouseover will be disabled       // 96
*       defaults to false (highlights enabled)                                                                         // 97
*   highlightLighten - Factor to lighten/darken highlighted chart values by - Defaults to 1.4 for a 40% increase       // 98
*   tooltipContainer - Specify which DOM element the tooltip should be rendered into - defaults to document.body       // 99
*   tooltipClassname - Optional CSS classname to apply to tooltips - If not specified then a default style will be applied
*   tooltipOffsetX - How many pixels away from the mouse pointer to render the tooltip on the X axis                   // 101
*   tooltipOffsetY - How many pixels away from the mouse pointer to render the tooltip on the r axis                   // 102
*   tooltipFormatter  - Optional callback that allows you to override the HTML displayed in the tooltip                // 103
*       callback is given arguments of (sparkline, options, fields)                                                    // 104
*   tooltipChartTitle - If specified then the tooltip uses the string specified by this setting as a title             // 105
*   tooltipFormat - A format string or SPFormat object  (or an array thereof for multiple entries)                     // 106
*       to control the format of the tooltip                                                                           // 107
*   tooltipPrefix - A string to prepend to each field displayed in a tooltip                                           // 108
*   tooltipSuffix - A string to append to each field displayed in a tooltip                                            // 109
*   tooltipSkipNull - If true then null values will not have a tooltip displayed (defaults to true)                    // 110
*   tooltipValueLookups - An object or range map to map field values to tooltip strings                                // 111
*       (eg. to map -1 to "Lost", 0 to "Draw", and 1 to "Win")                                                         // 112
*   numberFormatter - Optional callback for formatting numbers in tooltips                                             // 113
*   numberDigitGroupSep - Character to use for group separator in numbers "1,234" - Defaults to ","                    // 114
*   numberDecimalMark - Character to use for the decimal point when formatting numbers - Defaults to "."               // 115
*   numberDigitGroupCount - Number of digits between group separator - Defaults to 3                                   // 116
*                                                                                                                      // 117
* There are 7 types of sparkline, selected by supplying a "type" option of 'line' (default),                           // 118
* 'bar', 'tristate', 'bullet', 'discrete', 'pie' or 'box'                                                              // 119
*    line - Line chart.  Options:                                                                                      // 120
*       spotColor - Set to '' to not end each line in a circular spot                                                  // 121
*       minSpotColor - If set, color of spot at minimum value                                                          // 122
*       maxSpotColor - If set, color of spot at maximum value                                                          // 123
*       spotRadius - Radius in pixels                                                                                  // 124
*       lineWidth - Width of line in pixels                                                                            // 125
*       normalRangeMin                                                                                                 // 126
*       normalRangeMax - If set draws a filled horizontal bar between these two values marking the "normal"            // 127
*                      or expected range of values                                                                     // 128
*       normalRangeColor - Color to use for the above bar                                                              // 129
*       drawNormalOnTop - Draw the normal range above the chart fill color if true                                     // 130
*       defaultPixelsPerValue - Defaults to 3 pixels of width for each value in the chart                              // 131
*       highlightSpotColor - The color to use for drawing a highlight spot on mouseover - Set to null to disable       // 132
*       highlightLineColor - The color to use for drawing a highlight line on mouseover - Set to null to disable       // 133
*       valueSpots - Specify which points to draw spots on, and in which color.  Accepts a range map                   // 134
*                                                                                                                      // 135
*   bar - Bar chart.  Options:                                                                                         // 136
*       barColor - Color of bars for postive values                                                                    // 137
*       negBarColor - Color of bars for negative values                                                                // 138
*       zeroColor - Color of bars with zero values                                                                     // 139
*       nullColor - Color of bars with null values - Defaults to omitting the bar entirely                             // 140
*       barWidth - Width of bars in pixels                                                                             // 141
*       colorMap - Optional mappnig of values to colors to override the *BarColor values above                         // 142
*                  can be an Array of values to control the color of individual bars or a range map                    // 143
*                  to specify colors for individual ranges of values                                                   // 144
*       barSpacing - Gap between bars in pixels                                                                        // 145
*       zeroAxis - Centers the y-axis around zero if true                                                              // 146
*                                                                                                                      // 147
*   tristate - Charts values of win (>0), lose (<0) or draw (=0)                                                       // 148
*       posBarColor - Color of win values                                                                              // 149
*       negBarColor - Color of lose values                                                                             // 150
*       zeroBarColor - Color of draw values                                                                            // 151
*       barWidth - Width of bars in pixels                                                                             // 152
*       barSpacing - Gap between bars in pixels                                                                        // 153
*       colorMap - Optional mappnig of values to colors to override the *BarColor values above                         // 154
*                  can be an Array of values to control the color of individual bars or a range map                    // 155
*                  to specify colors for individual ranges of values                                                   // 156
*                                                                                                                      // 157
*   discrete - Options:                                                                                                // 158
*       lineHeight - Height of each line in pixels - Defaults to 30% of the graph height                               // 159
*       thesholdValue - Values less than this value will be drawn using thresholdColor instead of lineColor            // 160
*       thresholdColor                                                                                                 // 161
*                                                                                                                      // 162
*   bullet - Values for bullet graphs msut be in the order: target, performance, range1, range2, range3, ...           // 163
*       options:                                                                                                       // 164
*       targetColor - The color of the vertical target marker                                                          // 165
*       targetWidth - The width of the target marker in pixels                                                         // 166
*       performanceColor - The color of the performance measure horizontal bar                                         // 167
*       rangeColors - Colors to use for each qualitative range background color                                        // 168
*                                                                                                                      // 169
*   pie - Pie chart. Options:                                                                                          // 170
*       sliceColors - An array of colors to use for pie slices                                                         // 171
*       offset - Angle in degrees to offset the first slice - Try -90 or +90                                           // 172
*       borderWidth - Width of border to draw around the pie chart, in pixels - Defaults to 0 (no border)              // 173
*       borderColor - Color to use for the pie chart border - Defaults to #000                                         // 174
*                                                                                                                      // 175
*   box - Box plot. Options:                                                                                           // 176
*       raw - Set to true to supply pre-computed plot points as values                                                 // 177
*             values should be: low_outlier, low_whisker, q1, median, q3, high_whisker, high_outlier                   // 178
*             When set to false you can supply any number of values and the box plot will                              // 179
*             be computed for you.  Default is false.                                                                  // 180
*       showOutliers - Set to true (default) to display outliers as circles                                            // 181
*       outlierIQR - Interquartile range used to determine outliers.  Default 1.5                                      // 182
*       boxLineColor - Outline color of the box                                                                        // 183
*       boxFillColor - Fill color for the box                                                                          // 184
*       whiskerColor - Line color used for whiskers                                                                    // 185
*       outlierLineColor - Outline color of outlier circles                                                            // 186
*       outlierFillColor - Fill color of the outlier circles                                                           // 187
*       spotRadius - Radius of outlier circles                                                                         // 188
*       medianColor - Line color of the median line                                                                    // 189
*       target - Draw a target cross hair at the supplied value (default undefined)                                    // 190
*                                                                                                                      // 191
*                                                                                                                      // 192
*                                                                                                                      // 193
*   Examples:                                                                                                          // 194
*   $('#sparkline1').sparkline(myvalues, { lineColor: '#f00', fillColor: false });                                     // 195
*   $('.barsparks').sparkline('html', { type:'bar', height:'40px', barWidth:5 });                                      // 196
*   $('#tristate').sparkline([1,1,-1,1,0,0,-1], { type:'tristate' }):                                                  // 197
*   $('#discrete').sparkline([1,3,4,5,5,3,4,5], { type:'discrete' });                                                  // 198
*   $('#bullet').sparkline([10,12,12,9,7], { type:'bullet' });                                                         // 199
*   $('#pie').sparkline([1,1,2], { type:'pie' });                                                                      // 200
*/                                                                                                                     // 201
                                                                                                                       // 202
/*jslint regexp: true, browser: true, jquery: true, white: true, nomen: false, plusplus: false, maxerr: 500, indent: 4 */
                                                                                                                       // 204
(function(document, Math, undefined) { // performance/minified-size optimization                                       // 205
(function(factory) {                                                                                                   // 206
    if(typeof define === 'function' && define.amd) {                                                                   // 207
        define(['jquery'], factory);                                                                                   // 208
    } else if (jQuery && !jQuery.fn.sparkline) {                                                                       // 209
        factory(jQuery);                                                                                               // 210
    }                                                                                                                  // 211
}                                                                                                                      // 212
(function($) {                                                                                                         // 213
    'use strict';                                                                                                      // 214
                                                                                                                       // 215
    var UNSET_OPTION = {},                                                                                             // 216
        getDefaults, createClass, SPFormat, clipval, quartile, normalizeValue, normalizeValues,                        // 217
        remove, isNumber, all, sum, addCSS, ensureArray, formatNumber, RangeMap,                                       // 218
        MouseHandler, Tooltip, barHighlightMixin,                                                                      // 219
        line, bar, tristate, discrete, bullet, pie, box, defaultStyles, initStyles,                                    // 220
        VShape, VCanvas_base, VCanvas_canvas, VCanvas_vml, pending, shapeCount = 0;                                    // 221
                                                                                                                       // 222
    /**                                                                                                                // 223
     * Default configuration settings                                                                                  // 224
     */                                                                                                                // 225
    getDefaults = function () {                                                                                        // 226
        return {                                                                                                       // 227
            // Settings common to most/all chart types                                                                 // 228
            common: {                                                                                                  // 229
                type: 'line',                                                                                          // 230
                lineColor: '#00f',                                                                                     // 231
                fillColor: '#cdf',                                                                                     // 232
                defaultPixelsPerValue: 3,                                                                              // 233
                width: 'auto',                                                                                         // 234
                height: 'auto',                                                                                        // 235
                composite: false,                                                                                      // 236
                tagValuesAttribute: 'values',                                                                          // 237
                tagOptionsPrefix: 'spark',                                                                             // 238
                enableTagOptions: false,                                                                               // 239
                enableHighlight: true,                                                                                 // 240
                highlightLighten: 1.4,                                                                                 // 241
                tooltipSkipNull: true,                                                                                 // 242
                tooltipPrefix: '',                                                                                     // 243
                tooltipSuffix: '',                                                                                     // 244
                disableHiddenCheck: false,                                                                             // 245
                numberFormatter: false,                                                                                // 246
                numberDigitGroupCount: 3,                                                                              // 247
                numberDigitGroupSep: ',',                                                                              // 248
                numberDecimalMark: '.',                                                                                // 249
                disableTooltips: false,                                                                                // 250
                disableInteraction: false                                                                              // 251
            },                                                                                                         // 252
            // Defaults for line charts                                                                                // 253
            line: {                                                                                                    // 254
                spotColor: '#f80',                                                                                     // 255
                highlightSpotColor: '#5f5',                                                                            // 256
                highlightLineColor: '#f22',                                                                            // 257
                spotRadius: 1.5,                                                                                       // 258
                minSpotColor: '#f80',                                                                                  // 259
                maxSpotColor: '#f80',                                                                                  // 260
                lineWidth: 1,                                                                                          // 261
                normalRangeMin: undefined,                                                                             // 262
                normalRangeMax: undefined,                                                                             // 263
                normalRangeColor: '#ccc',                                                                              // 264
                drawNormalOnTop: false,                                                                                // 265
                chartRangeMin: undefined,                                                                              // 266
                chartRangeMax: undefined,                                                                              // 267
                chartRangeMinX: undefined,                                                                             // 268
                chartRangeMaxX: undefined,                                                                             // 269
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{y}}{{suffix}}') // 270
            },                                                                                                         // 271
            // Defaults for bar charts                                                                                 // 272
            bar: {                                                                                                     // 273
                barColor: '#3366cc',                                                                                   // 274
                negBarColor: '#f44',                                                                                   // 275
                stackedBarColor: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#66aa00',                               // 276
                    '#dd4477', '#0099c6', '#990099'],                                                                  // 277
                zeroColor: undefined,                                                                                  // 278
                nullColor: undefined,                                                                                  // 279
                zeroAxis: true,                                                                                        // 280
                barWidth: 4,                                                                                           // 281
                barSpacing: 1,                                                                                         // 282
                chartRangeMax: undefined,                                                                              // 283
                chartRangeMin: undefined,                                                                              // 284
                chartRangeClip: false,                                                                                 // 285
                colorMap: undefined,                                                                                   // 286
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{prefix}}{{value}}{{suffix}}')
            },                                                                                                         // 288
            // Defaults for tristate charts                                                                            // 289
            tristate: {                                                                                                // 290
                barWidth: 4,                                                                                           // 291
                barSpacing: 1,                                                                                         // 292
                posBarColor: '#6f6',                                                                                   // 293
                negBarColor: '#f44',                                                                                   // 294
                zeroBarColor: '#999',                                                                                  // 295
                colorMap: {},                                                                                          // 296
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{value:map}}'),            // 297
                tooltipValueLookups: { map: { '-1': 'Loss', '0': 'Draw', '1': 'Win' } }                                // 298
            },                                                                                                         // 299
            // Defaults for discrete charts                                                                            // 300
            discrete: {                                                                                                // 301
                lineHeight: 'auto',                                                                                    // 302
                thresholdColor: undefined,                                                                             // 303
                thresholdValue: 0,                                                                                     // 304
                chartRangeMax: undefined,                                                                              // 305
                chartRangeMin: undefined,                                                                              // 306
                chartRangeClip: false,                                                                                 // 307
                tooltipFormat: new SPFormat('{{prefix}}{{value}}{{suffix}}')                                           // 308
            },                                                                                                         // 309
            // Defaults for bullet charts                                                                              // 310
            bullet: {                                                                                                  // 311
                targetColor: '#f33',                                                                                   // 312
                targetWidth: 3, // width of the target bar in pixels                                                   // 313
                performanceColor: '#33f',                                                                              // 314
                rangeColors: ['#d3dafe', '#a8b6ff', '#7f94ff'],                                                        // 315
                base: undefined, // set this to a number to change the base start number                               // 316
                tooltipFormat: new SPFormat('{{fieldkey:fields}} - {{value}}'),                                        // 317
                tooltipValueLookups: { fields: {r: 'Range', p: 'Performance', t: 'Target'} }                           // 318
            },                                                                                                         // 319
            // Defaults for pie charts                                                                                 // 320
            pie: {                                                                                                     // 321
                offset: 0,                                                                                             // 322
                sliceColors: ['#3366cc', '#dc3912', '#ff9900', '#109618', '#66aa00',                                   // 323
                    '#dd4477', '#0099c6', '#990099'],                                                                  // 324
                borderWidth: 0,                                                                                        // 325
                borderColor: '#000',                                                                                   // 326
                tooltipFormat: new SPFormat('<span style="color: {{color}}">&#9679;</span> {{value}} ({{percent.1}}%)')
            },                                                                                                         // 328
            // Defaults for box plots                                                                                  // 329
            box: {                                                                                                     // 330
                raw: false,                                                                                            // 331
                boxLineColor: '#000',                                                                                  // 332
                boxFillColor: '#cdf',                                                                                  // 333
                whiskerColor: '#000',                                                                                  // 334
                outlierLineColor: '#333',                                                                              // 335
                outlierFillColor: '#fff',                                                                              // 336
                medianColor: '#f00',                                                                                   // 337
                showOutliers: true,                                                                                    // 338
                outlierIQR: 1.5,                                                                                       // 339
                spotRadius: 1.5,                                                                                       // 340
                target: undefined,                                                                                     // 341
                targetColor: '#4a2',                                                                                   // 342
                chartRangeMax: undefined,                                                                              // 343
                chartRangeMin: undefined,                                                                              // 344
                tooltipFormat: new SPFormat('{{field:fields}}: {{value}}'),                                            // 345
                tooltipFormatFieldlistKey: 'field',                                                                    // 346
                tooltipValueLookups: { fields: { lq: 'Lower Quartile', med: 'Median',                                  // 347
                    uq: 'Upper Quartile', lo: 'Left Outlier', ro: 'Right Outlier',                                     // 348
                    lw: 'Left Whisker', rw: 'Right Whisker'} }                                                         // 349
            }                                                                                                          // 350
        };                                                                                                             // 351
    };                                                                                                                 // 352
                                                                                                                       // 353
    // You can have tooltips use a css class other than jqstooltip by specifying tooltipClassname                      // 354
    defaultStyles = '.jqstooltip { ' +                                                                                 // 355
            'position: absolute;' +                                                                                    // 356
            'left: 0px;' +                                                                                             // 357
            'top: 0px;' +                                                                                              // 358
            'visibility: hidden;' +                                                                                    // 359
            'background: rgb(0, 0, 0) transparent;' +                                                                  // 360
            'background-color: rgba(0,0,0,0.6);' +                                                                     // 361
            'filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);' +     // 362
            '-ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";' +
            'color: white;' +                                                                                          // 364
            'font: 10px arial, san serif;' +                                                                           // 365
            'text-align: left;' +                                                                                      // 366
            'white-space: nowrap;' +                                                                                   // 367
            'padding: 5px;' +                                                                                          // 368
            'border: 1px solid white;' +                                                                               // 369
            'box-sizing: content-box;' +                                                                               // 370
            'z-index: 10000;' +                                                                                        // 371
            '}' +                                                                                                      // 372
            '.jqsfield { ' +                                                                                           // 373
            'color: white;' +                                                                                          // 374
            'font: 10px arial, san serif;' +                                                                           // 375
            'text-align: left;' +                                                                                      // 376
            '}';                                                                                                       // 377
                                                                                                                       // 378
    /**                                                                                                                // 379
     * Utilities                                                                                                       // 380
     */                                                                                                                // 381
                                                                                                                       // 382
    createClass = function (/* [baseclass, [mixin, ...]], definition */) {                                             // 383
        var Class, args;                                                                                               // 384
        Class = function () {                                                                                          // 385
            this.init.apply(this, arguments);                                                                          // 386
        };                                                                                                             // 387
        if (arguments.length > 1) {                                                                                    // 388
            if (arguments[0]) {                                                                                        // 389
                Class.prototype = $.extend(new arguments[0](), arguments[arguments.length - 1]);                       // 390
                Class._super = arguments[0].prototype;                                                                 // 391
            } else {                                                                                                   // 392
                Class.prototype = arguments[arguments.length - 1];                                                     // 393
            }                                                                                                          // 394
            if (arguments.length > 2) {                                                                                // 395
                args = Array.prototype.slice.call(arguments, 1, -1);                                                   // 396
                args.unshift(Class.prototype);                                                                         // 397
                $.extend.apply($, args);                                                                               // 398
            }                                                                                                          // 399
        } else {                                                                                                       // 400
            Class.prototype = arguments[0];                                                                            // 401
        }                                                                                                              // 402
        Class.prototype.cls = Class;                                                                                   // 403
        return Class;                                                                                                  // 404
    };                                                                                                                 // 405
                                                                                                                       // 406
    /**                                                                                                                // 407
     * Wraps a format string for tooltips                                                                              // 408
     * {{x}}                                                                                                           // 409
     * {{x.2}                                                                                                          // 410
     * {{x:months}}                                                                                                    // 411
     */                                                                                                                // 412
    $.SPFormatClass = SPFormat = createClass({                                                                         // 413
        fre: /\{\{([\w.]+?)(:(.+?))?\}\}/g,                                                                            // 414
        precre: /(\w+)\.(\d+)/,                                                                                        // 415
                                                                                                                       // 416
        init: function (format, fclass) {                                                                              // 417
            this.format = format;                                                                                      // 418
            this.fclass = fclass;                                                                                      // 419
        },                                                                                                             // 420
                                                                                                                       // 421
        render: function (fieldset, lookups, options) {                                                                // 422
            var self = this,                                                                                           // 423
                fields = fieldset,                                                                                     // 424
                match, token, lookupkey, fieldvalue, prec;                                                             // 425
            return this.format.replace(this.fre, function () {                                                         // 426
                var lookup;                                                                                            // 427
                token = arguments[1];                                                                                  // 428
                lookupkey = arguments[3];                                                                              // 429
                match = self.precre.exec(token);                                                                       // 430
                if (match) {                                                                                           // 431
                    prec = match[2];                                                                                   // 432
                    token = match[1];                                                                                  // 433
                } else {                                                                                               // 434
                    prec = false;                                                                                      // 435
                }                                                                                                      // 436
                fieldvalue = fields[token];                                                                            // 437
                if (fieldvalue === undefined) {                                                                        // 438
                    return '';                                                                                         // 439
                }                                                                                                      // 440
                if (lookupkey && lookups && lookups[lookupkey]) {                                                      // 441
                    lookup = lookups[lookupkey];                                                                       // 442
                    if (lookup.get) { // RangeMap                                                                      // 443
                        return lookups[lookupkey].get(fieldvalue) || fieldvalue;                                       // 444
                    } else {                                                                                           // 445
                        return lookups[lookupkey][fieldvalue] || fieldvalue;                                           // 446
                    }                                                                                                  // 447
                }                                                                                                      // 448
                if (isNumber(fieldvalue)) {                                                                            // 449
                    if (options.get('numberFormatter')) {                                                              // 450
                        fieldvalue = options.get('numberFormatter')(fieldvalue);                                       // 451
                    } else {                                                                                           // 452
                        fieldvalue = formatNumber(fieldvalue, prec,                                                    // 453
                            options.get('numberDigitGroupCount'),                                                      // 454
                            options.get('numberDigitGroupSep'),                                                        // 455
                            options.get('numberDecimalMark'));                                                         // 456
                    }                                                                                                  // 457
                }                                                                                                      // 458
                return fieldvalue;                                                                                     // 459
            });                                                                                                        // 460
        }                                                                                                              // 461
    });                                                                                                                // 462
                                                                                                                       // 463
    // convience method to avoid needing the new operator                                                              // 464
    $.spformat = function(format, fclass) {                                                                            // 465
        return new SPFormat(format, fclass);                                                                           // 466
    };                                                                                                                 // 467
                                                                                                                       // 468
    clipval = function (val, min, max) {                                                                               // 469
        if (val < min) {                                                                                               // 470
            return min;                                                                                                // 471
        }                                                                                                              // 472
        if (val > max) {                                                                                               // 473
            return max;                                                                                                // 474
        }                                                                                                              // 475
        return val;                                                                                                    // 476
    };                                                                                                                 // 477
                                                                                                                       // 478
    quartile = function (values, q) {                                                                                  // 479
        var vl;                                                                                                        // 480
        if (q === 2) {                                                                                                 // 481
            vl = Math.floor(values.length / 2);                                                                        // 482
            return values.length % 2 ? values[vl] : (values[vl-1] + values[vl]) / 2;                                   // 483
        } else {                                                                                                       // 484
            if (values.length % 2 ) { // odd                                                                           // 485
                vl = (values.length * q + q) / 4;                                                                      // 486
                return vl % 1 ? (values[Math.floor(vl)] + values[Math.floor(vl) - 1]) / 2 : values[vl-1];              // 487
            } else { //even                                                                                            // 488
                vl = (values.length * q + 2) / 4;                                                                      // 489
                return vl % 1 ? (values[Math.floor(vl)] + values[Math.floor(vl) - 1]) / 2 :  values[vl-1];             // 490
                                                                                                                       // 491
            }                                                                                                          // 492
        }                                                                                                              // 493
    };                                                                                                                 // 494
                                                                                                                       // 495
    normalizeValue = function (val) {                                                                                  // 496
        var nf;                                                                                                        // 497
        switch (val) {                                                                                                 // 498
            case 'undefined':                                                                                          // 499
                val = undefined;                                                                                       // 500
                break;                                                                                                 // 501
            case 'null':                                                                                               // 502
                val = null;                                                                                            // 503
                break;                                                                                                 // 504
            case 'true':                                                                                               // 505
                val = true;                                                                                            // 506
                break;                                                                                                 // 507
            case 'false':                                                                                              // 508
                val = false;                                                                                           // 509
                break;                                                                                                 // 510
            default:                                                                                                   // 511
                nf = parseFloat(val);                                                                                  // 512
                if (val == nf) {                                                                                       // 513
                    val = nf;                                                                                          // 514
                }                                                                                                      // 515
        }                                                                                                              // 516
        return val;                                                                                                    // 517
    };                                                                                                                 // 518
                                                                                                                       // 519
    normalizeValues = function (vals) {                                                                                // 520
        var i, result = [];                                                                                            // 521
        for (i = vals.length; i--;) {                                                                                  // 522
            result[i] = normalizeValue(vals[i]);                                                                       // 523
        }                                                                                                              // 524
        return result;                                                                                                 // 525
    };                                                                                                                 // 526
                                                                                                                       // 527
    remove = function (vals, filter) {                                                                                 // 528
        var i, vl, result = [];                                                                                        // 529
        for (i = 0, vl = vals.length; i < vl; i++) {                                                                   // 530
            if (vals[i] !== filter) {                                                                                  // 531
                result.push(vals[i]);                                                                                  // 532
            }                                                                                                          // 533
        }                                                                                                              // 534
        return result;                                                                                                 // 535
    };                                                                                                                 // 536
                                                                                                                       // 537
    isNumber = function (num) {                                                                                        // 538
        return !isNaN(parseFloat(num)) && isFinite(num);                                                               // 539
    };                                                                                                                 // 540
                                                                                                                       // 541
    formatNumber = function (num, prec, groupsize, groupsep, decsep) {                                                 // 542
        var p, i;                                                                                                      // 543
        num = (prec === false ? parseFloat(num).toString() : num.toFixed(prec)).split('');                             // 544
        p = (p = $.inArray('.', num)) < 0 ? num.length : p;                                                            // 545
        if (p < num.length) {                                                                                          // 546
            num[p] = decsep;                                                                                           // 547
        }                                                                                                              // 548
        for (i = p - groupsize; i > 0; i -= groupsize) {                                                               // 549
            num.splice(i, 0, groupsep);                                                                                // 550
        }                                                                                                              // 551
        return num.join('');                                                                                           // 552
    };                                                                                                                 // 553
                                                                                                                       // 554
    // determine if all values of an array match a value                                                               // 555
    // returns true if the array is empty                                                                              // 556
    all = function (val, arr, ignoreNull) {                                                                            // 557
        var i;                                                                                                         // 558
        for (i = arr.length; i--; ) {                                                                                  // 559
            if (ignoreNull && arr[i] === null) continue;                                                               // 560
            if (arr[i] !== val) {                                                                                      // 561
                return false;                                                                                          // 562
            }                                                                                                          // 563
        }                                                                                                              // 564
        return true;                                                                                                   // 565
    };                                                                                                                 // 566
                                                                                                                       // 567
    // sums the numeric values in an array, ignoring other values                                                      // 568
    sum = function (vals) {                                                                                            // 569
        var total = 0, i;                                                                                              // 570
        for (i = vals.length; i--;) {                                                                                  // 571
            total += typeof vals[i] === 'number' ? vals[i] : 0;                                                        // 572
        }                                                                                                              // 573
        return total;                                                                                                  // 574
    };                                                                                                                 // 575
                                                                                                                       // 576
    ensureArray = function (val) {                                                                                     // 577
        return $.isArray(val) ? val : [val];                                                                           // 578
    };                                                                                                                 // 579
                                                                                                                       // 580
    // http://paulirish.com/2008/bookmarklet-inject-new-css-rules/                                                     // 581
    addCSS = function(css) {                                                                                           // 582
        var tag, iefail;                                                                                               // 583
        if (document.createStyleSheet) {                                                                               // 584
            try {                                                                                                      // 585
                document.createStyleSheet().cssText = css;                                                             // 586
                return;                                                                                                // 587
            } catch (e) {                                                                                              // 588
                // IE <= 9 maxes out at 31 stylesheets; inject into page instead.                                      // 589
                iefail = true;                                                                                         // 590
            }                                                                                                          // 591
        }                                                                                                              // 592
        tag = document.createElement('style');                                                                         // 593
        tag.type = 'text/css';                                                                                         // 594
        document.getElementsByTagName('head')[0].appendChild(tag);                                                     // 595
        if (iefail) {                                                                                                  // 596
            document.styleSheets[document.styleSheets.length - 1].cssText = css;                                       // 597
        } else {                                                                                                       // 598
            tag[(typeof document.body.style.WebkitAppearance == 'string') /* webkit only */ ? 'innerText' : 'innerHTML'] = css;
        }                                                                                                              // 600
    };                                                                                                                 // 601
                                                                                                                       // 602
    // Provide a cross-browser interface to a few simple drawing primitives                                            // 603
    $.fn.simpledraw = function (width, height, useExisting, interact) {                                                // 604
        var target, mhandler;                                                                                          // 605
        if (useExisting && (target = this.data('_jqs_vcanvas'))) {                                                     // 606
            return target;                                                                                             // 607
        }                                                                                                              // 608
                                                                                                                       // 609
        if ($.fn.sparkline.canvas === false) {                                                                         // 610
            // We've already determined that neither Canvas nor VML are available                                      // 611
            return false;                                                                                              // 612
                                                                                                                       // 613
        } else if ($.fn.sparkline.canvas === undefined) {                                                              // 614
            // No function defined yet -- need to see if we support Canvas or VML                                      // 615
            var el = document.createElement('canvas');                                                                 // 616
            if (!!(el.getContext && el.getContext('2d'))) {                                                            // 617
                // Canvas is available                                                                                 // 618
                $.fn.sparkline.canvas = function(width, height, target, interact) {                                    // 619
                    return new VCanvas_canvas(width, height, target, interact);                                        // 620
                };                                                                                                     // 621
            } else if (document.namespaces && !document.namespaces.v) {                                                // 622
                // VML is available                                                                                    // 623
                document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');                         // 624
                $.fn.sparkline.canvas = function(width, height, target, interact) {                                    // 625
                    return new VCanvas_vml(width, height, target);                                                     // 626
                };                                                                                                     // 627
            } else {                                                                                                   // 628
                // Neither Canvas nor VML are available                                                                // 629
                $.fn.sparkline.canvas = false;                                                                         // 630
                return false;                                                                                          // 631
            }                                                                                                          // 632
        }                                                                                                              // 633
                                                                                                                       // 634
        if (width === undefined) {                                                                                     // 635
            width = $(this).innerWidth();                                                                              // 636
        }                                                                                                              // 637
        if (height === undefined) {                                                                                    // 638
            height = $(this).innerHeight();                                                                            // 639
        }                                                                                                              // 640
                                                                                                                       // 641
        target = $.fn.sparkline.canvas(width, height, this, interact);                                                 // 642
                                                                                                                       // 643
        mhandler = $(this).data('_jqs_mhandler');                                                                      // 644
        if (mhandler) {                                                                                                // 645
            mhandler.registerCanvas(target);                                                                           // 646
        }                                                                                                              // 647
        return target;                                                                                                 // 648
    };                                                                                                                 // 649
                                                                                                                       // 650
    $.fn.cleardraw = function () {                                                                                     // 651
        var target = this.data('_jqs_vcanvas');                                                                        // 652
        if (target) {                                                                                                  // 653
            target.reset();                                                                                            // 654
        }                                                                                                              // 655
    };                                                                                                                 // 656
                                                                                                                       // 657
    $.RangeMapClass = RangeMap = createClass({                                                                         // 658
        init: function (map) {                                                                                         // 659
            var key, range, rangelist = [];                                                                            // 660
            for (key in map) {                                                                                         // 661
                if (map.hasOwnProperty(key) && typeof key === 'string' && key.indexOf(':') > -1) {                     // 662
                    range = key.split(':');                                                                            // 663
                    range[0] = range[0].length === 0 ? -Infinity : parseFloat(range[0]);                               // 664
                    range[1] = range[1].length === 0 ? Infinity : parseFloat(range[1]);                                // 665
                    range[2] = map[key];                                                                               // 666
                    rangelist.push(range);                                                                             // 667
                }                                                                                                      // 668
            }                                                                                                          // 669
            this.map = map;                                                                                            // 670
            this.rangelist = rangelist || false;                                                                       // 671
        },                                                                                                             // 672
                                                                                                                       // 673
        get: function (value) {                                                                                        // 674
            var rangelist = this.rangelist,                                                                            // 675
                i, range, result;                                                                                      // 676
            if ((result = this.map[value]) !== undefined) {                                                            // 677
                return result;                                                                                         // 678
            }                                                                                                          // 679
            if (rangelist) {                                                                                           // 680
                for (i = rangelist.length; i--;) {                                                                     // 681
                    range = rangelist[i];                                                                              // 682
                    if (range[0] <= value && range[1] >= value) {                                                      // 683
                        return range[2];                                                                               // 684
                    }                                                                                                  // 685
                }                                                                                                      // 686
            }                                                                                                          // 687
            return undefined;                                                                                          // 688
        }                                                                                                              // 689
    });                                                                                                                // 690
                                                                                                                       // 691
    // Convenience function                                                                                            // 692
    $.range_map = function(map) {                                                                                      // 693
        return new RangeMap(map);                                                                                      // 694
    };                                                                                                                 // 695
                                                                                                                       // 696
    MouseHandler = createClass({                                                                                       // 697
        init: function (el, options) {                                                                                 // 698
            var $el = $(el);                                                                                           // 699
            this.$el = $el;                                                                                            // 700
            this.options = options;                                                                                    // 701
            this.currentPageX = 0;                                                                                     // 702
            this.currentPageY = 0;                                                                                     // 703
            this.el = el;                                                                                              // 704
            this.splist = [];                                                                                          // 705
            this.tooltip = null;                                                                                       // 706
            this.over = false;                                                                                         // 707
            this.displayTooltips = !options.get('disableTooltips');                                                    // 708
            this.highlightEnabled = !options.get('disableHighlight');                                                  // 709
        },                                                                                                             // 710
                                                                                                                       // 711
        registerSparkline: function (sp) {                                                                             // 712
            this.splist.push(sp);                                                                                      // 713
            if (this.over) {                                                                                           // 714
                this.updateDisplay();                                                                                  // 715
            }                                                                                                          // 716
        },                                                                                                             // 717
                                                                                                                       // 718
        registerCanvas: function (canvas) {                                                                            // 719
            var $canvas = $(canvas.canvas);                                                                            // 720
            this.canvas = canvas;                                                                                      // 721
            this.$canvas = $canvas;                                                                                    // 722
            $canvas.mouseenter($.proxy(this.mouseenter, this));                                                        // 723
            $canvas.mouseleave($.proxy(this.mouseleave, this));                                                        // 724
            $canvas.click($.proxy(this.mouseclick, this));                                                             // 725
        },                                                                                                             // 726
                                                                                                                       // 727
        reset: function (removeTooltip) {                                                                              // 728
            this.splist = [];                                                                                          // 729
            if (this.tooltip && removeTooltip) {                                                                       // 730
                this.tooltip.remove();                                                                                 // 731
                this.tooltip = undefined;                                                                              // 732
            }                                                                                                          // 733
        },                                                                                                             // 734
                                                                                                                       // 735
        mouseclick: function (e) {                                                                                     // 736
            var clickEvent = $.Event('sparklineClick');                                                                // 737
            clickEvent.originalEvent = e;                                                                              // 738
            clickEvent.sparklines = this.splist;                                                                       // 739
            this.$el.trigger(clickEvent);                                                                              // 740
        },                                                                                                             // 741
                                                                                                                       // 742
        mouseenter: function (e) {                                                                                     // 743
            $(document.body).unbind('mousemove.jqs');                                                                  // 744
            $(document.body).bind('mousemove.jqs', $.proxy(this.mousemove, this));                                     // 745
            this.over = true;                                                                                          // 746
            this.currentPageX = e.pageX;                                                                               // 747
            this.currentPageY = e.pageY;                                                                               // 748
            this.currentEl = e.target;                                                                                 // 749
            if (!this.tooltip && this.displayTooltips) {                                                               // 750
                this.tooltip = new Tooltip(this.options);                                                              // 751
                this.tooltip.updatePosition(e.pageX, e.pageY);                                                         // 752
            }                                                                                                          // 753
            this.updateDisplay();                                                                                      // 754
        },                                                                                                             // 755
                                                                                                                       // 756
        mouseleave: function () {                                                                                      // 757
            $(document.body).unbind('mousemove.jqs');                                                                  // 758
            var splist = this.splist,                                                                                  // 759
                 spcount = splist.length,                                                                              // 760
                 needsRefresh = false,                                                                                 // 761
                 sp, i;                                                                                                // 762
            this.over = false;                                                                                         // 763
            this.currentEl = null;                                                                                     // 764
                                                                                                                       // 765
            if (this.tooltip) {                                                                                        // 766
                this.tooltip.remove();                                                                                 // 767
                this.tooltip = null;                                                                                   // 768
            }                                                                                                          // 769
                                                                                                                       // 770
            for (i = 0; i < spcount; i++) {                                                                            // 771
                sp = splist[i];                                                                                        // 772
                if (sp.clearRegionHighlight()) {                                                                       // 773
                    needsRefresh = true;                                                                               // 774
                }                                                                                                      // 775
            }                                                                                                          // 776
                                                                                                                       // 777
            if (needsRefresh) {                                                                                        // 778
                this.canvas.render();                                                                                  // 779
            }                                                                                                          // 780
        },                                                                                                             // 781
                                                                                                                       // 782
        mousemove: function (e) {                                                                                      // 783
            this.currentPageX = e.pageX;                                                                               // 784
            this.currentPageY = e.pageY;                                                                               // 785
            this.currentEl = e.target;                                                                                 // 786
            if (this.tooltip) {                                                                                        // 787
                this.tooltip.updatePosition(e.pageX, e.pageY);                                                         // 788
            }                                                                                                          // 789
            this.updateDisplay();                                                                                      // 790
        },                                                                                                             // 791
                                                                                                                       // 792
        updateDisplay: function () {                                                                                   // 793
            var splist = this.splist,                                                                                  // 794
                 spcount = splist.length,                                                                              // 795
                 needsRefresh = false,                                                                                 // 796
                 offset = this.$canvas.offset(),                                                                       // 797
                 localX = this.currentPageX - offset.left,                                                             // 798
                 localY = this.currentPageY - offset.top,                                                              // 799
                 tooltiphtml, sp, i, result, changeEvent;                                                              // 800
            if (!this.over) {                                                                                          // 801
                return;                                                                                                // 802
            }                                                                                                          // 803
            for (i = 0; i < spcount; i++) {                                                                            // 804
                sp = splist[i];                                                                                        // 805
                result = sp.setRegionHighlight(this.currentEl, localX, localY);                                        // 806
                if (result) {                                                                                          // 807
                    needsRefresh = true;                                                                               // 808
                }                                                                                                      // 809
            }                                                                                                          // 810
            if (needsRefresh) {                                                                                        // 811
                changeEvent = $.Event('sparklineRegionChange');                                                        // 812
                changeEvent.sparklines = this.splist;                                                                  // 813
                this.$el.trigger(changeEvent);                                                                         // 814
                if (this.tooltip) {                                                                                    // 815
                    tooltiphtml = '';                                                                                  // 816
                    for (i = 0; i < spcount; i++) {                                                                    // 817
                        sp = splist[i];                                                                                // 818
                        tooltiphtml += sp.getCurrentRegionTooltip();                                                   // 819
                    }                                                                                                  // 820
                    this.tooltip.setContent(tooltiphtml);                                                              // 821
                }                                                                                                      // 822
                if (!this.disableHighlight) {                                                                          // 823
                    this.canvas.render();                                                                              // 824
                }                                                                                                      // 825
            }                                                                                                          // 826
            if (result === null) {                                                                                     // 827
                this.mouseleave();                                                                                     // 828
            }                                                                                                          // 829
        }                                                                                                              // 830
    });                                                                                                                // 831
                                                                                                                       // 832
                                                                                                                       // 833
    Tooltip = createClass({                                                                                            // 834
        sizeStyle: 'position: static !important;' +                                                                    // 835
            'display: block !important;' +                                                                             // 836
            'visibility: hidden !important;' +                                                                         // 837
            'float: left !important;',                                                                                 // 838
                                                                                                                       // 839
        init: function (options) {                                                                                     // 840
            var tooltipClassname = options.get('tooltipClassname', 'jqstooltip'),                                      // 841
                sizetipStyle = this.sizeStyle,                                                                         // 842
                offset;                                                                                                // 843
            this.container = options.get('tooltipContainer') || document.body;                                         // 844
            this.tooltipOffsetX = options.get('tooltipOffsetX', 10);                                                   // 845
            this.tooltipOffsetY = options.get('tooltipOffsetY', 12);                                                   // 846
            // remove any previous lingering tooltip                                                                   // 847
            $('#jqssizetip').remove();                                                                                 // 848
            $('#jqstooltip').remove();                                                                                 // 849
            this.sizetip = $('<div/>', {                                                                               // 850
                id: 'jqssizetip',                                                                                      // 851
                style: sizetipStyle,                                                                                   // 852
                'class': tooltipClassname                                                                              // 853
            });                                                                                                        // 854
            this.tooltip = $('<div/>', {                                                                               // 855
                id: 'jqstooltip',                                                                                      // 856
                'class': tooltipClassname                                                                              // 857
            }).appendTo(this.container);                                                                               // 858
            // account for the container's location                                                                    // 859
            offset = this.tooltip.offset();                                                                            // 860
            this.offsetLeft = offset.left;                                                                             // 861
            this.offsetTop = offset.top;                                                                               // 862
            this.hidden = true;                                                                                        // 863
            $(window).unbind('resize.jqs scroll.jqs');                                                                 // 864
            $(window).bind('resize.jqs scroll.jqs', $.proxy(this.updateWindowDims, this));                             // 865
            this.updateWindowDims();                                                                                   // 866
        },                                                                                                             // 867
                                                                                                                       // 868
        updateWindowDims: function () {                                                                                // 869
            this.scrollTop = $(window).scrollTop();                                                                    // 870
            this.scrollLeft = $(window).scrollLeft();                                                                  // 871
            this.scrollRight = this.scrollLeft + $(window).width();                                                    // 872
            this.updatePosition();                                                                                     // 873
        },                                                                                                             // 874
                                                                                                                       // 875
        getSize: function (content) {                                                                                  // 876
            this.sizetip.html(content).appendTo(this.container);                                                       // 877
            this.width = this.sizetip.width() + 1;                                                                     // 878
            this.height = this.sizetip.height();                                                                       // 879
            this.sizetip.remove();                                                                                     // 880
        },                                                                                                             // 881
                                                                                                                       // 882
        setContent: function (content) {                                                                               // 883
            if (!content) {                                                                                            // 884
                this.tooltip.css('visibility', 'hidden');                                                              // 885
                this.hidden = true;                                                                                    // 886
                return;                                                                                                // 887
            }                                                                                                          // 888
            this.getSize(content);                                                                                     // 889
            this.tooltip.html(content)                                                                                 // 890
                .css({                                                                                                 // 891
                    'width': this.width,                                                                               // 892
                    'height': this.height,                                                                             // 893
                    'visibility': 'visible'                                                                            // 894
                });                                                                                                    // 895
            if (this.hidden) {                                                                                         // 896
                this.hidden = false;                                                                                   // 897
                this.updatePosition();                                                                                 // 898
            }                                                                                                          // 899
        },                                                                                                             // 900
                                                                                                                       // 901
        updatePosition: function (x, y) {                                                                              // 902
            if (x === undefined) {                                                                                     // 903
                if (this.mousex === undefined) {                                                                       // 904
                    return;                                                                                            // 905
                }                                                                                                      // 906
                x = this.mousex - this.offsetLeft;                                                                     // 907
                y = this.mousey - this.offsetTop;                                                                      // 908
                                                                                                                       // 909
            } else {                                                                                                   // 910
                this.mousex = x = x - this.offsetLeft;                                                                 // 911
                this.mousey = y = y - this.offsetTop;                                                                  // 912
            }                                                                                                          // 913
            if (!this.height || !this.width || this.hidden) {                                                          // 914
                return;                                                                                                // 915
            }                                                                                                          // 916
                                                                                                                       // 917
            y -= this.height + this.tooltipOffsetY;                                                                    // 918
            x += this.tooltipOffsetX;                                                                                  // 919
                                                                                                                       // 920
            if (y < this.scrollTop) {                                                                                  // 921
                y = this.scrollTop;                                                                                    // 922
            }                                                                                                          // 923
            if (x < this.scrollLeft) {                                                                                 // 924
                x = this.scrollLeft;                                                                                   // 925
            } else if (x + this.width > this.scrollRight) {                                                            // 926
                x = this.scrollRight - this.width;                                                                     // 927
            }                                                                                                          // 928
                                                                                                                       // 929
            this.tooltip.css({                                                                                         // 930
                'left': x,                                                                                             // 931
                'top': y                                                                                               // 932
            });                                                                                                        // 933
        },                                                                                                             // 934
                                                                                                                       // 935
        remove: function () {                                                                                          // 936
            this.tooltip.remove();                                                                                     // 937
            this.sizetip.remove();                                                                                     // 938
            this.sizetip = this.tooltip = undefined;                                                                   // 939
            $(window).unbind('resize.jqs scroll.jqs');                                                                 // 940
        }                                                                                                              // 941
    });                                                                                                                // 942
                                                                                                                       // 943
    initStyles = function() {                                                                                          // 944
        addCSS(defaultStyles);                                                                                         // 945
    };                                                                                                                 // 946
                                                                                                                       // 947
    $(initStyles);                                                                                                     // 948
                                                                                                                       // 949
    pending = [];                                                                                                      // 950
    $.fn.sparkline = function (userValues, userOptions) {                                                              // 951
        return this.each(function () {                                                                                 // 952
            var options = new $.fn.sparkline.options(this, userOptions),                                               // 953
                 $this = $(this),                                                                                      // 954
                 render, i;                                                                                            // 955
            render = function () {                                                                                     // 956
                var values, width, height, tmp, mhandler, sp, vals;                                                    // 957
                if (userValues === 'html' || userValues === undefined) {                                               // 958
                    vals = this.getAttribute(options.get('tagValuesAttribute'));                                       // 959
                    if (vals === undefined || vals === null) {                                                         // 960
                        vals = $this.html();                                                                           // 961
                    }                                                                                                  // 962
                    values = vals.replace(/(^\s*<!--)|(-->\s*$)|\s+/g, '').split(',');                                 // 963
                } else {                                                                                               // 964
                    values = userValues;                                                                               // 965
                }                                                                                                      // 966
                                                                                                                       // 967
                width = options.get('width') === 'auto' ? values.length * options.get('defaultPixelsPerValue') : options.get('width');
                if (options.get('height') === 'auto') {                                                                // 969
                    if (!options.get('composite') || !$.data(this, '_jqs_vcanvas')) {                                  // 970
                        // must be a better way to get the line height                                                 // 971
                        tmp = document.createElement('span');                                                          // 972
                        tmp.innerHTML = 'a';                                                                           // 973
                        $this.html(tmp);                                                                               // 974
                        height = $(tmp).innerHeight() || $(tmp).height();                                              // 975
                        $(tmp).remove();                                                                               // 976
                        tmp = null;                                                                                    // 977
                    }                                                                                                  // 978
                } else {                                                                                               // 979
                    height = options.get('height');                                                                    // 980
                }                                                                                                      // 981
                                                                                                                       // 982
                if (!options.get('disableInteraction')) {                                                              // 983
                    mhandler = $.data(this, '_jqs_mhandler');                                                          // 984
                    if (!mhandler) {                                                                                   // 985
                        mhandler = new MouseHandler(this, options);                                                    // 986
                        $.data(this, '_jqs_mhandler', mhandler);                                                       // 987
                    } else if (!options.get('composite')) {                                                            // 988
                        mhandler.reset();                                                                              // 989
                    }                                                                                                  // 990
                } else {                                                                                               // 991
                    mhandler = false;                                                                                  // 992
                }                                                                                                      // 993
                                                                                                                       // 994
                if (options.get('composite') && !$.data(this, '_jqs_vcanvas')) {                                       // 995
                    if (!$.data(this, '_jqs_errnotify')) {                                                             // 996
                        alert('Attempted to attach a composite sparkline to an element with no existing sparkline');   // 997
                        $.data(this, '_jqs_errnotify', true);                                                          // 998
                    }                                                                                                  // 999
                    return;                                                                                            // 1000
                }                                                                                                      // 1001
                                                                                                                       // 1002
                sp = new $.fn.sparkline[options.get('type')](this, values, options, width, height);                    // 1003
                                                                                                                       // 1004
                sp.render();                                                                                           // 1005
                                                                                                                       // 1006
                if (mhandler) {                                                                                        // 1007
                    mhandler.registerSparkline(sp);                                                                    // 1008
                }                                                                                                      // 1009
            };                                                                                                         // 1010
            if (($(this).html() && !options.get('disableHiddenCheck') && $(this).is(':hidden')) || !$(this).parents('body').length) {
                if (!options.get('composite') && $.data(this, '_jqs_pending')) {                                       // 1012
                    // remove any existing references to the element                                                   // 1013
                    for (i = pending.length; i; i--) {                                                                 // 1014
                        if (pending[i - 1][0] == this) {                                                               // 1015
                            pending.splice(i - 1, 1);                                                                  // 1016
                        }                                                                                              // 1017
                    }                                                                                                  // 1018
                }                                                                                                      // 1019
                pending.push([this, render]);                                                                          // 1020
                $.data(this, '_jqs_pending', true);                                                                    // 1021
            } else {                                                                                                   // 1022
                render.call(this);                                                                                     // 1023
            }                                                                                                          // 1024
        });                                                                                                            // 1025
    };                                                                                                                 // 1026
                                                                                                                       // 1027
    $.fn.sparkline.defaults = getDefaults();                                                                           // 1028
                                                                                                                       // 1029
                                                                                                                       // 1030
    $.sparkline_display_visible = function () {                                                                        // 1031
        var el, i, pl;                                                                                                 // 1032
        var done = [];                                                                                                 // 1033
        for (i = 0, pl = pending.length; i < pl; i++) {                                                                // 1034
            el = pending[i][0];                                                                                        // 1035
            if ($(el).is(':visible') && !$(el).parents().is(':hidden')) {                                              // 1036
                pending[i][1].call(el);                                                                                // 1037
                $.data(pending[i][0], '_jqs_pending', false);                                                          // 1038
                done.push(i);                                                                                          // 1039
            } else if (!$(el).closest('html').length && !$.data(el, '_jqs_pending')) {                                 // 1040
                // element has been inserted and removed from the DOM                                                  // 1041
                // If it was not yet inserted into the dom then the .data request                                      // 1042
                // will return true.                                                                                   // 1043
                // removing from the dom causes the data to be removed.                                                // 1044
                $.data(pending[i][0], '_jqs_pending', false);                                                          // 1045
                done.push(i);                                                                                          // 1046
            }                                                                                                          // 1047
        }                                                                                                              // 1048
        for (i = done.length; i; i--) {                                                                                // 1049
            pending.splice(done[i - 1], 1);                                                                            // 1050
        }                                                                                                              // 1051
    };                                                                                                                 // 1052
                                                                                                                       // 1053
                                                                                                                       // 1054
    /**                                                                                                                // 1055
     * User option handler                                                                                             // 1056
     */                                                                                                                // 1057
    $.fn.sparkline.options = createClass({                                                                             // 1058
        init: function (tag, userOptions) {                                                                            // 1059
            var extendedOptions, defaults, base, tagOptionType;                                                        // 1060
            this.userOptions = userOptions = userOptions || {};                                                        // 1061
            this.tag = tag;                                                                                            // 1062
            this.tagValCache = {};                                                                                     // 1063
            defaults = $.fn.sparkline.defaults;                                                                        // 1064
            base = defaults.common;                                                                                    // 1065
            this.tagOptionsPrefix = userOptions.enableTagOptions && (userOptions.tagOptionsPrefix || base.tagOptionsPrefix);
                                                                                                                       // 1067
            tagOptionType = this.getTagSetting('type');                                                                // 1068
            if (tagOptionType === UNSET_OPTION) {                                                                      // 1069
                extendedOptions = defaults[userOptions.type || base.type];                                             // 1070
            } else {                                                                                                   // 1071
                extendedOptions = defaults[tagOptionType];                                                             // 1072
            }                                                                                                          // 1073
            this.mergedOptions = $.extend({}, base, extendedOptions, userOptions);                                     // 1074
        },                                                                                                             // 1075
                                                                                                                       // 1076
                                                                                                                       // 1077
        getTagSetting: function (key) {                                                                                // 1078
            var prefix = this.tagOptionsPrefix,                                                                        // 1079
                val, i, pairs, keyval;                                                                                 // 1080
            if (prefix === false || prefix === undefined) {                                                            // 1081
                return UNSET_OPTION;                                                                                   // 1082
            }                                                                                                          // 1083
            if (this.tagValCache.hasOwnProperty(key)) {                                                                // 1084
                val = this.tagValCache.key;                                                                            // 1085
            } else {                                                                                                   // 1086
                val = this.tag.getAttribute(prefix + key);                                                             // 1087
                if (val === undefined || val === null) {                                                               // 1088
                    val = UNSET_OPTION;                                                                                // 1089
                } else if (val.substr(0, 1) === '[') {                                                                 // 1090
                    val = val.substr(1, val.length - 2).split(',');                                                    // 1091
                    for (i = val.length; i--;) {                                                                       // 1092
                        val[i] = normalizeValue(val[i].replace(/(^\s*)|(\s*$)/g, ''));                                 // 1093
                    }                                                                                                  // 1094
                } else if (val.substr(0, 1) === '{') {                                                                 // 1095
                    pairs = val.substr(1, val.length - 2).split(',');                                                  // 1096
                    val = {};                                                                                          // 1097
                    for (i = pairs.length; i--;) {                                                                     // 1098
                        keyval = pairs[i].split(':', 2);                                                               // 1099
                        val[keyval[0].replace(/(^\s*)|(\s*$)/g, '')] = normalizeValue(keyval[1].replace(/(^\s*)|(\s*$)/g, ''));
                    }                                                                                                  // 1101
                } else {                                                                                               // 1102
                    val = normalizeValue(val);                                                                         // 1103
                }                                                                                                      // 1104
                this.tagValCache.key = val;                                                                            // 1105
            }                                                                                                          // 1106
            return val;                                                                                                // 1107
        },                                                                                                             // 1108
                                                                                                                       // 1109
        get: function (key, defaultval) {                                                                              // 1110
            var tagOption = this.getTagSetting(key),                                                                   // 1111
                result;                                                                                                // 1112
            if (tagOption !== UNSET_OPTION) {                                                                          // 1113
                return tagOption;                                                                                      // 1114
            }                                                                                                          // 1115
            return (result = this.mergedOptions[key]) === undefined ? defaultval : result;                             // 1116
        }                                                                                                              // 1117
    });                                                                                                                // 1118
                                                                                                                       // 1119
                                                                                                                       // 1120
    $.fn.sparkline._base = createClass({                                                                               // 1121
        disabled: false,                                                                                               // 1122
                                                                                                                       // 1123
        init: function (el, values, options, width, height) {                                                          // 1124
            this.el = el;                                                                                              // 1125
            this.$el = $(el);                                                                                          // 1126
            this.values = values;                                                                                      // 1127
            this.options = options;                                                                                    // 1128
            this.width = width;                                                                                        // 1129
            this.height = height;                                                                                      // 1130
            this.currentRegion = undefined;                                                                            // 1131
        },                                                                                                             // 1132
                                                                                                                       // 1133
        /**                                                                                                            // 1134
         * Setup the canvas                                                                                            // 1135
         */                                                                                                            // 1136
        initTarget: function () {                                                                                      // 1137
            var interactive = !this.options.get('disableInteraction');                                                 // 1138
            if (!(this.target = this.$el.simpledraw(this.width, this.height, this.options.get('composite'), interactive))) {
                this.disabled = true;                                                                                  // 1140
            } else {                                                                                                   // 1141
                this.canvasWidth = this.target.pixelWidth;                                                             // 1142
                this.canvasHeight = this.target.pixelHeight;                                                           // 1143
            }                                                                                                          // 1144
        },                                                                                                             // 1145
                                                                                                                       // 1146
        /**                                                                                                            // 1147
         * Actually render the chart to the canvas                                                                     // 1148
         */                                                                                                            // 1149
        render: function () {                                                                                          // 1150
            if (this.disabled) {                                                                                       // 1151
                this.el.innerHTML = '';                                                                                // 1152
                return false;                                                                                          // 1153
            }                                                                                                          // 1154
            return true;                                                                                               // 1155
        },                                                                                                             // 1156
                                                                                                                       // 1157
        /**                                                                                                            // 1158
         * Return a region id for a given x/y co-ordinate                                                              // 1159
         */                                                                                                            // 1160
        getRegion: function (x, y) {                                                                                   // 1161
        },                                                                                                             // 1162
                                                                                                                       // 1163
        /**                                                                                                            // 1164
         * Highlight an item based on the moused-over x,y co-ordinate                                                  // 1165
         */                                                                                                            // 1166
        setRegionHighlight: function (el, x, y) {                                                                      // 1167
            var currentRegion = this.currentRegion,                                                                    // 1168
                highlightEnabled = !this.options.get('disableHighlight'),                                              // 1169
                newRegion;                                                                                             // 1170
            if (x > this.canvasWidth || y > this.canvasHeight || x < 0 || y < 0) {                                     // 1171
                return null;                                                                                           // 1172
            }                                                                                                          // 1173
            newRegion = this.getRegion(el, x, y);                                                                      // 1174
            if (currentRegion !== newRegion) {                                                                         // 1175
                if (currentRegion !== undefined && highlightEnabled) {                                                 // 1176
                    this.removeHighlight();                                                                            // 1177
                }                                                                                                      // 1178
                this.currentRegion = newRegion;                                                                        // 1179
                if (newRegion !== undefined && highlightEnabled) {                                                     // 1180
                    this.renderHighlight();                                                                            // 1181
                }                                                                                                      // 1182
                return true;                                                                                           // 1183
            }                                                                                                          // 1184
            return false;                                                                                              // 1185
        },                                                                                                             // 1186
                                                                                                                       // 1187
        /**                                                                                                            // 1188
         * Reset any currently highlighted item                                                                        // 1189
         */                                                                                                            // 1190
        clearRegionHighlight: function () {                                                                            // 1191
            if (this.currentRegion !== undefined) {                                                                    // 1192
                this.removeHighlight();                                                                                // 1193
                this.currentRegion = undefined;                                                                        // 1194
                return true;                                                                                           // 1195
            }                                                                                                          // 1196
            return false;                                                                                              // 1197
        },                                                                                                             // 1198
                                                                                                                       // 1199
        renderHighlight: function () {                                                                                 // 1200
            this.changeHighlight(true);                                                                                // 1201
        },                                                                                                             // 1202
                                                                                                                       // 1203
        removeHighlight: function () {                                                                                 // 1204
            this.changeHighlight(false);                                                                               // 1205
        },                                                                                                             // 1206
                                                                                                                       // 1207
        changeHighlight: function (highlight)  {},                                                                     // 1208
                                                                                                                       // 1209
        /**                                                                                                            // 1210
         * Fetch the HTML to display as a tooltip                                                                      // 1211
         */                                                                                                            // 1212
        getCurrentRegionTooltip: function () {                                                                         // 1213
            var options = this.options,                                                                                // 1214
                header = '',                                                                                           // 1215
                entries = [],                                                                                          // 1216
                fields, formats, formatlen, fclass, text, i,                                                           // 1217
                showFields, showFieldsKey, newFields, fv,                                                              // 1218
                formatter, format, fieldlen, j;                                                                        // 1219
            if (this.currentRegion === undefined) {                                                                    // 1220
                return '';                                                                                             // 1221
            }                                                                                                          // 1222
            fields = this.getCurrentRegionFields();                                                                    // 1223
            formatter = options.get('tooltipFormatter');                                                               // 1224
            if (formatter) {                                                                                           // 1225
                return formatter(this, options, fields);                                                               // 1226
            }                                                                                                          // 1227
            if (options.get('tooltipChartTitle')) {                                                                    // 1228
                header += '<div class="jqs jqstitle">' + options.get('tooltipChartTitle') + '</div>\n';                // 1229
            }                                                                                                          // 1230
            formats = this.options.get('tooltipFormat');                                                               // 1231
            if (!formats) {                                                                                            // 1232
                return '';                                                                                             // 1233
            }                                                                                                          // 1234
            if (!$.isArray(formats)) {                                                                                 // 1235
                formats = [formats];                                                                                   // 1236
            }                                                                                                          // 1237
            if (!$.isArray(fields)) {                                                                                  // 1238
                fields = [fields];                                                                                     // 1239
            }                                                                                                          // 1240
            showFields = this.options.get('tooltipFormatFieldlist');                                                   // 1241
            showFieldsKey = this.options.get('tooltipFormatFieldlistKey');                                             // 1242
            if (showFields && showFieldsKey) {                                                                         // 1243
                // user-selected ordering of fields                                                                    // 1244
                newFields = [];                                                                                        // 1245
                for (i = fields.length; i--;) {                                                                        // 1246
                    fv = fields[i][showFieldsKey];                                                                     // 1247
                    if ((j = $.inArray(fv, showFields)) != -1) {                                                       // 1248
                        newFields[j] = fields[i];                                                                      // 1249
                    }                                                                                                  // 1250
                }                                                                                                      // 1251
                fields = newFields;                                                                                    // 1252
            }                                                                                                          // 1253
            formatlen = formats.length;                                                                                // 1254
            fieldlen = fields.length;                                                                                  // 1255
            for (i = 0; i < formatlen; i++) {                                                                          // 1256
                format = formats[i];                                                                                   // 1257
                if (typeof format === 'string') {                                                                      // 1258
                    format = new SPFormat(format);                                                                     // 1259
                }                                                                                                      // 1260
                fclass = format.fclass || 'jqsfield';                                                                  // 1261
                for (j = 0; j < fieldlen; j++) {                                                                       // 1262
                    if (!fields[j].isNull || !options.get('tooltipSkipNull')) {                                        // 1263
                        $.extend(fields[j], {                                                                          // 1264
                            prefix: options.get('tooltipPrefix'),                                                      // 1265
                            suffix: options.get('tooltipSuffix')                                                       // 1266
                        });                                                                                            // 1267
                        text = format.render(fields[j], options.get('tooltipValueLookups'), options);                  // 1268
                        entries.push('<div class="' + fclass + '">' + text + '</div>');                                // 1269
                    }                                                                                                  // 1270
                }                                                                                                      // 1271
            }                                                                                                          // 1272
            if (entries.length) {                                                                                      // 1273
                return header + entries.join('\n');                                                                    // 1274
            }                                                                                                          // 1275
            return '';                                                                                                 // 1276
        },                                                                                                             // 1277
                                                                                                                       // 1278
        getCurrentRegionFields: function () {},                                                                        // 1279
                                                                                                                       // 1280
        calcHighlightColor: function (color, options) {                                                                // 1281
            var highlightColor = options.get('highlightColor'),                                                        // 1282
                lighten = options.get('highlightLighten'),                                                             // 1283
                parse, mult, rgbnew, i;                                                                                // 1284
            if (highlightColor) {                                                                                      // 1285
                return highlightColor;                                                                                 // 1286
            }                                                                                                          // 1287
            if (lighten) {                                                                                             // 1288
                // extract RGB values                                                                                  // 1289
                parse = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color) || /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
                if (parse) {                                                                                           // 1291
                    rgbnew = [];                                                                                       // 1292
                    mult = color.length === 4 ? 16 : 1;                                                                // 1293
                    for (i = 0; i < 3; i++) {                                                                          // 1294
                        rgbnew[i] = clipval(Math.round(parseInt(parse[i + 1], 16) * mult * lighten), 0, 255);          // 1295
                    }                                                                                                  // 1296
                    return 'rgb(' + rgbnew.join(',') + ')';                                                            // 1297
                }                                                                                                      // 1298
                                                                                                                       // 1299
            }                                                                                                          // 1300
            return color;                                                                                              // 1301
        }                                                                                                              // 1302
                                                                                                                       // 1303
    });                                                                                                                // 1304
                                                                                                                       // 1305
    barHighlightMixin = {                                                                                              // 1306
        changeHighlight: function (highlight) {                                                                        // 1307
            var currentRegion = this.currentRegion,                                                                    // 1308
                target = this.target,                                                                                  // 1309
                shapeids = this.regionShapes[currentRegion],                                                           // 1310
                newShapes;                                                                                             // 1311
            // will be null if the region value was null                                                               // 1312
            if (shapeids) {                                                                                            // 1313
                newShapes = this.renderRegion(currentRegion, highlight);                                               // 1314
                if ($.isArray(newShapes) || $.isArray(shapeids)) {                                                     // 1315
                    target.replaceWithShapes(shapeids, newShapes);                                                     // 1316
                    this.regionShapes[currentRegion] = $.map(newShapes, function (newShape) {                          // 1317
                        return newShape.id;                                                                            // 1318
                    });                                                                                                // 1319
                } else {                                                                                               // 1320
                    target.replaceWithShape(shapeids, newShapes);                                                      // 1321
                    this.regionShapes[currentRegion] = newShapes.id;                                                   // 1322
                }                                                                                                      // 1323
            }                                                                                                          // 1324
        },                                                                                                             // 1325
                                                                                                                       // 1326
        render: function () {                                                                                          // 1327
            var values = this.values,                                                                                  // 1328
                target = this.target,                                                                                  // 1329
                regionShapes = this.regionShapes,                                                                      // 1330
                shapes, ids, i, j;                                                                                     // 1331
                                                                                                                       // 1332
            if (!this.cls._super.render.call(this)) {                                                                  // 1333
                return;                                                                                                // 1334
            }                                                                                                          // 1335
            for (i = values.length; i--;) {                                                                            // 1336
                shapes = this.renderRegion(i);                                                                         // 1337
                if (shapes) {                                                                                          // 1338
                    if ($.isArray(shapes)) {                                                                           // 1339
                        ids = [];                                                                                      // 1340
                        for (j = shapes.length; j--;) {                                                                // 1341
                            shapes[j].append();                                                                        // 1342
                            ids.push(shapes[j].id);                                                                    // 1343
                        }                                                                                              // 1344
                        regionShapes[i] = ids;                                                                         // 1345
                    } else {                                                                                           // 1346
                        shapes.append();                                                                               // 1347
                        regionShapes[i] = shapes.id; // store just the shapeid                                         // 1348
                    }                                                                                                  // 1349
                } else {                                                                                               // 1350
                    // null value                                                                                      // 1351
                    regionShapes[i] = null;                                                                            // 1352
                }                                                                                                      // 1353
            }                                                                                                          // 1354
            target.render();                                                                                           // 1355
        }                                                                                                              // 1356
    };                                                                                                                 // 1357
                                                                                                                       // 1358
    /**                                                                                                                // 1359
     * Line charts                                                                                                     // 1360
     */                                                                                                                // 1361
    $.fn.sparkline.line = line = createClass($.fn.sparkline._base, {                                                   // 1362
        type: 'line',                                                                                                  // 1363
                                                                                                                       // 1364
        init: function (el, values, options, width, height) {                                                          // 1365
            line._super.init.call(this, el, values, options, width, height);                                           // 1366
            this.vertices = [];                                                                                        // 1367
            this.regionMap = [];                                                                                       // 1368
            this.xvalues = [];                                                                                         // 1369
            this.yvalues = [];                                                                                         // 1370
            this.yminmax = [];                                                                                         // 1371
            this.hightlightSpotId = null;                                                                              // 1372
            this.lastShapeId = null;                                                                                   // 1373
            this.initTarget();                                                                                         // 1374
        },                                                                                                             // 1375
                                                                                                                       // 1376
        getRegion: function (el, x, y) {                                                                               // 1377
            var i,                                                                                                     // 1378
                regionMap = this.regionMap; // maps regions to value positions                                         // 1379
            for (i = regionMap.length; i--;) {                                                                         // 1380
                if (regionMap[i] !== null && x >= regionMap[i][0] && x <= regionMap[i][1]) {                           // 1381
                    return regionMap[i][2];                                                                            // 1382
                }                                                                                                      // 1383
            }                                                                                                          // 1384
            return undefined;                                                                                          // 1385
        },                                                                                                             // 1386
                                                                                                                       // 1387
        getCurrentRegionFields: function () {                                                                          // 1388
            var currentRegion = this.currentRegion;                                                                    // 1389
            return {                                                                                                   // 1390
                isNull: this.yvalues[currentRegion] === null,                                                          // 1391
                x: this.xvalues[currentRegion],                                                                        // 1392
                y: this.yvalues[currentRegion],                                                                        // 1393
                color: this.options.get('lineColor'),                                                                  // 1394
                fillColor: this.options.get('fillColor'),                                                              // 1395
                offset: currentRegion                                                                                  // 1396
            };                                                                                                         // 1397
        },                                                                                                             // 1398
                                                                                                                       // 1399
        renderHighlight: function () {                                                                                 // 1400
            var currentRegion = this.currentRegion,                                                                    // 1401
                target = this.target,                                                                                  // 1402
                vertex = this.vertices[currentRegion],                                                                 // 1403
                options = this.options,                                                                                // 1404
                spotRadius = options.get('spotRadius'),                                                                // 1405
                highlightSpotColor = options.get('highlightSpotColor'),                                                // 1406
                highlightLineColor = options.get('highlightLineColor'),                                                // 1407
                highlightSpot, highlightLine;                                                                          // 1408
                                                                                                                       // 1409
            if (!vertex) {                                                                                             // 1410
                return;                                                                                                // 1411
            }                                                                                                          // 1412
            if (spotRadius && highlightSpotColor) {                                                                    // 1413
                highlightSpot = target.drawCircle(vertex[0], vertex[1],                                                // 1414
                    spotRadius, undefined, highlightSpotColor);                                                        // 1415
                this.highlightSpotId = highlightSpot.id;                                                               // 1416
                target.insertAfterShape(this.lastShapeId, highlightSpot);                                              // 1417
            }                                                                                                          // 1418
            if (highlightLineColor) {                                                                                  // 1419
                highlightLine = target.drawLine(vertex[0], this.canvasTop, vertex[0],                                  // 1420
                    this.canvasTop + this.canvasHeight, highlightLineColor);                                           // 1421
                this.highlightLineId = highlightLine.id;                                                               // 1422
                target.insertAfterShape(this.lastShapeId, highlightLine);                                              // 1423
            }                                                                                                          // 1424
        },                                                                                                             // 1425
                                                                                                                       // 1426
        removeHighlight: function () {                                                                                 // 1427
            var target = this.target;                                                                                  // 1428
            if (this.highlightSpotId) {                                                                                // 1429
                target.removeShapeId(this.highlightSpotId);                                                            // 1430
                this.highlightSpotId = null;                                                                           // 1431
            }                                                                                                          // 1432
            if (this.highlightLineId) {                                                                                // 1433
                target.removeShapeId(this.highlightLineId);                                                            // 1434
                this.highlightLineId = null;                                                                           // 1435
            }                                                                                                          // 1436
        },                                                                                                             // 1437
                                                                                                                       // 1438
        scanValues: function () {                                                                                      // 1439
            var values = this.values,                                                                                  // 1440
                valcount = values.length,                                                                              // 1441
                xvalues = this.xvalues,                                                                                // 1442
                yvalues = this.yvalues,                                                                                // 1443
                yminmax = this.yminmax,                                                                                // 1444
                i, val, isStr, isArray, sp;                                                                            // 1445
            for (i = 0; i < valcount; i++) {                                                                           // 1446
                val = values[i];                                                                                       // 1447
                isStr = typeof(values[i]) === 'string';                                                                // 1448
                isArray = typeof(values[i]) === 'object' && values[i] instanceof Array;                                // 1449
                sp = isStr && values[i].split(':');                                                                    // 1450
                if (isStr && sp.length === 2) { // x:y                                                                 // 1451
                    xvalues.push(Number(sp[0]));                                                                       // 1452
                    yvalues.push(Number(sp[1]));                                                                       // 1453
                    yminmax.push(Number(sp[1]));                                                                       // 1454
                } else if (isArray) {                                                                                  // 1455
                    xvalues.push(val[0]);                                                                              // 1456
                    yvalues.push(val[1]);                                                                              // 1457
                    yminmax.push(val[1]);                                                                              // 1458
                } else {                                                                                               // 1459
                    xvalues.push(i);                                                                                   // 1460
                    if (values[i] === null || values[i] === 'null') {                                                  // 1461
                        yvalues.push(null);                                                                            // 1462
                    } else {                                                                                           // 1463
                        yvalues.push(Number(val));                                                                     // 1464
                        yminmax.push(Number(val));                                                                     // 1465
                    }                                                                                                  // 1466
                }                                                                                                      // 1467
            }                                                                                                          // 1468
            if (this.options.get('xvalues')) {                                                                         // 1469
                xvalues = this.options.get('xvalues');                                                                 // 1470
            }                                                                                                          // 1471
                                                                                                                       // 1472
            this.maxy = this.maxyorg = Math.max.apply(Math, yminmax);                                                  // 1473
            this.miny = this.minyorg = Math.min.apply(Math, yminmax);                                                  // 1474
                                                                                                                       // 1475
            this.maxx = Math.max.apply(Math, xvalues);                                                                 // 1476
            this.minx = Math.min.apply(Math, xvalues);                                                                 // 1477
                                                                                                                       // 1478
            this.xvalues = xvalues;                                                                                    // 1479
            this.yvalues = yvalues;                                                                                    // 1480
            this.yminmax = yminmax;                                                                                    // 1481
                                                                                                                       // 1482
        },                                                                                                             // 1483
                                                                                                                       // 1484
        processRangeOptions: function () {                                                                             // 1485
            var options = this.options,                                                                                // 1486
                normalRangeMin = options.get('normalRangeMin'),                                                        // 1487
                normalRangeMax = options.get('normalRangeMax');                                                        // 1488
                                                                                                                       // 1489
            if (normalRangeMin !== undefined) {                                                                        // 1490
                if (normalRangeMin < this.miny) {                                                                      // 1491
                    this.miny = normalRangeMin;                                                                        // 1492
                }                                                                                                      // 1493
                if (normalRangeMax > this.maxy) {                                                                      // 1494
                    this.maxy = normalRangeMax;                                                                        // 1495
                }                                                                                                      // 1496
            }                                                                                                          // 1497
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < this.miny)) {
                this.miny = options.get('chartRangeMin');                                                              // 1499
            }                                                                                                          // 1500
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > this.maxy)) {
                this.maxy = options.get('chartRangeMax');                                                              // 1502
            }                                                                                                          // 1503
            if (options.get('chartRangeMinX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMinX') < this.minx)) {
                this.minx = options.get('chartRangeMinX');                                                             // 1505
            }                                                                                                          // 1506
            if (options.get('chartRangeMaxX') !== undefined && (options.get('chartRangeClipX') || options.get('chartRangeMaxX') > this.maxx)) {
                this.maxx = options.get('chartRangeMaxX');                                                             // 1508
            }                                                                                                          // 1509
                                                                                                                       // 1510
        },                                                                                                             // 1511
                                                                                                                       // 1512
        drawNormalRange: function (canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey) {                         // 1513
            var normalRangeMin = this.options.get('normalRangeMin'),                                                   // 1514
                normalRangeMax = this.options.get('normalRangeMax'),                                                   // 1515
                ytop = canvasTop + Math.round(canvasHeight - (canvasHeight * ((normalRangeMax - this.miny) / rangey))),
                height = Math.round((canvasHeight * (normalRangeMax - normalRangeMin)) / rangey);                      // 1517
            this.target.drawRect(canvasLeft, ytop, canvasWidth, height, undefined, this.options.get('normalRangeColor')).append();
        },                                                                                                             // 1519
                                                                                                                       // 1520
        render: function () {                                                                                          // 1521
            var options = this.options,                                                                                // 1522
                target = this.target,                                                                                  // 1523
                canvasWidth = this.canvasWidth,                                                                        // 1524
                canvasHeight = this.canvasHeight,                                                                      // 1525
                vertices = this.vertices,                                                                              // 1526
                spotRadius = options.get('spotRadius'),                                                                // 1527
                regionMap = this.regionMap,                                                                            // 1528
                rangex, rangey, yvallast,                                                                              // 1529
                canvasTop, canvasLeft,                                                                                 // 1530
                vertex, path, paths, x, y, xnext, xpos, xposnext,                                                      // 1531
                last, next, yvalcount, lineShapes, fillShapes, plen,                                                   // 1532
                valueSpots, hlSpotsEnabled, color, xvalues, yvalues, i;                                                // 1533
                                                                                                                       // 1534
            if (!line._super.render.call(this)) {                                                                      // 1535
                return;                                                                                                // 1536
            }                                                                                                          // 1537
                                                                                                                       // 1538
            this.scanValues();                                                                                         // 1539
            this.processRangeOptions();                                                                                // 1540
                                                                                                                       // 1541
            xvalues = this.xvalues;                                                                                    // 1542
            yvalues = this.yvalues;                                                                                    // 1543
                                                                                                                       // 1544
            if (!this.yminmax.length || this.yvalues.length < 2) {                                                     // 1545
                // empty or all null valuess                                                                           // 1546
                return;                                                                                                // 1547
            }                                                                                                          // 1548
                                                                                                                       // 1549
            canvasTop = canvasLeft = 0;                                                                                // 1550
                                                                                                                       // 1551
            rangex = this.maxx - this.minx === 0 ? 1 : this.maxx - this.minx;                                          // 1552
            rangey = this.maxy - this.miny === 0 ? 1 : this.maxy - this.miny;                                          // 1553
            yvallast = this.yvalues.length - 1;                                                                        // 1554
                                                                                                                       // 1555
            if (spotRadius && (canvasWidth < (spotRadius * 4) || canvasHeight < (spotRadius * 4))) {                   // 1556
                spotRadius = 0;                                                                                        // 1557
            }                                                                                                          // 1558
            if (spotRadius) {                                                                                          // 1559
                // adjust the canvas size as required so that spots will fit                                           // 1560
                hlSpotsEnabled = options.get('highlightSpotColor') &&  !options.get('disableInteraction');             // 1561
                if (hlSpotsEnabled || options.get('minSpotColor') || (options.get('spotColor') && yvalues[yvallast] === this.miny)) {
                    canvasHeight -= Math.ceil(spotRadius);                                                             // 1563
                }                                                                                                      // 1564
                if (hlSpotsEnabled || options.get('maxSpotColor') || (options.get('spotColor') && yvalues[yvallast] === this.maxy)) {
                    canvasHeight -= Math.ceil(spotRadius);                                                             // 1566
                    canvasTop += Math.ceil(spotRadius);                                                                // 1567
                }                                                                                                      // 1568
                if (hlSpotsEnabled ||                                                                                  // 1569
                     ((options.get('minSpotColor') || options.get('maxSpotColor')) && (yvalues[0] === this.miny || yvalues[0] === this.maxy))) {
                    canvasLeft += Math.ceil(spotRadius);                                                               // 1571
                    canvasWidth -= Math.ceil(spotRadius);                                                              // 1572
                }                                                                                                      // 1573
                if (hlSpotsEnabled || options.get('spotColor') ||                                                      // 1574
                    (options.get('minSpotColor') || options.get('maxSpotColor') &&                                     // 1575
                        (yvalues[yvallast] === this.miny || yvalues[yvallast] === this.maxy))) {                       // 1576
                    canvasWidth -= Math.ceil(spotRadius);                                                              // 1577
                }                                                                                                      // 1578
            }                                                                                                          // 1579
                                                                                                                       // 1580
                                                                                                                       // 1581
            canvasHeight--;                                                                                            // 1582
                                                                                                                       // 1583
            if (options.get('normalRangeMin') !== undefined && !options.get('drawNormalOnTop')) {                      // 1584
                this.drawNormalRange(canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey);                        // 1585
            }                                                                                                          // 1586
                                                                                                                       // 1587
            path = [];                                                                                                 // 1588
            paths = [path];                                                                                            // 1589
            last = next = null;                                                                                        // 1590
            yvalcount = yvalues.length;                                                                                // 1591
            for (i = 0; i < yvalcount; i++) {                                                                          // 1592
                x = xvalues[i];                                                                                        // 1593
                xnext = xvalues[i + 1];                                                                                // 1594
                y = yvalues[i];                                                                                        // 1595
                xpos = canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex));                              // 1596
                xposnext = i < yvalcount - 1 ? canvasLeft + Math.round((xnext - this.minx) * (canvasWidth / rangex)) : canvasWidth;
                next = xpos + ((xposnext - xpos) / 2);                                                                 // 1598
                regionMap[i] = [last || 0, next, i];                                                                   // 1599
                last = next;                                                                                           // 1600
                if (y === null) {                                                                                      // 1601
                    if (i) {                                                                                           // 1602
                        if (yvalues[i - 1] !== null) {                                                                 // 1603
                            path = [];                                                                                 // 1604
                            paths.push(path);                                                                          // 1605
                        }                                                                                              // 1606
                        vertices.push(null);                                                                           // 1607
                    }                                                                                                  // 1608
                } else {                                                                                               // 1609
                    if (y < this.miny) {                                                                               // 1610
                        y = this.miny;                                                                                 // 1611
                    }                                                                                                  // 1612
                    if (y > this.maxy) {                                                                               // 1613
                        y = this.maxy;                                                                                 // 1614
                    }                                                                                                  // 1615
                    if (!path.length) {                                                                                // 1616
                        // previous value was null                                                                     // 1617
                        path.push([xpos, canvasTop + canvasHeight]);                                                   // 1618
                    }                                                                                                  // 1619
                    vertex = [xpos, canvasTop + Math.round(canvasHeight - (canvasHeight * ((y - this.miny) / rangey)))];
                    path.push(vertex);                                                                                 // 1621
                    vertices.push(vertex);                                                                             // 1622
                }                                                                                                      // 1623
            }                                                                                                          // 1624
                                                                                                                       // 1625
            lineShapes = [];                                                                                           // 1626
            fillShapes = [];                                                                                           // 1627
            plen = paths.length;                                                                                       // 1628
            for (i = 0; i < plen; i++) {                                                                               // 1629
                path = paths[i];                                                                                       // 1630
                if (path.length) {                                                                                     // 1631
                    if (options.get('fillColor')) {                                                                    // 1632
                        path.push([path[path.length - 1][0], (canvasTop + canvasHeight)]);                             // 1633
                        fillShapes.push(path.slice(0));                                                                // 1634
                        path.pop();                                                                                    // 1635
                    }                                                                                                  // 1636
                    // if there's only a single point in this path, then we want to display it                         // 1637
                    // as a vertical line which means we keep path[0]  as is                                           // 1638
                    if (path.length > 2) {                                                                             // 1639
                        // else we want the first value                                                                // 1640
                        path[0] = [path[0][0], path[1][1]];                                                            // 1641
                    }                                                                                                  // 1642
                    lineShapes.push(path);                                                                             // 1643
                }                                                                                                      // 1644
            }                                                                                                          // 1645
                                                                                                                       // 1646
            // draw the fill first, then optionally the normal range, then the line on top of that                     // 1647
            plen = fillShapes.length;                                                                                  // 1648
            for (i = 0; i < plen; i++) {                                                                               // 1649
                target.drawShape(fillShapes[i],                                                                        // 1650
                    options.get('fillColor'), options.get('fillColor')).append();                                      // 1651
            }                                                                                                          // 1652
                                                                                                                       // 1653
            if (options.get('normalRangeMin') !== undefined && options.get('drawNormalOnTop')) {                       // 1654
                this.drawNormalRange(canvasLeft, canvasTop, canvasHeight, canvasWidth, rangey);                        // 1655
            }                                                                                                          // 1656
                                                                                                                       // 1657
            plen = lineShapes.length;                                                                                  // 1658
            for (i = 0; i < plen; i++) {                                                                               // 1659
                target.drawShape(lineShapes[i], options.get('lineColor'), undefined,                                   // 1660
                    options.get('lineWidth')).append();                                                                // 1661
            }                                                                                                          // 1662
                                                                                                                       // 1663
            if (spotRadius && options.get('valueSpots')) {                                                             // 1664
                valueSpots = options.get('valueSpots');                                                                // 1665
                if (valueSpots.get === undefined) {                                                                    // 1666
                    valueSpots = new RangeMap(valueSpots);                                                             // 1667
                }                                                                                                      // 1668
                for (i = 0; i < yvalcount; i++) {                                                                      // 1669
                    color = valueSpots.get(yvalues[i]);                                                                // 1670
                    if (color) {                                                                                       // 1671
                        target.drawCircle(canvasLeft + Math.round((xvalues[i] - this.minx) * (canvasWidth / rangex)),  // 1672
                            canvasTop + Math.round(canvasHeight - (canvasHeight * ((yvalues[i] - this.miny) / rangey))),
                            spotRadius, undefined,                                                                     // 1674
                            color).append();                                                                           // 1675
                    }                                                                                                  // 1676
                }                                                                                                      // 1677
                                                                                                                       // 1678
            }                                                                                                          // 1679
            if (spotRadius && options.get('spotColor') && yvalues[yvallast] !== null) {                                // 1680
                target.drawCircle(canvasLeft + Math.round((xvalues[xvalues.length - 1] - this.minx) * (canvasWidth / rangex)),
                    canvasTop + Math.round(canvasHeight - (canvasHeight * ((yvalues[yvallast] - this.miny) / rangey))),
                    spotRadius, undefined,                                                                             // 1683
                    options.get('spotColor')).append();                                                                // 1684
            }                                                                                                          // 1685
            if (this.maxy !== this.minyorg) {                                                                          // 1686
                if (spotRadius && options.get('minSpotColor')) {                                                       // 1687
                    x = xvalues[$.inArray(this.minyorg, yvalues)];                                                     // 1688
                    target.drawCircle(canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex)),               // 1689
                        canvasTop + Math.round(canvasHeight - (canvasHeight * ((this.minyorg - this.miny) / rangey))), // 1690
                        spotRadius, undefined,                                                                         // 1691
                        options.get('minSpotColor')).append();                                                         // 1692
                }                                                                                                      // 1693
                if (spotRadius && options.get('maxSpotColor')) {                                                       // 1694
                    x = xvalues[$.inArray(this.maxyorg, yvalues)];                                                     // 1695
                    target.drawCircle(canvasLeft + Math.round((x - this.minx) * (canvasWidth / rangex)),               // 1696
                        canvasTop + Math.round(canvasHeight - (canvasHeight * ((this.maxyorg - this.miny) / rangey))), // 1697
                        spotRadius, undefined,                                                                         // 1698
                        options.get('maxSpotColor')).append();                                                         // 1699
                }                                                                                                      // 1700
            }                                                                                                          // 1701
                                                                                                                       // 1702
            this.lastShapeId = target.getLastShapeId();                                                                // 1703
            this.canvasTop = canvasTop;                                                                                // 1704
            target.render();                                                                                           // 1705
        }                                                                                                              // 1706
    });                                                                                                                // 1707
                                                                                                                       // 1708
    /**                                                                                                                // 1709
     * Bar charts                                                                                                      // 1710
     */                                                                                                                // 1711
    $.fn.sparkline.bar = bar = createClass($.fn.sparkline._base, barHighlightMixin, {                                  // 1712
        type: 'bar',                                                                                                   // 1713
                                                                                                                       // 1714
        init: function (el, values, options, width, height) {                                                          // 1715
            var barWidth = parseInt(options.get('barWidth'), 10),                                                      // 1716
                barSpacing = parseInt(options.get('barSpacing'), 10),                                                  // 1717
                chartRangeMin = options.get('chartRangeMin'),                                                          // 1718
                chartRangeMax = options.get('chartRangeMax'),                                                          // 1719
                chartRangeClip = options.get('chartRangeClip'),                                                        // 1720
                stackMin = Infinity,                                                                                   // 1721
                stackMax = -Infinity,                                                                                  // 1722
                isStackString, groupMin, groupMax, stackRanges,                                                        // 1723
                numValues, i, vlen, range, zeroAxis, xaxisOffset, min, max, clipMin, clipMax,                          // 1724
                stacked, vlist, j, slen, svals, val, yoffset, yMaxCalc, canvasHeightEf;                                // 1725
            bar._super.init.call(this, el, values, options, width, height);                                            // 1726
                                                                                                                       // 1727
            // scan values to determine whether to stack bars                                                          // 1728
            for (i = 0, vlen = values.length; i < vlen; i++) {                                                         // 1729
                val = values[i];                                                                                       // 1730
                isStackString = typeof(val) === 'string' && val.indexOf(':') > -1;                                     // 1731
                if (isStackString || $.isArray(val)) {                                                                 // 1732
                    stacked = true;                                                                                    // 1733
                    if (isStackString) {                                                                               // 1734
                        val = values[i] = normalizeValues(val.split(':'));                                             // 1735
                    }                                                                                                  // 1736
                    val = remove(val, null); // min/max will treat null as zero                                        // 1737
                    groupMin = Math.min.apply(Math, val);                                                              // 1738
                    groupMax = Math.max.apply(Math, val);                                                              // 1739
                    if (groupMin < stackMin) {                                                                         // 1740
                        stackMin = groupMin;                                                                           // 1741
                    }                                                                                                  // 1742
                    if (groupMax > stackMax) {                                                                         // 1743
                        stackMax = groupMax;                                                                           // 1744
                    }                                                                                                  // 1745
                }                                                                                                      // 1746
            }                                                                                                          // 1747
                                                                                                                       // 1748
            this.stacked = stacked;                                                                                    // 1749
            this.regionShapes = {};                                                                                    // 1750
            this.barWidth = barWidth;                                                                                  // 1751
            this.barSpacing = barSpacing;                                                                              // 1752
            this.totalBarWidth = barWidth + barSpacing;                                                                // 1753
            this.width = width = (values.length * barWidth) + ((values.length - 1) * barSpacing);                      // 1754
                                                                                                                       // 1755
            this.initTarget();                                                                                         // 1756
                                                                                                                       // 1757
            if (chartRangeClip) {                                                                                      // 1758
                clipMin = chartRangeMin === undefined ? -Infinity : chartRangeMin;                                     // 1759
                clipMax = chartRangeMax === undefined ? Infinity : chartRangeMax;                                      // 1760
            }                                                                                                          // 1761
                                                                                                                       // 1762
            numValues = [];                                                                                            // 1763
            stackRanges = stacked ? [] : numValues;                                                                    // 1764
            var stackTotals = [];                                                                                      // 1765
            var stackRangesNeg = [];                                                                                   // 1766
            for (i = 0, vlen = values.length; i < vlen; i++) {                                                         // 1767
                if (stacked) {                                                                                         // 1768
                    vlist = values[i];                                                                                 // 1769
                    values[i] = svals = [];                                                                            // 1770
                    stackTotals[i] = 0;                                                                                // 1771
                    stackRanges[i] = stackRangesNeg[i] = 0;                                                            // 1772
                    for (j = 0, slen = vlist.length; j < slen; j++) {                                                  // 1773
                        val = svals[j] = chartRangeClip ? clipval(vlist[j], clipMin, clipMax) : vlist[j];              // 1774
                        if (val !== null) {                                                                            // 1775
                            if (val > 0) {                                                                             // 1776
                                stackTotals[i] += val;                                                                 // 1777
                            }                                                                                          // 1778
                            if (stackMin < 0 && stackMax > 0) {                                                        // 1779
                                if (val < 0) {                                                                         // 1780
                                    stackRangesNeg[i] += Math.abs(val);                                                // 1781
                                } else {                                                                               // 1782
                                    stackRanges[i] += val;                                                             // 1783
                                }                                                                                      // 1784
                            } else {                                                                                   // 1785
                                stackRanges[i] += Math.abs(val - (val < 0 ? stackMax : stackMin));                     // 1786
                            }                                                                                          // 1787
                            numValues.push(val);                                                                       // 1788
                        }                                                                                              // 1789
                    }                                                                                                  // 1790
                } else {                                                                                               // 1791
                    val = chartRangeClip ? clipval(values[i], clipMin, clipMax) : values[i];                           // 1792
                    val = values[i] = normalizeValue(val);                                                             // 1793
                    if (val !== null) {                                                                                // 1794
                        numValues.push(val);                                                                           // 1795
                    }                                                                                                  // 1796
                }                                                                                                      // 1797
            }                                                                                                          // 1798
            this.max = max = Math.max.apply(Math, numValues);                                                          // 1799
            this.min = min = Math.min.apply(Math, numValues);                                                          // 1800
            this.stackMax = stackMax = stacked ? Math.max.apply(Math, stackTotals) : max;                              // 1801
            this.stackMin = stackMin = stacked ? Math.min.apply(Math, numValues) : min;                                // 1802
                                                                                                                       // 1803
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < min)) {
                min = options.get('chartRangeMin');                                                                    // 1805
            }                                                                                                          // 1806
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > max)) {
                max = options.get('chartRangeMax');                                                                    // 1808
            }                                                                                                          // 1809
                                                                                                                       // 1810
            this.zeroAxis = zeroAxis = options.get('zeroAxis', true);                                                  // 1811
            if (min <= 0 && max >= 0 && zeroAxis) {                                                                    // 1812
                xaxisOffset = 0;                                                                                       // 1813
            } else if (zeroAxis == false) {                                                                            // 1814
                xaxisOffset = min;                                                                                     // 1815
            } else if (min > 0) {                                                                                      // 1816
                xaxisOffset = min;                                                                                     // 1817
            } else {                                                                                                   // 1818
                xaxisOffset = max;                                                                                     // 1819
            }                                                                                                          // 1820
            this.xaxisOffset = xaxisOffset;                                                                            // 1821
                                                                                                                       // 1822
            range = stacked ? (Math.max.apply(Math, stackRanges) + Math.max.apply(Math, stackRangesNeg)) : max - min;  // 1823
                                                                                                                       // 1824
            // as we plot zero/min values a single pixel line, we add a pixel to all other                             // 1825
            // values - Reduce the effective canvas size to suit                                                       // 1826
            this.canvasHeightEf = (zeroAxis && min < 0) ? this.canvasHeight - 2 : this.canvasHeight - 1;               // 1827
                                                                                                                       // 1828
            if (min < xaxisOffset) {                                                                                   // 1829
                yMaxCalc = (stacked && max >= 0) ? stackMax : max;                                                     // 1830
                yoffset = (yMaxCalc - xaxisOffset) / range * this.canvasHeight;                                        // 1831
                if (yoffset !== Math.ceil(yoffset)) {                                                                  // 1832
                    this.canvasHeightEf -= 2;                                                                          // 1833
                    yoffset = Math.ceil(yoffset);                                                                      // 1834
                }                                                                                                      // 1835
            } else {                                                                                                   // 1836
                yoffset = this.canvasHeight;                                                                           // 1837
            }                                                                                                          // 1838
            this.yoffset = yoffset;                                                                                    // 1839
                                                                                                                       // 1840
            if ($.isArray(options.get('colorMap'))) {                                                                  // 1841
                this.colorMapByIndex = options.get('colorMap');                                                        // 1842
                this.colorMapByValue = null;                                                                           // 1843
            } else {                                                                                                   // 1844
                this.colorMapByIndex = null;                                                                           // 1845
                this.colorMapByValue = options.get('colorMap');                                                        // 1846
                if (this.colorMapByValue && this.colorMapByValue.get === undefined) {                                  // 1847
                    this.colorMapByValue = new RangeMap(this.colorMapByValue);                                         // 1848
                }                                                                                                      // 1849
            }                                                                                                          // 1850
                                                                                                                       // 1851
            this.range = range;                                                                                        // 1852
        },                                                                                                             // 1853
                                                                                                                       // 1854
        getRegion: function (el, x, y) {                                                                               // 1855
            var result = Math.floor(x / this.totalBarWidth);                                                           // 1856
            return (result < 0 || result >= this.values.length) ? undefined : result;                                  // 1857
        },                                                                                                             // 1858
                                                                                                                       // 1859
        getCurrentRegionFields: function () {                                                                          // 1860
            var currentRegion = this.currentRegion,                                                                    // 1861
                values = ensureArray(this.values[currentRegion]),                                                      // 1862
                result = [],                                                                                           // 1863
                value, i;                                                                                              // 1864
            for (i = values.length; i--;) {                                                                            // 1865
                value = values[i];                                                                                     // 1866
                result.push({                                                                                          // 1867
                    isNull: value === null,                                                                            // 1868
                    value: value,                                                                                      // 1869
                    color: this.calcColor(i, value, currentRegion),                                                    // 1870
                    offset: currentRegion                                                                              // 1871
                });                                                                                                    // 1872
            }                                                                                                          // 1873
            return result;                                                                                             // 1874
        },                                                                                                             // 1875
                                                                                                                       // 1876
        calcColor: function (stacknum, value, valuenum) {                                                              // 1877
            var colorMapByIndex = this.colorMapByIndex,                                                                // 1878
                colorMapByValue = this.colorMapByValue,                                                                // 1879
                options = this.options,                                                                                // 1880
                color, newColor;                                                                                       // 1881
            if (this.stacked) {                                                                                        // 1882
                color = options.get('stackedBarColor');                                                                // 1883
            } else {                                                                                                   // 1884
                color = (value < 0) ? options.get('negBarColor') : options.get('barColor');                            // 1885
            }                                                                                                          // 1886
            if (value === 0 && options.get('zeroColor') !== undefined) {                                               // 1887
                color = options.get('zeroColor');                                                                      // 1888
            }                                                                                                          // 1889
            if (colorMapByValue && (newColor = colorMapByValue.get(value))) {                                          // 1890
                color = newColor;                                                                                      // 1891
            } else if (colorMapByIndex && colorMapByIndex.length > valuenum) {                                         // 1892
                color = colorMapByIndex[valuenum];                                                                     // 1893
            }                                                                                                          // 1894
            return $.isArray(color) ? color[stacknum % color.length] : color;                                          // 1895
        },                                                                                                             // 1896
                                                                                                                       // 1897
        /**                                                                                                            // 1898
         * Render bar(s) for a region                                                                                  // 1899
         */                                                                                                            // 1900
        renderRegion: function (valuenum, highlight) {                                                                 // 1901
            var vals = this.values[valuenum],                                                                          // 1902
                options = this.options,                                                                                // 1903
                xaxisOffset = this.xaxisOffset,                                                                        // 1904
                result = [],                                                                                           // 1905
                range = this.range,                                                                                    // 1906
                stacked = this.stacked,                                                                                // 1907
                target = this.target,                                                                                  // 1908
                x = valuenum * this.totalBarWidth,                                                                     // 1909
                canvasHeightEf = this.canvasHeightEf,                                                                  // 1910
                yoffset = this.yoffset,                                                                                // 1911
                y, height, color, isNull, yoffsetNeg, i, valcount, val, minPlotted, allMin;                            // 1912
                                                                                                                       // 1913
            vals = $.isArray(vals) ? vals : [vals];                                                                    // 1914
            valcount = vals.length;                                                                                    // 1915
            val = vals[0];                                                                                             // 1916
            isNull = all(null, vals);                                                                                  // 1917
            allMin = all(xaxisOffset, vals, true);                                                                     // 1918
                                                                                                                       // 1919
            if (isNull) {                                                                                              // 1920
                if (options.get('nullColor')) {                                                                        // 1921
                    color = highlight ? options.get('nullColor') : this.calcHighlightColor(options.get('nullColor'), options);
                    y = (yoffset > 0) ? yoffset - 1 : yoffset;                                                         // 1923
                    return target.drawRect(x, y, this.barWidth - 1, 0, color, color);                                  // 1924
                } else {                                                                                               // 1925
                    return undefined;                                                                                  // 1926
                }                                                                                                      // 1927
            }                                                                                                          // 1928
            yoffsetNeg = yoffset;                                                                                      // 1929
            for (i = 0; i < valcount; i++) {                                                                           // 1930
                val = vals[i];                                                                                         // 1931
                                                                                                                       // 1932
                if (stacked && val === xaxisOffset) {                                                                  // 1933
                    if (!allMin || minPlotted) {                                                                       // 1934
                        continue;                                                                                      // 1935
                    }                                                                                                  // 1936
                    minPlotted = true;                                                                                 // 1937
                }                                                                                                      // 1938
                                                                                                                       // 1939
                if (range > 0) {                                                                                       // 1940
                    height = Math.floor(canvasHeightEf * ((Math.abs(val - xaxisOffset) / range))) + 1;                 // 1941
                } else {                                                                                               // 1942
                    height = 1;                                                                                        // 1943
                }                                                                                                      // 1944
                if (val < xaxisOffset || (val === xaxisOffset && yoffset === 0)) {                                     // 1945
                    y = yoffsetNeg;                                                                                    // 1946
                    yoffsetNeg += height;                                                                              // 1947
                } else {                                                                                               // 1948
                    y = yoffset - height;                                                                              // 1949
                    yoffset -= height;                                                                                 // 1950
                }                                                                                                      // 1951
                color = this.calcColor(i, val, valuenum);                                                              // 1952
                if (highlight) {                                                                                       // 1953
                    color = this.calcHighlightColor(color, options);                                                   // 1954
                }                                                                                                      // 1955
                result.push(target.drawRect(x, y, this.barWidth - 1, height - 1, color, color));                       // 1956
            }                                                                                                          // 1957
            if (result.length === 1) {                                                                                 // 1958
                return result[0];                                                                                      // 1959
            }                                                                                                          // 1960
            return result;                                                                                             // 1961
        }                                                                                                              // 1962
    });                                                                                                                // 1963
                                                                                                                       // 1964
    /**                                                                                                                // 1965
     * Tristate charts                                                                                                 // 1966
     */                                                                                                                // 1967
    $.fn.sparkline.tristate = tristate = createClass($.fn.sparkline._base, barHighlightMixin, {                        // 1968
        type: 'tristate',                                                                                              // 1969
                                                                                                                       // 1970
        init: function (el, values, options, width, height) {                                                          // 1971
            var barWidth = parseInt(options.get('barWidth'), 10),                                                      // 1972
                barSpacing = parseInt(options.get('barSpacing'), 10);                                                  // 1973
            tristate._super.init.call(this, el, values, options, width, height);                                       // 1974
                                                                                                                       // 1975
            this.regionShapes = {};                                                                                    // 1976
            this.barWidth = barWidth;                                                                                  // 1977
            this.barSpacing = barSpacing;                                                                              // 1978
            this.totalBarWidth = barWidth + barSpacing;                                                                // 1979
            this.values = $.map(values, Number);                                                                       // 1980
            this.width = width = (values.length * barWidth) + ((values.length - 1) * barSpacing);                      // 1981
                                                                                                                       // 1982
            if ($.isArray(options.get('colorMap'))) {                                                                  // 1983
                this.colorMapByIndex = options.get('colorMap');                                                        // 1984
                this.colorMapByValue = null;                                                                           // 1985
            } else {                                                                                                   // 1986
                this.colorMapByIndex = null;                                                                           // 1987
                this.colorMapByValue = options.get('colorMap');                                                        // 1988
                if (this.colorMapByValue && this.colorMapByValue.get === undefined) {                                  // 1989
                    this.colorMapByValue = new RangeMap(this.colorMapByValue);                                         // 1990
                }                                                                                                      // 1991
            }                                                                                                          // 1992
            this.initTarget();                                                                                         // 1993
        },                                                                                                             // 1994
                                                                                                                       // 1995
        getRegion: function (el, x, y) {                                                                               // 1996
            return Math.floor(x / this.totalBarWidth);                                                                 // 1997
        },                                                                                                             // 1998
                                                                                                                       // 1999
        getCurrentRegionFields: function () {                                                                          // 2000
            var currentRegion = this.currentRegion;                                                                    // 2001
            return {                                                                                                   // 2002
                isNull: this.values[currentRegion] === undefined,                                                      // 2003
                value: this.values[currentRegion],                                                                     // 2004
                color: this.calcColor(this.values[currentRegion], currentRegion),                                      // 2005
                offset: currentRegion                                                                                  // 2006
            };                                                                                                         // 2007
        },                                                                                                             // 2008
                                                                                                                       // 2009
        calcColor: function (value, valuenum) {                                                                        // 2010
            var values = this.values,                                                                                  // 2011
                options = this.options,                                                                                // 2012
                colorMapByIndex = this.colorMapByIndex,                                                                // 2013
                colorMapByValue = this.colorMapByValue,                                                                // 2014
                color, newColor;                                                                                       // 2015
                                                                                                                       // 2016
            if (colorMapByValue && (newColor = colorMapByValue.get(value))) {                                          // 2017
                color = newColor;                                                                                      // 2018
            } else if (colorMapByIndex && colorMapByIndex.length > valuenum) {                                         // 2019
                color = colorMapByIndex[valuenum];                                                                     // 2020
            } else if (values[valuenum] < 0) {                                                                         // 2021
                color = options.get('negBarColor');                                                                    // 2022
            } else if (values[valuenum] > 0) {                                                                         // 2023
                color = options.get('posBarColor');                                                                    // 2024
            } else {                                                                                                   // 2025
                color = options.get('zeroBarColor');                                                                   // 2026
            }                                                                                                          // 2027
            return color;                                                                                              // 2028
        },                                                                                                             // 2029
                                                                                                                       // 2030
        renderRegion: function (valuenum, highlight) {                                                                 // 2031
            var values = this.values,                                                                                  // 2032
                options = this.options,                                                                                // 2033
                target = this.target,                                                                                  // 2034
                canvasHeight, height, halfHeight,                                                                      // 2035
                x, y, color;                                                                                           // 2036
                                                                                                                       // 2037
            canvasHeight = target.pixelHeight;                                                                         // 2038
            halfHeight = Math.round(canvasHeight / 2);                                                                 // 2039
                                                                                                                       // 2040
            x = valuenum * this.totalBarWidth;                                                                         // 2041
            if (values[valuenum] < 0) {                                                                                // 2042
                y = halfHeight;                                                                                        // 2043
                height = halfHeight - 1;                                                                               // 2044
            } else if (values[valuenum] > 0) {                                                                         // 2045
                y = 0;                                                                                                 // 2046
                height = halfHeight - 1;                                                                               // 2047
            } else {                                                                                                   // 2048
                y = halfHeight - 1;                                                                                    // 2049
                height = 2;                                                                                            // 2050
            }                                                                                                          // 2051
            color = this.calcColor(values[valuenum], valuenum);                                                        // 2052
            if (color === null) {                                                                                      // 2053
                return;                                                                                                // 2054
            }                                                                                                          // 2055
            if (highlight) {                                                                                           // 2056
                color = this.calcHighlightColor(color, options);                                                       // 2057
            }                                                                                                          // 2058
            return target.drawRect(x, y, this.barWidth - 1, height - 1, color, color);                                 // 2059
        }                                                                                                              // 2060
    });                                                                                                                // 2061
                                                                                                                       // 2062
    /**                                                                                                                // 2063
     * Discrete charts                                                                                                 // 2064
     */                                                                                                                // 2065
    $.fn.sparkline.discrete = discrete = createClass($.fn.sparkline._base, barHighlightMixin, {                        // 2066
        type: 'discrete',                                                                                              // 2067
                                                                                                                       // 2068
        init: function (el, values, options, width, height) {                                                          // 2069
            discrete._super.init.call(this, el, values, options, width, height);                                       // 2070
                                                                                                                       // 2071
            this.regionShapes = {};                                                                                    // 2072
            this.values = values = $.map(values, Number);                                                              // 2073
            this.min = Math.min.apply(Math, values);                                                                   // 2074
            this.max = Math.max.apply(Math, values);                                                                   // 2075
            this.range = this.max - this.min;                                                                          // 2076
            this.width = width = options.get('width') === 'auto' ? values.length * 2 : this.width;                     // 2077
            this.interval = Math.floor(width / values.length);                                                         // 2078
            this.itemWidth = width / values.length;                                                                    // 2079
            if (options.get('chartRangeMin') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMin') < this.min)) {
                this.min = options.get('chartRangeMin');                                                               // 2081
            }                                                                                                          // 2082
            if (options.get('chartRangeMax') !== undefined && (options.get('chartRangeClip') || options.get('chartRangeMax') > this.max)) {
                this.max = options.get('chartRangeMax');                                                               // 2084
            }                                                                                                          // 2085
            this.initTarget();                                                                                         // 2086
            if (this.target) {                                                                                         // 2087
                this.lineHeight = options.get('lineHeight') === 'auto' ? Math.round(this.canvasHeight * 0.3) : options.get('lineHeight');
            }                                                                                                          // 2089
        },                                                                                                             // 2090
                                                                                                                       // 2091
        getRegion: function (el, x, y) {                                                                               // 2092
            return Math.floor(x / this.itemWidth);                                                                     // 2093
        },                                                                                                             // 2094
                                                                                                                       // 2095
        getCurrentRegionFields: function () {                                                                          // 2096
            var currentRegion = this.currentRegion;                                                                    // 2097
            return {                                                                                                   // 2098
                isNull: this.values[currentRegion] === undefined,                                                      // 2099
                value: this.values[currentRegion],                                                                     // 2100
                offset: currentRegion                                                                                  // 2101
            };                                                                                                         // 2102
        },                                                                                                             // 2103
                                                                                                                       // 2104
        renderRegion: function (valuenum, highlight) {                                                                 // 2105
            var values = this.values,                                                                                  // 2106
                options = this.options,                                                                                // 2107
                min = this.min,                                                                                        // 2108
                max = this.max,                                                                                        // 2109
                range = this.range,                                                                                    // 2110
                interval = this.interval,                                                                              // 2111
                target = this.target,                                                                                  // 2112
                canvasHeight = this.canvasHeight,                                                                      // 2113
                lineHeight = this.lineHeight,                                                                          // 2114
                pheight = canvasHeight - lineHeight,                                                                   // 2115
                ytop, val, color, x;                                                                                   // 2116
                                                                                                                       // 2117
            val = clipval(values[valuenum], min, max);                                                                 // 2118
            x = valuenum * interval;                                                                                   // 2119
            ytop = Math.round(pheight - pheight * ((val - min) / range));                                              // 2120
            color = (options.get('thresholdColor') && val < options.get('thresholdValue')) ? options.get('thresholdColor') : options.get('lineColor');
            if (highlight) {                                                                                           // 2122
                color = this.calcHighlightColor(color, options);                                                       // 2123
            }                                                                                                          // 2124
            return target.drawLine(x, ytop, x, ytop + lineHeight, color);                                              // 2125
        }                                                                                                              // 2126
    });                                                                                                                // 2127
                                                                                                                       // 2128
    /**                                                                                                                // 2129
     * Bullet charts                                                                                                   // 2130
     */                                                                                                                // 2131
    $.fn.sparkline.bullet = bullet = createClass($.fn.sparkline._base, {                                               // 2132
        type: 'bullet',                                                                                                // 2133
                                                                                                                       // 2134
        init: function (el, values, options, width, height) {                                                          // 2135
            var min, max, vals;                                                                                        // 2136
            bullet._super.init.call(this, el, values, options, width, height);                                         // 2137
                                                                                                                       // 2138
            // values: target, performance, range1, range2, range3                                                     // 2139
            this.values = values = normalizeValues(values);                                                            // 2140
            // target or performance could be null                                                                     // 2141
            vals = values.slice();                                                                                     // 2142
            vals[0] = vals[0] === null ? vals[2] : vals[0];                                                            // 2143
            vals[1] = values[1] === null ? vals[2] : vals[1];                                                          // 2144
            min = Math.min.apply(Math, values);                                                                        // 2145
            max = Math.max.apply(Math, values);                                                                        // 2146
            if (options.get('base') === undefined) {                                                                   // 2147
                min = min < 0 ? min : 0;                                                                               // 2148
            } else {                                                                                                   // 2149
                min = options.get('base');                                                                             // 2150
            }                                                                                                          // 2151
            this.min = min;                                                                                            // 2152
            this.max = max;                                                                                            // 2153
            this.range = max - min;                                                                                    // 2154
            this.shapes = {};                                                                                          // 2155
            this.valueShapes = {};                                                                                     // 2156
            this.regiondata = {};                                                                                      // 2157
            this.width = width = options.get('width') === 'auto' ? '4.0em' : width;                                    // 2158
            this.target = this.$el.simpledraw(width, height, options.get('composite'));                                // 2159
            if (!values.length) {                                                                                      // 2160
                this.disabled = true;                                                                                  // 2161
            }                                                                                                          // 2162
            this.initTarget();                                                                                         // 2163
        },                                                                                                             // 2164
                                                                                                                       // 2165
        getRegion: function (el, x, y) {                                                                               // 2166
            var shapeid = this.target.getShapeAt(el, x, y);                                                            // 2167
            return (shapeid !== undefined && this.shapes[shapeid] !== undefined) ? this.shapes[shapeid] : undefined;   // 2168
        },                                                                                                             // 2169
                                                                                                                       // 2170
        getCurrentRegionFields: function () {                                                                          // 2171
            var currentRegion = this.currentRegion;                                                                    // 2172
            return {                                                                                                   // 2173
                fieldkey: currentRegion.substr(0, 1),                                                                  // 2174
                value: this.values[currentRegion.substr(1)],                                                           // 2175
                region: currentRegion                                                                                  // 2176
            };                                                                                                         // 2177
        },                                                                                                             // 2178
                                                                                                                       // 2179
        changeHighlight: function (highlight) {                                                                        // 2180
            var currentRegion = this.currentRegion,                                                                    // 2181
                shapeid = this.valueShapes[currentRegion],                                                             // 2182
                shape;                                                                                                 // 2183
            delete this.shapes[shapeid];                                                                               // 2184
            switch (currentRegion.substr(0, 1)) {                                                                      // 2185
                case 'r':                                                                                              // 2186
                    shape = this.renderRange(currentRegion.substr(1), highlight);                                      // 2187
                    break;                                                                                             // 2188
                case 'p':                                                                                              // 2189
                    shape = this.renderPerformance(highlight);                                                         // 2190
                    break;                                                                                             // 2191
                case 't':                                                                                              // 2192
                    shape = this.renderTarget(highlight);                                                              // 2193
                    break;                                                                                             // 2194
            }                                                                                                          // 2195
            this.valueShapes[currentRegion] = shape.id;                                                                // 2196
            this.shapes[shape.id] = currentRegion;                                                                     // 2197
            this.target.replaceWithShape(shapeid, shape);                                                              // 2198
        },                                                                                                             // 2199
                                                                                                                       // 2200
        renderRange: function (rn, highlight) {                                                                        // 2201
            var rangeval = this.values[rn],                                                                            // 2202
                rangewidth = Math.round(this.canvasWidth * ((rangeval - this.min) / this.range)),                      // 2203
                color = this.options.get('rangeColors')[rn - 2];                                                       // 2204
            if (highlight) {                                                                                           // 2205
                color = this.calcHighlightColor(color, this.options);                                                  // 2206
            }                                                                                                          // 2207
            return this.target.drawRect(0, 0, rangewidth - 1, this.canvasHeight - 1, color, color);                    // 2208
        },                                                                                                             // 2209
                                                                                                                       // 2210
        renderPerformance: function (highlight) {                                                                      // 2211
            var perfval = this.values[1],                                                                              // 2212
                perfwidth = Math.round(this.canvasWidth * ((perfval - this.min) / this.range)),                        // 2213
                color = this.options.get('performanceColor');                                                          // 2214
            if (highlight) {                                                                                           // 2215
                color = this.calcHighlightColor(color, this.options);                                                  // 2216
            }                                                                                                          // 2217
            return this.target.drawRect(0, Math.round(this.canvasHeight * 0.3), perfwidth - 1,                         // 2218
                Math.round(this.canvasHeight * 0.4) - 1, color, color);                                                // 2219
        },                                                                                                             // 2220
                                                                                                                       // 2221
        renderTarget: function (highlight) {                                                                           // 2222
            var targetval = this.values[0],                                                                            // 2223
                x = Math.round(this.canvasWidth * ((targetval - this.min) / this.range) - (this.options.get('targetWidth') / 2)),
                targettop = Math.round(this.canvasHeight * 0.10),                                                      // 2225
                targetheight = this.canvasHeight - (targettop * 2),                                                    // 2226
                color = this.options.get('targetColor');                                                               // 2227
            if (highlight) {                                                                                           // 2228
                color = this.calcHighlightColor(color, this.options);                                                  // 2229
            }                                                                                                          // 2230
            return this.target.drawRect(x, targettop, this.options.get('targetWidth') - 1, targetheight - 1, color, color);
        },                                                                                                             // 2232
                                                                                                                       // 2233
        render: function () {                                                                                          // 2234
            var vlen = this.values.length,                                                                             // 2235
                target = this.target,                                                                                  // 2236
                i, shape;                                                                                              // 2237
            if (!bullet._super.render.call(this)) {                                                                    // 2238
                return;                                                                                                // 2239
            }                                                                                                          // 2240
            for (i = 2; i < vlen; i++) {                                                                               // 2241
                shape = this.renderRange(i).append();                                                                  // 2242
                this.shapes[shape.id] = 'r' + i;                                                                       // 2243
                this.valueShapes['r' + i] = shape.id;                                                                  // 2244
            }                                                                                                          // 2245
            if (this.values[1] !== null) {                                                                             // 2246
                shape = this.renderPerformance().append();                                                             // 2247
                this.shapes[shape.id] = 'p1';                                                                          // 2248
                this.valueShapes.p1 = shape.id;                                                                        // 2249
            }                                                                                                          // 2250
            if (this.values[0] !== null) {                                                                             // 2251
                shape = this.renderTarget().append();                                                                  // 2252
                this.shapes[shape.id] = 't0';                                                                          // 2253
                this.valueShapes.t0 = shape.id;                                                                        // 2254
            }                                                                                                          // 2255
            target.render();                                                                                           // 2256
        }                                                                                                              // 2257
    });                                                                                                                // 2258
                                                                                                                       // 2259
    /**                                                                                                                // 2260
     * Pie charts                                                                                                      // 2261
     */                                                                                                                // 2262
    $.fn.sparkline.pie = pie = createClass($.fn.sparkline._base, {                                                     // 2263
        type: 'pie',                                                                                                   // 2264
                                                                                                                       // 2265
        init: function (el, values, options, width, height) {                                                          // 2266
            var total = 0, i;                                                                                          // 2267
                                                                                                                       // 2268
            pie._super.init.call(this, el, values, options, width, height);                                            // 2269
                                                                                                                       // 2270
            this.shapes = {}; // map shape ids to value offsets                                                        // 2271
            this.valueShapes = {}; // maps value offsets to shape ids                                                  // 2272
            this.values = values = $.map(values, Number);                                                              // 2273
                                                                                                                       // 2274
            if (options.get('width') === 'auto') {                                                                     // 2275
                this.width = this.height;                                                                              // 2276
            }                                                                                                          // 2277
                                                                                                                       // 2278
            if (values.length > 0) {                                                                                   // 2279
                for (i = values.length; i--;) {                                                                        // 2280
                    total += values[i];                                                                                // 2281
                }                                                                                                      // 2282
            }                                                                                                          // 2283
            this.total = total;                                                                                        // 2284
            this.initTarget();                                                                                         // 2285
            this.radius = Math.floor(Math.min(this.canvasWidth, this.canvasHeight) / 2);                               // 2286
        },                                                                                                             // 2287
                                                                                                                       // 2288
        getRegion: function (el, x, y) {                                                                               // 2289
            var shapeid = this.target.getShapeAt(el, x, y);                                                            // 2290
            return (shapeid !== undefined && this.shapes[shapeid] !== undefined) ? this.shapes[shapeid] : undefined;   // 2291
        },                                                                                                             // 2292
                                                                                                                       // 2293
        getCurrentRegionFields: function () {                                                                          // 2294
            var currentRegion = this.currentRegion;                                                                    // 2295
            return {                                                                                                   // 2296
                isNull: this.values[currentRegion] === undefined,                                                      // 2297
                value: this.values[currentRegion],                                                                     // 2298
                percent: this.values[currentRegion] / this.total * 100,                                                // 2299
                color: this.options.get('sliceColors')[currentRegion % this.options.get('sliceColors').length],        // 2300
                offset: currentRegion                                                                                  // 2301
            };                                                                                                         // 2302
        },                                                                                                             // 2303
                                                                                                                       // 2304
        changeHighlight: function (highlight) {                                                                        // 2305
            var currentRegion = this.currentRegion,                                                                    // 2306
                 newslice = this.renderSlice(currentRegion, highlight),                                                // 2307
                 shapeid = this.valueShapes[currentRegion];                                                            // 2308
            delete this.shapes[shapeid];                                                                               // 2309
            this.target.replaceWithShape(shapeid, newslice);                                                           // 2310
            this.valueShapes[currentRegion] = newslice.id;                                                             // 2311
            this.shapes[newslice.id] = currentRegion;                                                                  // 2312
        },                                                                                                             // 2313
                                                                                                                       // 2314
        renderSlice: function (valuenum, highlight) {                                                                  // 2315
            var target = this.target,                                                                                  // 2316
                options = this.options,                                                                                // 2317
                radius = this.radius,                                                                                  // 2318
                borderWidth = options.get('borderWidth'),                                                              // 2319
                offset = options.get('offset'),                                                                        // 2320
                circle = 2 * Math.PI,                                                                                  // 2321
                values = this.values,                                                                                  // 2322
                total = this.total,                                                                                    // 2323
                next = offset ? (2*Math.PI)*(offset/360) : 0,                                                          // 2324
                start, end, i, vlen, color;                                                                            // 2325
                                                                                                                       // 2326
            vlen = values.length;                                                                                      // 2327
            for (i = 0; i < vlen; i++) {                                                                               // 2328
                start = next;                                                                                          // 2329
                end = next;                                                                                            // 2330
                if (total > 0) {  // avoid divide by zero                                                              // 2331
                    end = next + (circle * (values[i] / total));                                                       // 2332
                }                                                                                                      // 2333
                if (valuenum === i) {                                                                                  // 2334
                    color = options.get('sliceColors')[i % options.get('sliceColors').length];                         // 2335
                    if (highlight) {                                                                                   // 2336
                        color = this.calcHighlightColor(color, options);                                               // 2337
                    }                                                                                                  // 2338
                                                                                                                       // 2339
                    return target.drawPieSlice(radius, radius, radius - borderWidth, start, end, undefined, color);    // 2340
                }                                                                                                      // 2341
                next = end;                                                                                            // 2342
            }                                                                                                          // 2343
        },                                                                                                             // 2344
                                                                                                                       // 2345
        render: function () {                                                                                          // 2346
            var target = this.target,                                                                                  // 2347
                values = this.values,                                                                                  // 2348
                options = this.options,                                                                                // 2349
                radius = this.radius,                                                                                  // 2350
                borderWidth = options.get('borderWidth'),                                                              // 2351
                shape, i;                                                                                              // 2352
                                                                                                                       // 2353
            if (!pie._super.render.call(this)) {                                                                       // 2354
                return;                                                                                                // 2355
            }                                                                                                          // 2356
            if (borderWidth) {                                                                                         // 2357
                target.drawCircle(radius, radius, Math.floor(radius - (borderWidth / 2)),                              // 2358
                    options.get('borderColor'), undefined, borderWidth).append();                                      // 2359
            }                                                                                                          // 2360
            for (i = values.length; i--;) {                                                                            // 2361
                if (values[i]) { // don't render zero values                                                           // 2362
                    shape = this.renderSlice(i).append();                                                              // 2363
                    this.valueShapes[i] = shape.id; // store just the shapeid                                          // 2364
                    this.shapes[shape.id] = i;                                                                         // 2365
                }                                                                                                      // 2366
            }                                                                                                          // 2367
            target.render();                                                                                           // 2368
        }                                                                                                              // 2369
    });                                                                                                                // 2370
                                                                                                                       // 2371
    /**                                                                                                                // 2372
     * Box plots                                                                                                       // 2373
     */                                                                                                                // 2374
    $.fn.sparkline.box = box = createClass($.fn.sparkline._base, {                                                     // 2375
        type: 'box',                                                                                                   // 2376
                                                                                                                       // 2377
        init: function (el, values, options, width, height) {                                                          // 2378
            box._super.init.call(this, el, values, options, width, height);                                            // 2379
            this.values = $.map(values, Number);                                                                       // 2380
            this.width = options.get('width') === 'auto' ? '4.0em' : width;                                            // 2381
            this.initTarget();                                                                                         // 2382
            if (!this.values.length) {                                                                                 // 2383
                this.disabled = 1;                                                                                     // 2384
            }                                                                                                          // 2385
        },                                                                                                             // 2386
                                                                                                                       // 2387
        /**                                                                                                            // 2388
         * Simulate a single region                                                                                    // 2389
         */                                                                                                            // 2390
        getRegion: function () {                                                                                       // 2391
            return 1;                                                                                                  // 2392
        },                                                                                                             // 2393
                                                                                                                       // 2394
        getCurrentRegionFields: function () {                                                                          // 2395
            var result = [                                                                                             // 2396
                { field: 'lq', value: this.quartiles[0] },                                                             // 2397
                { field: 'med', value: this.quartiles[1] },                                                            // 2398
                { field: 'uq', value: this.quartiles[2] }                                                              // 2399
            ];                                                                                                         // 2400
            if (this.loutlier !== undefined) {                                                                         // 2401
                result.push({ field: 'lo', value: this.loutlier});                                                     // 2402
            }                                                                                                          // 2403
            if (this.routlier !== undefined) {                                                                         // 2404
                result.push({ field: 'ro', value: this.routlier});                                                     // 2405
            }                                                                                                          // 2406
            if (this.lwhisker !== undefined) {                                                                         // 2407
                result.push({ field: 'lw', value: this.lwhisker});                                                     // 2408
            }                                                                                                          // 2409
            if (this.rwhisker !== undefined) {                                                                         // 2410
                result.push({ field: 'rw', value: this.rwhisker});                                                     // 2411
            }                                                                                                          // 2412
            return result;                                                                                             // 2413
        },                                                                                                             // 2414
                                                                                                                       // 2415
        render: function () {                                                                                          // 2416
            var target = this.target,                                                                                  // 2417
                values = this.values,                                                                                  // 2418
                vlen = values.length,                                                                                  // 2419
                options = this.options,                                                                                // 2420
                canvasWidth = this.canvasWidth,                                                                        // 2421
                canvasHeight = this.canvasHeight,                                                                      // 2422
                minValue = options.get('chartRangeMin') === undefined ? Math.min.apply(Math, values) : options.get('chartRangeMin'),
                maxValue = options.get('chartRangeMax') === undefined ? Math.max.apply(Math, values) : options.get('chartRangeMax'),
                canvasLeft = 0,                                                                                        // 2425
                lwhisker, loutlier, iqr, q1, q2, q3, rwhisker, routlier, i,                                            // 2426
                size, unitSize;                                                                                        // 2427
                                                                                                                       // 2428
            if (!box._super.render.call(this)) {                                                                       // 2429
                return;                                                                                                // 2430
            }                                                                                                          // 2431
                                                                                                                       // 2432
            if (options.get('raw')) {                                                                                  // 2433
                if (options.get('showOutliers') && values.length > 5) {                                                // 2434
                    loutlier = values[0];                                                                              // 2435
                    lwhisker = values[1];                                                                              // 2436
                    q1 = values[2];                                                                                    // 2437
                    q2 = values[3];                                                                                    // 2438
                    q3 = values[4];                                                                                    // 2439
                    rwhisker = values[5];                                                                              // 2440
                    routlier = values[6];                                                                              // 2441
                } else {                                                                                               // 2442
                    lwhisker = values[0];                                                                              // 2443
                    q1 = values[1];                                                                                    // 2444
                    q2 = values[2];                                                                                    // 2445
                    q3 = values[3];                                                                                    // 2446
                    rwhisker = values[4];                                                                              // 2447
                }                                                                                                      // 2448
            } else {                                                                                                   // 2449
                values.sort(function (a, b) { return a - b; });                                                        // 2450
                q1 = quartile(values, 1);                                                                              // 2451
                q2 = quartile(values, 2);                                                                              // 2452
                q3 = quartile(values, 3);                                                                              // 2453
                iqr = q3 - q1;                                                                                         // 2454
                if (options.get('showOutliers')) {                                                                     // 2455
                    lwhisker = rwhisker = undefined;                                                                   // 2456
                    for (i = 0; i < vlen; i++) {                                                                       // 2457
                        if (lwhisker === undefined && values[i] > q1 - (iqr * options.get('outlierIQR'))) {            // 2458
                            lwhisker = values[i];                                                                      // 2459
                        }                                                                                              // 2460
                        if (values[i] < q3 + (iqr * options.get('outlierIQR'))) {                                      // 2461
                            rwhisker = values[i];                                                                      // 2462
                        }                                                                                              // 2463
                    }                                                                                                  // 2464
                    loutlier = values[0];                                                                              // 2465
                    routlier = values[vlen - 1];                                                                       // 2466
                } else {                                                                                               // 2467
                    lwhisker = values[0];                                                                              // 2468
                    rwhisker = values[vlen - 1];                                                                       // 2469
                }                                                                                                      // 2470
            }                                                                                                          // 2471
            this.quartiles = [q1, q2, q3];                                                                             // 2472
            this.lwhisker = lwhisker;                                                                                  // 2473
            this.rwhisker = rwhisker;                                                                                  // 2474
            this.loutlier = loutlier;                                                                                  // 2475
            this.routlier = routlier;                                                                                  // 2476
                                                                                                                       // 2477
            unitSize = canvasWidth / (maxValue - minValue + 1);                                                        // 2478
            if (options.get('showOutliers')) {                                                                         // 2479
                canvasLeft = Math.ceil(options.get('spotRadius'));                                                     // 2480
                canvasWidth -= 2 * Math.ceil(options.get('spotRadius'));                                               // 2481
                unitSize = canvasWidth / (maxValue - minValue + 1);                                                    // 2482
                if (loutlier < lwhisker) {                                                                             // 2483
                    target.drawCircle((loutlier - minValue) * unitSize + canvasLeft,                                   // 2484
                        canvasHeight / 2,                                                                              // 2485
                        options.get('spotRadius'),                                                                     // 2486
                        options.get('outlierLineColor'),                                                               // 2487
                        options.get('outlierFillColor')).append();                                                     // 2488
                }                                                                                                      // 2489
                if (routlier > rwhisker) {                                                                             // 2490
                    target.drawCircle((routlier - minValue) * unitSize + canvasLeft,                                   // 2491
                        canvasHeight / 2,                                                                              // 2492
                        options.get('spotRadius'),                                                                     // 2493
                        options.get('outlierLineColor'),                                                               // 2494
                        options.get('outlierFillColor')).append();                                                     // 2495
                }                                                                                                      // 2496
            }                                                                                                          // 2497
                                                                                                                       // 2498
            // box                                                                                                     // 2499
            target.drawRect(                                                                                           // 2500
                Math.round((q1 - minValue) * unitSize + canvasLeft),                                                   // 2501
                Math.round(canvasHeight * 0.1),                                                                        // 2502
                Math.round((q3 - q1) * unitSize),                                                                      // 2503
                Math.round(canvasHeight * 0.8),                                                                        // 2504
                options.get('boxLineColor'),                                                                           // 2505
                options.get('boxFillColor')).append();                                                                 // 2506
            // left whisker                                                                                            // 2507
            target.drawLine(                                                                                           // 2508
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),                                             // 2509
                Math.round(canvasHeight / 2),                                                                          // 2510
                Math.round((q1 - minValue) * unitSize + canvasLeft),                                                   // 2511
                Math.round(canvasHeight / 2),                                                                          // 2512
                options.get('lineColor')).append();                                                                    // 2513
            target.drawLine(                                                                                           // 2514
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),                                             // 2515
                Math.round(canvasHeight / 4),                                                                          // 2516
                Math.round((lwhisker - minValue) * unitSize + canvasLeft),                                             // 2517
                Math.round(canvasHeight - canvasHeight / 4),                                                           // 2518
                options.get('whiskerColor')).append();                                                                 // 2519
            // right whisker                                                                                           // 2520
            target.drawLine(Math.round((rwhisker - minValue) * unitSize + canvasLeft),                                 // 2521
                Math.round(canvasHeight / 2),                                                                          // 2522
                Math.round((q3 - minValue) * unitSize + canvasLeft),                                                   // 2523
                Math.round(canvasHeight / 2),                                                                          // 2524
                options.get('lineColor')).append();                                                                    // 2525
            target.drawLine(                                                                                           // 2526
                Math.round((rwhisker - minValue) * unitSize + canvasLeft),                                             // 2527
                Math.round(canvasHeight / 4),                                                                          // 2528
                Math.round((rwhisker - minValue) * unitSize + canvasLeft),                                             // 2529
                Math.round(canvasHeight - canvasHeight / 4),                                                           // 2530
                options.get('whiskerColor')).append();                                                                 // 2531
            // median line                                                                                             // 2532
            target.drawLine(                                                                                           // 2533
                Math.round((q2 - minValue) * unitSize + canvasLeft),                                                   // 2534
                Math.round(canvasHeight * 0.1),                                                                        // 2535
                Math.round((q2 - minValue) * unitSize + canvasLeft),                                                   // 2536
                Math.round(canvasHeight * 0.9),                                                                        // 2537
                options.get('medianColor')).append();                                                                  // 2538
            if (options.get('target')) {                                                                               // 2539
                size = Math.ceil(options.get('spotRadius'));                                                           // 2540
                target.drawLine(                                                                                       // 2541
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft),                            // 2542
                    Math.round((canvasHeight / 2) - size),                                                             // 2543
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft),                            // 2544
                    Math.round((canvasHeight / 2) + size),                                                             // 2545
                    options.get('targetColor')).append();                                                              // 2546
                target.drawLine(                                                                                       // 2547
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft - size),                     // 2548
                    Math.round(canvasHeight / 2),                                                                      // 2549
                    Math.round((options.get('target') - minValue) * unitSize + canvasLeft + size),                     // 2550
                    Math.round(canvasHeight / 2),                                                                      // 2551
                    options.get('targetColor')).append();                                                              // 2552
            }                                                                                                          // 2553
            target.render();                                                                                           // 2554
        }                                                                                                              // 2555
    });                                                                                                                // 2556
                                                                                                                       // 2557
    // Setup a very simple "virtual canvas" to make drawing the few shapes we need easier                              // 2558
    // This is accessible as $(foo).simpledraw()                                                                       // 2559
                                                                                                                       // 2560
    VShape = createClass({                                                                                             // 2561
        init: function (target, id, type, args) {                                                                      // 2562
            this.target = target;                                                                                      // 2563
            this.id = id;                                                                                              // 2564
            this.type = type;                                                                                          // 2565
            this.args = args;                                                                                          // 2566
        },                                                                                                             // 2567
        append: function () {                                                                                          // 2568
            this.target.appendShape(this);                                                                             // 2569
            return this;                                                                                               // 2570
        }                                                                                                              // 2571
    });                                                                                                                // 2572
                                                                                                                       // 2573
    VCanvas_base = createClass({                                                                                       // 2574
        _pxregex: /(\d+)(px)?\s*$/i,                                                                                   // 2575
                                                                                                                       // 2576
        init: function (width, height, target) {                                                                       // 2577
            if (!width) {                                                                                              // 2578
                return;                                                                                                // 2579
            }                                                                                                          // 2580
            this.width = width;                                                                                        // 2581
            this.height = height;                                                                                      // 2582
            this.target = target;                                                                                      // 2583
            this.lastShapeId = null;                                                                                   // 2584
            if (target[0]) {                                                                                           // 2585
                target = target[0];                                                                                    // 2586
            }                                                                                                          // 2587
            $.data(target, '_jqs_vcanvas', this);                                                                      // 2588
        },                                                                                                             // 2589
                                                                                                                       // 2590
        drawLine: function (x1, y1, x2, y2, lineColor, lineWidth) {                                                    // 2591
            return this.drawShape([[x1, y1], [x2, y2]], lineColor, lineWidth);                                         // 2592
        },                                                                                                             // 2593
                                                                                                                       // 2594
        drawShape: function (path, lineColor, fillColor, lineWidth) {                                                  // 2595
            return this._genShape('Shape', [path, lineColor, fillColor, lineWidth]);                                   // 2596
        },                                                                                                             // 2597
                                                                                                                       // 2598
        drawCircle: function (x, y, radius, lineColor, fillColor, lineWidth) {                                         // 2599
            return this._genShape('Circle', [x, y, radius, lineColor, fillColor, lineWidth]);                          // 2600
        },                                                                                                             // 2601
                                                                                                                       // 2602
        drawPieSlice: function (x, y, radius, startAngle, endAngle, lineColor, fillColor) {                            // 2603
            return this._genShape('PieSlice', [x, y, radius, startAngle, endAngle, lineColor, fillColor]);             // 2604
        },                                                                                                             // 2605
                                                                                                                       // 2606
        drawRect: function (x, y, width, height, lineColor, fillColor) {                                               // 2607
            return this._genShape('Rect', [x, y, width, height, lineColor, fillColor]);                                // 2608
        },                                                                                                             // 2609
                                                                                                                       // 2610
        getElement: function () {                                                                                      // 2611
            return this.canvas;                                                                                        // 2612
        },                                                                                                             // 2613
                                                                                                                       // 2614
        /**                                                                                                            // 2615
         * Return the most recently inserted shape id                                                                  // 2616
         */                                                                                                            // 2617
        getLastShapeId: function () {                                                                                  // 2618
            return this.lastShapeId;                                                                                   // 2619
        },                                                                                                             // 2620
                                                                                                                       // 2621
        /**                                                                                                            // 2622
         * Clear and reset the canvas                                                                                  // 2623
         */                                                                                                            // 2624
        reset: function () {                                                                                           // 2625
            alert('reset not implemented');                                                                            // 2626
        },                                                                                                             // 2627
                                                                                                                       // 2628
        _insert: function (el, target) {                                                                               // 2629
            $(target).html(el);                                                                                        // 2630
        },                                                                                                             // 2631
                                                                                                                       // 2632
        /**                                                                                                            // 2633
         * Calculate the pixel dimensions of the canvas                                                                // 2634
         */                                                                                                            // 2635
        _calculatePixelDims: function (width, height, canvas) {                                                        // 2636
            // XXX This should probably be a configurable option                                                       // 2637
            var match;                                                                                                 // 2638
            match = this._pxregex.exec(height);                                                                        // 2639
            if (match) {                                                                                               // 2640
                this.pixelHeight = match[1];                                                                           // 2641
            } else {                                                                                                   // 2642
                this.pixelHeight = $(canvas).height();                                                                 // 2643
            }                                                                                                          // 2644
            match = this._pxregex.exec(width);                                                                         // 2645
            if (match) {                                                                                               // 2646
                this.pixelWidth = match[1];                                                                            // 2647
            } else {                                                                                                   // 2648
                this.pixelWidth = $(canvas).width();                                                                   // 2649
            }                                                                                                          // 2650
        },                                                                                                             // 2651
                                                                                                                       // 2652
        /**                                                                                                            // 2653
         * Generate a shape object and id for later rendering                                                          // 2654
         */                                                                                                            // 2655
        _genShape: function (shapetype, shapeargs) {                                                                   // 2656
            var id = shapeCount++;                                                                                     // 2657
            shapeargs.unshift(id);                                                                                     // 2658
            return new VShape(this, id, shapetype, shapeargs);                                                         // 2659
        },                                                                                                             // 2660
                                                                                                                       // 2661
        /**                                                                                                            // 2662
         * Add a shape to the end of the render queue                                                                  // 2663
         */                                                                                                            // 2664
        appendShape: function (shape) {                                                                                // 2665
            alert('appendShape not implemented');                                                                      // 2666
        },                                                                                                             // 2667
                                                                                                                       // 2668
        /**                                                                                                            // 2669
         * Replace one shape with another                                                                              // 2670
         */                                                                                                            // 2671
        replaceWithShape: function (shapeid, shape) {                                                                  // 2672
            alert('replaceWithShape not implemented');                                                                 // 2673
        },                                                                                                             // 2674
                                                                                                                       // 2675
        /**                                                                                                            // 2676
         * Insert one shape after another in the render queue                                                          // 2677
         */                                                                                                            // 2678
        insertAfterShape: function (shapeid, shape) {                                                                  // 2679
            alert('insertAfterShape not implemented');                                                                 // 2680
        },                                                                                                             // 2681
                                                                                                                       // 2682
        /**                                                                                                            // 2683
         * Remove a shape from the queue                                                                               // 2684
         */                                                                                                            // 2685
        removeShapeId: function (shapeid) {                                                                            // 2686
            alert('removeShapeId not implemented');                                                                    // 2687
        },                                                                                                             // 2688
                                                                                                                       // 2689
        /**                                                                                                            // 2690
         * Find a shape at the specified x/y co-ordinates                                                              // 2691
         */                                                                                                            // 2692
        getShapeAt: function (el, x, y) {                                                                              // 2693
            alert('getShapeAt not implemented');                                                                       // 2694
        },                                                                                                             // 2695
                                                                                                                       // 2696
        /**                                                                                                            // 2697
         * Render all queued shapes onto the canvas                                                                    // 2698
         */                                                                                                            // 2699
        render: function () {                                                                                          // 2700
            alert('render not implemented');                                                                           // 2701
        }                                                                                                              // 2702
    });                                                                                                                // 2703
                                                                                                                       // 2704
    VCanvas_canvas = createClass(VCanvas_base, {                                                                       // 2705
        init: function (width, height, target, interact) {                                                             // 2706
            VCanvas_canvas._super.init.call(this, width, height, target);                                              // 2707
            this.canvas = document.createElement('canvas');                                                            // 2708
            if (target[0]) {                                                                                           // 2709
                target = target[0];                                                                                    // 2710
            }                                                                                                          // 2711
            $.data(target, '_jqs_vcanvas', this);                                                                      // 2712
            $(this.canvas).css({ display: 'inline-block', width: width, height: height, verticalAlign: 'top' });       // 2713
            this._insert(this.canvas, target);                                                                         // 2714
            this._calculatePixelDims(width, height, this.canvas);                                                      // 2715
            this.canvas.width = this.pixelWidth;                                                                       // 2716
            this.canvas.height = this.pixelHeight;                                                                     // 2717
            this.interact = interact;                                                                                  // 2718
            this.shapes = {};                                                                                          // 2719
            this.shapeseq = [];                                                                                        // 2720
            this.currentTargetShapeId = undefined;                                                                     // 2721
            $(this.canvas).css({width: this.pixelWidth, height: this.pixelHeight});                                    // 2722
        },                                                                                                             // 2723
                                                                                                                       // 2724
        _getContext: function (lineColor, fillColor, lineWidth) {                                                      // 2725
            var context = this.canvas.getContext('2d');                                                                // 2726
            if (lineColor !== undefined) {                                                                             // 2727
                context.strokeStyle = lineColor;                                                                       // 2728
            }                                                                                                          // 2729
            context.lineWidth = lineWidth === undefined ? 1 : lineWidth;                                               // 2730
            if (fillColor !== undefined) {                                                                             // 2731
                context.fillStyle = fillColor;                                                                         // 2732
            }                                                                                                          // 2733
            return context;                                                                                            // 2734
        },                                                                                                             // 2735
                                                                                                                       // 2736
        reset: function () {                                                                                           // 2737
            var context = this._getContext();                                                                          // 2738
            context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);                                                // 2739
            this.shapes = {};                                                                                          // 2740
            this.shapeseq = [];                                                                                        // 2741
            this.currentTargetShapeId = undefined;                                                                     // 2742
        },                                                                                                             // 2743
                                                                                                                       // 2744
        _drawShape: function (shapeid, path, lineColor, fillColor, lineWidth) {                                        // 2745
            var context = this._getContext(lineColor, fillColor, lineWidth),                                           // 2746
                i, plen;                                                                                               // 2747
            context.beginPath();                                                                                       // 2748
            context.moveTo(path[0][0] + 0.5, path[0][1] + 0.5);                                                        // 2749
            for (i = 1, plen = path.length; i < plen; i++) {                                                           // 2750
                context.lineTo(path[i][0] + 0.5, path[i][1] + 0.5); // the 0.5 offset gives us crisp pixel-width lines // 2751
            }                                                                                                          // 2752
            if (lineColor !== undefined) {                                                                             // 2753
                context.stroke();                                                                                      // 2754
            }                                                                                                          // 2755
            if (fillColor !== undefined) {                                                                             // 2756
                context.fill();                                                                                        // 2757
            }                                                                                                          // 2758
            if (this.targetX !== undefined && this.targetY !== undefined &&                                            // 2759
                context.isPointInPath(this.targetX, this.targetY)) {                                                   // 2760
                this.currentTargetShapeId = shapeid;                                                                   // 2761
            }                                                                                                          // 2762
        },                                                                                                             // 2763
                                                                                                                       // 2764
        _drawCircle: function (shapeid, x, y, radius, lineColor, fillColor, lineWidth) {                               // 2765
            var context = this._getContext(lineColor, fillColor, lineWidth);                                           // 2766
            context.beginPath();                                                                                       // 2767
            context.arc(x, y, radius, 0, 2 * Math.PI, false);                                                          // 2768
            if (this.targetX !== undefined && this.targetY !== undefined &&                                            // 2769
                context.isPointInPath(this.targetX, this.targetY)) {                                                   // 2770
                this.currentTargetShapeId = shapeid;                                                                   // 2771
            }                                                                                                          // 2772
            if (lineColor !== undefined) {                                                                             // 2773
                context.stroke();                                                                                      // 2774
            }                                                                                                          // 2775
            if (fillColor !== undefined) {                                                                             // 2776
                context.fill();                                                                                        // 2777
            }                                                                                                          // 2778
        },                                                                                                             // 2779
                                                                                                                       // 2780
        _drawPieSlice: function (shapeid, x, y, radius, startAngle, endAngle, lineColor, fillColor) {                  // 2781
            var context = this._getContext(lineColor, fillColor);                                                      // 2782
            context.beginPath();                                                                                       // 2783
            context.moveTo(x, y);                                                                                      // 2784
            context.arc(x, y, radius, startAngle, endAngle, false);                                                    // 2785
            context.lineTo(x, y);                                                                                      // 2786
            context.closePath();                                                                                       // 2787
            if (lineColor !== undefined) {                                                                             // 2788
                context.stroke();                                                                                      // 2789
            }                                                                                                          // 2790
            if (fillColor) {                                                                                           // 2791
                context.fill();                                                                                        // 2792
            }                                                                                                          // 2793
            if (this.targetX !== undefined && this.targetY !== undefined &&                                            // 2794
                context.isPointInPath(this.targetX, this.targetY)) {                                                   // 2795
                this.currentTargetShapeId = shapeid;                                                                   // 2796
            }                                                                                                          // 2797
        },                                                                                                             // 2798
                                                                                                                       // 2799
        _drawRect: function (shapeid, x, y, width, height, lineColor, fillColor) {                                     // 2800
            return this._drawShape(shapeid, [[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x, y]], lineColor, fillColor);
        },                                                                                                             // 2802
                                                                                                                       // 2803
        appendShape: function (shape) {                                                                                // 2804
            this.shapes[shape.id] = shape;                                                                             // 2805
            this.shapeseq.push(shape.id);                                                                              // 2806
            this.lastShapeId = shape.id;                                                                               // 2807
            return shape.id;                                                                                           // 2808
        },                                                                                                             // 2809
                                                                                                                       // 2810
        replaceWithShape: function (shapeid, shape) {                                                                  // 2811
            var shapeseq = this.shapeseq,                                                                              // 2812
                i;                                                                                                     // 2813
            this.shapes[shape.id] = shape;                                                                             // 2814
            for (i = shapeseq.length; i--;) {                                                                          // 2815
                if (shapeseq[i] == shapeid) {                                                                          // 2816
                    shapeseq[i] = shape.id;                                                                            // 2817
                }                                                                                                      // 2818
            }                                                                                                          // 2819
            delete this.shapes[shapeid];                                                                               // 2820
        },                                                                                                             // 2821
                                                                                                                       // 2822
        replaceWithShapes: function (shapeids, shapes) {                                                               // 2823
            var shapeseq = this.shapeseq,                                                                              // 2824
                shapemap = {},                                                                                         // 2825
                sid, i, first;                                                                                         // 2826
                                                                                                                       // 2827
            for (i = shapeids.length; i--;) {                                                                          // 2828
                shapemap[shapeids[i]] = true;                                                                          // 2829
            }                                                                                                          // 2830
            for (i = shapeseq.length; i--;) {                                                                          // 2831
                sid = shapeseq[i];                                                                                     // 2832
                if (shapemap[sid]) {                                                                                   // 2833
                    shapeseq.splice(i, 1);                                                                             // 2834
                    delete this.shapes[sid];                                                                           // 2835
                    first = i;                                                                                         // 2836
                }                                                                                                      // 2837
            }                                                                                                          // 2838
            for (i = shapes.length; i--;) {                                                                            // 2839
                shapeseq.splice(first, 0, shapes[i].id);                                                               // 2840
                this.shapes[shapes[i].id] = shapes[i];                                                                 // 2841
            }                                                                                                          // 2842
                                                                                                                       // 2843
        },                                                                                                             // 2844
                                                                                                                       // 2845
        insertAfterShape: function (shapeid, shape) {                                                                  // 2846
            var shapeseq = this.shapeseq,                                                                              // 2847
                i;                                                                                                     // 2848
            for (i = shapeseq.length; i--;) {                                                                          // 2849
                if (shapeseq[i] === shapeid) {                                                                         // 2850
                    shapeseq.splice(i + 1, 0, shape.id);                                                               // 2851
                    this.shapes[shape.id] = shape;                                                                     // 2852
                    return;                                                                                            // 2853
                }                                                                                                      // 2854
            }                                                                                                          // 2855
        },                                                                                                             // 2856
                                                                                                                       // 2857
        removeShapeId: function (shapeid) {                                                                            // 2858
            var shapeseq = this.shapeseq,                                                                              // 2859
                i;                                                                                                     // 2860
            for (i = shapeseq.length; i--;) {                                                                          // 2861
                if (shapeseq[i] === shapeid) {                                                                         // 2862
                    shapeseq.splice(i, 1);                                                                             // 2863
                    break;                                                                                             // 2864
                }                                                                                                      // 2865
            }                                                                                                          // 2866
            delete this.shapes[shapeid];                                                                               // 2867
        },                                                                                                             // 2868
                                                                                                                       // 2869
        getShapeAt: function (el, x, y) {                                                                              // 2870
            this.targetX = x;                                                                                          // 2871
            this.targetY = y;                                                                                          // 2872
            this.render();                                                                                             // 2873
            return this.currentTargetShapeId;                                                                          // 2874
        },                                                                                                             // 2875
                                                                                                                       // 2876
        render: function () {                                                                                          // 2877
            var shapeseq = this.shapeseq,                                                                              // 2878
                shapes = this.shapes,                                                                                  // 2879
                shapeCount = shapeseq.length,                                                                          // 2880
                context = this._getContext(),                                                                          // 2881
                shapeid, shape, i;                                                                                     // 2882
            context.clearRect(0, 0, this.pixelWidth, this.pixelHeight);                                                // 2883
            for (i = 0; i < shapeCount; i++) {                                                                         // 2884
                shapeid = shapeseq[i];                                                                                 // 2885
                shape = shapes[shapeid];                                                                               // 2886
                this['_draw' + shape.type].apply(this, shape.args);                                                    // 2887
            }                                                                                                          // 2888
            if (!this.interact) {                                                                                      // 2889
                // not interactive so no need to keep the shapes array                                                 // 2890
                this.shapes = {};                                                                                      // 2891
                this.shapeseq = [];                                                                                    // 2892
            }                                                                                                          // 2893
        }                                                                                                              // 2894
                                                                                                                       // 2895
    });                                                                                                                // 2896
                                                                                                                       // 2897
    VCanvas_vml = createClass(VCanvas_base, {                                                                          // 2898
        init: function (width, height, target) {                                                                       // 2899
            var groupel;                                                                                               // 2900
            VCanvas_vml._super.init.call(this, width, height, target);                                                 // 2901
            if (target[0]) {                                                                                           // 2902
                target = target[0];                                                                                    // 2903
            }                                                                                                          // 2904
            $.data(target, '_jqs_vcanvas', this);                                                                      // 2905
            this.canvas = document.createElement('span');                                                              // 2906
            $(this.canvas).css({ display: 'inline-block', position: 'relative', overflow: 'hidden', width: width, height: height, margin: '0px', padding: '0px', verticalAlign: 'top'});
            this._insert(this.canvas, target);                                                                         // 2908
            this._calculatePixelDims(width, height, this.canvas);                                                      // 2909
            this.canvas.width = this.pixelWidth;                                                                       // 2910
            this.canvas.height = this.pixelHeight;                                                                     // 2911
            groupel = '<v:group coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '"' +      // 2912
                    ' style="position:absolute;top:0;left:0;width:' + this.pixelWidth + 'px;height=' + this.pixelHeight + 'px;"></v:group>';
            this.canvas.insertAdjacentHTML('beforeEnd', groupel);                                                      // 2914
            this.group = $(this.canvas).children()[0];                                                                 // 2915
            this.rendered = false;                                                                                     // 2916
            this.prerender = '';                                                                                       // 2917
        },                                                                                                             // 2918
                                                                                                                       // 2919
        _drawShape: function (shapeid, path, lineColor, fillColor, lineWidth) {                                        // 2920
            var vpath = [],                                                                                            // 2921
                initial, stroke, fill, closed, vel, plen, i;                                                           // 2922
            for (i = 0, plen = path.length; i < plen; i++) {                                                           // 2923
                vpath[i] = '' + (path[i][0]) + ',' + (path[i][1]);                                                     // 2924
            }                                                                                                          // 2925
            initial = vpath.splice(0, 1);                                                                              // 2926
            lineWidth = lineWidth === undefined ? 1 : lineWidth;                                                       // 2927
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="' + lineWidth + 'px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';      // 2929
            closed = vpath[0] === vpath[vpath.length - 1] ? 'x ' : '';                                                 // 2930
            vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '" ' +         // 2931
                 ' id="jqsshape' + shapeid + '" ' +                                                                    // 2932
                 stroke +                                                                                              // 2933
                 fill +                                                                                                // 2934
                ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + 'px;width:' + this.pixelWidth + 'px;padding:0px;margin:0px;" ' +
                ' path="m ' + initial + ' l ' + vpath.join(', ') + ' ' + closed + 'e">' +                              // 2936
                ' </v:shape>';                                                                                         // 2937
            return vel;                                                                                                // 2938
        },                                                                                                             // 2939
                                                                                                                       // 2940
        _drawCircle: function (shapeid, x, y, radius, lineColor, fillColor, lineWidth) {                               // 2941
            var stroke, fill, vel;                                                                                     // 2942
            x -= radius;                                                                                               // 2943
            y -= radius;                                                                                               // 2944
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="' + lineWidth + 'px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';      // 2946
            vel = '<v:oval ' +                                                                                         // 2947
                 ' id="jqsshape' + shapeid + '" ' +                                                                    // 2948
                stroke +                                                                                               // 2949
                fill +                                                                                                 // 2950
                ' style="position:absolute;top:' + y + 'px; left:' + x + 'px; width:' + (radius * 2) + 'px; height:' + (radius * 2) + 'px"></v:oval>';
            return vel;                                                                                                // 2952
                                                                                                                       // 2953
        },                                                                                                             // 2954
                                                                                                                       // 2955
        _drawPieSlice: function (shapeid, x, y, radius, startAngle, endAngle, lineColor, fillColor) {                  // 2956
            var vpath, startx, starty, endx, endy, stroke, fill, vel;                                                  // 2957
            if (startAngle === endAngle) {                                                                             // 2958
                return '';  // VML seems to have problem when start angle equals end angle.                            // 2959
            }                                                                                                          // 2960
            if ((endAngle - startAngle) === (2 * Math.PI)) {                                                           // 2961
                startAngle = 0.0;  // VML seems to have a problem when drawing a full circle that doesn't start 0      // 2962
                endAngle = (2 * Math.PI);                                                                              // 2963
            }                                                                                                          // 2964
                                                                                                                       // 2965
            startx = x + Math.round(Math.cos(startAngle) * radius);                                                    // 2966
            starty = y + Math.round(Math.sin(startAngle) * radius);                                                    // 2967
            endx = x + Math.round(Math.cos(endAngle) * radius);                                                        // 2968
            endy = y + Math.round(Math.sin(endAngle) * radius);                                                        // 2969
                                                                                                                       // 2970
            if (startx === endx && starty === endy) {                                                                  // 2971
                if ((endAngle - startAngle) < Math.PI) {                                                               // 2972
                    // Prevent very small slices from being mistaken as a whole pie                                    // 2973
                    return '';                                                                                         // 2974
                }                                                                                                      // 2975
                // essentially going to be the entire circle, so ignore startAngle                                     // 2976
                startx = endx = x + radius;                                                                            // 2977
                starty = endy = y;                                                                                     // 2978
            }                                                                                                          // 2979
                                                                                                                       // 2980
            if (startx === endx && starty === endy && (endAngle - startAngle) < Math.PI) {                             // 2981
                return '';                                                                                             // 2982
            }                                                                                                          // 2983
                                                                                                                       // 2984
            vpath = [x - radius, y - radius, x + radius, y + radius, startx, starty, endx, endy];                      // 2985
            stroke = lineColor === undefined ? ' stroked="false" ' : ' strokeWeight="1px" strokeColor="' + lineColor + '" ';
            fill = fillColor === undefined ? ' filled="false"' : ' fillColor="' + fillColor + '" filled="true" ';      // 2987
            vel = '<v:shape coordorigin="0 0" coordsize="' + this.pixelWidth + ' ' + this.pixelHeight + '" ' +         // 2988
                 ' id="jqsshape' + shapeid + '" ' +                                                                    // 2989
                 stroke +                                                                                              // 2990
                 fill +                                                                                                // 2991
                ' style="position:absolute;left:0px;top:0px;height:' + this.pixelHeight + 'px;width:' + this.pixelWidth + 'px;padding:0px;margin:0px;" ' +
                ' path="m ' + x + ',' + y + ' wa ' + vpath.join(', ') + ' x e">' +                                     // 2993
                ' </v:shape>';                                                                                         // 2994
            return vel;                                                                                                // 2995
        },                                                                                                             // 2996
                                                                                                                       // 2997
        _drawRect: function (shapeid, x, y, width, height, lineColor, fillColor) {                                     // 2998
            return this._drawShape(shapeid, [[x, y], [x, y + height], [x + width, y + height], [x + width, y], [x, y]], lineColor, fillColor);
        },                                                                                                             // 3000
                                                                                                                       // 3001
        reset: function () {                                                                                           // 3002
            this.group.innerHTML = '';                                                                                 // 3003
        },                                                                                                             // 3004
                                                                                                                       // 3005
        appendShape: function (shape) {                                                                                // 3006
            var vel = this['_draw' + shape.type].apply(this, shape.args);                                              // 3007
            if (this.rendered) {                                                                                       // 3008
                this.group.insertAdjacentHTML('beforeEnd', vel);                                                       // 3009
            } else {                                                                                                   // 3010
                this.prerender += vel;                                                                                 // 3011
            }                                                                                                          // 3012
            this.lastShapeId = shape.id;                                                                               // 3013
            return shape.id;                                                                                           // 3014
        },                                                                                                             // 3015
                                                                                                                       // 3016
        replaceWithShape: function (shapeid, shape) {                                                                  // 3017
            var existing = $('#jqsshape' + shapeid),                                                                   // 3018
                vel = this['_draw' + shape.type].apply(this, shape.args);                                              // 3019
            existing[0].outerHTML = vel;                                                                               // 3020
        },                                                                                                             // 3021
                                                                                                                       // 3022
        replaceWithShapes: function (shapeids, shapes) {                                                               // 3023
            // replace the first shapeid with all the new shapes then toast the remaining old shapes                   // 3024
            var existing = $('#jqsshape' + shapeids[0]),                                                               // 3025
                replace = '',                                                                                          // 3026
                slen = shapes.length,                                                                                  // 3027
                i;                                                                                                     // 3028
            for (i = 0; i < slen; i++) {                                                                               // 3029
                replace += this['_draw' + shapes[i].type].apply(this, shapes[i].args);                                 // 3030
            }                                                                                                          // 3031
            existing[0].outerHTML = replace;                                                                           // 3032
            for (i = 1; i < shapeids.length; i++) {                                                                    // 3033
                $('#jqsshape' + shapeids[i]).remove();                                                                 // 3034
            }                                                                                                          // 3035
        },                                                                                                             // 3036
                                                                                                                       // 3037
        insertAfterShape: function (shapeid, shape) {                                                                  // 3038
            var existing = $('#jqsshape' + shapeid),                                                                   // 3039
                 vel = this['_draw' + shape.type].apply(this, shape.args);                                             // 3040
            existing[0].insertAdjacentHTML('afterEnd', vel);                                                           // 3041
        },                                                                                                             // 3042
                                                                                                                       // 3043
        removeShapeId: function (shapeid) {                                                                            // 3044
            var existing = $('#jqsshape' + shapeid);                                                                   // 3045
            this.group.removeChild(existing[0]);                                                                       // 3046
        },                                                                                                             // 3047
                                                                                                                       // 3048
        getShapeAt: function (el, x, y) {                                                                              // 3049
            var shapeid = el.id.substr(8);                                                                             // 3050
            return shapeid;                                                                                            // 3051
        },                                                                                                             // 3052
                                                                                                                       // 3053
        render: function () {                                                                                          // 3054
            if (!this.rendered) {                                                                                      // 3055
                // batch the intial render into a single repaint                                                       // 3056
                this.group.innerHTML = this.prerender;                                                                 // 3057
                this.rendered = true;                                                                                  // 3058
            }                                                                                                          // 3059
        }                                                                                                              // 3060
    });                                                                                                                // 3061
                                                                                                                       // 3062
}))}(document, Math));                                                                                                 // 3063
                                                                                                                       // 3064
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
