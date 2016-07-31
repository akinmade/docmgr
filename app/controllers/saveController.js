// The original save controller here
// The html structure for the input statements
/*<input type="button" value="Scan and Save" onclick="AcquireImage();" />
    <input type="button" value="Load" onclick="LoadImage();" />
    <input type="button" value="Save" onclick="SaveWithFileDialog();" />
    <br />
    <label><input type="radio" value="jpg" name="ImageType" id="imgTypejpeg" />JPEG</label>
    <label><input type="radio" value="tif" name="ImageType" id="imgTypetiff" />TIFF</label>
    <label><input type="radio" value="pdf" name="ImageType" id="imgTypepdf" checked="checked" />PDF</label>

    <!-- dwtcontrolContainer is the default div id for Dynamic Web TWAIN control.
     If you need to rename the id, you should also change the id in dynamsoft.webtwain.config.js accordingly. -->
    <div id="dwtcontrolContainer"></div>*/

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
                    else if (document.getElementById("imgTypepdf").checked == true){
                        DWObject.SaveAllAsPDF("DynamicWebTWAIN.pdf", OnSuccess, OnFailure);
                    }
                }
            }
        }


