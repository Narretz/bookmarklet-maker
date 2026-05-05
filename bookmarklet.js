      const iifeStart = "(function(){";

      const iifeEnd = "})();";

     function cleanCode(code){
       return code.trim()
     }
     
     function generateBookmarklet (){
       var title = document.getElementById("title-input").value ;
       var code  = document.getElementById("code-textarea").value;
       var link  = document.getElementById("bookmarklet-a");
       var codeOutput = document.getElementById("output-textarea");
       var htmlOutput  = document.getElementById("htmlOutput-textarea");

       if (!code) {
        link.classList.remove('bookmarklet--generated');
       codeOutput.value = '';
       htmlOutput.value = '';

        return;
       }

       var output = "javascript:" +  encodeURIComponent(iifeStart + cleanCode(code) + iifeEnd);
       
       link.text = title;
       link.href = output;

       link.classList.add('bookmarklet--generated');

       codeOutput.value = output;

       htmlOutput.value = "<a href=\"" + output + "\">" + title + "</a>"
       
     }

     function runCode (){
       var code  = document.getElementById("code-textarea").value;
       eval(code);
     }

     function initFromBookmarklet() {
       var encoded  = document.getElementById("code-textarea").value;

       let decoded = decodeURIComponent(encoded.trim());

       if (decoded.startsWith('javascript:')) {
        decoded = decoded.slice(11);
       }

       const iifeStartIdx = decoded.indexOf(iifeStart);
       const iifeEndIdx = decoded.indexOf(iifeEnd);

       if (iifeStartIdx > -1) {
        decoded = decoded.slice(iifeStart.length);
       }

       if (iifeEndIdx > -1) {
        decoded = decoded.slice(0, decoded.length - iifeEnd.length);
       }

       document.getElementById("code-textarea").value = decoded;
     }

     function clearCode(){
       document.getElementById("title-input").value = "bookmarklet";
       document.getElementById("code-textarea").value = "";       
     }