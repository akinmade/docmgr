/* Basic scan code
Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

var DWObject;

function Dynamsoft_OnReady() {
    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
    }

//ScanCtrl as the ScanController to create first

function AcquireImage() {
    if (DWObject) {
        DWObject.SelectSource();
        DWObject.OpenSource();
        DWObject.IfDisableSourceAfterAcquire = true;	// Scanner source will be disabled/closed automatically after the scan.
        DWObject.AcquireImage();
    }
}

        //Callback functions for async APIs
function OnSuccess() {
    console.log('successful');
}

function OnFailure(errorCode, errorString) {
    alert(errorString);
}
*/

// Advanced scan options and codes here

/* Scanning documents using different options like b/w, grayscale, colored and scan settings
<label for="BW">
        <input type="radio" id="BW" name="PixelType">B&amp;W </label>
    <label for="Gray">
        <input type="radio" id="Gray" name="PixelType">Gray</label>
    <label for="RGB">
        <input type="radio" id="RGB" name="PixelType" checked="checked">Color</label>
    |

    <label>
        <input type="checkbox" id="ADF" checked="checked">Auto Feeder</label>
    <label>
        <input type="checkbox" id="ShowUI" checked="checked">Show UI<br />
    </label>

    <select size="1" id="Resolution">
        <option value="100">100</option>
        <option value="150">150</option>
        <option value="200">200</option>
        <option value="300">300</option>
    </select>
    <select size="1" id="source" style="position: relative; width: 220px;"></select>

    <input type="button" value="Scan" onclick="AcquireImage();" />

    <div id="dwtcontrolContainer"></div>
*/

//The main scan controller body below
Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

var DWObject;

function Dynamsoft_OnReady() {
    DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
    if (DWObject) {
        var count = DWObject.SourceCount;
        for (var i = 0; i < count; i++)
            document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i));
    }
}
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
}