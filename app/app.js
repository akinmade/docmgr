var app = angular.module('docApp',['ngRoute','ngSanitize']);

/*app.directive('myFooter', function(){
	return {
		restrict : 'E',
		templateUrl:'my-footer.html',
		controller: function(){
			cr:{
				name:'Akinmade Adebayo Luqman',
				tag:'copyright',
				year:2016
			},
			controllerAs : 'footers'					
		});
	}
}*/

app.controller('scanCtrl', function(){
	Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

	var DWObject;

	function Dynamsoft_OnReady() {
	    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	    if (DWObject) {
	        var count = DWObject.SourceCount;
	        for (var i = 0; i < count; i++)
	            document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i));
	    }
	};
	function AcquireImage() {
	    if (DWObject) {
	        DWObject.SelectSourceByIndex(document.getElementById("source").selectedIndex);
	        DWObject.OpenSource();
	        DWObject.IfDisableSourceAfterAcquire = true;
	        //Pixel type
	        if (document.getElementById("BW").checked)
	            DWObject.PixelType = EnumDWT_PixelType.TWPT_BW;
	        else if (document.getElementById("Gray").checked)
	            DWObject.PixelType = EnumDWT_PixelType.TWPT_GRAY;
	        else if (document.getElementById("RGB").checked)
	            DWObject.PixelType = EnumDWT_PixelType.TWPT_RGB;
	        //If auto feeder
	        if (document.getElementById("ADF").checked)
	            DWObject.IfFeederEnabled = true;
	        else
	            DWObject.IfFeederEnabled = false;
	        //If show UI
	        if (document.getElementById("ShowUI").checked)
	            DWObject.IfShowUI = true;
	        else
	            DWObject.IfShowUI = false;
	        //Resolution
	        DWObject.Resolution = parseInt(document.getElementById("Resolution").value);
	        
	        if(document.getElementById("ADF").checked && DWObject.IfFeederEnabled == true)  // if paper is NOT loaded on the feeder
	        {
	            if(DWObject.IfFeederLoaded != true && DWObject.ErrorCode == 0)
	            {
	                alert("No paper detected! Please load papers and try again!");
	                return;
	            }           
	        }
	                    
	        DWObject.AcquireImage();
	    }
	};
});

app.controller('thmbCtrl', function(){
	Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);
	var DWObject;
	function Dynamsoft_OnReady() {
	    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	    if (DWObject) {
	        DWObjectLargeViewer = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainerLargeViewer'); // Get the 2nd Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainerLargeViewer'

	        DWObjectLargeViewer.SetViewMode(-1, -1); // When the view mode is set to -1 by -1, the control only shows the current image. No scroll bar is provided to navigate to other images.
	        DWObjectLargeViewer.MaxImagesInBuffer = 1; // Set it to hold one image only
	        DWObject.SetViewMode(1, 3); // Set the view mode to 1 by 3. In this view mode, when the number of the images in the buffer is larger than 3 (1 x 3), a scroll bar is provide to navigate to other images.
	                
	        var count = DWObject.SourceCount; // Get how many sources are installed in the system
	        for (var i = 0; i < count; i++){
	            document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i)); // Add the sources in a drop-down list
	        }

	        // Register the events
	        DWObject.RegisterEvent("OnPostTransfer", Dynamsoft_OnPostTransfer);
	        DWObject.RegisterEvent("OnPostLoad", Dynamsoft_OnPostLoad);
	        DWObject.RegisterEvent("OnMouseClick", Dynamsoft_OnMouseClick);
	    }
	}

	// All the following would happen after the scan operation or load operation has been done an update to the largerview is initiated either when the user clicks on the document, scans or loads
	function Dynamsoft_OnMouseClick() { // The event OnMouseClick will get fired when the mouse clicks on an image.
	    updateLargeViewer();
	}
	function updateLargeViewer() {
	    DWObject.CopyToClipboard(DWObject.CurrentImageIndexInBuffer); // Copy the current image in the thumbnail to clipboard in DIB format.
	    DWObjectLargeViewer.LoadDibFromClipboard(); // Load the image from Clipboard into the large viewer.
	}

});

