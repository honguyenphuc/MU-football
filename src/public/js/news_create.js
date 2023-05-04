var editorData = document.querySelector("#editor");
var formData = document.querySelector("#news-create");
formData.addEventListener("change", () => {
  editorData.value = editor.getData();
});
