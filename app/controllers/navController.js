/* The html structure for the navigation controller
<select size="1" id="source" style="position: relative; width: 220px;"></select>
<div style="width: 460px; display: block;">

        <!-- dwtcontrolContainer is the default div id for Dynamic Web TWAIN control.
        If you need to rename the id, you should also change the id in the dynamsoft.webtwain.config.js accordingly. -->
        <div id="dwtcontrolContainer"></div>

        <div>
            <input onclick="btnFirstImage_onclick()" type="button" value=" |< " />
            <input onclick="btnPreImage_onclick()" type="button" value=" < " />
            <input type="text" size="2" id="DW_CurrentImage" readonly="readonly" value="0" />
            /
            <input type="text" size="2" id="DW_TotalImage" readonly="readonly" value="0" />
            <input onclick="btnNextImage_onclick()" type="button" value=" > " />
            <input onclick="btnLastImage_onclick()" type="button" value=" >| " />
            Preview Mode:
            <select size="1" id="DW_PreviewMode" onchange="setlPreviewMode();">
                <option value="0">1X1</option>
                <option value="1">2X2</option>
                <option value="2">3X3</option>
                <option value="3">4X4</option>
                <option value="4">5X5</option>
            </select>
        </div>
    </div>

    <input onclick="btnRemoveSelectedImages_onclick()" type="button" value="Remove Selected Images" />
    <input onclick="btnRemoveAllImages_onclick()" type="button" value="Remove All Images" />

*/
// The controller for the navigation code goes here now
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



