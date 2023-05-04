var editorData = document.querySelector("#editor");
var formData = document.querySelector("#news-edit");
formData.addEventListener("change", () => {
  editorData.value = editor.getData();
});
