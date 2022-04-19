import Dropzone from 'dropzone';

export const prepareUpload = () => {
  const uploadUrl = 'change/me';

  document.addEventListener('dragover', function (e) {
    const dropzone = new Dropzone('div.zone', { url: uploadUrl });
  });
}
// export const prepareUpload = () => {
//   $(document).bind('dragover', function (e) {
//     let dropZone = $('.zone'),
//       timeout = window.dropZoneTimeout;
//     if (!timeout) {
//       dropZone.addClass('in');
//     } else {
//       clearTimeout(timeout);
//     }
//     let found = false,
//       node = e.target;
//     do {
//       if (node === dropZone[0]) {
//         found = true;
//         break;
//       }
//       node = node.parentNode;
//     } while (node != null);
//     if (found) {
//       dropZone.addClass('hover');
//     } else {
//       dropZone.removeClass('hover');
//     }
//     window.dropZoneTimeout = setTimeout(function () {
//       window.dropZoneTimeout = null;
//       dropZone.removeClass('in hover');
//     }, 100);
//   });
// }