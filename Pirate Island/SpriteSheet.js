
var gSpriteSheets = {}; // dicionario global de spritesheets

SpriteSheet = Class.extend(function () {

		var assetsLoaded = 0;
		this.img = null;
		this.url = "";
		this.sprites = new Array();

		var notify;

		//-----------------------------------------

		this.constructor = function () {};

		//-----------------------------------------


		var assetLoaded = function (resourceName) {
			assetsLoaded++;
			if (assetsLoaded === 2) {
				gSpriteSheets[this.url] = this;
				notify();
			}
		}.bind(this);


		this.load = function (spriteSheetImage, spriteSheetJSON, callback) {

			var ajax = new AJAX();

			notify = callback;

			this.url = spriteSheetImage;

			var img = new Image();

			img.onload = function () {
				this.img = img;
				assetLoaded("imagem");
			}
			.bind(this);

			img.src = spriteSheetImage;


			ajax.request(spriteSheetJSON, "GET", "application/json;charset=UTF-8", true,
				function (xhr) {
				this.parseSpriteSheetDefinition(xhr.responseText)
			}.bind(this));
		}


		this.defSprite = function (name, x, y, w, h, cx, cy) {
			var spt = {
				"id": name,
				"x": x,
				"y": y,
				"width": w,
				"height": h,
				"cx": cx == null ? 0 : cx,
				"cy": cy == null ? 0 : cy
			};

			this.sprites.push(spt);
		}

		this.parseSpriteSheetDefinition = function (atlasJSON) {

			var atlas = JSON.parse(atlasJSON);

			for (var key in atlas['frames']) {
				var x = atlas['frames'][key].frame.x;
				var y = atlas['frames'][key].frame.y;
				var w = atlas['frames'][key].frame.w;
				var h = atlas['frames'][key].frame.h;
				var cx = -Math.round(w / 2);
				var cy = -Math.round(h / 2);
				this.defSprite(key, x, y, w, h, cx, cy);
			}
			assetLoaded("json");
		}


		this.getStats = function (name) {
			var statsFrames = new Array();

			for (var i = 0; i < this.sprites.length; i++) {
				var stName = new RegExp(name, "gi");
				if (this.sprites[i].id.match(stName)) {
					statsFrames.push(this.sprites[i]);
				}

			}
			return statsFrames;
		}
	});
