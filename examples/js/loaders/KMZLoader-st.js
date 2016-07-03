define(["jszip-utils",
  "jszip"], function (JSZipUtils, JSZip) {

THREE.KMZLoader = function() {
  var options = {};
  var zip = null;

  function load ( url, readyCallback, progressCallback ) {
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if(err) {
        throw err; // or handle err
      }

      var zip = new JSZip(data);
      if (!zip.name) {
        zip.name = url;
      }
      var colladaFile = null;
      for (var filename in zip.files) {
        if (filename.endsWith(".dae")) {
          colladaFile = filename;
          break;
        }
      }

      if (colladaFile) {
        var loader = new THREE.ZippedColladaLoader(zip);
        for (var n in options) {
          loader.options[n] = options[n];
        }
        loader.load(colladaFile, readyCallback);
      } else {
        console.error("Cannot find .dae file in zip: " + url);
      }
    });
  }

  return {
    load: load,
    options: options
  }
};

THREE.ZippedColladaLoader = function (zip) {
  var colladaLoader = THREE.ColladaLoader();
  var images = {};

  colladaLoader.options.loadTextureCallbackFunc = function loadTexture(basePath, relPath) {
    var path = getPath(basePath, relPath);
    var img = images[path];
    if (!img) {
      var imgfile = zip.file(path);
      if (imgfile) {
        var imageData = imgfile.asBinary();
        // Base64 encode
        var imageDataEncoded = btoa(imageData);
        img = new Image();
        // Let the file extension be the image type
        var extIndex = relPath.lastIndexOf(".");
        var imageType = (extIndex >= 0) ? relPath.substring(extIndex + 1) : "jpg";
        img.src = "data:image/" + imageType + ";base64," + imageDataEncoded;
        // TODO: Refactor THREE.MTLLoader.ensurePowerOfTwo_ to utilities
        img = THREE.MTLLoader.ensurePowerOfTwo_(img);
        images[path] = img;
        //document.getElementById("main").appendChild(img);
      } else {
        console.error('Error getting image ' + path + ' from ' + zip.name);
      }
    }
    var texture = new THREE.Texture();
    texture.image = img;
    texture.needsUpdate = true;
    // texture.sourceFile = url;
    return texture;
  };

  function load ( url, readyCallback, progressCallback ) {
    var text = zip.file(url).asText();
    var xmlParser = new DOMParser();
    var responseXML = xmlParser.parseFromString( text, "application/xml" );
    colladaLoader.parse( responseXML, readyCallback, url );
  }

  colladaLoader.load = load;

  return colladaLoader;
};

});
