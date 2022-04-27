import Swal from "sweetalert2";

export async function handleUploadFile(file) {
  Swal.showLoading();

  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/googledrive", {
    method: "POST",
    body: form
  })
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.log(error.message);
      return 'error';
    });
  // close loading
  Swal.close();

  if (response !== 'error') {
    return `![alt](${response?.message?.image_url})`;
  }
  else {
    return '[ERRO NO UPLOAD]';
  }
}
