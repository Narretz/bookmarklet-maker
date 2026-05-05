      const iifeStart = "(function(){";

      const iifeEnd = "})();";

     async function cleanCode(code, options){
       const trimmed = code.trim();
       const result = await Terser.minify(trimmed, {
         compress: options.compress,
         mangle: options.mangle,
         format: { comments: options.removeComments ? false : 'all' }
       });
       return result.code;
     }

     function showError(id, message) {
       var box = document.getElementById(id);
       box.textContent = message;
       box.classList.add('error-box--visible');
     }

     function clearError(id) {
       var box = document.getElementById(id);
       box.textContent = '';
       box.classList.remove('error-box--visible');
     }

     async function generateBookmarklet (){
       var title = document.getElementById("title-input").value ;
       var code  = document.getElementById("code-textarea").value;
       var link  = document.getElementById("bookmarklet-a");
       var codeOutput = document.getElementById("output-textarea");
       var htmlOutput  = document.getElementById("htmlOutput-textarea");

       clearError('generate-error');

       if (!code) {
        link.classList.remove('bookmarklet--generated');

       codeOutput.value = '';
       htmlOutput.value = '';

        return;
       }

       try {
         var cleaned = await cleanCode(code, {
           removeComments: document.getElementById("opt-remove-comments").checked,
           compress: document.getElementById("opt-compress").checked,
           mangle: document.getElementById("opt-mangle").checked,
         });
         var output = "javascript:" +  encodeURIComponent(iifeStart + cleaned + iifeEnd);

         link.text = title;
         link.href = output;

         link.classList.add('bookmarklet--generated');

         codeOutput.value = output;

         htmlOutput.value = "<a href=\"" + output + "\">" + title + "</a>"
       } catch (err) {
         showError('generate-error', err.message || String(err));
       }
     }

     async function formatCode (){
       var textarea = document.getElementById("code-textarea");
       clearError('format-error');
       try {
         var formatted = await prettier.format(textarea.value, {
           parser: "babel",
           plugins: prettierPlugins
         });
         textarea.value = formatted;
       } catch (err) {
         showError('format-error', err.message || String(err));
       }
     }

     function runCode (){
       var code  = document.getElementById("code-textarea").value;
       eval(code);
     }

     function initFromBookmarklet() {
       var textarea = document.getElementById("code-textarea");

       var encoded  = textarea.value;

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

       textarea.value = decoded;
     }

     function clearCode(){
       document.getElementById("title-input").value = "bookmarklet";
       document.getElementById("code-textarea").value = "";

       clearError('format-error');
       clearError('generate-error');
     }