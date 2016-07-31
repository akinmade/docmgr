/* The html structure for the Image Editor
 <input type="button" value="Scan" onclick="AcquireImage();" />
     <input type="button" value="Load" onclick="LoadImage();" />
     <input type="button" value="Show Image Editor" onload="ShowImageEditor();" />

     <!-- dwtcontrolContainer is the default div id for Dynamic Web TWAIN control.
      If you need to rename the id, you should also change the id in dynamsoft.webtwain.config.js accordingly. -->
     <div id="dwtcontrolContainer"></div>

*/
function ShowImageEditor() {
    if (DWObject) {
        if (DWObject.HowManyImagesInBuffer == 0)
            alert("There is no image in buffer.");
        else
            DWObject.ShowImageEditor();
    }
}
