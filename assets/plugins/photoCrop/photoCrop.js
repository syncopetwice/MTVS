/*
*This lib is helpful with uploading images to salesfore.
*
*@author Dmitry Sklipus
*/

function photoUpload(options) {
	// imgId, previewImgId,  uploadToChatterWidth  previewSize
	var croppedX = 0;
	var croppedY = 0;
	var croppedSize = 0;

	loadedImageObj = {
		Img : new Image(),
		width : 0,
		height: 0
	};
	canvasObj = {
		canva : document.createElement("canvas"),
		getScaleWidth : function () {
			return this.canva.width/loadedImageObj.width;
		}
	};
	this.getCroppedX = function() {
		return Math.round(croppedX*loadedImageObj.width/$(options.imgId).width()*canvasObj.getScaleWidth());
	};
	this.getCroppedY = function() {
		return Math.round(croppedY*loadedImageObj.width/$(options.imgId).width()*canvasObj.getScaleWidth());
	};
	this.getCroppedSize = function() {
		return Math.round(croppedSize*loadedImageObj.width/$(options.imgId).width()*canvasObj.getScaleWidth());
	};
	this.getImageToUpload = function() {
		if (typeof(canvasObj.canva) != "undefined") {
			return canvasObj.canva.toDataURL("image/png").substr(22);
		}
		return null;
	};
	this.getImageTypeToUpload = function() {
		return 'image/png';
	};
	this.uploadFile = function(elm) {
		var JcropAPI =jQuery(options.imgId).data('Jcrop');
		if (typeof JcropAPI !== 'undefined') {
			JcropAPI.destroy();
		};
		if (elm.files && elm.files[0]) {
			if (elm.files[0].type.indexOf('image/') !== 0 || elm.files[0].size > 8388608) {
				return "File is too big";
			}
			else {
				//read file
				var reader = new FileReader();
				reader.onload = readImageFinished;
				reader.readAsDataURL(elm.files[0]);
			}
		}
	};
	showPreview = function (coordinates) {
		croppedX = coordinates.x;
		croppedY = coordinates.y;
		croppedSize = coordinates.w;
		jQuery(options.previewImgId).css({
			width: Math.round( (options.previewSize / coordinates.w) *jQuery(options.imgId).width()) + 'px',
			height: Math.round( (options.previewSize / coordinates.h) *jQuery(options.imgId).height()) + 'px',
			marginLeft: '-' + Math.round(options.previewSize / coordinates.w * coordinates.x) + 'px',
			marginTop: '-' + Math.round(options.previewSize / coordinates.h * coordinates.y) + 'px'
		});
	};
	readImageFinished = function (e) {
		loadedImageObj.Img.onload = function() {
			console.log('loadedImage.onload');
			var wi = jQuery(options.imgId).attr("width");
			var hi = jQuery(options.imgId).attr("height");
			jQuery(options.imgId).removeAttr("width").removeAttr("height").css({ width: "auto" , height: "auto" });
			jQuery(options.previewImgId).show();
			// get real image size
			loadedImageObj.width = this.width;
			loadedImageObj.height = this.height;
			jQuery(options.imgId).css({ width: wi , height: hi });
			// draw canvas
			canvasObj.canva.width = options.uploadToChatterWidth;
			canvasObj.canva.height = options.uploadToChatterWidth*loadedImageObj.height/loadedImageObj.width;
			var ctx = canvasObj.canva.getContext("2d");
			ctx.drawImage(this, 0, 0, canvasObj.canva.width, canvasObj.canva.height);
			// set previev image
			jQuery(options.imgId).attr('src', this.src);
			var imgWidth =jQuery(options.imgId).width();
			var imgHeight =jQuery(options.imgId).height();
			var rectSide = (imgWidth >= imgHeight)?imgHeight/3:imgWidth/3;
			jQuery(options.imgId).Jcrop({
				onChange: showPreview,
				onSelect: showPreview, aspectRatio:1,
				setSelect:[ imgWidth/2-rectSide, imgHeight/2-rectSide, imgWidth/2+rectSide, imgHeight/2+rectSide],
				setOptions : {allowMove: true}
			});
			jQuery(options.previewImgId).attr('src', this.src);
		};
		loadedImageObj.Img.src = e.target.result;
	};
}