app.controller('saveCtrl', function(){
	Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used
    var DWObject;
    function Dynamsoft_OnReady() {
        DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
        if (DWObject) {
            DWObject.RegisterEvent('OnPostAllTransfers', SaveWithFileDialog);
        }
    }

	function SaveWithFileDialog() {
	    if (DWObject) {
            if (DWObject.HowManyImagesInBuffer > 0) {
                DWObject.IfShowFileDialog = true;
                if (document.getElementById("imgTypejpeg").checked == true) {
                    //If the current image is B&W
                    //1 is B&W, 8 is Gray, 24 is RGB
                    if (DWObject.GetImageBitDepth(DWObject.CurrentImageIndexInBuffer) == 1)
                        //If so, convert the image to Gray
                        DWObject.ConvertToGrayScale(DWObject.CurrentImageIndexInBuffer);
                    //Save image in JPEG
                    DWObject.SaveAsJPEG("DynamicWebTWAIN.jpg", DWObject.CurrentImageIndexInBuffer);
                }
                else if (document.getElementById("imgTypetiff").checked == true)
                    DWObject.SaveAllAsMultiPageTIFF("DynamicWebTWAIN.tiff", OnSuccess, OnFailure);
                else if (document.getElementById("imgTypepdf").checked == true)
                    DWObject.SaveAllAsPDF("DynamicWebTWAIN.pdf", OnSuccess, OnFailure);
            }
        }
    }
});

app.controller('imgEditCtrl', function(){
	function ShowImageEditor() {
	    if (DWObject) {
	        if (DWObject.HowManyImagesInBuffer == 0)
	            alert("There is no image in buffer.");
	        else
	            DWObject.ShowImageEditor();
	    }
	}
});


app.controller('navCtrl' function(){
	Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

	var DWObject;

	function Dynamsoft_OnReady() {
	    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
	    if (DWObject) {
	        var count = DWObject.SourceCount; // Get how many sources are installed in the system
	        for (var i = 0; i < count; i++)
	            document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i)); // Add the sources in a drop-down list

	        // The event OnPostTransfer fires after each image is scanned and transferred
	        DWObject.RegisterEvent("OnPostTransfer", function () {
	            updatePageInfo();
	        });

	        // The event OnPostLoad fires after the images from a local directory have been loaded into the control
	        DWObject.RegisterEvent("OnPostLoad", function () {
	            updatePageInfo();
	        });

	        // The event OnMouseClick fires when the mouse clicks on an image on Dynamic Web TWAIN viewer
	        DWObject.RegisterEvent("OnMouseClick", function () {
	            updatePageInfo();
	        });

	        // The event OnTopImageInTheViewChanged fires when the top image currently displayed in the viewer changes
	        DWObject.RegisterEvent("OnTopImageInTheViewChanged", function (index) {
	            DWObject.CurrentImageIndexInBuffer = index;
	            updatePageInfo();
	        });
	    }
	}
	function btnPreImage_onclick() {
	    if (DWObject) {
	        if (DWObject.HowManyImagesInBuffer > 0) {
	            DWObject.CurrentImageIndexInBuffer = DWObject.CurrentImageIndexInBuffer - 1;
	            updatePageInfo();
	        }
	    }
	}

	function btnNextImage_onclick() {
	    if (DWObject) {
	        if (DWObject.HowManyImagesInBuffer > 0) {
	            DWObject.CurrentImageIndexInBuffer = DWObject.CurrentImageIndexInBuffer + 1;
	            updatePageInfo();
	        }
	    }
	}

	function btnFirstImage_onclick() {
	    if (DWObject) {
	        if (DWObject.HowManyImagesInBuffer != 0 && DWObject.CurrentImageIndexInBuffer != 0) {
	            DWObject.CurrentImageIndexInBuffer = 0;
	            updatePageInfo();
	        }
	    }
	}

	function btnLastImage_onclick() {
	    if (DWObject) {
	        if (DWObject.HowManyImagesInBuffer > 0) {
	            DWObject.CurrentImageIndexInBuffer = DWObject.HowManyImagesInBuffer - 1;
	            updatePageInfo();
	        }
	    }
	}
	function setlPreviewMode() {
	    if (DWObject) {
	        var o = parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1);
	        DWObject.SetViewMode(o, o);
	    }
	}

	function btnRemoveSelectedImages_onclick() {
	    if (DWObject) {
	        DWObject.RemoveAllSelectedImages();
	        if (DWObject.HowManyImagesInBuffer == 0) {
	            document.getElementById("DW_CurrentImage").value = "0";
	            document.getElementById("DW_TotalImage").value = "0";
	        }
	        else {
	            updatePageInfo();
	        }
	    }
	}

	function btnRemoveAllImages_onclick() {
	    if (DWObject) {
	        DWObject.RemoveAllImages();
	        document.getElementById("DW_TotalImage").value = "0";
	        document.getElementById("DW_CurrentImage").value = "0";
	    }
	}
});

app.controller('loadCtrl', function(){
	function LoadImage() {
	    if (DWObject) {
	        DWObject.IfShowFileDialog = true; // Open the system's file dialog to load image
	        DWObject.LoadImageEx("", EnumDWT_ImageType.IT_ALL, OnSuccess, OnFailure); // Load images in all supported formats (.bmp, .jpg, .tif, .png, .pdf). OnSuccess or OnFailure will be called after the operation
	    }
	}
})
