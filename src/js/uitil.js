export function getObjectURL(file) {
    console.log('file', window.URL)
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = (ev) => {
    //     const url = ev.target.result;
    //     console.log('urlurlurl', url);
    // }
    let url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    }
    console.log('urlurlurl', url)
    return url;
}
