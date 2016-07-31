/* Remember to create the htmlstructure like the one below to acommodate the containers for both the thumbnail view and the proper view
<select size="1" id="source" style="position: relative; width: 220px;"></select>
    <input type="button" value="Scan" onclick="AcquireImage();" />
    <input type="button" value="Load" onclick="LoadImage();" />


<div style="display: block; position:absolute;">
        <div id="dwtcontrolContainer" style="float: left; width: 120px; height: 350px; position:relative;"></div>
        <div id="dwtcontrolContainerLargeViewer" style="float: left; width: 270px; height: 350px; position:relative;"></div>
    </div>
*/

//Now the controller code goes below for the thumbnail

Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

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

