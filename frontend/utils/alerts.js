import Swal from "sweetalert2";

export async function successMessage(title, text, time) {
    await Swal.fire({
        title: title,
        text: text,
        icon: "success",
        timer: time,
        showConfirmButton: false,
        timerProgressBar: true
    });
}

export async function shortSuccessMessage(title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    await Toast.fire({
        icon: 'success',
        title: title
    })
}

export async function erroMessage(title, text) {
    await Swal.fire({
        title: title,
        text: text,
        icon: "error",
        showConfirmButton: false,
        showCloseButton: true,
    });
}

export async function confirmMessage(title, text) {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    });
    return result.isConfirmed;
}