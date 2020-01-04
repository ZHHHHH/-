define(["dojo/_base/declare",
        "esri/layers/tiled"],
    function  (declare)  {
        return  declare(esri.layers.TiledMapServiceLayer,  {
            constructor:  function  (url, layer, style, tileMatrixSet, format)  {
                this._url = url;
                this._layer = layer;
                this._style = style;
                this._tileMatrixSet = tileMatrixSet;
                this._format = format;
                this.spatialReference = new esri.SpatialReference({ wkid: 4490 });
                this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0,   this.spatialReference));
                this.tileInfo = new esri.layers.TileInfo({
                    "rows":  256,
                    "cols":  256,
                    "compressionQuality": 0,
                    "origin": {
                        "x": -180,
                        "y": 90
                    },
                    "spatialReference": {
                        "wkid": 4490
                    },
                    "lods": [
                        { "level": 7,   "resolution": 0.010986322605,   "scale": 4622331.356343952  },
                        { "level": 8,   "resolution": 0.005493161302,   "scale": 2311165.678171976  },
                        { "level": 9,   "resolution": 0.002746580651,   "scale": 1155582.839085988  },
                        { "level": 10,  "resolution": 0.001373290326,   "scale": 577791.419542994   },
                        { "level": 11,  "resolution": 0.000686645163,   "scale": 288895.709771497   },
                        { "level": 12,  "resolution": 0.000343322581,   "scale": 144447.8548857485  },
                        { "level": 13,  "resolution": 0.000171661291,   "scale": 72223.92744287425  },
                        { "level": 14,  "resolution": 0.000085830645,   "scale": 36111.963721437125 },
                        { "level": 15,  "resolution": 0.000042915323,   "scale": 18055.981860718563 },
                        { "level": 16,  "resolution": 0.000021457661,   "scale": 9027.990930359281  },
                        { "level": 17,  "resolution": 0.000010728831,   "scale": 4513.995465179641  },
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl:  function  (level,  row,  col)  {
                return this._url + '?tk=d7b3a4e34e8ef6c777e3c9b24a3ae77f&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + this._layer + '&STYLE=' + this._style + '&TILEMATRIXSET=' + this._tileMatrixSet + '&TILEMATRIX=' + level + '&TILEROW=' + row + "&TILECOL=" + col + "&FORMAT=" + this._format;
            }
        });
    });  